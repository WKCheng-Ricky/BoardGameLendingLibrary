// In-memory stand-in for the (not yet built) Laravel Games API. Shaped to
// match the documented Game schema so swapping this for real HTTP calls in
// `api/games.js` later requires no changes to any component.

let games = [
  seed(1, 'Wingspan', 'strategy', 'available'),
  seed(2, 'Catan', 'strategy', 'reserved'),
  seed(3, 'Ticket to Ride', 'family', 'available'),
  seed(4, 'Codenames', 'party', 'on_loan'),
  seed(5, 'Azul', 'family', 'available'),
  seed(6, 'Dixit', 'party', 'reserved'),
  seed(7, 'Sushi Go!', 'kids', 'available'),
  seed(8, 'Pandemic', 'strategy', 'on_loan'),
  seed(9, 'Hive', 'strategy', 'retired'),
  seed(10, 'Uno', 'kids', 'available'),
]

let nextId = games.length + 1

function seed(id, title, category, status) {
  const now = new Date().toISOString()
  return {
    id,
    title,
    category,
    status,
    created_by: 1,
    created_on: now,
    updated_by: 1,
    updated_on: now,
  }
}

export function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getGames() {
  return games
}

export function findGame(id) {
  return games.find((game) => game.id === id)
}

export function insertGame({ title, category }) {
  const now = new Date().toISOString()
  const game = {
    id: nextId++,
    title,
    category,
    status: 'available',
    created_by: 1,
    created_on: now,
    updated_by: 1,
    updated_on: now,
  }
  games = [...games, game]
  return game
}

export function setGameStatus(id, status) {
  let updated
  games = games.map((game) => {
    if (game.id !== id) return game
    updated = { ...game, status, updated_on: new Date().toISOString() }
    return updated
  })
  return updated
}
