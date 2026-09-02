import { ArrowRight, Bookmark, Check, Clapperboard, Search, Star } from "lucide-react";
import Link from "next/link";

const shelves = [
  { title: "Dune: Part Two", meta: "Movie · 2024", tone: "from-[#d78d54] via-[#6b3033] to-[#17131b]", mark: "D" },
  { title: "The Bear", meta: "Series · 2022", tone: "from-[#b84c2f] via-[#33191a] to-[#111216]", mark: "B" },
  { title: "Past Lives", meta: "Movie · 2023", tone: "from-[#6e8a93] via-[#263744] to-[#121b24]", mark: "P" },
];
const genres = ["Everything", "Movies", "Series", "Anime", "K-dramas"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#101214] text-[#f5f1e8]">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-10 lg:px-14">
        <nav className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em]"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9f06a] text-[#101214]"><Clapperboard size={18} /></span>WATCHVERSE</Link>
          <div className="hidden items-center gap-8 text-sm text-white/60 md:flex"><a href="#discover" className="hover:text-white">Discover</a><a href="#how-it-works" className="hover:text-white">How it works</a></div>
          <Link href="/library" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium hover:border-[#d9f06a] hover:text-[#d9f06a]">Open library</Link>
        </nav>

        <section className="grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div>
            <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d9f06a]"><span className="h-1.5 w-1.5 rounded-full bg-[#d9f06a]" />Your watch life, in one place</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">Keep every story <span className="text-[#d9f06a]">worth remembering.</span></h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-white/60">Track films, series, anime, and everything in between. Build a library that feels like you.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="rounded-full bg-[#d9f06a] px-5 py-3 text-sm font-semibold text-[#101214]">Start building my library</Link><Link href="/login" className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium hover:border-white/50">Sign in</Link></div>
            <Link href="/add" className="mt-9 flex max-w-md items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] p-2 pl-5"><Search size={19} className="text-white/50" /><span className="flex-1 text-sm text-white/45">Search for a title to add...</span><span aria-label="Search titles" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9f06a] text-[#101214] transition-transform hover:scale-105"><ArrowRight size={18} /></span></Link>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/50"><span className="flex items-center gap-2"><Check size={15} className="text-[#d9f06a]" />Watch progress</span><span className="flex items-center gap-2"><Check size={15} className="text-[#d9f06a]" />Personal ratings</span><span className="flex items-center gap-2"><Check size={15} className="text-[#d9f06a]" />Smart lists</span></div>
          </div>
          <div className="relative mx-auto h-[390px] w-full max-w-[500px] sm:h-[470px]" aria-label="Featured titles">
            <div className="absolute right-0 top-8 h-[320px] w-[210px] rotate-[9deg] rounded-2xl bg-gradient-to-br from-[#e2a27a] via-[#59363b] to-[#16171c] p-5 shadow-2xl shadow-black/50 sm:h-[390px] sm:w-[255px]"><div className="flex h-full flex-col justify-between border border-white/20 p-4"><span className="text-xs tracking-[0.3em] text-white/60">FEATURED</span><span className="text-6xl font-semibold tracking-[-0.08em]">DUNE<small className="block text-sm tracking-[0.25em]">PART TWO</small></span></div></div>
            <div className="absolute left-4 top-20 h-[320px] w-[210px] -rotate-[9deg] rounded-2xl bg-gradient-to-br from-[#8aa5a8] via-[#344c59] to-[#11191e] p-5 shadow-2xl shadow-black/50 sm:h-[390px] sm:w-[255px]"><div className="flex h-full flex-col justify-between border border-white/20 p-4"><span className="text-xs tracking-[0.3em] text-white/60">YOUR NEXT WATCH</span><span className="text-6xl font-semibold tracking-[-0.08em]">PAST<small className="block text-sm tracking-[0.25em]">LIVES</small></span></div></div>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-[#191c1f]/90 px-4 py-3 text-xs shadow-xl backdrop-blur"><Star size={15} fill="#d9f06a" className="text-[#d9f06a]" />4.8 average rating</div>
          </div>
        </section>

        <section id="discover" className="border-t border-white/10 py-14"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[0.25em] text-white/40">Your universe</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Start your collection</h2></div><div className="flex gap-2 overflow-x-auto pb-1">{genres.map((genre, index) => <Link href="/add" key={genre} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs ${index === 0 ? "bg-[#d9f06a] text-[#101214]" : "border border-white/10 text-white/55 hover:border-white/30 hover:text-white"}`}>{genre}</Link>)}</div></div><div className="grid gap-4 sm:grid-cols-3">{shelves.map((item) => <Link href="/add" key={item.title} className={`group relative min-h-64 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br p-5 ${item.tone}`}><div className="relative flex min-h-56 flex-col justify-between"><div className="flex justify-between"><span className="text-xs uppercase tracking-[0.2em] text-white/60">{item.meta}</span><Bookmark size={17} className="text-white/60 group-hover:text-[#d9f06a]" /></div><div><span className="text-7xl font-semibold tracking-[-0.1em] text-white/80">{item.mark}</span><h3 className="mt-2 text-xl font-medium">{item.title}</h3></div></div></Link>)}</div></section>
        <section id="how-it-works" className="flex flex-col justify-between gap-6 border-t border-white/10 py-10 text-sm text-white/45 sm:flex-row sm:items-center"><p>WatchVerse <span className="text-white/20">/</span> A home for what you watch.</p><p id="library" className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#d9f06a]" />Your library is ready when you are.</p></section>
      </div>
    </main>
  );
}
