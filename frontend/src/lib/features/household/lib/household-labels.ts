import type { HouseholdRole } from '../types/household.js';

export const ROLE_LABELS: Record<HouseholdRole, string> = {
  OWNER: 'Lastnik',
  MEMBER: 'Član',
  GUEST: 'Gost',
};

export function formatMemberCount(count: number): string {
  const lastTwo = count % 100;
  if (lastTwo === 1) return `${count} član`;
  if (lastTwo === 2) return `${count} člana`;
  if (lastTwo === 3 || lastTwo === 4) return `${count} člani`;
  return `${count} članov`;
}

export function householdSummary(role: HouseholdRole, memberCount: number): string {
  return `${ROLE_LABELS[role]} · ${formatMemberCount(memberCount)}`;
}
