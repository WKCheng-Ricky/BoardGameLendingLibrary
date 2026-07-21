// Games API client — talks to the Laravel backend (`backend/routes/api.php`).
// Every function is async and returns/throws in a shape components rely on:
// `{ data }` on success, a thrown error with `status`/`errors` on failure.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

async function handleResponse(response) {
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(body?.message || 'Request failed')
    error.status = response.status
    if (body?.errors) error.errors = body.errors
    throw error
  }

  return body
}

export async function listGames({ status, title } = {}) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (title) params.set('title', title)

  const response = await fetch(`${API_BASE_URL}/games?${params.toString()}`)
  return handleResponse(response)
}

export async function createGame({ title, category }) {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ title, category }),
  })
  return handleResponse(response)
}

export async function updateGameStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/games/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ status }),
  })
  return handleResponse(response)
}
