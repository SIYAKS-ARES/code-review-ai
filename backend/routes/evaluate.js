import { Router } from 'express';
import { getModelConfig } from '../config/models.js';
import { evaluateWithOpenAI } from '../services/openai.js';
import { evaluateWithGemini } from '../services/gemini.js';
import { evaluateWithClaude } from '../services/claude.js';

const router = Router();

// POST /api/evaluate
router.post('/evaluate', async (req, res) => {
  try {
    const { problem, code, language, mode, models } = req.body;

    // Validation
    if (!problem || !code || !language || !models || models.length === 0) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'problem, code, language and models are required'
      });
    }

    // Single mode
    if (mode === 'single') {
      const modelId = models[0];
      const result = await evaluateWithModel(modelId, problem, code, language);
      return res.json(result);
    }

    // Compare mode
    if (mode === 'compare') {
      const results = {};
      
      // Run all models in parallel
      const promises = models.map(async (modelId) => {
        try {
          results[modelId] = await evaluateWithModel(modelId, problem, code, language);
        } catch (error) {
          results[modelId] = {
            comment: 'The model could not be executed',
            suggestions: error.message,
            guidance: 'Please check your API key configuration.'
          };
        }
      });

      await Promise.all(promises);

      return res.json({
        mode: 'compare',
        results
      });
    }

    return res.status(400).json({ error: 'Invalid mode' });

  } catch (error) {
    console.error('Evaluate error:', error);
    res.status(500).json({
      error: 'Evaluation error',
      message: error.message
    });
  }
});

// Model'e göre değerlendirme yap
async function evaluateWithModel(modelId, problem, code, language) {
  const config = getModelConfig(modelId);
  
  if (!config) {
    throw new Error(`Model not found: ${modelId}`);
  }

  if (!process.env[config.envKey]) {
    throw new Error(`API key is not defined for ${config.name}`);
  }

  switch (config.provider) {
    case 'openai':
      return await evaluateWithOpenAI(problem, code, language);
    case 'google':
      return await evaluateWithGemini(problem, code, language);
    case 'anthropic':
      return await evaluateWithClaude(problem, code, language);
    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}

export default router;
