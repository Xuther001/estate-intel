# Estate Intelligence — Vietnam Housing Project Analyzer

A starter project for comparing residential developments in Vietnam, organized by developer in a collapsible left sidebar.

## Stack
- React + TypeScript + Vite
- Node.js + Express REST API
- JSON seed data
- Recharts
- Vercel-ready static frontend
- Optional Cloudflare Tunnel for exposing a locally running API
- GitHub for version control

## Requirements
Node.js 20+ and npm.

## Run locally
```bash
npm install
npm run dev
```
Frontend: http://localhost:5173  
API: http://localhost:4000/api/health

The frontend proxies `/api` to Express in development. The sample project and price data are illustrative and are not verified live market data.

## Data files
- `backend/data/developers.json`: developers and their project hierarchy
- `backend/data/price-history.json`: illustrative historical price observations

## API
- `GET /api/health`
- `GET /api/developers`
- `GET /api/projects`
- `GET /api/projects/:id`
- `GET /api/projects/:id/prices`
- `GET /api/compare?ids=vinhomes-central-park,vinhomes-grand-park`

## Deployment notes
### Vercel frontend
Import this repository into Vercel and set the project root to `frontend`. Build command: `npm run build`; output directory: `dist`. Set `VITE_API_BASE_URL` to the URL of your separately hosted API.

### Express backend
Vercel's standard filesystem is not persistent writable storage. This starter reads bundled JSON files and is intended for local development / read-only seed data. For production API hosting, deploy Express to a Node host with persistent storage, or adapt it to serverless functions and external persistent storage before enabling edits.

### Cloudflare Tunnel
Run Express locally (`npm run dev -w backend`) then use a tunnel to expose port 4000 for remote testing. Do not expose an unprotected write API publicly. This starter only provides read endpoints.

## Next steps
1. Replace sample metrics with sourced, dated listing / transaction data.
2. Add data import and validation.
3. Add authentication and persistent storage if multiple users need to edit data.
