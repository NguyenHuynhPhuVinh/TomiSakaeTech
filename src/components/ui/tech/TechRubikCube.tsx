"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "idle" | "glitch" | "explode";

interface TechRubikCubeProps {
  size?: number;
  color?: string;
  className?: string;
  holdDuration?: number;
  onHoldComplete?: () => void;
}

export const TechRubikCube: React.FC<TechRubikCubeProps> = ({
  size = 60,
  color = "#00ff88",
  className = "",
  onHoldComplete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const glitchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cubeSize = size / 3;
  const gap = 2;

  // Phase transitions on hover
  useEffect(() => {
    if (isHovered) {
      // Start glitch phase immediately
      setPhase("glitch");
      
      // After 600ms of glitching, explode
      glitchTimerRef.current = setTimeout(() => {
        setPhase("explode");
      }, 600);
      
      // After explosion animation (600ms glitch + 400ms explode), trigger callback immediately
      timerRef.current = setTimeout(() => {
        onHoldComplete?.();
      }, 1000); // glitch 600ms + explode 400ms = 1000ms total
    } else {
      setPhase("idle");
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, [isHovered, onHoldComplete]);

  // Generate cube data with stable random values
  const cubes = useMemo(() => {
    const result: { 
      x: number; y: number; z: number; 
      explodeX: number; explodeY: number; explodeZ: number;
      explodeRotX: number; explodeRotY: number; explodeRotZ: number;
      delay: number;
    }[] = [];
    
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          if (x === 1 && y === 1 && z === 1) continue;
          
          // Random explosion positions - completely random directions
          const randomX = (Math.random() - 0.5) * 400; // -200 to 200
          const randomY = (Math.random() - 0.5) * 400;
          const randomZ = (Math.random() - 0.5) * 300;
          
          result.push({
            x: (x - 1) * (cubeSize + gap),
            y: (y - 1) * (cubeSize + gap),
            z: (z - 1) * (cubeSize + gap),
            explodeX: randomX,
            explodeY: randomY,
            explodeZ: randomZ,
            explodeRotX: (Math.random() - 0.5) * 1440, // more rotation
            explodeRotY: (Math.random() - 0.5) * 1440,
            explodeRotZ: (Math.random() - 0.5) * 1440,
            delay: Math.random() * 0.1,
          });
        }
      }
    }
    return result;
  }, [cubeSize, gap]);

  // Glitch effect colors
  const glitchColors = ["#ff0040", "#00ff88", "#00d4ff", "#ff00ff", "#ffff00"];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "500px" }}
    >
      <AnimatePresence>
        {phase !== "explode" || !isHovered ? null : (
          // Explosion flash
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ backgroundColor: "#ff0040" }}
          />
        )}
      </AnimatePresence>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-xl"
        style={{ backgroundColor: phase === "glitch" ? "#ff0040" : color }}
        animate={{
          opacity: phase === "glitch" ? [0.3, 0.8, 0.2, 0.9, 0.4] : phase === "explode" ? 0 : 0.15,
          scale: phase === "glitch" ? [1, 1.5, 0.8, 1.3, 1] : 1,
        }}
        transition={{ 
          duration: phase === "glitch" ? 0.15 : 0.3,
          repeat: phase === "glitch" ? Infinity : 0,
        }}
      />

      {/* Error/Warning overlays during glitch only */}
      {phase === "glitch" && (
        <>
          {/* Glitch scanlines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[2px]"
                style={{ 
                  top: `${20 + i * 15}%`,
                  background: glitchColors[i % glitchColors.length],
                  filter: "blur(1px)",
                }}
                animate={{ 
                  x: [-20, 20, -10, 15, 0],
                  opacity: [1, 0.5, 1, 0.3, 1],
                }}
                transition={{ duration: 0.08, repeat: Infinity, delay: i * 0.02 }}
              />
            ))}
          </motion.div>

          {/* Error text flashing */}
          <motion.div
            animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-[10px] font-mono text-red-500 font-bold">
              ⚠ ERROR_0x3F7
            </span>
          </motion.div>
        </>
      )}

      {/* Main cube container */}
      <motion.div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: phase === "glitch" ? [-25, -30, -20, -28, -25] : -25,
          rotateY: phase === "glitch" ? [45, 50, 40, 48, 45] : 45,
          x: phase === "glitch" ? [-3, 3, -2, 4, 0] : 0,
          y: phase === "glitch" ? [2, -2, 3, -1, 0] : 0,
        }}
        transition={{
          duration: phase === "glitch" ? 0.1 : 0.5,
          repeat: phase === "glitch" ? Infinity : 0,
          ease: "linear",
        }}
      >
        {cubes.map((cube, index) => {
          const glitchBorderColors = ["#ff0040", "#ff00ff", "#00d4ff", "#ffff00"];
          const glitchBgColors = ["#ff004050", "#ff00ff40", "#00d4ff40", "#ffff0040"];
          const faceColorIndex = index % glitchBorderColors.length;
          
          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                width: cubeSize,
                height: cubeSize,
                transformStyle: "preserve-3d",
                left: "50%",
                top: "50%",
              }}
              animate={{
                x: phase === "explode" 
                  ? cube.explodeX - cubeSize / 2 
                  : phase === "glitch"
                  ? [cube.x - cubeSize / 2 - 3, cube.x - cubeSize / 2 + 4, cube.x - cubeSize / 2 - 2, cube.x - cubeSize / 2 + 3, cube.x - cubeSize / 2]
                  : cube.x - cubeSize / 2,
                y: phase === "explode" 
                  ? cube.explodeY - cubeSize / 2 
                  : phase === "glitch"
                  ? [cube.y - cubeSize / 2 + 3, cube.y - cubeSize / 2 - 3, cube.y - cubeSize / 2 + 2, cube.y - cubeSize / 2 - 2, cube.y - cubeSize / 2]
                  : cube.y - cubeSize / 2,
                z: phase === "explode" ? cube.explodeZ : cube.z,
                rotateX: phase === "explode" ? cube.explodeRotX : 0,
                rotateY: phase === "explode" ? cube.explodeRotY : 0,
                rotateZ: phase === "explode" ? cube.explodeRotZ : 0,
              }}
              transition={{
                duration: phase === "explode" ? 0.8 : phase === "glitch" ? 0.04 : 0.3,
                delay: phase === "explode" ? cube.delay * 0.3 : 0,
                repeat: phase === "glitch" ? Infinity : 0,
                ease: phase === "explode" ? [0.25, 0.46, 0.45, 0.94] : "linear",
              }}
            >
              {/* Front face */}
              <motion.div
                className="absolute inset-0 border-2"
                style={{
                  transform: `translateZ(${cubeSize / 2}px)`,
                }}
                animate={{
                  borderColor: phase === "glitch" 
                    ? [color, glitchBorderColors[faceColorIndex], glitchBorderColors[(faceColorIndex + 1) % 4], color]
                    : color,
                  backgroundColor: phase === "glitch"
                    ? [`${color}15`, glitchBgColors[faceColorIndex], glitchBgColors[(faceColorIndex + 2) % 4], `${color}15`]
                    : `${color}15`,
                  boxShadow: phase === "glitch"
                    ? [`inset 0 0 ${cubeSize / 2}px ${glitchBorderColors[faceColorIndex]}80`, `inset 0 0 ${cubeSize}px ${glitchBorderColors[(faceColorIndex + 1) % 4]}90`, `inset 0 0 ${cubeSize / 2}px ${color}40`]
                    : `inset 0 0 ${cubeSize / 4}px ${color}40`,
                }}
                transition={{
                  duration: 0.06,
                  repeat: phase === "glitch" ? Infinity : 0,
                }}
              />
              {/* Back face */}
              <motion.div
                className="absolute inset-0 border-2"
                style={{
                  transform: `translateZ(-${cubeSize / 2}px) rotateY(180deg)`,
                }}
                animate={{
                  borderColor: phase === "glitch" 
                    ? [`${color}80`, glitchBorderColors[(faceColorIndex + 1) % 4], `${color}80`]
                    : `${color}80`,
                  backgroundColor: phase === "glitch"
                    ? [`${color}10`, glitchBgColors[(faceColorIndex + 1) % 4], `${color}10`]
                    : `${color}10`,
                }}
                transition={{
                  duration: 0.08,
                  repeat: phase === "glitch" ? Infinity : 0,
                }}
              />
              {/* Left face */}
              <motion.div
                className="absolute inset-0 border-2"
                style={{
                  transform: `translateX(-${cubeSize / 2}px) rotateY(-90deg)`,
                }}
                animate={{
                  borderColor: phase === "glitch" 
                    ? [`${color}90`, glitchBorderColors[(faceColorIndex + 2) % 4], `${color}90`]
                    : `${color}90`,
                  backgroundColor: phase === "glitch"
                    ? [`${color}12`, glitchBgColors[(faceColorIndex + 2) % 4], `${color}12`]
                    : `${color}12`,
                }}
                transition={{
                  duration: 0.07,
                  repeat: phase === "glitch" ? Infinity : 0,
                }}
              />
              {/* Right face */}
              <motion.div
                className="absolute inset-0 border-2"
                style={{
                  transform: `translateX(${cubeSize / 2}px) rotateY(90deg)`,
                }}
                animate={{
                  borderColor: phase === "glitch" 
                    ? [`${color}90`, glitchBorderColors[(faceColorIndex + 3) % 4], `${color}90`]
                    : `${color}90`,
                  backgroundColor: phase === "glitch"
                    ? [`${color}12`, glitchBgColors[(faceColorIndex + 3) % 4], `${color}12`]
                    : `${color}12`,
                }}
                transition={{
                  duration: 0.09,
                  repeat: phase === "glitch" ? Infinity : 0,
                }}
              />
              {/* Top face */}
              <motion.div
                className="absolute inset-0 border-2"
                style={{
                  transform: `translateY(-${cubeSize / 2}px) rotateX(90deg)`,
                }}
                animate={{
                  borderColor: phase === "glitch" 
                    ? [color, glitchBorderColors[faceColorIndex], "#ff0040", color]
                    : color,
                  backgroundColor: phase === "glitch"
                    ? [`${color}18`, glitchBgColors[faceColorIndex], "#ff004060", `${color}18`]
                    : `${color}18`,
                  boxShadow: phase === "glitch"
                    ? [`inset 0 0 ${cubeSize / 2}px #ff004080`, `inset 0 0 ${cubeSize}px #ff00ff90`, `inset 0 0 ${cubeSize / 3}px ${color}50`]
                    : `inset 0 0 ${cubeSize / 3}px ${color}50`,
                }}
                transition={{
                  duration: 0.05,
                  repeat: phase === "glitch" ? Infinity : 0,
                }}
              />
              {/* Bottom face */}
              <motion.div
                className="absolute inset-0 border-2"
                style={{
                  transform: `translateY(${cubeSize / 2}px) rotateX(-90deg)`,
                }}
                animate={{
                  borderColor: phase === "glitch" 
                    ? [`${color}60`, glitchBorderColors[(faceColorIndex + 2) % 4], `${color}60`]
                    : `${color}60`,
                  backgroundColor: phase === "glitch"
                    ? [`${color}08`, glitchBgColors[(faceColorIndex + 1) % 4], `${color}08`]
                    : `${color}08`,
                }}
                transition={{
                  duration: 0.1,
                  repeat: phase === "glitch" ? Infinity : 0,
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Corner brackets with glitch - hide completely when explode */}
      {phase !== "explode" && (
        <motion.div 
          className="absolute -inset-2 pointer-events-none"
          animate={{
            x: phase === "glitch" ? [-2, 2, -1, 3, 0] : 0,
          }}
          transition={{
            duration: phase === "glitch" ? 0.08 : 0.3,
            repeat: phase === "glitch" ? Infinity : 0,
          }}
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: phase === "glitch" ? "#ff0040" : color }} />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: phase === "glitch" ? "#00d4ff" : color }} />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: phase === "glitch" ? "#ff00ff" : color }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: phase === "glitch" ? "#ffff00" : color }} />
        </motion.div>
      )}

      {/* Label - hide when explode */}
      {phase !== "explode" && (
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
          animate={{ 
            opacity: phase === "glitch" ? [0.5, 1, 0.3, 1] : 0.5,
            x: phase === "glitch" ? [-2, 2, -1, 0] : 0,
          }}
          transition={{ 
            duration: phase === "glitch" ? 0.1 : 0.2,
            repeat: phase === "glitch" ? Infinity : 0,
          }}
        >
          <span 
            className="text-[8px] font-mono tracking-wider" 
            style={{ color: phase === "glitch" ? "#ff0040" : color }}
          >
            {phase === "glitch" ? "CRITICAL_FAIL" : "HOVER_ME"}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default TechRubikCube;
