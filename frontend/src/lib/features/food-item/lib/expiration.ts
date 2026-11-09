import { getLocalTimeZone, parseDate, today, type CalendarDate } from '@internationalized/date';

export const currentDate = (): CalendarDate => today(getLocalTimeZone());

export function formatExpiration(
  expirationDate: string,
  now: CalendarDate = currentDate(),
): string {
  const date = parseDate(expirationDate);
  const dayMonth = `${date.day}. ${date.month}.`;
  return date.year === now.year ? dayMonth : `${dayMonth} ${date.year}`;
}
