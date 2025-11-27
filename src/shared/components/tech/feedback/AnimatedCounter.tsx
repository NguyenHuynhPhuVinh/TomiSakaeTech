"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  className = "",
  duration = 1,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef({ value: 0 });

  useEffect(() => {
    gsap.to(counterRef.current, {
      value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayValue(counterRef.current.value);
      },
    });
  }, [value, duration]);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
