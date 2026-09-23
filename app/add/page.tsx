import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/common/navbar";
import { AddTitleSearch } from "@/components/search/add-title-search";
import { PlusCircle } from "lucide-react";

export default async function AddPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f5f1e8]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#d9f06a]">
            <PlusCircle size={14} />
            <span>Expand Your Universe</span>
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Add a Story
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Search top-rated films, anime, and series or add your own custom/unlisted titles with personal ratings, status, and reviews.
          </p>
        </div>

        {/* AddTitleSearch with Hybrid Search + Custom/Manual Modal */}
        <AddTitleSearch />
      </main>
    </div>
  );
}