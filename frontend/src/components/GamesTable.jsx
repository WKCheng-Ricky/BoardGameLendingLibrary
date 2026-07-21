import { useMemo, useState } from 'react'
import { STATUSES, STATUS_LABELS } from '../constants/game'
import GamesTableRow from './GamesTableRow'

function GamesTable({ games, onStatusChanged }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredGames = useMemo(() => {
    const term = search.trim().toLowerCase()
    return games.filter((game) => {
      const matchesStatus = statusFilter === 'all' || game.status === statusFilter
      const matchesSearch = !term || game.title.toLowerCase().includes(term)
      return matchesStatus && matchesSearch
    })
  }, [games, statusFilter, search])

  return (
    <div className="games-table-panel">
      <div className="table-controls">
        <div className="status-filter" role="group" aria-label="Filter by status">
          <button
            type="button"
            className={statusFilter === 'all' ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              className={statusFilter === status ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setStatusFilter(status)}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="search-input"
          placeholder="Search by title…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search games by title"
        />
      </div>

      <table className="games-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredGames.length === 0 ? (
            <tr>
              <td colSpan={3} className="empty-state">
                No games match your filters.
              </td>
            </tr>
          ) : (
            filteredGames.map((game) => (
              <GamesTableRow key={game.id} game={game} onStatusChanged={onStatusChanged} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default GamesTable
