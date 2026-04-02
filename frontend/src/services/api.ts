const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `HTTP error! status: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const calendarAPI = {
  getAll: () => fetchAPI('/api/calendars'),
  getById: (id: string) => fetchAPI(`/api/calendars/${id}`),
  create: (data: any) => fetchAPI('/api/calendars', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/api/calendars/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/api/calendars/${id}`, { method: 'DELETE' }),
}

export const eventAPI = {
  getAll: (params?: { calendar_id?: string; start_date?: string; end_date?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.calendar_id) queryParams.append('calendar_id', params.calendar_id)
    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)
    const query = queryParams.toString()
    return fetchAPI(`/api/events${query ? `?${query}` : ''}`)
  },
  getById: (id: string) => fetchAPI(`/api/events/${id}`),
  create: (data: any) => fetchAPI('/api/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/api/events/${id}`, { method: 'DELETE' }),
}

