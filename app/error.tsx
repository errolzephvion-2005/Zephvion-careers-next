"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>

      <div className="min-h-screen bg-black flex flex-col items-center justify-center pt-20 px-4 relative overflow-hidden">

        {/* CSS Server Rack Animations */}
        <style>{`
          @keyframes blink-fast {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          @keyframes blink-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes float-server {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .server-light-fast {
            animation: blink-fast 0.4s infinite;
          }
          .server-light-slow {
            animation: blink-slow 1.5s infinite;
          }
          .server-rack-container {
            animation: float-server 6s ease-in-out infinite;
          }
        `}</style>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-4xl w-full justify-center">

          {/* Animated Server Racks (CSS Art) */}
          <div className="server-rack-container flex flex-col gap-3 p-4 border border-zinc-800 bg-zinc-950 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-zinc-600 font-technical text-[10px] tracking-widest uppercase">
              Server Cluster _01
            </div>

            {/* Rack 1 */}
            <div className="w-56 h-16 border border-zinc-800 bg-zinc-900 rounded-sm flex flex-col px-4 py-2 justify-between">
              <div className="flex justify-between w-full items-center">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 server-light-fast"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0DE4CF] server-light-slow"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                </div>
                <div className="text-[8px] font-mono text-zinc-500">SYS_ERR</div>
              </div>
              <div className="flex justify-end gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-4 h-6 border border-zinc-700 bg-zinc-800 rounded-sm"></div>
                ))}
              </div>
            </div>

            {/* Rack 2 */}
            <div className="w-56 h-16 border border-zinc-800 bg-zinc-900 rounded-sm flex flex-col px-4 py-2 justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/10 server-light-fast"></div>
              <div className="flex justify-between w-full items-center relative z-10">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 server-light-fast"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 server-light-fast" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 server-light-fast" style={{ animationDelay: '0.1s' }}></div>
                </div>
                <div className="text-[8px] font-mono text-red-500 server-light-fast">CRITICAL</div>
              </div>
              <div className="flex justify-end gap-1 relative z-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`w-4 h-6 border border-red-900/50 ${i % 2 === 0 ? 'bg-red-900/40' : 'bg-zinc-800'} rounded-sm`}></div>
                ))}
              </div>
            </div>

            {/* Rack 3 */}
            <div className="w-56 h-16 border border-zinc-800 bg-zinc-900 rounded-sm flex flex-col px-4 py-2 justify-between">
              <div className="flex justify-between w-full items-center">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0DE4CF] server-light-slow"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                </div>
                <div className="text-[8px] font-mono text-zinc-500">OFFLINE</div>
              </div>
              <div className="flex justify-end gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-4 h-6 border border-zinc-800 bg-zinc-800/50 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Error Text & Actions */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="text-8xl md:text-9xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 tracking-tighter leading-none mb-2">
              500
            </h1>
            <h2 className="text-xl md:text-2xl font-display text-red-500 tracking-widest uppercase mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">warning</span>
              System Failure
            </h2>
            <p className="text-zinc-400 font-technical text-xs md:text-sm tracking-widest uppercase leading-relaxed max-w-sm mb-10">
              An unexpected internal server error has occurred. The system is attempting to recover.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => reset()}
                className="inline-flex py-4 px-8 font-technical tracking-[0.2em] uppercase transition-all duration-300 justify-center items-center gap-3 border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reboot System
              </button>

              <a
                href="/"
                className="inline-flex py-4 px-8 font-technical tracking-[0.2em] uppercase transition-all duration-300 justify-center items-center gap-3 border border-zinc-800 bg-transparent text-zinc-400 hover:border-[#0DE4CF] hover:text-[#0DE4CF]"
              >
                Return to Base
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
