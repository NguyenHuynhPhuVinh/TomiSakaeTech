"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { cn } from "@/lib/utils";

// Toast types
type ToastType = "success" | "error" | "warning" | "info" | "loading";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// Global toast state
let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

const notifyListeners = () => {
  toastListeners.forEach((listener) => listener([...toasts]));
};

// Toast API
export const techToast = {
  success: (title: string, message?: string, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    toasts = [...toasts, { id, type: "success", title, message, duration }];
    notifyListeners();
    return id;
  },
  error: (title: string, message?: string, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    toasts = [...toasts, { id, type: "error", title, message, duration }];
    notifyListeners();
    return id;
  },
  warning: (title: string, message?: string, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    toasts = [...toasts, { id, type: "warning", title, message, duration }];
    notifyListeners();
    return id;
  },
  info: (title: string, message?: string, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    toasts = [...toasts, { id, type: "info", title, message, duration }];
    notifyListeners();
    return id;
  },
  loading: (title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    toasts = [...toasts, { id, type: "loading", title, message, duration: 0 }];
    notifyListeners();
    return id;
  },
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  },
  update: (id: string, updates: Partial<Omit<Toast, "id">>) => {
    toasts = toasts.map((t) => (t.id === id ? { ...t, ...updates } : t));
    notifyListeners();
  },
};

// Config per type
const typeConfig: Record<ToastType, { icon: string; color: string; bgGlow: string; borderColor: string }> = {
  success: {
    icon: "✓",
    color: "text-emerald-400",
    bgGlow: "rgba(16, 185, 129, 0.2)",
    borderColor: "border-emerald-500/30",
  },
  error: {
    icon: "✕",
    color: "text-red-400",
    bgGlow: "rgba(239, 68, 68, 0.2)",
    borderColor: "border-red-500/30",
  },
  warning: {
    icon: "⚠",
    color: "text-amber-400",
    bgGlow: "rgba(245, 158, 11, 0.2)",
    borderColor: "border-amber-500/30",
  },
  info: {
    icon: "ℹ",
    color: "text-cyan-400",
    bgGlow: "rgba(34, 211, 238, 0.2)",
    borderColor: "border-cyan-500/30",
  },
  loading: {
    icon: "◌",
    color: "text-violet-400",
    bgGlow: "rgba(139, 92, 246, 0.2)",
    borderColor: "border-violet-500/30",
  },
};

