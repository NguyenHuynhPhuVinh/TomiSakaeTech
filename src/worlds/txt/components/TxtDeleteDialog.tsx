"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonBorder, TechBadge } from "@/shared/components/tech";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative border border-red-500/40 bg-black/95 overflow-hidden shadow-[0_0_50px_rgba(255,68,68,0.2)]">
              {/* Glitch lines effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,68,68,0.02)_50%)] bg-[length:100%_4px]" />
              </div>

              {/* Corner accents */}
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="absolute top-0 left-0 border-t-2 border-l-2 border-red-500"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="absolute top-0 right-0 border-t-2 border-r-2 border-red-500"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-500"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-500"
              />

              {/* Close button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 z-20 p-1 text-red-500/60 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="border-b border-red-500/30 bg-red-500/5 px-6 py-4 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-red-500/10 to-transparent" />
                <div className="flex items-center gap-3 font-mono text-red-500 relative">
                  <div className="relative">
                    <div className="w-8 h-8 border border-red-500 flex items-center justify-center bg-red-500/10">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-red-500"
                    />
                  </div>
                  <span className="font-bold">DELETE_NOTE</span>
                  <TechBadge variant="error" size="sm" pulse>
                    DANGER
                  </TechBadge>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-6"
              >
                <p className="text-sm font-mono text-muted-foreground mb-6">
                  This action cannot be undone. Type{" "}
                  <span className="text-[#00d4ff] font-bold">XOA</span> to confirm
                  deletion.
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
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-[10px] font-mono text-red-500 text-center"
                  >
                    INVALID_CODE - Type XOA exactly
                  </motion.p>
                )}
                {isValid && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-[10px] font-mono text-[#00d4ff] text-center"
                  >
                    CODE_ACCEPTED - Ready to delete
                  </motion.p>
                )}
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-t border-border px-6 py-4 flex gap-3"
              >
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 rounded-none font-mono text-xs gap-2 border border-border hover:border-red-500/50"
                >
                  <X className="w-4 h-4" />
                  CANCEL
                </Button>
                <Button
                  variant="destructive"
                  onClick={onConfirm}
                  disabled={!isValid}
                  className="flex-1 rounded-none font-mono text-xs gap-2 shadow-[0_0_20px_rgba(255,68,68,0.3)]"
                >
                  <Trash2 className="w-4 h-4" />
                  DELETE
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TxtDeleteDialog;
