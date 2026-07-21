import { useState } from 'react'
import { STATUSES, STATUS_LABELS, allowedNextStatuses } from '../constants/game'
import { updateGameStatus } from '../api/games'

function StatusControl({ game, onStatusChanged }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const isRetired = game.status === 'retired'
  const enabled = allowedNextStatuses(game.status)

  async function handleChange(event) {
    const nextStatus = event.target.value
    if (nextStatus === game.status) return

    const confirmed = window.confirm(
      `Change "${game.title}" status to ${STATUS_LABELS[nextStatus]}?`,
    )
    if (!confirmed) {
      event.target.value = game.status
      return
    }

    setPending(true)
    setError(null)
    try {
      const { data } = await updateGameStatus(game.id, nextStatus)
      onStatusChanged(data)
    } catch (err) {
      setError(err.message || 'Failed to update status.')
      event.target.value = game.status
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="status-control">
      <select
        className={`status-select status-${game.status}`}
        value={game.status}
        disabled={isRetired || pending}
        onChange={handleChange}
        aria-label={`Change status for ${game.title}`}
      >
        {STATUSES.map((status) => (
          <option
            key={status}
            value={status}
            disabled={status !== game.status && !enabled.has(status)}
          >
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      {error && <p className="field-error status-error">{error}</p>}
    </div>
  )
}

export default StatusControl
