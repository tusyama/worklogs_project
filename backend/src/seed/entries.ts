import { WorkEntryModel } from "@/models/work-entry.model";
import { WorkTypeModel } from "@/models/work-type.model";
import { getCache } from "@/redis";
import { parseDateOnlyToUtc } from "@/utils/dates";
import { seedWorkTypes } from "./work-types";

type SeedEntryInput = {
  completedAt: string;
  workTypeName: string;
  volume: number;
  unit?: string;
  performerName: string;
};

/** Demo work log rows: mixed dates, types, volumes, units, performers. */
const SEED_ENTRIES: SeedEntryInput[] = [
  { completedAt: "2026-04-01", workTypeName: "Кладка перегородок", volume: 42.5, performerName: "Сидоров А.В." },
  { completedAt: "2026-04-03", workTypeName: "Бетонирование фундамента", volume: 18.2, performerName: "Козлов Д.И." },
  { completedAt: "2026-04-05", workTypeName: "Армирование плиты", volume: 3.8, performerName: "Никитин П.С." },
  { completedAt: "2026-04-07", workTypeName: "Гидроизоляция", volume: 120, performerName: "Федорова Е.М." },
  { completedAt: "2026-04-10", workTypeName: "Монтаж окон", volume: 12, performerName: "Громов И.К." },
  { completedAt: "2026-04-12", workTypeName: "Штукатурка стен", volume: 95, performerName: "Белова О.Н." },
  { completedAt: "2026-04-14", workTypeName: "Устройство стяжки", volume: 68, performerName: "Орлов М.А." },
  { completedAt: "2026-04-16", workTypeName: "Прокладка электрики", volume: 240, performerName: "Власов Н.Г." },
  { completedAt: "2026-04-18", workTypeName: "Монтаж сантехники", volume: 6, performerName: "Данилова Т.Р." },
  { completedAt: "2026-04-20", workTypeName: "Монтаж опалубки", volume: 156, performerName: "Егоров В.Л." },
  { completedAt: "2026-04-22", workTypeName: "Кладка перегородок", volume: 28, performerName: "Сидоров А.В." },
  { completedAt: "2026-04-25", workTypeName: "Бетонирование фундамента", volume: 9.5, performerName: "Козлов Д.И." },
  { completedAt: "2026-04-28", workTypeName: "Армирование плиты", volume: 2.1, performerName: "Павлов С.Е." },
  { completedAt: "2026-05-02", workTypeName: "Гидроизоляция", volume: 45, performerName: "Федорова Е.М." },
  { completedAt: "2026-05-05", workTypeName: "Монтаж окон", volume: 8, performerName: "Громов И.К." },
  { completedAt: "2026-05-08", workTypeName: "Штукатурка стен", volume: 110, performerName: "Медведева А.И." },
  { completedAt: "2026-05-10", workTypeName: "Устройство стяжки", volume: 52, performerName: "Орлов М.А." },
  { completedAt: "2026-05-12", workTypeName: "Прокладка электрики", volume: 180, performerName: "Власов Н.Г." },
  { completedAt: "2026-05-15", workTypeName: "Монтаж сантехники", volume: 4, performerName: "Данилова Т.Р." },
  { completedAt: "2026-05-18", workTypeName: "Монтаж опалубки", volume: 88, performerName: "Егоров В.Л." },
  { completedAt: "2026-05-20", workTypeName: "Кладка перегородок", volume: 35.5, performerName: "Жуков К.П." },
  { completedAt: "2026-05-22", workTypeName: "Бетонирование фундамента", volume: 22, performerName: "Козлов Д.И." },
  { completedAt: "2026-05-25", workTypeName: "Армирование плиты", volume: 5.2, performerName: "Никитин П.С." },
  {
    completedAt: "2026-05-26",
    workTypeName: "Прокладка электрики",
    volume: 15,
    unit: "пог. м",
    performerName: "Романов А.С.",
  },
  { completedAt: "2026-05-30", workTypeName: "Монтаж окон", volume: 15, performerName: "Громов И.К." },
];

export const SEED_ENTRIES_COUNT = SEED_ENTRIES.length;

export type SeedEntriesOptions = {
  /** Remove all existing entries before insert (default: true). */
  reset?: boolean;
};

export async function seedEntries(options: SeedEntriesOptions = {}): Promise<number> {
  const reset = options.reset ?? true;

  await seedWorkTypes();

  const workTypes = await WorkTypeModel.find({ isActive: true }).lean();
  const byName = new Map(workTypes.map((wt) => [wt.name, wt]));

  if (reset) {
    await WorkEntryModel.deleteMany({});
  }

  const docs = SEED_ENTRIES.map((entry) => {
    const workType = byName.get(entry.workTypeName);
    if (!workType) {
      throw new Error(`Work type not found for seed: ${entry.workTypeName}`);
    }
    return {
      completedAt: parseDateOnlyToUtc(entry.completedAt),
      workTypeId: workType._id,
      volume: entry.volume,
      unit: entry.unit ?? workType.defaultUnit,
      performerName: entry.performerName,
    };
  });

  await WorkEntryModel.insertMany(docs);

  try {
    await getCache().bumpEntriesCacheVersion();
  } catch {
    /* cache optional at seed */
  }

  return docs.length;
}
