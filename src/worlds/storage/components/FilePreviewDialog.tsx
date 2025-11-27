"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import {
  GlitchText,
  TechBadge,
  LoadingDots,
  NeonBorder,
  PulseRing,
} from "@/shared/components/tech";
import { FileTechIcon } from "@/shared/components/icons/TechIcons";
import { Download, ExternalLink, Copy, Check, X } from "lucide-react";
import Image from "next/image";
import { techToast } from "@/shared/components/tech";

interface FilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
  onDownload: () => void;
}

interface PreviewData {
  previewType: "text" | "image" | "video" | "audio" | "pdf" | "unsupported";
  name: string;
  mimeType: string;
  size?: string;
  content?: string;
  thumbnailLink?: string;
  downloadUrl?: string;
  streamUrl?: string;
  error?: string;
}

export const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
  isOpen,
  onClose,
  fileId,
  fileName,
  onDownload,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchPreview = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/drive/preview?fileId=${fileId}`);
      const data = await response.json();
      setPreviewData(data);
    } catch (error) {
      console.error("Error fetching preview:", error);
      setPreviewData({
        previewType: "unsupported",
        name: fileName,
        mimeType: "unknown",
        error: "Failed to load preview",
      });
    } finally {
      setIsLoading(false);
    }
  }, [fileId, fileName]);

  useEffect(() => {
    if (isOpen && fileId) {
      fetchPreview();
    }
    return () => {
      setPreviewData(null);
      setIsLoading(true);
    };
  }, [isOpen, fileId, fetchPreview]);

  const handleCopyContent = () => {
    if (previewData?.content) {
      navigator.clipboard.writeText(previewData.content);
      setCopied(true);
      techToast.success("CONTENT_COPIED");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatFileSize = (bytes: string | number) => {
    const size = typeof bytes === "string" ? parseInt(bytes) : bytes;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <PulseRing color="#00ff88" size={60} rings={3} />
          <div className="flex items-center gap-2 mt-4">
            <LoadingDots color="#00ff88" size={6} />
            <span className="text-xs font-mono text-muted-foreground">
              LOADING_PREVIEW
            </span>
          </div>
        </div>
      );
    }

    if (!previewData || previewData.error) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <FileTechIcon size={48} className="text-muted-foreground mb-4" />
          <p className="text-sm font-mono text-muted-foreground mb-2">
            {previewData?.error || "PREVIEW_UNAVAILABLE"}
          </p>
          <Button
            onClick={onDownload}
            variant="outline"
            className="rounded-none font-mono text-xs mt-4"
          >
            <Download className="w-4 h-4 mr-2" />
            DOWNLOAD_FILE
          </Button>
        </div>
      );
    }

    switch (previewData.previewType) {
      case "text":
        return (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyContent}
                className="h-8 px-2 font-mono text-xs"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <NeonBorder color="#00ff88" intensity="low">
              <pre className="p-4 text-xs font-mono overflow-auto max-h-[60vh] bg-muted/20">
                <code>{previewData.content}</code>
              </pre>
            </NeonBorder>
          </div>
        );

      case "image":
        return (
          <div className="flex items-center justify-center p-4 relative min-h-[200px]">
            <Image
              src={previewData.streamUrl || previewData.thumbnailLink || ""}
              alt={previewData.name}
              width={800}
              height={600}
              className="max-w-full max-h-[60vh] object-contain w-auto h-auto"
              unoptimized
            />
          </div>
        );

      case "video":
        return (
          <div className="p-4">
            <video
              controls
              className="w-full max-h-[60vh]"
              src={previewData.streamUrl || ""}
            >
              Your browser does not support video playback.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="p-8 flex flex-col items-center">
            <FileTechIcon size={64} className="text-[#00ff88] mb-6" />
            <audio
              controls
              className="w-full max-w-md"
              src={previewData.streamUrl || ""}
            >
              Your browser does not support audio playback.
            </audio>
          </div>
        );

      case "pdf":
        return (
          <div className="p-4">
            <iframe
              src={previewData.streamUrl || ""}
              className="w-full h-[60vh] border-0"
              title={previewData.name}
            />
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <FileTechIcon size={48} className="text-muted-foreground mb-4" />
            <p className="text-sm font-mono text-muted-foreground mb-2">
              PREVIEW_NOT_SUPPORTED
            </p>
            <p className="text-xs font-mono text-muted-foreground/60 mb-4">
              {previewData.mimeType}
            </p>
            <Button
              onClick={onDownload}
              variant="outline"
              className="rounded-none font-mono text-xs"
            >
              <Download className="w-4 h-4 mr-2" />
              DOWNLOAD_FILE
            </Button>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
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
            className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-4xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex flex-col"
          >
            <div className="relative border border-[#00ff88]/40 bg-black/95 overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.2)] flex flex-col max-h-[90vh]">
              {/* Glitch lines effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,136,0.02)_50%)] bg-[length:100%_4px]" />
              </div>

              {/* Corner accents */}
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="absolute top-0 left-0 border-t-2 border-l-2 border-[#00ff88]"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="absolute top-0 right-0 border-t-2 border-r-2 border-[#00ff88]"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="absolute bottom-0 left-0 border-b-2 border-l-2 border-[#00ff88]"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                className="absolute bottom-0 right-0 border-b-2 border-r-2 border-[#00ff88]"
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-20 p-1 text-[#00ff88]/60 hover:text-[#00ff88] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="border-b border-[#00ff88]/20 bg-[#00ff88]/5 px-6 py-4 shrink-0"
              >
                <div className="flex items-center justify-between font-mono relative">
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-8">
                    <div className="relative shrink-0">
                      <FileTechIcon size={24} className="text-[#00ff88]" />
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-[#00ff88]"
                      />
                    </div>
                    <GlitchText intensity="low" className="truncate">
                      {fileName}
                    </GlitchText>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {previewData?.size && (
                      <TechBadge variant="default" size="sm">
                        {formatFileSize(previewData.size)}
                      </TechBadge>
                    )}
                    {previewData?.mimeType && (
                      <TechBadge variant="info" size="sm">
                        {previewData.mimeType.split("/").pop()?.toUpperCase()}
                      </TechBadge>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="overflow-auto flex-1"
              >
                {renderPreview()}
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-t border-border px-6 py-3 flex items-center justify-between bg-muted/20 shrink-0"
              >
                <div className="text-[10px] font-mono text-muted-foreground">
                  FILE_ID: {fileId.slice(0, 12)}...
                </div>
                <div className="flex items-center gap-2">
                  {previewData?.downloadUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(previewData.downloadUrl, "_blank")}
                      className="h-8 rounded-none font-mono text-xs"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      OPEN
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={onDownload}
                    className="h-8 rounded-none font-mono text-xs bg-[#00ff88] text-black hover:bg-[#00ff88]/90 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD
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

export default FilePreviewDialog;
