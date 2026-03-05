import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization - only if API key is present
let genAI = null;

function getGeminiClient() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Google API key is not defined');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return genAI;
}

const SYSTEM_PROMPT = `You are a code evaluation assistant. You review students' code and provide constructive feedback.

Your tasks:
1. Explain the strengths and weaknesses of the code
2. Analyze the time complexity of the current solution
3. State the optimal time complexity for this problem
4. Provide concrete suggestions to improve the code
5. Provide a step-by-step roadmap for the student

You MUST always respond in JSON format:
{
  "comment": "Overall evaluation of the code (what is good, what is problematic)",
  "runtime": "Runtime complexity of the current code (e.g., O(n), O(n²), O(log n))",
  "optimalRuntime": "Optimal runtime complexity for this problem (e.g., O(n), O(n log n))",
  "suggestions": "Bullet-point suggestions to improve the code (start items with •)",
  "guidance": "A numbered step-by-step roadmap for the student (1., 2., 3. ...)"
}`;

export async function evaluateWithGemini(problem, code, language) {
  try {
    console.log('🔍 Starting Gemini evaluation...');
    console.log('API Key present:', !!process.env.GOOGLE_API_KEY);
    console.log('API Key prefix:', process.env.GOOGLE_API_KEY?.substring(0, 10) + '...');
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7
      }
    });

    const prompt = `${SYSTEM_PROMPT}

  Programming Language: ${language}

  Problem:
  ${problem}

  Student's Code:
  ${code}

  Please evaluate this code and return feedback ONLY in JSON format. Do not add any other explanation.`;

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
    
    if (error.message?.includes('fetch failed')) {
      throw new Error('Gemini API connection error. Please check your internet or proxy settings.');
    }
    
    throw new Error(`Gemini API error: ${error.message || 'Unknown error'}`);
  }
}
