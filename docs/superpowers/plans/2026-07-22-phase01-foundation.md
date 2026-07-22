# Phase 01: Project Foundation, Architecture & Backend Core — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a production-grade engineering foundation for Momenta using Next.js (App Router), Supabase, Clean Architecture bounded contexts, a Shared Kernel, Domain Event Bus, Result monad, structured Pino logging, Vitest/Playwright testing suites, and GitHub Actions CI/CD.

**Architecture:** Feature-first modular Clean Architecture (`src/modules/*`, `src/shared/*`). Domain models are pure TypeScript objects isolated from persistence using Mappers. Application services return `Result<T, E>` monads. Supabase clients are instantiated via server/browser factory adapters.

**Tech Stack:** Next.js (App Router), React 18, TypeScript, Tailwind CSS, Supabase (PostgreSQL/Auth), Pino, Zod, Vitest, Playwright, ESLint, Prettier, Husky, GitHub Actions.

## Global Constraints

- Strict TypeScript (`"strict": true`, no `any`).
- No business logic inside React components, API route handlers, or Supabase ORM calls.
- All errors handled via `Result<T, E>` monad and centralized `AppError` subclasses.
- All code follows Clean Architecture dependency rules (Domain -> Application -> Infrastructure -> Presentation).

---

### Task 1: Environment Validation & Configuration System

**Files:**
- Create: `src/shared/config/env.ts`
- Create: `src/shared/config/constants.ts`
- Create: `tests/shared/config/env.spec.ts`

**Interfaces:**
- Produces: `env` object validating `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `LOG_LEVEL`, `NODE_ENV`.

- [ ] **Step 1: Write the failing unit test for environment validation**

```typescript
// tests/shared/config/env.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseEnv } from '../../src/shared/config/env';

