# MIA News Analyzer (Client + Server)

Clean folder structure:
- `client/` (React + Vite UI)
- `server/` (Express API: `POST /analyze`)

## Run (separate local hosts)

1. Backend (port `5000`):
   - `npm run backend`
2. Frontend (port `3000`):
   - `npm run dev`

## Endpoints

- Backend Health: `http://localhost:5000/`
- Backend Analyze: `http://localhost:5000/analyze`

## Notes

- Gemini may rate-limit (429). The server falls back safely if Gemini fails.
