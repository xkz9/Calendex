@echo off
echo Creating .env files...

REM Create backend .env
(
echo SUPABASE_URL=https://irxenanijmutnnlxmprb.supabase.co
echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeGVuYW5pam11dG5ubHhtcHJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAxNjQwMywiZXhwIjoyMDg2NTkyNDAzfQ.o5Q3MmqAlKbHMcG_6ww35FqzFFKwAEPDV7qWVj_v-KE
) > backend\.env

REM Create frontend .env
(
echo VITE_SUPABASE_URL=https://irxenanijmutnnlxmprb.supabase.co
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeGVuYW5pam11dG5ubHhtcHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTY0MDMsImV4cCI6MjA4NjU5MjQwM30.gJ3cIfzZyb8RSeHMnhFYqiNPk2KbX0yYcH2r0_-NlGw
echo VITE_API_URL=http://localhost:8000
) > frontend\.env

echo .env files created successfully!
echo.
echo Backend .env: backend\.env
echo Frontend .env: frontend\.env
pause



