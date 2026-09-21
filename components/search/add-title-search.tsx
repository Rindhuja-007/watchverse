"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Star,
  Plus,
  Check,
  Film,
  Tv,
  Sparkles,
  Loader2,
  X,
  BookmarkPlus,
  SlidersHorizontal,
  FilePlus,
  Heart,
} from "lucide-react";
import { type TmdbResult } from "@/lib/tmdb";

type DomainType = "MOVIE" | "SERIES" | "ANIME" | "KDRAMA" | "SITCOM";
type WatchStatusType = "PLAN_TO_WATCH" | "WATCHING" | "WATCHED" | "ON_HOLD" | "DROPPED";

export function AddTitleSearch() {
  const [tab, setTab] = useState<"search" | "manual">("search");
  const [query, setQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("ALL");
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State for Adding with Custom Details
  const [selectedTitle, setSelectedTitle] = useState<TmdbResult | null>(null);
  const [modalStatus, setModalStatus] = useState<WatchStatusType>("PLAN_TO_WATCH");
  const [modalDomain, setModalDomain] = useState<DomainType>("MOVIE");
  const [modalRating, setModalRating] = useState<number | null>(null);
  const [modalNotes, setModalNotes] = useState("");
  const [modalFavorite, setModalFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Manual Form State
  const [manualTitle, setManualTitle] = useState("");
  const [manualMediaType, setManualMediaType] = useState<"MOVIE" | "TV">("MOVIE");
  const [manualDomain, setManualDomain] = useState<DomainType>("MOVIE");
  const [manualStatus, setManualStatus] = useState<WatchStatusType>("PLAN_TO_WATCH");
  const [manualPoster, setManualPoster] = useState("");
  const [manualOverview, setManualOverview] = useState("");
  const [manualRating, setManualRating] = useState<number | null>(null);
  const [manualFavorite, setManualFavorite] = useState(false);
  const [manualReleaseDate, setManualReleaseDate] = useState("");

  // Load initial results or run search
  useEffect(() => {
    let active = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        if (active) {
          setResults(data.results || []);
        }
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setIsSearching(false);
      }
    }, query ? 350 : 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  function openAddModal(item: TmdbResult) {
    setSelectedTitle(item);
    const inferredDomain: DomainType =
      item.domain || (item.media_type === "tv" ? "SERIES" : "MOVIE");
    setModalDomain(inferredDomain);
    setModalStatus("PLAN_TO_WATCH");
    setModalRating(null);
    setModalNotes("");
    setModalFavorite(false);
  }

  async function handleSaveFromModal() {
    if (!selectedTitle) return;
    setIsSaving(true);
    setMessage(null);

    const title = selectedTitle.title || selectedTitle.name || "Untitled";
    const mediaType = selectedTitle.media_type === "tv" ? "TV" : "MOVIE";
    const releaseDate =
      selectedTitle.release_date || selectedTitle.first_air_date || null;

    try {
      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          externalMediaId: selectedTitle.id,
          mediaType,
          title,
          posterPath: selectedTitle.poster_path,
          backdropPath: selectedTitle.backdrop_path,
          overview: selectedTitle.overview,
          releaseDate,
          domain: modalDomain,
          status: modalStatus,
          rating: modalRating,
          notes: modalNotes.trim() || null,
          favorite: modalFavorite,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: `"${title}" has been added to your universe!`,
        });
        setSelectedTitle(null);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to add title to library.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error while saving title.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualTitle.trim(),
          mediaType: manualMediaType,
          domain: manualDomain,
          status: manualStatus,
          posterPath: manualPoster.trim() || null,
          overview: manualOverview.trim() || null,
          releaseDate: manualReleaseDate || null,
          rating: manualRating,
          notes: null,
          favorite: manualFavorite,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: `Custom title "${manualTitle}" successfully added!`,
        });
        setManualTitle("");
        setManualPoster("");
        setManualOverview("");
        setManualRating(null);
        setManualFavorite(false);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to add custom title.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error while saving custom title.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const filteredResults = results.filter((item) => {
    if (domainFilter === "ALL") return true;
    const itemDomain = item.domain || (item.media_type === "tv" ? "SERIES" : "MOVIE");
    return itemDomain === domainFilter;
  });

  return (
    <div className="mt-8 space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => {
            setTab("search");
            setMessage(null);
          }}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
            tab === "search"
              ? "bg-[#d9f06a] text-[#101214] shadow-md shadow-[#d9f06a]/20"
              : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
          }`}
        >
          <Search size={14} />
          Catalog & TMDB Search
        </button>

        <button
          type="button"
          onClick={() => {
            setTab("manual");
            setMessage(null);
          }}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
            tab === "manual"
              ? "bg-[#d9f06a] text-[#101214] shadow-md shadow-[#d9f06a]/20"
              : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
          }`}
        >
          <FilePlus size={14} />
          Add Custom / Manual Title
        </button>
      </div>

      {/* Alert banner */}
      {message && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 text-xs font-medium backdrop-blur-md ${
            message.type === "success"
              ? "border border-[#d9f06a]/40 bg-[#d9f06a]/15 text-[#d9f06a]"
              : "border border-rose-500/40 bg-rose-500/15 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check size={16} /> : <X size={16} />}
            <span>{message.text}</span>
          </div>
          {message.type === "success" && (
            <Link
              href="/library"
              className="rounded-full bg-[#d9f06a] px-3.5 py-1 font-semibold text-[#101214] hover:bg-[#cbe25a]"
            >
              View in Library →
            </Link>
          )}
        </div>
      )}

      {/* Search Mode */}
      {tab === "search" && (
        <div className="space-y-6">
          {/* Search input & Domain Pills */}
          <div className="space-y-4">
            <div className="relative flex max-w-2xl items-center rounded-2xl border border-white/15 bg-white/[0.04] p-1.5 pl-4 transition focus-within:border-[#d9f06a] focus-within:bg-white/[0.07]">
              <Search size={18} className="text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, anime, series, k-dramas, sitcoms..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35"
              />
              {isSearching && (
                <Loader2 size={16} className="mr-3 animate-spin text-[#d9f06a]" />
              )}
              {query && !isSearching && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mr-2 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Domain Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/40 mr-1">Filter:</span>
              {[
                { label: "All", value: "ALL" },
                { label: "Movies", value: "MOVIE" },
                { label: "Series", value: "SERIES" },
                { label: "Anime", value: "ANIME" },
                { label: "K-Drama", value: "KDRAMA" },
                { label: "Sitcom", value: "SITCOM" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setDomainFilter(filter.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    domainFilter === filter.value
                      ? "bg-white/20 text-[#d9f06a] border border-[#d9f06a]/50"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-transparent"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResults.map((item) => {
              const title = item.title || item.name || "Untitled";
              const year = (item.release_date || item.first_air_date || "").slice(0, 4);
              const domain = item.domain || (item.media_type === "tv" ? "SERIES" : "MOVIE");
              const posterUrl = item.poster_path
                ? item.poster_path.startsWith("http")
                  ? item.poster_path
                  : `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : null;

              return (
                <article
                  key={`${item.media_type}-${item.id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40"
                >
                  <div>
                    {/* Poster */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#2a3038] to-[#121417]">
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={`${title} poster`}
                          fill
                          sizes="(min-width: 1280px) 280px, (min-width: 640px) 350px, 90vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/20">
                          {item.media_type === "tv" ? <Tv size={36} /> : <Film size={36} />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101214] via-transparent to-black/30" />

                      <div className="absolute left-3 top-3">
                        <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white/90 backdrop-blur-md">
                          {domain}
                        </span>
                      </div>

                      {item.vote_average ? (
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-[#d9f06a] backdrop-blur-md">
                          <Star size={10} fill="currentColor" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="line-clamp-1 text-base font-semibold text-white group-hover:text-[#d9f06a] transition-colors">
                        {title}
                      </h3>
                      <p className="mt-1 text-xs text-white/40">
                        {item.media_type === "tv" ? "Series" : "Movie"} {year ? `· ${year}` : ""}
                      </p>
                      {item.overview && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/55">
                          {item.overview}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => openAddModal(item)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#d9f06a]/40 bg-[#d9f06a]/10 py-2.5 text-xs font-semibold text-[#d9f06a] transition-all hover:bg-[#d9f06a] hover:text-[#101214]"
                    >
                      <BookmarkPlus size={14} />
                      Add with Details...
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredResults.length === 0 && !isSearching && (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <p className="text-sm text-white/50">
                No titles match your search. Try adjusting terms or use the &quot;Add Custom / Manual Title&quot; tab.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Form */}
      {tab === "manual" && (
        <form
          onSubmit={handleManualSubmit}
          className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
        >
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-semibold text-white">Create Custom Title</h2>
            <p className="mt-1 text-xs text-white/50">
              Add any film, indie short, YouTube series, or private title to your WatchVerse library.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
              Title Name *
            </label>
            <input
              required
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              placeholder="e.g. Spirited Away or My Custom Project"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d9f06a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                Domain
              </label>
              <select
                value={manualDomain}
                onChange={(e) => setManualDomain(e.target.value as DomainType)}
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#17191d] px-4 py-3 text-sm text-white outline-none focus:border-[#d9f06a]"
              >
                <option value="MOVIE">Movie</option>
                <option value="SERIES">Series</option>
                <option value="ANIME">Anime</option>
                <option value="KDRAMA">K-Drama</option>
                <option value="SITCOM">Sitcom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                Initial Watch Status
              </label>
              <select
                value={manualStatus}
                onChange={(e) => setManualStatus(e.target.value as WatchStatusType)}
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#17191d] px-4 py-3 text-sm text-white outline-none focus:border-[#d9f06a]"
              >
                <option value="PLAN_TO_WATCH">Plan to Watch</option>
                <option value="WATCHING">Watching</option>
                <option value="WATCHED">Watched</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="DROPPED">Dropped</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                Release Date / Year
              </label>
              <input
                type="date"
                value={manualReleaseDate}
                onChange={(e) => setManualReleaseDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#17191d] px-4 py-2.5 text-sm text-white outline-none focus:border-[#d9f06a]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
                Personal Rating (1-10)
              </label>
              <div className="mt-1.5 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setManualRating(manualRating === num ? null : num)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${
                      manualRating && manualRating >= num
                        ? "bg-[#d9f06a] text-[#101214]"
                        : "bg-white/10 text-white/40 hover:bg-white/20"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
              Poster Image URL (Optional)
            </label>
            <input
              value={manualPoster}
              onChange={(e) => setManualPoster(e.target.value)}
              placeholder="https://images.unsplash.com/... or TMDB path"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d9f06a]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-white/70">
              Overview / Synopsis
            </label>
            <textarea
              rows={3}
              value={manualOverview}
              onChange={(e) => setManualOverview(e.target.value)}
              placeholder="What is this story about?"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d9f06a]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="manual-fav"
              checked={manualFavorite}
              onChange={(e) => setManualFavorite(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/10 accent-[#d9f06a]"
            />
            <label htmlFor="manual-fav" className="flex items-center gap-1.5 text-xs text-white/80 cursor-pointer">
              <Heart size={13} className={manualFavorite ? "fill-[#d9f06a] text-[#d9f06a]" : ""} />
              Mark as Favorite Title
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d9f06a] py-3.5 text-sm font-semibold text-[#101214] shadow-lg shadow-[#d9f06a]/20 hover:bg-[#cbe25a] disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add Custom Title to Library
          </button>
        </form>
      )}

      {/* Modal: Add with Custom Details */}
      {selectedTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#17191d] p-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTitle(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4 border-b border-white/10 pb-4">
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-white/10">
                {selectedTitle.poster_path ? (
                  <Image
                    src={
                      selectedTitle.poster_path.startsWith("http")
                        ? selectedTitle.poster_path
                        : `https://image.tmdb.org/t/p/w200${selectedTitle.poster_path}`
                    }
                    alt="poster"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/30">
                    ✦
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 pr-6">
                <span className="rounded bg-[#d9f06a]/15 px-2 py-0.5 text-[10px] font-semibold text-[#d9f06a]">
                  {selectedTitle.media_type === "tv" ? "SERIES" : "MOVIE"}
                </span>
                <h3 className="mt-1 truncate text-lg font-bold text-white">
                  {selectedTitle.title || selectedTitle.name}
                </h3>
                <p className="text-xs text-white/40">
                  {(selectedTitle.release_date || selectedTitle.first_air_date || "").slice(0, 4)}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {/* Domain Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                  Domain Category
                </label>
                <div className="mt-1.5 grid grid-cols-5 gap-1.5">
                  {(["MOVIE", "SERIES", "ANIME", "KDRAMA", "SITCOM"] as DomainType[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setModalDomain(d)}
                      className={`rounded-xl py-2 text-[11px] font-semibold transition ${
                        modalDomain === d
                          ? "bg-[#d9f06a] text-[#101214]"
                          : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {d === "KDRAMA" ? "K-Drama" : d.charAt(0) + d.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                  Watch Status
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {(
                    [
                      { value: "PLAN_TO_WATCH", label: "Plan to Watch" },
                      { value: "WATCHING", label: "Watching" },
                      { value: "WATCHED", label: "Watched" },
                      { value: "ON_HOLD", label: "On Hold" },
                      { value: "DROPPED", label: "Dropped" },
                    ] as { value: WatchStatusType; label: string }[]
                  ).map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setModalStatus(s.value)}
                      className={`rounded-xl py-2 text-xs font-semibold transition ${
                        modalStatus === s.value
                          ? "bg-[#d9f06a] text-[#101214]"
                          : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Selector */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Your Rating (1-10)
                  </label>
                  <span className="text-xs font-bold text-[#d9f06a]">
                    {modalRating ? `${modalRating} / 10` : "Unrated"}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setModalRating(modalRating === star ? null : star)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${
                        modalRating && modalRating >= star
                          ? "bg-[#d9f06a] text-[#101214]"
                          : "bg-white/5 text-white/40 hover:bg-white/15"
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                  Personal Notes / Review
                </label>
                <textarea
                  rows={2}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g. Masterpiece episode 4, favorite quote, or where you plan to watch..."
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#d9f06a]"
                />
              </div>

              {/* Favorite toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalFavorite}
                    onChange={(e) => setModalFavorite(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/10 accent-[#d9f06a]"
                  />
                  <span>Add to Favorites Collection</span>
                </label>
                <Star
                  size={16}
                  className={modalFavorite ? "fill-[#d9f06a] text-[#d9f06a]" : "text-white/20"}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedTitle(null)}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-white/60 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFromModal}
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#d9f06a] py-2.5 text-xs font-semibold text-[#101214] shadow-lg shadow-[#d9f06a]/20 hover:bg-[#cbe25a] disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Add to Universe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}