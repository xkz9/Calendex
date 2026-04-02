# Calendar App MVP - Summary Plan

## Quick Overview
Windows-first desktop calendar app for Windows 11. Simple, focused MVP with core calendar functionality.

## Tech Stack
- **Frontend**: React + TypeScript (desktop-first design)
- **Backend**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (frontend), separate backend hosting

## MVP Features
✅ Multiple calendars (create, edit, delete, color coding)  
✅ Event CRUD (create, edit, delete events)  
✅ Calendar views (month, day, week, list)  
✅ Real-time data updates  

## Database Tables
- `calendars` - Calendar collections (no user association)
- `events` - Calendar events with date/time

## API Endpoints
**Calendars**: GET, POST, GET/{id}, PUT/{id}, DELETE/{id}  
**Events**: GET (with filters), POST, GET/{id}, PUT/{id}, DELETE/{id}  

## Development Timeline (4-5 weeks)

| Phase | Duration | Focus |
|-------|----------|-------|
| **Phase 1** | Week 1 | Project setup, basic structure |
| **Phase 2** | Week 1-2 | Backend API (calendars & events) |
| **Phase 3** | Week 2-3 | Frontend calendar management |
| **Phase 4** | Week 3-4 | Frontend events & calendar view |
| **Phase 5** | Week 4-5 | Polish, testing, deployment |

## Data Flow
1. **User Actions**: React → FastAPI → Supabase
2. **Display**: Supabase → FastAPI → React
3. **Real-time**: Supabase subscriptions for live updates

## Success Criteria
- ✅ Create/manage multiple calendars
- ✅ Full event CRUD operations
- ✅ Month view displays events correctly
- ✅ Works on Windows 11 desktop
- ✅ Responsive layout (can expand to fill screen)
- ✅ Real-time updates when data changes

## Post-MVP (Future)
- User authentication
- Offline functionality & sync
- Mobile support (Android)
- Holiday/study schedule chunks
- Recurring events
- Reminders/notifications
- Calendar sharing

