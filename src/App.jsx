import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home'
import Myths from './Myths'
import TheCase from './TheCase'
import StatehoodCurious from './StatehoodCurious'
import TakeAction from './TakeAction'
import News from './News'
import HowCongressControlsDC from './HowCongressControlsDC'
import StatehoodPartnerMap from './StatehoodPartnerMap'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myths" element={<Myths />} />
        {/* Old path kept as a redirect — it has been live and shared. */}
        <Route path="/myths-and-faq" element={<Navigate to="/myths" replace />} />
        <Route path="/the-case" element={<TheCase />} />
        <Route path="/statehood-curious" element={<StatehoodCurious />} />
        <Route path="/take-action" element={<TakeAction />} />
        <Route path="/news" element={<News />} />
        <Route path="/how-congress-controls-dc" element={<HowCongressControlsDC />} />
        <Route path="/statehood-partner-map" element={<StatehoodPartnerMap />} />
      </Routes>
    </>
  )
}

export default App
