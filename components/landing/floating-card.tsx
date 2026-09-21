"use client";

import Image from "next/image";
import { Star, Sparkles, Heart, Eye, Play } from "lucide-react";
import React from "react";

export interface FloatingCardProps {
  title: string;
  subtitle: string;
  posterUrl: string;
  rating?: number;
  badge: string;
  tagColor?: string; // tailwind color class
  borderColor?: string; // border-emerald-400 etc
  sticker?: {
    text: string;
    icon?: string;
    color: string;
  };
  progress?: {
    current: number;
    total: number;
    label: string;
  };
  status?: string;
  rotation?: number; // e.g. -12, 8, etc
  animationClass?: string; // animate-float-slow, etc
  className?: string;
}

export function FloatingCard({
  title,
  subtitle,
  posterUrl,
  rating = 4.8,
  badge,
  tagColor = "bg-[#d9f06a] text-[#101214]",
  borderColor = "border-white/15",
  sticker,
  progress,
  status,
  rotation = 0,
  animationClass = "animate-float-slow",
  className = "",
}: FloatingCardProps) {
  return (
    <div
      style={{ "--card-rot": `${rotation}deg` } as React.CSSProperties}
      className={`group relative select-none transition-all duration-500 ease-out hover:!rotate-0 hover:!scale-105 hover:z-30 cursor-pointer ${animationClass} ${className}`}
    >
      {/* Outer Card Body */}
      <div
        className={`relative w-[210px] sm:w-[240px] md:w-[260px] rounded-2xl md:rounded-3xl border-2 ${borderColor} bg-[#14171d]/90 p-2.5 sm:p-3 shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)] group-hover:border-white/40`}
      >
        {/* Top Header Strip */}
        <div className="mb-2 flex items-center justify-between px-1">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${tagColor} shadow-sm`}
          >
            {badge}
          </span>
          <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-bold text-[#d9f06a] backdrop-blur-md">
            <Star size={11} fill="currentColor" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Poster Image Frame */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#1e222a]">
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(min-width: 768px) 260px, (min-width: 640px) 240px, 210px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
          {/* Subtle Ambient Film Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101214] via-transparent to-black/30" />

          {/* Optional Sticker Overlay (Like in reference) */}
          {sticker && (
            <div
              className={`absolute -top-1 -right-1 rotate-6 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg ${sticker.color} border border-white/20`}
            >
              {sticker.icon && <span className="mr-1">{sticker.icon}</span>}
              {sticker.text}
            </div>
          )}

          {/* Status Badge */}
          {status && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-md border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d9f06a] animate-pulse" />
              {status}
            </div>
          )}
        </div>

        {/* Card Footer Info */}
        <div className="mt-2.5 px-1 pb-0.5">
          <div className="flex items-baseline justify-between gap-1">
            <h4 className="truncate text-sm font-bold text-white group-hover:text-[#d9f06a] transition-colors">
              {title}
            </h4>
          </div>
          <p className="truncate text-[11px] font-medium text-white/50">{subtitle}</p>

          {/* Episode Progress Bar if applicable */}
          {progress && (
            <div className="mt-2 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] font-medium text-white/60 mb-1">
                <span>{progress.label}</span>
                <span className="text-[#d9f06a] font-bold">
                  {progress.current}/{progress.total}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#d9f06a] to-emerald-400"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
