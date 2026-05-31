import { ENTRY_SORT } from "./sort";

export const UI_TEXT = {
  workLog: {
    title: "Журнал работ",
    subtitle: "Учёт выполненных работ на строительном объекте",
    dateFrom: "Дата с",
    dateTo: "Дата по",
    sortLabel: "Сортировка по дате",
    addEntry: "Добавить запись",
    loading: "Загрузка…",
    loadErrorPrefix: "Ошибка загрузки:",
    workTypesLoadError: "Не удалось загрузить справочник видов работ.",
    dateRangeInvalid: "Дата «по» не может быть раньше даты «с».",
    unknownStatus: "неизвестно",
    saveEntryError: "Не удалось сохранить запись. Проверьте данные и попробуйте снова.",
    deleteEntryError: "Не удалось удалить запись.",
    paginationPrev: "Назад",
    paginationNext: "Вперёд",
    paginationSummary: (page: number, totalPages: number, total: number) =>
      `Страница ${page} из ${totalPages} · всего ${total}`,
  },
  sort: {
    [ENTRY_SORT.DESC]: "Сначала новые",
    [ENTRY_SORT.ASC]: "Сначала старые",
  },
  entryModal: {
    createTitle: "Добавить запись",
    editTitle: "Изменить запись",
  },
  entryForm: {
    completedAt: "Дата выполнения",
    workType: "Вид работ",
    volume: "Объём",
    unit: "Единица измерения",
    unitCustom: "Своя единица…",
    unitCustomPlaceholder: "Например: п.м., компл.",
    performer: "Исполнитель (ФИО)",
    noWorkTypes: "Нет видов работ",
    save: "Сохранить",
    saving: "Сохранение…",
    cancel: "Отмена",
  },
  entriesTable: {
    date: "Дата",
    workType: "Вид работ",
    volume: "Объём",
    performer: "Исполнитель",
    actions: "Действия",
    emptyTitle: "Записей нет",
    emptyDescription: "Добавьте первую запись о выполненных работах",
    edit: "Изменить",
    delete: "Удалить",
  },
  deleteDialog: {
    title: "Удалить запись?",
    delete: "Удалить",
    deleting: "Удаление…",
    cancel: "Отмена",
    body: (completedAt: string, workTypeName: string) =>
      `Запись от ${completedAt} (${workTypeName}) будет удалена без возможности восстановления.`,
  },
  a11y: {
    loading: "Загрузка",
    close: "Закрыть",
  },
} as const;
