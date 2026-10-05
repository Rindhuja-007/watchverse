import { Navbar } from "@/components/common/navbar";
import { ShortLanding } from "@/components/landing/short-landing";

export const metadata = {
  title: "REEL | Your Wall of Watching",
  description:
    "The modern cinematic journal. Track movies, anime, series, and K-dramas with episode precision, XML/MAL import, and an aesthetic collector wall.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090a0c] text-[#f5f1e8] selection:bg-[#ef4444] selection:text-white">
      {/* Global REEL Navbar */}
      <Navbar />

      {/* Short Scroll Landing Page */}
      <ShortLanding />
    </main>
  );
}
