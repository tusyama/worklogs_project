export const VALIDATION_MESSAGES = {
  dateFormat: "Формат даты: ГГГГ-ММ-ДД",
  dateInvalid: "Некорректная дата",
  dateRange: "Дата «по» не может быть раньше даты «с»",
  objectId: "Некорректный идентификатор",
  volumeRequired: "Укажите объём",
  volumePositive: "Объём должен быть больше 0",
  volumeTooLarge: "Объём слишком большой",
  unitRequired: "Укажите единицу измерения",
  performerRequired: "Укажите ФИО исполнителя",
} as const;
