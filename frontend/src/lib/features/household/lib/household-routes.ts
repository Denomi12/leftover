export const HOUSEHOLDS_DEPENDENCY = 'app:households';

export const householdPath = (householdId: string, path = '') => `/app/${householdId}${path}`;
