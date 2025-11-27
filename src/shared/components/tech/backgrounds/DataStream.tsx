"use client";
import React, { useEffect, useRef, useState } from "react";

interface DataStreamProps {
  className?: string;
  color?: string;
  speed?: number;
  density?: number;
}

export const DataStream: React.FC<DataStreamProps> = ({
  className = "",
  color = "#00ff88",
  speed = 50,
  density = 20,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [streams, setStreams] = useState<string[]>([]);

  useEffect(() => {
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    
    const generateStream = () => {
      return Array.from({ length: 30 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join("");
    };

    // Initialize streams
    setStreams(Array.from({ length: density }, generateStream));

    // Update streams periodically
    const interval = setInterval(() => {
      setStreams(prev => prev.map(stream => {
        const newChar = chars[Math.floor(Math.random() * chars.length)];
        return newChar + stream.slice(0, -1);
      }));
    }, speed);

    return () => clearInterval(interval);
  }, [density, speed]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <div className="flex justify-around h-full">
        {streams.map((stream, i) => (
          <div
            key={i}
            className="text-xs font-mono leading-tight opacity-20"
            style={{
              color,
              writingMode: "vertical-rl",
              textOrientation: "upright",
              animation: `dataStreamFall ${10 + i * 0.5}s linear infinite`,
              animationDelay: `${-i * 0.3}s`,
            }}
          >
            {stream.split("").map((char, j) => (
              <span
                key={j}
                style={{
                  opacity: 1 - j * 0.03,
                  textShadow: j === 0 ? `0 0 10px ${color}` : "none",
                }}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes dataStreamFall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default DataStream;
