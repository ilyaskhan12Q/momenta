import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class EmotionPipelineCompletedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly primaryEmotion: string,
    public readonly totalExecutionTimeMs: number
  ) {}
}
