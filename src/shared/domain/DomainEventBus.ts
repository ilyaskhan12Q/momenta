import { IDomainEvent } from './DomainEvent';
import { AggregateRoot } from './AggregateRoot';

export type EventHandler<T extends IDomainEvent = IDomainEvent> = (event: T) => Promise<void> | void;

export class DomainEventBus {
  private static handlers: Map<string, EventHandler[]> = new Map();

  public static register(eventName: string, handler: EventHandler): void {
    const existing = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [...existing, handler]);
  }

  public static async dispatch(event: IDomainEvent): Promise<void> {
    const eventName = (event as { eventName?: string }).eventName || event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];

    for (const handler of handlers) {
      await handler(event);
    }
  }

  public static async dispatchEventsForAggregate(aggregate: AggregateRoot<unknown>): Promise<void> {
    const events = aggregate.domainEvents;
    for (const event of events) {
      await this.dispatch(event);
    }
    aggregate.clearEvents();
  }

  public static clearHandlers(): void {
    this.handlers.clear();
  }
}
