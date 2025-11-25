"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import hljs from "highlight.js";
import { NeonBorder, TechBadge } from "@/components/ui/tech";
import { Copy, Download, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TxtNoteCardProps {
  id: string;
  content: string;
  timestamp: number;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const TxtNoteCard: React.FC<TxtNoteCardProps> = ({
  id,
  content,
  timestamp,
  index,
  isExpanded,
  onToggleExpand,
  onCopy,
  onDownload,
  onDelete,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const lineCount = content.split("\n").length;
  const shouldTruncate = lineCount > 8;

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString("vi-VN");
  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    if (!cardRef.current) return;

    const handleMouseEnter = () => {
      gsap.to(cardRef.current, {
        y: -4,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const card = cardRef.current;
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className="group">
      <NeonBorder color="#00d4ff" animated intensity="low" className="bg-card">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TechBadge variant="success" size="sm" pulse>
                #{String(index).padStart(3, "0")}
              </TechBadge>
              <span className="text-[10px] font-mono text-muted-foreground">
                {formatTime(timestamp)}
              </span>
            </div>
            <TechBadge variant="default" size="sm">
              {lineCount} LINES
            </TechBadge>
          </div>

          {/* Code content */}
          <div className="relative mb-4">
            <div className="absolute top-0 left-0 w-8 border-r border-[#00d4ff]/20 text-right pr-2 select-none">
              {content.split("\n").slice(0, isExpanded ? undefined : 8).map((_, i) => (
                <div key={i} className="text-[10px] font-mono text-muted-foreground/50 leading-relaxed">
                  {i + 1}
                </div>
              ))}
            </div>
            
            <pre
              className={cn(
                "overflow-x-auto pl-10",
                !isExpanded && shouldTruncate && "max-h-[200px] overflow-y-hidden"
              )}
            >
              <code
                className="hljs block p-4 text-[12px] leading-relaxed rounded-none bg-[#0d1117] font-mono"
                dangerouslySetInnerHTML={{
                  __html: hljs.highlightAuto(content).value,
                }}
              />
            </pre>

            {/* Fade overlay */}
            {shouldTruncate && !isExpanded && (
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />
            )}
          </div>

          {/* Expand button */}
          {shouldTruncate && (
            <button
              onClick={onToggleExpand}
              className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-mono text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors border border-[#00d4ff]/20"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  COLLAPSE
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  EXPAND ({lineCount - 8} MORE LINES)
                </>
              )}
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
            <span className="text-[10px] font-mono text-muted-foreground">
              {formatDate(timestamp)}
            </span>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onCopy}
                className="p-2 text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={onDownload}
                className="p-2 text-muted-foreground hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </NeonBorder>
    </div>
  );
};

export default TxtNoteCard;
