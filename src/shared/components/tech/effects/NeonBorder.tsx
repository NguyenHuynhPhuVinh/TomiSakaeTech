"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  animated?: boolean;
  intensity?: "low" | "medium" | "high";
}

export const NeonBorder: React.FC<NeonBorderProps> = ({
  children,
  className = "",
  color = "#00ff88",
  animated = true,
  intensity = "medium",
}) => {
  const borderRef = useRef<HTMLDivElement>(null);

  const glowIntensity = {
    low: "0 0 5px",
    medium: "0 0 10px",
    high: "0 0 20px",
  };

  useEffect(() => {
    if (!animated || !borderRef.current) return;

    const borders = borderRef.current.querySelectorAll(".neon-line");
    
    gsap.to(borders, {
      opacity: 0.3,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      ease: "sine.inOut",
    });

    return () => {
      gsap.killTweensOf(borders);
    };
  }, [animated]);

  return (
    <div ref={borderRef} className={`relative ${className}`}>
      {/* Top border */}
      <div
        className="neon-line absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `${glowIntensity[intensity]} ${color}`,
        }}
      />
      {/* Bottom border */}
      <div
        className="neon-line absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `${glowIntensity[intensity]} ${color}`,
        }}
      />
      {/* Left border */}
      <div
        className="neon-line absolute top-0 bottom-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
          boxShadow: `${glowIntensity[intensity]} ${color}`,
        }}
      />
      {/* Right border */}
      <div
        className="neon-line absolute top-0 bottom-0 right-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
          boxShadow: `${glowIntensity[intensity]} ${color}`,
        }}
      />
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: color }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: color }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: color }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: color }} />
      
      {children}
    </div>
  );
};

export default NeonBorder;
