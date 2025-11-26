"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { TechBadge } from "@/components/ui/tech";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
  ArrowUpDown,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeToolbarProps {
  totalItems: number;
  showFolders: boolean;
  onToggleFolders: () => void;
  selectedExtension: string | null;
  onSelectExtension: (ext: string | null) => void;
  uniqueExtensions: string[];
  sortCriteria: string;
  onSortChange: (criteria: string) => void;
  isGridView: boolean;
  onToggleView: () => void;
  isLoading: boolean;
}

export const HomeToolbar: React.FC<HomeToolbarProps> = ({
  totalItems,
  showFolders,
  onToggleFolders,
  selectedExtension,
  onSelectExtension,
  uniqueExtensions,
  sortCriteria,
  onSortChange,
  isGridView,
  onToggleView,
  isLoading,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toolbarRef.current) {
      gsap.fromTo(
        toolbarRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  }, []);

  if (isLoading) return null;

  return (
    <div ref={toolbarRef} className="flex items-center justify-between gap-4 mb-6">
      {/* Left side - Stats */}
      <div className="flex items-center gap-3">
        <TechBadge variant="default" size="sm">
          {totalItems} ITEMS
        </TechBadge>
        {selectedExtension && (
          <TechBadge variant="info" size="sm">
            .{selectedExtension}
          </TechBadge>
        )}
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-1">
        {/* Toggle Folders */}
        <button
          onClick={onToggleFolders}
          className={cn(
            "p-2.5 transition-all",
            showFolders ? "text-[#00ff88]" : "text-muted-foreground hover:text-foreground"
          )}
          title={showFolders ? "Hide folders" : "Show folders"}
        >
          {showFolders ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 p-2.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">TYPE</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-none border-border font-mono">
            <DropdownMenuItem onClick={() => onSelectExtension(null)} className="text-xs">
              <Check className={cn("mr-2 w-3 h-3", !selectedExtension ? "opacity-100" : "opacity-0")} />
              ALL_TYPES
            </DropdownMenuItem>
            {uniqueExtensions.map((ext) => (
              <DropdownMenuItem key={ext} onClick={() => onSelectExtension(ext)} className="text-xs">
                <Check className={cn("mr-2 w-3 h-3", selectedExtension === ext ? "opacity-100" : "opacity-0")} />
                .{ext.toUpperCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 p-2.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden sm:inline">SORT</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-none border-border font-mono">
            <DropdownMenuItem onClick={() => onSortChange("default")} className="text-xs">
              <Check className={cn("mr-2 w-3 h-3", sortCriteria === "default" ? "opacity-100" : "opacity-0")} />
              DEFAULT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("name")} className="text-xs">
              <Check className={cn("mr-2 w-3 h-3", sortCriteria === "name" ? "opacity-100" : "opacity-0")} />
              NAME
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("size")} className="text-xs">
              <Check className={cn("mr-2 w-3 h-3", sortCriteria === "size" ? "opacity-100" : "opacity-0")} />
              SIZE
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("date")} className="text-xs">
              <Check className={cn("mr-2 w-3 h-3", sortCriteria === "date" ? "opacity-100" : "opacity-0")} />
              DATE
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Toggle */}
        <div className="flex items-center border border-border ml-2">
          <button
            onClick={() => !isGridView && onToggleView()}
            className={cn(
              "p-2.5 transition-all",
              isGridView
                ? "bg-[#00ff88] text-black"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => isGridView && onToggleView()}
            className={cn(
              "p-2.5 transition-all",
              !isGridView
                ? "bg-[#00ff88] text-black"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeToolbar;
