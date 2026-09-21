import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  Bookmark,
  CheckCircle2,
  Clapperboard,
  Play,
  Star,
  Film,
  Tv,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { Navbar } from "@/components/common/navbar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // Run queries in parallel
  const [
    totalCount,
    watchedCount,
    watchingCount,
    planCount,
    averageRating,
    favoritesCount,
    recentlyAdded,
    continueWatching,
    planToWatch,
    domainStats,
  ] = await Promise.all([
    db.watchEntry.count({ where: { userId } }),
    db.watchEntry.count({ where: { userId, status: "WATCHED" } }),
    db.watchEntry.count({ where: { userId, status: "WATCHING" } }),
    db.watchEntry.count({ where: { userId, status: "PLAN_TO_WATCH" } }),
    db.watchEntry.aggregate({
      where: { userId, rating: { not: null } },
      _avg: { rating: true },
    }),
    db.watchEntry.count({ where: { userId, favorite: true } }),
    db.watchEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.watchEntry.findMany({
      where: { userId, status: "WATCHING" },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    db.watchEntry.findMany({
      where: { userId, status: "PLAN_TO_WATCH" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.watchEntry.groupBy({
      by: ["domain"],
      where: { userId },
      _count: { id: true },
    }),
  ]);

  const firstName = session.user.name?.split(" ")[0] || "Explorer";

  const stats = [
    {
      label: "Total Stories",
      value: totalCount,
      subtext: `${favoritesCount} favorited`,
      icon: Bookmark,
    },
    {
      label: "Watched",
      value: watchedCount,
      subtext: totalCount > 0 ? `${Math.round((watchedCount / totalCount) * 100)}% of library` : "0%",
      icon: CheckCircle2,
    },
    {
      label: "Currently Watching",
      value: watchingCount,
      subtext: "In active rotation",
      icon: Play,
    },
    {
      label: "Average Rating",
      value: averageRating._avg.rating ? `${averageRating._avg.rating.toFixed(1)} / 10` : "Unrated",
      subtext: "Across scored titles",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f5f1e8]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-14">
        {/* Hero greeting */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#171a20] via-[#1b1f26] to-[#121418] p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#d9f06a]">
              <Sparkles size={14} />
              Personal Watch Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Welcome back, <span className="text-[#d9f06a]">{firstName}</span>.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
              You have {watchingCount} title{watchingCount === 1 ? "" : "s"} currently in progress and {planCount} queued on your watchlist.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/add"
                className="flex items-center gap-2 rounded-full bg-[#d9f06a] px-5 py-3 text-xs font-semibold text-[#101214] shadow-lg shadow-[#d9f06a]/20 transition hover:bg-[#cbe25a]"
              >
                <Play size={14} fill="currentColor" />
                Add New Story
              </Link>
              <Link
                href="/library"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Explore Full Library
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#d9f06a]/10 blur-3xl" />
        </section>

        {/* Stats Grid */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, subtext, icon: Icon }) => (
            <article
              key={label}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  {label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d9f06a]/15 text-[#d9f06a] transition-transform group-hover:scale-110">
                  <Icon size={16} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-white">{value}</p>
              <p className="mt-1 text-xs text-white/40">{subtext}</p>
            </article>
          ))}
        </section>

        {/* Continue Watching Shelf */}
        {continueWatching.length > 0 && (
          <section className="mt-14">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d9f06a]">
                  <Clock size={13} />
                  In Progress
                </p>
                <h2 className="mt-1 text-2xl font-bold">Continue Watching</h2>
              </div>
              <Link
                href="/library?status=WATCHING"
                className="text-xs font-semibold text-[#d9f06a] hover:underline"
              >
                View all ({watchingCount}) →
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {continueWatching.map((entry) => {
                const posterUrl = entry.posterPath
                  ? entry.posterPath.startsWith("http")
                    ? entry.posterPath
                    : `https://image.tmdb.org/t/p/w500${entry.posterPath}`
                  : null;

                return (
                  <Link
                    key={entry.id}
                    href="/library"
                    className="group relative flex overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[#d9f06a]/40 hover:bg-white/[0.06]"
                  >
                    <div className="relative h-32 w-24 shrink-0 bg-white/10">
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={entry.title}
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-white/20">
                          ✦
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-3.5">
                      <div>
                        <span className="rounded bg-[#d9f06a]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#d9f06a]">
                          {entry.domain}
                        </span>
                        <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-white group-hover:text-[#d9f06a]">
                          {entry.title}
                        </h3>
                        {entry.notes && (
                          <p className="mt-1 line-clamp-2 text-[11px] text-white/50">
                            &quot;{entry.notes}&quot;
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/40">
                        <span>{entry.rating ? `★ ${entry.rating}/10` : "Unrated"}</span>
                        <span className="text-[#d9f06a]">Active</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Recently Added Shelf */}
        <section className="mt-14">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Recent Additions
              </p>
              <h2 className="mt-1 text-2xl font-bold">Latest in Your Universe</h2>
            </div>
            <Link
              href="/library"
              className="text-xs font-semibold text-[#d9f06a] hover:underline"
            >
              See complete library →
            </Link>
          </div>

          {recentlyAdded.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
              <Film className="mx-auto h-10 w-10 text-white/30" />
              <h3 className="mt-3 text-base font-semibold">Your shelf is waiting</h3>
              <p className="mt-1 text-xs text-white/50">
                Add films, anime, and series to kickstart your tracking universe.
              </p>
              <Link
                href="/add"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#d9f06a] px-4 py-2 text-xs font-semibold text-[#101214]"
              >
                <Play size={12} fill="currentColor" />
                Add Your First Story
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {recentlyAdded.map((entry) => {
                const posterUrl = entry.posterPath
                  ? entry.posterPath.startsWith("http")
                    ? entry.posterPath
                    : `https://image.tmdb.org/t/p/w500${entry.posterPath}`
                  : null;

                return (
                  <Link
                    key={entry.id}
                    href="/library"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1.5 hover:border-white/20 hover:shadow-xl hover:shadow-black/50"
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/5">
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={entry.title}
                          fill
                          sizes="(min-width: 1024px) 180px, 50vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-white/20">
                          ✦
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101214] via-transparent to-black/30" />

                      {entry.favorite && (
                        <div className="absolute right-2 top-2 rounded-full bg-black/60 p-1 backdrop-blur-md">
                          <Heart size={12} className="fill-[#d9f06a] text-[#d9f06a]" />
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="rounded bg-[#d9f06a]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#d9f06a] backdrop-blur-md">
                          {entry.status.replaceAll("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="line-clamp-1 text-xs font-semibold text-white group-hover:text-[#d9f06a]">
                        {entry.title}
                      </h3>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-white/40">
                        <span>{entry.domain}</span>
                        {entry.rating && <span className="text-[#d9f06a]">★ {entry.rating}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Domain Distribution Breakdown */}
        {domainStats.length > 0 && (
          <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Universe Distribution by Domain
              </h3>
              <span className="text-xs text-white/40">{totalCount} total entries</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {domainStats.map((d) => (
                <div
                  key={d.domain}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center"
                >
                  <p className="text-2xl font-bold text-[#d9f06a]">{d._count.id}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                    {d.domain === "KDRAMA" ? "K-Drama" : d.domain}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}