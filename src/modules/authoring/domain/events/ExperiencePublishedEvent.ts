import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class ExperiencePublishedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly accessToken: string) {}
}
