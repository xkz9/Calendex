from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import calendars, events

load_dotenv()

app = FastAPI(title="Calendar App API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
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

