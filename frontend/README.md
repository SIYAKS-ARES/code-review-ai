# LLM-Based Code Evaluation System - Frontend

## Installation

```bash
npm install
```

## Running in Development

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build for Production

```bash
npm run build
```

## Changing the API URL

To change the backend API address:

1. **In development**: update the proxy settings in `vite.config.ts`:
   ```typescript
   proxy: {
     '/api': {
      target: 'http://localhost:8000', // Change this
       changeOrigin: true,
     }
   }
   ```

2. **In production**: change the `API_BASE_URL` constant in `src/api/client.ts`.

## Features

- ✅ Problem description and code input
- ✅ Python, Java, C++ language support
- ✅ Detailed feedback (issues, Socratic hints)
- ✅ Evaluation history (last 10 records)
- ✅ Persistence via LocalStorage
- ✅ Responsive design
- ✅ Fully English UI

## Technologies

- React 18
- TypeScript
- Vite
- React Router
- CSS Modules
- Fetch API
