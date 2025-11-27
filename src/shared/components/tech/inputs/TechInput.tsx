"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/shared/lib/utils";

interface TechInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  accentColor?: string;
}

export const TechInput: React.FC<TechInputProps> = ({
  label,
  icon,
  error,
  accentColor = "#00ff88",
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (underlineRef.current) {
      gsap.to(underlineRef.current, {
        scaleX: isFocused ? 1 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isFocused]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] font-mono text-muted-foreground mb-2 tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: isFocused ? accentColor : "hsl(var(--muted-foreground))" }}
          >
            {icon}
          </div>
        )}
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "w-full bg-transparent border border-border px-4 py-3 text-sm font-mono outline-hidden transition-colors",
            icon && "pl-10",
            error && "border-red-500",
            className
          )}
          style={{
            borderColor: isFocused ? accentColor : undefined,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border overflow-hidden">
          <div
            ref={underlineRef}
            className="h-full origin-center"
            style={{
              backgroundColor: error ? "#ff4444" : accentColor,
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-[10px] font-mono text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TechInput;
