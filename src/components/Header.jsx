const DiscoverIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="8"/>
    <polygon points="8.5,7.5 13.5,10 8.5,12.5" fill="currentColor" stroke="none"/>
  </svg>
)

const PlannerIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="13" rx="2"/>
    <line x1="7" y1="2" x2="7" y2="6"/>
    <line x1="13" y1="2" x2="13" y2="6"/>
    <line x1="3" y1="9" x2="17" y2="9"/>
    <line x1="7" y1="13" x2="7" y2="13" strokeWidth="2"/>
    <line x1="10" y1="13" x2="10" y2="13" strokeWidth="2"/>
    <line x1="13" y1="13" x2="13" y2="13" strokeWidth="2"/>
  </svg>
)

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-glyph">थ</div>
          <div>
            <div className="brand-name">Thali</div>
            <div className="brand-sub">Indian Meal Planner</div>
          </div>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-tab ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => onTabChange('discover')}
          >
            <DiscoverIcon />
            <span className="nav-label">Discover</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'planner' ? 'active' : ''}`}
            onClick={() => onTabChange('planner')}
          >
            <PlannerIcon />
            <span className="nav-label">Weekly Plan</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
