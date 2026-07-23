import { describe, it, expect } from 'vitest';
import { EmotionPipelineStartedEvent } from '../../../../src/modules/emotion-engine/domain/events/EmotionPipelineStartedEvent';
import { EmotionPipelineCompletedEvent } from '../../../../src/modules/emotion-engine/domain/events/EmotionPipelineCompletedEvent';

describe('Emotion Engine Domain Contracts & Events', () => {
  it('should instantiate EmotionPipelineStartedEvent with aggregateId and senderId', () => {
    const event = new EmotionPipelineStartedEvent('exp-100', 'user-200');
    expect(event.aggregateId).toBe('exp-100');
    expect(event.senderId).toBe('user-200');
    expect(event.occurredOn).toBeInstanceOf(Date);
  });

  it('should instantiate EmotionPipelineCompletedEvent with aggregateId, primaryEmotion, and execution time', () => {
    const event = new EmotionPipelineCompletedEvent('exp-100', 'DEEP_ROMANCE', 12);
    expect(event.aggregateId).toBe('exp-100');
    expect(event.primaryEmotion).toBe('DEEP_ROMANCE');
    expect(event.totalExecutionTimeMs).toBe(12);
  });
});
