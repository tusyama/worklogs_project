import type { Env } from "@/config/env";
import { Cache } from "./cache";
import { createRedisClient } from "./client";
import type Redis from "ioredis";

let cacheInstance: Cache | null = null;
let redisClient: Redis | null = null;

export async function initCache(env: Env): Promise<Cache> {
  const client = createRedisClient(env.REDIS_URL);
  await client.connect().catch(() => undefined);
  redisClient = client;
  cacheInstance = new Cache(client);
  await cacheInstance.ping();
  return cacheInstance;
}

export async function disconnectCache(): Promise<void> {
  if (!redisClient) return;
  await redisClient.quit().catch(() => undefined);
  redisClient = null;
  cacheInstance = null;
}

export function getCache(): Cache {
  if (!cacheInstance) {
    throw new Error("Cache not initialized");
  }
  return cacheInstance;
}
