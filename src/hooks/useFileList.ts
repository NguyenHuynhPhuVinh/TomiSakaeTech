import { useState, useRef, useEffect, useMemo } from "react";
import { FileItem, FileListProps } from "../types";
import { driveService } from "../services/driveService";
import JSZip from "jszip";
import { techToast } from "@/components/ui/tech";

function formatFileSize(bytes: number): string {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex === -1 ? "" : fileName.substring(lastDotIndex + 1);
}

export enum SortCriteria {
  Default = "default",
  Name = "name",
  Size = "size",
  Date = "date",
}

export const useFileList = ({
  files,
  isLoading,
  currentFolderId,
  currentFolderName,
  folderPath = [],
  onFolderClick,
  onBreadcrumbClick,
  onBackClick,
  onDownload,
  onUploadFile,
  onUploadFolder,
  onCheckFolderContent,
  onDelete,
}: FileListProps) => {
  const regularFiles = useMemo(() => {
    return files.filter((file) => file.mimeType !== "application/vnd.google-apps.folder");
  }, [files]);

  const [sortCriteria, setSortCriteria] = useState<SortCriteria>(SortCriteria.Default);
  const [selectedExtension, setSelectedExtension] = useState<string | null>(null);

  const uniqueExtensions = useMemo(() => {
    const extensions = regularFiles
      .map((file) => getFileExtension(file.name).toLowerCase())
      .filter((ext) => ext !== "");
    return Array.from(new Set(extensions)).sort();
  }, [regularFiles]);

  const [showFolders, setShowFolders] = useState(true);

  const sortedFiles = useMemo(() => {
    let foldersList = files.filter((file) => file.mimeType === "application/vnd.google-apps.folder");
    let regularFilesList = files.filter((file) => file.mimeType !== "application/vnd.google-apps.folder");

    if (selectedExtension) {
      regularFilesList = regularFilesList.filter(
        (file) => getFileExtension(file.name).toLowerCase() === selectedExtension
      );
    }

    const sortByDate = (a: FileItem, b: FileItem) =>
      new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();

    switch (sortCriteria) {
      case SortCriteria.Name:
        foldersList.sort((a, b) => a.name.localeCompare(b.name));
        regularFilesList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortCriteria.Size:
        foldersList.sort(sortByDate);
        regularFilesList.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
      case SortCriteria.Date:
      default:
        foldersList.sort(sortByDate);
        regularFilesList.sort(sortByDate);
    }

    return showFolders ? [...foldersList, ...regularFilesList] : regularFilesList;
  }, [files, showFolders, sortCriteria, selectedExtension]);

  const [isGridView, setIsGridView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const [compressingFolder, setCompressingFolder] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [hasFolders, setHasFolders] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAdminMode] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).has("admin");
    }
    return false;
  });

  const checkedFolderIds = useRef<Set<string>>(new Set());
  const onCheckFolderContentRef = useRef(onCheckFolderContent);

  useEffect(() => {
    onCheckFolderContentRef.current = onCheckFolderContent;
  }, [onCheckFolderContent]);

  useEffect(() => {
    const checkFolders = async () => {
      const foldersToCheck = files.filter(
        (file) =>
          file.mimeType === "application/vnd.google-apps.folder" &&
          !checkedFolderIds.current.has(file.id)
      );

      if (foldersToCheck.length === 0) return;

      const results: Record<string, boolean> = {};
      for (const file of foldersToCheck) {
        checkedFolderIds.current.add(file.id);
        results[file.id] = await onCheckFolderContentRef.current(file.id);
      }
      setHasFolders((prev) => ({ ...prev, ...results }));
    };
    checkFolders();
  }, [files]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items) return;

    const entries = Array.from(items)
      .map((item) => item.webkitGetAsEntry())
      .filter((entry): entry is FileSystemEntry => entry !== null);

    const droppedFiles: File[] = [];
    let hasFolder = false;
    let rootFolderName = "";

    for (const entry of entries) {
      if (entry.isDirectory) {
        hasFolder = true;
        rootFolderName = entry.name;

        const processEntry = async (entry: FileSystemEntry, path: string = "") => {
          if (entry.isFile) {
            const fileEntry = entry as FileSystemFileEntry;
            return new Promise<void>((resolve, reject) => {
              fileEntry.file((file: File) => {
                const relativePath = path ? `${path}/${file.name}` : file.name;
                const newFile = new File([file], file.name, { type: file.type });
                Object.defineProperty(newFile, "webkitRelativePath", { value: relativePath });
                droppedFiles.push(newFile);
                resolve();
              }, reject);
            });
          } else if (entry.isDirectory) {
            const dirEntry = entry as FileSystemDirectoryEntry;
            const reader = dirEntry.createReader();

            const readAllEntries = async (): Promise<FileSystemEntry[]> => {
              const allEntries: FileSystemEntry[] = [];
              const readNextBatch = async (): Promise<void> => {
                const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
                  reader.readEntries(resolve, reject);
                });
                if (batch.length > 0) {
                  allEntries.push(...batch);
                  await readNextBatch();
                }
              };
              await readNextBatch();
              return allEntries;
            };

            const childEntries = await readAllEntries();
            const newPath = path ? `${path}/${entry.name}` : entry.name;
            for (const childEntry of childEntries) {
              await processEntry(childEntry, newPath);
            }
          }
        };

        await processEntry(entry);
      }
    }

    if (hasFolder && droppedFiles.length > 0) {
      const filesArray = Object.assign(droppedFiles, {
        item: (i: number) => droppedFiles[i],
        rootFolderName,
      });
      const event = { target: { files: filesArray } } as unknown as React.ChangeEvent<HTMLInputElement>;
      onUploadFolder(event);
    } else {
      const event = { target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>;
      onUploadFile(event);
    }
  };

  const generateDownloadLink = (fileId: string) => {
    return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;
  };

  const handleDownloadFolder = async (folderId: string, folderName: string) => {
    try {
      setCompressingFolder(folderId);
      setCompressionProgress(0);

      const folderFiles = await driveService.getFolderFiles(folderId);

      if (!folderFiles.length) {
        throw new Error("No files found");
      }

      const zip = new JSZip();
      let downloadedCount = 0;

      for (const file of folderFiles) {
        if (file.mimeType !== "application/vnd.google-apps.folder") {
          try {
            const blob = await driveService.downloadFileBlob(file.id);
            zip.file(file.name, blob);
            downloadedCount++;
            setCompressionProgress(Math.round((downloadedCount / folderFiles.length) * 100));
          } catch (error) {
            console.error(`Lỗi khi tải file ${file.name}:`, error);
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải thư mục:", error);
      techToast.error("Có lỗi xảy ra khi tải thư mục");
    } finally {
      setCompressingFolder(null);
      setCompressionProgress(0);
    }
  };

  const handleMouseLeave = () => setOpenMenuId(null);

  const handleDelete = (e: React.MouseEvent, file: FileItem) => {
    e.stopPropagation();
    setFileToDelete(file);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!fileToDelete || !onDelete) return;

    try {
      setIsDeleting(true);
      const isValid = await driveService.verifyPassword(deletePassword);

      if (!isValid) throw new Error("Mật khẩu không đúng");

      await onDelete(fileToDelete.id);
      techToast.success("Đã xóa thành công!");
      setShowDeleteModal(false);
      setDeletePassword("");
      setFileToDelete(null);
    } catch (error) {
      techToast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    files: sortedFiles,
    isLoading,
    currentFolderId,
    currentFolderName,
    folderPath,
    onFolderClick,
    onBreadcrumbClick,
    onBackClick,
    onDownload,
    onUploadFile,
    onUploadFolder,
    onCheckFolderContent,
    onDelete,
    uniqueExtensions,
    showFolders,
    setSortCriteria,
    setSelectedExtension,
    setShowFolders,
    isGridView,
    setIsGridView,
    isDragging,
    compressingFolder,
    compressionProgress,
    hasFolders,
    openMenuId,
    showDeleteModal,
    deletePassword,
    fileToDelete,
    isDeleting,
    isAdminMode,
    setOpenMenuId,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragOver,
    generateDownloadLink,
    handleDownloadFolder,
    handleMouseLeave,
    handleDelete,
    confirmDelete,
    selectedExtension,
    sortCriteria,
    SortCriteria,
    formatFileSize,
    setDeletePassword,
    setShowDeleteModal,
    setFileToDelete,
    setIsDeleting,
  };
};
