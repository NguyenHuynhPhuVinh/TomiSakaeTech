"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface Pixel {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface MagneticPixelsProps {
  pixelSize?: number;
  gridGap?: number;
  color?: string;
  mouseRadius?: number;
  mouseStrength?: number;
  springStrength?: number;
  friction?: number;
  className?: string;
}

export const MagneticPixels: React.FC<MagneticPixelsProps> = ({
  pixelSize = 4,
  gridGap = 40,
  color = "#00ff88",
  mouseRadius = 120,
  mouseStrength = 0.4,
  springStrength = 0.08,
  friction = 0.85,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Parse color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 0, g: 255, b: 136 };
  };

  const rgb = hexToRgb(color);

  // Initialize pixels grid
  const initPixels = useCallback((width: number, height: number) => {
    const pixels: Pixel[] = [];
    const cols = Math.ceil(width / gridGap);
    const rows = Math.ceil(height / gridGap);

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * gridGap;
        const y = j * gridGap;
        pixels.push({
          originX: x,
          originY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          size: pixelSize + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.4,
        });
      }
    }
    return pixels;
  }, [gridGap, pixelSize]);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      pixelsRef.current = initPixels(width, height);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [initPixels]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x: mouseX, y: mouseY } = mouseRef.current;
    const pixels = pixelsRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pixels.forEach((pixel) => {
      // Calculate distance from mouse
      const dx = mouseX - pixel.x;
      const dy = mouseY - pixel.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Mouse repulsion (push away from cursor)
      if (distance < mouseRadius && distance > 0) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        pixel.vx -= Math.cos(angle) * force * mouseStrength;
        pixel.vy -= Math.sin(angle) * force * mouseStrength;
      }

      // Spring force back to origin
      const springDx = pixel.originX - pixel.x;
      const springDy = pixel.originY - pixel.y;
      pixel.vx += springDx * springStrength;
      pixel.vy += springDy * springStrength;

      // Apply friction
      pixel.vx *= friction;
      pixel.vy *= friction;

      // Update position
      pixel.x += pixel.vx;
      pixel.y += pixel.vy;

      // Calculate displacement for visual effects
      const displacement = Math.sqrt(
        Math.pow(pixel.x - pixel.originX, 2) + 
        Math.pow(pixel.y - pixel.originY, 2)
      );
      const glowIntensity = Math.min(displacement / 50, 1);

      // Draw pixel
      ctx.save();

      // Glow effect when displaced
      if (glowIntensity > 0.1) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 8 * glowIntensity;
      }

      // Main pixel
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pixel.opacity + glowIntensity * 0.3})`;
      ctx.fillRect(
        pixel.x - pixel.size / 2,
        pixel.y - pixel.size / 2,
        pixel.size,
        pixel.size
      );

      ctx.restore();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [color, rgb, mouseRadius, mouseStrength, springStrength, friction]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`fixed inset-0 pointer-events-none ${className}`}
    />
  );
};

export default MagneticPixels;
