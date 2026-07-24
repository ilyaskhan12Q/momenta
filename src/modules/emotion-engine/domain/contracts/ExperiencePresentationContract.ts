export interface PipelineMetrics {
  languageDetectionMs: number;
  contextAnalysisMs: number;
  emotionScoringMs: number;
  intensityResolutionMs: number;
  presentationResolutionMs: number;
  structuralValidationMs: number;
  experienceValidationMs: number;
  totalExecutionTimeMs: number;
}

export interface PipelineMetadata {
  engineVersion: '1.0.0';
  themeVersion: '1.0.0';
  analyzer: string;
  generatedAt: string;
  detectedLanguage: string;
  metrics: PipelineMetrics;
}

export interface EmotionProfileData {
  primaryEmotion: string;
  secondaryEmotion: string;
  confidence: number;
  valence: number;
  arousal: number;
  dominance: number;
  intensity: number;
  scores: Record<string, number>;
}

export interface ColorTokens {
  background: string;
  surfaceGlass: string;
  primaryText: string;
  secondaryText: string;
  accentGlow: string;
  borderGlass: string;
  ambientGradients: string[];
  contrastRatio: number;
}

export interface TypographyTokens {
  headerFontFamily: string;
  bodyFontFamily: string;
  baseFontSizePx: number;
  letterSpacing: string;
  lineHeight: number;
}

export interface ShaderTokens {
  fragmentShaderKey: string;
  speed: number;
  noiseScale: number;
  intensity: number;
  uniforms: Record<string, number | number[]>;
}

export interface AnimationTokens {
  sceneTransitionType: string;
  entranceDurationMs: number;
  exitDurationMs: number;
  easingCurve: string;
  reducedMotionFallback: boolean;
}

export interface AudioTokens {
  stemKey: string;
  bpm: number;
  fadeInSeconds: number;
  fadeOutSeconds: number;
  lowPassCutoffHz: number;
  reverbMix: number;
}

export interface GestureTokens {
  gestureType: string;
  triggerPromptText: string;
  completionFeedbackStyle: string;
}

export interface ExperiencePresentationContract {
  pipeline: PipelineMetadata;
  emotionProfile: EmotionProfileData;
  colors: ColorTokens;
  typography: TypographyTokens;
  shader: ShaderTokens;
  animation: AnimationTokens;
  audio: AudioTokens;
  gesture: GestureTokens;
}

export const PipelineMetrics = {};
export const PipelineMetadata = {};
export const EmotionProfileData = {};
export const ColorTokens = {};
export const TypographyTokens = {};
export const ShaderTokens = {};
export const AnimationTokens = {};
export const AudioTokens = {};
export const GestureTokens = {};
export const ExperiencePresentationContract = {};
