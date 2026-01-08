import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization - sadece API key varsa
let genAI = null;

function getGeminiClient() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Google API key tanımlı değil');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return genAI;
}

const SYSTEM_PROMPT = `Sen bir kod değerlendirme asistanısın. Öğrencilerin kodlarını incelersin ve yapıcı geri bildirimler verirsin.

Görevin:
1. Kodun güçlü ve zayıf yönlerini belirt
2. Kodun çalışma zamanı karmaşıklığını (time complexity) analiz et
3. Problem için optimal çözümün çalışma zamanını belirt
4. Somut iyileştirme önerileri sun
5. Öğrenci için adım adım yol haritası oluştur

MUTLAKA JSON formatında cevap ver:
{
  "comment": "Kodun genel değerlendirmesi (ne iyi, ne kötü)",
  "runtime": "Mevcut kodun çalışma zamanı (örn: O(n), O(n²), O(log n))",
  "optimalRuntime": "Bu problem için optimal çalışma zamanı (örn: O(n), O(n log n))",
  "suggestions": "Madde madde iyileştirme önerileri (• ile başlat)",
  "guidance": "Numaralandırılmış adım adım yol haritası (1., 2., 3. ...)"
}`;

export async function evaluateWithGemini(problem, code, language) {
  try {
    console.log('🔍 Gemini evaluation başlatılıyor...');
    console.log('API Key mevcut:', !!process.env.GOOGLE_API_KEY);
    console.log('API Key prefix:', process.env.GOOGLE_API_KEY?.substring(0, 10) + '...');
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7
      }
    });

    const prompt = `${SYSTEM_PROMPT}

Programlama Dili: ${language}

Problem:
${problem}

Öğrencinin Kodu:
${code}

Lütfen bu kodu değerlendir ve SADECE JSON formatında geri bildirim ver. Başka hiçbir açıklama ekleme.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // JSON parse et
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    let parsedData;
    
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[0]);
    } else {
      parsedData = JSON.parse(response);
    }
    
    // Virgülle ayrılmış listeyi düzgün formata çevir
    if (parsedData.suggestions && typeof parsedData.suggestions === 'string') {
      // Basit heuristic: Her ".,•" veya ", •" pattern'ini satır sonuna çevir
      parsedData.suggestions = parsedData.suggestions
        .replace(/\.,\s*•/g, '.\n\n•')  // "item.,• item" -> "item.\n\n• item"
        .replace(/,\s*•/g, '\n\n•');     // "item, • item" -> "item\n\n• item"
    }
    
    if (parsedData.guidance && typeof parsedData.guidance === 'string') {
      // Numaralandırılmış liste için: "item.,\d+" veya "item,\d+" pattern'ini satır sonuna çevir
      // Ama backtick içindeki code'ları korumak için önce backtick'leri placeholder'a çevir
      const codeBlocks = [];
      let processedGuidance = parsedData.guidance;
      
      // Code block'ları geçici olarak sakla
      processedGuidance = processedGuidance.replace(/`[^`]+`/g, (match) => {
        const index = codeBlocks.length;
        codeBlocks.push(match);
        return `__CODE_BLOCK_${index}__`;
      });
      
      // Şimdi güvenle virgüllerden ayır
      processedGuidance = processedGuidance
        .replace(/\.",\s*(\d+\.)/g, '."\n\n$1')  // Tırnak sonrası virgül ve numara
        .replace(/\.,\s*(\d+\.)/g, '.\n\n$1')    // Nokta+virgül sonrası numara
        .replace(/,\s*(\d+\.)/g, '\n\n$1');      // Virgül sonrası numara
      
      // Code block'ları geri koy
      codeBlocks.forEach((code, index) => {
        processedGuidance = processedGuidance.replace(`__CODE_BLOCK_${index}__`, code);
      });
      
      parsedData.guidance = processedGuidance;
    }
    
    return parsedData;
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error cause:', error.cause);
    
    // Daha detaylı hata mesajı
    if (error.message?.includes('fetch failed')) {
      throw new Error('Gemini API bağlantı hatası. İnternet bağlantınızı veya proxy ayarlarınızı kontrol edin.');
    }
    
    throw new Error(`Gemini API hatası: ${error.message || 'Bilinmeyen hata'}`);
  }
}
