const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function formatDetail(detail: unknown): string {
  if (detail == null) return ''
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((e: { msg?: string }) => (typeof e?.msg === 'string' ? e.msg : JSON.stringify(e)))
      .join('; ')
  }
  if (typeof detail === 'object') return JSON.stringify(detail)
  return String(detail)
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  let response: Response
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error'
    throw new Error(
      `${msg} — check VITE_API_URL (${API_URL}) and that the API is reachable (HTTPS/CORS).`,
    )
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const detail = (body as { detail?: unknown }).detail
    throw new Error(
      formatDetail(detail) || `HTTP error! status: ${response.status}`,
    )
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

