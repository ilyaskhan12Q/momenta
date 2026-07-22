import { Result } from '@/shared/domain/Result';
import { AppError, ConflictError } from '@/shared/errors/AppError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { RegisterUserDTO } from '../dtos/RegisterUserDTO';

export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: RegisterUserDTO): Promise<Result<User, AppError>> {
    const emailRes = Email.create(dto.email);
    if (emailRes.isFailure) {
      return Result.fail(emailRes.error);
    }

    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      return Result.fail(new ConflictError(`User with email ${dto.email} already exists.`));
    }

    const userRes = User.create({
      email: emailRes.value,
      displayName: dto.displayName,
    });
    if (userRes.isFailure) {
      return Result.fail(userRes.error);
    }

    const user = userRes.value;
    await this.userRepo.save(user);

    return Result.ok(user);
  }
}
