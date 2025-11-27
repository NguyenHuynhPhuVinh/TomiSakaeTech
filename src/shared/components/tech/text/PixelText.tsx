"use client";
import React, { useEffect, useState, useRef } from "react";

interface PixelTextProps {
  children: string;
  className?: string;
  color?: string;
  pixelSize?: number;
  animateOnHover?: boolean;
  scrambleOnMount?: boolean;
}

export const PixelText: React.FC<PixelTextProps> = ({
  children,
  className = "",
  color = "#00ff88",
  pixelSize = 3,
  animateOnHover = true,
  scrambleOnMount = true,
}) => {
  const [displayText, setDisplayText] = useState(scrambleOnMount ? "" : children);
  const [isHovering, setIsHovering] = useState(false);
  const chars = "█▓▒░■□▪▫●○◆◇";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!scrambleOnMount) return;
    
    let currentIndex = 0;
    const targetText = children;
    
    const animate = () => {
      if (currentIndex <= targetText.length) {
        const revealed = targetText.slice(0, currentIndex);
        const scrambled = targetText
          .slice(currentIndex)
          .split("")
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join("");
        setDisplayText(revealed + scrambled);
        currentIndex++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    intervalRef.current = setInterval(animate, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [children, scrambleOnMount]);

  useEffect(() => {
    if (!animateOnHover || !isHovering) return;

    const scramble = () => {
      const scrambled = children
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          return Math.random() > 0.7 ? chars[Math.floor(Math.random() * chars.length)] : char;
        })
        .join("");
      setDisplayText(scrambled);
    };

    const interval = setInterval(scramble, 100);
    return () => {
      clearInterval(interval);
      setDisplayText(children);
    };
  }, [isHovering, children, animateOnHover]);

  return (
    <span
      className={`font-mono inline-block ${className}`}
      style={{
        color,
        textShadow: `0 0 ${pixelSize}px ${color}40`,
        letterSpacing: "0.05em",
        imageRendering: "pixelated",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {displayText}
    </span>
  );
};

export default PixelText;
