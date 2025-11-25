"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import hljs from "highlight.js";
import { NeonBorder, TechBadge } from "@/components/ui/tech";
import { Copy, Download, Trash2, Maximize2 } from "lucide-react";

interface TxtNoteCardProps {
  id: string;
  content: string;
  timestamp: number;
  index: number;
  onView: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const TxtNoteCard: React.FC<TxtNoteCardProps> = ({
  content,
  timestamp,
  index,
  onView,
  onCopy,
  onDownload,
  onDelete,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const lineCount = content.split("\n").length;

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
    <div ref={cardRef} className="group cursor-pointer" onClick={onView}>
      <NeonBorder color="#00d4ff" animated intensity="low" className="bg-card">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <TechBadge variant="success" size="sm" pulse>
              #{String(index).padStart(3, "0")}
            </TechBadge>
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <span>{formatTime(timestamp)}</span>
              <span className="text-[#00d4ff]">{lineCount}L</span>
            </div>
          </div>

          {/* Code preview */}
          <div className="relative h-[100px] mb-3 overflow-hidden">
            <pre className="overflow-hidden h-full">
              <code
                className="hljs block p-3 text-[11px] leading-relaxed rounded-none bg-[#0d1117] font-mono h-full overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: hljs.highlightAuto(content).value,
                }}
              />
            </pre>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />
            
            {/* View hint on hover */}
            <div className="absolute inset-0 bg-[#00d4ff]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1117]/95 border border-[#00d4ff]/50 text-[10px] font-mono text-[#00d4ff]">
                <Maximize2 className="w-3.5 h-3.5" />
                VIEW
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-[10px] font-mono text-muted-foreground">
              {formatDate(timestamp)}
            </span>
            
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onCopy(); }}
                className="p-1.5 text-muted-foreground hover:text-[#00d4ff] transition-all"
                title="Copy"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDownload(); }}
                className="p-1.5 text-muted-foreground hover:text-[#00d4ff] transition-all"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-1.5 text-muted-foreground hover:text-red-500 transition-all"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </NeonBorder>
    </div>
  );
};

export default TxtNoteCard;
