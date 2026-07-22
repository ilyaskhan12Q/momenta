export interface IDomainEvent {
  occurredOn: Date;
  aggregateId: string;
}
