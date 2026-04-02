# Calendar App MVP Plan

## Project Overview

A Windows-first desktop calendar app for Windows 11. The MVP focuses on core calendar functionality with multiple calendars and event management. Authentication and offline functionality will be added in future iterations.

### Key Requirements
- **Platforms**: Windows 11 (desktop-first, responsive to fill screen)
- **Architecture**: React frontend, FastAPI backend, Supabase database
- **Hosting**: Vercel for frontend deployment
- **MVP Scope**: Multiple calendars and event scheduling (CRUD operations)
- **Not in MVP**: User authentication, offline functionality, mobile support

## Tech Stack

### Frontend
- **Framework**: React (with TypeScript recommended)
- **State Management**: Context API or Zustand
- **UI Library**: Material-UI or Tailwind CSS (desktop-first, responsive)
- **Date Handling**: date-fns or dayjs

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **API**: RESTful API with real-time subscriptions (Supabase Realtime)

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Vercel (serverless functions) or separate Python hosting (Railway, Render, etc.)
- **Database**: Supabase (managed PostgreSQL)

## MVP Features

### Core Functionality
1. **Multiple Calendars**
   - Create, edit, delete calendars
   - Calendar color coding
   - Calendar visibility toggle
   - Basic calendar metadata (name, description, color)

2. **Event Management (CRUD)**
   - Create events with:
     - Title
     - Date and time (start/end)
     - Calendar assignment
     - Optional description
   - Edit existing events
   - Delete events
   - View events in calendar grid/list views

3. **Calendar Views**
   - Month view (primary for MVP)
   - Day view
   - Week view (optional for MVP)
   - List/Agenda view

4. **Real-time Updates**
   - Live updates when data changes (Supabase Realtime)
   - No page refresh needed

## Architecture Overview

### System Architecture
```
┌─────────────────┐
│   React App     │
│  (Frontend)     │
└────────┬────────┘
         │
         └───> FastAPI ───> Supabase
                    ↕
              (Real-time)
```

### Data Flow
1. **User Actions**:
   - User actions → React → FastAPI → Supabase
   - Real-time updates via Supabase subscriptions → React

2. **Data Display**:
   - Supabase → FastAPI → React
   - Live updates via Supabase Realtime subscriptions

## Database Schema (Supabase)

### Tables

#### `calendars`
- `id` (UUID, primary key)
- `name` (text)
- `description` (text, nullable)
- `color` (text, hex color code)
- `is_visible` (boolean, default true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `events`
- `id` (UUID, primary key)
- `calendar_id` (UUID, foreign key to calendars.id)
- `title` (text)
- `description` (text, nullable)
- `start_time` (timestamp)
- `end_time` (timestamp)
- `all_day` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable, for soft deletes)

### Indexes
- `events.calendar_id`
- `events.start_time`

## API Design (FastAPI)

### Endpoints

#### Calendars
- `GET /api/calendars` - List all calendars
- `POST /api/calendars` - Create calendar
- `GET /api/calendars/{id}` - Get calendar details
- `PUT /api/calendars/{id}` - Update calendar
- `DELETE /api/calendars/{id}` - Delete calendar

#### Events
- `GET /api/events` - List events (with filters: calendar_id, start_date, end_date)
- `POST /api/events` - Create event
- `GET /api/events/{id}` - Get event details
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Response Format
```json
{
  "success": true,
  "data": {...},
  "error": null
}
```

## Frontend Structure

### Component Hierarchy
```
App
├── CalendarProvider (state management)
└── Main
    ├── CalendarView (Month/Day/Week/List)
    ├── EventForm (Create/Edit)
    ├── CalendarList (Manage calendars)
    └── Settings
```

### Key Components
1. **CalendarView**: Main calendar display (month/day/week/list)
2. **EventCard**: Individual event display
3. **EventForm**: Create/edit event modal/form
4. **CalendarSelector**: Multi-calendar selection and management

### State Management
- **Global State**: Calendar data, events, selected calendar
- **Local State**: UI state (modals, selected dates, filters)

## Real-time Updates Strategy

### Supabase Realtime
- Subscribe to `calendars` table changes
- Subscribe to `events` table changes
- Update React state when changes occur
- No polling needed - instant updates across all clients

## Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup (React, FastAPI, Supabase)
- [ ] Database schema creation
- [ ] FastAPI skeleton
- [ ] React app structure and routing
- [ ] Basic desktop-first styling

### Phase 2: Core Backend (Week 1-2)
- [ ] Calendar CRUD API endpoints
- [ ] Event CRUD API endpoints
- [ ] API testing (unit tests)
- [ ] Supabase integration and testing
- [ ] Supabase Realtime setup

### Phase 3: Frontend - Calendars (Week 2-3)
- [ ] Calendar list/management UI
- [ ] Calendar creation/edit forms
- [ ] Calendar API integration
- [ ] Desktop-first responsive styling

### Phase 4: Frontend - Events (Week 3-4)
- [ ] Calendar view component (month view)
- [ ] Event creation/edit forms
- [ ] Event display in calendar
- [ ] Event API integration
- [ ] Real-time updates integration

### Phase 5: Polish & Deployment (Week 4-5)
- [ ] Additional views (day, week, list)
- [ ] UI/UX improvements
- [ ] Error handling
- [ ] Loading states
- [ ] Testing (unit, integration)
- [ ] Vercel deployment setup
- [ ] Environment configuration
- [ ] Production testing

## Testing Strategy

### Backend Tests
- Unit tests for API endpoints
- Database operation tests

### Frontend Tests
- Component unit tests (React Testing Library)
- Integration tests for API calls
- Real-time update tests

## Deployment Plan

### Frontend (Vercel)
- Build React app
- Set environment variables (API URL, Supabase keys)
- Deploy to Vercel

### Backend (Options)
1. **Vercel Serverless Functions**: Convert FastAPI to serverless functions
2. **Separate Hosting**: Deploy FastAPI to Railway/Render/Fly.io
   - Recommended for MVP: Separate hosting for easier FastAPI deployment

### Database
- Supabase project setup
- Environment variables configuration
- Enable Realtime on `calendars` and `events` tables
- Backup strategy

### Environment Variables
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `API_URL` (backend URL)
- `ENVIRONMENT` (dev/staging/prod)

## Success Criteria (MVP)

1. ✅ User can create multiple calendars
2. ✅ User can create, edit, delete events
3. ✅ Events display correctly in month view
4. ✅ Real-time updates work (changes reflect immediately)
5. ✅ Works on Windows 11 desktop
6. ✅ Responsive layout (can expand to fill screen width)
7. ✅ All CRUD operations work correctly

## Post-MVP Features (Future)

- User authentication
- Offline functionality & sync
- Mobile support (Android)
- Holiday/study schedule chunks (block out date ranges)
- Recurring events
- Event reminders/notifications
- Event search
- Calendar sharing
- Week view improvements
- Drag-and-drop event editing
- Time zone support

## Notes

- Desktop-first design, optimize for Windows 11
- Focus on core CRUD operations first
- Use Supabase Realtime for efficient live updates
- Keep MVP simple - add complexity in future iterations

