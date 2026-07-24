export type RelationshipPreset = 'ROMANTIC' | 'PLATONIC' | 'FAMILY' | 'PROFESSIONAL' | 'CUSTOM';
export type ParticleType = 'petals' | 'embers' | 'stars' | 'gold_dust' | 'bokeh';

export interface AtmosphereProfile {
  shaderKey: 'AURORA' | 'GOLD_DUST' | 'EMBERS' | 'STARLIGHT' | 'WATERCOLOR';
  primaryColor: string;
  accentGlow: string;
  backgroundColor: string;
  ambientGradient: string;
  particleType: ParticleType;
  baseSpeed: number;
  baseIntensity: number;
  particleCount: number;
}

export interface DynamicStateModifier {
  speedMultiplier: number;
  intensityMultiplier: number;
  particleCountMultiplier: number;
  turbulence: number;
}

const RELATIONSHIP_ATMOSPHERES: Record<RelationshipPreset, AtmosphereProfile> = {
  ROMANTIC: {
    shaderKey: 'EMBERS',
    primaryColor: '#e63956',
    accentGlow: '#ff6b81',
    backgroundColor: '#0d0407',
    ambientGradient: 'radial-gradient(circle at 50% 50%, rgba(230, 57, 86, 0.15), rgba(13, 4, 7, 0.95))',
    particleType: 'embers',
    baseSpeed: 0.6,
    baseIntensity: 0.8,
    particleCount: 45,
  },
  PLATONIC: {
    shaderKey: 'STARLIGHT',
    primaryColor: '#f59e0b',
    accentGlow: '#fbbf24',
    backgroundColor: '#090807',
    ambientGradient: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.12), rgba(9, 8, 7, 0.95))',
    particleType: 'stars',
    baseSpeed: 0.5,
    baseIntensity: 0.7,
    particleCount: 40,
  },
  FAMILY: {
    shaderKey: 'WATERCOLOR',
    primaryColor: '#fb923c',
    accentGlow: '#fde047',
    backgroundColor: '#0e0b08',
    ambientGradient: 'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.14), rgba(14, 11, 8, 0.95))',
    particleType: 'bokeh',
    baseSpeed: 0.4,
    baseIntensity: 0.75,
    particleCount: 35,
  },
  PROFESSIONAL: {
    shaderKey: 'AURORA',
    primaryColor: '#3b82f6',
    accentGlow: '#60a5fa',
    backgroundColor: '#04070d',
    ambientGradient: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.12), rgba(4, 7, 13, 0.95))',
    particleType: 'gold_dust',
    baseSpeed: 0.45,
    baseIntensity: 0.65,
    particleCount: 30,
  },
  CUSTOM: {
    shaderKey: 'GOLD_DUST',
    primaryColor: '#d97706',
    accentGlow: '#fef08a',
    backgroundColor: '#0a0805',
    ambientGradient: 'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.15), rgba(10, 8, 5, 0.95))',
    particleType: 'gold_dust',
    baseSpeed: 0.55,
    baseIntensity: 0.75,
    particleCount: 40,
  },
};

const STATE_MODIFIERS: Record<string, DynamicStateModifier> = {
  UNOPENED: {
    speedMultiplier: 0.4,
    intensityMultiplier: 0.5,
    particleCountMultiplier: 0.7,
    turbulence: 0.2,
  },
  UNLOCKING: {
    speedMultiplier: 2.2,
    intensityMultiplier: 1.3,
    particleCountMultiplier: 1.5,
    turbulence: 1.4,
  },
  PLAYING: {
    speedMultiplier: 1.0,
    intensityMultiplier: 1.0,
    particleCountMultiplier: 1.0,
    turbulence: 0.6,
  },
  PAUSED: {
    speedMultiplier: 0.25,
    intensityMultiplier: 0.4,
    particleCountMultiplier: 0.6,
    turbulence: 0.1,
  },
  COMPLETED: {
    speedMultiplier: 0.5,
    intensityMultiplier: 0.7,
    particleCountMultiplier: 0.8,
    turbulence: 0.3,
  },
  ERROR: {
    speedMultiplier: 0.1,
    intensityMultiplier: 0.2,
    particleCountMultiplier: 0.3,
    turbulence: 0.0,
  },
};

export class AtmosphereEngine {
  public static getProfile(relationship?: string): AtmosphereProfile {
    const key = (relationship?.toUpperCase() as RelationshipPreset) || 'ROMANTIC';
    return RELATIONSHIP_ATMOSPHERES[key] || RELATIONSHIP_ATMOSPHERES.ROMANTIC;
  }

  public static getStateModifier(state: string): DynamicStateModifier {
    return STATE_MODIFIERS[state] || STATE_MODIFIERS.PLAYING;
  }
}
