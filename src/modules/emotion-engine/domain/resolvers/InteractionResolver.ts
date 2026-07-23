export interface InteractionTokens {
  hapticFeedbackEnabled: boolean;
  tapRippleEffect: string;
  scrollSnapThresholdPx: number;
}

export class InteractionResolver {
  resolve(intensity: number): InteractionTokens {
    return {
      hapticFeedbackEnabled: true,
      tapRippleEffect: intensity > 0.7 ? 'HIGH_GLOW' : 'SOFT_RIPPLE',
      scrollSnapThresholdPx: 120,
    };
  }
}
