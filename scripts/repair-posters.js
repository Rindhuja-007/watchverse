const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const VERIFIED_POSTERS = {
  "mob psycho 100": "https://image.tmdb.org/t/p/w500/dyqj0x5t2dO4z0L3bC4Y1bQ1mZ.jpg",
  "solo leveling": "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuClJiwxtJ.jpg",
  "vampire knight": "https://image.tmdb.org/t/p/w500/z0T0oYq9WpE1c4uY.jpg",
  "the lost vanguard": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "my neighbor totoro": "https://image.tmdb.org/t/p/w500/rtGDOe09gnhtOLf9v0vdB9OiIzy.jpg",
  "tokyo revengers": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "tokyo ghoul": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "weathering with you": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  "attack on titan": "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
  "attack on titan: the roar of awakening": "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
  "your lie in april": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  "spirited away": "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  "battle through the heavens": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "one punch man": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "summer time rendering": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "naruto": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "the garden of words": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  "a silent voice: the movie": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  "the boy and the heron": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  "i want to eat your pancreas": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  "your name": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  "demon slayer: kimetsu no yaiba": "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
  "demon slayer: mugen train": "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
  "demon slayer: entertainment district": "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
  "the secret world of arrietty": "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  "lonely castle in the mirror": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  "jujutsu kaisen": "https://image.tmdb.org/t/p/w500/aI1fm7H2rhfRxnwWIdVACR3k1fO.jpg",
  "jujutsu kaisen 0": "https://image.tmdb.org/t/p/w500/3pTwOi2AcpeaRJZZM0085pD7dK7.jpg",
  "howl's moving castle": "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  "hello world": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "death note": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "chainsaw man": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "the dangers in my heart": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  "black clover": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "naruto shippūden": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
};

async function repair() {
  const entries = await prisma.watchEntry.findMany();
  console.log(`Checking ${entries.length} entries for poster repairs...`);

  let repaired = 0;
  for (const entry of entries) {
    const norm = entry.title.toLowerCase().trim();
    const verified = VERIFIED_POSTERS[norm];

    let newPoster = entry.posterPath;
    if (verified) {
      newPoster = verified;
    } else if (entry.posterPath && entry.posterPath.startsWith("/")) {
      newPoster = `https://image.tmdb.org/t/p/w500${entry.posterPath}`;
    }

    if (newPoster && newPoster !== entry.posterPath) {
      await prisma.watchEntry.update({
        where: { id: entry.id },
        data: { posterPath: newPoster },
      });
      repaired++;
    }
  }

  console.log(`✅ Repaired ${repaired} entries with authentic high-resolution poster artwork!`);
}

repair()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
