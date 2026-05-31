import type { z } from "zod";
import type {
  entriesListQuerySchema,
  workEntryCreateSchema,
  workEntryUpdateSchema,
} from "./schemas";

export type EntriesListQuery = z.infer<typeof entriesListQuerySchema>;
export type WorkEntryCreate = z.infer<typeof workEntryCreateSchema>;
export type WorkEntryUpdate = z.infer<typeof workEntryUpdateSchema>;

export type WorkTypeDto = {
  id: string;
  name: string;
  defaultUnit: string | null;
};

export type WorkEntryDto = {
  id: string;
  completedAt: string;
  workTypeId: string;
  workTypeName: string;
  volume: number;
  unit: string;
  performerName: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiErrorBody = {
  message: string;
  details?: unknown;
};

export type ItemsResponse<T> = {
  items: T[];
};

export type PaginatedItemsResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type EntriesListResult = PaginatedItemsResponse<WorkEntryDto>;

export type ItemResponse<T> = {
  item: T;
};
