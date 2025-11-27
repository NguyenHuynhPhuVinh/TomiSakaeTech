"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

interface TechTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  color?: string;
}

export const TechTooltip: React.FC<TechTooltipProps> = ({
  children,
  content,
  position = "top",
  color = "#00ff88",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tooltipRef.current) return;

    if (isVisible) {
      gsap.fromTo(
        tooltipRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [isVisible]);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-3 py-1.5 text-[10px] font-mono whitespace-nowrap ${positionClasses[position]}`}
          style={{
            backgroundColor: "hsl(var(--background))",
            border: `1px solid ${color}50`,
            color: color,
          }}
        >
          {content}
          <div
            className="absolute w-1.5 h-1.5 rotate-45"
            style={{
              backgroundColor: "hsl(var(--background))",
              borderRight: `1px solid ${color}50`,
              borderBottom: `1px solid ${color}50`,
              ...(position === "top" && { bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              ...(position === "bottom" && { top: -4, left: "50%", transform: "translateX(-50%) rotate(-135deg)" }),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TechTooltip;
