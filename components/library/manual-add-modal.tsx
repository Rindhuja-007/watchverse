"use client";

import { useState } from "react";
import {
  X,
  Sparkles,
  Film,
  Tv,
  Star,
  Heart,
  Plus,
  Image as ImageIcon,
  Check,
  Tag,
  BookOpen,
} from "lucide-react";
import { PRESET_POSTERS, resolvePosterUrl } from "@/lib/images";
import { sounds } from "@/lib/sounds";
import { type LibraryEntry } from "./library-view";

interface ManualAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (entry: LibraryEntry) => void;
}

type DomainTab = "MOVIE" | "SERIES" | "ANIME" | "KDRAMA" | "SITCOM";
type StatusType = "PLAN_TO_WATCH" | "WATCHING" | "WATCHED" | "ON_HOLD" | "DROPPED";

const SUGGESTED_GENRES = [
  "Action",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Fantasy",
  "Comedy",
  "Shonen",
  "Mystery",
  "Horror",
  "Drama",
  "Cyberpunk",
  "Supernatural",
  "Slice of Life",
];

const SUGGESTED_LABELS = [
  "Masterpiece",
  "Comfort Show",
  "Weekend Binge",
  "High Priority",
  "Rewatch",
  "Cinematic Gem",
];

export function ManualAddModal({ isOpen, onClose, onSuccess }: ManualAddModalProps) {
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<DomainTab>("ANIME");
  const [mediaType, setMediaType] = useState<"MOVIE" | "TV">("TV");
  const [status, setStatus] = useState<StatusType>("WATCHING");
  const [rating, setRating] = useState<number | null>(9);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Action", "Shonen"]);
  const [customGenre, setCustomGenre] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>(["Masterpiece"]);
  const [customLabel, setCustomLabel] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [seasonNumber, setSeasonNumber] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(12);
  const [releaseYear, setReleaseYear] = useState<string>(new Date().getFullYear().toString());
  const [overview, setOverview] = useState("");
  const [notes, setNotes] = useState("");
  const [favorite, setFavorite] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleGenreToggle(g: string) {
    sounds.click();
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  }

  function handleAddCustomGenre() {
    const trimmed = customGenre.trim();
    if (!trimmed) return;
    sounds.click();
    if (!selectedGenres.includes(trimmed)) {
      setSelectedGenres((prev) => [...prev, trimmed]);
    }
    setCustomGenre("");
  }

  function handleLabelToggle(lbl: string) {
    sounds.click();
    setSelectedLabels((prev) =>
      prev.includes(lbl) ? prev.filter((item) => item !== lbl) : [...prev, lbl]
    );
  }

  function handleAddCustomLabel() {
    const trimmed = customLabel.trim();
    if (!trimmed) return;
    sounds.click();
    if (!selectedLabels.includes(trimmed)) {
      setSelectedLabels((prev) => [...prev, trimmed]);
    }
    setCustomLabel("");
  }

  // Active preview poster
  const previewPoster = resolvePosterUrl(posterUrl, domain, title);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a title for the show.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Build notes combined with tags and labels if provided
      const labelStrings = [
        ...selectedGenres.map((g) => `[Genre: ${g}]`),
        ...selectedLabels.map((l) => `[Tag: ${l}]`),
      ].join(" ");
      const combinedNotes = [notes.trim(), labelStrings].filter(Boolean).join("\n\n");

      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          mediaType: domain === "MOVIE" ? "MOVIE" : mediaType,
          domain,
          status,
          rating,
          posterPath: posterUrl.trim() || previewPoster,
          overview: overview.trim() || null,
          releaseDate: releaseYear ? `${releaseYear}-01-01` : null,
          seasonNumber,
          currentEpisode: status === "WATCHED" ? totalEpisodes : currentEpisode,
          totalEpisodes,
          notes: combinedNotes || null,
          favorite,
          genres: selectedGenres,
          labels: selectedLabels,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add title");
      }

      // Sensory feedback!
      sounds.success();
      onSuccess(data.entry);
      onClose();
    } catch (err: unknown) {
      console.error("Manual add title error:", err);
      setError((err as Error)?.message || "Something went wrong while saving title.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/15 bg-[#10131a] shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-[#f5f1e8] my-8 overflow-hidden">
        {/* Ambient Top Glow Banner */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#d9f06a] via-[#38bdf8] to-[#ea3829]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4.5 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d9f06a] text-[#101214] shadow-md shadow-[#d9f06a]/20">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Add Title Manually
                <span className="rounded-full bg-[#d9f06a]/15 text-[#d9f06a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Custom Entry
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Register any show, movie, anime or custom universe with custom genres, labels & poster art.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.click();
              onClose();
            }}
            className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Live Card Preview & Poster Picker */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[240px]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                  <ImageIcon size={13} />
                  <span>Live Poster Preview</span>
                </div>

                {/* The 2:3 Cinematic Poster Card Preview */}
                <div className="group relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#161922] border border-white/20 shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                  {/* Rating Badge */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#facc15] text-[#101214] font-black text-xs shadow-md shadow-black/50">
                    {rating ?? "—"}
                  </div>

                  {/* Favorite indicator */}
                  {favorite && (
                    <div className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-rose-400">
                      <Heart size={14} fill="currentColor" />
                    </div>
                  )}

                  {/* Poster image */}
                  <img
                    src={previewPoster}
                    alt={title || "Preview"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/85 to-transparent pt-12 pb-3 px-3.5 flex flex-col justify-end">
                    <span className="rounded bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/90 w-max mb-1">
                      {domain}
                    </span>
                    <h4 className="truncate text-sm font-black text-white">
                      {title || "Your Title Name"}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-white/60 font-semibold mt-0.5">
                      <span className="text-[#00e5ff]">
                        {status === "WATCHED"
                          ? "Seen"
                          : `S${seasonNumber} E${currentEpisode}/${totalEpisodes}`}
                      </span>
                      <span>{status.replace(/_/g, " ")}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/20 mt-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00e5ff] rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            status === "WATCHED"
                              ? 100
                              : Math.min(100, Math.round((currentEpisode / totalEpisodes) * 100))
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Preset Art Picker */}
              <div className="w-full mt-4">
                <span className="block text-[11px] font-semibold text-white/50 mb-2">
                  Or pick a curated poster artwork:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_POSTERS.slice(0, 8).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        sounds.click();
                        setPosterUrl(preset.url);
                        if (!title) setTitle(preset.previewName);
                      }}
                      className={`relative aspect-[2/3] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        posterUrl === preset.url
                          ? "border-[#d9f06a] ring-2 ring-[#d9f06a]/40 scale-105"
                          : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.previewName}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Form Inputs */}
            <div className="lg:col-span-7 space-y-4">
              {/* Title & Favorite */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">
                  Show / Movie Title *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Neon Genesis Evangelion, Arcane, Inception..."
                    className="flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9f06a] focus:bg-white/[0.07] focus:outline-none transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sounds.favorite();
                      setFavorite(!favorite);
                    }}
                    className={`rounded-xl p-2.5 border transition cursor-pointer ${
                      favorite
                        ? "border-rose-500/50 bg-rose-500/20 text-rose-400"
                        : "border-white/10 bg-white/5 text-white/40 hover:text-white"
                    }`}
                    title="Mark as Favorite"
                  >
                    <Heart size={20} fill={favorite ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Category / Domain Selector */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">
                  Format / Category
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(
                    [
                      { id: "ANIME", label: "Anime" },
                      { id: "MOVIE", label: "Movie" },
                      { id: "SERIES", label: "Series" },
                      { id: "KDRAMA", label: "K-Drama" },
                      { id: "SITCOM", label: "Sitcom" },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        sounds.click();
                        setDomain(cat.id);
                        if (cat.id === "MOVIE") setMediaType("MOVIE");
                        else setMediaType("TV");
                      }}
                      className={`rounded-xl py-2 px-1 text-center text-xs font-bold transition cursor-pointer ${
                        domain === cat.id
                          ? "bg-[#d9f06a] text-[#101214] shadow-md shadow-[#d9f06a]/20"
                          : "border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">
                  Watch Status
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(
                    [
                      { id: "WATCHING", label: "Watching", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" },
                      { id: "WATCHED", label: "Watched", color: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
                      { id: "PLAN_TO_WATCH", label: "Plan to Watch", color: "bg-blue-500/20 text-blue-400 border-blue-500/40" },
                      { id: "ON_HOLD", label: "On Hold", color: "bg-purple-500/20 text-purple-400 border-purple-500/40" },
                      { id: "DROPPED", label: "Dropped", color: "bg-rose-500/20 text-rose-400 border-rose-500/40" },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        sounds.click();
                        setStatus(st.id);
                      }}
                      className={`rounded-xl py-2 text-center text-[11px] font-bold border transition cursor-pointer ${
                        status === st.id
                          ? st.color
                          : "border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating & Release Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Rating 1-10 */}
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide flex items-center justify-between">
                    <span>Personal Rating</span>
                    <span className="text-[#facc15] font-black">{rating ? `${rating}/10` : "Unrated"}</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-xl p-2">
                    <Star size={16} className="text-[#facc15] shrink-0 fill-current" />
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={rating || 5}
                      onChange={(e) => {
                        sounds.click();
                        setRating(Number(e.target.value));
                      }}
                      className="w-full accent-[#facc15] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Release Year */}
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">
                    Release Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2099"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-white focus:border-[#d9f06a] focus:outline-none"
                  />
                </div>
              </div>

              {/* Episode Tracker (Only for non-movies) */}
              {domain !== "MOVIE" && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-white/80 flex items-center gap-1.5">
                      <Tv size={14} className="text-[#00e5ff]" />
                      <span>Episode Progress</span>
                    </span>
                    <span className="text-xs font-mono text-[#00e5ff] font-bold">
                      {currentEpisode} / {totalEpisodes} eps
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="block text-[10px] text-white/40 mb-1">Season</span>
                      <input
                        type="number"
                        min="1"
                        value={seasonNumber}
                        onChange={(e) => setSeasonNumber(Number(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 text-center text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-white/40 mb-1">Current Ep</span>
                      <input
                        type="number"
                        min="0"
                        value={currentEpisode}
                        onChange={(e) => setCurrentEpisode(Number(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 text-center text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-white/40 mb-1">Total Eps</span>
                      <input
                        type="number"
                        min="1"
                        value={totalEpisodes}
                        onChange={(e) => setTotalEpisodes(Number(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 text-center text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Genres Picker */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                  <Tag size={13} className="text-[#38bdf8]" />
                  <span>Genres</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_GENRES.map((g) => {
                    const isSelected = selectedGenres.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleGenreToggle(g)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-[#38bdf8] text-[#101214] shadow-sm shadow-[#38bdf8]/30 font-bold"
                            : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {isSelected ? `✓ ${g}` : g}
                      </button>
                    );
                  })}
                </div>
                {/* Custom Genre input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomGenre();
                      }
                    }}
                    placeholder="Add custom genre (press enter)..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-[#38bdf8] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomGenre}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Custom Labels / Badges */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#ea3829]" />
                  <span>Custom Labels & Shelf Tags</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_LABELS.map((lbl) => {
                    const isSelected = selectedLabels.includes(lbl);
                    return (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => handleLabelToggle(lbl)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-[#ea3829] text-white shadow-sm shadow-[#ea3829]/30 font-bold"
                            : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {isSelected ? `✓ ${lbl}` : lbl}
                      </button>
                    );
                  })}
                </div>
                {/* Custom Label input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomLabel();
                      }
                    }}
                    placeholder="Add custom label e.g. 'Rewatching with friends'..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-[#ea3829] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomLabel}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Poster Image URL Field */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">
                  Custom Poster Image URL
                </label>
                <input
                  type="url"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="Paste any high-res image link (https://...)"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-[#d9f06a] focus:outline-none"
                />
              </div>

              {/* Notes / Review */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen size={13} className="text-white/40" />
                  <span>Personal Notes & Review</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Your thoughts, memorable quotes, or who recommended it..."
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] p-3 text-xs text-white placeholder-white/30 focus:border-[#d9f06a] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={() => {
                sounds.click();
                onClose();
              }}
              className="rounded-full px-5 py-2.5 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-full bg-[#d9f06a] px-7 py-2.5 text-xs font-black text-[#101214] shadow-lg shadow-[#d9f06a]/20 hover:bg-[#cbe25a] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            >
              <Check size={16} />
              <span>{isSubmitting ? "Adding to Wall..." : "Save to Wall of Watching"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
