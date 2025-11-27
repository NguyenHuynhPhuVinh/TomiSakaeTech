"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface WaveformVisualizerProps {
  className?: string;
  color?: string;
  bars?: number;
  height?: number;
  active?: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  className = "",
  color = "#00ff88",
  bars = 20,
  height = 40,
  active = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !active) return;

    const barElements = containerRef.current.querySelectorAll(".wave-bar");
    
    barElements.forEach((bar) => {
      gsap.to(bar, {
        scaleY: Math.random() * 0.8 + 0.2,
        duration: 0.2 + Math.random() * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => {
      gsap.killTweensOf(barElements);
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      className={`flex items-end justify-center gap-0.5 ${className}`}
      style={{ height }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="wave-bar origin-bottom"
          style={{
            width: 3,
            height: "100%",
            backgroundColor: color,
            opacity: 0.6 + (i / bars) * 0.4,
            transform: `scaleY(${active ? 0.3 + Math.random() * 0.7 : 0.1})`,
          }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualizer;
