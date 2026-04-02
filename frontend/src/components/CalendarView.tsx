import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useCalendarStore } from '../store/calendarStore'
import { calendarAPI, eventAPI } from '../services/api'
import { supabase } from '../lib/supabase'
import { Event } from '../types'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns'
import CalendarList from './CalendarList'
import EventForm from './EventForm'
import './CalendarView.css'

const CalendarView = () => {
  const { calendars, events, setCalendars, setEvents, selectedCalendarIds } = useCalendarStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { calendarStart, calendarEnd } = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    return {
      calendarStart: startOfWeek(monthStart),
      calendarEnd: endOfWeek(monthEnd),
    }
  }, [currentDate])

  const visibleRangeRef = useRef({ calendarStart, calendarEnd })
  visibleRangeRef.current = { calendarStart, calendarEnd }

  const loadCalendars = useCallback(async () => {
    try {
      const calendarsData = await calendarAPI.getAll()
      setCalendars(calendarsData)
    } catch (error) {
      console.error('Error loading calendars:', error)
    }
  }, [setCalendars])

  const loadEventsForVisibleRange = useCallback(async () => {
    try {
      const { calendarStart: start, calendarEnd: end } = visibleRangeRef.current
      const eventsData = await eventAPI.getAll({
        start_date: startOfDay(start).toISOString(),
        end_date: endOfDay(end).toISOString(),
      })
      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }, [setEvents])

  const refreshFromServer = useCallback(async () => {
    await loadCalendars()
    await loadEventsForVisibleRange()
  }, [loadCalendars, loadEventsForVisibleRange])

  useEffect(() => {
    void loadCalendars()
  }, [loadCalendars])

  useEffect(() => {
    void loadEventsForVisibleRange()
  }, [calendarStart, calendarEnd, loadEventsForVisibleRange])

  useEffect(() => {
    try {
      const calendarsChannel = supabase
        .channel('calendars-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'calendars' }, () => {
          void refreshFromServer()
        })
        .subscribe()

      const eventsChannel = supabase
        .channel('events-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
          void refreshFromServer()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(calendarsChannel)
        supabase.removeChannel(eventsChannel)
      }
    } catch (error) {
      console.warn('Realtime not available, app will work with manual refresh:', error)
      return () => {}
    }
  }, [refreshFromServer])

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const visibleCalendars = calendars.filter(cal => 
    selectedCalendarIds.length === 0 || selectedCalendarIds.includes(cal.id)
  )

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      if (!visibleCalendars.some(cal => cal.id === event.calendar_id)) return false
      const eventStart = new Date(event.start_time)
      return format(eventStart, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    })
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setShowEventForm(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setSelectedDate(null)
    setShowEventForm(true)
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h1>Calendar</h1>
        <div className="calendar-controls">
          <button onClick={handlePreviousMonth}>←</button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={handleNextMonth}>→</button>
          <button onClick={() => setShowEventForm(true)} className="add-event-btn">
            + New Event
          </button>
        </div>
      </div>

      <div className="calendar-content">
        <div className="calendar-sidebar">
          <CalendarList />
        </div>

        <div className="calendar-main">
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {days.map(day => {
                const dayEvents = getEventsForDate(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isCurrentDay = isToday(day)

                return (
                  <div
                    key={day.toISOString()}
                    className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isCurrentDay ? 'today' : ''}`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="day-number">{format(day, 'd')}</div>
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map(event => {
                        const calendar = calendars.find(cal => cal.id === event.calendar_id)
                        return (
                          <div
                            key={event.id}
                            className="event-preview"
                            style={{ backgroundColor: calendar?.color || '#3b82f6' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEventClick(event)
                            }}
                          >
                            {event.title}
                          </div>
                        )
                      })}
                      {dayEvents.length > 3 && (
                        <div className="more-events">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {showEventForm && (
        <EventForm
          event={selectedEvent}
          defaultDate={selectedDate}
          onClose={() => {
            setShowEventForm(false)
            setSelectedEvent(null)
            setSelectedDate(null)
          }}
        />
      )}
    </div>
  )
}

export default CalendarView

