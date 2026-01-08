# Code Review AI - Backend

Backend API for LLM-based code evaluation system.

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env

# .env dosyasına API key'leri ekle
```

## API Key'leri Alma

1. **OpenAI**: https://platform.openai.com/api-keys
2. **Google AI (Gemini)**: https://makersuite.google.com/app/apikey
3. **Anthropic (Claude)**: https://console.anthropic.com/

## Çalıştırma

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server şu adreste çalışacak: `http://localhost:8000`

## API Endpoints

### GET /api/health
Sunucu durumunu kontrol et

### GET /api/models
Mevcut modelleri ve kullanılabilirlik durumlarını listele

### POST /api/evaluate
Kod değerlendirmesi yap

**Request Body:**
```json
{
  "problem": "Problem açıklaması",
  "code": "Değerlendirilecek kod",
  "language": "python|java|cpp",
  "mode": "single|compare",
  "models": ["gpt-4o", "gemini-1.5-pro"]
}
```

**Response (Single Mode):**
```json
{
  "comment": "Kod değerlendirmesi",
  "suggestions": "İyileştirme önerileri",
  "guidance": "Adım adım yol haritası"
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
