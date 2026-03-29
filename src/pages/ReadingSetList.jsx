import React, { useState, useEffect } from 'react'
import { FaPlus, FaBookOpen, FaTrash, FaEdit, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const ReadingSetList = () => {
  const navigate = useNavigate();
  const [readingSets, setReadingSets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReadingSets()
  }, [])

  const fetchReadingSets = async () => {
    try {
      const response = await api.get('/reading-sets')
      if (response.data.success) {
        setReadingSets(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reading sets.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reading set?')) {
      return
    }

    try {
      const response = await api.delete(`/reading-sets/${id}`)
      if (response.data.success) {
        setReadingSets(readingSets.filter(set => set._id !== id))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete reading set.')
    }
  }

  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyLabel = (difficulty) => {
    return difficulty?.charAt(0)?.toUpperCase() + difficulty?.slice(1)?.toLowerCase() || 'Medium'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium mb-4 transition-colors">
              <FaArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">Reading Sets</h1>
          <p className="text-gray-500 mt-1">Manage your IELTS reading passages and questions</p>
        </div>
        <Link
          to="/reading-set/create"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FaPlus className="w-4 h-4" />
          <span>Create Reading Set</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium shadow-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : readingSets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <FaBookOpen className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Reading Sets Yet</h3>
          <p className="text-gray-500 mb-6">Create your first reading set to get started</p>
          <Link
            to="/reading-set/create"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <FaPlus className="w-4 h-4" />
            <span>Create Reading Set</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readingSets.map((set) => (
            <Link
              key={set._id}
              to={`/reading-set/${set._id}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden group block"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{set.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getDifficultyColor(set.difficulty)}`}>
                        {getDifficultyLabel(set.difficulty)}
                      </span>
                      {set.isMatchingHeader && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                          Matching Headings
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaBookOpen className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{set.questions?.length || 0} Questions</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {stripHtml(set.content).substring(0, 150) || 'No content preview available...'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Link
                      to={`/reading-set/edit/${set._id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                    >
                      <FaEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDelete(set._id)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReadingSetList