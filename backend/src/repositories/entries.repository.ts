import {
  API_MESSAGES,
  computeTotalPages,
  mongoSortDirection,
  type EntriesListQuery,
  type EntriesListResult,
  type WorkEntryCreate,
  type WorkEntryUpdate,
} from "@worklog/shared";
import { Types } from "mongoose";
import { AppError } from "@/errors/app-error";
import { WorkEntryModel } from "@/models/work-entry.model";
import { WorkTypeModel } from "@/models/work-type.model";
import { endOfDayUtc, parseDateOnlyToUtc } from "@/utils/dates";
import { toWorkEntryDto } from "@/utils/mappers";

export class EntriesRepository {
  async findFiltered(filter: EntriesListQuery): Promise<EntriesListResult> {
    const query: Record<string, unknown> = {};
    if (filter.dateFrom || filter.dateTo) {
      query.completedAt = {};
      if (filter.dateFrom) {
        (query.completedAt as Record<string, Date>).$gte = parseDateOnlyToUtc(filter.dateFrom);
      }
      if (filter.dateTo) {
        (query.completedAt as Record<string, Date>).$lte = endOfDayUtc(filter.dateTo);
      }
    }

    const sortDir = mongoSortDirection(filter.sort);
    const skip = (filter.page - 1) * filter.pageSize;

    const [total, docs] = await Promise.all([
      WorkEntryModel.countDocuments(query),
      WorkEntryModel.find(query)
        .sort({ completedAt: sortDir })
        .skip(skip)
        .limit(filter.pageSize)
        .populate("workTypeId", "name")
        .lean(),
    ]);

    return {
      items: docs.map((d) => toWorkEntryDto(d as Parameters<typeof toWorkEntryDto>[0])),
      total,
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: computeTotalPages(total, filter.pageSize),
    };
  }

  async create(input: WorkEntryCreate) {
    await this.ensureActiveWorkType(input.workTypeId);
    const doc = await WorkEntryModel.create({
      completedAt: parseDateOnlyToUtc(input.completedAt),
      workTypeId: input.workTypeId,
      volume: input.volume,
      unit: input.unit,
      performerName: input.performerName,
    });
    const populated = await WorkEntryModel.findById(doc._id).populate("workTypeId", "name").lean();
    if (!populated) {
      throw new AppError(500, API_MESSAGES.entryNotFound);
    }
    return toWorkEntryDto(populated as Parameters<typeof toWorkEntryDto>[0]);
  }

  async update(id: string, input: WorkEntryUpdate) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(400, API_MESSAGES.invalidEntryId);
    }

    const existing = await WorkEntryModel.findById(id).select("workTypeId").lean();
    if (!existing) {
      throw new AppError(404, API_MESSAGES.entryNotFound);
    }

    const workTypeChanged = String(existing.workTypeId) !== input.workTypeId;
    if (workTypeChanged) {
      await this.ensureActiveWorkType(input.workTypeId);
    } else {
      await this.ensureWorkTypeExists(input.workTypeId);
    }

    const doc = await WorkEntryModel.findByIdAndUpdate(
      id,
      {
        completedAt: parseDateOnlyToUtc(input.completedAt),
        workTypeId: input.workTypeId,
        volume: input.volume,
        unit: input.unit,
        performerName: input.performerName,
      },
      { new: true, runValidators: true },
    )
      .populate("workTypeId", "name")
      .lean();

    if (!doc) throw new AppError(404, API_MESSAGES.entryNotFound);
    return toWorkEntryDto(doc as Parameters<typeof toWorkEntryDto>[0]);
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(400, API_MESSAGES.invalidEntryId);
    }
    const result = await WorkEntryModel.findByIdAndDelete(id);
    if (!result) throw new AppError(404, API_MESSAGES.entryNotFound);
  }

  private async ensureActiveWorkType(workTypeId: string) {
    const exists = await WorkTypeModel.exists({ _id: workTypeId, isActive: true });
    if (!exists) throw new AppError(400, API_MESSAGES.workTypeNotFound);
  }

  private async ensureWorkTypeExists(workTypeId: string) {
    const exists = await WorkTypeModel.exists({ _id: workTypeId });
    if (!exists) throw new AppError(400, API_MESSAGES.workTypeNotFound);
  }
}
