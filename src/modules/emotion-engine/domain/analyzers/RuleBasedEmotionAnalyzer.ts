import { IEmotionAnalyzer, AnalyzerAnalysisResult } from '../interfaces/IEmotionAnalyzer';

export class RuleBasedEmotionAnalyzer implements IEmotionAnalyzer {
  readonly id = 'rule-based-v1';

  async analyze(textBeats: string[], relationship: string, occasion: string): Promise<AnalyzerAnalysisResult> {
    const text = textBeats.join(' ').toLowerCase();

    let romanceScore = 0.2;
    let warmthScore = 0.3;
    let solaceScore = 0.1;
    let joyScore = 0.2;

    if (/love|romance|darling|sweetheart|forever|kiss|heart/.test(text)) {
      romanceScore += 0.6;
    }
    if (/thank|warmth|memory|remember|cherish|friend|always/.test(text)) {
      warmthScore += 0.5;
    }
    if (/peace|solace|heal|gentle|comfort|quiet|rest/.test(text)) {
      solaceScore += 0.6;
    }
    if (/happy|celebrate|joy|cheer|party|yay|congrats|birthday/.test(text)) {
      joyScore += 0.6;
    }

    if (relationship === 'PARTNER') romanceScore += 0.2;
    if (occasion === 'ANNIVERSARY' || occasion === 'VALENTINE') romanceScore += 0.2;
    if (occasion === 'BIRTHDAY') joyScore += 0.2;

    const scores: Record<string, number> = {
      DEEP_ROMANCE: Math.min(1.0, romanceScore),
      NOSTALGIC_WARMTH: Math.min(1.0, warmthScore),
      SOLACE_COMFORT: Math.min(1.0, solaceScore),
      JOYFUL_BURST: Math.min(1.0, joyScore),
    };

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primaryEmotion = sorted[0][0];
    const secondaryEmotion = sorted[1][0];
    const topScore = sorted[0][1];

    return {
      primaryEmotion,
      secondaryEmotion,
      confidence: Number(Math.min(0.98, topScore + 0.1).toFixed(2)),
      emotionScores: scores,
      valence: primaryEmotion === 'SOLACE_COMFORT' ? 0.4 : 0.8,
      arousal: primaryEmotion === 'JOYFUL_BURST' ? 0.85 : 0.5,
      dominance: 0.6,
    };
  }
}
