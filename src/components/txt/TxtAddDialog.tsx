"use client";
import React, { useEffect, useRef } from "react";
import { NeonBorder, TechBadge, WaveformVisualizer } from "@/components/ui/tech";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

  // Sync scroll giữa line numbers và textarea
  const handleScroll = () => {
    if (editorRef.current) {
      const lineNumbers = editorRef.current.querySelector('.line-numbers') as HTMLElement;
      const textarea = textareaRef.current;
      if (lineNumbers && textarea) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] border-[#00d4ff]/30 rounded-none bg-background p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-[#00d4ff]/20 bg-[#00d4ff]/5 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 font-mono">
              <div className="w-8 h-8 border border-[#00d4ff] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-[#00d4ff]" />
              </div>
              <span>NEW_NOTE</span>
              <TechBadge variant="success" size="sm" pulse>
                EDITING
              </TechBadge>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0 p-6 overflow-hidden">
          <NeonBorder color="#00d4ff" intensity="low" className="bg-[#0d1117]">
            <div ref={editorRef} className="flex h-[50vh]">
              {/* Line numbers - hidden scrollbar, synced with textarea */}
              <div className="line-numbers w-12 py-4 pr-2 text-right border-r border-[#00d4ff]/20 select-none overflow-hidden">
                {value.split("\n").map((_, i) => (
                  <div key={i} className="text-[11px] font-mono text-muted-foreground/40 leading-[1.7]">
                    {i + 1}
                  </div>
                ))}
                {value === "" && (
                  <div className="text-[11px] font-mono text-muted-foreground/40 leading-[1.7]">
                    1
                  </div>
                )}
              </div>
              
              {/* Textarea - single scrollbar */}
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                placeholder="// Paste your code, text or notes here..."
                className="flex-1 h-full p-4 bg-transparent text-sm font-mono leading-[1.7] resize-none outline-none text-white placeholder:text-muted-foreground/30 overflow-y-auto"
              />
            </div>
          </NeonBorder>

          {/* Stats bar */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center gap-4">
              <TechBadge variant="default" size="sm">
                {lineCount} LINES
              </TechBadge>
              <TechBadge variant="default" size="sm">
                {charCount} CHARS
              </TechBadge>
            </div>
            <WaveformVisualizer color="#00d4ff" bars={8} height={20} active={value.length > 0} />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="shrink-0 border-t border-border px-6 py-4 gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-none font-mono text-xs gap-2"
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
            className="rounded-none font-mono text-xs bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 gap-2"
          >
            <Save className="w-4 h-4" />
            SAVE_NOTE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TxtAddDialog;
