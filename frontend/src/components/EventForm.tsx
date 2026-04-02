import { useState, useEffect } from 'react'
import { useCalendarStore } from '../store/calendarStore'
import { eventAPI } from '../services/api'
import { Event, EventCreate } from '../types'
import { format } from 'date-fns'
import './EventForm.css'

interface EventFormProps {
  event?: Event | null
  defaultDate?: Date | null
  onClose: () => void
}

const EventForm = ({ event, defaultDate, onClose }: EventFormProps) => {
  const { calendars, addEvent, updateEvent, removeEvent } = useCalendarStore()
  const [formData, setFormData] = useState<EventCreate>({
    calendar_id: calendars[0]?.id || '',
    title: '',
    description: '',
    start_time: defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    end_time: defaultDate ? format(new Date(defaultDate.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm") : format(new Date(Date.now() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
    all_day: false,
  })

  useEffect(() => {
    if (event) {
      setFormData({
        calendar_id: event.calendar_id,
        title: event.title,
        description: event.description || '',
        start_time: format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm"),
        end_time: format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm"),
        all_day: event.all_day,
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Convert datetime strings to full ISO 8601 format with timezone
      const startDate = new Date(formData.start_time)
      const endDate = new Date(formData.end_time)
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Invalid date format. Please check your start and end times.')
        return
      }
      
      const submitData = {
        ...formData,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      }
      
      console.log('Submitting event data:', submitData)  // Debug logging
      
      if (event) {
        const updated = await eventAPI.update(event.id, submitData)
        updateEvent(event.id, updated)
      } else {
        const newEvent = await eventAPI.create(submitData)
        addEvent(newEvent)
      }
      onClose()
    } catch (error) {
      console.error('Error saving event:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save event'
      alert(`Failed to save event: ${errorMessage}`)
    }
  }

  const handleDelete = async () => {
    if (!event || !confirm('Are you sure you want to delete this event?')) {
      return
    }
    try {
      await eventAPI.delete(event.id)
      removeEvent(event.id)
      onClose()
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    }
  }

  return (
    <div className="event-form-overlay" onClick={onClose}>
      <div className="event-form" onClick={(e) => e.stopPropagation()}>
        <div className="event-form-header">
          <h2>{event ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Calendar</label>
            <select
              value={formData.calendar_id}
              onChange={(e) => setFormData({ ...formData, calendar_id: e.target.value })}
              required
            >
              {calendars.map((cal) => (
                <option key={cal.id} value={cal.id}>
                  {cal.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.all_day}
                onChange={(e) => setFormData({ ...formData, all_day: e.target.checked })}
              />
              All day
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start</label>
              <input
                type={formData.all_day ? "date" : "datetime-local"}
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>End</label>
              <input
                type={formData.all_day ? "date" : "datetime-local"}
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            {event && (
              <button type="button" onClick={handleDelete} className="delete-btn">
                Delete
              </button>
            )}
            <div className="form-actions-right">
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm

