import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { techToast } from "@/components/ui/tech";
import { GoogleGenAI } from "@google/genai";
import { driveService } from "../services/driveService";
import { FileItem } from "../types";

const sortFilesByType = (files: FileItem[]) => {
  return [...files].sort((a, b) => {
    const isAFolder = a.mimeType === "application/vnd.google-apps.folder";
    const isBFolder = b.mimeType === "application/vnd.google-apps.folder";
    if (isAFolder && !isBFolder) return -1;
    if (!isAFolder && isBFolder) return 1;
    return 0;
  });
};

export function useDriveQuery() {
  const queryClient = useQueryClient();

  // Navigation state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState("");
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [isAISearch, setIsAISearch] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // UI state
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<FileItem[]>([]);

  // Query: Drive info
  const driveInfoQuery = useQuery({
    queryKey: ["driveInfo"],
    queryFn: driveService.getDriveInfo,
  });

  // Query: Files
  const filesQuery = useQuery({
    queryKey: ["files", currentFolderId],
    queryFn: () => driveService.getFiles(currentFolderId),
  });

  // Combine real files with uploading files
  const files = [...(filesQuery.data || []), ...uploadingFiles].sort((a, b) => {
    const isAFolder = a.mimeType === "application/vnd.google-apps.folder";
    const isBFolder = b.mimeType === "application/vnd.google-apps.folder";
    if (isAFolder && !isBFolder) return -1;
    if (!isAFolder && isBFolder) return 1;
    return 0;
  });

  // Mutation: Create folder
  const createFolderMutation = useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: string | null }) =>
      driveService.createFolder(name, parentId),
    onSuccess: async (data) => {
      if (data.error) {
        techToast.error("Lỗi khi tạo thư mục");
        return;
      }
      setIsCreateFolderModalOpen(false);
      setNewFolderName("");
      
      // Navigate to new folder
      if (currentFolderId) {
        setFolderHistory([...folderHistory, currentFolderId]);
        setFolderPath([...folderPath, { id: currentFolderId, name: currentFolderName }]);
      }
      setCurrentFolderId(data.id);
      setCurrentFolderName(newFolderName);
      
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: () => techToast.error("Lỗi khi tạo thư mục"),
  });

  // Mutation: Delete file
  const deleteFileMutation = useMutation({
    mutationFn: driveService.deleteFile,
    onSuccess: () => {
      setDeletingFileId(null);
      techToast.success("File đã bị xóa vĩnh viễn!");
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: () => {
      techToast.error("Có lỗi xảy ra khi xóa file");
      setDeletingFileId(null);
    },
  });

  // Mutation: Reload cache
  const reloadCacheMutation = useMutation({
    mutationFn: driveService.reloadCache,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["driveInfo"] });
      techToast.success("Đã reload cache thành công!");
    },
    onError: () => techToast.error("Có lỗi xảy ra khi reload cache"),
  });

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFolderClick = (folderId: string, folderName?: string) => {
    if (currentFolderId) {
      setFolderHistory([...folderHistory, currentFolderId]);
      setFolderPath([...folderPath, { id: currentFolderId, name: currentFolderName }]);
    } else {
      setFolderHistory([]);
      setFolderPath([]);
    }
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName || "");
  };

  const handleBackClick = () => {
    if (folderHistory.length > 0) {
      const newHistory = [...folderHistory];
      const previousFolderId = newHistory.pop();
      const newPath = [...folderPath];
      const previousFolder = newPath.pop();

      setFolderHistory(newHistory);
      setFolderPath(newPath);
      setCurrentFolderId(previousFolderId || null);
      setCurrentFolderName(previousFolder?.name || "");
    } else {
      setCurrentFolderId(null);
      setCurrentFolderName("");
      setFolderPath([]);
      setFolderHistory([]);
    }
  };

  const handleCreateFolder = () => setIsCreateFolderModalOpen(true);

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolderMutation.mutate({ name: newFolderName, parentId: currentFolderId });
  };


  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files;
    if (!inputFiles) return;

    const tempFiles: FileItem[] = [];

    Array.from(inputFiles).forEach((file) => {
      const tempFile: FileItem = {
        id: `temp-${Date.now()}-${file.name}`,
        name: file.name,
        mimeType: file.type,
        size: file.size,
        createdTime: new Date().toISOString(),
        isUploading: true,
        uploadProgress: 0,
      };
      tempFiles.push(tempFile);
    });

    setUploadingFiles(tempFiles);

    try {
      await Promise.all(
        Array.from(inputFiles).map((file, index) =>
          driveService.uploadFile(file, currentFolderId, (progress) => {
            setUploadingFiles((prev) =>
              prev.map((f, i) => (i === index ? { ...f, uploadProgress: progress } : f))
            );
          })
        )
      );

      setTimeout(() => {
        setUploadingFiles([]);
        queryClient.invalidateQueries({ queryKey: ["files", currentFolderId] });
      }, 2500);
    } catch (error) {
      console.error("Lỗi khi upload files:", error);
      setUploadingFiles([]);
      techToast.error("Có lỗi xảy ra khi tải lên file");
    }

    event.target.value = "";
  };

  const handleUploadFolder = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files;
    if (!inputFiles) return;

    const rootFolderName = inputFiles[0].webkitRelativePath.split("/")[0];
    const tempFolder: FileItem = {
      id: `temp-folder-${Date.now()}`,
      name: rootFolderName,
      mimeType: "application/vnd.google-apps.folder",
      size: Array.from(inputFiles).reduce((total, file) => total + file.size, 0),
      createdTime: new Date().toISOString(),
      isUploading: true,
      uploadProgress: 0,
    };

    setUploadingFiles([tempFolder]);

    try {
      const totalSize = Array.from(inputFiles).reduce((total, file) => total + file.size, 0);
      let uploadedSize = 0;
      const folderMap = new Map<string, string>();

      // Create root folder
      const rootFolderData = await driveService.createFolder(rootFolderName, currentFolderId);
      folderMap.set(rootFolderName, rootFolderData.id);

      for (const file of Array.from(inputFiles)) {
        const pathParts = file.webkitRelativePath.split("/");
        let currentParentId = rootFolderData.id;

        for (let i = 1; i < pathParts.length - 1; i++) {
          const folderPathStr = pathParts.slice(0, i + 1).join("/");
          if (!folderMap.has(folderPathStr)) {
            const folderData = await driveService.createFolder(pathParts[i], currentParentId);
            folderMap.set(folderPathStr, folderData.id);
            currentParentId = folderData.id;
          } else {
            currentParentId = folderMap.get(folderPathStr)!;
          }
        }

        const fileName = file.name.split("/").pop() || file.name;
        const fileBlob = new Blob([file], { type: file.type });
        const cleanFile = new File([fileBlob], fileName, { type: file.type });
        await driveService.uploadFile(cleanFile, currentParentId);

        uploadedSize += file.size;
        const progress = Math.round((uploadedSize / totalSize) * 100);
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === tempFolder.id ? { ...f, uploadProgress: progress } : f))
        );
      }

      setTimeout(() => {
        setUploadingFiles([]);
        queryClient.invalidateQueries({ queryKey: ["files", currentFolderId] });
      }, 2500);
    } catch (error) {
      console.error("Lỗi:", error);
      setUploadingFiles([]);
      techToast.error("Có lỗi xảy ra khi tải lên thư mục");
    }

    event.target.value = "";
  };

  const checkFolderContent = useCallback(
    async (folderId: string) => {
      const cachedFiles = queryClient.getQueryData<FileItem[]>(["files", folderId]);
      if (cachedFiles) {
        return cachedFiles.some((file) => file.mimeType === "application/vnd.google-apps.folder");
      }
      try {
        const files = await driveService.getFiles(folderId);
        return files.some((file) => file.mimeType === "application/vnd.google-apps.folder");
      } catch {
        return false;
      }
    },
    [queryClient]
  );

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const downloadUrl = await driveService.getDownloadUrl(fileId);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      techToast.error("Không thể tải file");
    }
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      queryClient.invalidateQueries({ queryKey: ["files", currentFolderId] });
      return;
    }

    try {
      if (isAISearch) {
        setCurrentFolderId(null);
        setCurrentFolderName("");
        setFolderPath([]);
        setFolderHistory([]);

        const apiKey = await driveService.getAISearchKey();
        const allFiles = await driveService.getAllFiles();
        const simpleFiles = allFiles.map((file) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
        }));

        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
          Bạn là AI assistant giúp tìm kiếm file và thư mục. Với yêu cầu tìm kiếm: "${term}"
          Hãy phân tích danh sách và trả về mảng chứa ID của các file/thư mục phù hợp.
          Lưu ý:
          - Thư mục có mimeType là "application/vnd.google-apps.folder"
          - Tìm kiếm dựa trên tên và loại (file/thư mục)
          - Chỉ trả về mảng JSON chứa các ID, không kèm giải thích
          Danh sách files cần tìm:
          ${JSON.stringify(simpleFiles, null, 2)}
        `;

        const response = await ai.models.generateContent({
          model: "models/gemini-flash-lite-latest",
          contents: prompt,
          config: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        });

        const fileIds = JSON.parse(response.text ?? "[]");
        const filteredFiles = allFiles.filter((file) => fileIds.includes(file.id));
        queryClient.setQueryData(["files", null], sortFilesByType(filteredFiles));
      } else {
        setCurrentFolderId(null);
        setCurrentFolderName("");
        setFolderPath([]);
        setFolderHistory([]);
        const searchResults = await driveService.searchFiles(term);
        queryClient.setQueryData(["files", null], searchResults);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    if (!value.trim()) {
      setCurrentFolderId(null);
      setCurrentFolderName("");
      setFolderPath([]);
      setFolderHistory([]);
      queryClient.invalidateQueries({ queryKey: ["files", null] });
      return;
    }

    if (!isAISearch) {
      const timeout = setTimeout(() => handleSearch(value), 500);
      setSearchTimeout(timeout);
    }
  };

  const handleSearchClick = () => handleSearch(searchTerm);

  const handleBreadcrumbClick = (folderId: string, index: number) => {
    const newPath = folderPath.slice(0, index);
    const newHistory = folderHistory.slice(0, index);
    setFolderPath(newPath);
    setFolderHistory(newHistory);
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderPath[index]?.name || "");
  };

  const handleToggleAISearch = () => setIsAISearch(!isAISearch);

  // Bắt đầu delete: set state + gọi API ngay lập tức
  const startDeleteEffect = (fileId: string) => {
    setDeletingFileId(fileId);
    // Gọi API delete ngay khi bắt đầu animation
    deleteFileMutation.mutate(fileId);
  };

  // Callback khi animation xong - không cần làm gì vì API đã được gọi rồi
  const handleDeleteComplete = useCallback(() => {
    // Animation xong, card sẽ tự ẩn qua FileDeleteEffect
    // Nếu API lỗi, onError sẽ clear deletingFileId để hiện lại card
  }, []);

  const handleDelete = (fileId: string) => deleteFileMutation.mutate(fileId);

  const handleReloadCache = () => reloadCacheMutation.mutate();

  return {
    files,
    setFiles: () => {}, // No-op, managed by query
    isLoading: filesQuery.isLoading,
    isSidebarLoading: driveInfoQuery.isLoading,
    setIsLoading: () => {},
    driveInfo: driveInfoQuery.data || null,
    setDriveInfo: () => {},
    currentFolderId,
    setCurrentFolderId,
    folderHistory,
    setFolderHistory,
    searchTerm,
    setSearchTerm,
    searchTimeout,
    setSearchTimeout,
    currentFolderName,
    setCurrentFolderName,
    folderPath,
    setFolderPath,
    isAISearch,
    setIsAISearch,
    formatBytes,
    handleFolderClick,
    handleBackClick,
    handleSearch,
    handleSearchChange,
    handleSearchClick,
    handleBreadcrumbClick,
    handleToggleAISearch,
    handleDelete,
    startDeleteEffect,
    handleDeleteComplete,
    deletingFileId,
    handleCreateFolder,
    handleCreateFolderSubmit,
    handleUploadFile,
    handleUploadFolder,
    checkFolderContent,
    handleDownload,
    isCreatingFolder: createFolderMutation.isPending,
    setIsCreatingFolder: () => {},
    isCreateFolderModalOpen,
    setIsCreateFolderModalOpen,
    newFolderName,
    setNewFolderName,
    handleReloadCache,
    isReloading: reloadCacheMutation.isPending,
  };
}
