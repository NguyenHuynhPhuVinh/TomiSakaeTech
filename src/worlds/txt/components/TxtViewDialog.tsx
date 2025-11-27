"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hljs from "highlight.js";
import { NeonBorder, TechBadge } from "@/shared/components/tech";
import { Button } from "@/shared/components/ui/button";
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
    new Date(ts).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -10,
              transition: { duration: 0.15 },
            }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex flex-col"
          >
            <div className="relative border border-[#00d4ff]/40 bg-black/95 overflow-hidden shadow-[0_0_50px_rgba(0,212,255,0.2)] flex flex-col max-h-[90vh]">
              {/* Glitch lines effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,212,255,0.02)_50%)] bg-[length:100%_4px]" />
              </div>

              {/* Corner accents */}
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="absolute top-0 left-0 border-t-2 border-l-2 border-[#00d4ff]"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="absolute top-0 right-0 border-t-2 border-r-2 border-[#00d4ff]"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="absolute bottom-0 left-0 border-b-2 border-l-2 border-[#00d4ff]"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                className="absolute bottom-0 right-0 border-b-2 border-r-2 border-[#00d4ff]"
              />

              {/* Close button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 z-20 p-1 text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="shrink-0 border-b border-[#00d4ff]/20 bg-[#00d4ff]/5 px-6 py-4"
              >
                <div className="flex items-center justify-between font-mono relative">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 border border-[#00d4ff] flex items-center justify-center bg-[#00d4ff]/10">
                        <Terminal className="w-4 h-4 text-[#00d4ff]" />
                      </div>
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-[#00d4ff]"
                      />
                    </div>
                    <TechBadge variant="success" size="sm">
                      #{String(index).padStart(3, "0")}
                    </TechBadge>
                    <span className="text-sm text-[#00d4ff]">NOTE_VIEWER</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs pr-8">
                    <span className="text-muted-foreground">
                      {formatDate(note.timestamp)}
                    </span>
                    <span className="text-[#00d4ff]">
                      {formatTime(note.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                ref={contentRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex-1 min-h-0 overflow-hidden p-6"
              >
                <NeonBorder
                  color="#00d4ff"
                  intensity="low"
                  className="bg-[#0d1117] h-full"
                >
                  <div className="flex h-full max-h-[55vh]">
                    <div className="line-numbers w-10 py-3 pr-2 text-right border-r border-[#00d4ff]/20 select-none shrink-0 overflow-hidden">
                      {note.content.split("\n").map((_, i) => (
                        <div
                          key={i}
                          className="text-[10px] font-mono text-muted-foreground/40 leading-[1.6]"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>

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
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="shrink-0 border-t border-border px-6 py-4 flex items-center justify-between"
              >
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
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TxtViewDialog;
