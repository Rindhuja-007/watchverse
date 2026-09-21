import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding WatchVerse database...");

  const demoEmail = "demo@watchverse.com";
  const passwordHash = await hash("password123", 10);

  // Upsert Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Alex Rivera",
      passwordHash,
    },
    create: {
      email: demoEmail,
      name: "Alex Rivera",
      passwordHash,
    },
  });

  console.log(`👤 User ready: ${demoUser.email} (${demoUser.id})`);

  // Clear existing entries for fresh seed
  await prisma.watchEntry.deleteMany({
    where: { userId: demoUser.id },
  });

  const sampleEntries = [
    {
      externalMediaId: 693134,
      mediaType: "MOVIE",
      domain: "MOVIE",
      title: "Dune: Part Two",
      posterPath: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdropPath: "/xOMo8BRK7PfcJv9JCnx7s520fr.jpg",
      overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      releaseDate: new Date("2024-03-01"),
      status: "WATCHED",
      rating: 10,
      favorite: true,
      notes: "Masterpiece in cinematic scale, sound design, and cinematography. Hans Zimmer's score is transcendent in IMAX.",
    },
    {
      externalMediaId: 124364,
      mediaType: "TV",
      domain: "SERIES",
      title: "The Bear",
      posterPath: "/z99U44WlYgY8o2wR5M9BfT4gJk1.jpg",
      backdropPath: "/gL1k9pX4r1c3o9UqWv9vG8t6K7.jpg",
      overview: "A young fine-dining chef comes home to Chicago to run his family Italian beef sandwich shop after a heartbreaking death.",
      releaseDate: new Date("2022-06-23"),
      status: "WATCHING",
      rating: 9,
      favorite: true,
      notes: "High intensity kitchen drama. The 'Fishes' and 'Forks' episodes in season 2 are peak television.",
    },
    {
      externalMediaId: 94605,
      mediaType: "TV",
      domain: "ANIME",
      title: "Arcane",
      posterPath: "/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
      backdropPath: "/2rmK7mnchw9Xr3XdiTFSxTT0Yqi.jpg",
      overview: "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic and technology.",
      releaseDate: new Date("2021-11-06"),
      status: "WATCHED",
      rating: 10,
      favorite: true,
      notes: "Flawless art direction, lighting, and animation. Vi and Jinx's tragic relationship is unforgettable.",
    },
    {
      externalMediaId: 94954,
      mediaType: "TV",
      domain: "KDRAMA",
      title: "Crash Landing on You",
      posterPath: "/ic9bHffyA8bF7Pq4z8K2a5fV6gY.jpg",
      backdropPath: "/v8j1o7eW1p7r6bF9k5fL2e1.jpg",
      overview: "A South Korean heiress accidentally paraglides into North Korea and into the protective care of an army officer.",
      releaseDate: new Date("2019-12-14"),
      status: "WATCHED",
      rating: 9,
      favorite: false,
      notes: "Unmatched romantic chemistry and warmth. The ducklings squadron brings so much comedy and heart.",
    },
    {
      externalMediaId: 2316,
      mediaType: "TV",
      domain: "SITCOM",
      title: "The Office",
      posterPath: "/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg",
      backdropPath: "/8WUVHemr1a5z1vY7Xk9d6.jpg",
      overview: "The everyday mockumentary lives of eccentric office employees at Dunder Mifflin Paper Company.",
      releaseDate: new Date("2005-03-24"),
      status: "WATCHING",
      rating: 9,
      favorite: false,
      notes: "Always on rotation for comfort background watching. Dinner Party episode never fails to entertain.",
    },
    {
      externalMediaId: 666277,
      mediaType: "MOVIE",
      domain: "MOVIE",
      title: "Past Lives",
      posterPath: "/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
      backdropPath: "/hZkGoQYus5vegHoetDo83VGvBGA.jpg",
      overview: "Two deeply connected childhood friends are wrested apart when one emigrates, reuniting decades later in New York.",
      releaseDate: new Date("2023-06-02"),
      status: "PLAN_TO_WATCH",
      rating: null,
      favorite: false,
      notes: "Recommended for emotional nuance and exploration of In-Yun (destiny).",
    },
    {
      externalMediaId: 209867,
      mediaType: "TV",
      domain: "ANIME",
      title: "Frieren: Beyond Journey's End",
      posterPath: "/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
      backdropPath: "/kY31Wn6V8U9p6PZqZ9d0B3KqK1o.jpg",
      overview: "An elven mage outlives her hero companions and journeys to understand humanity and honor their memory.",
      releaseDate: new Date("2023-09-29"),
      status: "WATCHING",
      rating: 10,
      favorite: true,
      notes: "A soothing, profoundly moving fantasy meditation on time, fleeting moments, and memories.",
    },
    {
      externalMediaId: 872585,
      mediaType: "MOVIE",
      domain: "MOVIE",
      title: "Oppenheimer",
      posterPath: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdropPath: "/rLb2cw0iwRACRTCuu9svvSxADBW.jpg",
      overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
      releaseDate: new Date("2023-07-21"),
      status: "WATCHED",
      rating: 9,
      favorite: false,
      notes: "Relentless momentum for a dialogue-heavy historical drama. Ludwig Göransson's score drives the suspense.",
    },
    {
      externalMediaId: 1396,
      mediaType: "TV",
      domain: "SERIES",
      title: "Breaking Bad",
      posterPath: "/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
      backdropPath: "/9faGSFi5jam6pDWGNd0p8J2qPtZ.jpg",
      overview: "A chemistry teacher diagnosed with terminal lung cancer turns to manufacturing methamphetamine.",
      releaseDate: new Date("2008-01-20"),
      status: "WATCHED",
      rating: 10,
      favorite: true,
      notes: "Gold standard of television serialization and character devolution. Ozymandias is perfection.",
    },
  ];

  for (const entry of sampleEntries) {
    await prisma.watchEntry.create({
      data: {
        ...entry,
        userId: demoUser.id,
      },
    });
  }

  console.log(`✨ Successfully seeded ${sampleEntries.length} watch entries for demo user!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
