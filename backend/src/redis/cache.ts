import type {
  EntriesListQuery,
  EntriesListResult,
  WorkTypeDto,
} from "@worklog/shared";
import type Redis from "ioredis";
import type { ICache } from "./cache.types";
import { entriesListKey, KEYS, TTL } from "./keys";

export class Cache implements ICache {
  constructor(private readonly client: Redis) {}

  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === "PONG";
    } catch {
      return false;
    }
  }

  async getWorkTypesCatalog(): Promise<WorkTypeDto[] | null> {
    return this.safeGet<WorkTypeDto[]>(KEYS.workTypesActive);
  }

  async setWorkTypesCatalog(items: WorkTypeDto[]): Promise<void> {
    await this.safeSet(KEYS.workTypesActive, items, TTL.workTypesCatalog);
  }

  async invalidateWorkTypesCatalog(): Promise<void> {
    await this.safeDel(KEYS.workTypesActive);
  }

  async getEntriesCacheVersion(): Promise<number | null> {
    try {
      const raw = await this.client.get(KEYS.entriesVersion);
      if (!raw) return 0;
      const parsed = Number.parseInt(raw, 10);
      return Number.isFinite(parsed) ? parsed : 0;
    } catch {
      return null;
    }
  }

  async bumpEntriesCacheVersion(): Promise<number> {
    await this.invalidateEntryListCache();
    try {
      return await this.client.incr(KEYS.entriesVersion);
    } catch (error) {
      console.error("[cache] failed to bump entries version", error);
      try {
        const fallback = Date.now();
        await this.client.set(KEYS.entriesVersion, String(fallback));
        return fallback;
      } catch {
        return (await this.getEntriesCacheVersion()) ?? Date.now();
      }
    }
  }

  private async invalidateEntryListCache(): Promise<void> {
    try {
      let cursor = "0";
      do {
        const [next, keys] = await this.client.scan(
          cursor,
          "MATCH",
          "entries:ver:*:list:*",
          "COUNT",
          100
        );
        cursor = next;
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== "0");
    } catch {
      /* fail-soft */
    }
  }

  async getEntriesList(
    filter: EntriesListQuery,
    version: number
  ): Promise<EntriesListResult | null> {
    return this.safeGet<EntriesListResult>(entriesListKey(filter, version));
  }

  async setEntriesList(
    filter: EntriesListQuery,
    version: number,
    result: EntriesListResult
  ): Promise<void> {
    await this.safeSet(
      entriesListKey(filter, version),
      result,
      TTL.entriesList
    );
  }

  private async safeGet<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.client.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  private async safeSet(
    key: string,
    value: unknown,
    ttlSeconds: number
  ): Promise<void> {
    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
      /* fail-soft */
    }
  }

  private async safeDel(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch {
      /* fail-soft */
    }
  }
}
