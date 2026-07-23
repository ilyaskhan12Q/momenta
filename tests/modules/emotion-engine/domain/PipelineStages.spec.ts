import { describe, it, expect } from 'vitest';
import { RuleBasedEmotionAnalyzer } from '../../../../src/modules/emotion-engine/domain/analyzers/RuleBasedEmotionAnalyzer';
import { LanguageDetectionStage } from '../../../../src/modules/emotion-engine/domain/stages/LanguageDetectionStage';
import { ContextAnalysisStage } from '../../../../src/modules/emotion-engine/domain/stages/ContextAnalysisStage';
import { EmotionScoringStage } from '../../../../src/modules/emotion-engine/domain/stages/EmotionScoringStage';
import { IntensityResolutionStage } from '../../../../src/modules/emotion-engine/domain/stages/IntensityResolutionStage';
import { PresentationResolutionStage } from '../../../../src/modules/emotion-engine/domain/stages/PresentationResolutionStage';
import { StructuralValidationStage } from '../../../../src/modules/emotion-engine/domain/stages/StructuralValidationStage';
import { ExperienceValidationStage } from '../../../../src/modules/emotion-engine/domain/stages/ExperienceValidationStage';

describe('Pipeline Stages & RuleBasedEmotionAnalyzer', () => {
  it('should analyze text beats and return scores from RuleBasedEmotionAnalyzer', async () => {
    const analyzer = new RuleBasedEmotionAnalyzer();
    const result = await analyzer.analyze(['I love you so much and forever'], 'PARTNER', 'ANNIVERSARY');
    expect(result.primaryEmotion).toBe('DEEP_ROMANCE');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should execute all stages in sequence and return context with PresentationContract', async () => {
    let ctx = {
      experienceId: 'exp-10',
      senderId: 'user-10',
      relationship: 'PARTNER',
      occasion: 'ANNIVERSARY',
      textBeats: ['Happy anniversary my love!'],
    };

    ctx = await new LanguageDetectionStage().process(ctx);
    expect(ctx.detectedLanguage).toBe('en');

    ctx = await new ContextAnalysisStage().process(ctx);
    expect(ctx.contextMetadata).toBeDefined();

    ctx = await new EmotionScoringStage().process(ctx);
    expect(ctx.analysisResult?.primaryEmotion).toBeDefined();

    ctx = await new IntensityResolutionStage().process(ctx);
    expect(ctx.intensityScore).toBeDefined();

    ctx = await new PresentationResolutionStage().process(ctx);
    expect(ctx.presentationContract).toBeDefined();

    ctx = await new StructuralValidationStage().process(ctx);
    ctx = await new ExperienceValidationStage().process(ctx);

    expect(ctx.presentationContract?.colors.contrastRatio).toBeGreaterThanOrEqual(4.5);
  });
});
