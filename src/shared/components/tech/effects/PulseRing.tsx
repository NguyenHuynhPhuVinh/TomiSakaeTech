"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface PulseRingProps {
  className?: string;
  color?: string;
  size?: number;
  rings?: number;
  speed?: number;
}

export const PulseRing: React.FC<PulseRingProps> = ({
  className = "",
  color = "#00ff88",
  size = 100,
  rings = 3,
  speed = 2,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ringElements = containerRef.current.querySelectorAll(".pulse-ring");
    
    ringElements.forEach((ring, i) => {
      gsap.fromTo(
        ring,
        { scale: 0.5, opacity: 0.8 },
        {
          scale: 2,
          opacity: 0,
          duration: speed,
          repeat: -1,
          delay: (i * speed) / rings,
          ease: "power1.out",
        }
      );
    });

    return () => {
      gsap.killTweensOf(ringElements);
    };
  }, [rings, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      
      {/* Pulse rings */}
      {Array.from({ length: rings }).map((_, i) => (
        <div
          key={i}
          className="pulse-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: size / 2,
            height: size / 2,
            borderColor: color,
          }}
        />
      ))}
    </div>
  );
};

export default PulseRing;
