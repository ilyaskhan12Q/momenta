import { describe, it, expect, vi } from 'vitest';
import { AudioSoundscapeEngine } from '../../../../src/modules/recipient-renderer/infrastructure/audio/AudioSoundscapeEngine';
import { DefaultPresentationProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultPresentationProfile';

describe('AudioSoundscapeEngine', () => {
  it('should initialize AudioContext graph with gain node, low-pass filter, and oscillators', () => {
    const mockGainNode = {
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), value: 0 },
      connect: vi.fn(),
    };
    const mockFilterNode = {
      frequency: { setValueAtTime: vi.fn(), value: 12000 },
      connect: vi.fn(),
    };
    const mockOscillatorNode = {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    const mockAudioContext = {
      currentTime: 0,
      destination: {},
      createGain: vi.fn().mockReturnValue(mockGainNode),
      createBiquadFilter: vi.fn().mockReturnValue(mockFilterNode),
      createOscillator: vi.fn().mockReturnValue(mockOscillatorNode),
    };

    const engine = new AudioSoundscapeEngine();
    engine.initialize(mockAudioContext as any, DefaultPresentationProfile.audio);

    expect(engine.isInitialized()).toBe(true);

    engine.start();
    expect(mockOscillatorNode.start).toHaveBeenCalled();

    engine.setCutoff(8000);
    expect(mockFilterNode.frequency.setValueAtTime).toHaveBeenCalledWith(8000, 0);

    engine.stop();
    expect(mockOscillatorNode.stop).toHaveBeenCalled();
  });
});
