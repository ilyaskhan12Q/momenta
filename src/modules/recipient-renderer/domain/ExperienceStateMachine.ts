export type RecipientPlaybackState = 'LOADING' | 'UNOPENED' | 'UNLOCKING' | 'PLAYING' | 'PAUSED' | 'COMPLETED' | 'ERROR';

export type ExperienceStateTransition =
  | { type: 'MANIFEST_LOADED' }
  | { type: 'MANIFEST_ERROR'; payload: { message: string } }
  | { type: 'START_UNLOCK' }
  | { type: 'CANCEL_UNLOCK' }
  | { type: 'COMPLETE_UNLOCK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COMPLETE_EXPERIENCE' }
  | { type: 'REPLAY' };

export interface ExperienceStateContext {
  state: RecipientPlaybackState;
  errorMessage: string | null;
  unlockProgress: number;
  currentSceneIndex: number;
  totalScenes: number;
}

export class ExperienceStateMachine {
  private context: ExperienceStateContext;
  private listeners: Set<(context: ExperienceStateContext) => void> = new Set();

  constructor(initialState: RecipientPlaybackState = 'LOADING') {
    this.context = {
      state: initialState,
      errorMessage: null,
      unlockProgress: 0,
      currentSceneIndex: 0,
      totalScenes: 0,
    };
  }

  public getSnapshot(): ExperienceStateContext {
    return { ...this.context };
  }

  public subscribe(listener: (context: ExperienceStateContext) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  public transition(action: ExperienceStateTransition): boolean {
    const { state } = this.context;

    switch (action.type) {
      case 'MANIFEST_LOADED':
        if (state === 'LOADING') {
          this.context.state = 'UNOPENED';
          this.context.errorMessage = null;
          this.notify();
          return true;
        }
        break;

      case 'MANIFEST_ERROR':
        this.context.state = 'ERROR';
        this.context.errorMessage = action.payload.message;
        this.notify();
        return true;

      case 'START_UNLOCK':
        if (state === 'UNOPENED') {
          this.context.state = 'UNLOCKING';
          this.context.unlockProgress = 0;
          this.notify();
          return true;
        }
        break;

      case 'CANCEL_UNLOCK':
        if (state === 'UNLOCKING') {
          this.context.state = 'UNOPENED';
          this.context.unlockProgress = 0;
          this.notify();
          return true;
        }
        break;

      case 'COMPLETE_UNLOCK':
        if (state === 'UNOPENED' || state === 'UNLOCKING') {
          this.context.state = 'PLAYING';
          this.context.unlockProgress = 1;
          this.context.currentSceneIndex = 0;
          this.notify();
          return true;
        }
        break;

      case 'PAUSE':
        if (state === 'PLAYING') {
          this.context.state = 'PAUSED';
          this.notify();
          return true;
        }
        break;

      case 'RESUME':
        if (state === 'PAUSED') {
          this.context.state = 'PLAYING';
          this.notify();
          return true;
        }
        break;

      case 'COMPLETE_EXPERIENCE':
        if (state === 'PLAYING' || state === 'PAUSED') {
          this.context.state = 'COMPLETED';
          this.notify();
          return true;
        }
        break;

      case 'REPLAY':
        if (state === 'COMPLETED') {
          this.context.state = 'UNOPENED';
          this.context.currentSceneIndex = 0;
          this.context.unlockProgress = 0;
          this.notify();
          return true;
        }
        break;

      default:
        break;
    }

    return false;
  }

  public setUnlockProgress(progress: number): void {
    const clamped = Math.max(0, Math.min(1, progress));
    this.context.unlockProgress = clamped;
    this.notify();
  }

  public setTotalScenes(count: number): void {
    this.context.totalScenes = count;
  }

  public setSceneIndex(index: number): void {
    if (index >= 0 && (this.context.totalScenes === 0 || index < this.context.totalScenes)) {
      this.context.currentSceneIndex = index;
      this.notify();
    }
  }
}
