import { TypographyTokens } from '../contracts/ExperiencePresentationContract';
import { ITypographyRegistry } from '../registries/interfaces/ITypographyRegistry';
import { TypographyRegistry } from '../registries/TypographyRegistry';

export class TypographyResolver {
  constructor(private readonly typographyRegistry: ITypographyRegistry = new TypographyRegistry()) {}

  resolve(primaryEmotion: string): TypographyTokens {
    if (primaryEmotion === 'DEEP_ROMANCE' || primaryEmotion === 'NOSTALGIC_WARMTH') {
      return this.typographyRegistry.getTypography('ELEGANT_SERIF');
    }
    return this.typographyRegistry.getTypography('MODERN_SANS');
  }
}
