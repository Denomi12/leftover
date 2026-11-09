import { ExpirationStatus } from '../../../utils/types/expiration-status.type.js';
import { EXPIRATION_TIME_ZONE, EXPIRING_SOON_DAYS } from '../constants/food-item.constants.js';

const isoDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: EXPIRATION_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function currentIsoDate(now: Date = new Date()): string {
  return isoDateFormat.format(now);
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getExpirationStatus(
  expirationDate: string | null,
  today: string,
): ExpirationStatus | null {
  if (!expirationDate) {
    return null;
  }
  if (expirationDate < today) {
    return ExpirationStatus.Expired;
  }
  if (expirationDate <= addDays(today, EXPIRING_SOON_DAYS)) {
    return ExpirationStatus.ExpiringSoon;
  }
  return ExpirationStatus.Fresh;
}
