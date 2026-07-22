import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';
import { RelationshipIntent } from '../value-objects/RelationshipIntent';
import { OccasionType } from '../value-objects/OccasionType';
import { InteractionGesture } from '../value-objects/InteractionGesture';
import { LinkToken } from '../value-objects/LinkToken';
import { Scene } from '../models/Scene';
import { ExperienceCreatedEvent } from '../events/ExperienceCreatedEvent';
import { SceneAppendedEvent } from '../events/SceneAppendedEvent';
import { ExperiencePublishedEvent } from '../events/ExperiencePublishedEvent';

export type ExperienceLifecycleStatus = 'DRAFT' | 'STORY_COMPOSED' | 'EMOTION_PROCESSED' | 'MANIFEST_COMPILED' | 'PUBLISHED' | 'CONSUMED' | 'EXPIRED';

export interface ExperienceProps {
  senderId: string;
  title: string;
  relationship: RelationshipIntent;
  occasion: OccasionType;
  gesture: InteractionGesture;
  status: ExperienceLifecycleStatus;
  scenes: Scene[];
  burnOnRead: boolean;
  accessToken?: LinkToken;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Experience extends AggregateRoot<ExperienceProps> {
  private constructor(props: ExperienceProps, id?: string) {
    super(props, id);
  }

  public get senderId(): string { return this.props.senderId; }
  public get title(): string { return this.props.title; }
  public get relationship(): RelationshipIntent { return this.props.relationship; }
  public get occasion(): OccasionType { return this.props.occasion; }
  public get gesture(): InteractionGesture { return this.props.gesture; }
  public get status(): ExperienceLifecycleStatus { return this.props.status; }
  public get scenes(): Scene[] { return this.props.scenes; }
  public get burnOnRead(): boolean { return this.props.burnOnRead; }
  public get accessToken(): LinkToken | undefined { return this.props.accessToken; }

  public static createDraft(
    props: { senderId: string; title: string; relationship: RelationshipIntent; occasion: OccasionType; gesture?: InteractionGesture; burnOnRead?: boolean },
    id?: string
  ): Result<Experience, ValidationError> {
    if (!props.title || props.title.trim().length === 0) {
      return Result.fail(new ValidationError('Experience title cannot be empty'));
    }

    const now = new Date();
    const exp = new Experience(
      {
        senderId: props.senderId,
        title: props.title.trim(),
        relationship: props.relationship,
        occasion: props.occasion,
        gesture: props.gesture || InteractionGesture.create('WAX_SEAL'),
        status: 'DRAFT',
        scenes: [],
        burnOnRead: props.burnOnRead || false,
        createdAt: now,
        updatedAt: now,
      },
      id
    );

    if (!id) {
      exp.addDomainEvent(new ExperienceCreatedEvent(exp.id, exp.senderId));
    }

    return Result.ok(exp);
  }

  public appendScene(scene: Scene): Result<void, ValidationError> {
    if (this.props.scenes.length >= 10) {
      return Result.fail(new ValidationError('Experience cannot exceed 10 timeline scenes'));
    }

    this.props.scenes.push(scene);
    if (this.props.status === 'DRAFT' && this.props.scenes.length >= 2) {
      this.props.status = 'STORY_COMPOSED';
    }
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SceneAppendedEvent(this.id, scene.id));
    return Result.ok();
  }

  public publish(): Result<LinkToken, ValidationError> {
    if (this.props.scenes.length < 2) {
      return Result.fail(new ValidationError('Experience requires at least 2 timeline scenes to publish'));
    }

    const token = LinkToken.create();
    this.props.accessToken = token;
    this.props.status = 'PUBLISHED';
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ExperiencePublishedEvent(this.id, token.value));
    return Result.ok(token);
  }

  public static reconstitute(props: ExperienceProps, id: string): Experience {
    return new Experience(props, id);
  }
}
