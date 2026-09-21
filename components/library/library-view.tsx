"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Star,
  Film,
  Tv,
  Heart,
  SlidersHorizontal,
  Trash2,
  Edit3,
  X,
  Check,
  Calendar,
  Sparkles,
  Plus,
  Loader2,
  ExternalLink,
} from "lucide-react";

export type LibraryEntry = {
  id: string;
  userId: string;
  externalMediaId: number;
  mediaType: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string | null;
  releaseDate: string | Date | null;
  domain: string;
  status: string;
  rating: number | null;
  notes: string | null;
  favorite: boolean;
  dateAdded: string | Date;
  dateStarted: string | Date | null;
  dateCompleted: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

interface LibraryViewProps {
  initialEntries: LibraryEntry[];
}

type StatusTab = "ALL" | "WATCHING" | "PLAN_TO_WATCH" | "WATCHED" | "ON_HOLD" | "DROPPED" | "FAVORITES";
type DomainPill = "ALL" | "MOVIE" | "SERIES" | "ANIME" | "KDRAMA" | "SITCOM";
type SortOption = "recent" | "rating_desc" | "title_asc" | "year_desc";

export function LibraryView({ initialEntries }: LibraryViewProps) {
  const [entries, setEntries] = useState<LibraryEntry[]>(initialEntries);
  const [activeStatus, setActiveStatus] = useState<StatusTab>("ALL");
  const [activeDomain, setActiveDomain] = useState<DomainPill>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // Edit/Detail Modal State
  const [activeEntry, setActiveEntry] = useState<LibraryEntry | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editRating, setEditRating] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [editFavorite, setEditFavorite] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status counts
  const counts = useMemo(() => {
    const map: Record<string, number> = {
      ALL: entries.length,
      WATCHING: 0,
      PLAN_TO_WATCH: 0,
      WATCHED: 0,
      ON_HOLD: 0,
      DROPPED: 0,
      FAVORITES: 0,
    };
    entries.forEach((e) => {
      if (map[e.status] !== undefined) map[e.status]++;
      if (e.favorite) map.FAVORITES++;
    });
    return map;
  }, [entries]);

  // Filtered & Sorted Entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        // Status tab filter
        if (activeStatus === "FAVORITES") {
          if (!entry.favorite) return false;
        } else if (activeStatus !== "ALL") {
          if (entry.status !== activeStatus) return false;
        }

        // Domain pill filter
        if (activeDomain !== "ALL") {
          if (entry.domain !== activeDomain) return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = entry.title.toLowerCase().includes(q);
          const matchNotes = (entry.notes || "").toLowerCase().includes(q);
          const matchOverview = (entry.overview || "").toLowerCase().includes(q);
          if (!matchTitle && !matchNotes && !matchOverview) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating_desc") {
          const rA = a.rating ?? -1;
          const rB = b.rating ?? -1;
          if (rB !== rA) return rB - rA;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "title_asc") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "year_desc") {
          const yA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          const yB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          return yB - yA;
        }
        // "recent"
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [entries, activeStatus, activeDomain, searchQuery, sortBy]);

  // Toggle Favorite
  async function toggleFavorite(e: React.MouseEvent, entry: LibraryEntry) {
    e.stopPropagation();
    const nextVal = !entry.favorite;

    // Optimistic update
    setEntries((prev) =>
      prev.map((item) => (item.id === entry.id ? { ...item, favorite: nextVal } : item))
    );

    try {
      await fetch(`/api/library/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: nextVal }),
      });
    } catch {
      // Revert on error
      setEntries((prev) =>
        prev.map((item) => (item.id === entry.id ? { ...item, favorite: !nextVal } : item))
      );
    }
  }

  function openDetailModal(entry: LibraryEntry) {
    setActiveEntry(entry);
    setEditStatus(entry.status);
    setEditRating(entry.rating);
    setEditNotes(entry.notes || "");
    setEditFavorite(entry.favorite);
  }

  async function handleSaveChanges() {
    if (!activeEntry) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/library/${activeEntry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          rating: editRating,
          notes: editNotes.trim() || null,
          favorite: editFavorite,
        }),
      });

      if (res.ok) {
        const { entry: updated } = await res.json();
        setEntries((prev) =>
          prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
        );
        setActiveEntry(null);
      }
    } catch (err) {
      console.error("Failed to update entry:", err);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteEntry() {
    if (!activeEntry) return;
    if (!confirm(`Are you sure you want to remove "${activeEntry.title}" from your library?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/library/${activeEntry.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEntries((prev) => prev.filter((item) => item.id !== activeEntry.id));
        setActiveEntry(null);
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Status Filter Tabs */}
      <div className="flex overflow-x-auto border-b border-white/10 pb-px scrollbar-none">
        <div className="flex gap-2">
          {[
            { id: "ALL", label: "All Titles" },
            { id: "WATCHING", label: "Watching" },
            { id: "PLAN_TO_WATCH", label: "Plan to Watch" },
            { id: "WATCHED", label: "Watched" },
            { id: "ON_HOLD", label: "On Hold" },
            { id: "DROPPED", label: "Dropped" },
            { id: "FAVORITES", label: "Favorites" },
          ].map((tab) => {
            const isActive = activeStatus === tab.id;
            const count = counts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatus(tab.id as StatusTab)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "border-[#d9f06a] text-[#d9f06a]"
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-[#d9f06a] text-[#101214]"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Search, Domain Pills, and Sort */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Domain Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "ALL", label: "All Categories" },
            { id: "MOVIE", label: "Movies" },
            { id: "SERIES", label: "Series" },
            { id: "ANIME", label: "Anime" },
            { id: "KDRAMA", label: "K-Drama" },
            { id: "SITCOM", label: "Sitcom" },
          ].map((domain) => {
            const isSelected = activeDomain === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id as DomainPill)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-[#d9f06a] text-[#101214] shadow-sm shadow-[#d9f06a]/20"
                    : "border border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                {domain.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex min-w-[200px] flex-1 items-center rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 focus-within:border-[#d9f06a]">
            <Search size={14} className="text-white/40" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="min-w-0 flex-1 bg-transparent px-2 text-xs text-white outline-none placeholder:text-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-white/40 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70">
            <SlidersHorizontal size={13} className="text-white/40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs text-white outline-none cursor-pointer"
            >
              <option value="recent" className="bg-[#17191d] text-white">Recently Added</option>
              <option value="rating_desc" className="bg-[#17191d] text-white">Highest Rated</option>
              <option value="title_asc" className="bg-[#17191d] text-white">Alphabetical (A-Z)</option>
              <option value="year_desc" className="bg-[#17191d] text-white">Release Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Library Grid */}
      {filteredEntries.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredEntries.map((entry) => {
            const posterUrl = entry.posterPath
              ? entry.posterPath.startsWith("http")
                ? entry.posterPath
                : `https://image.tmdb.org/t/p/w500${entry.posterPath}`
              : null;
            const releaseYear = entry.releaseDate
              ? new Date(entry.releaseDate).getFullYear()
              : null;

            return (
              <article
                key={entry.id}
                onClick={() => openDetailModal(entry)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-2 hover:border-[#d9f06a]/40 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-black/60"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-br from-[#2a3038] to-[#121417]">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={`${entry.title} poster`}
                      fill
                      sizes="(min-width: 1280px) 240px, (min-width: 768px) 300px, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/20">
                      {entry.mediaType === "TV" ? <Tv size={40} /> : <Film size={40} />}
                    </div>
                  )}

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101214] via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                    <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white/90 backdrop-blur-md">
                      {entry.domain}
                    </span>
                  </div>

                  {/* Favorite button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, entry)}
                    className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-md transition-transform hover:scale-110"
                    title={entry.favorite ? "Favorited" : "Add to favorites"}
                  >
                    <Heart
                      size={14}
                      className={
                        entry.favorite
                          ? "fill-[#d9f06a] text-[#d9f06a]"
                          : "text-white/60 hover:text-white"
                      }
                    />
                  </button>

                  {/* Rating Badge */}
                  {entry.rating ? (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md border border-white/20 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-[#d9f06a] backdrop-blur-md">
                      <Star size={11} fill="currentColor" />
                      <span>{entry.rating}/10</span>
                    </div>
                  ) : null}

                  {/* Status pill on poster */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        entry.status === "WATCHED"
                          ? "bg-emerald-500/80 text-white"
                          : entry.status === "WATCHING"
                          ? "bg-[#d9f06a]/90 text-[#101214]"
                          : entry.status === "PLAN_TO_WATCH"
                          ? "bg-blue-500/80 text-white"
                          : "bg-white/30 text-white"
                      }`}
                    >
                      {entry.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5">
                  <h3 className="line-clamp-1 text-sm font-semibold text-white transition-colors group-hover:text-[#d9f06a]">
                    {entry.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-white/40">
                    <span>{entry.mediaType === "TV" ? "Series" : "Movie"}</span>
                    {releaseYear && <span>{releaseYear}</span>}
                  </div>
                  {entry.notes && (
                    <p className="mt-2 line-clamp-1 text-[11px] italic text-white/50">
                      &quot;{entry.notes}&quot;
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d9f06a]/10 text-[#d9f06a]">
            <Film size={28} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">No titles found in this view</h2>
          <p className="mt-2 text-xs text-white/50">
            {searchQuery
              ? `No titles match "${searchQuery}". Try a different search term or filter.`
              : "Your shelf for this category is currently empty."}
          </p>
          <div className="mt-6">
            <Link
              href="/add"
              className="inline-flex items-center gap-2 rounded-full bg-[#d9f06a] px-5 py-2.5 text-xs font-semibold text-[#101214] shadow-md shadow-[#d9f06a]/20 hover:bg-[#cbe25a]"
            >
              <Plus size={14} />
              Add Titles to Universe
            </Link>
          </div>
        </div>
      )}

      {/* Detail & Edit Modal */}
      {activeEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#17191d] p-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveEntry(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Header info */}
            <div className="flex gap-5 border-b border-white/10 pb-5">
              <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-white/10">
                {activeEntry.posterPath ? (
                  <Image
                    src={
                      activeEntry.posterPath.startsWith("http")
                        ? activeEntry.posterPath
                        : `https://image.tmdb.org/t/p/w300${activeEntry.posterPath}`
                    }
                    alt={activeEntry.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/20">
                    ✦
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#d9f06a]/15 px-2 py-0.5 text-[10px] font-bold text-[#d9f06a]">
                    {activeEntry.domain}
                  </span>
                  <span className="text-xs text-white/40">
                    {activeEntry.mediaType === "TV" ? "Series" : "Movie"}
                  </span>
                  {activeEntry.releaseDate && (
                    <span className="text-xs text-white/40">
                      · {new Date(activeEntry.releaseDate).getFullYear()}
                    </span>
                  )}
                </div>

                <h3 className="mt-1 text-2xl font-bold text-white">{activeEntry.title}</h3>

                {activeEntry.overview && (
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/60">
                    {activeEntry.overview}
                  </p>
                )}
              </div>
            </div>

            {/* Edit Form */}
            <div className="mt-5 space-y-4">
              {/* Watch Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                  Status
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {[
                    { value: "PLAN_TO_WATCH", label: "Plan to Watch" },
                    { value: "WATCHING", label: "Watching" },
                    { value: "WATCHED", label: "Watched" },
                    { value: "ON_HOLD", label: "On Hold" },
                    { value: "DROPPED", label: "Dropped" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setEditStatus(s.value)}
                      className={`rounded-xl py-2 text-xs font-semibold transition ${
                        editStatus === s.value
                          ? "bg-[#d9f06a] text-[#101214]"
                          : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Your Rating (1-10)
                  </label>
                  <span className="text-xs font-bold text-[#d9f06a]">
                    {editRating ? `${editRating} / 10` : "Unrated"}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setEditRating(editRating === num ? null : num)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                        editRating && editRating >= num
                          ? "bg-[#d9f06a] text-[#101214]"
                          : "bg-white/5 text-white/40 hover:bg-white/15"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                  Personal Notes & Review
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Your thoughts, memorable moments, favorite quote..."
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#d9f06a]"
                />
              </div>

              {/* Favorite Checkbox */}
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFavorite}
                    onChange={(e) => setEditFavorite(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/10 accent-[#d9f06a]"
                  />
                  <span>Mark as Favorite in Universe</span>
                </label>
                <Heart
                  size={18}
                  className={editFavorite ? "fill-[#d9f06a] text-[#d9f06a]" : "text-white/20"}
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleDeleteEntry}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 px-4 py-2.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  {isDeleting ? "Removing..." : "Remove Title"}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveEntry(null)}
                    className="rounded-xl px-4 py-2.5 text-xs font-semibold text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={isUpdating}
                    className="flex items-center gap-1.5 rounded-xl bg-[#d9f06a] px-5 py-2.5 text-xs font-semibold text-[#101214] shadow-md shadow-[#d9f06a]/20 hover:bg-[#cbe25a] disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
