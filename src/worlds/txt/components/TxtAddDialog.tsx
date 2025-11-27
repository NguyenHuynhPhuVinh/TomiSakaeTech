"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonBorder, TechBadge, WaveformVisualizer } from "@/shared/components/tech";
import { Button } from "@/shared/components/ui/button";
import { Terminal, Save, X } from "lucide-react";

interface TxtAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export const TxtAddDialog: React.FC<TxtAddDialogProps> = ({
  open,
  onOpenChange,
  value,
  onChange,
  onSave,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const lineCount = value.split("\n").length;
  const charCount = value.length;

  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open]);

  const handleScroll = () => {
    if (editorRef.current) {
      const lineNumbers = editorRef.current.querySelector(
        ".line-numbers"
      ) as HTMLElement;
      const textarea = textareaRef.current;
      if (lineNumbers && textarea) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
    }
  };

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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex flex-col"
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
                <div className="flex items-center gap-3 font-mono relative">
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
                  <span className="font-bold text-[#00d4ff]">NEW_NOTE</span>
                  <TechBadge variant="success" size="sm" pulse>
                    EDITING
                  </TechBadge>
                </div>
              </motion.div>

              {/* Editor */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex-1 min-h-0 p-6 overflow-hidden"
              >
                <NeonBorder color="#00d4ff" intensity="low" className="bg-[#0d1117]">
                  <div ref={editorRef} className="flex h-[50vh]">
                    <div className="line-numbers w-12 py-4 pr-2 text-right border-r border-[#00d4ff]/20 select-none overflow-hidden">
                      {value.split("\n").map((_, i) => (
                        <div
                          key={i}
                          className="text-[11px] font-mono text-muted-foreground/40 leading-[1.7]"
                        >
                          {i + 1}
                        </div>
                      ))}
                      {value === "" && (
                        <div className="text-[11px] font-mono text-muted-foreground/40 leading-[1.7]">
                          1
                        </div>
                      )}
                    </div>

                    <textarea
                      ref={textareaRef}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onScroll={handleScroll}
                      placeholder="// Paste your code, text or notes here..."
                      className="flex-1 h-full p-4 bg-transparent text-sm font-mono leading-[1.7] resize-none outline-hidden text-white placeholder:text-muted-foreground/30 overflow-y-auto"
                    />
                  </div>
                </NeonBorder>

                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="flex items-center gap-4">
                    <TechBadge variant="default" size="sm">
                      {lineCount} LINES
                    </TechBadge>
                    <TechBadge variant="default" size="sm">
                      {charCount} CHARS
                    </TechBadge>
                  </div>
                  <WaveformVisualizer
                    color="#00d4ff"
                    bars={8}
                    height={20}
                    active={value.length > 0}
                  />
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="shrink-0 border-t border-border px-6 py-4 flex gap-3 justify-end"
              >
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="rounded-none font-mono text-xs gap-2 border border-border hover:border-[#00d4ff]/50"
                >
                  <X className="w-4 h-4" />
                  CANCEL
                </Button>
                <Button
                  onClick={() => {
                    onSave();
                    onOpenChange(false);
                  }}
                  disabled={!value.trim()}
                  className="rounded-none font-mono text-xs bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 gap-2 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                >
                  <Save className="w-4 h-4" />
                  SAVE_NOTE
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TxtAddDialog;
