import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Bookmark, Check, Clapperboard, Play, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const [entries, watched, watching, planned, average] = await Promise.all([
    db.watchEntry.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 6 }),
    db.watchEntry.count({ where: { userId: session.user.id, status: "WATCHED" } }),
    db.watchEntry.count({ where: { userId: session.user.id, status: "WATCHING" } }),
    db.watchEntry.count({ where: { userId: session.user.id, status: "PLAN_TO_WATCH" } }),
    db.watchEntry.aggregate({ where: { userId: session.user.id, rating: { not: null } }, _avg: { rating: true } }),
  ]);
  const firstName = session.user.name?.split(" ")[0] || "there";
  const stats: { label: string; value: string | number; icon: LucideIcon }[] = [
    { label: "Total titles", value: entries.length, icon: Bookmark },
    { label: "Watched", value: watched, icon: Check },
    { label: "Watching", value: watching, icon: Play },
    { label: "Average rating", value: average._avg.rating ? average._avg.rating.toFixed(1) : "-", icon: Star },
  ];
  return <main className="min-h-screen bg-[#101214] px-6 py-8 text-[#f5f1e8] sm:px-10 lg:px-14"><div className="mx-auto max-w-7xl">
    <header className="flex items-center justify-between border-b border-white/10 pb-6"><Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em]"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9f06a] text-[#101214]"><Clapperboard size={18} /></span>WATCHVERSE</Link><nav className="flex items-center gap-5 text-sm text-white/60"><Link href="/add" className="hover:text-white">Add title</Link><Link href="/library" className="hover:text-white">Library</Link></nav></header>
    <section className="py-14"><p className="text-sm text-[#d9f06a]">Your watch universe</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Good to see you, {firstName}.</h1><p className="mt-3 text-white/55">Here&apos;s what&apos;s happening in your watch universe.</p><Link href="/add" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d9f06a] px-5 py-3 text-sm font-semibold text-[#101214]"><Play size={16} fill="currentColor" />Add something to watch</Link></section>
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><Icon size={18} className="text-[#d9f06a]" /><p className="mt-6 text-sm text-white/50">{label}</p><p className="mt-1 text-3xl font-semibold">{value}</p></article>)}</section>
    <section className="mt-14"><div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.25em] text-white/40">Your shelf</p><h2 className="mt-2 text-2xl font-semibold">Recently added</h2></div><Link href="/library" className="text-sm text-[#d9f06a]">View all</Link></div>{entries.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center"><h3 className="text-xl font-medium">Your universe is empty.</h3><p className="mt-2 text-white/50">Add your first story and make this space yours.</p></div> : <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{entries.map((entry) => <article key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-start justify-between"><span className="rounded-full bg-[#d9f06a]/15 px-3 py-1 text-xs text-[#d9f06a]">{entry.status.replaceAll("_", " ")}</span><Star size={17} className={entry.favorite ? "fill-[#d9f06a] text-[#d9f06a]" : "text-white/30"} /></div><h3 className="mt-14 text-xl font-medium">{entry.title}</h3><p className="mt-1 text-sm text-white/45">{entry.domain} {entry.rating ? `· ${entry.rating}/10` : "· Unrated"}</p></article>)}</div>}</section>
  </div></main>;
}