import { z } from 'zod';

export const HOUSEHOLD_NAME_MAX_LENGTH = 50;

export const createHouseholdSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vnesi ime gospodinjstva.')
    .max(
      HOUSEHOLD_NAME_MAX_LENGTH,
      `Ime je lahko dolgo največ ${HOUSEHOLD_NAME_MAX_LENGTH} znakov.`,
    ),
});

export type CreateHouseholdValues = z.infer<typeof createHouseholdSchema>;
