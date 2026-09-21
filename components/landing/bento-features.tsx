"use client";

import { useState } from "react";
import {
  Film,
  Tv,
  CheckCircle,
  Star,
  Sparkles,
  Sliders,
  Layers,
  Heart,
  Calendar,
  Bookmark,
  TrendingUp,
} from "lucide-react";

export function BentoFeatures() {
  const [completedEpisodes, setCompletedEpisodes] = useState<number[]>([1, 2, 3]);
  const totalEpisodes = 6;

  function toggleEpisode(ep: number) {
    if (completedEpisodes.includes(ep)) {
      setCompletedEpisodes(completedEpisodes.filter((e) => e !== ep));
    } else {
      setCompletedEpisodes([...completedEpisodes, ep]);
    }
  }

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d9f06a] mb-2">
          BUILT FOR OBSESSIVE WATCHERS
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Everything your watchlist was missing.
        </h2>
        <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed">
          Forget spreadsheets, disorganized notes apps, or switching between Letterboxd and MyAnimeList. WatchVerse unites your entire viewing life.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        {/* Bento 1: Interactive Episode & Season Tracker (Large, 7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-gradient-to-br from-[#14171d] via-[#101216] to-[#0c0e12] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d9f06a] mb-3">
              <Tv size={16} />
              <span>Granular Series Tracking</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Episode-by-episode precision.
            </h3>
            <p className="mt-2 text-sm text-white/60 max-w-md">
              Check off episodes as you watch, see exactly how much of a season is left, and log repeat binges with rewatch timestamps.
            </p>
          </div>

          {/* Interactive Simulator Card */}
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-md relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                  CURRENTLY BINGING
                </span>
                <h4 className="text-base font-bold text-white">Arcane: Season 2</h4>
              </div>
              <span className="rounded-full bg-[#d9f06a]/20 text-[#d9f06a] border border-[#d9f06a]/30 px-3 py-1 text-xs font-black">
                {completedEpisodes.length} / {totalEpisodes} EPS
              </span>
            </div>

            {/* Interactive Episode Pills */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
              {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => {
                const isDone = completedEpisodes.includes(ep);
                return (
                  <button
                    key={ep}
                    type="button"
                    onClick={() => toggleEpisode(ep)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      isDone
                        ? "bg-[#d9f06a] text-[#101214] border-[#d9f06a] shadow-[0_0_15px_rgba(217,240,106,0.3)] scale-102"
                        : "border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    <span>Ep {ep}</span>
                    <span className="text-[10px] mt-0.5">{isDone ? "✓ Done" : "Watch"}</span>
                  </button>
                );
              })}
            </div>

            {/* Animated Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#d9f06a] to-emerald-400 transition-all duration-500"
                style={{ width: `${(completedEpisodes.length / totalEpisodes) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-white/40 mt-2 text-right">
              Click episodes to test the tracker!
            </p>
          </div>

          {/* Ambient Corner Flare */}
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-[#d9f06a]/10 blur-[90px]" />
        </div>

        {/* Bento 2: The Unified Library (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-gradient-to-br from-[#14171d] via-[#101216] to-[#0c0e12] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
              <Layers size={16} />
              <span>Cross-Domain Universe</span>
            </div>
            <h3 className="text-2xl font-bold text-white">One home. All 5 domains.</h3>
            <p className="mt-2 text-sm text-white/60">
              No more splitting your watch history between anime databases and movie review sites.
            </p>
          </div>

          {/* 5 Domains Badges Preview */}
          <div className="mt-6 grid grid-cols-1 gap-2.5 relative z-10">
            {[
              { label: "🎬 Cinema", desc: "Hollywood, Indie, A24, Cannes", color: "border-amber-400/30 text-amber-300" },
              { label: "⚔️ Anime", desc: "Shonen, Seinen, Studio Ghibli", color: "border-violet-400/30 text-violet-300" },
              { label: "🌸 K-Drama", desc: "Rom-coms, Thrillers, Chaebol stories", color: "border-pink-400/30 text-pink-300" },
              { label: "🍸 Prestige Series", desc: "HBO, FX, Apple Originals", color: "border-rose-400/30 text-rose-300" },
              { label: "☕ Sitcoms", desc: "20-minute comfort rewatches", color: "border-emerald-400/30 text-emerald-300" },
            ].map((d) => (
              <div
                key={d.label}
                className={`flex items-center justify-between rounded-xl border bg-white/[0.02] px-3.5 py-2 text-xs backdrop-blur-md ${d.color}`}
              >
                <span className="font-bold text-white">{d.label}</span>
                <span className="text-[11px] text-white/40">{d.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bento 3: Aesthetic Ratings & Quotes (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-gradient-to-br from-[#14171d] via-[#101216] to-[#0c0e12] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              <Star size={16} />
              <span>Personal Diary</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Remember how it made you feel.
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Save favorite quotes, personal ratings with half-stars, and unvarnished thoughts.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-xs">
            <div className="flex items-center justify-between text-white/80 font-bold mb-2">
              <span>Past Lives (2023)</span>
              <span className="flex items-center gap-1 text-[#d9f06a]">
                <Star size={13} fill="currentColor" /> 10/10
              </span>
            </div>
            <p className="italic text-white/60 text-[12px] leading-relaxed">
              &ldquo;What if this is also a past life, and we are already something else to each other in the next one?&rdquo;
            </p>
            <div className="mt-3 flex gap-1.5 flex-wrap">
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-white/80">#A24</span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-white/80">#Crying</span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-white/80">#Masterpiece</span>
            </div>
          </div>
        </div>

        {/* Bento 4: Vibe & Mood Filtering (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-gradient-to-br from-[#14171d] via-[#101216] to-[#0c0e12] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
              <Sliders size={16} />
              <span>Smart Collections</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Curate by aesthetic vibe.
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Group by mood instead of rigid tags. Create your own custom watchverses.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Late Night Melancholy",
              "Cyberpunk Dystopia",
              "Mind-Bending Sci-Fi",
              "Comfort Food Rewatches",
              "Studio Ghibli Coziness",
              "Cerebral Psychological Thrillers",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md hover:border-[#d9f06a] hover:text-[#d9f06a] transition-colors cursor-default"
              >
                ✦ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bento 5: Stats & Visual Taste Profile (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-gradient-to-br from-[#14171d] via-[#101216] to-[#0c0e12] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
              <TrendingUp size={16} />
              <span>Visual Taste Profile</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Your cinematic fingerprint.
            </h3>
            <p className="mt-2 text-sm text-white/60">
              See total hours spent, your most watched genres, and top directors over time.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
              <span className="text-2xl font-black text-[#d9f06a]">384</span>
              <span className="block text-[11px] text-white/50 mt-0.5">Hours Logged</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
              <span className="text-2xl font-black text-purple-400">9.1</span>
              <span className="block text-[11px] text-white/50 mt-0.5">Avg Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
