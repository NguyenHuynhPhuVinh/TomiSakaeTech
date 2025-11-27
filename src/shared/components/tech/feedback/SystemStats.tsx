"use client";
import React, { useEffect, useState } from "react";
import { TechProgress, AnimatedCounter, TechBadge } from "@/shared/components/tech";

interface SystemStatsProps {
  className?: string;
  storageUsed?: number;
  storageTotal?: number;
  filesCount?: number;
  isOnline?: boolean;
}

export const SystemStats: React.FC<SystemStatsProps> = ({
  className = "",
  storageUsed = 0,
  storageTotal = 100,
  filesCount = 0,
  isOnline = true,
}) => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memUsage, setMemUsage] = useState(0);

  // Simulate system stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.random() * 30 + 10);
      setMemUsage(Math.random() * 20 + 40);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const storagePercent = storageTotal > 0 ? (storageUsed / storageTotal) * 100 : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">STATUS</span>
        <TechBadge variant={isOnline ? "success" : "error"} size="sm" pulse={isOnline}>
          {isOnline ? "ONLINE" : "OFFLINE"}
        </TechBadge>
      </div>

      {/* Storage */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-muted-foreground">STORAGE</span>
          <span className="text-[10px] font-mono text-[#00ff88]">
            <AnimatedCounter value={storagePercent} decimals={1} suffix="%" />
          </span>
        </div>
        <TechProgress value={storagePercent} max={100} height="sm" color="#00ff88" />
      </div>

      {/* CPU */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-muted-foreground">CPU</span>
          <span className="text-[10px] font-mono text-[#00aaff]">
            <AnimatedCounter value={cpuUsage} decimals={1} suffix="%" />
          </span>
        </div>
        <TechProgress value={cpuUsage} max={100} height="sm" color="#00aaff" />
      </div>

      {/* Memory */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-muted-foreground">MEMORY</span>
          <span className="text-[10px] font-mono text-[#ffaa00]">
            <AnimatedCounter value={memUsage} decimals={1} suffix="%" />
          </span>
        </div>
        <TechProgress value={memUsage} max={100} height="sm" color="#ffaa00" />
      </div>

      {/* Files count */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-[10px] font-mono text-muted-foreground">TOTAL_FILES</span>
        <span className="text-sm font-mono font-bold text-foreground">
          <AnimatedCounter value={filesCount} />
        </span>
      </div>
    </div>
  );
};

export default SystemStats;
