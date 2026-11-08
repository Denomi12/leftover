const keyFor = (userId: string) => `leftover.household.${userId}`;

export const lastHousehold = {
  get(userId: string): string | null {
    try {
      return localStorage.getItem(keyFor(userId));
    } catch {
      return null;
    }
  },
  set(userId: string, householdId: string): void {
    try {
      localStorage.setItem(keyFor(userId), householdId);
    } catch {}
  },
};
