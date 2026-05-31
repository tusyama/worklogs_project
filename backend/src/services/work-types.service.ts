import type { ICache } from "@/redis/cache.types";
import { WorkTypesRepository } from "@/repositories/work-types.repository";

export class WorkTypesService {
  constructor(
    private readonly repo: WorkTypesRepository,
    private readonly cache: ICache,
  ) {}

  async list() {
    const cached = await this.cache.getWorkTypesCatalog();
    if (cached) return cached;

    const items = await this.repo.findActive();
    await this.cache.setWorkTypesCatalog(items);
    return items;
  }
}
