export interface PresentationContract {
  presetId: string;
  colors: {
    background: string;
    surfaceGlass: string;
    primaryText: string;
    secondaryText: string;
    accentGlow: string;
    borderGlass: string;
  };
  typography: {
    headerFontFamily: string;
    bodyFontFamily: string;
    baseFontSizePx: number;
    letterSpacing: string;
  };
  shader: {
    fragmentShaderKey: string;
    speed: number;
    noiseScale: number;
    intensity: number;
  };
  audio: {
    stemKey: string;
    bpm: number;
    fadeInSeconds: number;
    lowPassCutoffHz: number;
  };
}
