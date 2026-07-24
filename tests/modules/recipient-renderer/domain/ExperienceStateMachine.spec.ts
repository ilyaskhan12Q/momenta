import { describe, it, expect, beforeEach } from 'vitest';
import { ExperienceStateMachine } from '@/modules/recipient-renderer/domain/ExperienceStateMachine';

describe('ExperienceStateMachine', () => {
  let stateMachine: ExperienceStateMachine;

  beforeEach(() => {
    stateMachine = new ExperienceStateMachine();
  });

  it('starts in LOADING state', () => {
    const snapshot = stateMachine.getSnapshot();
    expect(snapshot.state).toBe('LOADING');
    expect(snapshot.errorMessage).toBeNull();
  });

  it('transitions from LOADING to UNOPENED on MANIFEST_LOADED', () => {
    const success = stateMachine.transition({ type: 'MANIFEST_LOADED' });
    expect(success).toBe(true);
    expect(stateMachine.getSnapshot().state).toBe('UNOPENED');
  });

  it('transitions to ERROR state on MANIFEST_ERROR', () => {
    const success = stateMachine.transition({
      type: 'MANIFEST_ERROR',
      payload: { message: 'Link expired' },
    });
    expect(success).toBe(true);
    const snapshot = stateMachine.getSnapshot();
    expect(snapshot.state).toBe('ERROR');
    expect(snapshot.errorMessage).toBe('Link expired');
  });

  it('handles complete unlock workflow', () => {
    stateMachine.transition({ type: 'MANIFEST_LOADED' });
    expect(stateMachine.getSnapshot().state).toBe('UNOPENED');

    stateMachine.transition({ type: 'START_UNLOCK' });
    expect(stateMachine.getSnapshot().state).toBe('UNLOCKING');

    stateMachine.setUnlockProgress(0.5);
    expect(stateMachine.getSnapshot().unlockProgress).toBe(0.5);

    stateMachine.transition({ type: 'COMPLETE_UNLOCK' });
    expect(stateMachine.getSnapshot().state).toBe('PLAYING');
    expect(stateMachine.getSnapshot().unlockProgress).toBe(1);
  });

  it('allows pause and resume during PLAYING state', () => {
    stateMachine.transition({ type: 'MANIFEST_LOADED' });
    stateMachine.transition({ type: 'COMPLETE_UNLOCK' });

    expect(stateMachine.getSnapshot().state).toBe('PLAYING');

    stateMachine.transition({ type: 'PAUSE' });
    expect(stateMachine.getSnapshot().state).toBe('PAUSED');

    stateMachine.transition({ type: 'RESUME' });
    expect(stateMachine.getSnapshot().state).toBe('PLAYING');
  });

  it('handles completion and replay loop', () => {
    stateMachine.transition({ type: 'MANIFEST_LOADED' });
    stateMachine.transition({ type: 'COMPLETE_UNLOCK' });
    stateMachine.transition({ type: 'COMPLETE_EXPERIENCE' });

    expect(stateMachine.getSnapshot().state).toBe('COMPLETED');

    stateMachine.transition({ type: 'REPLAY' });
    expect(stateMachine.getSnapshot().state).toBe('UNOPENED');
  });
});
