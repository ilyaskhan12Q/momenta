import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class ExperienceUpdatedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string) {}
}
