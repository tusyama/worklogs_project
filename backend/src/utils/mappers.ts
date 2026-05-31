import type { WorkEntryDto, WorkTypeDto } from "@worklog/shared";
import type { WorkEntryDocument } from "@/models/work-entry.model";
import type { WorkTypeDocument } from "@/models/work-type.model";
import { formatDateOnly } from "./dates";

export function toWorkTypeDto(doc: WorkTypeDocument): WorkTypeDto {
  return {
    id: doc._id.toString(),
    name: doc.name,
    defaultUnit: doc.defaultUnit ?? null,
  };
}

export function toWorkEntryDto(doc: WorkEntryDocument): WorkEntryDto {
  const workType =
    doc.workTypeId && typeof doc.workTypeId === "object" && "name" in doc.workTypeId
      ? doc.workTypeId
      : null;

  return {
    id: doc._id.toString(),
    completedAt: formatDateOnly(doc.completedAt),
    workTypeId: workType?._id?.toString() ?? String(doc.workTypeId),
    workTypeName: workType?.name ?? "",
    volume: doc.volume,
    unit: doc.unit,
    performerName: doc.performerName,
    createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}
