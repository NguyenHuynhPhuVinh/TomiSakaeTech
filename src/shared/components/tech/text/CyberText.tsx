"use client";
import React, { useEffect, useRef } from "react";

interface CyberTextProps {
  children: string;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  animated?: boolean;
}

export const CyberText: React.FC<CyberTextProps> = ({
  children,
  className = "",
  primaryColor = "#00ff88",
  secondaryColor = "#ff00ff",
  animated = true,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    if (!animated || !spanRef.current) return;

    const animate = () => {
      offsetRef.current = (offsetRef.current + 2) % 360;
      if (spanRef.current) {
        spanRef.current.style.background = `linear-gradient(${offsetRef.current}deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`;
        spanRef.current.style.backgroundClip = "text";
        spanRef.current.style.webkitBackgroundClip = "text";
        spanRef.current.style.webkitTextFillColor = "transparent";
        spanRef.current.style.backgroundSize = "200% 200%";
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animated, primaryColor, secondaryColor]);

  return (
    <span
      ref={spanRef}
      className={`relative inline-block font-mono font-bold ${className}`}
      style={{
        background: `linear-gradient(0deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
        backgroundSize: "200% 200%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        textShadow: `0 0 20px ${primaryColor}40, 0 0 40px ${secondaryColor}20`,
      }}
    >
      {children}
    </span>
  );
};

export default CyberText;
