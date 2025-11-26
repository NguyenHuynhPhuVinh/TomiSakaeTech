'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FileDeleteEffectProps {
  isDeleting: boolean;
  onComplete?: () => void;
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

// Main component - Glitch từ từ tới mất
export function FileDeleteEffect({
  isDeleting,
  onComplete,
  children,
  className,
  duration = 2500,
}: FileDeleteEffectProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);
  
  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isDeleting) {
      setProgress(0);
      hasCompletedRef.current = false;
      return;
    }

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current?.();
      }
    };

    requestAnimationFrame(animate);
  }, [isDeleting, duration]);

  // Tính toán cường độ glitch dựa trên progress
  // 0-30%: nhẹ, 30-70%: mạnh dần, 70-100%: cực mạnh + fade out
  const getGlitchIntensity = () => {
    if (progress < 0.3) return progress / 0.3 * 0.3; // 0 -> 0.3
    if (progress < 0.7) return 0.3 + ((progress - 0.3) / 0.4) * 0.5; // 0.3 -> 0.8
    return 0.8 + ((progress - 0.7) / 0.3) * 0.2; // 0.8 -> 1
  };

  const intensity = getGlitchIntensity();
  
  // Opacity giảm dần ở cuối
  const getOpacity = () => {
    if (progress < 0.6) return 1;
    return 1 - ((progress - 0.6) / 0.4);
  };

  // Random glitch offset
  const getRandomOffset = (max: number) => {
    return (Math.random() - 0.5) * 2 * max * intensity;
  };

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {isDeleting ? (
          <motion.div
            key="deleting"
            className="relative"
            style={{ opacity: getOpacity() }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Layer chính - Card gốc với glitch */}
            <motion.div
              className="relative"
              animate={{
                x: intensity > 0.2 ? [0, getRandomOffset(8), getRandomOffset(5), 0] : 0,
                y: intensity > 0.3 ? [0, getRandomOffset(3), 0] : 0,
                skewX: intensity > 0.5 ? [0, getRandomOffset(2), 0] : 0,
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              {children}
            </motion.div>

            {/* RGB Split - Red layer */}
            {intensity > 0.15 && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  mixBlendMode: 'screen',
                }}
                animate={{
                  x: [intensity * 3, -intensity * 4, intensity * 2],
                  opacity: [0.4 * intensity, 0.6 * intensity, 0.3 * intensity],
                }}
                transition={{
                  duration: 0.15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <div className="w-full h-full" style={{ filter: 'url(#redChannel)' }}>
                  {children}
                </div>
              </motion.div>
            )}

            {/* RGB Split - Cyan layer */}
            {intensity > 0.15 && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  mixBlendMode: 'screen',
                }}
                animate={{
                  x: [-intensity * 3, intensity * 4, -intensity * 2],
                  opacity: [0.3 * intensity, 0.5 * intensity, 0.4 * intensity],
                }}
                transition={{
                  duration: 0.12,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <div className="w-full h-full" style={{ filter: 'url(#cyanChannel)' }}>
                  {children}
                </div>
              </motion.div>
            )}

            {/* Scan lines */}
            {intensity > 0.1 && (
              <div 
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 0, 0, ${0.1 * intensity}) 2px,
                    rgba(0, 0, 0, ${0.1 * intensity}) 4px
                  )`,
                  opacity: intensity,
                }}
              />
            )}

            {/* Horizontal glitch bars */}
            {intensity > 0.3 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(Math.floor(intensity * 5))].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-0 right-0 bg-[#00ffff]/20"
                    style={{
                      height: `${2 + Math.random() * 6}px`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      x: [0, getRandomOffset(20), 0],
                      opacity: [0, 0.8, 0],
                      scaleX: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                      duration: 0.2 + Math.random() * 0.3,
                      repeat: Infinity,
                      delay: Math.random() * 0.5,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Noise overlay */}
            {intensity > 0.2 && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  opacity: intensity * 0.15,
                  mixBlendMode: 'overlay',
                }}
                animate={{
                  opacity: [intensity * 0.1, intensity * 0.2, intensity * 0.1],
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                }}
              />
            )}

            {/* Glitch text overlay */}
            {intensity > 0.4 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{
                  opacity: [0, intensity * 0.8, 0],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                }}
              >
                <span 
                  className="font-mono text-[10px] tracking-widest text-[#ff0040]"
                  style={{
                    textShadow: '0 0 5px #ff0040, 0 0 10px #00ffff',
                  }}
                >
                  {progress < 0.5 ? 'DELETING...' : progress < 0.8 ? 'ERASING...' : 'TERMINATED'}
                </span>
              </motion.div>
            )}

            {/* Border glitch */}
            {intensity > 0.25 && (
              <motion.div
                className="absolute inset-0 pointer-events-none border-2 border-[#ff0040]/50"
                animate={{
                  opacity: [0, 1, 0],
                  borderColor: ['rgba(255,0,64,0.5)', 'rgba(0,255,255,0.5)', 'rgba(255,0,64,0.5)'],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                }}
              />
            )}

            {/* Final dissolve effect */}
            {progress > 0.7 && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
                }}
                initial={{ opacity: 0, y: '100%' }}
                animate={{ 
                  opacity: (progress - 0.7) / 0.3,
                  y: `${100 - ((progress - 0.7) / 0.3) * 100}%`,
                }}
              />
            )}

            {/* SVG Filters for RGB split */}
            <svg className="absolute w-0 h-0">
              <defs>
                <filter id="redChannel">
                  <feColorMatrix
                    type="matrix"
                    values="1 0 0 0 0
                            0 0 0 0 0
                            0 0 0 0 0
                            0 0 0 1 0"
                  />
                </filter>
                <filter id="cyanChannel">
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 1 0"
                  />
                </filter>
              </defs>
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for easy usage
export function useFileDeleteEffect() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const startDelete = useCallback((id: string) => {
    setDeletingId(id);
  }, []);
  
  const onDeleteComplete = useCallback(() => {
    setDeletingId(null);
  }, []);
  
  return {
    deletingId,
    startDelete,
    onDeleteComplete,
    isDeleting: (id: string) => deletingId === id,
  };
}

export default FileDeleteEffect;
