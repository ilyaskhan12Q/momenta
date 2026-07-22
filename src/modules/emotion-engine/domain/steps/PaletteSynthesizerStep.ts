import { IEmotionPipelineStep, EmotionPipelineContext } from '../EmotionPipeline';
import { PresentationContract } from '../PresentationContract';

export class PaletteSynthesizerStep implements IEmotionPipelineStep {
  readonly name = 'PaletteSynthesizerStep';

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const tone = context.classifiedTone || 'NOSTALGIC_WARMTH';

    const contract: PresentationContract = {
      presetId: tone,
      colors: {
        background: tone === 'DEEP_ROMANCE' ? '#120914' : '#0f0d0b',
        surfaceGlass: 'rgba(18, 21, 32, 0.65)',
        primaryText: '#f8fafc',
        secondaryText: '#94a3b8',
        accentGlow: tone === 'DEEP_ROMANCE' ? '#c084fc' : '#8b5cf6',
        borderGlass: 'rgba(255, 255, 255, 0.08)',
      },
      typography: {
        headerFontFamily: 'Playfair Display, Georgia, serif',
        bodyFontFamily: 'Inter, sans-serif',
        baseFontSizePx: 16,
        letterSpacing: '-0.02em',
      },
      shader: {
        fragmentShaderKey: tone === 'DEEP_ROMANCE' ? 'EtherealAuraMesh.frag' : 'SepiaGrainFlow.frag',
        speed: 1.0,
        noiseScale: 0.5,
        intensity: 0.8,
      },
      audio: {
        stemKey: 'ambient_piano_stem_v1',
        bpm: 72,
        fadeInSeconds: 3.0,
        lowPassCutoffHz: 12000,
      },
    };

    return { ...context, presentationContract: contract };
  }
}
