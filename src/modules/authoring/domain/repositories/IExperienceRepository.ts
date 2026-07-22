import { Experience } from '../entities/Experience';

export interface IExperienceRepository {
  findById(id: string): Promise<Experience | null>;
  findByAccessToken(token: string): Promise<Experience | null>;
  save(experience: Experience): Promise<void>;
}
