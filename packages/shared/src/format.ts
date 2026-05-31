/** Locale-aware display date for ISO `YYYY-MM-DD` entry dates. */
export function formatEntryDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  return new Intl.DateTimeFormat("ru-RU").format(new Date(Number(y), Number(m) - 1, Number(d)));
}

/** Local calendar date as `YYYY-MM-DD` (for form defaults). */
export function formatLocalDateOnly(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
