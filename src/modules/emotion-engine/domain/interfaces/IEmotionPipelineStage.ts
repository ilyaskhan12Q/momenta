import { ExperiencePresentationContract } from '../contracts/ExperiencePresentationContract';
import { AnalyzerAnalysisResult } from './IEmotionAnalyzer';

export interface EmotionPipelineContext {
  experienceId: string;
  senderId: string;
  relationship: string;
  occasion: string;
  textBeats: string[];
  gestureType?: string;
  detectedLanguage?: string;
  contextMetadata?: Record<string, unknown>;
  analysisResult?: AnalyzerAnalysisResult;
  intensityScore?: number;
  presentationContract?: ExperiencePresentationContract;
}

export interface IEmotionPipelineStage {
  readonly name: string;
  process(context: EmotionPipelineContext): Promise<EmotionPipelineContext>;
}
