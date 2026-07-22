import { ValueObject } from '../../../../shared/domain/ValueObject';

export type SceneTransitionType = 'FADE_UP' | 'PARALLAX_SLIDE' | 'ZOOM_IN' | 'BLUR_REVEAL';

export interface SceneBeat {
  id: string;
  type: 'HEADING' | 'PARAGRAPH' | 'QUOTE' | 'PHOTO_BEAT';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface SceneProps {
  id: string;
  sequenceOrder: number;
  durationMs: number;
  transition: SceneTransitionType;
  beats: SceneBeat[];
}

export class Scene extends ValueObject<SceneProps> {
  private constructor(props: SceneProps) {
    super(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get sequenceOrder(): number {
    return this.props.sequenceOrder;
  }

  public get durationMs(): number {
    return this.props.durationMs;
  }

  public get transition(): SceneTransitionType {
    return this.props.transition;
  }

  public get beats(): SceneBeat[] {
    return this.props.beats;
  }

  public static create(props: SceneProps): Scene {
    return new Scene(props);
  }
}
