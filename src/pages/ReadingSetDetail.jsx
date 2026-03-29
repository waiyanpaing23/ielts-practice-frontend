import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEdit, FaTrash, FaSpinner, FaBookOpen, FaList, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import api from '../api/axios'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const ReadingSetDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [readingSet, setReadingSet] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReadingSet()
  }, [id])

  const fetchReadingSet = async () => {
    try {
      const response = await api.get(`/reading-sets/${id}`)
      if (response.data.success) {
        setReadingSet(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reading set details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this reading set?')) {
      return
    }

    try {
      const response = await api.delete(`/reading-sets/${id}`)
      if (response.data.success) {
        navigate('/admin')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete reading set.')
    }
  }

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

  const formatType = (type) => type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-center">
          <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium shadow-sm">
          {error}
        </div>
      </div>
    )
  }

  if (!readingSet) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center text-gray-500">Reading set not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/reading-set/edit/${readingSet._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
          >
            <FaEdit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors"
          >
            <FaTrash className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Title and Metadata */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{readingSet.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${getDifficultyColor(readingSet.difficulty)}`}>
            {getDifficultyLabel(readingSet.difficulty)}
          </span>
          {readingSet.isMatchingHeader && (
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold uppercase tracking-wider">
              Matching Headings
            </span>
          )}
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-bold uppercase tracking-wider">
            {readingSet.questions?.length || 0} Questions
          </span>
        </div>
      </div>

      {/* Passage Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4 flex items-center gap-2">
          <FaBookOpen className="text-indigo-500" />
          Passage Content
        </h2>
        <div className="prose max-w-none">
          <ReactQuill
            theme="snow"
            value={readingSet.content}
            readOnly={true}
            modules={{ toolbar: false }}
            className="border-0"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4 flex items-center gap-2">
          <FaList className="text-indigo-500" />
          Questions ({readingSet.questions?.length || 0})
        </h2>

        <div className="space-y-6">
          {readingSet.questions?.map((question, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Question Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold rounded-lg text-sm bg-indigo-600 text-white">
                      {index + 1}
                    </span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
                      {formatType(question.question_type)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Question Prompt</h4>
                  <p className="text-gray-700">{question.content}</p>
                </div>

                {question.options && question.options.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Options</h4>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            option === question.correct_answer
                              ? 'bg-green-50 border-green-300'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          {option === question.correct_answer ? (
                            <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 flex-shrink-0" />
                          )}
                          <span className={`flex-1 ${option === question.correct_answer ? 'font-semibold text-green-900' : 'text-gray-700'}`}>
                            {option}
                          </span>
                          {option === question.correct_answer && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {question.question_type === 'fill_in_the_blank' && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-900">
                      <FaCheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Correct Answer:</span>
                    </div>
                    <p className="text-green-900 mt-2 font-medium">{question.correct_answer}</p>
                  </div>
                )}

                {question.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
                    <p className="text-blue-800">{question.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReadingSetDetail
