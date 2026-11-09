import type { HouseholdRole } from '#lib/features/household/index.js';
import type { InvitableRole } from '../types/household-invitation.js';

export const INVITABLE_ROLE_OPTIONS: {
  value: InvitableRole;
  label: string;
  description: string;
}[] = [
  {
    value: 'MEMBER',
    label: 'Član',
    description: 'Ureja zalogo, načrtuje obroke in skrbi za nakupovalni seznam.',
  },
  {
    value: 'GUEST',
    label: 'Gost',
    description: 'Vidi zalogo in načrt obrokov ter na seznamu označi kupljeno.',
  },
];

const ROLE_AS_LABELS: Record<HouseholdRole, string> = {
  OWNER: 'kot lastnik',
  MEMBER: 'kot član',
  GUEST: 'kot gost',
};

export const roleAsLabel = (role: HouseholdRole) => ROLE_AS_LABELS[role];

const relativeTime = new Intl.RelativeTimeFormat('sl', { numeric: 'auto' });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
];

export function formatSentAt(isoDate: string, now = Date.now()): string {
  const diff = new Date(isoDate).getTime() - now;
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      return relativeTime.format(Math.round(diff / ms), unit);
    }
  }
  return 'pravkar';
}
