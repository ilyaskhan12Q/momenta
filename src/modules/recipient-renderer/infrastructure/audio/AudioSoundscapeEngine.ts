import type { AudioTokens } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';

export interface ExtendedAudioTokens extends AudioTokens {
  frequencies?: number[];
  scaleName?: string;
  waveform?: 'sine' | 'triangle';
}

export class AudioSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private tokens: ExtendedAudioTokens | null = null;
  private initialized = false;

  initialize(audioCtx: AudioContext, tokens: AudioTokens | ExtendedAudioTokens): void {
    this.ctx = audioCtx;
    this.tokens = tokens as ExtendedAudioTokens;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.lowpassFilter = this.ctx.createBiquadFilter();
    this.lowpassFilter.type = 'lowpass';
    this.lowpassFilter.frequency.setValueAtTime(tokens.lowPassCutoffHz || 12000, this.ctx.currentTime);

    this.lowpassFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Create ambient chord oscillators based on relationship preset or defaults
    const baseFreqs =
      this.tokens.frequencies && this.tokens.frequencies.length > 0
        ? this.tokens.frequencies
        : tokens.stemKey === 'CELEBRATION_STRINGS'
        ? [220, 277.18, 329.63, 440]
        : [110, 164.81, 220, 329.63];

    const waveformType = this.tokens.waveform || (tokens.stemKey === 'CELEBRATION_STRINGS' ? 'triangle' : 'sine');

    this.oscillators = baseFreqs.map((freq) => {
      const osc = this.ctx!.createOscillator();
      osc.type = waveformType;
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      // Add a subtle LFO detune for natural warmth
      const lfo = this.ctx!.createOscillator();
      lfo.frequency.setValueAtTime(0.2 + Math.random() * 0.1, this.ctx!.currentTime);
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.setValueAtTime(1.5, this.ctx!.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      try {
        lfo.start(this.ctx!.currentTime);
      } catch {
        // Ignored
      }

      osc.connect(this.lowpassFilter!);
      return osc;
    });

    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  start(): void {
    if (!this.initialized || !this.ctx || !this.masterGain || !this.tokens) return;

    const now = this.ctx.currentTime;
    const targetVolume = this.tokens.reverbMix || 0.35;

    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(targetVolume, now + (this.tokens.fadeInSeconds || 2));

    this.oscillators.forEach((osc) => {
      try {
        osc.start(now);
      } catch {
        // Oscillator already started
      }
    });
  }

  setCutoff(frequencyHz: number): void {
    if (this.lowpassFilter && this.ctx) {
      this.lowpassFilter.frequency.setValueAtTime(frequencyHz, this.ctx.currentTime);
    }
  }

  /**
   * Procedural Audio Feedback during tactile gestures (0 - 100 progress)
   */
  triggerGestureProgress(progress: number): void {
    if (!this.initialized || !this.ctx || !this.lowpassFilter) return;

    const minHz = 800;
    const maxHz = (this.tokens?.lowPassCutoffHz || 14000);
    const targetHz = minHz + (maxHz - minHz) * (progress / 100);

    this.lowpassFilter.frequency.setTargetAtTime(targetHz, this.ctx.currentTime, 0.05);
  }

  /**
   * Play a glowing bell/crystal chime when advancing scenes or touching interactive beats
   */
  playChime(pitchMultiplier: number = 1.0): void {
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880 * pitchMultiplier, now); // A5 base
      osc.frequency.exponentialRampToValueAtTime(1760 * pitchMultiplier, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch {
      // Ignore audio synthesis errors on strict browsers
    }
  }

  /**
   * Play a warm harmonic swell when recipient reacts with a heart
   */
  playHeartSwell(): void {
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => { // C5, E5, G5, C6
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.08 + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.9);
      });
    } catch {
      // Ignored
    }
  }

  stopImmediately(): void {
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // Oscillator already stopped
      }
    });
    this.initialized = false;
  }

  stop(): void {
    if (!this.initialized || !this.ctx || !this.masterGain || !this.tokens) return;

    const now = this.ctx.currentTime;
    const fadeOut = this.tokens.fadeOutSeconds || 2;

    this.masterGain.gain.linearRampToValueAtTime(0, now + fadeOut);
    this.stopImmediately();
  }
}