// Single Toast Item
const TechToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({
  toast,
  onRemove,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const config = typeConfig[toast.type];

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    // Enter animation
    gsap.fromTo(
      el,
      { x: 120, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    );

    // Scanline effect
    const scanline = el.querySelector(".scanline");
    if (scanline) {
      gsap.fromTo(
        scanline,
        { top: "-100%" },
        { top: "200%", duration: 2, ease: "none", repeat: -1 }
      );
    }

    // Glitch effect on icon
    const icon = el.querySelector(".toast-icon");
    if (icon) {
      gsap.to(icon, {
        keyframes: [
          { x: 0, duration: 0.05 },
          { x: -2, duration: 0.05 },
          { x: 2, duration: 0.05 },
          { x: 0, duration: 0.05 },
        ],
        repeat: -1,
        repeatDelay: 3,
      });
    }
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0 && progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 1 },
        {
          scaleX: 0,
          duration: toast.duration / 1000,
          ease: "none",
          onComplete: () => handleClose(),
        }
      );
    }
  }, [toast.duration]);

  const handleClose = useCallback(() => {
    const el = itemRef.current;
    if (!el) return;

    // Glitch out animation
    gsap.to(el, {
      keyframes: [
        { x: 5, opacity: 1, duration: 0.05 },
        { x: -5, opacity: 0.8, duration: 0.05 },
        { x: 10, opacity: 0.5, duration: 0.05 },
        { x: 100, opacity: 0, scale: 0.9, duration: 0.2 },
      ],
      ease: "power2.in",
      onComplete: onRemove,
    });
  }, [onRemove]);

  return (
    <div
      ref={itemRef}
      className={cn(
        "relative w-[340px] overflow-hidden",
        "bg-black/95 backdrop-blur-xl",
        "border",
        config.borderColor
      )}
      style={{
        boxShadow: `
          0 0 40px ${config.bgGlow},
          0 0 80px ${config.bgGlow.replace("0.2", "0.1")},
          inset 0 1px 0 rgba(255,255,255,0.1),
          inset 0 -1px 0 rgba(0,0,0,0.5)
        `,
        clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
      }}
    >
      {/* Corner cuts decoration */}
      <div className="absolute top-0 right-0 w-3 h-3 border-b border-l border-white/20 bg-black/50" 
           style={{ transform: "rotate(45deg) translate(50%, -50%)" }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-t border-r border-white/20 bg-black/50"
           style={{ transform: "rotate(45deg) translate(-50%, 50%)" }} />

      {/* Tech corners */}
      <div className="absolute top-0 left-0 w-4 h-4">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-white/40 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>
      <div className="absolute top-0 right-3 w-4 h-4">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-white/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-4 h-4">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-white/40 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-white/40 to-transparent" />
      </div>
      <div className="absolute bottom-3 left-0 w-4 h-4">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-white/40 to-transparent" />
      </div>

      {/* Scanline effect */}
      <div
        className="scanline absolute left-0 right-0 h-12 pointer-events-none opacity-20"
        style={{
          background: `linear-gradient(transparent, ${config.bgGlow}, transparent)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "10px 10px",
        }}
      />

      {/* Hex pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Content */}
      <div className="relative p-4 flex items-start gap-3">
        {/* Icon container */}
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              "toast-icon w-10 h-10 flex items-center justify-center",
              "border bg-black/50",
              config.borderColor,
              config.color
            )}
            style={{ 
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <span className={cn(
              "text-base font-bold",
              toast.type === "loading" && "animate-spin"
            )}>
              {config.icon}
            </span>
          </div>
          {/* Pulse ring */}
          <div 
            className={cn("absolute inset-0 animate-ping opacity-30", config.color.replace("text-", "bg-"))}
            style={{ 
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              animationDuration: "2s"
            }}
          />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 pt-0.5">
          {/* Status label */}
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-[10px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5",
              "border bg-black/30",
              config.borderColor,
              config.color
            )}>
              {toast.type === "success" && "SYSTEM.OK"}
              {toast.type === "error" && "SYSTEM.ERR"}
              {toast.type === "warning" && "SYSTEM.WARN"}
              {toast.type === "info" && "SYSTEM.INFO"}
              {toast.type === "loading" && "PROCESSING"}
            </span>
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className={cn("w-1 h-1", config.color.replace("text-", "bg-"))}
                  style={{ 
                    opacity: 0.3 + (i * 0.3),
                    animation: toast.type === "loading" ? `pulse 1s ease-in-out ${i * 0.2}s infinite` : undefined
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Title */}
          <p className="text-white font-medium text-sm font-mono leading-tight">
            {toast.title}
          </p>
          
          {/* Message */}
          {toast.message && (
            <p className="text-white/50 text-xs mt-1.5 font-mono leading-relaxed">
              <span className="text-white/30">{">"}</span> {toast.message}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            "flex-shrink-0 w-6 h-6 flex items-center justify-center",
            "text-white/30 hover:text-white transition-all duration-200",
            "hover:bg-white/10 border border-transparent hover:border-white/20",
            "group"
          )}
        >
          <span className="text-xs group-hover:scale-110 transition-transform">✕</span>
        </button>
      </div>

      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="h-0.5 bg-white/5 relative overflow-hidden">
          <div
            ref={progressRef}
            className={cn(
              "h-full origin-left",
              config.color.replace("text-", "bg-")
            )}
            style={{ opacity: 0.8 }}
          />
          {/* Glow effect on progress */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${config.bgGlow}, transparent)`,
              animation: "shimmer 2s infinite",
            }}
          />
        </div>
      )}

      {/* Bottom data line */}
      <div className="px-4 py-1.5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-mono text-white/20 tracking-wider">
          ID:{toast.id.slice(-8).toUpperCase()}
        </span>
        <span className="text-[9px] font-mono text-white/20">
          {new Date().toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>
    </div>
  );
};

// Toast Container
export const TechToastContainer: React.FC = () => {
  const [toastList, setToastList] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    toastListeners.push(setToastList);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToastList);
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    techToast.dismiss(id);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      {toastList.map((toast) => (
        <TechToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

export default TechToastContainer;
