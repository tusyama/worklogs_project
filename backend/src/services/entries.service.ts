import type { EntriesListQuery, WorkEntryCreate, WorkEntryUpdate } from "@worklog/shared";
import type { ICache } from "../redis/cache.types";
import { EntriesRepository } from "../repositories/entries.repository";

export class EntriesService {
  constructor(
    private readonly repo: EntriesRepository,
    private readonly cache: ICache,
  ) {}

  async list(filter: EntriesListQuery) {
    const version = await this.cache.getEntriesCacheVersion();
    if (version !== null) {
      const cached = await this.cache.getEntriesList(filter, version);
      if (cached) return cached;
    }

    const items = await this.repo.findFiltered(filter);
    if (version !== null) {
      await this.cache.setEntriesList(filter, version, items);
    }
    return items;
  }

  async create(input: WorkEntryCreate) {
    const item = await this.repo.create(input);
    await this.cache.bumpEntriesCacheVersion();
    return item;
  }

  async update(id: string, input: WorkEntryUpdate) {
    const item = await this.repo.update(id, input);
    await this.cache.bumpEntriesCacheVersion();
    return item;
  }

  async delete(id: string) {
    await this.repo.delete(id);
    await this.cache.bumpEntriesCacheVersion();
  }
}
