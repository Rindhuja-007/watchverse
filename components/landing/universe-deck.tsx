"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Film, Tv, Sparkles, ArrowUpRight } from "lucide-react";

interface UniverseTitle {
  id: number;
  title: string;
  domain: string;
  year: string;
  rating: number;
  genre: string;
  poster: string;
  badgeColor: string;
  quote: string;
}

const UNIVERSE_DATA: Record<string, UniverseTitle[]> = {
  all: [
    {
      id: 693134,
      title: "Dune: Part Two",
      domain: "Cinema",
      year: "2024",
      rating: 9.4,
      genre: "Sci-Fi · Adventure",
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      badgeColor: "bg-amber-400 text-black",
      quote: "Denis Villeneuve's cinematic magnum opus.",
    },
    {
      id: 95479,
      title: "Jujutsu Kaisen",
      domain: "Anime",
      year: "2023",
      rating: 8.9,
      genre: "Shonen · Action",
      poster: "https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg",
      badgeColor: "bg-violet-500 text-white",
      quote: "Relentless action and tragic storytelling.",
    },
    {
      id: 136315,
      title: "The Bear",
      domain: "Series",
      year: "2023",
      rating: 8.8,
      genre: "Drama · Kitchen",
      poster: "https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg",
      badgeColor: "bg-rose-500 text-white",
      quote: "Yes, Chef. Pure kinetic perfection.",
    },
    {
      id: 94796,
      title: "Crash Landing on You",
      domain: "K-Drama",
      year: "2019",
      rating: 9.2,
      genre: "Romance · Comedy",
      poster: "https://image.tmdb.org/t/p/w500/fgBNLPr6mC8pxuR79ENAJY4nBmj.jpg",
      badgeColor: "bg-pink-500 text-white",
      quote: "The definitive modern K-Drama classic.",
    },
  ],
  cinema: [
    {
      id: 693134,
      title: "Dune: Part Two",
      domain: "Cinema",
      year: "2024",
      rating: 9.4,
      genre: "Sci-Fi · Epic",
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      badgeColor: "bg-amber-400 text-black",
      quote: "A staggering achievement in world-building.",
    },
    {
      id: 666277,
      title: "Past Lives",
      domain: "Cinema",
      year: "2023",
      rating: 9.1,
      genre: "Drama · Romance",
      poster: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
      badgeColor: "bg-sky-400 text-black",
      quote: "In-Yun. A gentle, devastating heartbreak.",
    },
    {
      id: 496243,
      title: "Parasite",
      domain: "Cinema",
      year: "2019",
      rating: 9.3,
      genre: "Thriller · Black Comedy",
      poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      badgeColor: "bg-emerald-400 text-black",
      quote: "Bong Joon-ho's historic Palme d'Or winner.",
    },
    {
      id: 545611,
      title: "Everything Everywhere All at Once",
      domain: "Cinema",
      year: "2022",
      rating: 9.0,
      genre: "Sci-Fi · Action",
      poster: "https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg",
      badgeColor: "bg-fuchsia-500 text-white",
      quote: "Be kind, especially when we don't know what's going on.",
    },
  ],
  anime: [
    {
      id: 95479,
      title: "Jujutsu Kaisen",
      domain: "Anime",
      year: "2023",
      rating: 8.9,
      genre: "Supernatural · Action",
      poster: "https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg",
      badgeColor: "bg-violet-500 text-white",
      quote: "The Shibuya Arc raised the bar for anime animation.",
    },
    {
      id: 209867,
      title: "Frieren: Beyond Journey's End",
      domain: "Anime",
      year: "2023",
      rating: 9.5,
      genre: "Fantasy · Adventure",
      poster: "https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
      badgeColor: "bg-teal-400 text-black",
      quote: "A quiet masterpiece on memory and human mortality.",
    },
    {
      id: 94605,
      title: "Arcane",
      domain: "Anime",
      year: "2021",
      rating: 9.6,
      genre: "Sci-Fi · Steampunk",
      poster: "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
      badgeColor: "bg-indigo-500 text-white",
      quote: "Visually unmatched. Every second is fine art.",
    },
    {
      id: 1429,
      title: "Attack on Titan",
      domain: "Anime",
      year: "2013-2023",
      rating: 9.3,
      genre: "Dark Fantasy · Mystery",
      poster: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
      badgeColor: "bg-amber-600 text-white",
      quote: "One of the greatest narrative puzzles in television.",
    },
  ],
  series: [
    {
      id: 60059,
      title: "Better Call Saul",
      domain: "Series",
      year: "2015-2022",
      rating: 9.4,
      genre: "Crime · Tragedy",
      poster: "https://image.tmdb.org/t/p/w500/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg",
      badgeColor: "bg-yellow-500 text-black",
      quote: "Flawless character development and framing.",
    },
    {
      id: 76331,
      title: "Succession",
      domain: "Series",
      year: "2018-2023",
      rating: 9.5,
      genre: "Satirical Drama",
      poster: "https://image.tmdb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg",
      badgeColor: "bg-neutral-200 text-black",
      quote: "Shakespeare in modern corporate high finance.",
    },
    {
      id: 100088,
      title: "The Last of Us",
      domain: "Series",
      year: "2023",
      rating: 9.1,
      genre: "Post-Apocalyptic",
      poster: "https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg",
      badgeColor: "bg-lime-500 text-black",
      quote: "Heart-wrenching adaptation of the beloved story.",
    },
    {
      id: 1396,
      title: "Breaking Bad",
      domain: "Series",
      year: "2008-2013",
      rating: 9.8,
      genre: "Crime · Suspense",
      poster: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
      badgeColor: "bg-emerald-500 text-black",
      quote: "The gold standard of the golden age of television.",
    },
  ],
  kdrama: [
    {
      id: 94796,
      title: "Crash Landing on You",
      domain: "K-Drama",
      year: "2019",
      rating: 9.2,
      genre: "Romance · Drama",
      poster: "https://image.tmdb.org/t/p/w500/fgBNLPr6mC8pxuR79ENAJY4nBmj.jpg",
      badgeColor: "bg-pink-500 text-white",
      quote: "Iconic chemistry that captured millions across the globe.",
    },
    {
      id: 93405,
      title: "Squid Game",
      domain: "K-Drama",
      year: "2021",
      rating: 8.8,
      genre: "Survival Thriller",
      poster: "https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",
      badgeColor: "bg-rose-600 text-white",
      quote: "A cultural phenomenon with nail-biting suspense.",
    },
    {
      id: 136283,
      title: "The Glory",
      domain: "K-Drama",
      year: "2022",
      rating: 9.0,
      genre: "Psychological Revenge",
      poster: "https://image.tmdb.org/t/p/w500/uUM4LVlPgIrww07OoEKrGWlS1Ej.jpg",
      badgeColor: "bg-purple-600 text-white",
      quote: "Song Hye-kyo's gripping, calculating masterclass.",
    },
  ],
};

