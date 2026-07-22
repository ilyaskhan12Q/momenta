import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class SceneAppendedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly sceneId: string) {}
}
