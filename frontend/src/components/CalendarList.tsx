import { useEffect, useState } from 'react'
import { useCalendarStore } from '../store/calendarStore'
import { calendarAPI } from '../services/api'
import { Calendar, CalendarCreate } from '../types'
import './CalendarList.css'

const CalendarList = () => {
  const { calendars, selectedCalendarIds, toggleCalendarSelection, addCalendar, removeCalendar } = useCalendarStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CalendarCreate>({
    name: '',
    description: '',
    color: '#3b82f6',
    is_visible: true,
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newCalendar = await calendarAPI.create(formData)
      addCalendar(newCalendar)
      setFormData({ name: '', description: '', color: '#3b82f6', is_visible: true })
      setShowForm(false)
    } catch (error) {
      console.error('Error creating calendar:', error)
      alert('Failed to create calendar')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this calendar? All events will be deleted.')) {
      return
    }
    try {
      await calendarAPI.delete(id)
      removeCalendar(id)
    } catch (error) {
      console.error('Error deleting calendar:', error)
      alert('Failed to delete calendar')
    }
  }

  return (
    <div className="calendar-list">
      <div className="calendar-list-header">
        <h3>Calendars</h3>
        <button onClick={() => setShowForm(!showForm)} className="add-calendar-btn">
          +
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="calendar-form">
          <input
            type="text"
            placeholder="Calendar name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="color-input">
            <label>Color:</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="calendars">
        {calendars.map((calendar) => (
          <div key={calendar.id} className="calendar-item">
            <label className="calendar-checkbox">
              <input
                type="checkbox"
                checked={selectedCalendarIds.includes(calendar.id)}
                onChange={() => toggleCalendarSelection(calendar.id)}
              />
              <span
                className="calendar-color"
                style={{ backgroundColor: calendar.color }}
              />
              <span className="calendar-name">{calendar.name}</span>
            </label>
            <button
              onClick={() => handleDelete(calendar.id)}
              className="delete-btn"
              title="Delete calendar"
            >
              ×
            </button>
          </div>
        ))}
        {calendars.length === 0 && (
          <div className="no-calendars">No calendars yet. Create one to get started!</div>
        )}
      </div>
    </div>
  )
}

export default CalendarList

