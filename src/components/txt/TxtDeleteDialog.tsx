"use client";
import React from "react";
import { NeonBorder, TechBadge } from "@/components/ui/tech";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface TxtDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmCode: string;
  onConfirmCodeChange: (value: string) => void;
  onConfirm: () => void;
}

export const TxtDeleteDialog: React.FC<TxtDeleteDialogProps> = ({
  open,
  onOpenChange,
  confirmCode,
  onConfirmCodeChange,
  onConfirm,
}) => {
  const isValid = confirmCode.toUpperCase() === "XOA";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-red-500/30 rounded-none bg-background p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-red-500/20 bg-red-500/5 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 font-mono text-red-500">
              <div className="w-8 h-8 border border-red-500 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span>DELETE_NOTE</span>
              <TechBadge variant="error" size="sm" pulse>
                DANGER
              </TechBadge>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm font-mono text-muted-foreground mb-6">
            This action cannot be undone. Type{" "}
            <span className="text-[#00d4ff] font-bold">XOA</span> to confirm deletion.
          </p>

          <NeonBorder color="#ff4444" intensity="low">
            <Input
              value={confirmCode}
              onChange={(e) => onConfirmCodeChange(e.target.value)}
              placeholder="TYPE_CONFIRMATION_CODE"
              className="rounded-none border-0 bg-transparent font-mono text-center text-lg tracking-widest h-14"
              autoFocus
            />
          </NeonBorder>

          {confirmCode && !isValid && (
            <p className="mt-3 text-[10px] font-mono text-red-500 text-center">
              INVALID_CODE - Type XOA exactly
            </p>
          )}
          {isValid && (
            <p className="mt-3 text-[10px] font-mono text-[#00d4ff] text-center">
              CODE_ACCEPTED - Ready to delete
            </p>
          )}
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
            variant="destructive"
            onClick={onConfirm}
            disabled={!isValid}
            className="rounded-none font-mono text-xs gap-2"
          >
            <Trash2 className="w-4 h-4" />
            DELETE_PERMANENTLY
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TxtDeleteDialog;
