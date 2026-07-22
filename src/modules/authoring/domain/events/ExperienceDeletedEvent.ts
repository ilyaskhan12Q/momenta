import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class ExperienceDeletedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly senderId: string) {}
}
