import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization - sadece API key varsa
let anthropic = null;

function getClaudeClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key tanımlı değil');
  }
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return anthropic;
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

export async function evaluateWithClaude(problem, code, language) {
  const userPrompt = `
Programlama Dili: ${language}

Problem:
${problem}

Öğrencinin Kodu:
${code}

Lütfen bu kodu değerlendir ve JSON formatında geri bildirim ver.`;

  const client = getClaudeClient();
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    temperature: 0.7,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: userPrompt }
    ]
  });

  const response = message.content[0].text;
  return JSON.parse(response);
}
