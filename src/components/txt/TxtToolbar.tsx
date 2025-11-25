"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { TechBadge } from "@/components/ui/tech";
import { Search, X, LayoutGrid, List, Download, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface TxtToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onExportAll: () => void;
  totalResults: number;
  disabled?: boolean;
}

export const TxtToolbar: React.FC<TxtToolbarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onExportAll,
  totalResults,
  disabled = false,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const searchLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchLineRef.current) {
      gsap.to(searchLineRef.current, {
        scaleX: searchFocused ? 1 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [searchFocused]);

  useEffect(() => {
    if (toolbarRef.current) {
      gsap.fromTo(
        toolbarRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div
      ref={toolbarRef}
      className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-lg group">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Search className={cn(
                "w-4 h-4 transition-colors",
                searchFocused ? "text-[#00d4ff]" : "text-muted-foreground"
              )} />
              <span className="text-[10px] font-mono text-muted-foreground">
                {">"}
              </span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="SEARCH_QUERY..."
              className="w-full bg-transparent pl-12 pr-8 py-2.5 text-sm font-mono outline-none placeholder:text-muted-foreground/40"
            />
            
            {/* Animated underline */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-border">
              <div
                ref={searchLineRef}
                className="h-full bg-[#00d4ff] origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-[#00d4ff] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Results count */}
            <TechBadge variant="default" size="sm">
              {totalResults} RESULTS
            </TechBadge>

            {/* View toggle */}
            <div className="flex items-center border border-border">
              <button
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "p-2 transition-all",
                  viewMode === "grid"
                    ? "bg-[#00d4ff] text-black"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={cn(
                  "p-2 transition-all",
                  viewMode === "list"
                    ? "bg-[#00d4ff] text-black"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Export button */}
            <button
              onClick={onExportAll}
              disabled={disabled || totalResults === 0}
              className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all disabled:opacity-30 disabled:pointer-events-none border border-transparent hover:border-[#00d4ff]/30"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">EXPORT_ALL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxtToolbar;
