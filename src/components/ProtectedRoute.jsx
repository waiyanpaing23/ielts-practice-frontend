import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  // Check for token in either localStorage or sessionStorage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/signin" replace />
  }
  
  return <Outlet />;
}

export default ProtectedRoute
