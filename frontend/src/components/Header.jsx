import AddGameButton from './AddGameButton'

function Header({ onAddGame }) {
  return (
    <header className="app-header">
      <div className="neon-bar" aria-hidden="true" />
      <div className="header-content">
        <div className="brand">
          <svg
            className="game-icon"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Game collection"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="8" cy="8.5" r="1.5" fill="currentColor" />
            <circle cx="16" cy="8.5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="8" cy="15.5" r="1.5" fill="currentColor" />
            <circle cx="16" cy="15.5" r="1.5" fill="currentColor" />
          </svg>
          <h1>Game Collection</h1>
        </div>
        <AddGameButton onClick={onAddGame} />
      </div>
    </header>
  )
}

export default Header
