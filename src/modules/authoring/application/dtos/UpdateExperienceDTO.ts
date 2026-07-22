import { z } from 'zod';

export const sceneBeatSchema = z.object({
  id: z.string(),
  type: z.enum(['HEADING', 'PARAGRAPH', 'QUOTE', 'PHOTO_BEAT']),
  content: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export const sceneInputSchema = z.object({
  id: z.string(),
  sequenceOrder: z.number().int().positive(),
  durationMs: z.number().int().positive(),
  transition: z.enum(['FADE_UP', 'PARALLAX_SLIDE', 'ZOOM_IN', 'BLUR_REVEAL']),
  beats: z.array(sceneBeatSchema),
});

export const updateExperienceSchema = z.object({
  experienceId: z.string().min(1),
  senderId: z.string().min(1),
  title: z.string().min(1).max(150).optional(),
  scenes: z.array(sceneInputSchema).optional(),
});

export type UpdateExperienceDTO = z.infer<typeof updateExperienceSchema>;
