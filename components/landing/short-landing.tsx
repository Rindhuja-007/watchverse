"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Tv,
  FileCode,
  Film,
  Play,
  ChevronRight,
  Loader2,
} from "lucide-react";

export function ShortLanding() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleQuickDemo() {
    setDemoLoading(true);
    try {
      const res = await signIn("credentials", {
        email: "demo@watchverse.com",
        password: "password123",
        redirect: false,
      });
      if (!res?.error) {
        router.push("/library");
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setDemoLoading(false);
    }
  }

  const samplePosters = [
    {
      title: "Mob Psycho 100",
      rating: 9,
      ep: "S1 E10/12",
      img: "https://image.tmdb.org/t/p/w500/dyqj0x5t2dO4z0L3bC4Y1bQ1mZ.jpg",
    },
    {
      title: "Solo Leveling",
      rating: 9,
      ep: "S1 E12/12",
      img: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuClJiwxtJ.jpg",
    },
    {
      title: "Attack on Titan",
      rating: 9,
      ep: "S1 E25/25",
      img: "https://image.tmdb.org/t/p/w500/8C5gDxnB0iM5P0QpX7qV8d0yv4.jpg",
    },
    {
      title: "Spirited Away",
      rating: 9,
      ep: "Seen",
      img: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    },
    {
      title: "Your Name",
      rating: 10,
      ep: "Seen",
      img: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6ditYeZAv92d.jpg",
    },
    {
      title: "JUJUTSU KAISEN",
      rating: 9,
      ep: "S1 E24/24",
      img: "https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg",
    },
    {
      title: "Chainsaw Man",
      rating: 9,
      ep: "S1 E12/12",
      img: "https://image.tmdb.org/t/p/w500/npdB6eFz4qt9CdFOEgCVJRJte2.jpg",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#090a0c] text-[#f5f1e8] overflow-hidden flex flex-col justify-between">
      {/* Background radial ambient lights */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[750px] rounded-full bg-gradient-to-b from-rose-600/15 via-[#ef4444]/10 to-transparent blur-[120px]" />
        <div className="absolute top-1/2 -left-20 h-72 w-72 rounded-full bg-[#eab308]/10 blur-[100px]" />
      </div>

      {/* Main Hero Header (Compact & High Impact) */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 pb-6 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold tracking-widest text-[#ef4444] backdrop-blur-md mb-6">
          <Sparkles size={13} />
          <span>THE ULTIMATE WALL OF WATCHING</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-[0.95]">
          Your Entire Watch Life, <br />
          <span className="bg-gradient-to-r from-[#ef4444] via-rose-400 to-[#eab308] bg-clip-text text-transparent">
            One Cinematic Wall.
          </span>
        </h1>

        <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-white/60 leading-relaxed">
          Track anime, movies, series, and K-dramas with episode-by-episode precision.
          Import & export from XML or MyAnimeList, and show off your personal collector wall.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/signup"
            className="flex items-center gap-2 rounded-full bg-[#ef4444] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#ef4444]/30 hover:bg-[#dc2626] transition active:scale-95"
          >
            <span>Create Free Account</span>
            <ArrowRight size={16} />
          </Link>

          <button
            onClick={handleQuickDemo}
            disabled={demoLoading}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition active:scale-95 disabled:opacity-50"
          >
            {demoLoading ? (
              <>
                <Loader2 size={16} className="animate-spin text-[#eab308]" />
                <span>Entering Wall...</span>
              </>
            ) : (
              <>
                <Play size={14} className="text-[#eab308] fill-[#eab308]" />
                <span>1-Click Live Demo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mini Interactive Preview Strip of the Wall of Watching */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 my-4">
        <div className="relative rounded-3xl border border-white/10 bg-[#121316]/70 p-4 sm:p-6 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#ef4444]">REEL</span>
              <span className="text-white/20">|</span>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Wall of Watching Preview
              </span>
            </div>
            <Link
              href="/library"
              className="text-xs font-semibold text-[#38bdf8] hover:underline flex items-center gap-1"
            >
              <span>Open Full Wall</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Horizontal scrollable row of mini poster cards */}
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {samplePosters.map((p, idx) => (
              <div
                key={idx}
                className="relative aspect-[2/3] w-32 sm:w-36 shrink-0 rounded-xl overflow-hidden bg-[#16181d] border border-white/10 shadow-md group"
              >
                <div className="absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#facc15] text-[11px] font-black text-black shadow">
                  {p.rating}
                </div>
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60";
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-6">
                  <p className="truncate text-[11px] font-bold text-white">{p.title}</p>
                  <p className="text-[10px] font-bold text-[#00e5ff]">{p.ep}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Compact Feature Pills */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 my-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ef4444]/15 text-[#ef4444]">
              <Film size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Collector Wall</h3>
              <p className="text-[11px] text-white/50">5-column responsive poster shelves</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#38bdf8]/15 text-[#38bdf8]">
              <Tv size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Episode Tracker</h3>
              <p className="text-[11px] text-white/50">Log seasons and episode streaks</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eab308]/15 text-[#eab308]">
              <FileCode size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">XML / MAL Sync</h3>
              <p className="text-[11px] text-white/50">Import & export your full library</p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className="border-t border-white/[0.08] py-5 px-4 text-center text-xs text-white/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white/80">
            <span className="text-[#ef4444] font-black">REEL</span>
            <span className="text-white/30">/</span>
            <span>WatchVerse</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-white transition">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-white transition">
              Sign Up
            </Link>
            <Link href="/library" className="hover:text-white transition">
              Library
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
