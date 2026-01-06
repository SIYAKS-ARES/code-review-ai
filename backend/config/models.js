// Model konfigürasyonu
export const MODELS = [
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    envKey: 'OPENAI_API_KEY'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Google Gemini 2.5 Flash',
    provider: 'google',
    envKey: 'GOOGLE_API_KEY'
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    provider: 'anthropic',
    envKey: 'ANTHROPIC_API_KEY'
  }
];

// Model availability kontrolü
export function getAvailableModels() {
  return MODELS.map(model => {
    const apiKey = process.env[model.envKey];
    // Placeholder veya boş değerleri geçersiz say
    const isValid = apiKey && 
                   apiKey.trim() !== '' && 
                   !apiKey.includes('your_') && 
                   !apiKey.includes('_here');
    
    return {
      id: model.id,
      name: model.name,
      available: !!isValid
    };
  });
}

// Model bilgisini al
export function getModelConfig(modelId) {
  return MODELS.find(m => m.id === modelId);
}
