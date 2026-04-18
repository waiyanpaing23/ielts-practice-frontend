import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom' // 👇 Added useNavigate
import logoImage from '../assets/logo.png';
import { MdLogout } from 'react-icons/md';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const navigate = useNavigate() // 👇 Initialize navigate

  useEffect(() => {
    // Check for authentication status on mount
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
      
      if (token && userStr) {
        setIsAuthenticated(true)
        const user = JSON.parse(userStr)
        setUserRole(user.role)
      } else {
        setIsAuthenticated(false)
        setUserRole(null)
      }
    }

    checkAuth()

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth()
    }

    // Listen for custom auth change events (e.g., when user logs in/out on the same page)
    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  const getDashboardPath = () => {
    switch (userRole) {
      case 'tutor':
        return '/tutor'
      case 'admin':
        return '/admin'
      default:
        return '/dashboard'
    }
  }

  // 👇 NEW: The Logout Function
  const handleLogout = () => {
    // 1. Clear everything from both storage types just to be safe
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    // 2. Dispatch the event so the Navbar instantly updates to "Sign In"
    window.dispatchEvent(new Event('authChange'));

    // 3. Send them back to the home page
    navigate('/');
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={logoImage} 
                alt="Langly Logo" 
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300" 
              />
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-indigo-600 drop-shadow-sm group-hover:opacity-80 transition-opacity">
                IELTS Practice
              </h1>
            </Link>
          </div>
          
          <div className="flex gap-3 items-center">
            {isAuthenticated ? (
              // 👇 UPDATED: Added a wrapper fragment and the Sign Out button
              <>
                <Link 
                  to={getDashboardPath()} 
                  className="px-5 py-2.5 rounded-full font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                >
                  <MdLogout className="w-5 h-5 inline-block me-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-all">
                  Sign In
                </Link>
                <Link to="/signup" className="px-5 py-2.5 rounded-full font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all active:scale-95">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar