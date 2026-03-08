import { useState, useMemo } from 'react'
import FilterPanel from './FilterPanel'
import DishCard from './DishCard'

const DEFAULT_FILTERS = {
  mealType: [],
  regions: [],
  dietType: 'all',
  spiceLevels: [],
  difficulties: [],
  calorieRange: [250, 750],
  ingredients: [],
  searchQuery: '',
}

const MEAL_TYPE_ORDER = { breakfast: 0, lunch: 1, dinner: 2 }

const FilterIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="3" y1="5" x2="17" y2="5"/>
    <line x1="6" y1="10" x2="14" y2="10"/>
    <line x1="9" y1="15" x2="11" y2="15"/>
  </svg>
)

export default function DishDiscovery({ dishes }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showCount, setShowCount] = useState(24)
  const [showFilters, setShowFilters] = useState(false)

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      if (filters.mealType.length && !filters.mealType.includes(dish.meal_type)) return false
      if (filters.regions.length && !filters.regions.includes(dish.region)) return false
      if (filters.dietType !== 'all' && dish.diet_type !== filters.dietType) return false
      if (filters.spiceLevels.length && !filters.spiceLevels.includes(dish.spice_level)) return false
      if (filters.difficulties.length && !filters.difficulties.includes(dish.difficulty)) return false
      if (dish.calories < filters.calorieRange[0] || dish.calories > filters.calorieRange[1]) return false
      if (filters.ingredients.length) {
        if (!filters.ingredients.every(ing => dish.ingredients.includes(ing))) return false
      }
      if (filters.searchQuery.trim()) {
        if (!dish.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false
      }
      return true
    })
  }, [dishes, filters])

  // Reset show count when filters change
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setShowCount(24)
  }

  const visibleDishes = filteredDishes.slice(0, showCount)
  const remaining = filteredDishes.length - showCount

  const hasActiveFilters = (
    filters.mealType.length ||
    filters.regions.length ||
    filters.dietType !== 'all' ||
    filters.spiceLevels.length ||
    filters.difficulties.length ||
    filters.calorieRange[0] !== 250 ||
    filters.calorieRange[1] !== 750 ||
    filters.ingredients.length ||
    filters.searchQuery.trim()
  )

  return (
    <div className="discovery-layout">
      {/* Mobile filter toggle */}
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(v => !v)}
      >
        <FilterIcon />
        {showFilters ? 'Hide Filters' : `Filters${hasActiveFilters ? ' •' : ''}`}
      </button>

      {/* Sidebar */}
      <div className={`filter-sidebar ${showFilters ? 'open' : ''}`}>
        <FilterPanel filters={filters} onChange={handleFiltersChange} />
      </div>

      {/* Main results */}
      <div className="discovery-main">
        <div className="results-bar">
          <div className="results-count">
            <em>{filteredDishes.length}</em> {filteredDishes.length === 1 ? 'dish' : 'dishes'}
            {filters.mealType.length === 1 && (
              <> for {filters.mealType[0]}</>
            )}
          </div>
          {hasActiveFilters && (
            <span className="results-meta">
              filtered from {dishes.length} total
            </span>
          )}
        </div>

        {filteredDishes.length === 0 ? (
          <div className="no-results">
            No dishes match your current filters.
            <br />
            <span style={{ fontSize: 14, color: 'var(--text-400)', fontFamily: 'var(--font-b)', fontStyle: 'normal', marginTop: 8, display: 'block' }}>
              Try adjusting the calorie range or removing some ingredient filters.
            </span>
          </div>
        ) : (
          <>
            <div className="dish-grid">
              {visibleDishes.map(dish => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>

            {remaining > 0 && (
              <div className="load-more-wrap">
                <button
                  className="load-more-btn"
                  onClick={() => setShowCount(c => c + 24)}
                >
                  Show more — {remaining} remaining
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
