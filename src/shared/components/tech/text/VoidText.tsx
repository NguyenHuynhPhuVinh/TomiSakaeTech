"use client";
import React, { useEffect, useState, useRef } from "react";

interface VoidTextProps {
  children: string;
  className?: string;
  color?: string;
  voidColor?: string;
}

export const VoidText: React.FC<VoidTextProps> = ({
  children,
  className = "",
  color = "#444444",
  voidColor = "#000000",
}) => {
  const [chars, setChars] = useState<string[]>(children.split(""));
  const [glitchIndex, setGlitchIndex] = useState(-1);
  const voidChars = "░▒▓█▀▄■□▪▫●○◌◍◎";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Random glitch effect
    intervalRef.current = setInterval(() => {
      const shouldGlitch = Math.random() > 0.7;
      if (shouldGlitch) {
        const idx = Math.floor(Math.random() * children.length);
        setGlitchIndex(idx);
        
        // Random void character replacement
        setChars(prev => {
          const newChars = [...children.split("")];
          if (Math.random() > 0.5) {
            newChars[idx] = voidChars[Math.floor(Math.random() * voidChars.length)];
          }
          return newChars;
        });

        // Reset after short delay
        setTimeout(() => {
          setChars(children.split(""));
          setGlitchIndex(-1);
        }, 100 + Math.random() * 150);
      }
    }, 200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [children]);

  return (
    <span className={`font-mono inline-block relative ${className}`}>
      {/* Corrupted background layer */}
      <span 
        className="absolute inset-0 opacity-30 blur-[1px]"
        style={{ color: voidColor }}
        aria-hidden
      >
        {chars.map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: i === glitchIndex ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)` : "none",
            }}
          >
            {char === " " ? "\u00A0" : voidChars[Math.floor(Math.random() * voidChars.length)]}
          </span>
        ))}
      </span>
      
      {/* Main text */}
      {chars.map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            color: i === glitchIndex ? voidColor : color,
            textShadow: i === glitchIndex 
              ? `0 0 10px ${voidColor}, 2px 0 ${color}, -2px 0 ${color}` 
              : `0 0 5px ${color}40`,
            transform: i === glitchIndex 
              ? `translateY(${Math.random() * 4 - 2}px) skewX(${Math.random() * 10 - 5}deg)` 
              : "none",
            opacity: i === glitchIndex ? 0.7 : 0.6,
            transition: "none",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default VoidText;
