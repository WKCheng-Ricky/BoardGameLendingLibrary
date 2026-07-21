function AddGameButton({ onClick }) {
  return (
    <button type="button" className="add-game-btn" onClick={onClick}>
      <span aria-hidden="true">+</span> ADD GAME
    </button>
  )
}

export default AddGameButton
