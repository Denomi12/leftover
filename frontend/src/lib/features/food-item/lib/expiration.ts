import { getLocalTimeZone, parseDate, today, type CalendarDate } from '@internationalized/date';
import type { ExpirationStatus, ExpirationWarning, FoodItem } from '../types/food-item.js';

export const EXPIRING_SOON_DAYS = 3;

export const EXPIRATION_LABELS: Record<ExpirationWarning, string> = {
  EXPIRED: 'Poteklo',
  EXPIRING_SOON: 'Kmalu poteče',
};

export const isExpirationWarning = (status: ExpirationStatus | null): status is ExpirationWarning =>
  status === 'EXPIRED' || status === 'EXPIRING_SOON';

export const expiringFoodItems = (items: FoodItem[]) =>
  items.filter((item) => isExpirationWarning(item.expirationStatus));

export const currentDate = (): CalendarDate => today(getLocalTimeZone());

export function formatExpiration(
  expirationDate: string,
  now: CalendarDate = currentDate(),
): string {
  const date = parseDate(expirationDate);
  const dayMonth = `${date.day}. ${date.month}.`;
  return date.year === now.year ? dayMonth : `${dayMonth} ${date.year}`;
}
