import { IDomainEvent } from '@/shared/domain/DomainEvent';

export class UserRegisteredEvent implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly aggregateId: string;
  public readonly email: string;

  constructor(aggregateId: string, email: string, occurredOn?: Date) {
    this.aggregateId = aggregateId;
    this.email = email;
    this.occurredOn = occurredOn ?? new Date();
  }
}
