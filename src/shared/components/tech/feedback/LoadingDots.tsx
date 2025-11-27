"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingDotsProps {
  className?: string;
  color?: string;
  size?: number;
  count?: number;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  className = "",
  color = "#00ff88",
  size = 8,
  count = 3,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const dots = containerRef.current.querySelectorAll(".loading-dot");
    
    gsap.to(dots, {
      y: -size,
      duration: 0.4,
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.15,
        repeat: -1,
      },
      ease: "power2.inOut",
    });

    return () => {
      gsap.killTweensOf(dots);
    };
  }, [size]);

  return (
    <div ref={containerRef} className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="loading-dot"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingDots;
