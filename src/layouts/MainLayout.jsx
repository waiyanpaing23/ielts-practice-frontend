import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'

const MainLayout = () => {

  const location = useLocation();
  
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 w-full ${isHomePage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Outlet />
      </main>

      <footer className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm opacity-90">&copy; 2025 IELTS Practice System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout