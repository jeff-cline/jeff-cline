"use client";

import Image from "next/image";
import { useState } from "react";

export default function UnchagedPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#041019] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="wave wave-a" />
        <div className="wave wave-b" />
        <div className="wave wave-c" />
        <div className="glow glow-teal" />
        <div className="glow glow-orange" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-4xl">
          <h1 className="mb-6 text-center text-3xl font-black uppercase tracking-[0.12em] text-orange-200 md:text-5xl">
            Unchaged
          </h1>

          <div className="group relative overflow-hidden rounded-3xl border border-orange-300/40 bg-black/40 shadow-[0_0_60px_rgba(255,138,76,0.25)] backdrop-blur-sm">
            <Image
              src="/unchaged/hero-coast.png"
              alt="Coastal cliff with rainbow"
              width={1400}
              height={1800}
              className="h-auto w-full object-cover"
              priority
            />

            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange-100/60 bg-orange-500/45 text-3xl text-white transition hover:scale-105 hover:bg-orange-500/65 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/50"
              aria-label="Play video"
            >
              ▶
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-teal-100/80 md:text-base">
            EVERY INDUSTRY IS A GEEK AWAY FROM BEING UBERIZED.
          </p>
        </div>
      </section>

      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            className="absolute right-4 top-4 rounded-lg border border-white/30 bg-black/40 px-3 py-1 text-sm text-white hover:bg-black/70"
          >
            Close
          </button>
          <video
            src="/decks/roatan-video.mp4"
            controls
            autoPlay
            className="max-h-[90vh] w-full max-w-5xl rounded-2xl border border-orange-200/30 shadow-2xl"
          />
        </div>
      )}

      <style jsx>{`
        .wave {
          position: absolute;
          inset: auto -10% -18% -10%;
          height: 55%;
          border-radius: 45%;
          filter: blur(12px);
          opacity: 0.55;
          transform-origin: 50% 50%;
        }

        .wave-a {
          background: radial-gradient(circle at 30% 35%, rgba(0, 224, 220, 0.72), rgba(0, 60, 90, 0.2) 60%, transparent 70%);
          animation: driftA 14s ease-in-out infinite;
        }

        .wave-b {
          background: radial-gradient(circle at 70% 45%, rgba(255, 145, 66, 0.68), rgba(125, 60, 20, 0.18) 60%, transparent 70%);
          animation: driftB 18s ease-in-out infinite;
        }

        .wave-c {
          background: radial-gradient(circle at 50% 40%, rgba(38, 175, 190, 0.45), rgba(7, 39, 66, 0.2) 58%, transparent 72%);
          animation: driftC 20s ease-in-out infinite;
        }

        .glow {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          opacity: 0.35;
        }

        .glow-teal {
          height: 320px;
          width: 320px;
          left: 8%;
          top: 10%;
          background: rgba(35, 212, 212, 0.8);
          animation: pulse 7s ease-in-out infinite;
        }

        .glow-orange {
          height: 300px;
          width: 300px;
          right: 12%;
          bottom: 16%;
          background: rgba(255, 129, 58, 0.8);
          animation: pulse 9s ease-in-out infinite;
        }

        @keyframes driftA {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate3d(0, -8%, 0) rotate(4deg) scale(1.06);
          }
        }

        @keyframes driftB {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate3d(0, -10%, 0) rotate(-3deg) scale(1.08);
          }
        }

        @keyframes driftC {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate3d(0, -6%, 0) rotate(2deg) scale(1.03);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.22;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.12);
          }
        }
      `}</style>
    </main>
  );
}
