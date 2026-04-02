from fastapi import APIRouter, HTTPException
from typing import List
from supabase_client import get_supabase_client
from models import Calendar, CalendarCreate, CalendarUpdate
from uuid import UUID

router = APIRouter(prefix="/api/calendars", tags=["calendars"])

@router.get("", response_model=List[Calendar])
def get_calendars():
    """Get all calendars"""
    try:
        supabase = get_supabase_client()
        response = supabase.table("calendars").select("*").order("created_at", desc=False).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=Calendar, status_code=201)
def create_calendar(calendar: CalendarCreate):
    """Create a new calendar"""
    try:
        supabase = get_supabase_client()
        response = supabase.table("calendars").insert(calendar.model_dump()).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create calendar")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{calendar_id}", response_model=Calendar)
def get_calendar(calendar_id: UUID):
    """Get a specific calendar by ID"""
    try:
        supabase = get_supabase_client()
        response = supabase.table("calendars").select("*").eq("id", str(calendar_id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Calendar not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{calendar_id}", response_model=Calendar)
def update_calendar(calendar_id: UUID, calendar: CalendarUpdate):
    """Update a calendar"""
    try:
        supabase = get_supabase_client()
        update_data = {k: v for k, v in calendar.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_data["updated_at"] = "now()"
        response = supabase.table("calendars").update(update_data).eq("id", str(calendar_id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Calendar not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{calendar_id}", status_code=204)
def delete_calendar(calendar_id: UUID):
    """Delete a calendar"""
    try:
        supabase = get_supabase_client()
        response = supabase.table("calendars").delete().eq("id", str(calendar_id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Calendar not found")
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

