export interface Calendar {
  id: string
  name: string
  description: string | null
  color: string
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  calendar_id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  all_day: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CalendarCreate {
  name: string
  description?: string | null
  color?: string
  is_visible?: boolean
}

export interface EventCreate {
  calendar_id: string
  title: string
  description?: string | null
  start_time: string
  end_time: string
  all_day?: boolean
}

