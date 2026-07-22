import { describe, it, expect } from 'vitest';
import { EmotionPipeline } from '../../../../src/modules/emotion-engine/domain/EmotionPipeline';
import { ToneClassifierStep } from '../../../../src/modules/emotion-engine/domain/steps/ToneClassifierStep';
import { PaletteSynthesizerStep } from '../../../../src/modules/emotion-engine/domain/steps/PaletteSynthesizerStep';

describe('Modular Emotion Pipeline', () => {
  it('should execute pipeline steps and produce an enriched PresentationContract', async () => {
    const pipeline = new EmotionPipeline();
    pipeline.addStep(new ToneClassifierStep());
    pipeline.addStep(new PaletteSynthesizerStep());

    const result = await pipeline.execute({
      textBeats: ['Remember that rainy afternoon in Prague?', 'I will love you forever.'],
      relationship: 'PARTNER',
      occasion: 'ANNIVERSARY',
    });

    expect(result.classifiedTone).toBeDefined();
    expect(result.presentationContract).toBeDefined();
    expect(result.presentationContract?.colors.primaryText).toBeDefined();
    expect(result.presentationContract?.shader.fragmentShaderKey).toBeDefined();
  });
});
