"use client";
import React, { useEffect, useState, useRef } from "react";

interface ScrambleTextProps {
  children: string;
  className?: string;
  color?: string;
  scrambleSpeed?: number;
  revealDelay?: number;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  children,
  className = "",
  color = "#00ff88",
  scrambleSpeed = 40,
  revealDelay = 100,
}) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const frameRef = useRef(0);
  const resolveRef = useRef(0);

  useEffect(() => {
    const target = children;
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];

    for (let i = 0; i < target.length; i++) {
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from: "", to: target[i], start, end });
    }

    let frame = 0;
    const update = () => {
      let output = "";
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        const { from, to, start, end } = queue[i];
        let char = queue[i].char;

        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = char;
          }
          output += `<span style="color: ${color}80">${char}</span>`;
        } else {
          output += from;
        }
      }

      setDisplayText(output);
      frame++;

      if (complete < queue.length) {
        frameRef.current = requestAnimationFrame(update);
      }
    };

    const timeout = setTimeout(() => {
      frameRef.current = requestAnimationFrame(update);
    }, revealDelay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [children, color, revealDelay]);

  return (
    <span
      className={`font-mono inline-block ${className}`}
      style={{ color }}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  );
};

export default ScrambleText;
