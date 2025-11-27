"use client";
import React from "react";
import { cn } from "@/shared/lib/utils";

interface TechBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  icon?: React.ReactNode;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  children,
  className,
  variant = "default",
  size = "md",
  pulse = false,
  icon,
}) => {
  const variantStyles = {
    default: {
      bg: "bg-foreground/10",
      text: "text-foreground",
      border: "border-foreground/30",
      dot: "#ffffff",
    },
    success: {
      bg: "bg-[#00ff88]/10",
      text: "text-[#00ff88]",
      border: "border-[#00ff88]/30",
      dot: "#00ff88",
    },
    warning: {
      bg: "bg-[#ffaa00]/10",
      text: "text-[#ffaa00]",
      border: "border-[#ffaa00]/30",
      dot: "#ffaa00",
    },
    error: {
      bg: "bg-[#ff4444]/10",
      text: "text-[#ff4444]",
      border: "border-[#ff4444]/30",
      dot: "#ff4444",
    },
    info: {
      bg: "bg-[#00aaff]/10",
      text: "text-[#00aaff]",
      border: "border-[#00aaff]/30",
      dot: "#00aaff",
    },
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[9px]",
    md: "px-3 py-1 text-[10px]",
    lg: "px-4 py-1.5 text-xs",
  };

  const style = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono tracking-wider border",
        style.bg,
        style.text,
        style.border,
        sizeStyles[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: style.dot }}
          />
          <span
            className="relative inline-flex rounded-full h-1.5 w-1.5"
            style={{ backgroundColor: style.dot }}
          />
        </span>
      )}
      {icon && <span className="opacity-70">{icon}</span>}
      {children}
    </span>
  );
};

export default TechBadge;
