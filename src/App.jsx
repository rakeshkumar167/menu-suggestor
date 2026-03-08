import { useState } from 'react'
import dishesData from '../indian_meal_dataset_1200_with_images.json'
import Header from './components/Header'
import DishDiscovery from './components/DishDiscovery'
import MealPlanner from './components/MealPlanner'

const dishes = dishesData.dishes

function App() {
  const [activeTab, setActiveTab] = useState('discover')

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-main">
        {activeTab === 'discover' ? (
          <DishDiscovery dishes={dishes} />
        ) : (
          <MealPlanner dishes={dishes} />
        )}
      </main>
    </div>
  )
}

export default App
