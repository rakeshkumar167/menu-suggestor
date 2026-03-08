import { useState } from 'react'

const ALL_INGREDIENTS = [
  'chicken', 'chili', 'coriander', 'cumin', 'curry leaves',
  'egg', 'fish', 'garlic', 'ginger', 'lentils', 'mustard seeds',
  'onion', 'paneer', 'potato', 'rice', 'spinach', 'tomato', 'turmeric',
]

const ALL_REGIONS = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 'Hyderabad',
  'Karnataka', 'Kerala', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
]

const SearchIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="6.5" cy="6.5" r="5"/>
    <line x1="10.5" y1="10.5" x2="14" y2="14"/>
  </svg>
)

function CalorieSlider({ value, onChange }) {
  const MIN = 250; const MAX = 750
  const minPct = ((value[0] - MIN) / (MAX - MIN)) * 100
  const maxPct = ((value[1] - MIN) / (MAX - MIN)) * 100

  const handleMin = (e) => {
    const v = Math.min(Number(e.target.value), value[1] - 50)
    onChange([v, value[1]])
  }
  const handleMax = (e) => {
    const v = Math.max(Number(e.target.value), value[0] + 50)
    onChange([value[0], v])
  }

  return (
    <div>
      <div className="range-values">
        <span>{value[0]} kcal</span>
        <span>{value[1]} kcal</span>
      </div>
      <div className="range-slider">
        <div className="range-track-bg" />
        <div
          className="range-track-fill"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range" min={MIN} max={MAX} step={10}
          value={value[0]}
          onChange={handleMin}
          className="range-input"
        />
        <input
          type="range" min={MIN} max={MAX} step={10}
          value={value[1]}
          onChange={handleMax}
          className="range-input"
        />
      </div>
    </div>
  )
}

export default function FilterPanel({ filters, onChange }) {
  const update = (key, val) => onChange({ ...filters, [key]: val })

  const toggle = (key, item) => {
    const cur = filters[key]
    update(key, cur.includes(item) ? cur.filter(x => x !== item) : [...cur, item])
  }

  const reset = () => onChange({
    mealType: [],
    regions: [],
    dietType: 'all',
    spiceLevels: [],
    difficulties: [],
    calorieRange: [250, 750],
    ingredients: [],
    searchQuery: '',
  })

  return (
    <div className="filter-panel">
      <div className="filter-panel-title">Filters</div>

      {/* Search */}
      <div className="filter-section">
        <div className="search-wrap">
          <SearchIcon />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name…"
            value={filters.searchQuery}
            onChange={e => update('searchQuery', e.target.value)}
          />
        </div>
      </div>

      {/* Meal Type */}
      <div className="filter-section">
        <span className="filter-label">Meal Type</span>
        <div className="chip-row">
          {['breakfast', 'lunch', 'dinner'].map(t => (
            <button
              key={t}
              className={`chip ${filters.mealType.includes(t) ? 'active' : ''}`}
              onClick={() => toggle('mealType', t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* State / Region */}
      <div className="filter-section">
        <span className="filter-label">State of Origin</span>
        <select
          className="select-input"
          value={filters.regions[0] || ''}
          onChange={e => update('regions', e.target.value ? [e.target.value] : [])}
        >
          <option value="">All India</option>
          {ALL_REGIONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Diet */}
      <div className="filter-section">
        <span className="filter-label">Diet</span>
        <div className="chip-row">
          {[['all', 'All'], ['veg', 'Veg'], ['nonveg', 'Non-Veg']].map(([val, label]) => (
            <button
              key={val}
              className={`chip ${filters.dietType === val ? 'active' : ''}`}
              onClick={() => update('dietType', val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Spice Level */}
      <div className="filter-section">
        <span className="filter-label">Spice Level</span>
        <div className="chip-row">
          {[['mild', 'Mild'], ['medium', 'Medium'], ['spicy', 'Spicy']].map(([val, label]) => (
            <button
              key={val}
              className={`chip ${filters.spiceLevels.includes(val) ? 'active' : ''}`}
              onClick={() => toggle('spiceLevels', val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="filter-section">
        <span className="filter-label">Difficulty</span>
        <div className="chip-row">
          {['easy', 'medium', 'hard'].map(val => (
            <button
              key={val}
              className={`chip ${filters.difficulties.includes(val) ? 'active' : ''}`}
              onClick={() => toggle('difficulties', val)}
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calorie Range */}
      <div className="filter-section">
        <span className="filter-label">Calorie Range</span>
        <CalorieSlider
          value={filters.calorieRange}
          onChange={v => update('calorieRange', v)}
        />
      </div>

      {/* Ingredients */}
      <div className="filter-section">
        <span className="filter-label">Contains Ingredients</span>
        <div className="ingredient-grid">
          {ALL_INGREDIENTS.map(ing => (
            <button
              key={ing}
              className={`ing-chip ${filters.ingredients.includes(ing) ? 'active' : ''}`}
              onClick={() => toggle('ingredients', ing)}
            >
              {ing}
            </button>
          ))}
        </div>
      </div>

      <button className="reset-btn" onClick={reset}>
        Reset All Filters
      </button>
    </div>
  )
}
