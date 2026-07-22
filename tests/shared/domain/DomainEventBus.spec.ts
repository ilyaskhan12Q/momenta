import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValueObject } from '../../../src/shared/domain/ValueObject';
import { Entity } from '../../../src/shared/domain/Entity';
import { IDomainEvent } from '../../../src/shared/domain/DomainEvent';
import { AggregateRoot } from '../../../src/shared/domain/AggregateRoot';
import { DomainEventBus } from '../../../src/shared/domain/DomainEventBus';

// Test ValueObject concrete implementation
interface TestProps {
  street: string;
  city: string;
  zipCode?: number;
}

class AddressVO extends ValueObject<TestProps> {
  get street(): string {
    return this.props.street;
  }
}

// Test Entity concrete implementation
interface EntityProps {
  name: string;
}

class UserEntity extends Entity<EntityProps> {
  get name(): string {
    return this.props.name;
  }
}

// Test DomainEvent implementation
class UserCreatedEvent implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly aggregateId: string;
  public readonly userName: string;

  constructor(aggregateId: string, userName: string) {
    this.occurredOn = new Date();
    this.aggregateId = aggregateId;
    this.userName = userName;
  }
}

// Test AggregateRoot concrete implementation
class UserAggregate extends AggregateRoot<EntityProps> {
  get name(): string {
    return this.props.name;
  }

  public create(userName: string): void {
    const event = new UserCreatedEvent(this.id, userName);
    this.addDomainEvent(event);
  }
}

describe('ValueObject', () => {
  it('should freeze props upon creation', () => {
    const vo = new AddressVO({ street: 'Main St', city: 'Metropolis' });
    expect(() => {
      // @ts-expect-error mutating frozen prop
      vo['props'].street = 'Second St';
    }).toThrow();
  });

  it('should return true for structural equality', () => {
    const vo1 = new AddressVO({ street: '123 St', city: 'Gotham' });
    const vo2 = new AddressVO({ street: '123 St', city: 'Gotham' });
    expect(vo1.equals(vo2)).toBe(true);
  });

  it('should return false when props differ', () => {
    const vo1 = new AddressVO({ street: '123 St', city: 'Gotham' });
    const vo2 = new AddressVO({ street: '456 St', city: 'Gotham' });
    expect(vo1.equals(vo2)).toBe(false);
  });

  it('should return false for undefined, null, or non-ValueObject', () => {
    const vo = new AddressVO({ street: '123 St', city: 'Gotham' });
    expect(vo.equals(undefined)).toBe(false);
    // @ts-expect-error testing invalid input
    expect(vo.equals(null)).toBe(false);
  });
});

describe('Entity', () => {
  it('should auto-generate a valid id if not provided', () => {
    const entity = new UserEntity({ name: 'Alice' });
    expect(entity.id).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.id.length).toBeGreaterThan(0);
  });

  it('should use provided id if given', () => {
    const customId = 'custom-user-123';
    const entity = new UserEntity({ name: 'Bob' }, customId);
    expect(entity.id).toBe(customId);
  });

  it('should return true when comparing entities with same id', () => {
    const id = 'user-1';
    const entity1 = new UserEntity({ name: 'Alice' }, id);
    const entity2 = new UserEntity({ name: 'Alice Updated' }, id);
    expect(entity1.equals(entity2)).toBe(true);
  });

  it('should return false when comparing entities with different ids', () => {
    const entity1 = new UserEntity({ name: 'Alice' }, 'id-1');
    const entity2 = new UserEntity({ name: 'Alice' }, 'id-2');
    expect(entity1.equals(entity2)).toBe(false);
  });

  it('should return false when comparing with undefined or null', () => {
    const entity = new UserEntity({ name: 'Alice' }, 'id-1');
    expect(entity.equals(undefined)).toBe(false);
    // @ts-expect-error testing invalid input
    expect(entity.equals(null)).toBe(false);
  });
});

describe('AggregateRoot', () => {
  it('should accumulate domain events and allow clearing them', () => {
    const aggregate = new UserAggregate({ name: 'Charlie' }, 'agg-1');
    expect(aggregate.domainEvents).toHaveLength(0);

    aggregate.create('Charlie');
    expect(aggregate.domainEvents).toHaveLength(1);
    expect(aggregate.domainEvents[0].aggregateId).toBe('agg-1');

    aggregate.clearEvents();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});

describe('DomainEventBus', () => {
  beforeEach(() => {
    DomainEventBus.clearHandlers();
  });

  it('should register and dispatch event to handler asynchronously', async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    DomainEventBus.register('UserCreatedEvent', handler);

    const event = new UserCreatedEvent('agg-1', 'Alice');
    await DomainEventBus.dispatch(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should dispatch to multiple registered handlers for the same event', async () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    DomainEventBus.register('UserCreatedEvent', handler1);
    DomainEventBus.register('UserCreatedEvent', handler2);

    const event = new UserCreatedEvent('agg-1', 'Bob');
    await DomainEventBus.dispatch(event);

    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).toHaveBeenCalledWith(event);
  });

  it('should dispatch all domain events for an aggregate root and clear aggregate events', async () => {
    const handler = vi.fn();
    DomainEventBus.register('UserCreatedEvent', handler);

    const aggregate = new UserAggregate({ name: 'David' }, 'agg-100');
    aggregate.create('David');
    expect(aggregate.domainEvents).toHaveLength(1);

    await DomainEventBus.dispatchEventsForAggregate(aggregate);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(aggregate.domainEvents).toHaveLength(0);
  });

  it('should clear all handlers when clearHandlers is called', async () => {
    const handler = vi.fn();
    DomainEventBus.register('UserCreatedEvent', handler);

    DomainEventBus.clearHandlers();

    const event = new UserCreatedEvent('agg-1', 'Eve');
    await DomainEventBus.dispatch(event);

    expect(handler).not.toHaveBeenCalled();
  });
});
