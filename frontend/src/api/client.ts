import { EvaluationRequest, EvaluationResponse, CompareModeResponse, ModelInfo } from '../types';

// Backend API base URL
const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Backend'den mevcut modelleri al
export async function getAvailableModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        'Modeller yüklenemedi',
        response.status
      );
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Model listesi alınırken bir hata oluştu');
  }
}

export async function evaluateCode(
  request: EvaluationRequest
): Promise<EvaluationResponse> {

  try {
    const response = await fetch(`${API_BASE_URL}/api/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      let errorMessage = 'Sunucu hatası';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new ApiError(errorMessage, response.status);
    }

    const data = await response.json();

    // Validate response structure based on mode
    if (request.mode === 'compare') {
      const compareData = data as CompareModeResponse;
      if (compareData.mode !== 'compare' || !compareData.results) {
        throw new ApiError('Geçersiz yanıt formatı: karşılaştırma sonuçları eksik');
      }
    }

    return data as EvaluationResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network errors or other exceptions
    if (error instanceof TypeError) {
      throw new ApiError(
        'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.'
      );
    }

    throw new ApiError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
  }
}
