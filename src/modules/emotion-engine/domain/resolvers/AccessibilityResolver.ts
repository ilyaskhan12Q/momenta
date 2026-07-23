import { ColorTokens, AnimationTokens } from '../contracts/ExperiencePresentationContract';

export class AccessibilityResolver {
  adjustForAccessibility(colors: ColorTokens, animation: AnimationTokens): { colors: ColorTokens; animation: AnimationTokens } {
    const contrastRatio = colors.contrastRatio >= 4.5 ? colors.contrastRatio : 7.0;
    return {
      colors: {
        ...colors,
        contrastRatio,
      },
      animation: {
        ...animation,
        reducedMotionFallback: true,
      },
    };
  }
}
