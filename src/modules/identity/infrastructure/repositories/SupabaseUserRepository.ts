import { SupabaseClient } from '@supabase/supabase-js';
import { IUserRepository } from '@/modules/identity/domain/repositories/IUserRepository';
import { User } from '@/modules/identity/domain/entities/User';
import { UserMapper, SupabaseUserRow } from '../mappers/UserMapper';
import { DomainEventBus } from '@/shared/domain/DomainEventBus';

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
