import { Story } from '../entities/Story';

export class StoryLengthSpecification {
  public static readonly MAX_CHARACTERS = 2500;

  public isSatisfiedBy(story: Story): boolean {
    let totalLength = 0;
    for (const scene of story.scenes) {
      for (const beat of scene.beats) {
        totalLength += beat.content ? beat.content.length : 0;
      }
    }
    return totalLength <= StoryLengthSpecification.MAX_CHARACTERS;
  }
}
