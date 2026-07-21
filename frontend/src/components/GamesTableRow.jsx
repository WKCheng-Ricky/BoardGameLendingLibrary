import { CATEGORY_LABELS } from '../constants/game'
import StatusControl from './StatusControl'

function GamesTableRow({ game, onStatusChanged }) {
  return (
    <tr>
      <td>{game.title}</td>
      <td>{CATEGORY_LABELS[game.category] ?? game.category}</td>
      <td>
        <StatusControl game={game} onStatusChanged={onStatusChanged} />
      </td>
    </tr>
  )
}

export default GamesTableRow
