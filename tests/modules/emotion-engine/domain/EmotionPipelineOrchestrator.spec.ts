import { describe, it, expect } from 'vitest';
import { EmotionPipelineOrchestrator } from '../../../../src/modules/emotion-engine/domain/EmotionPipelineOrchestrator';

describe('EmotionPipelineOrchestrator', () => {
  it('should orchestrate execution, collect metrics, and return ExperiencePresentationContract', async () => {
    const orchestrator = new EmotionPipelineOrchestrator();
    const contract = await orchestrator.execute({
      experienceId: 'exp-100',
      senderId: 'user-100',
      relationship: 'PARTNER',
      occasion: 'ANNIVERSARY',
      textBeats: ['Happy Anniversary my love', 'I cherish every moment with you.'],
    });

    expect(contract.pipeline.engineVersion).toBe('1.0.0');
    expect(contract.pipeline.metrics.totalExecutionTimeMs).toBeGreaterThanOrEqual(0);
    expect(contract.colors.background).toBeDefined();
    expect(contract.emotionProfile.primaryEmotion).toBe('DEEP_ROMANCE');
  });
});
