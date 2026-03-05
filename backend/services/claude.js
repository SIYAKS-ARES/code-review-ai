import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization - only if API key is present
let anthropic = null;

function getClaudeClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key is not defined');
  }
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return anthropic;
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

export async function evaluateWithClaude(problem, code, language) {
  const userPrompt = `
Programming Language: ${language}

Problem:
${problem}

Student's Code:
${code}

Please evaluate this code and return feedback in JSON format only.`;

  const client = getClaudeClient();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    temperature: 0.7,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: userPrompt }
    ]
  });

  // Claude may return the answer as a ```json ... ``` fenced code block,
  // so we try to clean it before attempting to parse as JSON.
  let responseText = message.content?.[0]?.text || '';
  responseText = responseText.trim();

  // 1) Direkt parse denemesi
  try {
    return JSON.parse(responseText);
  } catch {
    // 2) Try to extract JSON from ```json ... ``` or ``` ... ``` code blocks
    const fencedMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fencedMatch) {
      const fencedJson = fencedMatch[1].trim();
      try {
        return JSON.parse(fencedJson);
      } catch {
        // Devam et, bir sonraki stratejiyi dene
      }
    }

    // 3) Try to extract the first { ... } JSON object
    const objectMatch = responseText.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      const objectJson = objectMatch[0];
      try {
        return JSON.parse(objectJson);
      } catch {
        // Son asamada yine hata verilecek
      }
    }

    throw new Error('Claude response could not be parsed as JSON. Raw response: ' + responseText.slice(0, 300));
  }
}
