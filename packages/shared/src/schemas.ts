import { z } from "zod";
import { DEFAULT_ENTRY_SORT, ENTRY_SORT_VALUES } from "./constants/sort";
import { VALIDATION_MESSAGES } from "./constants/validation-messages";

export function isValidDateString(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, VALIDATION_MESSAGES.dateFormat)
  .refine(isValidDateString, VALIDATION_MESSAGES.dateInvalid);

const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, VALIDATION_MESSAGES.objectId);

export const entriesListQuerySchema = z
  .object({
    dateFrom: dateString.optional(),
    dateTo: dateString.optional(),
    sort: z.enum(ENTRY_SORT_VALUES).optional().default(DEFAULT_ENTRY_SORT),
  })
  .superRefine((value, ctx) => {
    if (value.dateFrom && value.dateTo && value.dateFrom > value.dateTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_MESSAGES.dateRange,
        path: ["dateTo"],
      });
    }
  });

export const workEntryCreateSchema = z.object({
  completedAt: dateString,
  workTypeId: objectIdString,
  volume: z.preprocess(
    (value) => (typeof value === "number" && Number.isNaN(value) ? undefined : value),
    z.coerce
      .number({
        required_error: VALIDATION_MESSAGES.volumeRequired,
        invalid_type_error: VALIDATION_MESSAGES.volumeRequired,
      })
      .finite(VALIDATION_MESSAGES.volumePositive)
      .min(0.0001, VALIDATION_MESSAGES.volumePositive)
      .max(1_000_000_000, VALIDATION_MESSAGES.volumeTooLarge),
  ),
  unit: z.string().trim().min(1, VALIDATION_MESSAGES.unitRequired).max(32),
  performerName: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.performerRequired)
    .max(200),
});

export const workEntryUpdateSchema = workEntryCreateSchema;

export const entryIdParamSchema = z.object({
  id: objectIdString,
});
