import { useState, useMemo, useEffect, useRef } from 'react'

const SearchIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="6.5" cy="6.5" r="5"/>
    <line x1="10.5" y1="10.5" x2="14" y2="14"/>
  </svg>
)

const SPICE_BADGE = {
  mild:   'badge-spice-mild',
  medium: 'badge-spice-medium',
  spicy:  'badge-spice-spicy',
}

export default function DishPickerModal({ dishes, mealType, dateLabel, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const [activeMealType, setActiveMealType] = useState(mealType)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const filtered = useMemo(() => {
    return dishes
      .filter(dish => {
        if (dish.meal_type !== activeMealType) return false
        if (query.trim() && !dish.name.toLowerCase().includes(query.toLowerCase())) return false
        return true
      })
      .slice(0, 60)
  }, [dishes, query, activeMealType])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-head">
          <div className="modal-title">
            Add <em>{activeMealType}</em>
            {dateLabel && <span style={{ fontSize: 14, color: 'var(--text-300)', fontStyle: 'normal', fontWeight: 400, marginLeft: 8 }}>· {dateLabel}</span>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Controls */}
        <div className="modal-controls">
          {/* Meal type tabs */}
          <div className="modal-meal-tabs">
            {['breakfast', 'lunch', 'dinner'].map(t => (
              <button
                key={t}
                className={`modal-meal-tab ${activeMealType === t ? 'active' : ''}`}
                onClick={() => { setActiveMealType(t); setQuery('') }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="modal-search-wrap">
            <SearchIcon />
            <input
              ref={inputRef}
              type="text"
              className="modal-search"
              placeholder={`Search ${activeMealType} dishes…`}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results count */}
        <div className="modal-result-count">
          {filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'}
          {filtered.length === 60 && ' (showing top 60)'}
        </div>

        {/* Results */}
        <div className="modal-results">
          {filtered.length === 0 ? (
            <div className="modal-empty">No {activeMealType} dishes found</div>
          ) : (
            filtered.map(dish => (
              <button
                key={dish.id}
                className="modal-dish-btn"
                onClick={() => onSelect(dish)}
              >
                <div className="modal-dish-left">
                  <span className="modal-dish-name">{dish.name}</span>
                  <div className="modal-dish-meta">
                    {dish.region} · {dish.cuisine_type} · {dish.prep_time_minutes}m prep
                  </div>
                </div>
                <div className="modal-dish-right">
                  <span className="modal-dish-cal">{dish.calories} kcal</span>
                  <div className="modal-dish-badges">
                    <span className={`badge ${dish.diet_type === 'veg' ? 'badge-veg' : 'badge-nonveg'}`}
                      style={{ fontSize: 9, padding: '2px 6px' }}>
                      {dish.diet_type === 'veg' ? 'Veg' : 'Non-Veg'}
                    </span>
                    <span className={`badge ${SPICE_BADGE[dish.spice_level]}`}
                      style={{ fontSize: 9, padding: '2px 6px' }}>
                      {dish.spice_level}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