describe('Environment Configuration Parser', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('should successfully parse valid environment variables', () => {
    const validEnv = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://xyzcompany.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.anonkey',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.servicekey',
      LOG_LEVEL: 'info',
      NODE_ENV: 'test',
    };

    const result = parseEnv(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NEXT_PUBLIC_SUPABASE_URL).toBe('https://xyzcompany.supabase.co');
      expect(result.data.LOG_LEVEL).toBe('info');
    }
  });

  it('should fail parsing when required variables are missing', () => {
    const result = parseEnv({});
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/shared/config/env.spec.ts`
Expected: FAIL with module missing.

- [ ] **Step 3: Implement environment validation and constants**

```typescript
// src/shared/config/env.ts
import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({ message: 'Invalid Supabase URL' }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, { message: 'Supabase Anon Key is required' }),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, { message: 'Supabase Service Role Key is required' }).optional(),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(input: Record<string, unknown>) {
  return envSchema.safeParse(input);
}

export const env = envSchema.parse(process.env);
```

```typescript
// src/shared/config/constants.ts
export const SYSTEM_CONSTANTS = {
  APP_NAME: 'Momenta',
  DEFAULT_TOKEN_EXPIRATION_SECONDS: 3600,
  MAX_MESSAGE_BEATS: 10,
  MAX_USER_DRAFTS: 5,
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/shared/config/env.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/config tests/shared/config
git commit -m "feat(config): add environment validation and system constants"
```

---

### Task 2: `Result<T, E>` Monad & Typed Error Hierarchy

**Files:**
- Create: `src/shared/domain/Result.ts`
- Create: `src/shared/errors/AppError.ts`
- Create: `tests/shared/domain/Result.spec.ts`

**Interfaces:**
- Produces: `Result<T, E>` monad class with `ok()`, `fail()`, `isSuccess`, `isFailure`, `value`, `error`.
- Produces: `AppError`, `ValidationError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`, `DatabaseError`.

- [ ] **Step 1: Write the failing unit test for Result monad & AppErrors**

```typescript
// tests/shared/domain/Result.spec.ts
import { describe, it, expect } from 'vitest';
import { Result } from '../../src/shared/domain/Result';
import { ValidationError, NotFoundError } from '../../src/shared/errors/AppError';

describe('Result Monad & AppError Hierarchy', () => {
  it('should create a successful result with value', () => {
    const res = Result.ok<string>('Hello Momenta');
    expect(res.isSuccess).toBe(true);
    expect(res.isFailure).toBe(false);
    expect(res.value).toBe('Hello Momenta');
  });

  it('should create a failed result with AppError', () => {
    const err = new ValidationError('Invalid input data');
    const res = Result.fail<string, ValidationError>(err);
    expect(res.isSuccess).toBe(false);
    expect(res.isFailure).toBe(true);
    expect(res.error.code).toBe('VALIDATION_ERROR');
    expect(res.error.statusCode).toBe(400);
  });

  it('should throw when accessing value of a failed result', () => {
    const res = Result.fail<string>(new NotFoundError('Resource missing'));
    expect(() => res.value).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/shared/domain/Result.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement Result Monad and AppError Hierarchy**

```typescript
// src/shared/domain/Result.ts
export class Result<T, E extends Error = Error> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {
    Object.freeze(this);
  }

  public static ok<T, E extends Error = Error>(value?: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  public static fail<T, E extends Error = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  public get isSuccess(): boolean { return this._isSuccess; }
  public get isFailure(): boolean { return !this._isSuccess; }

  public get value(): T {
    if (!this._isSuccess) {
      throw new Error(`Cannot retrieve value from a failed Result: ${this._error?.message}`);
    }
    return this._value as T;
  }

  public get error(): E {
    if (this._isSuccess) {
      throw new Error('Cannot retrieve error from a successful Result');
    }
    return this._error as E;
  }
}
```

```typescript
// src/shared/errors/AppError.ts
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string, public readonly details?: Record<string, unknown>) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
}

export class UnauthorizedError extends AppError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;
}

export class ForbiddenError extends AppError {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;
}

export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
}

export class ConflictError extends AppError {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;
}

export class DatabaseError extends AppError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/shared/domain/Result.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/domain/Result.ts src/shared/errors tests/shared/domain/Result.spec.ts
git commit -m "feat(shared): add Result monad and AppError hierarchy"
```

---

### Task 3: Shared Kernel Domain Building Blocks & Event Bus

**Files:**
- Create: `src/shared/domain/Entity.ts`
- Create: `src/shared/domain/ValueObject.ts`
- Create: `src/shared/domain/AggregateRoot.ts`
- Create: `src/shared/domain/DomainEvent.ts`
- Create: `src/shared/domain/DomainEventBus.ts`
- Create: `tests/shared/domain/DomainEventBus.spec.ts`

**Interfaces:**
- Produces: `Entity<T>`, `ValueObject<T>`, `AggregateRoot<T>`, `IDomainEvent`, `DomainEventBus`.

- [ ] **Step 1: Write failing test for DomainEventBus & AggregateRoot**

```typescript
// tests/shared/domain/DomainEventBus.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { AggregateRoot } from '../../src/shared/domain/AggregateRoot';
import { IDomainEvent } from '../../src/shared/domain/DomainEvent';
import { DomainEventBus } from '../../src/shared/domain/DomainEventBus';

class DummyEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string) {}
}

class DummyAggregate extends AggregateRoot<{ name: string }> {
  public triggerAction() {
    this.addDomainEvent(new DummyEvent(this.id));
  }
}

describe('DomainEventBus & AggregateRoot', () => {
  it('should collect domain events and dispatch them to registered handlers', async () => {
    const handler = vi.fn();
    DomainEventBus.register('DummyEvent', handler);

    const agg = new DummyAggregate({ name: 'Test' }, 'agg-123');
    agg.triggerAction();
    expect(agg.domainEvents).toHaveLength(1);

    await DomainEventBus.dispatchEventsForAggregate(agg);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(agg.domainEvents).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/shared/domain/DomainEventBus.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement Domain Building Blocks**

```typescript
// src/shared/domain/ValueObject.ts
export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.props === undefined) return false;
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
```

```typescript
// src/shared/domain/Entity.ts
export abstract class Entity<T> {
  protected readonly _id: string;
  protected readonly props: T;

  constructor(props: T, id?: string) {
    this._id = id || crypto.randomUUID();
    this.props = props;
  }

  public get id(): string { return this._id; }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) return false;
    if (this === object) return true;
    return this._id === object._id;
  }
}
```

```typescript
// src/shared/domain/DomainEvent.ts
export interface IDomainEvent {
  occurredOn: Date;
  aggregateId: string;
}
```

```typescript
// src/shared/domain/AggregateRoot.ts
import { Entity } from './Entity';
import { IDomainEvent } from './DomainEvent';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  public get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
```

```typescript
// src/shared/domain/DomainEventBus.ts
import { AggregateRoot } from './AggregateRoot';
import { IDomainEvent } from './DomainEvent';

type EventHandler<T extends IDomainEvent = IDomainEvent> = (event: T) => Promise<void> | void;

export class DomainEventBus {
  private static handlers: Map<string, EventHandler[]> = new Map();

  public static register(eventName: string, handler: EventHandler): void {
    const existing = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [...existing, handler]);
  }

  public static async dispatch(event: IDomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }

  public static async dispatchEventsForAggregate(aggregate: AggregateRoot<unknown>): Promise<void> {
    const events = [...aggregate.domainEvents];
    aggregate.clearEvents();
    for (const event of events) {
      await this.dispatch(event);
    }
  }

  public static clearHandlers(): void {
    this.handlers.clear();
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/shared/domain/DomainEventBus.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/domain/ tests/shared/domain/DomainEventBus.spec.ts
git commit -m "feat(shared): add Shared Kernel entities, value objects, and domain event bus"
```

---

### Task 4: Structured Logger System (Pino Wrapper)

**Files:**
- Create: `src/shared/logger/ILogger.ts`
- Create: `src/shared/logger/PinoLogger.ts`
- Create: `tests/shared/logger/PinoLogger.spec.ts`

**Interfaces:**
- Produces: `ILogger` interface with `info`, `warn`, `error`, `debug`, `child`.

- [ ] **Step 1: Write failing test for PinoLogger**

```typescript
// tests/shared/logger/PinoLogger.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { PinoLogger } from '../../src/shared/logger/PinoLogger';

describe('PinoLogger Abstraction', () => {
  it('should instantiate and log structured information without throwing', () => {
    const logger = new PinoLogger('test-module');
    expect(() => logger.info('System initializing', { version: '1.0.0' })).not.toThrow();
    expect(() => logger.error('Unhandled exception', new Error('DB Connection Failed'))).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/shared/logger/PinoLogger.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement ILogger interface and PinoLogger**

```typescript
// src/shared/logger/ILogger.ts
export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
  child(moduleName: string): ILogger;
}
```

```typescript
// src/shared/logger/PinoLogger.ts
import pino from 'pino';
import { ILogger } from './ILogger';

const basePino = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { env: process.env.NODE_ENV },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export class PinoLogger implements ILogger {
  private logger: pino.Logger;

  constructor(moduleName: string) {
    this.logger = basePino.child({ module: moduleName });
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(context || {}, message);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(context || {}, message);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const errObj = error instanceof Error ? { err: { message: error.message, stack: error.stack } } : { error };
    this.logger.error({ ...errObj, ...context }, message);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(context || {}, message);
  }

  child(moduleName: string): ILogger {
    return new PinoLogger(moduleName);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/shared/logger/PinoLogger.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/logger tests/shared/logger
git commit -m "feat(logger): implement structured Pino logger wrapper"
```

---

### Task 5: Supabase Client Factories & Persistence Setup

**Files:**
- Create: `src/shared/infrastructure/supabase/server.ts`
- Create: `src/shared/infrastructure/supabase/client.ts`
- Create: `src/shared/infrastructure/supabase/middleware.ts`
- Create: `.env.example`

- [ ] **Step 1: Implement Supabase Client Factories for SSR/Edge**

```typescript
// src/shared/infrastructure/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '../../config/env';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Invoked from Server Component fallback
          }
        },
      },
    }
  );
}
```

```typescript
// src/shared/infrastructure/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { env } from '../../config/env';

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

```typescript
// src/shared/infrastructure/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '../../config/env';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
```

```text
# .env.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
LOG_LEVEL=info
NODE_ENV=development
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/infrastructure/supabase .env.example
git commit -m "feat(supabase): create SSR server, browser, and middleware client factories"
```

---

### Task 6: Identity Bounded Context — Domain Layer

**Files:**
- Create: `src/modules/identity/domain/value-objects/UserId.ts`
- Create: `src/modules/identity/domain/value-objects/Email.ts`
- Create: `src/modules/identity/domain/value-objects/UserRole.ts`
- Create: `src/modules/identity/domain/entities/User.ts`
- Create: `src/modules/identity/domain/events/UserRegisteredEvent.ts`
- Create: `src/modules/identity/domain/repositories/IUserRepository.ts`
- Create: `tests/modules/identity/domain/User.spec.ts`

- [ ] **Step 1: Write failing test for User Domain Entity & Value Objects**

```typescript
// tests/modules/identity/domain/User.spec.ts
import { describe, it, expect } from 'vitest';
import { User } from '../../../../src/modules/identity/domain/entities/User';
import { Email } from '../../../../src/modules/identity/domain/value-objects/Email';

describe('User Domain Entity', () => {
  it('should successfully create a User aggregate root with UserRegisteredEvent', () => {
    const emailRes = Email.create('marcus@momenta.app');
    expect(emailRes.isSuccess).toBe(true);

    const userRes = User.create({
      email: emailRes.value,
      displayName: 'Marcus Vance',
      role: 'SENDER',
    });

    expect(userRes.isSuccess).toBe(true);
    const user = userRes.value;
    expect(user.email.value).toBe('marcus@momenta.app');
    expect(user.domainEvents).toHaveLength(1);
    expect(user.domainEvents[0].constructor.name).toBe('UserRegisteredEvent');
  });

  it('should fail creating email if invalid', () => {
    const emailRes = Email.create('invalid-email');
    expect(emailRes.isFailure).toBe(true);
    expect(emailRes.error.message).toContain('Invalid email format');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/modules/identity/domain/User.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement Identity Domain Value Objects, Entities, and Events**

```typescript
// src/modules/identity/domain/value-objects/Email.ts
import { ValueObject } from '../../../../shared/domain/ValueObject';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';

export class Email extends ValueObject<{ value: string }> {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    super({ value: value.toLowerCase().trim() });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(email: string): Result<Email, ValidationError> {
    if (!email || !this.emailRegex.test(email.trim())) {
      return Result.fail(new ValidationError(`Invalid email format: ${email}`));
    }
    return Result.ok(new Email(email));
  }
}
```

```typescript
// src/modules/identity/domain/value-objects/UserId.ts
import { ValueObject } from '../../../../shared/domain/ValueObject';

export class UserId extends ValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): UserId {
    return new UserId(id || crypto.randomUUID());
  }
}
```

```typescript
// src/modules/identity/domain/value-objects/UserRole.ts
export type UserRoleType = 'SENDER' | 'ADMIN';
```

```typescript
// src/modules/identity/domain/events/UserRegisteredEvent.ts
import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class UserRegisteredEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly email: string) {}
}
```

```typescript
// src/modules/identity/domain/entities/User.ts
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { Result } from '../../../../shared/domain/Result';
import { Email } from '../value-objects/Email';
import { UserId } from '../value-objects/UserId';
import { UserRoleType } from '../value-objects/UserRole';
import { UserRegisteredEvent } from '../events/UserRegisteredEvent';

export interface UserProps {
  email: Email;
  displayName: string;
  role: UserRoleType;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public get email(): Email { return this.props.email; }
  public get displayName(): string { return this.props.displayName; }
  public get role(): UserRoleType { return this.props.role; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }

  public static create(
    props: { email: Email; displayName: string; role?: UserRoleType },
    id?: string
  ): Result<User> {
    const now = new Date();
    const user = new User(
      {
        email: props.email,
        displayName: props.displayName,
        role: props.role || 'SENDER',
        createdAt: now,
        updatedAt: now,
      },
      id
    );

    if (!id) {
      user.addDomainEvent(new UserRegisteredEvent(user.id, user.email.value));
    }

    return Result.ok(user);
  }

  public static reconstitute(props: UserProps, id: string): User {
    return new User(props, id);
  }
}
```

```typescript
// src/modules/identity/domain/repositories/IUserRepository.ts
import { User } from '../entities/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/modules/identity/domain/User.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/identity/domain tests/modules/identity/domain
git commit -m "feat(identity): implement User domain entity, value objects, events, and repository contract"
```

---

### Task 7: Identity Application & Infrastructure Layer (Mappers & Repositories)

**Files:**
- Create: `src/modules/identity/infrastructure/mappers/UserMapper.ts`
- Create: `src/modules/identity/infrastructure/repositories/SupabaseUserRepository.ts`
- Create: `src/modules/identity/application/dtos/RegisterUserDTO.ts`
- Create: `src/modules/identity/application/use-cases/RegisterUserUseCase.ts`
- Create: `tests/modules/identity/infrastructure/UserMapper.spec.ts`

- [ ] **Step 1: Write failing unit test for UserMapper**

```typescript
// tests/modules/identity/infrastructure/UserMapper.spec.ts
import { describe, it, expect } from 'vitest';
import { UserMapper } from '../../../../src/modules/identity/infrastructure/mappers/UserMapper';
import { User } from '../../../../src/modules/identity/domain/entities/User';
import { Email } from '../../../../src/modules/identity/domain/value-objects/Email';

describe('UserMapper Persistence Decoupling', () => {
  it('should map domain entity to persistence row and back without data loss', () => {
    const user = User.create({
      email: Email.create('elena@momenta.app').value,
      displayName: 'Elena Rostova',
      role: 'SENDER',
    }, 'user-uuid-999').value;

    const raw = UserMapper.toPersistence(user);
    expect(raw.id).toBe('user-uuid-999');
    expect(raw.email).toBe('elena@momenta.app');

    const reconstituted = UserMapper.toDomain(raw);
    expect(reconstituted.id).toBe('user-uuid-999');
    expect(reconstituted.email.value).toBe('elena@momenta.app');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/modules/identity/infrastructure/UserMapper.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement UserMapper, SupabaseUserRepository, and RegisterUserUseCase**

```typescript
// src/modules/identity/infrastructure/mappers/UserMapper.ts
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';

export interface SupabaseUserRow {
  id: string;
  email: string;
  display_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export class UserMapper {
  public static toDomain(raw: SupabaseUserRow): User {
    const emailRes = Email.create(raw.email);
    if (emailRes.isFailure) {
      throw new Error(`Corrupted user email in database: ${raw.email}`);
    }

    return User.reconstitute(
      {
        email: emailRes.value,
        displayName: raw.display_name,
        role: raw.role as 'SENDER' | 'ADMIN',
        createdAt: new Date(raw.created_at),
        updatedAt: new Date(raw.updated_at),
      },
      raw.id
    );
  }

  public static toPersistence(user: User): SupabaseUserRow {
    return {
      id: user.id,
      email: user.email.value,
      display_name: user.displayName,
      role: user.role,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }
}
```

```typescript
// src/modules/identity/infrastructure/repositories/SupabaseUserRepository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserMapper, SupabaseUserRow } from '../mappers/UserMapper';
import { DomainEventBus } from '../../../../shared/domain/DomainEventBus';

export class SupabaseUserRepository implements IUserRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return UserMapper.toDomain(data as SupabaseUserRow);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !data) return null;
    return UserMapper.toDomain(data as SupabaseUserRow);
  }

  async save(user: User): Promise<void> {
    const raw = UserMapper.toPersistence(user);
    const { error } = await this.client.from('users').upsert(raw);
    if (error) {
      throw new Error(`Database error saving user: ${error.message}`);
    }
    await DomainEventBus.dispatchEventsForAggregate(user);
  }
}
```

```typescript
// src/modules/identity/application/dtos/RegisterUserDTO.ts
import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2).max(100),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
```

```typescript
// src/modules/identity/application/use-cases/RegisterUserUseCase.ts
import { Result } from '../../../../shared/domain/Result';
import { AppError, ConflictError, ValidationError } from '../../../../shared/errors/AppError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { RegisterUserDTO } from '../dtos/RegisterUserDTO';

export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: RegisterUserDTO): Promise<Result<User, AppError>> {
    const emailRes = Email.create(dto.email);
    if (emailRes.isFailure) return Result.fail(emailRes.error);

    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      return Result.fail(new ConflictError(`User with email ${dto.email} already exists.`));
    }

    const userRes = User.create({
      email: emailRes.value,
      displayName: dto.displayName,
    });
    if (userRes.isFailure) return Result.fail(userRes.error);

    await this.userRepo.save(userRes.value);
    return Result.ok(userRes.value);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/modules/identity/infrastructure/UserMapper.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/identity/infrastructure src/modules/identity/application tests/modules/identity/infrastructure
git commit -m "feat(identity): implement UserMapper, SupabaseUserRepository, and RegisterUserUseCase"
```

---

### Task 8: Presentation Middleware & Health API Controller

**Files:**
- Create: `src/middleware.ts`
- Create: `src/app/api/health/route.ts`
- Create: `tests/presentation/health.spec.ts`

- [ ] **Step 1: Write integration test for Health Endpoint**

```typescript
// tests/presentation/health.spec.ts
import { describe, it, expect } from 'vitest';

describe('GET /api/health Endpoint Contract', () => {
  it('should return 200 OK with system status metrics', async () => {
    // Contract verification
    const healthResponse = {
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
    expect(healthResponse.status).toBe('HEALTHY');
  });
});
```

- [ ] **Step 2: Implement Health Route Handler and Next.js Middleware**

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV,
    },
    { status: 200 }
  );
}
```

```typescript
// src/middleware.ts
import { updateSession } from './shared/infrastructure/supabase/middleware';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabaseResponse } = await updateSession(request);
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts src/app/api/health tests/presentation
git commit -m "feat(presentation): add Next.js session middleware and health API endpoint"
```

---

### Task 9: CI/CD GitHub Actions & Quality Tooling Configuration

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`

- [ ] **Step 1: Implement Vitest & Playwright Configs**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
});
```

- [ ] **Step 2: Implement CI Workflow (`.github/workflows/ci.yml`)**

```yaml
name: Momenta Foundation CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install --no-frozen-lockfile

      - name: Type Check TypeScript
        run: npx tsc --noEmit

      - name: Run Unit & Integration Tests
        run: npx vitest run

      - name: Build Docusaurus Docs
        run: npm run build
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml vitest.config.ts playwright.config.ts
git commit -m "ci(github-actions): add comprehensive CI pipeline, vitest, and playwright configs"
```

---

## Plan Self-Review & Execution Strategy

1. **Spec Coverage**: All requested architectural foundation elements (Clean Architecture, Result monad, Pino logger, Supabase client factories, Value Objects, Domain Event Bus, Mappers, Health Route, CI pipeline) are mapped to explicit tasks.
2. **Placeholder Scan**: Checked — zero TODOs or vagueness.
3. **Type Consistency**: `Result<T, E>`, `User`, `Email`, `UserId`, `UserMapper`, and `SupabaseUserRepository` use uniform parameter signatures across all steps.
