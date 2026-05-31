import { formatEntryDate, type WorkEntryDto, type WorkTypeDto } from "@worklog/shared";

export const WORK_TYPE_A: WorkTypeDto = {
  id: "507f1f77bcf86cd799439011",
  name: "Кладка перегородок",
  defaultUnit: "м²",
};

export const WORK_TYPE_B: WorkTypeDto = {
  id: "507f1f77bcf86cd799439012",
  name: "Бетонирование",
  defaultUnit: "м³",
};

export const SAMPLE_ENTRY: WorkEntryDto = {
  id: "507f1f77bcf86cd799439021",
  completedAt: "2026-05-15",
  workTypeId: WORK_TYPE_A.id,
  workTypeName: WORK_TYPE_A.name,
  volume: 24,
  unit: "м²",
  performerName: "Иванов И. И.",
  createdAt: "2026-05-15T10:00:00.000Z",
  updatedAt: "2026-05-15T10:00:00.000Z",
};

export { formatEntryDate };
