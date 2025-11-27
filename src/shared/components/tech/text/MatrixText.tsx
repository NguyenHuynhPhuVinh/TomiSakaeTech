"use client";
import React, { useEffect, useState, useRef } from "react";

interface MatrixTextProps {
  children: string;
  className?: string;
  color?: string;
  speed?: number;
  continuous?: boolean;
}

export const MatrixText: React.FC<MatrixTextProps> = ({
  children,
  className = "",
  color = "#00ff88",
  speed = 50,
  continuous = false,
}) => {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const targetText = children;

  useEffect(() => {
    const textArray = targetText.split("");
    const revealed = new Array(textArray.length).fill(false);
    let iterations = 0;

    const animate = () => {
      const newDisplay = textArray.map((char, i) => {
        if (char === " ") return " ";
        if (revealed[i]) return char;
        if (iterations > i * 2) {
          revealed[i] = true;
          return char;
        }
        return matrixChars[Math.floor(Math.random() * matrixChars.length)];
      });

      setDisplayText(newDisplay);
      iterations++;

      if (revealed.every(Boolean) && !continuous) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    intervalRef.current = setInterval(animate, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [targetText, speed, continuous]);

  return (
    <span className={`font-mono inline-block ${className}`}>
      {displayText.map((char, i) => (
        <span
          key={i}
          style={{
            color: char === targetText[i] ? color : `${color}80`,
            textShadow: char === targetText[i] ? `0 0 10px ${color}` : "none",
            transition: "all 0.1s ease",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default MatrixText;
