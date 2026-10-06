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
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Star,
  Flame,
  CheckCircle2,
  Film,
  Tv,
  RotateCcw,
  PlusCircle,
  Play,
} from "lucide-react";
import { ImportExportModal } from "./import-export-modal";
import { ManualAddModal } from "./manual-add-modal";
import { resolvePosterUrl, getSecondaryFallback } from "@/lib/images";
import { sounds } from "@/lib/sounds";
import { triggerConfettiBurst } from "@/lib/confetti";

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
type StatusFilter = "ALL" | "WATCHING" | "WATCHED" | "PLAN_TO_WATCH" | "ON_HOLD" | "DROPPED";

export function LibraryView({ initialEntries }: LibraryViewProps) {
  const [entries, setEntries] = useState<LibraryEntry[]>(initialEntries);
  const [activeDomain, setActiveDomain] = useState<DomainTab>("ALL");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dismissContinueBar, setDismissContinueBar] = useState(false);

  // Detail / Edit modal
  const [activeEntry, setActiveEntry] = useState<LibraryEntry | null>(null);
  const [editStatus, setEditStatus] = useState<string>("WATCHED");
  const [editRating, setEditRating] = useState<number | null>(9);
  const [editCurrentEp, setEditCurrentEp] = useState<number>(1);
  const [editTotalEp, setEditTotalEp] = useState<number>(12);
  const [editNotes, setEditNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);

  // Status Counts calculated from REAL entries
  const counts = useMemo(() => {
    const map = {
      ALL: entries.length,
      WATCHING: 0,
      WATCHED: 0,
      PLAN_TO_WATCH: 0,
      ON_HOLD: 0,
      DROPPED: 0,
    };
    entries.forEach((e) => {
      const s = e.status as keyof typeof map;
      if (map[s] !== undefined) {
        map[s]++;
      }
    });
    return map;
  }, [entries]);

  // Overall Library Stats calculated dynamically from real entries
  const stats = useMemo(() => {
    const titlesWatched = counts.WATCHED;
    let totalMinutes = 0;
    entries.forEach((e) => {
      const isMovie = e.domain === "MOVIE" || e.mediaType === "MOVIE";
      if (isMovie) {
        if (e.status === "WATCHED") totalMinutes += 120;
      } else {
        const eps =
          e.currentEpisode || (e.status === "WATCHED" ? e.totalEpisodes || 12 : 0);
        const epDuration = e.domain === "ANIME" ? 24 : 45;
        totalMinutes += eps * epDuration;
      }
    });

    const hoursLogged = Math.round(totalMinutes / 60);

    const rated = entries.filter((e) => e.rating != null && e.rating > 0);
    const avgRating =
      rated.length > 0
        ? (
            rated.reduce((acc, curr) => acc + (curr.rating || 0), 0) / rated.length
          ).toFixed(1)
        : "—";

    return {
      titlesWatched,
      hoursLogged,
      avgRating,
    };
  }, [entries, counts]);

  // Only display continue-watching if user actually has a show marked "WATCHING"
  const continueWatchingItem = useMemo(() => {
    if (dismissContinueBar) return null;
    return entries.find((e) => e.status === "WATCHING") || null;
  }, [entries, dismissContinueBar]);

  // Filtered Entries for Grid
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Domain filter
      if (activeDomain !== "ALL" && entry.domain !== activeDomain) {
        return false;
      }

      // Status filter
      if (activeStatus !== "ALL" && entry.status !== activeStatus) {
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

  function handleSoundToggle() {
    const next = sounds.toggle();
    setSoundEnabled(next);
  }

  function openEditModal(entry: LibraryEntry) {
    sounds.click();
    setActiveEntry(entry);
    setEditStatus(entry.status);
    setEditRating(entry.rating);
    setEditCurrentEp(entry.currentEpisode || 1);
    setEditTotalEp(entry.totalEpisodes || 12);
    setEditNotes(entry.notes || "");
  }

  async function handleQuickAdvanceEpisode(entry: LibraryEntry, e: React.MouseEvent) {
    e.stopPropagation();
    sounds.click();
    const cur = entry.currentEpisode || 0;
    const tot = entry.totalEpisodes || 12;
    const nextEp = cur + 1;
    const newStatus = nextEp >= tot ? "WATCHED" : "WATCHING";

    try {
      const res = await fetch(`/api/library/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentEpisode: nextEp,
          status: newStatus,
        }),
      });
      if (res.ok) {
        if (newStatus === "WATCHED") {
          sounds.success();
          triggerConfettiBurst();
        }
        setEntries((prev) =>
          prev.map((item) =>
            item.id === entry.id
              ? { ...item, currentEpisode: nextEp, status: newStatus }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Episode bump error:", err);
    }
  }

  async function handleToggleFavorite(entry: LibraryEntry, e: React.MouseEvent) {
    e.stopPropagation();
    sounds.favorite();
    const nextFav = !entry.favorite;
    try {
      const res = await fetch(`/api/library/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: nextFav }),
      });
      if (res.ok) {
        setEntries((prev) =>
          prev.map((item) =>
            item.id === entry.id ? { ...item, favorite: nextFav } : item
          )
        );
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
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
        sounds.success();
        if (editStatus === "WATCHED" && activeEntry.status !== "WATCHED") {
          triggerConfettiBurst();
        }
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
        sounds.click();
        setEntries((prev) => prev.filter((item) => item.id !== activeEntry.id));
        setActiveEntry(null);
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleClearAllEntries() {
    setIsClearing(true);
    try {
      const res = await fetch("/api/library", { method: "DELETE" });
      if (res.ok) {
        sounds.click();
        setEntries([]);
        setIsClearModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to clear library:", err);
    } finally {
      setIsClearing(false);
    }
  }

  function getProgressBadge(entry: LibraryEntry) {
    const isMovie = entry.domain === "MOVIE" || entry.mediaType === "MOVIE";
    if (isMovie) {
      return entry.status === "WATCHED" ? "Seen" : "Plan to Watch";
    }

    const season = entry.seasonNumber || 1;
    const current =
      entry.currentEpisode ||
      (entry.status === "WATCHED" ? entry.totalEpisodes || 12 : 0);
    const total = entry.totalEpisodes || 12;

    if (entry.status === "WATCHED" && current >= total) {
      return total === 1 ? "Seen" : `S${season} E${total}/${total}`;
    }

    return `S${season} E${current}/${total}`;
  }

  function getProgressPercent(entry: LibraryEntry): number {
    if (entry.status === "WATCHED") return 100;
    const current = entry.currentEpisode || 0;
    const total = entry.totalEpisodes || 12;
    if (total === 0) return 0;
    return Math.min(100, Math.round((current / total) * 100));
  }

  return (
    <div className="relative min-h-screen bg-[#090b0f] text-[#f5f1e8] pb-36 overflow-x-hidden">
      {/* Ambient Atmospheric Lighting Cones */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute bottom-10 left-10 h-[400px] w-[400px] rounded-full bg-[#d9f06a]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-8">
        {/* Top Control Bar: Category Pills + Search + Action Buttons */}
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Domain Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: "ALL", label: "All" },
                { id: "MOVIES", idReal: "MOVIE", label: "Movies" },
                { id: "SERIES", idReal: "SERIES", label: "Series" },
                { id: "ANIME", idReal: "ANIME", label: "Anime" },
                { id: "KDRAMA", idReal: "KDRAMA", label: "K-Drama" },
                { id: "SITCOM", idReal: "SITCOM", label: "Sitcom" },
              ].map((pill) => {
                const target = (pill.idReal || pill.id) as DomainTab;
                const isActive = activeDomain === target;
                return (
                  <button
                    key={pill.id}
                    onClick={() => {
                      sounds.click();
                      setActiveDomain(target);
                    }}
                    className={`rounded-full px-4.5 py-1.5 text-xs font-black tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[#ea3829] to-[#f43f5e] text-white shadow-lg shadow-[#ea3829]/35 scale-105"
                        : "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Search + Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter your library by title or tags..."
                  className="w-full rounded-full border border-white/10 bg-[#141720]/80 py-1.5 pl-9 pr-4 text-xs text-white placeholder-white/40 focus:border-[#d9f06a]/70 focus:bg-[#181c26] focus:outline-none transition shadow-inner backdrop-blur-md"
                />
              </div>

              {/* Sound Toggle (Sensory Trigger) */}
              <button
                onClick={handleSoundToggle}
                title={soundEnabled ? "Mute sensory sound effects" : "Enable sound effects"}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition cursor-pointer backdrop-blur-md ${
                  soundEnabled
                    ? "border-[#d9f06a]/40 bg-[#d9f06a]/15 text-[#d9f06a]"
                    : "border-white/10 bg-white/5 text-white/40 hover:text-white"
                }`}
              >
                {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                <span className="hidden sm:inline">SFX</span>
              </button>

              {/* Import / Export XML */}
              <button
                onClick={() => {
                  sounds.click();
                  setIsImportModalOpen(true);
                }}
                className="hidden md:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer backdrop-blur-md"
              >
                <FileCode size={13} className="text-[#ef4444]" />
                <span>XML Data</span>
              </button>

              {/* Add Title Manually Modal Trigger (Requested by user!) */}
              <button
                onClick={() => {
                  sounds.click();
                  setIsManualModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-full bg-[#d9f06a] px-4 py-1.5 text-xs font-black text-[#101214] shadow-md shadow-[#d9f06a]/25 hover:bg-[#cbe25a] hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Show</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Header Section */}
        <div className="mt-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#d9f06a] uppercase mb-1">
                <Flame size={14} className="text-amber-400 animate-pulse" />
                <span>Curated Shelf Collection</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[0.92]">
                YOUR WALL <br />
                OF WATCHING
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-white/60 max-w-lg leading-relaxed">
                Every poster, shelf, and mission logged. Discover, rate, and track your ongoing watch journey.
              </p>
            </div>

            {/* Quick Reset Option if user has pre-populated data they want to clear */}
            {entries.length > 0 && (
              <button
                onClick={() => setIsClearModalOpen(true)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-white/40 hover:text-rose-400 transition cursor-pointer self-start md:self-end"
              >
                <RotateCcw size={12} />
                <span>Reset to Clean Slate</span>
              </button>
            )}
          </div>

          {/* Status Filter Pills Row */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "ALL", label: `All Shelves (${counts.ALL})` },
              { id: "WATCHING", label: `Watching (${counts.WATCHING})` },
              { id: "WATCHED", label: `Watched (${counts.WATCHED})` },
              { id: "PLAN_TO_WATCH", label: `Plan to Watch (${counts.PLAN_TO_WATCH})` },
              { id: "ON_HOLD", label: `On Hold (${counts.ON_HOLD})` },
              { id: "DROPPED", label: `Dropped (${counts.DROPPED})` },
            ].map((tab) => {
              const isSelected = activeStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.click();
                    setActiveStatus(tab.id as StatusFilter);
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-[#eab308] text-black shadow-lg shadow-[#eab308]/30 scale-105"
                      : "border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Stats Metric Cards Row (Real Calculated Data) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 my-7">
          {/* Card 1: Titles Watched */}
          <div className="group relative rounded-2xl border border-white/[0.08] bg-[#12151c]/90 p-5 shadow-xl backdrop-blur-xl transition hover:border-[#22c55e]/30">
            <div className="absolute top-0 right-0 h-1 w-16 bg-[#22c55e] rounded-bl-full opacity-60" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#22c55e]" />
              <span>TITLES WATCHED</span>
            </span>
            <div className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-[#22c55e]">
              {stats.titlesWatched}
            </div>
          </div>

          {/* Card 2: Hours Logged */}
          <div className="group relative rounded-2xl border border-white/[0.08] bg-[#12151c]/90 p-5 shadow-xl backdrop-blur-xl transition hover:border-[#38bdf8]/30">
            <div className="absolute top-0 right-0 h-1 w-16 bg-[#38bdf8] rounded-bl-full opacity-60" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
              <Tv size={13} className="text-[#38bdf8]" />
              <span>HOURS LOGGED</span>
            </span>
            <div className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-[#38bdf8]">
              {stats.hoursLogged}
            </div>
          </div>

          {/* Card 3: Avg Rating */}
          <div className="group relative rounded-2xl border border-white/[0.08] bg-[#12151c]/90 p-5 shadow-xl backdrop-blur-xl transition hover:border-[#eab308]/30">
            <div className="absolute top-0 right-0 h-1 w-16 bg-[#eab308] rounded-bl-full opacity-60" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
              <Star size={13} className="text-[#eab308] fill-current" />
              <span>AVG RATING</span>
            </span>
            <div className="mt-2 flex items-baseline text-4xl sm:text-5xl font-black tracking-tight text-[#eab308]">
              <span>{stats.avgRating}</span>
              {stats.avgRating !== "—" && (
                <span className="text-xl sm:text-2xl font-bold text-white/40 ml-1">
                  /10
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Empty state or Poster Grid */}
        {filteredEntries.length === 0 ? (
          <div className="my-14 rounded-3xl border border-white/10 bg-[#13161f]/80 backdrop-blur-xl p-10 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-[#ea3829] shadow-inner">
              <Film size={30} />
            </div>
            <h3 className="mt-4 text-2xl font-black text-white">
              {entries.length === 0 ? "Your Wall is Empty & Ready" : "No posters in this shelf"}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-white/50 max-w-md mx-auto">
              {entries.length === 0
                ? "Start adding shows manually with custom posters, ratings, and genre tags, or import from TMDB!"
                : "You don't have any titles matching the selected filters. Switch filters or add a new show!"}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  sounds.click();
                  setIsManualModalOpen(true);
                }}
                className="rounded-full bg-[#d9f06a] px-6 py-2.5 text-xs font-black text-[#101214] shadow-lg shadow-[#d9f06a]/20 hover:bg-[#cbe25a] hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>+ Add Show Manually</span>
              </button>

              <button
                onClick={() => {
                  sounds.click();
                  setActiveDomain("ALL");
                  setActiveStatus("ALL");
                  setSearchQuery("");
                }}
                className="rounded-full bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          /* 5 Columns Cinematic Posters Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {filteredEntries.map((entry) => {
              const ratingVal = entry.rating ?? "—";
              const progressBadge = getProgressBadge(entry);
              const progressPct = getProgressPercent(entry);
              const posterSrc = resolvePosterUrl(entry.posterPath, entry.domain, entry.title);

              return (
                <div
                  key={entry.id}
                  onClick={() => openEditModal(entry)}
                  className="group relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#13161f] border border-white/[0.08] shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-white/25 hover:z-20"
                >
                  {/* Rating Badge Top Left */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#facc15] text-[#101214] font-black text-xs sm:text-sm shadow-lg shadow-black/50 transition-transform group-hover:scale-110">
                    {ratingVal}
                  </div>

                  {/* Favorite Toggle Top Right */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(entry, e)}
                    className={`absolute top-2.5 right-2.5 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md transition cursor-pointer ${
                      entry.favorite
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                        : "bg-black/40 text-white/40 opacity-0 group-hover:opacity-100 hover:text-white"
                    }`}
                  >
                    <Heart size={14} fill={entry.favorite ? "currentColor" : "none"} />
                  </button>

                  {/* Poster Image with Real Error Handling & No Same-Image Duplication */}
                  <div className="relative h-full w-full overflow-hidden bg-[#1a1d26]">
                    <img
                      src={posterSrc}
                      alt={entry.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getSecondaryFallback(
                          entry.domain,
                          entry.title
                        );
                      }}
                    />
                  </div>

                  {/* Bottom Overlay with Title, Progress text, and Cyan Progress Bar */}
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/85 to-transparent pt-14 pb-2.5 px-3 flex flex-col justify-end">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white/90">
                        {entry.domain}
                      </span>

                      {/* Quick +1 Ep advance button on hover for Series/Anime */}
                      {entry.domain !== "MOVIE" && entry.status !== "WATCHED" && (
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdvanceEpisode(entry, e)}
                          title="Quick +1 Episode"
                          className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-[#00e5ff] hover:bg-cyan-500 hover:text-black transition"
                        >
                          +1 Ep
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-xs sm:text-sm font-black text-white tracking-tight">
                        {entry.title}
                      </span>
                      <span className="shrink-0 text-[10px] sm:text-[11px] font-bold text-[#00e5ff] tracking-tight">
                        {progressBadge}
                      </span>
                    </div>

                    {/* Cyan Progress Bar running across bottom */}
                    <div className="w-full h-1 bg-white/20 mt-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00e5ff] rounded-full transition-all duration-500 shadow-[0_0_8px_#00e5ff]"
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

      {/* Floating Bottom Bar: Only shown when an active show is being watched */}
      {continueWatchingItem && (
        <div className="fixed bottom-6 inset-x-0 mx-auto z-40 w-[92%] max-w-2xl animate-slideUp">
          <div className="rounded-full border border-white/20 bg-[#12151c]/95 px-5 sm:px-6 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex items-center justify-between gap-3 transition">
            <div className="flex items-center gap-3 truncate">
              {/* Pulsing indicator */}
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9f06a] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d9f06a]" />
              </span>

              <div className="truncate">
                <span className="block truncate font-black text-white text-xs sm:text-sm tracking-tight">
                  Continue Watching: {continueWatchingItem.title}
                </span>
                <span className="text-[10px] text-white/50 font-semibold">
                  {continueWatchingItem.currentEpisode
                    ? `Episode ${continueWatchingItem.currentEpisode} of ${continueWatchingItem.totalEpisodes || 12}`
                    : "In Progress"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEditModal(continueWatchingItem)}
                className="rounded-full bg-[#d9f06a] px-4 py-1.5 text-xs font-black text-[#101214] hover:bg-[#cbe25a] transition flex items-center gap-1 shadow-md cursor-pointer"
              >
                <Play size={12} fill="currentColor" />
                <span>Resume</span>
              </button>

              <button
                onClick={() => setDismissContinueBar(true)}
                className="rounded-full p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Dismiss banner"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Show Modal */}
      <ManualAddModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSuccess={(newEntry) => {
          setEntries((prev) => [newEntry, ...prev]);
        }}
      />

      {/* Reset / Clear Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/20 bg-[#141720] p-6 text-white shadow-2xl">
            <h3 className="text-lg font-black text-white">Reset to Clean Slate?</h3>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              This will remove all {entries.length} titles from your Wall of Watching so you can start completely fresh with 0 registered shows. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="rounded-full px-4 py-2 text-xs font-semibold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllEntries}
                disabled={isClearing}
                className="rounded-full bg-rose-500 px-5 py-2 text-xs font-black text-white shadow-md hover:bg-rose-600 transition disabled:opacity-50"
              >
                {isClearing ? "Clearing..." : "Clear Everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Details Modal */}
      {activeEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#13161f] p-6 text-[#f5f1e8] shadow-2xl">
            <button
              onClick={() => setActiveEntry(null)}
              className="absolute top-4 right-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>

            <div className="flex gap-4 items-start">
              <div className="relative aspect-[2/3] w-20 shrink-0 rounded-xl overflow-hidden shadow-md bg-white/5">
                <img
                  src={resolvePosterUrl(activeEntry.posterPath, activeEntry.domain, activeEntry.title)}
                  alt={activeEntry.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <span className="rounded bg-[#ea3829]/20 px-2 py-0.5 text-[10px] font-bold text-[#ea3829] uppercase">
                  {activeEntry.domain}
                </span>
                <h3 className="mt-1 text-lg font-black text-white">{activeEntry.title}</h3>
                <p className="text-xs text-white/40 line-clamp-2 mt-1">
                  {activeEntry.overview || "Tracked on your personal Wall of Watching."}
                </p>
              </div>
            </div>

            {/* Edit controls */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">
                  Watch Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["WATCHING", "WATCHED", "PLAN_TO_WATCH", "ON_HOLD", "DROPPED"] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          sounds.click();
                          setEditStatus(st);
                        }}
                        className={`rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                          editStatus === st
                            ? "bg-[#eab308] text-black shadow-md shadow-[#eab308]/20"
                            : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {st.replace(/_/g, " ")}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">
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
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#d9f06a] focus:outline-none"
                    />
                    <span className="text-xs text-white/50">/ 10</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">
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
                <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">
                  Personal Notes & Review
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add your thoughts or favorite quote..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#d9f06a] focus:outline-none"
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
                    className="rounded-xl bg-[#d9f06a] px-5 py-2 text-xs font-black text-[#101214] shadow-md hover:bg-[#cbe25a] transition disabled:opacity-50"
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
