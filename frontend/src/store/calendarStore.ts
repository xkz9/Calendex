import { create } from 'zustand'
import { Calendar, Event } from '../types'

interface CalendarState {
  calendars: Calendar[]
  events: Event[]
  selectedCalendarIds: string[]
  setCalendars: (calendars: Calendar[]) => void
  setEvents: (events: Event[]) => void
  addCalendar: (calendar: Calendar) => void
  updateCalendar: (id: string, calendar: Partial<Calendar>) => void
  removeCalendar: (id: string) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  removeEvent: (id: string) => void
  toggleCalendarSelection: (id: string) => void
}

export const useCalendarStore = create<CalendarState>((set) => ({
  calendars: [],
  events: [],
  selectedCalendarIds: [],
  
  setCalendars: (calendars) => set({ calendars }),
  setEvents: (events) => set({ events }),
  
  addCalendar: (calendar) => set((state) => ({
    calendars: [...state.calendars, calendar]
  })),
  
  updateCalendar: (id, updates) => set((state) => ({
    calendars: state.calendars.map((cal) =>
      cal.id === id ? { ...cal, ...updates } : cal
    )
  })),
  
  removeCalendar: (id) => set((state) => ({
    calendars: state.calendars.filter((cal) => cal.id !== id),
    selectedCalendarIds: state.selectedCalendarIds.filter((calId) => calId !== id)
  })),
  
  addEvent: (event) => set((state) => ({
    events: [...state.events, event]
  })),
  
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map((evt) =>
      evt.id === id ? { ...evt, ...updates } : evt
    )
  })),
  
  removeEvent: (id) => set((state) => ({
    events: state.events.filter((evt) => evt.id !== id)
  })),
  
  toggleCalendarSelection: (id) => set((state) => ({
    selectedCalendarIds: state.selectedCalendarIds.includes(id)
      ? state.selectedCalendarIds.filter((calId) => calId !== id)
      : [...state.selectedCalendarIds, id]
  })),
}))

