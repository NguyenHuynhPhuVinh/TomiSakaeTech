"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface CyberGridProps {
  className?: string;
  color?: string;
  perspective?: boolean;
}

export const CyberGrid: React.FC<CyberGridProps> = ({
  className = "",
  color = "#00ff88",
  perspective = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const lines = gridRef.current.querySelectorAll(".grid-line");
    
    gsap.fromTo(
      lines,
      { opacity: 0, scaleX: 0 },
      {
        opacity: 0.15,
        scaleX: 1,
        duration: 1,
        stagger: 0.05,
        ease: "power2.out",
      }
    );

    // Pulse animation
    gsap.to(lines, {
      opacity: 0.25,
      duration: 2,
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.1,
        from: "center",
      },
      ease: "sine.inOut",
      delay: 1,
    });

    return () => {
      gsap.killTweensOf(lines);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        perspective: perspective ? "1000px" : "none",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: perspective ? "rotateX(60deg) translateY(-50%)" : "none",
          transformOrigin: "center center",
        }}
      >
        {/* Horizontal lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="grid-line absolute left-0 right-0 h-px origin-center"
            style={{
              top: `${i * 5}%`,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />
        ))}
        {/* Vertical lines */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="grid-line absolute top-0 bottom-0 w-px origin-center"
            style={{
              left: `${i * 3.33}%`,
              background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CyberGrid;
