from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import calendars, events

load_dotenv()

app = FastAPI(title="Calendar App API")

# Public JSON API: no cookies — allow any origin so Vercel/mobile always pass CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(calendars.router)
app.include_router(events.router)

@app.get("/")
def read_root():
    return {"message": "Calendar App API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

