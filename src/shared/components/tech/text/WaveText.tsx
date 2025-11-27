"use client";
import React, { useEffect, useState } from "react";

interface WaveTextProps {
  children: string;
  className?: string;
  color?: string;
  waveHeight?: number;
  speed?: number;
}

export const WaveText: React.FC<WaveTextProps> = ({
  children,
  className = "",
  color = "#00ff88",
  waveHeight = 5,
  speed = 100,
}) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev + 0.15);
    }, speed);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <span className={`inline-flex font-mono ${className}`}>
      {children.split("").map((char, i) => (
        <span
          key={i}
          style={{
            color,
            display: "inline-block",
            transform: `translateY(${Math.sin(offset + i * 0.3) * waveHeight}px)`,
            transition: "transform 0.1s ease",
            textShadow: `0 0 10px ${color}60`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default WaveText;
