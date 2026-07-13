import Nav from './components/Nav'
import Footer from './components/Footer'
import CategoryCard from './components/CategoryCard'
import { categoryDetails } from './data/categoryDetails'
import './App.css'

function TheCase() {
  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">The evidence</span>
          <h1>What Congress has blocked</h1>
          <p>These aren't hypothetical. Congress has used its power to overturn laws passed by D.C. residents. Click each category to see specific examples.</p>
        </div>
      </header>
      <section className="impact-section">
        <div className="container">
          <div className="categories-list">
            {categoryDetails.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default TheCase
