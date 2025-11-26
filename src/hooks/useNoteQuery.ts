import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { techToast } from "@/components/ui/tech";
import { noteService, Note } from "../services/noteService";

const ITEMS_PER_PAGE = 6;

export function useNoteQuery() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [deleteMode, setDeleteMode] = useState<string | null>(null);
  const [deleteCode, setDeleteCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubscribe = noteService.subscribeToNotes((notesList) => {
      setNotes(notesList);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: (content: string) => noteService.addNote(content),
    onSuccess: () => {
      setNewNote("");
      techToast.success("Đã thêm ghi chú!");
    },
    onError: () => {
      techToast.error("Lỗi khi thêm ghi chú");
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: () => {
      techToast.success("Đã xóa ghi chú!");
      setDeleteMode(null);
      setDeleteCode("");
    },
    onError: () => {
      techToast.error("Lỗi khi xóa ghi chú");
    },
  });

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNoteMutation.mutate(newNote);
    }
  };

  const handleDeleteNote = (id: string) => {
    if (deleteCode.trim().toUpperCase() !== "XOA") {
      techToast.error("Vui lòng nhập đúng mã xác nhận 'XOA'");
      return;
    }
    deleteNoteMutation.mutate(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    techToast.success("Đã sao chép ghi chú!");
  };

  const handleGoBack = () => router.push("/");

  const toggleNoteExpansion = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const countLines = (text: string): number => text.split("\n").length;

  const handleNoteClick = (content: string, id: string) => {
    if (deleteMode === id) {
      if (deleteCode.trim().toUpperCase() === "XOA") {
        handleDeleteNote(id);
      }
      setDeleteMode(null);
      setDeleteCode("");
    } else {
      handleCopy(content);
    }
  };

  // Filtered notes
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    return notes.filter((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredNotes.length / ITEMS_PER_PAGE);
  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNotes, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset page on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return {
    notes,
    newNote,
    setNewNote,
    loading,
    expandedNotes,
    deleteMode,
    setDeleteMode,
    deleteCode,
    setDeleteCode,
    handleAddNote,
    handleDeleteNote,
    handleKeyDown,
    handleCopy,
    handleGoBack,
    toggleNoteExpansion,
    countLines,
    handleNoteClick,
    currentPage,
    totalPages,
    paginatedNotes,
    goToPage,
    searchQuery,
    setSearchQuery,
    filteredNotes,
    isAdding: addNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  };
}
