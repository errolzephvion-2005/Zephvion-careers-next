"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ThankYou({ jobTitle }: { jobTitle: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    // Artificial loading for smooth transition effect
    const loadTimer = setTimeout(() => setLoading(false), 800);
    // Show sparkles slightly after mount for better effect
    const sparkleTimer = setTimeout(() => setShowSparkles(true), 900);
    
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(sparkleTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="text-center flex flex-col items-center w-full max-w-2xl relative z-10 px-4 space-y-8">
          {/* Checkmark Circle Skeleton */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border border-white/5 bg-zinc-900/20 animate-skeleton shadow-[0_0_20px_rgba(255,255,255,0.02)]"></div>
          
          {/* Text Skeletons */}
          <div className="space-y-4 w-full flex flex-col items-center">
            <div className="h-12 md:h-16 w-3/4 animate-skeleton"></div>
            <div className="h-4 w-1/2 animate-skeleton"></div>
          </div>

          {/* Block Skeleton */}
          <div className="w-full h-16 bg-zinc-900/10 border border-white/5 animate-skeleton"></div>

          {/* Button Skeleton */}
          <div className="h-14 w-64 animate-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
      <style>{`
        @keyframes draw-tick {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scale-up {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle-explode {
          0% { 
            transform: translate(0, 0) scale(0); 
            opacity: 1; 
          }
          100% { 
            transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); 
            opacity: 0; 
          }
        }
        .animate-tick {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-tick 0.8s ease-out forwards 0.3s;
        }
        .animate-scale-up {
          animation: scale-up 0.5s ease-out forwards;
        }
        .sparkle-particle {
          position: absolute;
          left: 50%;
          top: 35%; /* roughly the center of the tick mark */
          transform-origin: center;
          animation: sparkle-explode 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      {/* Sparkles exploding from the center tick mark */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(40)].map((_, i) => {
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const distance = Math.random() * 250 + 100; // explosion radius
            const tx = `${Math.cos(angle) * distance}px`;
            const ty = `${Math.sin(angle) * distance}px`;
            const rot = `${Math.random() * 360}deg`;

            return (
              <div
                key={i}
                className="sparkle-particle"
                style={{
                  '--tx': tx,
                  '--ty': ty,
                  '--rot': rot,
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                  backgroundColor: ['#0DE4CF', '#ffffff', '#27272a'][Math.floor(Math.random() * 3)],
                  animationDelay: `${Math.random() * 0.1}s`,
                  clipPath: ['polygon(50% 0%, 0% 100%, 100% 100%)', 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', 'circle(50% at 50% 50%)'][Math.floor(Math.random() * 3)]
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      {/* Clean, Non-Card Layout */}
      <div className="text-center flex flex-col items-center w-full max-w-2xl relative z-10 px-4">

        {/* Animated Large Solid Tick Mark */}
        <div className="w-28 h-28 md:w-32 md:h-32 bg-[#0DE4CF] rounded-full flex items-center justify-center mb-8 animate-scale-up shadow-[0_0_50px_rgba(13,228,207,0.3)]">
          <svg
            className="w-14 h-14 md:w-16 md:h-16 text-black"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline className="animate-tick" points="20 6 9 17 4 12" pathLength="100" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-6xl font-display text-white tracking-tight mb-4">
          Thank you!
        </h1>

        <p className="text-zinc-400 font-technical text-sm md:text-base leading-relaxed mb-8">
          Your application for <span className="text-white font-bold">{jobTitle}</span> has been successfully received.
        </p>

        {/* Email Notification Block */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-white bg-white/5 border border-white/10 px-6 py-4 mb-12 shadow-sm rounded-sm">
          <span className="material-symbols-outlined text-[#0DE4CF] text-2xl">mail</span>
          <p className="font-technical text-xs md:text-sm tracking-widest uppercase">
            We will reach out to you via email if you are shortlisted for the next steps.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="inline-flex py-3 px-6 md:py-4 md:px-10 font-technical tracking-[0.15em] md:tracking-[0.2em] uppercase transition-all duration-300 justify-center items-center gap-2 md:gap-3 bg-transparent border border-zinc-700 text-zinc-300 hover:border-[#0DE4CF] hover:text-[#0DE4CF] group/back"
        >
          <span className="text-[clamp(9px,2.5vw,13px)] whitespace-nowrap">Return to Zephvion</span>
          <span className="material-symbols-outlined text-base md:text-lg transition-transform group-hover/back:translate-x-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
