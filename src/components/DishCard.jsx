const FoodPlaceholder = () => (
  <div className="dish-placeholder">
    <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer decorative ring */}
      <circle cx="100" cy="72" r="52" stroke="rgba(196,137,58,0.06)" strokeWidth="1"/>
      <circle cx="100" cy="72" r="42" stroke="rgba(196,137,58,0.05)" strokeWidth="0.75" strokeDasharray="3 5"/>
      {/* Bowl rim */}
      <ellipse cx="100" cy="64" rx="52" ry="13"
        fill="rgba(196,137,58,0.04)"
        stroke="rgba(196,137,58,0.22)"
        strokeWidth="1.2"
      />
      {/* Bowl body curve */}
      <path
        d="M48 64 Q100 96 152 64"
        stroke="rgba(196,137,58,0.36)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Steam wisps */}
      <path d="M76 50 C74 44 78 40 76 33" stroke="rgba(196,137,58,0.2)" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M100 46 C98 40 102 36 100 28" stroke="rgba(196,137,58,0.2)" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M124 50 C122 44 126 40 124 33" stroke="rgba(196,137,58,0.2)" strokeWidth="1.4" strokeLinecap="round"/>
      {/* Inner garnish dots */}
      <circle cx="100" cy="72" r="2.5" fill="rgba(196,137,58,0.18)"/>
      <circle cx="86"  cy="75" r="1.8" fill="rgba(196,137,58,0.12)"/>
      <circle cx="114" cy="75" r="1.8" fill="rgba(196,137,58,0.12)"/>
      <circle cx="93"  cy="69" r="1.2" fill="rgba(196,137,58,0.09)"/>
      <circle cx="107" cy="69" r="1.2" fill="rgba(196,137,58,0.09)"/>
      {/* Decorative tick marks */}
      <line x1="55"  y1="96" x2="62"  y2="96" stroke="rgba(196,137,58,0.22)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="138" y1="96" x2="145" y2="96" stroke="rgba(196,137,58,0.22)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  </div>
)

const SPICE_BADGE = {
  mild:   'badge-spice-mild',
  medium: 'badge-spice-medium',
  spicy:  'badge-spice-spicy',
}

const SPICE_LABEL = {
  mild:   '· Mild',
  medium: '·· Medium',
  spicy:  '··· Spicy',
}

export default function DishCard({ dish }) {
  const displayIngredients = dish.ingredients.slice(0, 5)
  const extraCount = dish.ingredients.length - 5

  return (
    <div className="dish-card">
      <FoodPlaceholder />

      <div className="dish-card-body">
        {/* Name + region */}
        <div>
          <h3 className="dish-name">{dish.name}</h3>
          <div className="dish-region-cuisine">
            <span className="dish-region">{dish.region}</span>
            <span style={{ fontSize: 10, color: 'var(--text-400)' }}>·</span>
            <span style={{ fontSize: 10, color: 'var(--text-400)', letterSpacing: '0.04em' }}>
              {dish.cuisine_type}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="dish-badges">
          <span className="badge badge-meal">{dish.meal_type}</span>
          <span className={`badge ${dish.diet_type === 'veg' ? 'badge-veg' : 'badge-nonveg'}`}>
            {dish.diet_type === 'veg' ? '● Veg' : '▲ Non-Veg'}
          </span>
          <span className={`badge ${SPICE_BADGE[dish.spice_level]}`}>
            {SPICE_LABEL[dish.spice_level]}
          </span>
        </div>

        {/* Stats */}
        <div className="dish-stats">
          <div className="stat-item">
            <span className="stat-value">{dish.calories}</span>
            <span className="stat-label">kcal</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{dish.protein_g}g</span>
            <span className="stat-label">protein</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{dish.prep_time_minutes}m</span>
            <span className="stat-label">prep</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{dish.difficulty}</span>
            <span className="stat-label">level</span>
          </div>
        </div>

        {/* Ingredients */}
        <div className="dish-ingredients">
          {displayIngredients.map(ing => (
            <span key={ing} className="ing-tag">{ing}</span>
          ))}
          {extraCount > 0 && (
            <span className="ing-tag more">+{extraCount} more</span>
          )}
        </div>
      </div>
    </div>
  )
}
