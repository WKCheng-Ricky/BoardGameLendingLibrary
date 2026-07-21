// Games API client. Currently backed by an in-memory mock store
// (`mockGameStore.js`) since the Laravel Games API doesn't exist yet
// (BGLL-05). Every function here is async and returns/throws in a shape that
// mirrors a real REST client (`{ data }` on success, a thrown error with
// `status`/`errors` on failure), so once the real API ships, only the
// internals of this file need to change — components already call these
// functions and never touch the mock store directly.
import { CATEGORIES } from '../constants/game'
import {
  delay,
  findGame,
  getGames,
  insertGame,
  setGameStatus,
} from './mockGameStore'

export async function listGames() {
  await delay()
  return { data: [...getGames()] }
}

export async function createGame({ title, category }) {
  await delay()

  const errors = {}
  if (!title || !title.trim()) {
    errors.title = 'Title is required.'
  }
  if (!CATEGORIES.includes(category)) {
    errors.category = 'Please select a valid category.'
  }
  if (Object.keys(errors).length > 0) {
    const error = new Error('Validation failed')
    error.status = 422
    error.errors = errors
    throw error
  }

  const game = insertGame({ title: title.trim(), category })
  return { data: game }
}

export async function updateGameStatus(id, status) {
  await delay()

  const game = findGame(id)
  if (!game) {
    const error = new Error('Game not found')
    error.status = 404
    throw error
  }
  if (game.status === 'retired') {
    const error = new Error('Retired games cannot change status')
    error.status = 409
    throw error
  }

  const updated = setGameStatus(id, status)
  return { data: updated }
}
