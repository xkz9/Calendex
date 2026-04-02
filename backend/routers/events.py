from fastapi import APIRouter, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from supabase_client import get_supabase_client
from models import Event, EventCreate, EventUpdate
from uuid import UUID
from datetime import datetime

router = APIRouter(prefix="/api/events", tags=["events"])

@router.get("", response_model=List[Event])
def get_events(
    calendar_id: Optional[str] = Query(None, description="Filter by calendar ID"),
    start_date: Optional[str] = Query(None, description="Filter events from this date (ISO format)"),
    end_date: Optional[str] = Query(None, description="Filter events until this date (ISO format)"),
):
    """Get all events with optional filters"""
    try:
        supabase = get_supabase_client()
        query = supabase.table("events").select("*").is_("deleted_at", "null")
        
        if calendar_id:
            query = query.eq("calendar_id", calendar_id)
        
        # Events overlapping [start_date, end_date] (inclusive window)
        if start_date:
            query = query.gte("end_time", start_date)
        if end_date:
            query = query.lte("start_time", end_date)
        
        response = query.order("start_time", desc=False).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=Event, status_code=201)
def create_event(event: EventCreate):
    """Create a new event"""
    try:
        supabase = get_supabase_client()
        event_data = event.model_dump()
        # Times are already strings from frontend
        print(f"Creating event with data: {event_data}")  # Debug logging
        
        response = supabase.table("events").insert(event_data).execute()
        if not response.data:
            print(f"Supabase response had no data: {response}")  # Debug logging
            raise HTTPException(status_code=400, detail="Failed to create event")
        
        # Convert all UUID objects to strings for JSON serialization
        result = dict(response.data[0])
        for key, value in result.items():
            if isinstance(value, UUID):
                result[key] = str(value)
        
        # Use Pydantic to validate
        event_model = Event.model_validate(result)
        # Use FastAPI's jsonable_encoder to ensure JSON serialization works
        return jsonable_encoder(event_model)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating event: {str(e)}")  # Debug logging
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{event_id}", response_model=Event)
def get_event(event_id: UUID):
    """Get a specific event by ID"""
    try:
        supabase = get_supabase_client()
        response = supabase.table("events").select("*").eq("id", str(event_id)).is_("deleted_at", "null").execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Event not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{event_id}", response_model=Event)
def update_event(event_id: UUID, event: EventUpdate):
    """Update an event"""
    try:
        supabase = get_supabase_client()
        update_data = {k: v for k, v in event.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Times are already strings from frontend if provided
        update_data["updated_at"] = "now()"
        response = supabase.table("events").update(update_data).eq("id", str(event_id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Event not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: UUID):
    """Delete an event (soft delete)"""
    try:
        supabase = get_supabase_client()
        update_data = {"deleted_at": datetime.utcnow().isoformat(), "updated_at": "now()"}
        response = supabase.table("events").update(update_data).eq("id", str(event_id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Event not found")
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

