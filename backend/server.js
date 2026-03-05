import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import evaluateRouter from './routes/evaluate.js';
import { getAvailableModels } from './config/models.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Code Review AI Backend',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      models: '/api/models',
      evaluate: 'POST /api/evaluate'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Get available models
app.get('/api/models', (req, res) => {
  const models = getAvailableModels();
  res.json({ models });
});

// Evaluation routes
app.use('/api', evaluateRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Code Review AI Backend`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Models: http://localhost:${PORT}/api/models`);
  console.log(`${'='.repeat(50)}\n`);
  
  // Show available models
  const models = getAvailableModels();
  console.log('📋 Model Status:\n');
  models.forEach(model => {
    const status = model.available ? '✅ ACTIVE' : '❌ INACTIVE';
    const apiKey = model.available ? 'API Key: ✓' : 'API Key: ✗';
    console.log(`   ${status} ${model.name}`);
    console.log(`      ${apiKey}\n`);
  });
  console.log(`${'='.repeat(50)}\n`);
});
