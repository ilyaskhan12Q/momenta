import { AudioTokens } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';

export class AudioSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private tokens: AudioTokens | null = null;
  private initialized = false;

  initialize(audioCtx: AudioContext, tokens: AudioTokens): void {
    this.ctx = audioCtx;
    this.tokens = tokens;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.lowpassFilter = this.ctx.createBiquadFilter();
    this.lowpassFilter.type = 'lowpass';
    this.lowpassFilter.frequency.setValueAtTime(tokens.lowPassCutoffHz, this.ctx.currentTime);

    this.lowpassFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Create ambient chord oscillators (A2, E3, A3 ambient pad)
    const baseFreqs = tokens.stemKey === 'CELEBRATION_STRINGS' ? [220, 277.18, 329.63, 440] : [110, 164.81, 220, 329.63];
    this.oscillators = baseFreqs.map((freq) => {
      const osc = this.ctx!.createOscillator();
      osc.type = tokens.stemKey === 'CELEBRATION_STRINGS' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
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
    const targetVolume = this.tokens.reverbMix || 0.3;

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
