"use client";
import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useNote } from "../../components/hooks/note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Copy,
  Trash2,
  Plus,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  LayoutGrid,
  LayoutList,
  X,
  Check,
  Clock,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type SortOrder = "newest" | "oldest";

const NotePage = () => {
  const {
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
    currentPage,
    totalPages,
    paginatedNotes,
    goToPage,
    searchQuery,
    setSearchQuery,
    filteredNotes,
  } = useNote();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (deleteMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [deleteMode]);

  // Download note as txt file
  const handleDownload = (content: string, timestamp: number) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `note-${new Date(timestamp).toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Đã tải xuống!");
  };

  // Download all notes
  const handleDownloadAll = () => {
    if (filteredNotes.length === 0) return;
    const allContent = filteredNotes
      .map(
        (note, i) =>
          `=== Ghi chú ${i + 1} (${new Date(note.timestamp).toLocaleString("vi-VN")}) ===\n${note.content}`
      )
      .join("\n\n");
    const blob = new Blob([allContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-notes-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Đã tải ${filteredNotes.length} ghi chú!`);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const mins = Math.floor(diff / (1000 * 60));
        return mins <= 1 ? "Vừa xong" : `${mins} phút trước`;
      }
      return `${hours} giờ trước`;
    }
    if (days === 1) return "Hôm qua";
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleGoBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold">Kho Văn Bản</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={filteredNotes.length === 0}
                className="hidden sm:flex gap-2"
              >
                <Download className="w-4 h-4" />
                Tải tất cả
              </Button>
              <Button size="sm" onClick={() => setShowAddForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Thêm mới</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nội dung..."
              className="pl-9 pr-9 h-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* View Toggle & Stats */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground px-2">
              {filteredNotes.length} ghi chú
            </div>
          </div>
        </div>

        {/* Add Form Modal */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Thêm ghi chú mới
              </DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <TextareaAutosize
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Nhập nội dung văn bản, code, hoặc ghi chú..."
                className="w-full min-h-[200px] p-4 rounded-lg border bg-muted/30 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                minRows={8}
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2">
                Hỗ trợ highlight code tự động • Shift+Enter để xuống dòng
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Hủy
              </Button>
              <Button
                onClick={() => {
                  handleAddNote();
                  setShowAddForm(false);
                }}
                disabled={!newNote.trim()}
              >
                <Check className="w-4 h-4 mr-2" />
                Lưu ghi chú
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notes Content */}
        {loading ? (
          <div className={cn(
            viewMode === "grid"
              ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 bg-card rounded-lg border">
                <Skeleton className="h-4 w-1/3 mb-3" />
                <Skeleton className="h-24 w-full mb-3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : paginatedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-muted-foreground mb-1">
              {searchQuery ? "Không tìm thấy kết quả" : "Chưa có ghi chú"}
            </h3>
            <p className="text-sm text-muted-foreground/70 mb-4">
              {searchQuery ? "Thử từ khóa khác" : "Bắt đầu lưu trữ văn bản của bạn"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowAddForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Thêm ghi chú đầu tiên
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedNotes.map((note) => (
                  <div
                    key={note.id}
                    className={cn(
                      "group bg-card rounded-lg border hover:border-primary/30 transition-colors overflow-hidden",
                      deleteMode === note.id && "ring-2 ring-destructive"
                    )}
                  >
                    {/* Content */}
                    <div className="p-3">
                      <div className="relative">
                        <pre
                          className={cn(
                            "overflow-x-auto rounded-md",
                            !expandedNotes[note.id] ? "max-h-[140px] overflow-y-hidden" : ""
                          )}
                        >
                          <code
                            className="hljs block rounded-md p-3 text-xs leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: hljs.highlightAuto(note.content).value,
                            }}
                          />
                        </pre>

                        {countLines(note.content) > 6 && !expandedNotes[note.id] && (
                          <button
                            className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#282c34] to-transparent flex items-end justify-center pb-1 text-xs text-white/70 hover:text-white"
                            onClick={() => toggleNoteExpansion(note.id)}
                          >
                            Xem thêm ↓
                          </button>
                        )}

                        {expandedNotes[note.id] && countLines(note.content) > 6 && (
                          <button
                            className="w-full mt-1 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => toggleNoteExpansion(note.id)}
                          >
                            Thu gọn ↑
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-2 border-t bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(note.timestamp)}</span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDownload(note.content, note.timestamp)}
                          title="Tải xuống"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleCopy(note.content)}
                          title="Sao chép"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => {
                            setDeleteMode(note.id);
                            setDeleteCode("");
                          }}
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-2">
                {paginatedNotes.map((note) => (
                  <div
                    key={note.id}
                    className={cn(
                      "group bg-card rounded-lg border hover:border-primary/30 transition-colors",
                      deleteMode === note.id && "ring-2 ring-destructive"
                    )}
                  >
                    <div className="flex items-start gap-4 p-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <pre
                          className={cn(
                            "overflow-x-auto rounded-md",
                            !expandedNotes[note.id] ? "max-h-[80px] overflow-y-hidden" : ""
                          )}
                        >
                          <code
                            className="hljs block rounded-md p-3 text-xs leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: hljs.highlightAuto(note.content).value,
                            }}
                          />
                        </pre>

                        {countLines(note.content) > 3 && (
                          <button
                            className="mt-1 text-xs text-primary hover:underline"
                            onClick={() => toggleNoteExpansion(note.id)}
                          >
                            {expandedNotes[note.id] ? "Thu gọn" : "Xem thêm"}
                          </button>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(note.timestamp)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownload(note.content, note.timestamp)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopy(note.content)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => {
                              setDeleteMode(note.id);
                              setDeleteCode("");
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, idx, arr) => (
                    <React.Fragment key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Dialog */}
      <Dialog
        open={deleteMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteMode(null);
            setDeleteCode("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa ghi chú</DialogTitle>
            <DialogDescription>
              Nhập <strong>XOA</strong> để xác nhận
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteCode}
            onChange={(e) => setDeleteCode(e.target.value)}
            placeholder="Nhập mã xác nhận"
            className="text-center font-mono"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteMode(null);
                setDeleteCode("");
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteNote(deleteMode!)}
              disabled={deleteCode.toUpperCase() !== "XOA"}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default NotePage;
