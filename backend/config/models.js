// Model konfigürasyonu
export const MODELS = [
  {
    id: 'ChatGPT 5.2',
    name: 'ChatGPT 5.2',
    provider: 'openai',
    envKey: 'OPENAI_API_KEY'
  },
  {
    id: 'Gemini 3 Pro',
    name: 'Gemini 3 Pro',
    provider: 'google',
    envKey: 'GOOGLE_API_KEY'
  },
  {
    id: 'Claude 4.5 Sonnet',
    name: 'Claude 4.5 Sonnet',
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
