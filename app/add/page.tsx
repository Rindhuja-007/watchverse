import Link from "next/link";
import { AddTitleSearch } from "@/components/search/add-title-search";

export default function AddPage() {
  return <main className="min-h-screen bg-[#101214] px-6 py-8 text-[#f5f1e8] sm:px-10 lg:px-14"><div className="mx-auto max-w-5xl"><Link href="/dashboard" className="text-sm text-[#d9f06a]">← Dashboard</Link><div className="py-16"><p className="text-xs uppercase tracking-[0.25em] text-[#d9f06a]">Expand your universe</p><h1 className="mt-3 text-5xl font-semibold tracking-tight">Add a story.</h1><p className="mt-4 text-lg text-white/55">Search TMDB for something you watched, or can&apos;t wait to watch.</p><AddTitleSearch /></div></div></main>;
}