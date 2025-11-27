"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";

interface HackerTextProps {
  children: string;
  className?: string;
  color?: string;
  speed?: number;
  triggerOnHover?: boolean;
}

export const HackerText: React.FC<HackerTextProps> = ({
  children,
  className = "",
  color = "#00ff88",
  speed = 30,
  triggerOnHover = true,
}) => {
  const [displayText, setDisplayText] = useState(children);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef(false);

  const animate = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    let iteration = 0;
    const target = children.toUpperCase();

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return target[index];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      if (iteration >= target.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        isAnimatingRef.current = false;
      }
      iteration += 1 / 3;
    }, speed);
  }, [children, speed]);

  useEffect(() => {
    if (!triggerOnHover) animate();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animate, triggerOnHover]);

  return (
    <span
      className={`font-mono inline-block cursor-default ${className}`}
      style={{ color }}
      onMouseEnter={triggerOnHover ? animate : undefined}
    >
      {displayText}
    </span>
  );
};

export default HackerText;
