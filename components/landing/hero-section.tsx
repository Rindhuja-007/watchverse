"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import {
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  Play,
  Film,
  Compass,
  Tv,
} from "lucide-react";
import { FloatingCard } from "./floating-card";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/add?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/add");
    }
  }

  return (
    <section className="relative min-h-[92vh] overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 pb-20 sm:pb-28 flex flex-col justify-center items-center">
      {/* Ambient Cosmic Background Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-[#d9f06a]/15 via-purple-600/10 to-sky-500/10 blur-[130px]" />
        <div className="absolute top-1/3 left-10 w-72 h-72 rounded-full bg-[#d9f06a]/10 blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute inset-0 bg-dot-grid opacity-35" />
      </div>

      {/* Floating Scattered Collector Cards (Desktop & Tablet Placement) */}
      {/* Top Left: Anime (Jujutsu Kaisen) */}
      <div className="hidden lg:block absolute left-2 xl:left-8 top-12">
        <FloatingCard
          title="Jujutsu Kaisen"
          subtitle="Mappa · Shibuya Arc"
          posterUrl="https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg"
          badge="ANIME"
          tagColor="bg-violet-500 text-white"
          borderColor="border-violet-500/40"
          sticker={{
            text: "PEAK ARC",
            icon: "⚡",
            color: "bg-gradient-to-r from-violet-600 to-indigo-600",
          }}
          rating={8.9}
          status="Completed"
          rotation={-13}
          animationClass="animate-float-slow"
        />
      </div>

      {/* Top Right: Cinema (Dune Part Two) */}
      <div className="hidden lg:block absolute right-2 xl:right-8 top-10">
        <FloatingCard
          title="Dune: Part Two"
          subtitle="Denis Villeneuve · 2024"
          posterUrl="https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
          badge="CINEMA"
          tagColor="bg-amber-400 text-black font-bold"
          borderColor="border-amber-400/40"
          sticker={{
            text: "IMAX 70MM",
            icon: "🎬",
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
          }}
          rating={9.4}
          status="Rewatched 3x"
          rotation={12}
          animationClass="animate-float-reverse"
        />
      </div>

      {/* Middle Right Edge: Prestige TV (The Bear) */}
      <div className="hidden xl:block absolute right-16 bottom-20">
        <FloatingCard
          title="The Bear"
          subtitle="FX · Culinary Drama"
          posterUrl="https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg"
          badge="SERIES"
          tagColor="bg-rose-500 text-white"
          borderColor="border-rose-500/40"
          progress={{ current: 8, total: 10, label: "Season 3" }}
          rating={8.8}
          rotation={-8}
          animationClass="animate-float-gentle"
        />
      </div>

      {/* Bottom Left: Indie Romance (Past Lives) */}
      <div className="hidden lg:block absolute left-4 xl:left-14 bottom-14">
        <FloatingCard
          title="Past Lives"
          subtitle="Celine Song · A24"
          posterUrl="https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg"
          badge="A24 FILM"
          tagColor="bg-sky-400 text-black font-bold"
          borderColor="border-sky-400/40"
          sticker={{
            text: "HEARTBREAK",
            icon: "💔",
            color: "bg-gradient-to-r from-sky-500 to-blue-600",
          }}
          rating={9.1}
          rotation={14}
          animationClass="animate-float-slow"
        />
      </div>

      {/* Main Center Content Container */}
      <div className="relative z-10 mx-auto max-w-3xl text-center flex flex-col items-center">
        {/* Luminous Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold tracking-wider text-white/90 backdrop-blur-md shadow-lg shadow-black/20 hover:border-[#d9f06a]/40 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-[#d9f06a] animate-ping" />
          <span className="text-[#d9f06a]">WATCHVERSE 2.0</span>
          <span className="text-white/40">·</span>
          <span>YOUR CINEMATIC SANCTUARY</span>
        </div>

        {/* Central High-Impact Headline */}
        <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.98] text-white">
          Track stories. <br />
          <span className="bg-gradient-to-r from-[#d9f06a] via-[#e4f78e] to-emerald-300 bg-clip-text text-transparent">
            Build your universe.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-xl text-base sm:text-lg md:text-xl text-white/70 font-normal leading-relaxed">
          The all-in-one cinematic journal for film buffs, anime completionists, and series bingers.
          Log what you watch, rate episode-by-episode, and share your aesthetic taste.
        </p>

        {/* Action Buttons (Glowing Gradient Pill inspired by reference) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary Rainbow/Neon Glow Pill */}
          <Link
            href="/signup"
            className="group relative flex items-center justify-center gap-2.5 rounded-full bg-[#d9f06a] px-8 py-4 text-sm sm:text-base font-extrabold text-[#101214] shadow-[0_0_35px_rgba(217,240,106,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(217,240,106,0.6)] active:scale-95"
          >
            <Sparkles size={18} className="animate-spin text-[#101214]" style={{ animationDuration: "8s" }} />
            <span>Start My Universe — Free</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Secondary Glass Pill */}
          <Link
            href="/library"
            className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-7 py-4 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/[0.1] hover:border-white/40 active:scale-95"
          >
            <Compass size={17} className="text-[#d9f06a]" />
            <span>Explore Library</span>
          </Link>
        </div>

        {/* Quick Search Launcher Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 w-full max-w-lg rounded-2xl sm:rounded-full border border-white/15 bg-[#14171d]/85 p-1.5 pl-5 shadow-2xl backdrop-blur-xl transition-all focus-within:border-[#d9f06a]/70 focus-within:shadow-[0_0_25px_rgba(217,240,106,0.2)] flex items-center gap-3"
        >
          <Search size={18} className="text-white/40 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Dune, Arcane, Succession, The Bear..."
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search title"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-full bg-[#d9f06a] text-[#101214] transition-transform hover:scale-105 active:scale-95 font-bold shadow-md"
          >
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Micro-Features Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-white/55">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#d9f06a]" />
            100% Free & Personal
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#d9f06a]" />
            Episode-by-Episode Tracking
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#d9f06a]" />
            Powered by TMDB
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#d9f06a]" />
            Zero Invasive Ads
          </span>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Collector Cards Preview */}
      <div className="lg:hidden mt-12 w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
          ✦ Featured in the Universe ✦
        </p>
        <div className="flex gap-4 px-4 w-max mx-auto justify-center">
          <FloatingCard
            title="Jujutsu Kaisen"
            subtitle="Anime · 2023"
            posterUrl="https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg"
            badge="ANIME"
            tagColor="bg-violet-500 text-white"
            borderColor="border-violet-500/40"
            rating={8.9}
            rotation={-4}
            className="w-[190px]"
          />
          <FloatingCard
            title="Dune: Part Two"
            subtitle="Cinema · 2024"
            posterUrl="https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
            badge="CINEMA"
            tagColor="bg-amber-400 text-black font-bold"
            borderColor="border-amber-400/40"
            rating={9.4}
            rotation={3}
            className="w-[190px]"
          />
          <FloatingCard
            title="The Bear"
            subtitle="Series · FX"
            posterUrl="https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg"
            badge="SERIES"
            tagColor="bg-rose-500 text-white"
            borderColor="border-rose-500/40"
            rating={8.8}
            rotation={-3}
            className="w-[190px]"
          />
        </div>
      </div>
    </section>
  );
}