const CATEGORIES = [
  { key: "all", label: "✨ All Universes" },
  { key: "cinema", label: "🎬 Cinema" },
  { key: "anime", label: "⚔️ Anime" },
  { key: "series", label: "🍸 Prestige Series" },
  { key: "kdrama", label: "🌸 K-Drama" },
];

export function UniverseDeck() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const currentItems = UNIVERSE_DATA[activeTab] || UNIVERSE_DATA.all;

  return (
    <section id="discover" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d9f06a] mb-2">
            EXPLORE THE SPECTRUM
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Every taste. Any genre.
          </h2>
          <p className="mt-3 max-w-md text-white/60 text-sm sm:text-base">
            Never separate your anime from your arthouse cinema again. Organize your entire viewing multiverse in one home.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveTab(cat.key)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shrink-0 ${
                activeTab === cat.key
                  ? "bg-[#d9f06a] text-[#101214] shadow-[0_0_20px_rgba(217,240,106,0.3)] scale-105"
                  : "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Grid of Showcase Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentItems.map((item, index) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#14171d]/90 p-4 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/30 hover:shadow-2xl hover:shadow-black/70"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Top Badge & Rating */}
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${item.badgeColor}`}
              >
                {item.domain}
              </span>
              <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-bold text-[#d9f06a] backdrop-blur-md">
                <Star size={12} fill="currentColor" />
                <span>{item.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Poster Frame */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#1d212a]">
              <Image
                src={item.poster}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101214] via-transparent to-black/20" />

              {/* Hover Quick Add Action Button */}
              <Link
                href={`/add?query=${encodeURIComponent(item.title)}`}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-xs"
              >
                <span className="flex items-center gap-1.5 rounded-full bg-[#d9f06a] px-4 py-2 text-xs font-black text-[#101214] shadow-lg transition-transform hover:scale-105">
                  <Plus size={15} /> Add to Universe
                </span>
              </Link>
            </div>

            {/* Content Details */}
            <div className="mt-4 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[11px] font-semibold text-white/40">{item.year} · {item.genre}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-[#d9f06a] transition-colors line-clamp-1 mt-0.5">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-white/55 line-clamp-2 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <Link
                href={`/add?query=${encodeURIComponent(item.title)}`}
                className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-white/70 hover:text-[#d9f06a] transition-colors"
              >
                <span>Track this title</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
