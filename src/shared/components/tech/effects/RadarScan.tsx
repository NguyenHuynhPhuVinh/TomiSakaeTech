"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface RadarScanProps {
  className?: string;
  color?: string;
  size?: number;
  speed?: number;
}

export const RadarScan: React.FC<RadarScanProps> = ({
  className = "",
  color = "#00ff88",
  size = 200,
  speed = 3,
}) => {
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scanElement = scanRef.current;
    if (!scanElement) return;

    gsap.to(scanElement, {
      rotation: 360,
      duration: speed,
      repeat: -1,
      ease: "none",
    });

    return () => {
      gsap.killTweensOf(scanElement);
    };
  }, [speed]);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Circles */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: size * scale,
            height: size * scale,
            borderColor: `${color}30`,
          }}
        />
      ))}

      {/* Cross lines */}
      <div
        className="absolute top-1/2 left-0 right-0 h-px"
        style={{ backgroundColor: `${color}20` }}
      />
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px"
        style={{ backgroundColor: `${color}20` }}
      />

      {/* Scan line */}
      <div
        ref={scanRef}
        className="absolute top-1/2 left-1/2 origin-left"
        style={{
          width: size / 2,
          height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          transform: "translateY(-50%)",
        }}
      />

      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Blips */}
      <div
        className="absolute w-1.5 h-1.5 rounded-full animate-ping"
        style={{
          backgroundColor: color,
          top: "30%",
          left: "60%",
          animationDuration: "2s",
        }}
      />
      <div
        className="absolute w-1.5 h-1.5 rounded-full animate-ping"
        style={{
          backgroundColor: color,
          top: "70%",
          left: "35%",
          animationDuration: "3s",
          animationDelay: "1s",
        }}
      />
    </div>
  );
};

export default RadarScan;
