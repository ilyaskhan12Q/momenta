import { Entity } from '../../../../shared/domain/Entity';
import { Scene } from '../models/Scene';

export interface StoryProps {
  title: string;
  scenes: Scene[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Story extends Entity<StoryProps> {
  private constructor(props: StoryProps, id?: string) {
    super(props, id);
  }

  public get title(): string {
    return this.props.title;
  }

  public get scenes(): Scene[] {
    return this.props.scenes;
  }

  public static create(props: { title: string; scenes?: Scene[]; createdAt?: Date; updatedAt?: Date }, id?: string): Story {
    const now = new Date();
    return new Story(
      {
        title: props.title,
        scenes: props.scenes || [],
        createdAt: props.createdAt || now,
        updatedAt: props.updatedAt || now,
      },
      id
    );
  }
}
