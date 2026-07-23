import { TypographyTokens } from '../../contracts/ExperiencePresentationContract';

export interface ITypographyRegistry {
  getTypography(key: string): TypographyTokens;
  registerTypography(key: string, tokens: TypographyTokens): void;
}
