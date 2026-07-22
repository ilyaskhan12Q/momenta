import { User } from '@/modules/identity/domain/entities/User';
import { Email } from '@/modules/identity/domain/value-objects/Email';
import { UserRoleType } from '@/modules/identity/domain/value-objects/UserRole';

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
        role: raw.role as UserRoleType,
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
