import { STATUSES, STATUS_LABELS } from '../constants/game'
import GamesTableRow from './GamesTableRow'

function GamesTable({
  games,
  statusFilter,
  search,
  onStatusFilterChange,
  onSearchChange,
  onStatusChanged,
}) {
  return (
    <div className="games-table-panel">
      <div className="table-controls">
        <div className="status-filter" role="group" aria-label="Filter by status">
          <button
            type="button"
            className={statusFilter === 'all' ? 'filter-chip active' : 'filter-chip'}
            onClick={() => onStatusFilterChange('all')}
          >
            All
          </button>
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              className={statusFilter === status ? 'filter-chip active' : 'filter-chip'}
              onClick={() => onStatusFilterChange(status)}
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
          onChange={(event) => onSearchChange(event.target.value)}
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
          {games.length === 0 ? (
            <tr>
              <td colSpan={3} className="empty-state">
                No games match your filters.
              </td>
            </tr>
          ) : (
            games.map((game) => (
              <GamesTableRow key={game.id} game={game} onStatusChanged={onStatusChanged} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default GamesTable
