import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'learner'
  })

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/signup', formData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Dispatch custom event to notify components of login
        window.dispatchEvent(new Event('authChange'));
      }

      if (formData.role === 'tutor') {
        navigate('/tutor'); 
      } else {
        navigate('/dashboard'); 
      }

    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || 'An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Create Account
          </h2>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          
          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                I want to sign up as
              </label>
              <div className="grid grid-cols-2 gap-4">

                <button
                  type="button"
                  onClick={() => handleRoleSelect('learner')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                    formData.role === 'learner'
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <FaUserGraduate 
                      className={`w-12 h-12 transition-colors ${
                        formData.role === 'learner' ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    />
                    <span className={`font-semibold text-lg ${
                      formData.role === 'learner' ? 'text-indigo-700' : 'text-gray-700'
                    }`}>
                      Learner
                    </span>
                  </div>
                  {formData.role === 'learner' && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('tutor')}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                    formData.role === 'tutor'
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <FaChalkboardTeacher 
                      className={`w-12 h-12 transition-colors ${
                        formData.role === 'tutor' ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    />
                    <span className={`font-semibold text-lg ${
                      formData.role === 'tutor' ? 'text-indigo-700' : 'text-gray-700'
                    }`}>
                      Tutor
                    </span>
                  </div>
                  {formData.role === 'tutor' && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="Enter Your Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-xl transition-all ${
                isLoading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          {/* <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button className="flex w-full items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group">
            <FcGoogle className="w-5 h-5" />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Continue with Google
            </span>
          </button> */}
        </div>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup
