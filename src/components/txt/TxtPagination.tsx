"use client";
import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TxtPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TxtPagination: React.FC<TxtPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];
    
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    
    if (currentPage > 3) {
      pages.push("...");
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-1 pt-12">
      {/* First page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
        title="First page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Previous page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
        title="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      <div className="flex items-center mx-2">
        {getVisiblePages().map((page, i) => (
          <React.Fragment key={i}>
            {page === "..." ? (
              <span className="w-10 h-10 flex items-center justify-center text-xs font-mono text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={cn(
                  "w-10 h-10 text-xs font-mono transition-all",
                  currentPage === page
                    ? "bg-[#00d4ff] text-black font-bold"
                    : "text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10"
                )}
              >
                {String(page).padStart(2, "0")}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
        title="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
        title="Last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>

      {/* Page info */}
      <div className="ml-4 text-[10px] font-mono text-muted-foreground">
        PAGE {currentPage}/{totalPages}
      </div>
    </nav>
  );
};

export default TxtPagination;
