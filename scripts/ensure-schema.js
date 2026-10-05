/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Determine DATABASE_URL from process.env or .env / .env.local
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

  if (currentProvider && currentProvider !== targetProvider) {
    console.log(`🔄 Auto-syncing Prisma provider: switching from "${currentProvider}" to "${targetProvider}"...`);
    schema = schema.replace(/provider\s*=\s*"[^"]+"/, `provider = "${targetProvider}"`);
    fs.writeFileSync(schemaPath, schema);
    console.log("📦 Generating Prisma client for " + targetProvider + "...");
    try {
      execSync("node node_modules/prisma/build/index.js generate", { stdio: "inherit" });
    } catch (e) {
      console.warn("Prisma generate warning:", e.message);
    }
  }
}
