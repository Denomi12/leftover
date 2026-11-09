import { z } from 'zod';

export const USER_SEARCH_MIN_LENGTH = 2;

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Poišči uporabnika ali vnesi njegov e-naslov.')
    .pipe(z.email('Vnesi veljaven e-naslov ali izberi uporabnika s seznama.')),
  role: z.enum(['MEMBER', 'GUEST']),
});

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;
