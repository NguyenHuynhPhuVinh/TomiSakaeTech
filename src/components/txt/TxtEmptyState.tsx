"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { TechButton, PulseRing } from "@/components/ui/tech";
import { CodeIcon } from "@/components/icons/TechIcons";
import { Plus, Search } from "lucide-react";

interface TxtEmptyStateProps {
  isSearching: boolean;
  onCreateNew: () => void;
}

export const TxtEmptyState: React.FC<TxtEmptyStateProps> = ({
  isSearching,
  onCreateNew,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={containerRef} className="py-32 text-center relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <PulseRing color="#00d4ff" size={300} rings={5} speed={4} />
      </div>

      <div className="relative z-10">
        {isSearching ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-mono text-muted-foreground mb-2">
              NO_RESULTS_FOUND
            </h3>
            <p className="text-xs font-mono text-muted-foreground/60 mb-8">
              Try different search keywords
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 border-2 border-[#00d4ff]/30 flex items-center justify-center">
              <CodeIcon size={32} className="text-[#00d4ff]/50" />
            </div>
            <h3 className="text-lg font-mono text-muted-foreground mb-2">
              DATABASE_EMPTY
            </h3>
            <p className="text-xs font-mono text-muted-foreground/60 mb-8">
              Start by creating your first note
            </p>
            <TechButton
              variant="secondary"
              onClick={onCreateNew}
              icon={<Plus className="w-4 h-4" />}
              className="border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff] hover:text-black"
            >
              <span className="font-mono text-xs">CREATE_FIRST_NOTE</span>
            </TechButton>
          </>
        )}
      </div>
    </div>
  );
};

export default TxtEmptyState;
