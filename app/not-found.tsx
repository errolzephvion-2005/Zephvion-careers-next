import Link from "next/link";


export default function NotFound() {
  return (
    <>

      <div className="min-h-screen bg-black flex flex-col items-center justify-center pt-20 px-4 relative overflow-hidden">
        <style>{`
          .dot-matrix-text {
            background-image: radial-gradient(circle, #0DE4CF 3px, transparent 3.5px);
            background-size: 10px 10px;
            background-position: center;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 2px rgba(13, 228, 207, 0.3));
          }
        `}</style>
        <div className="relative z-10 text-center flex flex-col items-center w-full max-w-4xl mx-auto">
          {/* 404 Dot Matrix */}
          <h1
            className="text-[10rem] sm:text-[14rem] md:text-[20rem] font-bold leading-none tracking-widest dot-matrix-text font-mono select-none"
          >
            404
          </h1>

          {/* PAGE NOT FOUND Text */}
          <div className="mt-8 mb-16 relative">
            <p className="text-zinc-500 font-technical tracking-[0.5em] md:tracking-[1em] uppercase text-xs md:text-sm">
              PAGE NOT FOUND
            </p>
          </div>

          {/* Action Button */}
          <Link
            href="/"
            className="inline-flex py-4 px-8 font-technical tracking-[0.3em] uppercase transition-all duration-500 justify-center items-center gap-3 border border-[#0DE4CF]/50 bg-transparent text-[#0DE4CF] hover:bg-[#0DE4CF] hover:text-black hover:shadow-[0_0_40px_rgba(13,228,207,0.4)] cursor-pointer"
          >
            Back to Zephvion Careers
          </Link>
        </div>
      </div>
    </>
  );
}
