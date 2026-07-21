import { useEffect, useState } from 'react'
import Header from './components/Header'
import GamesTable from './components/GamesTable'
import AddGameModal from './components/AddGameModal'
import { listGames } from './api/games'
import './App.css'

const SEARCH_DEBOUNCE_MS = 350

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    listGames({
      status: statusFilter === 'all' ? undefined : statusFilter,
      title: debouncedSearch || undefined,
    })
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
  }, [statusFilter, debouncedSearch, reloadToken])

  function handleGameCreated() {
    setReloadToken((token) => token + 1)
  }

  function handleStatusChanged() {
    setReloadToken((token) => token + 1)
  }

  return (
    <>
      <Header onAddGame={() => setAddModalOpen(true)} />

      <main className="app-main">
        {loading && <p className="status-message">Loading games…</p>}
        {error && <p className="status-message error">{error}</p>}
        {!loading && !error && (
          <GamesTable
            games={games}
            statusFilter={statusFilter}
            search={search}
            onStatusFilterChange={setStatusFilter}
            onSearchChange={setSearch}
            onStatusChanged={handleStatusChanged}
          />
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
