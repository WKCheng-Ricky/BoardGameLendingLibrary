import { useEffect, useState } from 'react'
import Header from './components/Header'
import GamesTable from './components/GamesTable'
import AddGameModal from './components/AddGameModal'
import { listGames } from './api/games'
import './App.css'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setAddModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    listGames()
      .then(({ data }) => {
        if (!cancelled) setGames(data)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load games.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function handleGameCreated(newGame) {
    setGames((current) => [...current, newGame])
  }

  function handleStatusChanged(updatedGame) {
    setGames((current) =>
      current.map((game) => (game.id === updatedGame.id ? updatedGame : game)),
    )
  }

  return (
    <>
      <Header onAddGame={() => setAddModalOpen(true)} />

      <main className="app-main">
        {loading && <p className="status-message">Loading games…</p>}
        {error && <p className="status-message error">{error}</p>}
        {!loading && !error && (
          <GamesTable games={games} onStatusChanged={handleStatusChanged} />
        )}
      </main>

      {isAddModalOpen && (
        <AddGameModal
          onClose={() => setAddModalOpen(false)}
          onGameCreated={handleGameCreated}
        />
      )}
    </>
  )
}

export default App
