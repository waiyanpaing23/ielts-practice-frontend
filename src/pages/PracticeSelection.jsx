import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    FiClock,
    FiBook,
    FiZap,
    FiToggleLeft,
    FiToggleRight
} from 'react-icons/fi'

const PracticeSelection = () => {
    const navigate = useNavigate()

    const [selectedMode, setSelectedMode] = useState('full-test')
    
    const [practiceOptions, setPracticeOptions] = useState({
        difficulty: 'medium',
        timeLimit: true
    })

    // 👇 UPDATED: Simple, beginner-friendly labels with accurate IELTS context in the description
    const difficulties = [
        { id: 'easy', label: 'Easy', description: 'Factual & Descriptive (Passage 1 level)', color: 'green' },
        { id: 'medium', label: 'Medium', description: 'Discursive & Complex (Passage 2 level)', color: 'blue' },
        { id: 'hard', label: 'Hard', description: 'Academic & Abstract (Passage 3 level)', color: 'red' }
    ]

    const handleModeSelect = (mode) => {
        setSelectedMode(mode)
    }

    const handleDifficultyChange = (difficulty) => {
        setPracticeOptions(prev => ({ ...prev, difficulty }))
    }

    const toggleTimeLimit = () => {
        setPracticeOptions(prev => ({ ...prev, timeLimit: !prev.timeLimit }))
    }

    const handleStartMiniPractice = () => {
        navigate(`/learner/mini-practice?difficulty=${practiceOptions.difficulty}&timed=${practiceOptions.timeLimit}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Choose Your Practice Mode
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Select how you want to practice and customize your learning experience
                    </p>
                </div>

                {/* Mode Selection Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Full Test Card */}
                    <button
                        onClick={() => handleModeSelect('full-test')}
                        className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${selectedMode === 'full-test'
                                ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl shadow-indigo-200'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                            }`}
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${selectedMode === 'full-test'
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                                    : 'bg-gray-100'
                                }`}>
                                <FiClock className={`w-10 h-10 ${selectedMode === 'full-test' ? 'text-white' : 'text-gray-500'
                                    }`} />
                            </div>
                            <div>
                                <h3 className={`text-2xl font-bold mb-2 ${selectedMode === 'full-test' ? 'text-indigo-700' : 'text-gray-900'
                                    }`}>
                                    Full Test
                                </h3>
                                <p className="text-gray-600">
                                    Complete IELTS Reading test with all three sections
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <FiClock className="w-4 h-4" />
                                <span>60 minutes</span>
                            </div>
                        </div>
                        {selectedMode === 'full-test' && (
                            <div className="absolute top-4 right-4">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </button>

                    {/* Practice Card */}
                    <button
                        onClick={() => handleModeSelect('practice')}
                        className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${selectedMode === 'practice'
                                ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl shadow-indigo-200'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                            }`}
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${selectedMode === 'practice'
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                                    : 'bg-gray-100'
                                }`}>
                                <FiBook className={`w-10 h-10 ${selectedMode === 'practice' ? 'text-white' : 'text-gray-500'
                                    }`} />
                            </div>
                            <div>
                                <h3 className={`text-2xl font-bold mb-2 ${selectedMode === 'practice' ? 'text-indigo-700' : 'text-gray-900'
                                    }`}>
                                    Mini Practice
                                </h3>
                                <p className="text-gray-600">
                                    A quick 20-minute drill on a single reading passage.
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <FiZap className="w-4 h-4" />
                                {/* 👇 UPDATED: Changed to "1 Complete Passage" to avoid confusing question counts */}
                                <span>1 Complete Passage</span>
                            </div>
                        </div>
                        {selectedMode === 'practice' && (
                            <div className="absolute top-4 right-4">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </button>
                </div>

                {/* Practice Options Section */}
                {selectedMode === 'practice' && (
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customize Your Practice</h2>

                        {/* Difficulty Selection */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                Passage Difficulty
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {difficulties.map((difficulty) => (
                                    <button
                                        key={difficulty.id}
                                        onClick={() => handleDifficultyChange(difficulty.id)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${practiceOptions.difficulty === difficulty.id
                                                ? `border-${difficulty.color}-500 bg-${difficulty.color}-50`
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className={`font-bold text-lg mb-1 ${practiceOptions.difficulty === difficulty.id
                                                    ? `text-${difficulty.color}-700`
                                                    : 'text-gray-700'
                                                }`}>
                                                {difficulty.label}
                                            </div>
                                            <div className="text-xs text-gray-700">
                                                {difficulty.description}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Limit Toggle */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                Exam Simulation
                            </label>
                            <button
                                onClick={toggleTimeLimit}
                                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${practiceOptions.timeLimit
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    {practiceOptions.timeLimit ? (
                                        <FiToggleRight className="w-8 h-8 text-indigo-600" />
                                    ) : (
                                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                                    )}
                                    <div className="text-left">
                                        <div className={`font-semibold ${practiceOptions.timeLimit ? 'text-indigo-700' : 'text-gray-700'
                                            }`}>
                                            {practiceOptions.timeLimit ? 'Strict Time Limit (Recommended)' : 'Relaxed Mode'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {practiceOptions.timeLimit
                                                ? 'Passage will auto-submit after 20 minutes.'
                                                : 'Practice at your own pace.'}
                                        </div>
                                    </div>
                                </div>
                                {practiceOptions.timeLimit && (
                                    <div className="hidden sm:flex items-center space-x-2 text-indigo-600 bg-white px-3 py-1 rounded-md border border-indigo-100 shadow-sm">
                                        <FiClock className="w-4 h-4" />
                                        <span className="font-bold">20 min</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Start Practice Button */}
                        <button 
                            onClick={handleStartMiniPractice}
                            className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all active:scale-95"
                        >
                            Start Mini Practice
                        </button>
                    </div>
                )}

                {/* Full Test Start Button */}
                {selectedMode === 'full-test' && (
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Full Mock Exam</h2>
                            <p className="text-gray-600">
                                Browse our library of full-length IELTS reading tests to simulate the real exam experience.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/learner/library')}
                            className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <FiBook className="w-5 h-5" /> Browse Test Library
                        </button>
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center font-bold text-gray-500 hover:text-indigo-600 transition-colors uppercase tracking-wider text-sm"
                    >
                        <span className="mr-2">←</span>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PracticeSelection
