# LLM Tabanlı Kod Değerlendirme Sistemi - Frontend

## Kurulum

```bash
npm install
```

## Geliştirme Ortamında Çalıştırma

```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açın.

## Üretim İçin Build

```bash
npm run build
```

## API URL Değiştirme

Backend API adresinizi değiştirmek için:

1. **Geliştirme ortamında**: `vite.config.ts` dosyasındaki proxy ayarlarını düzenleyin:
   ```typescript
   proxy: {
     '/api': {
       target: 'http://localhost:8000', // Burayı değiştirin
       changeOrigin: true,
     }
   }
   ```

2. **Üretim ortamında**: `src/api/client.ts` dosyasındaki `API_BASE_URL` sabitini değiştirin.

## Özellikler

- ✅ Problem tanımı ve kod girişi
- ✅ Python, Java, C++ dil desteği
- ✅ Detaylı geri bildirim (puan, sorunlar, Sokratik ipuçları)
- ✅ Değerlendirme geçmişi (son 10 kayıt)
- ✅ LocalStorage ile kalıcılık
- ✅ Responsive tasarım
- ✅ Tamamen Türkçe arayüz

## Teknolojiler

- React 18
- TypeScript
- Vite
- React Router
- CSS Modules
- Fetch API
