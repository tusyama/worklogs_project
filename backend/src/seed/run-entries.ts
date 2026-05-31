import { loadEnv } from "@/config/env";
import { connectMongo } from "@/db/mongoose";
import mongoose from "mongoose";
import { disconnectCache, initCache } from "@/redis";
import { seedEntries } from "./entries";

const keepExisting = process.argv.includes("--keep");

async function main(): Promise<void> {
  const env = loadEnv();
  await connectMongo(env.MONGODB_URI);

  try {
    await initCache(env);
  } catch {
    console.warn("[seed] Redis unavailable — list cache will not be invalidated");
  }

  const count = await seedEntries({ reset: !keepExisting });
  console.log(
    keepExisting
      ? `Inserted ${count} demo entries (existing rows kept; duplicates possible).`
      : `Seeded ${count} work entries (collection cleared).`,
  );

  await disconnectCache().catch(() => undefined);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
