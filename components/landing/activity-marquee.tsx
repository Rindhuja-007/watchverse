"use client";

import Image from "next/image";
import { Star, Heart, Flame, Sparkles } from "lucide-react";

interface ActivityItem {
  user: string;
  avatarColor: string;
  action: string;
  title: string;
  domain: string;
  rating: number;
  poster: string;
  quote: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    user: "alex_cine",
    avatarColor: "bg-emerald-500",
    action: "completed",
    title: "Dune: Part Two",
    domain: "Cinema",
    rating: 9.8,
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    quote: "Absolute cinema. The sound design in IMAX shook my soul.",
  },
  {
    user: "mika.chan",
    avatarColor: "bg-violet-500",
    action: "rated 10/10",
    title: "Frieren: Beyond Journey's End",
    domain: "Anime",
    rating: 10.0,
    poster: "https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
    quote: "Pure emotional poetry. One of the best fantasies ever animated.",
  },
  {
    user: "david_tv",
    avatarColor: "bg-rose-500",
    action: "binged",
    title: "The Bear",
    domain: "Series",
    rating: 9.0,
    poster: "https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg",
    quote: "Episode 7 had my heart racing. Masterclass in anxiety.",
  },
  {
    user: "jiwoo_kr",
    avatarColor: "bg-pink-500",
    action: "loved",
    title: "Crash Landing on You",
    domain: "K-Drama",
    rating: 9.5,
    poster: "https://image.tmdb.org/t/p/w500/fgBNLPr6mC8pxuR79ENAJY4nBmj.jpg",
    quote: "Rewatching for the 4th time. The soundtrack never gets old.",
  },
  {
    user: "samuel_l",
    avatarColor: "bg-amber-500",
    action: "rated",
    title: "Spider-Man: Across the Spider-Verse",
    domain: "Animation",
    rating: 9.6,
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    quote: "Every single frame could hang in the Louvre.",
  },
  {
    user: "kevin_b",
    avatarColor: "bg-cyan-500",
    action: "completed",
    title: "Succession",
    domain: "Series",
    rating: 9.9,
    poster: "https://image.tmdb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg",
    quote: "The final season finale was the sharpest TV ever written.",
  },
];

export function ActivityMarquee() {
  // Duplicate array to ensure seamless infinite looping
  const duplicated = [...ACTIVITIES, ...ACTIVITIES];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#0e1014]/60 py-6 backdrop-blur-md">
      {/* Edge Gradient Masks for Smooth Fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 sm:w-36 bg-gradient-to-r from-[#0d0f12] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 sm:w-36 bg-gradient-to-l from-[#0d0f12] to-transparent" />

      {/* Marquee Track */}
      <div className="animate-marquee gap-4 px-4 flex items-center">
        {duplicated.map((item, idx) => (
          <div
            key={`${item.title}-${idx}`}
            className="group flex w-[320px] sm:w-[350px] shrink-0 items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-lg transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:scale-102"
          >
            {/* Small Poster Thumbnail */}
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-[#1a1d24]">
              <Image
                src={item.poster}
                alt={item.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            {/* Info Body */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <span className="font-semibold text-white/80 flex items-center gap-1.5 truncate">
                  <span className={`h-2 w-2 rounded-full ${item.avatarColor}`} />
                  {item.user}
                </span>
                <span className="flex items-center gap-0.5 font-bold text-[#d9f06a]">
                  <Star size={10} fill="currentColor" />
                  {item.rating.toFixed(1)}
                </span>
              </div>
              <h5 className="truncate text-xs font-bold text-white mt-0.5">
                {item.title}
              </h5>
              <p className="truncate text-[11px] italic text-white/50 mt-0.5">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
