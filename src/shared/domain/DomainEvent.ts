export interface IDomainEvent {
  occurredOn: Date;
  aggregateId: string;
}

export const IDomainEvent = {};
