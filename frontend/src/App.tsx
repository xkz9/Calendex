import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CalendarView from './components/CalendarView'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<CalendarView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

