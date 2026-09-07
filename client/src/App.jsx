import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes will be added here as we build each feature */}
        <Route path="/" element={<div>Welcome to Ridesawa</div>} />
      </Routes>
    </Router>
  )
}

export default App
