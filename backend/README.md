# Code Review AI - Backend

Backend API for LLM-based code evaluation system.

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add API keys to .env
```

## Getting API Keys

1. **OpenAI**: https://platform.openai.com/api-keys
2. **Google AI (Gemini)**: https://makersuite.google.com/app/apikey
3. **Anthropic (Claude)**: https://console.anthropic.com/

## Running

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

The server will run at: `http://localhost:8000`

## API Endpoints

### GET /api/health
Check server health

### GET /api/models
List available models and their availability

### POST /api/evaluate
Run code evaluation

**Request Body:**
```json
{
  "problem": "Problem description",
  "code": "Code to be evaluated",
  "language": "python|java|cpp",
  "mode": "single|compare",
  "models": ["gpt-4o", "gemini-1.5-pro"]
}
```

**Response (Single Mode):**
```json
{
  "comment": "Code review summary",
  "suggestions": "Improvement suggestions",
  "guidance": "Step-by-step roadmap"
}
```

**Response (Compare Mode):**
```json
{
  "mode": "compare",
  "results": {
    "gpt-4o": { "comment": "...", "suggestions": "...", "guidance": "..." },
    "gemini-1.5-pro": { "comment": "...", "suggestions": "...", "guidance": "..." }
  }
}
```
