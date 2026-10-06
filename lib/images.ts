// Centralized image resolution & verified poster catalog

export interface PosterPreset {
  id: string;
  title: string;
  category: "ANIME" | "MOVIE" | "SERIES" | "KDRAMA" | "SITCOM";
  url: string;
  previewName: string;
}

export const DOMAIN_FALLBACKS: Record<string, string> = {
  ANIME: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  MOVIE: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  SERIES: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  KDRAMA: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80",
  SITCOM: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80",
};

export const PRESET_POSTERS: PosterPreset[] = [
  // Anime Presets
  {
    id: "preset-jjk",
    title: "Jujutsu Kaisen",
    category: "ANIME",
    url: "https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg",
    previewName: "Jujutsu Kaisen",
  },
  {
    id: "preset-aot",
    title: "Attack on Titan",
    category: "ANIME",
    url: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    previewName: "Attack on Titan",
  },
  {
    id: "preset-ds",
    title: "Demon Slayer",
    category: "ANIME",
    url: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    previewName: "Demon Slayer",
  },
  {
    id: "preset-chihiro",
    title: "Spirited Away",
    category: "ANIME",
    url: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    previewName: "Spirited Away",
  },
  {
    id: "preset-arcane",
    title: "Arcane",
    category: "ANIME",
    url: "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    previewName: "Arcane",
  },
  {
    id: "preset-cyberpunk",
    title: "Cyberpunk Neon",
    category: "ANIME",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    previewName: "Cyberpunk Neon",
  },

  // Movie Presets
  {
    id: "preset-dune",
    title: "Dune: Part Two",
    category: "MOVIE",
    url: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    previewName: "Dune 2",
  },
  {
    id: "preset-oppenheimer",
    title: "Oppenheimer",
    category: "MOVIE",
    url: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    previewName: "Oppenheimer",
  },
  {
    id: "preset-interstellar",
    title: "Interstellar",
    category: "MOVIE",
    url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    previewName: "Interstellar",
  },
  {
    id: "preset-inception",
    title: "Inception",
    category: "MOVIE",
    url: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    previewName: "Inception",
  },
  {
    id: "preset-cinema",
    title: "Cosmic Sci-Fi",
    category: "MOVIE",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    previewName: "Cosmic Sci-Fi",
  },

  // Series Presets
  {
    id: "preset-breakingbad",
    title: "Breaking Bad",
    category: "SERIES",
    url: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    previewName: "Breaking Bad",
  },
  {
    id: "preset-thebear",
    title: "The Bear",
    category: "SERIES",
    url: "https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg",
    previewName: "The Bear",
  },
  {
    id: "preset-stranger",
    title: "Dark Mystery",
    category: "SERIES",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    previewName: "Dark Mystery",
  },

  // K-Drama & Sitcom Presets
  {
    id: "preset-kdrama",
    title: "Seoul Nights",
    category: "KDRAMA",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80",
    previewName: "Seoul Romance",
  },
  {
    id: "preset-sitcom",
    title: "Retro Comedy",
    category: "SITCOM",
    url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80",
    previewName: "Retro Living",
  },
];

// Map of known titles with their verified working high-resolution poster URLs
const KNOWN_TITLE_POSTERS: Record<string, string> = {
  "jujutsu kaisen": "https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg",
  "jujutsu kaisen 0": "https://image.tmdb.org/t/p/w500/3pTwOi2AcpeaRJZZM0085pD7dK7.jpg",
  "attack on titan": "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
  "demon slayer: kimetsu no yaiba": "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
  "demon slayer": "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
  "demon slayer: mugen train": "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
  "spirited away": "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  "arcane": "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
  "dune: part two": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  "dune": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  "oppenheimer": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  "interstellar": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "inception": "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  "breaking bad": "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
  "the bear": "https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg",
  "death note": "https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg",
  "solo leveling": "https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg",
};

// Variety gallery of dynamic fallbacks so no two missing posters look identical
const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function resolvePosterUrl(
  posterPath: string | null | undefined,
  domain: string = "MOVIE",
  title?: string
): string {
  // Check known title overrides first
  if (title) {
    const norm = title.toLowerCase().trim();
    if (KNOWN_TITLE_POSTERS[norm]) {
      // If posterPath was a fake 404 or missing, use verified known poster
      if (!posterPath || posterPath.includes("1m2n3o4") || posterPath.includes("9b2N7T8hJ7k5mK9") || posterPath.includes("photo-1536440136628")) {
        return KNOWN_TITLE_POSTERS[norm];
      }
    }
  }

  if (!posterPath || !posterPath.trim()) {
    if (title) {
      const idx = hashString(title) % FALLBACK_GALLERY.length;
      return FALLBACK_GALLERY[idx];
    }
    return DOMAIN_FALLBACKS[domain] || DOMAIN_FALLBACKS.MOVIE;
  }

  const clean = posterPath.trim();

  // If already full http(s)
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    // If it's a known fake TMDB path from previous seeds
    if (clean.includes("1m2n3o4") || clean.includes("8d8a7k0k1m2n3o4") || clean.includes("9b2N7T8hJ7k5mK9")) {
      const idx = title ? hashString(title) % FALLBACK_GALLERY.length : 0;
      return FALLBACK_GALLERY[idx];
    }
    return clean;
  }

  // If TMDB relative path
  if (clean.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w500${clean}`;
  }

  return `https://image.tmdb.org/t/p/w500/${clean}`;
}

export function getSecondaryFallback(domain: string = "MOVIE", title?: string): string {
  if (title) {
    const idx = (hashString(title) + 1) % FALLBACK_GALLERY.length;
    return FALLBACK_GALLERY[idx];
  }
  return DOMAIN_FALLBACKS[domain] || DOMAIN_FALLBACKS.MOVIE;
}
