import { ColorTokens } from '../contracts/ExperiencePresentationContract';

export class ColorResolver {
  resolve(primaryEmotion: string, valence: number, intensity: number): ColorTokens {
    if (primaryEmotion === 'DEEP_ROMANCE') {
      return {
        background: 'hsl(345, 30%, 8%)',
        surfaceGlass: 'rgba(50, 15, 25, 0.45)',
        primaryText: 'hsl(350, 100%, 98%)',
        secondaryText: 'hsl(345, 20%, 80%)',
        accentGlow: 'hsl(340, 90%, 65%)',
        borderGlass: 'rgba(255, 180, 200, 0.15)',
        ambientGradients: ['radial-gradient(circle at 50% 30%, rgba(255, 60, 120, 0.2), transparent 70%)'],
        contrastRatio: 14.2,
      };
    }
    if (primaryEmotion === 'JOYFUL_BURST') {
      return {
        background: 'hsl(35, 40%, 10%)',
        surfaceGlass: 'rgba(60, 45, 20, 0.45)',
        primaryText: 'hsl(40, 100%, 97%)',
        secondaryText: 'hsl(35, 25%, 82%)',
        accentGlow: 'hsl(45, 100%, 60%)',
        borderGlass: 'rgba(255, 220, 150, 0.2)',
        ambientGradients: ['radial-gradient(circle at 50% 40%, rgba(255, 180, 50, 0.25), transparent 70%)'],
        contrastRatio: 13.8,
      };
    }
    if (primaryEmotion === 'SOLACE_COMFORT') {
      return {
        background: 'hsl(210, 25%, 9%)',
        surfaceGlass: 'rgba(25, 40, 55, 0.45)',
        primaryText: 'hsl(210, 50%, 96%)',
        secondaryText: 'hsl(210, 20%, 75%)',
        accentGlow: 'hsl(200, 70%, 60%)',
        borderGlass: 'rgba(180, 220, 255, 0.15)',
        ambientGradients: ['radial-gradient(circle at 50% 50%, rgba(100, 180, 255, 0.15), transparent 70%)'],
        contrastRatio: 12.8,
      };
    }

    // NOSTALGIC_WARMTH default
    return {
      background: 'hsl(20, 25%, 9%)',
      surfaceGlass: 'rgba(45, 30, 20, 0.45)',
      primaryText: 'hsl(25, 60%, 97%)',
      secondaryText: 'hsl(20, 20%, 78%)',
      accentGlow: 'hsl(25, 85%, 65%)',
      borderGlass: 'rgba(255, 200, 160, 0.15)',
      ambientGradients: ['radial-gradient(circle at 50% 50%, rgba(255, 140, 70, 0.18), transparent 70%)'],
      contrastRatio: 13.1,
    };
  }
}
