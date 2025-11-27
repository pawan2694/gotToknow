import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from './components/landingpage/LandingPage'
import LoginPage from './components/loginpage/LoginPage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/landing" element={<LandingPage/>}/>
      </Routes>

    </Router>
  )
}

export default App
