# AI Misinformation Analyzer (MIA)

A premium real-time news credibility analyzer powered by Gemini AI.

## Project Structure

- `client/`: React + Vite frontend dashboard.
- `server/`: Express backend API for credibility analysis.
- `tools/`: Utility scripts and smoke tests.
- `archive/`: Legacy build files and archives.

## Getting Started

1.  **Install Dependencies**:
    `npm run install:all`
2.  **Configuration**:
    - Create a `.env` file in the root.
    - Set `API_KEY` (Gemini) and `GNEWS_API_KEY`.
3.  **Run Development Servers**:
    - Frontend: `npm run dev:client`
    - Backend: `npm run dev:server`

## Deployment

- **Frontend**: Deployed on **Vercel**.
- **Backend**: Deployed on **Render**.

> [!IMPORTANT]
> Ensure `VITE_BACKEND_URL` is set in Vercel to point to your Render backend.
