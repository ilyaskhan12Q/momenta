import { describe, it, expect, beforeEach } from 'vitest';
import { CreateExperienceUseCase } from '../../../../src/modules/authoring/application/use-cases/CreateExperienceUseCase';
import { UpdateExperienceUseCase } from '../../../../src/modules/authoring/application/use-cases/UpdateExperienceUseCase';
import { PublishExperienceUseCase } from '../../../../src/modules/authoring/application/use-cases/PublishExperienceUseCase';
import { GetExperienceUseCase } from '../../../../src/modules/authoring/application/use-cases/GetExperienceUseCase';
import { DeleteExperienceUseCase } from '../../../../src/modules/authoring/application/use-cases/DeleteExperienceUseCase';
import { Experience } from '../../../../src/modules/authoring/domain/entities/Experience';
import { Scene } from '../../../../src/modules/authoring/domain/models/Scene';

class InMemoryExperienceRepo {
  private items = new Map<string, Experience>();
  async findById(id: string) {
    return this.items.get(id) || null;
  }
  async findByAccessToken(token: string) {
    return Array.from(this.items.values()).find((e) => e.accessToken?.value === token) || null;
  }
  async save(experience: Experience) {
    this.items.set(experience.id, experience);
  }
}

describe('Authoring Application Use Cases', () => {
  let repo: InMemoryExperienceRepo;

  beforeEach(() => {
    repo = new InMemoryExperienceRepo();
  });

  it('should execute CreateExperienceUseCase and save draft', async () => {
    const useCase = new CreateExperienceUseCase(repo as any);
    const result = await useCase.execute({
      senderId: 'sender-1',
      title: 'Our Journey',
      relationship: 'PARTNER',
      occasion: 'ANNIVERSARY',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.title).toBe('Our Journey');
  });

  it('should execute UpdateExperienceUseCase and update title and scenes', async () => {
    const createUC = new CreateExperienceUseCase(repo as any);
    const exp = (await createUC.execute({ senderId: 's1', title: 'Original', relationship: 'PARTNER', occasion: 'ANNIVERSARY' })).value;

    const updateUC = new UpdateExperienceUseCase(repo as any);
    const updatedRes = await updateUC.execute({
      experienceId: exp.id,
      senderId: 's1',
      title: 'Updated Title',
      scenes: [
        { id: 's1', sequenceOrder: 1, durationMs: 3000, transition: 'FADE_UP', beats: [{ id: 'b1', type: 'HEADING', content: 'Scene 1' }] },
      ],
    });

    expect(updatedRes.isSuccess).toBe(true);
    expect(updatedRes.value.title).toBe('Updated Title');
    expect(updatedRes.value.scenes).toHaveLength(1);
  });

  it('should execute PublishExperienceUseCase and generate access token', async () => {
    const createUC = new CreateExperienceUseCase(repo as any);
    const exp = (await createUC.execute({ senderId: 's1', title: 'Story', relationship: 'PARTNER', occasion: 'BIRTHDAY' })).value;

    exp.appendScene(Scene.create({ id: 's1', sequenceOrder: 1, durationMs: 3000, transition: 'FADE_UP', beats: [{ id: 'b1', type: 'HEADING', content: 'Intro' }] }));
    exp.appendScene(Scene.create({ id: 's2', sequenceOrder: 2, durationMs: 4000, transition: 'PARALLAX_SLIDE', beats: [{ id: 'b2', type: 'QUOTE', content: 'Climax' }] }));
    await repo.save(exp);

    const publishUC = new PublishExperienceUseCase(repo as any);
    const pubRes = await publishUC.execute({ experienceId: exp.id, senderId: 's1' });

    expect(pubRes.isSuccess).toBe(true);
    expect(pubRes.value.status).toBe('PUBLISHED');
    expect(pubRes.value.accessToken).toBeDefined();
  });

  it('should execute GetExperienceUseCase by ID and Access Token', async () => {
    const createUC = new CreateExperienceUseCase(repo as any);
    const exp = (await createUC.execute({ senderId: 's1', title: 'Get Test', relationship: 'PARTNER', occasion: 'VALENTINE' })).value;

    const getUC = new GetExperienceUseCase(repo as any);
    const getRes = await getUC.execute({ experienceId: exp.id });

    expect(getRes.isSuccess).toBe(true);
    expect(getRes.value.title).toBe('Get Test');
  });

  it('should execute DeleteExperienceUseCase successfully', async () => {
    const createUC = new CreateExperienceUseCase(repo as any);
    const exp = (await createUC.execute({ senderId: 's1', title: 'Delete Test', relationship: 'PARTNER', occasion: 'VALENTINE' })).value;

    const deleteUC = new DeleteExperienceUseCase(repo as any);
    const deleteRes = await deleteUC.execute({ experienceId: exp.id, senderId: 's1' });

    expect(deleteRes.isSuccess).toBe(true);

    const getUC = new GetExperienceUseCase(repo as any);
    const getRes = await getUC.execute({ experienceId: exp.id });
    expect(getRes.isFailure).toBe(true);
  });
});
