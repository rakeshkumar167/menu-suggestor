import { useState, useMemo, useEffect } from 'react'
import DishPickerModal from './DishPickerModal'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner']
const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' }

function getDateKey(date) {
  return date.toISOString().split('T')[0]
}

function formatDateLabel(date) {
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

const ClearIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="2" y1="2" x2="10" y2="10"/>
    <line x1="10" y1="2" x2="2" y2="10"/>
  </svg>
)

export default function MealPlanner({ dishes }) {
  const [plannedMeals, setPlannedMeals] = useState(() => {
    try {
      const saved = localStorage.getItem('thali-planned-meals')
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })

  const [pickerState, setPickerState] = useState(null) // { dateKey, mealType, dateLabel }

  useEffect(() => {
    localStorage.setItem('thali-planned-meals', JSON.stringify(plannedMeals))
  }, [plannedMeals])

  const weekDays = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      return d
    })
  }, [])

  const addMeal = (dateKey, mealType, dish) => {
    setPlannedMeals(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [mealType]: dish },
    }))
    setPickerState(null)
  }

  const removeMeal = (dateKey, mealType) => {
    setPlannedMeals(prev => {
      const day = { ...prev[dateKey] }
      delete day[mealType]
      return { ...prev, [dateKey]: day }
    })
  }

  const getDayCalories = (dateKey) => {
    const day = plannedMeals[dateKey] || {}
    return Object.values(day).reduce((sum, d) => sum + (d?.calories || 0), 0)
  }

  const weeklyTotal = weekDays.reduce((sum, d) => sum + getDayCalories(getDateKey(d)), 0)
  const mealsPlanned = weekDays.reduce((sum, d) => {
    const day = plannedMeals[getDateKey(d)] || {}
    return sum + Object.keys(day).length
  }, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const clearAll = () => {
    if (window.confirm('Clear all planned meals for this week?')) {
      const keys = weekDays.map(getDateKey)
      setPlannedMeals(prev => {
        const next = { ...prev }
        keys.forEach(k => { delete next[k] })
        return next
      })
    }
  }

  return (
    <div className="planner">
      {/* Header */}
      <div className="planner-header">
        <div>
          <h2 className="planner-title">Weekly Menu</h2>
          <p className="planner-subtitle">
            {weekDays[0].toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
            {' — '}
            {weekDays[6].toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {mealsPlanned > 0 && (
            <>
              <div className="weekly-stats">
                <span className="weekly-cal-label">Week Total</span>
                <span className="weekly-cal-value">{weeklyTotal.toLocaleString()} kcal</span>
              </div>
              <button
                onClick={clearAll}
                style={{
                  padding: '14px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(196,137,58,0.15)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--text-300)',
                  fontFamily: 'var(--font-b)',
                  fontSize: 12,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  transition: 'all var(--t)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(212,88,28,0.4)'
                  e.currentTarget.style.color = '#e08060'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(196,137,58,0.15)'
                  e.currentTarget.style.color = 'var(--text-300)'
                }}
              >
                Clear week
              </button>
            </>
          )}
        </div>
      </div>

      {/* Planner grid with horizontal scroll on mobile */}
      <div className="planner-grid-wrapper">
        <div className="planner-grid">

          {/* Corner */}
          <div className="planner-corner" />

          {/* Day headers */}
          {weekDays.map((day, i) => {
            const isToday = day.getTime() === today.getTime()
            return (
              <div key={i} className={`planner-day-header ${isToday ? 'today' : ''}`}>
                <span className="day-name">
                  {isToday ? 'Today' : day.toLocaleDateString('en', { weekday: 'short' })}
                </span>
                <span className="day-date-num">{day.getDate()}</span>
                <span className="day-month-sm">
                  {day.toLocaleDateString('en', { month: 'short' })}
                </span>
              </div>
            )
          })}

          {/* Meal rows */}
          {MEAL_TYPES.map(mealType => (
            <>
              {/* Row label */}
              <div key={`lbl-${mealType}`} className="planner-row-label">
                <span className="meal-label-icon">{MEAL_ICONS[mealType]}</span>
                <span className="meal-label-text">{mealType}</span>
              </div>

              {/* Cells */}
              {weekDays.map((day, i) => {
                const dateKey = getDateKey(day)
                const dish = plannedMeals[dateKey]?.[mealType]

                return (
                  <div key={`${mealType}-${i}`} className="planner-cell">
                    {dish ? (
                      <div className="planned-dish">
                        <button
                          className="remove-dish-btn"
                          onClick={() => removeMeal(dateKey, mealType)}
                          aria-label="Remove"
                          title="Remove"
                        >
                          <ClearIcon />
                        </button>
                        <span className="planned-dish-name">{dish.name}</span>
                        <div>
                          <div className="planned-dish-cal">{dish.calories} kcal</div>
                          <div className="planned-dish-meta">{dish.region}</div>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="add-meal-btn"
                        onClick={() => setPickerState({
                          dateKey,
                          mealType,
                          dateLabel: formatDateLabel(day),
                        })}
                        aria-label={`Add ${mealType}`}
                        title={`Add ${mealType}`}
                      >
                        +
                      </button>
                    )}
                  </div>
                )
              })}
            </>
          ))}

          {/* Totals row */}
          <div className="planner-total-label">
            <span className="total-label-text">Total</span>
          </div>
          {weekDays.map((day, i) => {
            const cal = getDayCalories(getDateKey(day))
            return (
              <div key={`total-${i}`} className="planner-day-total">
                {cal > 0 ? (
                  <span className="total-cal-value">{cal.toLocaleString()}</span>
                ) : (
                  <span className="total-cal-empty">—</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Instructions if empty */}
      {mealsPlanned === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 24px 0',
          color: 'var(--text-300)',
          fontFamily: 'var(--font-d)',
          fontSize: 18,
          fontStyle: 'italic',
        }}>
          Tap the <strong style={{ color: 'var(--gold)', fontStyle: 'normal' }}>+</strong> in any cell to add a dish to your week
        </div>
      )}

      {/* Picker modal */}
      {pickerState && (
        <DishPickerModal
          dishes={dishes}
          mealType={pickerState.mealType}
          dateLabel={pickerState.dateLabel}
          onSelect={(dish) => addMeal(pickerState.dateKey, pickerState.mealType, dish)}
          onClose={() => setPickerState(null)}
        />
      )}
    </div>
  )
}
