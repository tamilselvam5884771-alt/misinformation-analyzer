# MIA Backend (News Analyzer)

Express server that:
1. Fetches related articles from **GNews**
2. Uses **Gemini** to produce a structured TRUE/FALSE verdict using the evidence
3. Returns clean JSON from `POST /analyze`

## Run

1. Install deps:
   `npm install`
2. Create `.env`:
   - Copy from `.env.example`
   - Set `API_KEY` and `GNEWS_API_KEY`
3. Start:
   `node app.cjs`

Server:
- Health: `GET http://localhost:5000/`
- Analyze: `POST http://localhost:5000/analyze`

