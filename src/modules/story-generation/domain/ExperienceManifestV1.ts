import { z } from 'zod';

export const experienceManifestV1Schema = z.object({
  version: z.literal('1.0.0'),
  experienceId: z.string().uuid(),
  accessToken: z.string().min(16),
  createdTimestamp: z.number(),
  metadata: z.object({
    title: z.string(),
    relationship: z.string(),
    occasion: z.string(),
  }),
  theme: z.object({
    presetId: z.string(),
    colors: z.object({
      background: z.string(),
      surfaceGlass: z.string(),
      primaryText: z.string(),
      secondaryText: z.string(),
      accentGlow: z.string(),
      borderGlass: z.string(),
    }),
    typography: z.object({
      headerFontFamily: z.string(),
      bodyFontFamily: z.string(),
      baseFontSizePx: z.number(),
      letterSpacing: z.string(),
    }),
    shader: z.object({
      fragmentShaderKey: z.string(),
      speed: z.number(),
      noiseScale: z.number(),
      intensity: z.number(),
    }),
    audio: z.object({
      stemKey: z.string(),
      bpm: z.number(),
      fadeInSeconds: z.number(),
      lowPassCutoffHz: z.number(),
    }),
  }),
  timeline: z.array(
    z.object({
      sceneId: z.string(),
      sequenceOrder: z.number(),
      durationMs: z.number(),
      transition: z.string(),
      beats: z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          content: z.string(),
        })
      ),
    })
  ),
  finalGesture: z.object({
    gestureType: z.string(),
  }),
});

export type ExperienceManifestV1 = z.infer<typeof experienceManifestV1Schema>;
