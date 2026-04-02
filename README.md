# Calendar App

A Windows-first desktop calendar application built with React, FastAPI, and Supabase.

## Project Structure

```
.
├── frontend/          # React + TypeScript frontend
├── backend/           # FastAPI Python backend
└── docs/              # Documentation

```

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on http://localhost:8000

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend `.env`
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Frontend `.env`
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:8000
```

## Database Setup

See `docs/MVP_PLAN.md` for database schema details.

