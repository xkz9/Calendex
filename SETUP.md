# Calendar App Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Supabase account

## Step 1: Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL schema from `backend/database/schema.sql`:
   - This creates the `calendars` and `events` tables
   - Sets up indexes and triggers
   - Enables Realtime subscriptions

4. Get your Supabase credentials:
   - Go to Project Settings > API
   - Copy the Project URL (SUPABASE_URL)
   - Copy the `anon` key (VITE_SUPABASE_ANON_KEY)
   - Copy the `service_role` key (SUPABASE_SERVICE_ROLE_KEY) - keep this secret!

5. Enable Realtime:
   - Go to Database > Replication
   - Enable replication for `calendars` and `events` tables

## Step 2: Backend Setup

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create `.env` file in `backend/`:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Run the backend:
```bash
uvicorn main:app --reload
```

Backend will run on http://localhost:8000

## Step 3: Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in `frontend/`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

Run the frontend:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Step 4: Verify Setup

1. Open http://localhost:3000 in your browser
2. You should see the calendar interface
3. Create a calendar using the sidebar
4. Click on a date to create an event
5. Events should appear in real-time when created/updated

## Troubleshooting

### Backend errors
- Check that `.env` file exists and has correct Supabase credentials
- Verify Supabase tables were created correctly
- Check that uvicorn is running on port 8000

### Frontend errors
- Check that `.env` file exists with correct values
- Verify backend is running and accessible
- Check browser console for errors

### Realtime not working
- Verify Realtime is enabled in Supabase dashboard
- Check that tables are added to Realtime publication
- Verify Supabase client is initialized correctly

## Project Structure

```
.
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service functions
│   │   ├── store/        # Zustand state management
│   │   └── lib/          # Supabase client
│   └── package.json
├── backend/               # FastAPI backend
│   ├── routers/          # API route handlers
│   ├── models.py         # Pydantic models
│   ├── main.py           # FastAPI app
│   └── requirements.txt
└── docs/                  # Documentation
```

## Next Steps

- Customize calendar colors and styling
- Add more calendar views (week, day, list)
- Implement additional features from the MVP plan

