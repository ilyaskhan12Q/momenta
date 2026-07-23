import { ITypographyRegistry } from './interfaces/ITypographyRegistry';
import { TypographyTokens } from '../contracts/ExperiencePresentationContract';
import { DefaultPresentationProfile } from '../fallbacks/DefaultPresentationProfile';

export class TypographyRegistry implements ITypographyRegistry {
  private registry = new Map<string, TypographyTokens>();

  constructor() {
    this.registerTypography('ELEGANT_SERIF', {
      headerFontFamily: "'Playfair Display', Georgia, serif",
      bodyFontFamily: "'Inter', system-ui, sans-serif",
      baseFontSizePx: 16,
      letterSpacing: '0.02em',
      lineHeight: 1.6,
    });
    this.registerTypography('MODERN_SANS', {
      headerFontFamily: "'Outfit', system-ui, sans-serif",
      bodyFontFamily: "'Inter', system-ui, sans-serif",
      baseFontSizePx: 16,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    });
  }

  getTypography(key: string): TypographyTokens {
    return this.registry.get(key) || DefaultPresentationProfile.typography;
  }

  registerTypography(key: string, tokens: TypographyTokens): void {
    this.registry.set(key, tokens);
  }
}
