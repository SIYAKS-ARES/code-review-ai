export type Language = 'python' | 'java' | 'cpp';
export type EvaluationMode = 'single' | 'compare';
export type ModelId = 'gpt-4o' | 'gemini-1.5-pro' | 'claude-3.5-sonnet';

export interface ModelInfo {
  id: ModelId;
  label: string;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  { id: 'gpt-4o', label: 'OpenAI GPT-4o' },
  { id: 'gemini-1.5-pro', label: 'Google Gemini 1.5 Pro' },
  { id: 'claude-3.5-sonnet', label: 'Anthropic Claude 3.5 Sonnet' },
];

export interface EvaluationRequest {
  problem: string;
  code: string;
  language: Language;
  mode: EvaluationMode;
  models: string[];
}

// Basitleştirilmiş sonuç yapısı
export interface SingleEvaluationResult {
  comment: string;           // LLM'in yorumu (ne iyi, ne kötü)
  suggestions: string;        // Kodu düzeltmek için tavsiyeler
  guidance: string;           // Yol haritası/yönlendirme
}

// Single mode response
export interface SingleModeResponse extends SingleEvaluationResult {}

// Compare mode response
export interface CompareModeResponse {
  mode: 'compare';
  results: {
    [modelId: string]: SingleEvaluationResult;
  };
}

export type EvaluationResponse = SingleModeResponse | CompareModeResponse;

export interface HistoryItem {
  id: string;
  timestamp: string;
  problem: string;
  code: string;
  language: Language;
  mode: EvaluationMode;
  models: string[];
  result: EvaluationResponse;
}
