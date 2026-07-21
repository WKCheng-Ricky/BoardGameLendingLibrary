import { useEffect, useState } from 'react'
import { CATEGORIES, CATEGORY_LABELS } from '../constants/game'
import { createGame } from '../api/games'

const EMPTY_FORM = { title: '', category: '' }

function AddGameModal({ onClose, onGameCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function validate() {
    const nextErrors = {}
    if (!form.title.trim()) {
      nextErrors.title = 'Title is required.'
    }
    if (!CATEGORIES.includes(form.category)) {
      nextErrors.category = 'Please select a valid category.'
    }
    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const clientErrors = validate()
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setSubmitting(true)
    setErrors({})
    try {
      const { data } = await createGame({ title: form.title, category: form.category })
      onGameCreated(data)
      onClose()
    } catch (err) {
      setErrors(err.errors || { title: err.message || 'Failed to add game.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-game-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="add-game-title">Add Game</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="game-title">Title</label>
            <input
              id="game-title"
              type="text"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="game-category">Category</label>
            <select
              id="game-category"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
            {errors.category && <p className="field-error">{errors.category}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddGameModal
