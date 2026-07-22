import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserMapper, SupabaseUserRow } from '@/modules/identity/infrastructure/mappers/UserMapper';
import { SupabaseUserRepository } from '@/modules/identity/infrastructure/repositories/SupabaseUserRepository';
import { RegisterUserUseCase } from '@/modules/identity/application/use-cases/RegisterUserUseCase';
import { User } from '@/modules/identity/domain/entities/User';
import { Email } from '@/modules/identity/domain/value-objects/Email';
import { IUserRepository } from '@/modules/identity/domain/repositories/IUserRepository';
import { ConflictError, ValidationError } from '@/shared/errors/AppError';
import { DomainEventBus } from '@/shared/domain/DomainEventBus';
import { SupabaseClient } from '@supabase/supabase-js';

describe('UserMapper', () => {
  it('should map domain entity to persistence row and back without data loss', () => {
    const email = Email.create('elena@momenta.app').value;
    const user = User.create(
      {
        email,
        displayName: 'Elena Rostova',
        role: 'SENDER',
      },
      'user-uuid-999'
    ).value;

    const raw = UserMapper.toPersistence(user);
    expect(raw.id).toBe('user-uuid-999');
    expect(raw.email).toBe('elena@momenta.app');
    expect(raw.display_name).toBe('Elena Rostova');
    expect(raw.role).toBe('SENDER');
    expect(raw.created_at).toBe(user.createdAt.toISOString());
    expect(raw.updated_at).toBe(user.updatedAt.toISOString());

    const reconstituted = UserMapper.toDomain(raw);
    expect(reconstituted.id).toBe('user-uuid-999');
    expect(reconstituted.email.value).toBe('elena@momenta.app');
    expect(reconstituted.displayName).toBe('Elena Rostova');
    expect(reconstituted.role).toBe('SENDER');
  });

  it('should throw an error when reconstituting with an invalid email', () => {
    const invalidRow: SupabaseUserRow = {
      id: 'corrupt-id',
      email: 'invalid-email-format',
      display_name: 'Corrupt User',
      role: 'SENDER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    expect(() => UserMapper.toDomain(invalidRow)).toThrow('Corrupted user email in database');
  });
});

describe('SupabaseUserRepository', () => {
  let mockSupabaseClient: any;
  let repository: SupabaseUserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find user by id', async () => {
    const rawRow: SupabaseUserRow = {
      id: 'user-123',
      email: 'test@momenta.app',
      display_name: 'Test User',
      role: 'SENDER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockSupabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: rawRow, error: null }),
          }),
        }),
      }),
    };

    repository = new SupabaseUserRepository(mockSupabaseClient as unknown as SupabaseClient);

    const user = await repository.findById('user-123');
    expect(user).not.toBeNull();
    expect(user?.id).toBe('user-123');
    expect(user?.email.value).toBe('test@momenta.app');
  });

  it('should return null when findById returns error or no data', async () => {
    mockSupabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      }),
    };

    repository = new SupabaseUserRepository(mockSupabaseClient as unknown as SupabaseClient);

    const user = await repository.findById('non-existent');
    expect(user).toBeNull();
  });

  it('should find user by email', async () => {
    const rawRow: SupabaseUserRow = {
      id: 'user-456',
      email: 'alex@momenta.app',
      display_name: 'Alex Rivera',
      role: 'ADMIN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockSupabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: rawRow, error: null }),
          }),
        }),
      }),
    };

    repository = new SupabaseUserRepository(mockSupabaseClient as unknown as SupabaseClient);

    const user = await repository.findByEmail('ALEX@momenta.app');
    expect(user).not.toBeNull();
    expect(user?.id).toBe('user-456');
    expect(user?.email.value).toBe('alex@momenta.app');
  });

  it('should save user, upsert into supabase, and dispatch domain events', async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    mockSupabaseClient = {
      from: vi.fn().mockReturnValue({
        upsert: upsertMock,
      }),
    };

    const dispatchSpy = vi.spyOn(DomainEventBus, 'dispatchEventsForAggregate');

    repository = new SupabaseUserRepository(mockSupabaseClient as unknown as SupabaseClient);

    const email = Email.create('newuser@momenta.app').value;
    const user = User.create({ email, displayName: 'New User' }).value;

    await repository.save(user);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
    expect(upsertMock).toHaveBeenCalledWith({
      id: user.id,
      email: 'newuser@momenta.app',
      display_name: 'New User',
      role: 'SENDER',
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    });
    expect(dispatchSpy).toHaveBeenCalledWith(user);
  });
});

describe('RegisterUserUseCase', () => {
  let mockUserRepo: IUserRepository;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    mockUserRepo = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      save: vi.fn(),
    };
    useCase = new RegisterUserUseCase(mockUserRepo);
  });

  it('should successfully register a new user when valid DTO is provided and email does not exist', async () => {
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);
    vi.mocked(mockUserRepo.save).mockResolvedValue();

    const result = await useCase.execute({
      email: 'new.user@momenta.app',
      displayName: 'New User',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.email.value).toBe('new.user@momenta.app');
    expect(result.value.displayName).toBe('New User');
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('new.user@momenta.app');
    expect(mockUserRepo.save).toHaveBeenCalledWith(result.value);
  });

  it('should return ConflictError when user with same email already exists', async () => {
    const existingEmail = Email.create('existing@momenta.app').value;
    const existingUser = User.create({ email: existingEmail, displayName: 'Existing' }).value;
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(existingUser);

    const result = await useCase.execute({
      email: 'existing@momenta.app',
      displayName: 'Another Name',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(ConflictError);
    expect(result.error.message).toContain('already exists');
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });

  it('should return ValidationError when email is invalid', async () => {
    const result = await useCase.execute({
      email: 'not-an-email',
      displayName: 'Some Name',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(ValidationError);
    expect(mockUserRepo.findByEmail).not.toHaveBeenCalled();
  });

  it('should return ValidationError when displayName is empty', async () => {
    vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);

    const result = await useCase.execute({
      email: 'valid@momenta.app',
      displayName: '  ',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(ValidationError);
  });
});
