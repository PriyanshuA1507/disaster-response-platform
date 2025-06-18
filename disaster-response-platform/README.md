Disaster Response Coordination Platform

A backend-heavy MERN stack app for disaster response, featuring real-time updates, geospatial queries, social media aggregation, and image verification.

## Features
- Disaster CRUD with audit trail and ownership
- Location extraction (Google Gemini API) and geocoding (Mapbox/Google Maps/OSM)
- Real-time social media monitoring (mocked)
- Geospatial resource mapping (Supabase/PostGIS)
- Official updates aggregation (mocked)
- Image verification (Google Gemini API, mocked)
- Supabase caching for API responses
- Real-time updates via Socket.IO
- Minimal React frontend for testing

## Tech Stack
- Node.js, Express.js, Socket.IO
- Supabase (PostgreSQL, PostGIS)
- React (frontend)
- Google Gemini API, Mapbox (or Google Maps/OSM)

## Setup Instructions

### 1. Supabase Setup
- Create a free project at [supabase.com](https://supabase.com)
- In the SQL editor, run the contents of `supabase/schema.sql` to create tables and functions
- Get your Supabase URL and anon key from Project Settings > API

### 2. Backend Setup
```bash
cd backend
cp .env.example .env # or create .env manually
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY, MAPBOX_API_KEY
npm install
node src/index.js
```
- The backend runs on `http://localhost:4000` by default

#### .env Example
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
MAPBOX_API_KEY=your_mapbox_api_key
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Use your favorite dev server, e.g.:
npx serve -s public # or use Vite/CRA/Parcel
```
- The frontend expects the backend at `http://localhost:4000` (change in `src/App.js` if needed)

### 4. Usage
- Use the UI to create disasters, submit/view reports, add/query resources, verify images, and see real-time updates.
- All backend APIs are available for testing via Postman/curl as well.

### 5. Deployment
- Deploy backend to [Render](https://render.com) or similar Node.js host
- Deploy frontend to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Set environment variables in your deployment dashboard

## Notes
- Social media, official updates, and image verification are mocked for demo (replace with real API keys and logic as needed)
- Caching is handled via Supabase `cache` table (TTL: 1 hour)
- Geospatial queries use a Postgres function (`nearby_resources`)
- Mock authentication: use `x-user` header with values like `netrunnerX`, `reliefAdmin`, `citizen1`


Build fast, test thoroughly, and help coordinate disaster response! 🚀 
