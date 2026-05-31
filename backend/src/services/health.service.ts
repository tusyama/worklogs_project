import { pingMongo } from "../db/mongoose";
import type { ICache } from "../redis/cache.types";

export class HealthService {
  constructor(private readonly cache: ICache) {}

  async check() {
    const [mongo, redis] = await Promise.all([pingMongo(), this.cache.ping()]);
    return {
      status: !mongo ? "unavailable" : redis ? "ok" : "degraded",
      mongo,
      redis,
    };
  }
}
