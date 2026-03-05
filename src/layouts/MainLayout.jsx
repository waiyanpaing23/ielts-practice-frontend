import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-8">
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