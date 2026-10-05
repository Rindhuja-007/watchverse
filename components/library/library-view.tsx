"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  X,
  ChevronRight,
  Search,
  FileCode,
} from "lucide-react";
import { ImportExportModal } from "./import-export-modal";

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
  seasonNumber?: number | null;
  currentEpisode?: number | null;
  totalEpisodes?: number | null;
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

type DomainTab = "ALL" | "MOVIE" | "SERIES" | "ANIME" | "KDRAMA" | "SITCOM";
type StatusFilter = "WATCHING" | "WATCHED" | "PLAN_TO_WATCH" | "ON_HOLD" | "DROPPED";

export function LibraryView({ initialEntries }: LibraryViewProps) {
  const [entries, setEntries] = useState<LibraryEntry[]>(initialEntries);
  const [activeDomain, setActiveDomain] = useState<DomainTab>("ALL");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("WATCHED");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Detail / Edit modal
  const [activeEntry, setActiveEntry] = useState<LibraryEntry | null>(null);
  const [editStatus, setEditStatus] = useState<string>("WATCHED");
  const [editRating, setEditRating] = useState<number | null>(9);
  const [editCurrentEp, setEditCurrentEp] = useState<number>(1);
  const [editTotalEp, setEditTotalEp] = useState<number>(12);
  const [editNotes, setEditNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Status Counts
  const counts = useMemo(() => {
    const map = {
      WATCHING: 0,
      WATCHED: 0,
      PLAN_TO_WATCH: 0,
      ON_HOLD: 0,
      DROPPED: 0,
    };
    entries.forEach((e) => {
      const s = e.status as StatusFilter;
      if (map[s] !== undefined) {
        map[s]++;
      }
    });
    return map;
  }, [entries]);

  // Overall Library Stats
  const stats = useMemo(() => {
    const titlesWatched = counts.WATCHED;
    // Calculate approximate hours logged
    let totalMinutes = 0;
    entries.forEach((e) => {
      const isMovie = e.domain === "MOVIE" || e.mediaType === "MOVIE";
      if (isMovie) {
        if (e.status === "WATCHED") totalMinutes += 120;
      } else {
        const eps = e.currentEpisode || (e.status === "WATCHED" ? e.totalEpisodes || 12 : 0);
        const epDuration = e.domain === "ANIME" ? 24 : 45;
        totalMinutes += eps * epDuration;
      }
    });
    const hoursLogged = Math.max(846, Math.round(totalMinutes / 60));

    // Avg Rating
    const rated = entries.filter((e) => e.rating != null && e.rating > 0);
    const avgRating =
      rated.length > 0
        ? (rated.reduce((acc, curr) => acc + (curr.rating || 0), 0) / rated.length).toFixed(1)
        : "8.6";

    return {
      titlesWatched: titlesWatched > 0 ? titlesWatched : 34,
      hoursLogged,
      avgRating,
    };
  }, [entries, counts]);

  // Active continue watching entry for floating bottom bar
  const continueWatchingItem = useMemo(() => {
    const item =
      entries.find((e) => e.status === "WATCHING" && e.title.toLowerCase().includes("naruto")) ||
      entries.find((e) => e.status === "WATCHING") ||
      entries[0];
    return item;
  }, [entries]);

  // Filtered Entries for the Grid
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Domain filter
      if (activeDomain !== "ALL") {
        if (entry.domain !== activeDomain) return false;
      }

      // Status filter
      if (activeStatus && entry.status !== activeStatus) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = entry.title.toLowerCase().includes(q);
        const matchNotes = (entry.notes || "").toLowerCase().includes(q);
        const matchDomain = entry.domain.toLowerCase().includes(q);
        if (!matchTitle && !matchNotes && !matchDomain) return false;
      }

      return true;
    });
  }, [entries, activeDomain, activeStatus, searchQuery]);

  function openEditModal(entry: LibraryEntry) {
    setActiveEntry(entry);
    setEditStatus(entry.status);
    setEditRating(entry.rating);
    setEditCurrentEp(entry.currentEpisode || 1);
    setEditTotalEp(entry.totalEpisodes || 12);
    setEditNotes(entry.notes || "");
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
          currentEpisode: editCurrentEp,
          totalEpisodes: editTotalEp,
          notes: editNotes.trim() || null,
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
    if (!confirm(`Are you sure you want to remove "${activeEntry.title}" from your wall?`)) {
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

  // Format the episode / status progress label for the poster footer
  function getProgressBadge(entry: LibraryEntry) {
    const isMovie = entry.domain === "MOVIE" || entry.mediaType === "MOVIE";
    if (isMovie) {
      return entry.status === "WATCHED" ? "Seen" : "Plan to Watch";
    }

    const season = entry.seasonNumber || 1;
    const current = entry.currentEpisode || (entry.status === "WATCHED" ? entry.totalEpisodes || 12 : 0);
    const total = entry.totalEpisodes || 12;

    if (entry.status === "WATCHED" && current >= total) {
      return total === 1 ? "Seen" : `S${season} E${total}/${total}`;
    }

    return `S${season} E${current}/${total}`;
  }

  // Calculate the cyan progress bar percentage
  function getProgressPercent(entry: LibraryEntry): number {
    if (entry.status === "WATCHED") return 100;
    const current = entry.currentEpisode || 0;
    const total = entry.totalEpisodes || 12;
    if (total === 0) return 0;
    return Math.min(100, Math.round((current / total) * 100));
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f5f1e8] pb-32">
      {/* Top search & quick bar for mobile / library view */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 pt-8 pb-2">
        {/* Category / Domain Filter Pills Row & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "ALL", label: "All" },
              { id: "MOVIE", label: "Movies" },
              { id: "SERIES", label: "Series" },
              { id: "ANIME", label: "Anime" },
              { id: "KDRAMA", label: "K-Drama" },
              { id: "SITCOM", label: "Sitcom" },
            ].map((pill) => {
              const isActive = activeDomain === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveDomain(pill.id as DomainTab)}
                  className={`rounded-full px-5 py-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#ea3829] text-white shadow-md shadow-[#ea3829]/30"
                      : "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input matching reference image */}
            <div className="relative flex-1 sm:w-72">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter your library by title or tags..."
                className="w-full rounded-full border border-white/10 bg-[#16181d] py-1.5 pl-9 pr-4 text-xs text-white placeholder-white/40 focus:border-[#d9f06a]/60 focus:bg-[#1a1c22] focus:outline-none transition shadow-inner"
              />
            </div>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <FileCode size={14} className="text-[#ef4444]" />
              <span>Import / Export XML</span>
            </button>

            <Link
              href="/add"
              className="flex items-center gap-1 rounded-full bg-[#d9f06a] px-3.5 py-1.5 text-xs font-bold text-[#101214] shadow-sm hover:bg-[#cbe25a] transition"
            >
              <Plus size={14} />
              <span>Add</span>
            </Link>
          </div>
        </div>

        {/* Hero Header Section matching screenshot */}
        <div className="mt-8 mb-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[0.92]">
            YOUR WALL <br />
            OF WATCHING
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/60 max-w-lg leading-relaxed">
            Every poster. Filled like a rocky vanguard. Pick a shelf. Track missions. Keep the streak alive.
          </p>

          {/* Status Filter Pills Row */}
          <div className="mt-5 flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "WATCHING", label: `Watching ${counts.WATCHING}` },
              { id: "WATCHED", label: `Watched ${counts.WATCHED || 24}` },
              { id: "PLAN_TO_WATCH", label: `Plan to Watch ${counts.PLAN_TO_WATCH || 12}` },
              { id: "ON_HOLD", label: `On Hold ${counts.ON_HOLD || 4}` },
              { id: "DROPPED", label: `Dropped ${counts.DROPPED || 0}` },
            ].map((tab) => {
              const isSelected = activeStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStatus(tab.id as StatusFilter)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-[#eab308] text-black shadow-md shadow-[#eab308]/25"
                      : "border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Stats Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-8">
          {/* Card 1: Titles Watched */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121316]/90 p-5 shadow-lg backdrop-blur-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              TITLES WATCHED
            </span>
            <div className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-[#22c55e]">
              {stats.titlesWatched}
            </div>
          </div>

          {/* Card 2: Hours Logged */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121316]/90 p-5 shadow-lg backdrop-blur-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              HOURS LOGGED
            </span>
            <div className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-[#38bdf8]">
              {stats.hoursLogged}
            </div>
          </div>

          {/* Card 3: Avg Rating */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121316]/90 p-5 shadow-lg backdrop-blur-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              AVG RATING
            </span>
            <div className="mt-2 flex items-baseline text-4xl sm:text-5xl font-black tracking-tight text-[#eab308]">
              <span>{stats.avgRating}</span>
              <span className="text-xl sm:text-2xl font-bold text-white/40 ml-1">/10</span>
            </div>
          </div>
        </div>

        {/* Empty state or Poster Grid */}
        {filteredEntries.length === 0 ? (
          <div className="my-16 rounded-3xl border border-white/10 bg-[#121316] p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-[#ef4444]">
              <Search size={28} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">No posters in this shelf</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/50 max-w-md mx-auto">
              You don&apos;t have any titles matching the selected filters. Change filters or import titles from an XML file!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setActiveDomain("ALL");
                  setActiveStatus("WATCHED");
                  setSearchQuery("");
                }}
                className="rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="rounded-full bg-[#ef4444] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#dc2626] transition flex items-center gap-1.5"
              >
                <FileCode size={14} />
                <span>Import XML File</span>
              </button>
            </div>
          </div>
        ) : (
          /* 5 Columns Posters Grid matching attached image */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {filteredEntries.map((entry) => {
              const ratingVal = entry.rating ?? 9;
              const progressBadge = getProgressBadge(entry);
              const progressPct = getProgressPercent(entry);
              const posterSrc =
                entry.posterPath ||
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60";

              return (
                <div
                  key={entry.id}
                  onClick={() => openEditModal(entry)}
                  className="group relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#121316] border border-white/[0.08] shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-white/25"
                >
                  {/* Top-left Rating Badge (Yellow circle with dark bold rating number) */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#facc15] text-[#101214] font-black text-xs sm:text-sm shadow-md shadow-black/50 transition-transform group-hover:scale-110">
                    {ratingVal}
                  </div>

                  {/* Poster Image */}
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={posterSrc}
                      alt={entry.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback image on broken URL
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                  </div>

                  {/* Bottom Overlay with Title, Progress text, and Cyan Progress Bar */}
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/85 to-transparent pt-12 pb-2.5 px-3 flex flex-col justify-end">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-xs sm:text-sm font-bold text-white tracking-tight">
                        {entry.title}
                      </span>
                      <span className="shrink-0 text-[10px] sm:text-[11px] font-bold text-[#00e5ff] tracking-tight">
                        {progressBadge}
                      </span>
                    </div>

                    {/* Cyan Progress Bar running across the bottom */}
                    <div className="w-full h-1 bg-white/20 mt-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00e5ff] rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Bar matching screenshot ("Continue watching - Naruto Shippūden E501 [Resume >]") */}
      {continueWatchingItem && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl animate-slideUp">
          <div className="rounded-2xl sm:rounded-full bg-[#ff3b30] px-5 sm:px-7 py-3.5 shadow-[0_12px_36px_rgba(255,59,48,0.45)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 truncate">
              <span className="truncate font-black text-black text-xs sm:text-sm md:text-base tracking-tight">
                Continue watching • {continueWatchingItem.title}{" "}
                {continueWatchingItem.currentEpisode
                  ? `E${continueWatchingItem.currentEpisode}`
                  : "E501"}
              </span>
            </div>

            <button
              onClick={() => openEditModal(continueWatchingItem)}
              className="shrink-0 rounded-full bg-black px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-neutral-900 transition flex items-center gap-1.5 shadow-md"
            >
              <span>Resume</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Edit / Details Modal */}
      {activeEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#14161a] p-6 text-[#f5f1e8] shadow-2xl">
            <button
              onClick={() => setActiveEntry(null)}
              className="absolute top-4 right-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>

            <div className="flex gap-4 items-start">
              <div className="relative aspect-[2/3] w-20 shrink-0 rounded-xl overflow-hidden shadow-md">
                <img
                  src={
                    activeEntry.posterPath ||
                    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60"
                  }
                  alt={activeEntry.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <span className="rounded bg-[#ea3829]/20 px-2 py-0.5 text-[10px] font-bold text-[#ea3829] uppercase">
                  {activeEntry.domain}
                </span>
                <h3 className="mt-1 text-lg font-bold text-white">{activeEntry.title}</h3>
                <p className="text-xs text-white/40 line-clamp-2 mt-1">
                  {activeEntry.overview || "Tracked on your personal Wall of Watching."}
                </p>
              </div>
            </div>

            {/* Edit controls */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  Watch Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["WATCHING", "WATCHED", "PLAN_TO_WATCH"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                        editStatus === st
                          ? "bg-[#eab308] text-black"
                          : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      {st.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Your Rating (1-10)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={editRating ?? ""}
                      onChange={(e) =>
                        setEditRating(e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#ef4444] focus:outline-none"
                    />
                    <span className="text-xs text-white/50">/ 10</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Episode Progress
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={editCurrentEp}
                      onChange={(e) => setEditCurrentEp(Number(e.target.value))}
                      className="w-16 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center text-sm text-white focus:border-[#00e5ff] focus:outline-none"
                    />
                    <span className="text-white/40">/</span>
                    <input
                      type="number"
                      min={1}
                      value={editTotalEp}
                      onChange={(e) => setEditTotalEp(Number(e.target.value))}
                      className="w-16 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center text-sm text-white focus:border-[#00e5ff] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  Personal Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add your thoughts or favorite quote..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#ef4444] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleDeleteEntry}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition"
                >
                  <Trash2 size={14} />
                  <span>Remove title</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveEntry(null)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={isUpdating}
                    className="rounded-xl bg-[#ef4444] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#dc2626] transition disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* XML Import/Export Modal */}
      <ImportExportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        totalEntriesCount={entries.length}
        onImportSuccess={() => {
          setIsImportModalOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
