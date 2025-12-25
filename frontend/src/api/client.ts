import { EvaluationRequest, EvaluationResponse, CompareModeResponse, SingleEvaluationResult } from '../types';

// Backend API base URL - değiştirmek için bu satırı düzenleyin
const API_BASE_URL = import.meta.env.PROD ? '' : '';

// Development mode: API olmadan mock data kullan
const USE_MOCK_DATA = true;

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

// Mock data generator - Basitleştirilmiş
function generateMockResult(modelId: string): SingleEvaluationResult {
  const mockResults: Record<string, SingleEvaluationResult> = {
    'gpt-4o': {
      comment: 'Kod çalışıyor ama daha iyi olabilir. Set kullanımı doğru, O(1) erişim sağlıyor. Ancak değişken isimleri daha açıklayıcı olabilir ve dokümantasyon eksik.',
      suggestions: `• Değişken isimlerini daha açıklayıcı yapın ("gorulen" yerine "gorulen_sayilar")
• Fonksiyona docstring ekleyin - ne yaptığını açıklayın
• Type hints kullanın (list[int] -> int)
• Boş dizi durumunu kontrol edin`,
      guidance: `1. Değişken isimlerini daha açıklayıcı yapın ("gorulen" yerine "gorulen_sayilar")
2. Fonksiyona docstring ekleyin - ne yaptığını açıklayın
3. Type hints kullanın (list[int] -> int)
4. Edge case'leri düşünün (boş dizi, tek elemanlı dizi)
5. Kod okunabilirliğini artırmak için boşluklar ekleyin`
    },
    'gemini-1.5-pro': {
      comment: 'İyi bir çözüm! Algoritma doğru ve O(n) karmaşıklığında. Kod temiz ve anlaşılır. Sadece girdi doğrulaması eksik.',
      suggestions: `• Boş dizi durumunu kontrol edin (if not dizi: return -1)
• Fonksiyona kısa bir docstring ekleyin
• Type hints kullanarak type-safety sağlayın
• Test case'ler yazın (örn: assert ile)`,
      guidance: `1. Boş dizi durumunu kontrol edin
2. Fonksiyona kısa bir docstring ekleyin
3. Type hints kullanarak type-safety sağlayın
4. Test case'ler yazın
5. Kod yorumlarını gerekli yerlere ekleyin`
    },
    'claude-3.5-sonnet': {
      comment: 'Mükemmel çözüm! Algoritma optimal, kod temiz ve okunaklı. Minimal iyileştirme alanı var. Set kullanımı hem zaman hem mantık açısından doğru.',
      suggestions: `• Complexity analizi ekleyin (Time: O(n), Space: O(n))
• Test senaryoları yazın (assert kullanarak)
• Edge case'leri test edin (boş dizi, tek eleman, hiç tekrar yok)
• Gerekirse helper fonksiyonlar ekleyin`,
      guidance: `1. Complexity analizi yapın (Time: O(n), Space: O(n))
2. Test senaryoları ekleyin (assert kullanarak)
3. Edge case'leri belirleyin ve test edin
4. Kodunuzu daha modüler yapın (gerekirse helper fonksiyonlar)
5. Performance trade-off'ları düşünün`
    }
  };

  return mockResults[modelId] || mockResults['gpt-4o'];
}

function generateMockResponse(request: EvaluationRequest): EvaluationResponse {
  if (request.mode === 'compare') {
    const results: Record<string, SingleEvaluationResult> = {};
    
    request.models.forEach(modelId => {
      results[modelId] = generateMockResult(modelId);
    });
    
    return {
      mode: 'compare',
      results
    } as CompareModeResponse;
  } else {
    const modelId = request.models[0];
    return generateMockResult(modelId);
  }
}

export async function evaluateCode(
  request: EvaluationRequest
): Promise<EvaluationResponse> {
  // Development mode: mock data kullan
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockResponse(request));
      }, 800); // Simüle edilmiş gecikme
    });
  }

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
    } else {
      if (typeof data.score !== 'number') {
        throw new ApiError('Geçersiz yanıt formatı: puan eksik');
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
