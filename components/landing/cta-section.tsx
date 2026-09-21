"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Clapperboard, Heart, Github } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Ambient Radial Mesh Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-gradient-to-r from-[#d9f06a]/20 via-purple-600/20 to-sky-500/20 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center flex flex-col items-center">
        {/* Shimmering Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#d9f06a]/30 bg-[#d9f06a]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#d9f06a] backdrop-blur-md mb-6">
          <Sparkles size={14} />
          <span>START YOUR COLLECTION TODAY</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05]">
          Your stories deserve <br />
          <span className="bg-gradient-to-r from-[#d9f06a] via-[#e4f78e] to-emerald-300 bg-clip-text text-transparent">
            a better home.
          </span>
        </h2>

        <p className="mt-6 max-w-lg text-base sm:text-lg text-white/60">
          Join cinephiles and anime lovers building their dream aesthetic libraries. Free forever, no tracking ads, pure cinema.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="group relative flex items-center justify-center gap-2.5 rounded-full bg-[#d9f06a] px-9 py-4 text-base font-extrabold text-[#101214] shadow-[0_0_40px_rgba(217,240,106,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(217,240,106,0.6)] active:scale-95 w-full sm:w-auto"
          >
            <span>Create My Universe</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/[0.1] hover:border-white/40 active:scale-95 w-full sm:w-auto"
          >
            <span>Sign In to Existing</span>
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/40">
          Takes less than 15 seconds · No credit card required
        </p>
      </div>

      {/* Footer Strip */}
      <footer className="mt-28 border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/50">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d9f06a] text-[#101214] font-bold">
            <Clapperboard size={15} />
          </span>
          <span className="font-bold tracking-widest text-white">WATCHVERSE</span>
          <span className="text-white/20">/</span>
          <span>A sanctuary for what you watch.</span>
        </div>

        <div className="flex items-center gap-6 text-white/60">
          <Link href="/library" className="hover:text-white transition-colors">
            Library
          </Link>
          <Link href="/add" className="hover:text-white transition-colors">
            Search
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            Sign In
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-[11px] text-white/40">Powered by TMDB</span>
        </div>
      </footer>
    </section>
  );
}
