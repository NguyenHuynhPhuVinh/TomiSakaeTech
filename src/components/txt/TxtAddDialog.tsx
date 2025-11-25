"use client";
import React, { useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import gsap from "gsap";
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
  const lineCount = value.split("\n").length;
  const charCount = value.length;

  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl border-[#00d4ff]/30 rounded-none bg-background p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#00d4ff]/20 bg-[#00d4ff]/5 px-6 py-4">
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
        <div className="p-6">
          <NeonBorder color="#00d4ff" intensity="low" className="bg-[#0d1117]">
            <div className="flex">
              {/* Line numbers */}
              <div className="w-12 py-4 pr-2 text-right border-r border-[#00d4ff]/20 select-none">
                {value.split("\n").map((_, i) => (
                  <div key={i} className="text-[11px] font-mono text-muted-foreground/40 leading-relaxed">
                    {i + 1}
                  </div>
                ))}
                {value === "" && (
                  <div className="text-[11px] font-mono text-muted-foreground/40 leading-relaxed">
                    1
                  </div>
                )}
              </div>
              
              {/* Textarea */}
              <TextareaAutosize
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="// Paste your code, text or notes here..."
                className="flex-1 min-h-[300px] p-4 bg-transparent text-sm font-mono leading-relaxed resize-none outline-none text-white placeholder:text-muted-foreground/30"
                minRows={12}
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
        <DialogFooter className="border-t border-border px-6 py-4 gap-3">
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
