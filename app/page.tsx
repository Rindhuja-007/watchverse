import { Navbar } from "@/components/common/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { ActivityMarquee } from "@/components/landing/activity-marquee";
import { UniverseDeck } from "@/components/landing/universe-deck";
import { BentoFeatures } from "@/components/landing/bento-features";
import { CTASection } from "@/components/landing/cta-section";

export const metadata = {
  title: "WatchVerse | Your Watch Life, In One Place",
  description:
    "The modern cinematic journal. Track movies, anime, series, and K-dramas with episode-by-episode precision and aesthetic collector cards.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-cosmic text-[#f5f1e8] selection:bg-[#d9f06a] selection:text-[#101214] overflow-x-hidden">
      {/* Global Transparent Navbar */}
      <Navbar />

      {/* Hero with 3D Scattered Floating Cards (Reference Inspired) */}
      <HeroSection />

      {/* Live Community Activity Marquee */}
      <ActivityMarquee />

      {/* Interactive Universe Deck (Cinema, Anime, K-Drama, Series, Sitcoms) */}
      <UniverseDeck />

      {/* Bento Grid Features (Interactive Episode Tracker, Mood Vibes, Quotes) */}
      <BentoFeatures />

      {/* Final Glowing Call to Action & Modern Footer */}
      <CTASection />
    </main>
  );
}
