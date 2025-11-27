"use client";
import React, { useEffect, useRef, useState } from "react";

interface VoidZoneProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
  active?: boolean;
}

export const VoidZone: React.FC<VoidZoneProps> = ({
  children,
  className = "",
  intensity = "high",
  active = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glitchState, setGlitchState] = useState({
    offsetX: 0,
    offsetY: 0,
    skewX: 0,
    clipTop: 0,
    clipBottom: 100,
    rgbSplit: 0,
    flicker: 1,
    sliceOffset: 0,
  });
  const [scanlinePos, setScanlinePos] = useState(0);
  const [corruptedSlices, setCorruptedSlices] = useState<number[]>([]);
  const [isHeavyGlitch, setIsHeavyGlitch] = useState(false);

  // Static noise canvas - more aggressive
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 50;
        const isCorrupted = Math.random() > 0.97;
        data[i] = isCorrupted ? 255 : noise;
        data[i + 1] = isCorrupted ? 0 : noise;
        data[i + 2] = isCorrupted ? 0 : noise;
        data[i + 3] = Math.random() * 25;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const interval = setInterval(drawNoise, 50);
    return () => clearInterval(interval);
  }, [active]);

  // Heavy glitch effect - random intense bursts
  useEffect(() => {
    if (!active) return;

    const intensityConfig = {
      low: { chance: 0.03, burstChance: 0.01 },
      medium: { chance: 0.08, burstChance: 0.03 },
      high: { chance: 0.15, burstChance: 0.06 },
    };
    const config = intensityConfig[intensity];

    const glitchInterval = setInterval(() => {
      // Random heavy glitch burst
      if (Math.random() < config.burstChance) {
        setIsHeavyGlitch(true);
        setTimeout(() => setIsHeavyGlitch(false), 100 + Math.random() * 200);
      }

      // Regular glitch
      if (Math.random() < config.chance) {
        setGlitchState({
          offsetX: (Math.random() - 0.5) * 15,
          offsetY: (Math.random() - 0.5) * 8,
          skewX: (Math.random() - 0.5) * 5,
          clipTop: Math.random() * 20,
          clipBottom: 80 + Math.random() * 20,
          rgbSplit: Math.random() * 8,
          flicker: 0.5 + Math.random() * 0.5,
          sliceOffset: (Math.random() - 0.5) * 30,
        });

        // Generate corrupted slices
        const slices: number[] = [];
        const numSlices = Math.floor(Math.random() * 5) + 2;
        for (let i = 0; i < numSlices; i++) {
          slices.push(Math.random() * 100);
        }
        setCorruptedSlices(slices);

        setTimeout(() => {
          setGlitchState({
            offsetX: 0,
            offsetY: 0,
            skewX: 0,
            clipTop: 0,
            clipBottom: 100,
            rgbSplit: 0,
            flicker: 1,
            sliceOffset: 0,
          });
          setCorruptedSlices([]);
        }, 50 + Math.random() * 150);
      }
    }, 80);

    return () => clearInterval(glitchInterval);
  }, [active, intensity]);

  // Scanline effect
  useEffect(() => {
    if (!active) return;
    const scanInterval = setInterval(() => {
      setScanlinePos((prev) => (prev + 3) % 100);
    }, 30);
    return () => clearInterval(scanInterval);
  }, [active]);

  if (!active) return <div className={className}>{children}</div>;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: `translate(${glitchState.offsetX}px, ${glitchState.offsetY}px) skewX(${glitchState.skewX}deg)`,
        opacity: glitchState.flicker,
        transition: "none",
      }}
    >
      {/* Heavy noise overlay */}
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 mix-blend-overlay"
        style={{ opacity: isHeavyGlitch ? 0.8 : 0.4 }}
      />

      {/* Multiple scanlines */}
      {[0, 33, 66].map((offset, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 h-px pointer-events-none z-20"
          style={{
            top: `${(scanlinePos + offset) % 100}%`,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }}
        />
      ))}

      {/* Corrupted horizontal slices */}
      {corruptedSlices.map((pos, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 pointer-events-none z-15"
          style={{
            top: `${pos}%`,
            height: `${2 + Math.random() * 8}px`,
            background: `linear-gradient(90deg, 
              transparent ${Math.random() * 20}%, 
              rgba(0,0,0,0.8) ${20 + Math.random() * 30}%, 
              rgba(50,50,50,0.5) ${50 + Math.random() * 20}%, 
              transparent ${80 + Math.random() * 20}%
            )`,
            transform: `translateX(${glitchState.sliceOffset}px)`,
          }}
        />
      ))}

      {/* RGB split - Red channel */}
      <div
        className="absolute inset-0 pointer-events-none z-5 mix-blend-screen"
        style={{
          background: "rgba(255,0,0,0.15)",
          transform: `translateX(${-glitchState.rgbSplit}px)`,
          clipPath: `polygon(0 ${glitchState.clipTop}%, 100% ${glitchState.clipTop}%, 100% ${glitchState.clipBottom}%, 0 ${glitchState.clipBottom}%)`,
        }}
      />

      {/* RGB split - Cyan channel */}
      <div
        className="absolute inset-0 pointer-events-none z-5 mix-blend-screen"
        style={{
          background: "rgba(0,255,255,0.15)",
          transform: `translateX(${glitchState.rgbSplit}px)`,
          clipPath: `polygon(0 ${glitchState.clipTop}%, 100% ${glitchState.clipTop}%, 100% ${glitchState.clipBottom}%, 0 ${glitchState.clipBottom}%)`,
        }}
      />

      {/* Glitch blocks */}
      {isHeavyGlitch && (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute pointer-events-none z-25"
              style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
                width: `${20 + Math.random() * 60}px`,
                height: `${5 + Math.random() * 20}px`,
                background: Math.random() > 0.5 ? "rgba(0,0,0,0.9)" : "rgba(80,80,80,0.7)",
                transform: `translateX(${(Math.random() - 0.5) * 40}px)`,
              }}
            />
          ))}
        </>
      )}

      {/* Data corruption text overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden opacity-10">
        <div className="absolute inset-0 font-mono text-[8px] text-gray-500 leading-none break-all select-none">
          {Array(50).fill("NULL_ERR0R_0x00000000_VOID_CORRUPT_DATA_LOST_").join("")}
        </div>
      </div>

      {/* Heavy vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Flickering border */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 border border-gray-700/50"
        style={{
          opacity: isHeavyGlitch ? 0.3 : 0.6,
          boxShadow: isHeavyGlitch ? "inset 0 0 30px rgba(0,0,0,0.8)" : "inset 0 0 20px rgba(0,0,0,0.5)",
        }}
      />

      {/* Content with heavy desaturate and darken */}
      <div 
        className="relative z-0"
        style={{
          filter: `grayscale(60%) brightness(${isHeavyGlitch ? 0.4 : 0.6}) contrast(120%) saturate(50%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default VoidZone;
