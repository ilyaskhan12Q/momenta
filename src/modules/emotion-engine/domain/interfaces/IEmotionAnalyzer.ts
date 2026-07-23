export interface AnalyzerAnalysisResult {
  primaryEmotion: string;
  secondaryEmotion: string;
  confidence: number;
  emotionScores: Record<string, number>;
  valence: number;
  arousal: number;
  dominance: number;
}

export interface IEmotionAnalyzer {
  readonly id: string;
  analyze(textBeats: string[], relationship: string, occasion: string): Promise<AnalyzerAnalysisResult>;
}
