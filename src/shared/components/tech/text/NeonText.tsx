"use client";
import React, { useEffect, useState } from "react";

interface NeonTextProps {
  children: string;
  className?: string;
  color?: string;
  flickerSpeed?: "slow" | "medium" | "fast" | "none";
  glowIntensity?: "low" | "medium" | "high";
}

export const NeonText: React.FC<NeonTextProps> = ({
  children,
  className = "",
  color = "#00ff88",
  flickerSpeed = "slow",
  glowIntensity = "medium",
}) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (flickerSpeed === "none") return;

    const speeds = { slow: 3000, medium: 1500, fast: 500 };
    const interval = setInterval(() => {
      setOpacity(Math.random() > 0.1 ? 1 : 0.7 + Math.random() * 0.3);
    }, speeds[flickerSpeed]);

    return () => clearInterval(interval);
  }, [flickerSpeed]);

  const glowSizes = {
    low: { blur1: 5, blur2: 10, blur3: 20 },
    medium: { blur1: 10, blur2: 20, blur3: 40 },
    high: { blur1: 15, blur2: 30, blur3: 60 },
  };
  const glow = glowSizes[glowIntensity];

  return (
    <span
      className={`relative inline-block font-bold ${className}`}
      style={{
        color,
        opacity,
        textShadow: `
          0 0 ${glow.blur1}px ${color},
          0 0 ${glow.blur2}px ${color},
          0 0 ${glow.blur3}px ${color}
        `,
        transition: "opacity 0.1s ease",
      }}
    >
      {children}
    </span>
  );
};

export default NeonText;
