import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

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

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            {/* Simple Logo Icon Replacement */}
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">I</span>
            </div>
            <Link to="/" className="text-gray-900 hover:text-indigo-600 transition-colors">
              <h1 className="text-xl font-bold tracking-tight">IELTS Practice</h1>
            </Link>
          </div>
          
          <div className="flex gap-3 items-center">
            {isAuthenticated ? (
              <Link 
                to={getDashboardPath()} 
                className="px-5 py-2.5 rounded-full font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all active:scale-95"
              >
                Go to Dashboard
              </Link>
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