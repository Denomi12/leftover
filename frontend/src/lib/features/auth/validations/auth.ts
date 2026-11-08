import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;

const email = z.email('Vnesi veljaven e-naslov.');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Vnesi geslo.'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Vnesi ime.').max(100, 'Ime je predolgo.'),
    email,
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Geslo mora imeti vsaj ${PASSWORD_MIN_LENGTH} znakov.`)
      .max(72, 'Geslo je predolgo.'),
    confirmPassword: z.string().min(1, 'Ponovi geslo.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Gesli se ne ujemata.',
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function getFieldErrors<T>(error: z.ZodError<T>): FieldErrors<T> {
  const errors: FieldErrors<T> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof T;
    errors[key] ??= issue.message;
  }
  return errors;
}
