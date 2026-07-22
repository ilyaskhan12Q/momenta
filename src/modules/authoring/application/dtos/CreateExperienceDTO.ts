import { z } from 'zod';

export const createExperienceSchema = z.object({
  senderId: z.string().uuid().or(z.string().min(1)),
  title: z.string().min(1, 'Title is required').max(150),
  relationship: z.string().min(1),
  occasion: z.string().min(1),
  gesture: z.enum(['WAX_SEAL', 'CANDLE_BLOW', 'RIBBON_PULL', 'LETTER_FLIP']).optional(),
  burnOnRead: z.boolean().optional(),
});

export type CreateExperienceDTO = z.infer<typeof createExperienceSchema>;
