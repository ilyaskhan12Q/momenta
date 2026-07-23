import { describe, it, expect } from 'vitest';
import { EmotionPipelineOrchestrator } from '../../../../src/modules/emotion-engine/domain/EmotionPipelineOrchestrator';

describe('Deterministic Snapshot Testing', () => {
  it('should produce identical presentation contracts given identical inputs', async () => {
    const orchestrator = new EmotionPipelineOrchestrator();
    const input = {
      experienceId: 'exp-fixed',
      senderId: 'user-fixed',
      relationship: 'FRIEND',
      occasion: 'BIRTHDAY',
      textBeats: ['Wishing you a wonderful birthday filled with joy and laughter!'],
    };

    const res1 = await orchestrator.execute(input);
    const res2 = await orchestrator.execute(input);

    expect(res1.colors).toEqual(res2.colors);
    expect(res1.typography).toEqual(res2.typography);
    expect(res1.shader).toEqual(res2.shader);
    expect(res1.animation).toEqual(res2.animation);
    expect(res1.audio).toEqual(res2.audio);
    expect(res1.gesture).toEqual(res2.gesture);
    expect(res1.emotionProfile).toEqual(res2.emotionProfile);
  });
});
