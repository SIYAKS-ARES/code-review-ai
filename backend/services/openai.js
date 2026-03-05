import OpenAI from 'openai';

// Lazy initialization - only if API key is present
let openai = null;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not defined');
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
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

export async function evaluateWithOpenAI(problem, code, language) {
  const userPrompt = `
Programming Language: ${language}

Problem:
${problem}

Student's Code:
${code}

Please evaluate this code and return feedback in JSON format only.`;

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
