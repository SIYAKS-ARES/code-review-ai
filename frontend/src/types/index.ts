export type Language = 'python' | 'java' | 'cpp';
export type EvaluationMode = 'single' | 'compare';

export interface ModelInfo {
  id: string;
  name: string;
  available: boolean;
}

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
  runtime: string;           // Kodun çalışma zamanı (O(n), O(n²) vb.)
  optimalRuntime: string;    // Optimal çözümün çalışma zamanı
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
