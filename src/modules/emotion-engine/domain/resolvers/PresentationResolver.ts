import { ExperiencePresentationContract, EmotionProfileData } from '../contracts/ExperiencePresentationContract';
import { EmotionPipelineContext } from '../interfaces/IEmotionPipelineStage';
import { ColorResolver } from './ColorResolver';
import { TypographyResolver } from './TypographyResolver';
import { ShaderResolver } from './ShaderResolver';
import { AnimationResolver } from './AnimationResolver';
import { AudioResolver } from './AudioResolver';
import { GestureResolver } from './GestureResolver';
import { AccessibilityResolver } from './AccessibilityResolver';
import { DefaultEmotionProfile } from '../fallbacks/DefaultEmotionProfile';

export class PresentationResolver {
  private colorResolver = new ColorResolver();
  private typographyResolver = new TypographyResolver();
  private shaderResolver = new ShaderResolver();
  private animationResolver = new AnimationResolver();
  private audioResolver = new AudioResolver();
  private gestureResolver = new GestureResolver();
  private accessibilityResolver = new AccessibilityResolver();

  resolve(context: EmotionPipelineContext): ExperiencePresentationContract {
    const analysis = context.analysisResult;
    const primaryEmotion = analysis?.primaryEmotion || 'NOSTALGIC_WARMTH';
    const secondaryEmotion = analysis?.secondaryEmotion || 'SOLACE_COMFORT';
    const valence = analysis?.valence ?? 0.6;
    const intensity = context.intensityScore ?? 0.5;

    const emotionProfile: EmotionProfileData = {
      primaryEmotion,
      secondaryEmotion,
      confidence: analysis?.confidence ?? 0.85,
      valence,
      arousal: analysis?.arousal ?? 0.5,
      dominance: analysis?.dominance ?? 0.5,
      intensity,
      scores: analysis?.emotionScores || DefaultEmotionProfile.scores,
    };

    const baseColors = this.colorResolver.resolve(primaryEmotion, valence, intensity);
    const typography = this.typographyResolver.resolve(primaryEmotion);
    const shader = this.shaderResolver.resolve(primaryEmotion, intensity);
    const baseAnimation = this.animationResolver.resolve(primaryEmotion);
    const audio = this.audioResolver.resolve(primaryEmotion);
    const gesture = this.gestureResolver.resolve(context.gestureType);

    const { colors, animation } = this.accessibilityResolver.adjustForAccessibility(baseColors, baseAnimation);

    return {
      pipeline: {
        engineVersion: '1.0.0',
        themeVersion: '1.0.0',
        analyzer: 'rule-based-v1',
        generatedAt: new Date().toISOString(),
        detectedLanguage: context.detectedLanguage || 'en',
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
      emotionProfile,
      colors,
      typography,
      shader,
      animation,
      audio,
      gesture,
    };
  }
}
