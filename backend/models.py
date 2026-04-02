from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from uuid import UUID

class CalendarBase(BaseModel):
    name: str
    description: Optional[str] = None
    color: str = "#3b82f6"
    is_visible: bool = True

class CalendarCreate(CalendarBase):
    pass

class CalendarUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    is_visible: Optional[bool] = None

class Calendar(CalendarBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class EventBase(BaseModel):
    calendar_id: UUID
    title: str
    description: Optional[str] = None
    start_time: str  # ISO format string
    end_time: str  # ISO format string
    all_day: bool = False

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    calendar_id: Optional[UUID] = None
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[str] = None  # ISO format string
    end_time: Optional[str] = None  # ISO format string
    all_day: Optional[bool] = None

class Event(EventBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

