import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PracticeSelection from './pages/PracticeSelection'
import Dashboard from './pages/Dashboard'
import TutorDashboard from './pages/TutorDashboard'
import AdminDashboard from './pages/AdminDashboard'

// Home Page Component
const Home = () => {
  return (
    <div className="relative py-20 lg:py-32 overflow-hidden">

      <div className="text-center relative z-10">
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
          Prep like a Pro
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Master the IELTS <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            with Confidence
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Access hundreds of practice tests, vocabulary builders, and real-time feedback designed to help you hit Band 8+.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/practice-selection"
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all text-center"
          >
            Start Free Practice
          </Link>
          <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-gray-50 transition-all">
            Join Assessment Room
          </button>
        </div>
      </div>

    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<MainLayout />}>
          
          <Route path="/" element={<Home />} />
          <Route path="/practice-selection" element={<PracticeSelection />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tutor" element={<TutorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App