/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 1. Detect target provider from DATABASE_URL
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  for (const envFile of [".env.local", ".env"]) {
    const p = path.join(__dirname, "..", envFile);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
      if (match) {
        dbUrl = match[1];
        break;
      }
    }
  }
}

const isPostgres = Boolean(
  dbUrl &&
  (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))
);

const targetProvider = isPostgres ? "postgresql" : "sqlite";
const schemaPath = path.join(__dirname, "../prisma/schema.prisma");

if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, "utf-8");
  const currentMatch = schema.match(/provider\s*=\s*"([^"]+)"/);
  const currentProvider = currentMatch ? currentMatch[1] : null;

  if (currentProvider !== targetProvider) {
    console.log(`🔄 Adjusting Prisma datasource provider to "${targetProvider}" based on DATABASE_URL...`);
    schema = schema.replace(/provider\s*=\s*"[^"]+"/, `provider = "${targetProvider}"`);
    fs.writeFileSync(schemaPath, schema);
  }
}

console.log("📦 Generating Prisma client...");
execSync("node node_modules/prisma/build/index.js generate", { stdio: "inherit" });

if (isPostgres) {
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
const nextBin = path.join(__dirname, "../node_modules/next/dist/bin/next");
if (fs.existsSync(nextBin)) {
  execSync(`node "${nextBin}" build`, { stdio: "inherit" });
} else {
  execSync("next build", { stdio: "inherit" });
}

