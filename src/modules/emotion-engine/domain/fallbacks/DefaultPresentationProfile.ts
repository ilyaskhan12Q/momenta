import { ExperiencePresentationContract } from '../contracts/ExperiencePresentationContract';
import { DefaultEmotionProfile } from './DefaultEmotionProfile';

export const DefaultPresentationProfile: ExperiencePresentationContract = {
  pipeline: {
    engineVersion: '1.0.0',
    themeVersion: '1.0.0',
    analyzer: 'rule-based-v1',
    generatedAt: new Date().toISOString(),
    detectedLanguage: 'en',
    metrics: {
      languageDetectionMs: 1,
      contextAnalysisMs: 1,
      emotionScoringMs: 2,
      intensityResolutionMs: 1,
      presentationResolutionMs: 3,
      structuralValidationMs: 1,
      experienceValidationMs: 1,
      totalExecutionTimeMs: 10,
    },
  },
  emotionProfile: DefaultEmotionProfile,
  colors: {
    background: 'hsl(220, 25%, 10%)',
    surfaceGlass: 'rgba(30, 40, 60, 0.45)',
    primaryText: 'hsl(0, 0%, 98%)',
    secondaryText: 'hsl(220, 15%, 75%)',
    accentGlow: 'hsl(340, 85%, 65%)',
    borderGlass: 'rgba(255, 255, 255, 0.12)',
    ambientGradients: ['radial-gradient(circle at 50% 50%, rgba(255, 100, 150, 0.15), transparent 70%)'],
    contrastRatio: 12.5,
  },
  typography: {
    headerFontFamily: "'Playfair Display', Georgia, serif",
    bodyFontFamily: "'Inter', system-ui, sans-serif",
    baseFontSizePx: 16,
    letterSpacing: '0.02em',
    lineHeight: 1.6,
  },
  shader: {
    fragmentShaderKey: 'WARM_AURORA',
    speed: 0.8,
    noiseScale: 2.5,
    intensity: 0.6,
    uniforms: {
      u_time_scale: 0.8,
      u_warmth: 0.7,
    },
  },
  animation: {
    sceneTransitionType: 'FADE_SLIDE',
    entranceDurationMs: 800,
    exitDurationMs: 600,
    easingCurve: 'cubic-bezier(0.25, 1, 0.5, 1)',
    reducedMotionFallback: false,
  },
  audio: {
    stemKey: 'WARM_PIANO_AMBIENT',
    bpm: 72,
    fadeInSeconds: 2.5,
    fadeOutSeconds: 3.0,
    lowPassCutoffHz: 12000,
    reverbMix: 0.35,
  },
  gesture: {
    gestureType: 'WAX_SEAL',
    triggerPromptText: 'Press & hold to break seal',
    completionFeedbackStyle: 'GOLDEN_PARTICLES',
  },
};
