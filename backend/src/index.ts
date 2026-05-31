import { loadEnv } from "./config/env";
import { connectMongo } from "./db/mongoose";
import mongoose from "mongoose";
import { createEntriesController } from "./controllers/entries.controller";
import { createHealthController } from "./controllers/health.controller";
import { createWorkTypesController } from "./controllers/work-types.controller";
import { createRouter } from "./http/router";
import { EntriesRepository } from "./repositories/entries.repository";
import { WorkTypesRepository } from "./repositories/work-types.repository";
import { initCache, disconnectCache } from "./redis";
import { EntriesService } from "./services/entries.service";
import { HealthService } from "./services/health.service";
import { WorkTypesService } from "./services/work-types.service";
import { seedWorkTypes } from "./seed/work-types";

const env = loadEnv();

const cache = await initCache(env);
await connectMongo(env.MONGODB_URI);
await seedWorkTypes();

const entriesRepo = new EntriesRepository();
const workTypesRepo = new WorkTypesRepository();

const entriesService = new EntriesService(entriesRepo, cache);
const workTypesService = new WorkTypesService(workTypesRepo, cache);
const healthService = new HealthService(cache);

const routes = createRouter({
  env,
  health: createHealthController(healthService),
  workTypes: createWorkTypesController(workTypesService),
  entries: createEntriesController(entriesService),
});

const server = Bun.serve({
  port: env.PORT,
  hostname: "0.0.0.0",
  routes,
  fetch() {
    return Response.json({ message: "Not Found" }, { status: 404 });
  },
});

console.log(`API listening on http://localhost:${server.port}`);

const shutdown = async (signal: string) => {
  console.log(`Shutting down (${signal})…`);
  server.stop(true);
  await disconnectCache();
  await mongoose.disconnect().catch(() => undefined);
  process.exit(0);
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
