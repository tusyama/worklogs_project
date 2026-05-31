export function parseDateOnlyToUtc(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function endOfDayUtc(dateStr: string): Date {
  const start = parseDateOnlyToUtc(dateStr);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
}
