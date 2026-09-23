const { execSync } = require("child_process");

console.log("📦 Generating Prisma client...");
execSync("node node_modules/prisma/build/index.js generate", { stdio: "inherit" });

if (
  process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.startsWith("postgres://") ||
    process.env.DATABASE_URL.startsWith("postgresql://"))
) {
  console.log("🔄 PostgreSQL DATABASE_URL detected. Syncing schema to database...");
  try {
    execSync("node node_modules/prisma/build/index.js db push --accept-data-loss", {
      stdio: "inherit",
    });
  } catch (error) {
    console.warn("⚠️ Prisma db push warning:", error.message);
  }
}

console.log("⚡ Building Next.js application...");
execSync("next build", { stdio: "inherit" });
