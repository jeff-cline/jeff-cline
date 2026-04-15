"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BAR_COUNT = 32;

export default function UncagedPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.2);
  const [bars, setBars] = useState<number[]>(Array.from({ length: BAR_COUNT }, () => 12));

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopVisualizer = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const animateVisualizer = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(data);

      const nextBars = Array.from({ length: BAR_COUNT }, (_, i) => {
        const index = Math.min(data.length - 1, Math.floor((i / BAR_COUNT) * data.length));
        const value = data[index] ?? 0;
        const normalized = value / 255;
        return 10 + normalized * 90;
      });

      setBars(nextBars);
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  const ensureAudioGraph = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      const context = new window.AudioContext();
      const source = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      const gain = context.createGain();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      gain.gain.value = volume;

      source.connect(analyser);
      analyser.connect(gain);
      gain.connect(context.destination);

      audioContextRef.current = context;
      sourceRef.current = source;
      analyserRef.current = analyser;
      gainRef.current = gain;
      return;
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  };

  const handlePlayToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      stopVisualizer();
      return;
    }

    try {
      await ensureAudioGraph();
      await audio.play();
      setIsPlaying(true);
      animateVisualizer();
    } catch {
      setIsPlaying(false);
      stopVisualizer();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (gainRef.current) {
      gainRef.current.gain.value = newVolume;
    }
    if (audioRef.current) {
      audioRef.current.volume = Math.min(newVolume, 1);
    }
  };

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }

    return () => {
      stopVisualizer();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => undefined);
      }
    };
  }, [volume]);

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
            Uncaged
          </h1>

          <div className="group relative overflow-hidden rounded-3xl border border-orange-300/40 bg-black/40 shadow-[0_0_60px_rgba(255,138,76,0.25)] backdrop-blur-sm">
            <Image
              src="/uncaged/hero-coast.png"
              alt="Coastal cliff with rainbow"
              width={1400}
              height={1800}
              className="h-auto w-full object-cover"
              priority
            />

            <div className={`visualizer-wrap ${isPlaying ? "active" : ""}`}>
              <div className="visualizer-overlay" />
              <div className="visualizer-grid" aria-hidden="true">
                {bars.map((height, idx) => (
                  <span
                    key={idx}
                    className="viz-bar"
                    style={{ height: `${height}%`, animationDelay: `${idx * 0.03}s` }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlayToggle}
              className="absolute left-1/2 top-[43%] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange-100/70 bg-orange-500/55 text-3xl text-white transition hover:scale-105 hover:bg-orange-500/75 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/50"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-teal-200/35 bg-[#05111ddd] p-3 backdrop-blur-md md:p-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-teal-100/85 md:text-sm">
                <span>{isPlaying ? "Now Playing" : "Ready to Play"}</span>
                <span className="text-orange-200">Volume {(volume * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={volume}
                onChange={(event) => handleVolumeChange(Number(event.target.value))}
                aria-label="Audio volume"
                className="w-full accent-orange-400"
              />
            </div>
          </div>

          <audio
            ref={audioRef}
            src="/decks/roatan-video.mp4"
            onEnded={() => {
              setIsPlaying(false);
              stopVisualizer();
            }}
            onPause={() => {
              setIsPlaying(false);
              stopVisualizer();
            }}
            preload="auto"
            className="hidden"
          />

          <p className="mt-6 text-center text-sm text-teal-100/80 md:text-base">
            EVERY INDUSTRY IS A GEEK AWAY FROM BEING UBERIZED.
          </p>
        </div>
      </section>

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

        .visualizer-wrap {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 28%;
          opacity: 0.5;
          transition: opacity 220ms ease;
        }

        .visualizer-wrap.active {
          opacity: 1;
        }

        .visualizer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 4%, rgba(2, 15, 27, 0.42) 36%, rgba(9, 30, 48, 0.9) 100%);
        }

        .visualizer-grid {
          position: absolute;
          inset: 20% 4% 10% 4%;
          display: grid;
          grid-template-columns: repeat(${BAR_COUNT}, minmax(0, 1fr));
          gap: 0.45rem;
          align-items: end;
        }

        .viz-bar {
          border-radius: 9999px 9999px 0 0;
          min-height: 8%;
          background: linear-gradient(180deg, rgba(30, 209, 211, 0.95), rgba(255, 139, 59, 0.9));
          box-shadow: 0 0 12px rgba(13, 203, 198, 0.55), 0 0 16px rgba(255, 129, 58, 0.35);
          animation: sway 1.15s ease-in-out infinite;
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

        @keyframes sway {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </main>
  );
}
