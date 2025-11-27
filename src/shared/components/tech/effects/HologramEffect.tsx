"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface HologramEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  scanSpeed?: number;
  flickerIntensity?: number;
}

export const HologramEffect: React.FC<HologramEffectProps> = ({
  children,
  className = "",
  color = "#00ff88",
  scanSpeed = 3,
  flickerIntensity = 0.1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scanLine = scanLineRef.current;
    
    if (!container || !scanLine) return;

    // Scan line animation
    gsap.to(scanLine, {
      y: "100%",
      duration: scanSpeed,
      repeat: -1,
      ease: "none",
    });

    // Flicker effect
    const flicker = () => {
      if (!container) return;
      
      gsap.to(container, {
        opacity: 1 - Math.random() * flickerIntensity,
        duration: 0.05,
        onComplete: () => {
          gsap.to(container, {
            opacity: 1,
            duration: 0.05,
          });
        },
      });
    };

    const flickerInterval = setInterval(flicker, 2000 + Math.random() * 3000);

    return () => {
      clearInterval(flickerInterval);
      gsap.killTweensOf(scanLine);
    };
  }, [scanSpeed, flickerIntensity]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        textShadow: `0 0 10px ${color}40, 0 0 20px ${color}20`,
      }}
    >
      {/* Scan lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${color}05 2px,
            ${color}05 4px
          )`,
        }}
      />
      
      {/* Moving scan line */}
      <div
        ref={scanLineRef}
        className="absolute left-0 right-0 h-8 pointer-events-none"
        style={{
          top: "-100%",
          background: `linear-gradient(180deg, transparent, ${color}20, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Chromatic aberration effect on edges */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          boxShadow: `inset 2px 0 ${color}, inset -2px 0 #ff00ff40`,
        }}
      />
    </div>
  );
};

export default HologramEffect;
