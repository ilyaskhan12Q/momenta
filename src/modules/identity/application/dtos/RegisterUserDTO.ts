import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email('Invalid email address format'),
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name is too long'),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
