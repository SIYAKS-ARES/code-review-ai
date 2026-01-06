import OpenAI from 'openai';

// Lazy initialization - sadece API key varsa
let openai = null;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key tanımlı değil');
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
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

export async function evaluateWithOpenAI(problem, code, language) {
  const userPrompt = `
Programlama Dili: ${language}

Problem:
${problem}

Öğrencinin Kodu:
${code}

Lütfen bu kodu değerlendir ve JSON formatında geri bildirim ver.`;

  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const response = completion.choices[0].message.content;
  return JSON.parse(response);
}
