import { WorkTypeModel } from "@/models/work-type.model";
import { getCache } from "@/redis";

const SEED_WORK_TYPES = [
  { name: "Кладка перегородок", defaultUnit: "м²" },
  { name: "Монтаж опалубки", defaultUnit: "м²" },
  { name: "Бетонирование фундамента", defaultUnit: "м³" },
  { name: "Армирование плиты", defaultUnit: "т" },
  { name: "Гидроизоляция", defaultUnit: "м²" },
  { name: "Монтаж окон", defaultUnit: "шт" },
  { name: "Штукатурка стен", defaultUnit: "м²" },
  { name: "Устройство стяжки", defaultUnit: "м²" },
  { name: "Прокладка электрики", defaultUnit: "м" },
  { name: "Монтаж сантехники", defaultUnit: "шт" },
];

export async function seedWorkTypes(): Promise<void> {
  for (const item of SEED_WORK_TYPES) {
    await WorkTypeModel.updateOne(
      { name: item.name },
      { $set: { defaultUnit: item.defaultUnit, isActive: true } },
      { upsert: true },
    );
  }
  try {
    await getCache().invalidateWorkTypesCatalog();
  } catch {
    /* cache optional at seed */
  }
}
