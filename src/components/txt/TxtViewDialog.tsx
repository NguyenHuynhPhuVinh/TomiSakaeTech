"use client";
import React, { useRef, useEffect } from "react";
import hljs from "highlight.js";
import { NeonBorder, TechBadge } from "@/components/ui/tech";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Terminal, Copy, Download, Trash2, X, Cpu } from "lucide-react";

interface TxtViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: {
    id: string;
    content: string;
    timestamp: number;
  } | null;
  index: number;
  onCopy: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const TxtViewDialog: React.FC<TxtViewDialogProps> = ({
  open,
  onOpenChange,
  note,
  index,
  onCopy,
  onDownload,
  onDelete,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!note) return null;

  const lineCount = note.content.split("\n").length;
  const charCount = note.content.length;
  const formatDate = (ts: number) => new Date(ts).toLocaleDateString("vi-VN");
  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] border-[#00d4ff]/30 rounded-none bg-background p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-[#00d4ff]/20 bg-[#00d4ff]/5 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between font-mono">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-[#00d4ff] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-[#00d4ff]" />
                </div>
                <TechBadge variant="success" size="sm">
                  #{String(index).padStart(3, "0")}
                </TechBadge>
                <span className="text-sm">NOTE_VIEWER</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">{formatDate(note.timestamp)}</span>
                <span className="text-[#00d4ff]">{formatTime(note.timestamp)}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content - single scroll area */}
        <div ref={contentRef} className="flex-1 min-h-0 overflow-hidden p-6">
          <NeonBorder color="#00d4ff" intensity="low" className="bg-[#0d1117] h-full">
            <div className="flex h-full max-h-[55vh]">
              {/* Line numbers - synced scroll */}
              <div className="line-numbers w-10 py-3 pr-2 text-right border-r border-[#00d4ff]/20 select-none shrink-0 overflow-hidden">
                {note.content.split("\n").map((_, i) => (
                  <div key={i} className="text-[10px] font-mono text-muted-foreground/40 leading-[1.6]">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code - single scrollbar */}
              <div className="flex-1 overflow-auto">
                <pre className="min-w-max">
                  <code
                    className="hljs block p-3 text-[11px] leading-[1.6] rounded-none bg-[#0d1117] font-mono"
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlightAuto(note.content).value,
                    }}
                  />
                </pre>
              </div>
            </div>
          </NeonBorder>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TechBadge variant="default" size="sm">
              <Cpu className="w-3 h-3 mr-1" />
              {lineCount} LINES
            </TechBadge>
            <TechBadge variant="default" size="sm">
              {charCount} CHARS
            </TechBadge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopy}
              className="rounded-none font-mono text-xs gap-2 hover:text-[#00d4ff]"
            >
              <Copy className="w-4 h-4" />
              COPY
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="rounded-none font-mono text-xs gap-2 hover:text-[#00d4ff]"
            >
              <Download className="w-4 h-4" />
              DOWNLOAD
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDelete();
                onOpenChange(false);
              }}
              className="rounded-none font-mono text-xs gap-2 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
              DELETE
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-none font-mono text-xs gap-2"
            >
              <X className="w-4 h-4" />
              CLOSE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TxtViewDialog;
