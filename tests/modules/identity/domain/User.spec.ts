import { describe, it, expect } from 'vitest';
import { UserId } from '@/modules/identity/domain/value-objects/UserId';
import { Email } from '@/modules/identity/domain/value-objects/Email';
import { UserRoleType } from '@/modules/identity/domain/value-objects/UserRole';
import { User } from '@/modules/identity/domain/entities/User';
import { UserRegisteredEvent } from '@/modules/identity/domain/events/UserRegisteredEvent';
import { ValidationError } from '@/shared/errors/AppError';

describe('UserId Value Object', () => {
  it('should create a UserId with a generated UUID if no id is provided', () => {
    const userId = UserId.create();
    expect(userId.value).toBeDefined();
    expect(typeof userId.value).toBe('string');
    expect(userId.value.length).toBeGreaterThan(0);
  });

  it('should create a UserId with the provided string id', () => {
    const customId = 'user-12345';
    const userId = UserId.create(customId);
    expect(userId.value).toBe(customId);
  });

  it('should support equality comparison', () => {
    const id1 = UserId.create('same-id');
    const id2 = UserId.create('same-id');
    const id3 = UserId.create('different-id');

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });
});

describe('Email Value Object', () => {
  it('should create a valid Email, trimming and lowercasing input', () => {
    const result = Email.create('  Test.User@Example.COM ');
    expect(result.isSuccess).toBe(true);
    expect(result.value.value).toBe('test.user@example.com');
  });

  it('should fail when given an invalid email address', () => {
    const invalidEmails = ['', 'invalid-email', 'user@', '@domain.com', 'user@domain'];

    invalidEmails.forEach((invalidEmail) => {
      const result = Email.create(invalidEmail);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBeInstanceOf(ValidationError);
    });
  });

  it('should support equality comparison', () => {
    const email1 = Email.create('user@example.com').value;
    const email2 = Email.create('USER@example.com').value;
    const email3 = Email.create('other@example.com').value;

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});

describe('User Entity', () => {
  it('should successfully create a new User and emit UserRegisteredEvent when id is omitted', () => {
    const emailRes = Email.create('jane.doe@example.com');
    expect(emailRes.isSuccess).toBe(true);

    const userRes = User.create({
      email: emailRes.value,
      displayName: 'Jane Doe',
    });

    expect(userRes.isSuccess).toBe(true);
    const user = userRes.value;

    expect(user.id).toBeDefined();
    expect(user.email.value).toBe('jane.doe@example.com');
    expect(user.displayName).toBe('Jane Doe');
    expect(user.role).toBe('SENDER');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);

    // Verify domain event emission
    expect(user.domainEvents).toHaveLength(1);
    const event = user.domainEvents[0] as UserRegisteredEvent;
    expect(event).toBeInstanceOf(UserRegisteredEvent);
    expect(event.aggregateId).toBe(user.id);
    expect(event.email).toBe('jane.doe@example.com');
    expect(event.occurredOn).toBeInstanceOf(Date);
  });

  it('should create a User with a specified role and explicit id without emitting domain event if id is provided', () => {
    const email = Email.create('admin@example.com').value;
    const customId = 'admin-id-123';
    const role: UserRoleType = 'ADMIN';

    const userRes = User.create(
      {
        email,
        displayName: 'Admin User',
        role,
      },
      customId
    );

    expect(userRes.isSuccess).toBe(true);
    const user = userRes.value;

    expect(user.id).toBe(customId);
    expect(user.role).toBe('ADMIN');
    expect(user.domainEvents).toHaveLength(0);
  });

  it('should fail User creation if displayName is empty', () => {
    const email = Email.create('user@example.com').value;
    const userRes = User.create({
      email,
      displayName: '   ',
    });

    expect(userRes.isFailure).toBe(true);
    expect(userRes.error).toBeInstanceOf(ValidationError);
  });

  it('should reconstitute a User without emitting events', () => {
    const email = Email.create('existing@example.com').value;
    const now = new Date();
    const existingId = 'existing-user-uuid';

    const user = User.reconstitute(
      {
        email,
        displayName: 'Existing User',
        role: 'SENDER',
        createdAt: now,
        updatedAt: now,
      },
      existingId
    );

    expect(user.id).toBe(existingId);
    expect(user.email.value).toBe('existing@example.com');
    expect(user.displayName).toBe('Existing User');
    expect(user.role).toBe('SENDER');
    expect(user.createdAt).toBe(now);
    expect(user.updatedAt).toBe(now);
    expect(user.domainEvents).toHaveLength(0);
  });

  it('should clear domain events when clearEvents is called', () => {
    const email = Email.create('test@example.com').value;
    const user = User.create({ email, displayName: 'Test User' }).value;

    expect(user.domainEvents).toHaveLength(1);
    user.clearEvents();
    expect(user.domainEvents).toHaveLength(0);
  });
});
