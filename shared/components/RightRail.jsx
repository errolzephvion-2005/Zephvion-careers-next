'use client';

import { useClock } from '../hooks/useClock'

export default function RightRail() {
  const time = useClock()

  return (
    <aside className="hidden lg:flex fixed right-0 top-0 h-full w-14 flex-col items-center py-8 z-50 bg-black rail-right">
      {/* Live IST clock — was: document.getElementById('clock') */}
      <div
        id="clock"
        className="text-[9px] tracking-tighter mb-8 text-accent-teal"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {time}
      </div>

      {/* Load bar */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="h-56 w-[2px] bg-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-primary h-1/3"></div>
        </div>
        <span
          className="text-[9px] text-white whitespace-nowrap mt-3"
          style={{
            fontFamily: "'DM Mono', monospace",
            writingMode: 'vertical-lr',
            transform: 'rotate(180deg)',
            letterSpacing: '.1em',
          }}
        >
          SYS_LOAD 34%
        </span>
      </div>

      {/* Status dots */}
      <div className="mt-auto flex flex-col gap-5">
        <div
          className="w-2 h-2 rounded-full bg-accent-teal"
          style={{ boxShadow: '0 0 10px rgba(13,228,207,.5)' }}
        ></div>
        <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
      </div>
    </aside>
  )
}
