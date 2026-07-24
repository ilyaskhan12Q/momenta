import type { ColorTokens, TypographyTokens, AudioTokens, GestureTokens, ShaderTokens } from '../../emotion-engine/domain/contracts/ExperiencePresentationContract';

export interface CinematicRelationshipTheme {
  themeKey: string;
  displayName: string;
  relationshipTagline: string;
  colors: ColorTokens;
  typography: TypographyTokens;
  shader: ShaderTokens;
  audio: AudioTokens & {
    frequencies: number[];
    scaleName: string;
    waveform: 'sine' | 'triangle';
  };
  gesture: GestureTokens & {
    type: 'WAX_SEAL' | 'SATIN_RIBBON' | 'MEMORY_CANDLE' | 'UNFOLD_PARCHMENT' | 'HERITAGE_LOCKET';
    icon: string;
    instructions: string;
  };
  particles: {
    type: 'petals' | 'embers' | 'stars' | 'gold_dust' | 'bokeh';
    density: number;
    speed: number;
  };
  outroMessage: string;
}

export function getRelationshipTheme(
  relationshipRaw: string = 'Custom',
  fallbackColors?: ColorTokens,
  fallbackTypography?: TypographyTokens
): CinematicRelationshipTheme {
  const relLower = (relationshipRaw || '').toLowerCase().trim();

  // 1. PARTNER (Deep Velvet Romance)
  if (relLower.includes('partner') || relLower.includes('spouse') || relLower.includes('lover') || relLower.includes('husband') || relLower.includes('wife') || relLower.includes('girlfriend') || relLower.includes('boyfriend')) {
    return {
      themeKey: 'DEEP_VELVET_ROMANCE',
      displayName: 'Partner',
      relationshipTagline: 'Written for the one who holds your heart',
      colors: {
        background: '#0d0509',
        surfaceGlass: 'rgba(255, 230, 240, 0.07)',
        primaryText: '#fff0f5',
        secondaryText: '#f4b8cf',
        accentGlow: '#e63956',
        borderGlass: 'rgba(255, 180, 200, 0.2)',
        ambientGradients: [
          'radial-gradient(circle at 50% 30%, rgba(230, 57, 86, 0.25) 0%, rgba(13, 5, 9, 0.95) 75%)',
          'radial-gradient(circle at 20% 80%, rgba(120, 20, 50, 0.3) 0%, transparent 60%)',
        ],
        contrastRatio: 12.5,
      },
      typography: {
        headerFontFamily: "'Playfair Display', 'Georgia', serif",
        bodyFontFamily: "'Plus Jakarta Sans', sans-serif",
        baseFontSizePx: 18,
        letterSpacing: '0.02em',
        lineHeight: 1.6,
      },
      shader: {
        fragmentShaderKey: 'AURORA',
        speed: 0.6,
        noiseScale: 1.8,
        intensity: 0.75,
        uniforms: { u_romanceGlow: 1.0 },
      },
      audio: {
        stemKey: 'ROMANTIC_PIANO_STRINGS',
        bpm: 64,
        fadeInSeconds: 2.5,
        fadeOutSeconds: 3,
        lowPassCutoffHz: 14000,
        reverbMix: 0.45,
        frequencies: [130.81, 164.81, 196.00, 246.94, 293.66], // C3, E3, G3, B3, D4 (Cmaj9)
        scaleName: 'C Major 9',
        waveform: 'sine',
      },
      gesture: {
        gestureType: 'SATIN_RIBBON',
        type: 'SATIN_RIBBON',
        triggerPromptText: 'Slide to untie the velvet ribbon',
        instructions: 'Gently slide across to open your letter',
        completionFeedbackStyle: 'ELEGANT_SWEEP',
      },
      particles: {
        type: 'petals',
        density: 25,
        speed: 0.4,
      },
      outroMessage: 'Thank you for being my constant, my love, and my home.',
    };
  }

  // 2. MOTHER (Golden Warmth & Gratitude)
  if (relLower.includes('mother') || relLower.includes('mom') || relLower.includes('mama')) {
    return {
      themeKey: 'GOLDEN_GRATITUDE',
      displayName: 'Mother',
      relationshipTagline: 'A heartfelt tribute of endless love & appreciation',
      colors: {
        background: '#0d0905',
        surfaceGlass: 'rgba(255, 245, 230, 0.08)',
        primaryText: '#fffdf9',
        secondaryText: '#f3d5ab',
        accentGlow: '#d99b26',
        borderGlass: 'rgba(230, 180, 100, 0.25)',
        ambientGradients: [
          'radial-gradient(circle at 50% 20%, rgba(217, 155, 38, 0.22) 0%, rgba(13, 9, 5, 0.95) 75%)',
          'radial-gradient(circle at 80% 80%, rgba(180, 100, 20, 0.2) 0%, transparent 60%)',
        ],
        contrastRatio: 13.0,
      },
      typography: {
        headerFontFamily: "'Cinzel', 'Georgia', serif",
        bodyFontFamily: "'Lora', serif",
        baseFontSizePx: 18,
        letterSpacing: '0.03em',
        lineHeight: 1.65,
      },
      shader: {
        fragmentShaderKey: 'GOLD_DUST',
        speed: 0.5,
        noiseScale: 1.5,
        intensity: 0.7,
        uniforms: { u_warmth: 1.0 },
      },
      audio: {
        stemKey: 'WARM_ACOUSTIC_CHORDS',
        bpm: 60,
        fadeInSeconds: 3,
        fadeOutSeconds: 3.5,
        lowPassCutoffHz: 12000,
        reverbMix: 0.4,
        frequencies: [146.83, 185.00, 220.00, 293.66, 369.99], // D3, F#3, A3, D4, F#4 (D Maj)
        scaleName: 'D Warm Major',
        waveform: 'sine',
      },
      gesture: {
        gestureType: 'WAX_SEAL',
        type: 'WAX_SEAL',
        triggerPromptText: 'Press & hold to break the golden seal',
        instructions: 'Hold your finger steady to release the memory',
        completionFeedbackStyle: 'GOLDEN_BURST',
      },
      particles: {
        type: 'gold_dust',
        density: 30,
        speed: 0.35,
      },
      outroMessage: 'Everything I am or hope to be, I owe to your boundless warmth.',
    };
  }

  // 3. FATHER (Slate Silver & Quiet Strength)
  if (relLower.includes('father') || relLower.includes('dad') || relLower.includes('papa')) {
    return {
      themeKey: 'SLATE_STRENGTH',
      displayName: 'Father',
      relationshipTagline: 'Honoring quiet strength, guidance & wisdom',
      colors: {
        background: '#060a12',
        surfaceGlass: 'rgba(220, 235, 255, 0.06)',
        primaryText: '#f0f6ff',
        secondaryText: '#94a3b8',
        accentGlow: '#38bdf8',
        borderGlass: 'rgba(148, 163, 184, 0.25)',
        ambientGradients: [
          'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.18) 0%, rgba(6, 10, 18, 0.96) 80%)',
          'radial-gradient(circle at 20% 70%, rgba(30, 58, 138, 0.25) 0%, transparent 60%)',
        ],
        contrastRatio: 12.8,
      },
      typography: {
        headerFontFamily: "'Cormorant Garamond', 'Georgia', serif",
        bodyFontFamily: "'Inter', sans-serif",
        baseFontSizePx: 17,
        letterSpacing: '0.04em',
        lineHeight: 1.6,
      },
      shader: {
        fragmentShaderKey: 'STARLIGHT',
        speed: 0.4,
        noiseScale: 2.0,
        intensity: 0.65,
        uniforms: { u_slateGlow: 1.0 },
      },
      audio: {
        stemKey: 'STEADY_CELLO_PAD',
        bpm: 56,
        fadeInSeconds: 2.5,
        fadeOutSeconds: 3,
        lowPassCutoffHz: 10000,
        reverbMix: 0.35,
        frequencies: [110.00, 164.81, 220.00, 261.63, 329.63], // A2, E3, A3, C4, E4 (A Minor 9)
        scaleName: 'A Minor 9',
        waveform: 'sine',
      },
      gesture: {
        gestureType: 'HERITAGE_LOCKET',
        type: 'HERITAGE_LOCKET',
        triggerPromptText: 'Hold key emblem to unlock memory box',
        instructions: 'Touch & hold to open the keepsake chest',
        completionFeedbackStyle: 'SILVER_SHIMMER',
      },
      particles: {
        type: 'stars',
        density: 20,
        speed: 0.25,
      },
      outroMessage: 'Thank you for standing as a steady beacon through every season of life.',
    };
  }

  // 4. BEST FRIEND (Sunlit Nostalgia & Midnight Starlight)
  if (relLower.includes('friend') || relLower.includes('bestie') || relLower.includes('pal') || relLower.includes('mate') || relLower.includes('buddy')) {
    return {
      themeKey: 'SUNLIT_NOSTALGIA',
      displayName: 'Best Friend',
      relationshipTagline: 'To the one who knows all your stories and shared every step',
      colors: {
        background: '#090914',
        surfaceGlass: 'rgba(235, 230, 255, 0.08)',
        primaryText: '#f8f7ff',
        secondaryText: '#c4b5fd',
        accentGlow: '#a855f7',
        borderGlass: 'rgba(168, 85, 247, 0.25)',
        ambientGradients: [
          'radial-gradient(circle at 50% 25%, rgba(168, 85, 247, 0.22) 0%, rgba(9, 9, 20, 0.95) 75%)',
          'radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.2) 0%, transparent 60%)',
        ],
        contrastRatio: 12.0,
      },
      typography: {
        headerFontFamily: "'Outfit', 'Helvetica Neue', sans-serif",
        bodyFontFamily: "'Plus Jakarta Sans', sans-serif",
        baseFontSizePx: 17,
        letterSpacing: '0.01em',
        lineHeight: 1.55,
      },
      shader: {
        fragmentShaderKey: 'AURORA',
        speed: 0.8,
        noiseScale: 1.6,
        intensity: 0.8,
        uniforms: { u_friendshipPulse: 1.0 },
      },
      audio: {
        stemKey: 'CELEBRATION_STRINGS',
        bpm: 72,
        fadeInSeconds: 2,
        fadeOutSeconds: 2.5,
        lowPassCutoffHz: 16000,
        reverbMix: 0.5,
        frequencies: [196.00, 246.94, 293.66, 392.00, 493.88], // G3, B3, D4, G4, B4 (G Major)
        scaleName: 'G Major Bright',
        waveform: 'triangle',
      },
      gesture: {
        gestureType: 'MEMORY_CANDLE',
        type: 'MEMORY_CANDLE',
        triggerPromptText: 'Hold to ignite the memory flame',
        instructions: 'Touch & hold the match to kindle the spark',
        completionFeedbackStyle: 'CELESTIAL_SPARKLE',
      },
      particles: {
        type: 'bokeh',
        density: 28,
        speed: 0.45,
      },
      outroMessage: 'Here is to every late-night conversation, every shared laugh, and the adventures yet to come.',
    };
  }

  // 5. SISTER / BROTHER / SIBLING (Rose Quartz / Electric Starlight)
  if (relLower.includes('sister') || relLower.includes('brother') || relLower.includes('sibling')) {
    return {
      themeKey: 'ROSE_QUARTZ',
      displayName: relationshipRaw || 'Sibling',
      relationshipTagline: 'Connected by shared roots and unforgettable memories',
      colors: {
        background: '#0b0610',
        surfaceGlass: 'rgba(255, 235, 245, 0.08)',
        primaryText: '#fff5f9',
        secondaryText: '#e8b4cb',
        accentGlow: '#ec4899',
        borderGlass: 'rgba(236, 72, 153, 0.25)',
        ambientGradients: [
          'radial-gradient(circle at 40% 30%, rgba(236, 72, 153, 0.2) 0%, rgba(11, 6, 16, 0.95) 75%)',
          'radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.2) 0%, transparent 60%)',
        ],
        contrastRatio: 12.2,
      },
      typography: {
        headerFontFamily: "'Playfair Display', serif",
        bodyFontFamily: "'Inter', sans-serif",
        baseFontSizePx: 17,
        letterSpacing: '0.02em',
        lineHeight: 1.6,
      },
      shader: {
        fragmentShaderKey: 'WATERCOLOR',
        speed: 0.7,
        noiseScale: 1.4,
        intensity: 0.7,
        uniforms: { u_bloom: 1.0 },
      },
      audio: {
        stemKey: 'WARM_ACOUSTIC_CHORDS',
        bpm: 68,
        fadeInSeconds: 2,
        fadeOutSeconds: 2.5,
        lowPassCutoffHz: 14000,
        reverbMix: 0.4,
        frequencies: [164.81, 220.00, 261.63, 329.63, 392.00], // E3, A3, C4, E4, G4 (Am7)
        scaleName: 'A Minor 7 Harmonic',
        waveform: 'sine',
      },
      gesture: {
        gestureType: 'UNFOLD_PARCHMENT',
        type: 'UNFOLD_PARCHMENT',
        triggerPromptText: 'Tap to unfold the keepsakes',
        instructions: 'Touch the glowing corners to open',
        completionFeedbackStyle: 'BLOOM_BURST',
      },
      particles: {
        type: 'petals',
        density: 22,
        speed: 0.35,
      },
      outroMessage: 'No distance or time can ever alter the bond of our shared memories.',
    };
  }

  // 6. MENTOR (Emerald Wisdom & Gold)
  if (relLower.includes('mentor') || relLower.includes('teacher') || relLower.includes('guide') || relLower.includes('boss') || relLower.includes('coach')) {
    return {
      themeKey: 'EMERALD_WISDOM',
      displayName: 'Mentor',
      relationshipTagline: 'With sincere gratitude for direction, wisdom & belief',
      colors: {
        background: '#040d0a',
        surfaceGlass: 'rgba(230, 255, 245, 0.07)',
        primaryText: '#f0fdf4',
        secondaryText: '#86efac',
        accentGlow: '#10b981',
        borderGlass: 'rgba(16, 185, 129, 0.25)',
        ambientGradients: [
          'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.2) 0%, rgba(4, 13, 10, 0.96) 80%)',
          'radial-gradient(circle at 80% 80%, rgba(6, 78, 59, 0.3) 0%, transparent 60%)',
        ],
        contrastRatio: 13.5,
      },
      typography: {
        headerFontFamily: "'Cinzel Decorative', 'Georgia', serif",
        bodyFontFamily: "'Lora', serif",
        baseFontSizePx: 17,
        letterSpacing: '0.03em',
        lineHeight: 1.6,
      },
      shader: {
        fragmentShaderKey: 'GOLD_DUST',
        speed: 0.45,
        noiseScale: 1.7,
        intensity: 0.65,
        uniforms: { u_emeraldGlow: 1.0 },
      },
      audio: {
        stemKey: 'STEADY_CELLO_PAD',
        bpm: 54,
        fadeInSeconds: 3,
        fadeOutSeconds: 3,
        lowPassCutoffHz: 11000,
        reverbMix: 0.38,
        frequencies: [130.81, 164.81, 196.00, 261.63, 329.63], // C3, E3, G3, C4, E4
        scaleName: 'C Resonant Major',
        waveform: 'sine',
      },
      gesture: {
        gestureType: 'WAX_SEAL',
        type: 'WAX_SEAL',
        triggerPromptText: 'Press & hold to break the emerald seal',
        instructions: 'Hold your thumb to break the emblem seal',
        completionFeedbackStyle: 'EMERALD_GLOW',
      },
      particles: {
        type: 'gold_dust',
        density: 24,
        speed: 0.3,
      },
      outroMessage: 'Your guidance shaped paths I never thought possible. Thank you.',
    };
  }

  // 7. CHILD (Pastel Sunlight & Magic)
  if (relLower.includes('child') || relLower.includes('son') || relLower.includes('daughter') || relLower.includes('kid')) {
    return {
      themeKey: 'PASTEL_SUNLIGHT',
      displayName: relationshipRaw || 'Child',
      relationshipTagline: 'A little capsule of magic, wonder & infinite love',
      colors: {
        background: '#090d14',
        surfaceGlass: 'rgba(240, 248, 255, 0.09)',
        primaryText: '#f8fafc',
        secondaryText: '#bae6fd',
        accentGlow: '#38bdf8',
        borderGlass: 'rgba(56, 189, 248, 0.25)',
        ambientGradients: [
          'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.22) 0%, rgba(9, 13, 20, 0.95) 75%)',
          'radial-gradient(circle at 20% 70%, rgba(251, 146, 60, 0.18) 0%, transparent 60%)',
        ],
        contrastRatio: 12.5,
      },
      typography: {
        headerFontFamily: "'Outfit', sans-serif",
        bodyFontFamily: "'Plus Jakarta Sans', sans-serif",
        baseFontSizePx: 18,
        letterSpacing: '0.02em',
        lineHeight: 1.6,
      },
      shader: {
        fragmentShaderKey: 'EMBERS',
        speed: 0.7,
        noiseScale: 1.5,
        intensity: 0.75,
        uniforms: { u_sunlight: 1.0 },
      },
      audio: {
        stemKey: 'CELEBRATION_STRINGS',
        bpm: 76,
        fadeInSeconds: 2,
        fadeOutSeconds: 2,
        lowPassCutoffHz: 16000,
        reverbMix: 0.45,
        frequencies: [261.63, 329.63, 392.00, 523.25, 659.25], // C4, E4, G4, C5, E5
        scaleName: 'C Sparkle Pentatonic',
        waveform: 'sine',
      },
      gesture: {
        gestureType: 'MEMORY_CANDLE',
        type: 'MEMORY_CANDLE',
        triggerPromptText: 'Hold to light up the memory star',
        instructions: 'Touch & hold to ignite the magical spark',
        completionFeedbackStyle: 'MAGIC_SPARKLE',
      },
      particles: {
        type: 'bokeh',
        density: 30,
        speed: 0.5,
      },
      outroMessage: 'Watching you grow is the greatest joy of my life.',
    };
  }

  // 8. GRANDPARENT (Vintage Heritage & Warm Amber)
  if (relLower.includes('grand') || relLower.includes('nana') || relLower.includes('grandma') || relLower.includes('grandpa') || relLower.includes('pop')) {
    return {
      themeKey: 'VINTAGE_HERITAGE',
      displayName: relationshipRaw || 'Grandparent',
      relationshipTagline: 'Tethered to warm stories, wisdom, and timeless love',
      colors: {
        background: '#0c0805',
        surfaceGlass: 'rgba(255, 240, 220, 0.08)',
        primaryText: '#fffaf0',
        secondaryText: '#e2c59b',
        accentGlow: '#d97706',
        borderGlass: 'rgba(217, 119, 6, 0.25)',
        ambientGradients: [
          'radial-gradient(circle at 50% 25%, rgba(217, 119, 6, 0.2) 0%, rgba(12, 8, 5, 0.96) 80%)',
          'radial-gradient(circle at 75% 75%, rgba(146, 64, 14, 0.25) 0%, transparent 60%)',
        ],
        contrastRatio: 13.0,
      },
      typography: {
        headerFontFamily: "'Cormorant Garamond', serif",
        bodyFontFamily: "'Lora', serif",
        baseFontSizePx: 18,
        letterSpacing: '0.03em',
        lineHeight: 1.65,
      },
      shader: {
        fragmentShaderKey: 'EMBERS',
        speed: 0.4,
        noiseScale: 1.6,
        intensity: 0.6,
        uniforms: { u_fireplace: 1.0 },
      },
      audio: {
        stemKey: 'WARM_ACOUSTIC_CHORDS',
        bpm: 52,
        fadeInSeconds: 3,
        fadeOutSeconds: 3,
        lowPassCutoffHz: 11000,
        reverbMix: 0.4,
        frequencies: [130.81, 164.81, 196.00, 246.94, 329.63],
        scaleName: 'C Heritage Warmth',
        waveform: 'sine',
      },
      gesture: {
        gestureType: 'HERITAGE_LOCKET',
        type: 'HERITAGE_LOCKET',
        triggerPromptText: 'Hold to open the vintage locket',
        instructions: 'Touch & hold to open the keepsake locket',
        completionFeedbackStyle: 'GOLDEN_GLOW',
      },
      particles: {
        type: 'embers',
        density: 22,
        speed: 0.25,
      },
      outroMessage: 'Your legacy of love continues to illuminate our family generation after generation.',
    };
  }

  // 9. DEFAULT / CUSTOM (Celestial Twilight)
  return {
    themeKey: 'CELESTIAL_TWILIGHT',
    displayName: relationshipRaw || 'Special Someone',
    relationshipTagline: 'A personal story created especially for you',
    colors: fallbackColors || {
      background: '#090d16',
      surfaceGlass: 'rgba(255, 255, 255, 0.08)',
      primaryText: '#ffffff',
      secondaryText: '#94a3b8',
      accentGlow: '#6366f1',
      borderGlass: 'rgba(255, 255, 255, 0.15)',
      ambientGradients: [
        'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.2) 0%, rgba(9, 13, 22, 0.96) 80%)',
        'radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)',
      ],
      contrastRatio: 12.0,
    },
    typography: fallbackTypography || {
      headerFontFamily: "'Playfair Display', 'Georgia', serif",
      bodyFontFamily: "'Plus Jakarta Sans', sans-serif",
      baseFontSizePx: 17,
      letterSpacing: '0.02em',
      lineHeight: 1.6,
    },
    shader: {
      fragmentShaderKey: 'AURORA',
      speed: 0.6,
      noiseScale: 1.6,
      intensity: 0.7,
      uniforms: {},
    },
    audio: {
      stemKey: 'CELEBRATION_STRINGS',
      bpm: 64,
      fadeInSeconds: 2.5,
      fadeOutSeconds: 3,
      lowPassCutoffHz: 14000,
      reverbMix: 0.4,
      frequencies: [146.83, 196.00, 220.00, 293.66, 369.99],
      scaleName: 'D Celestial',
      waveform: 'sine',
    },
    gesture: {
      gestureType: 'WAX_SEAL',
      type: 'WAX_SEAL',
      triggerPromptText: 'Press & hold to break seal',
      instructions: 'Hold finger on the seal to reveal your story',
      completionFeedbackStyle: 'STARLIGHT_BURST',
    },
    particles: {
      type: 'stars',
      density: 25,
      speed: 0.3,
    },
    outroMessage: 'Thank you for taking a moment to experience this story.',
  };
}
