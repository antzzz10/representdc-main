import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import MythsAndFaq from './MythsAndFaq'
import TheCase from './TheCase'
import StatehoodCurious from './StatehoodCurious'
import TakeAction from './TakeAction'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/myths-and-faq" element={<MythsAndFaq />} />
      <Route path="/the-case" element={<TheCase />} />
      <Route path="/statehood-curious" element={<StatehoodCurious />} />
      <Route path="/take-action" element={<TakeAction />} />
    </Routes>
  )
}

export default App
