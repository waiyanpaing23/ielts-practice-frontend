import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaClock, FaSignOutAlt, FaPaperPlane, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../api/axios';

const MiniPractice = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const difficulty = searchParams.get('difficulty') || 'medium';
    const isTimed = searchParams.get('timed') === 'true';

    const [testData, setTestData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [timeLeft, setTimeLeft] = useState(20 * 60); 
    const timerRef = useRef(null);

    // --- 1. Fetch Data & Restore Session ---
    useEffect(() => {
        const fetchPractice = async () => {
            try {
                const response = await api.get(`/tests/mini-practice?difficulty=${difficulty}`);
                if (response.data.success) {
                    const data = response.data.data;
                    setTestData(data);

                    // 🐛 BUGFIX: Restore answers if they refreshed the page!
                    const savedAnswers = sessionStorage.getItem(`practice_answers_${data.testId}`);
                    if (savedAnswers) {
                        setAnswers(JSON.parse(savedAnswers));
                    }
                }
            } catch (err) {
                console.error("Failed to load practice:", err);
                setError("Could not load the practice test. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPractice();
    }, [difficulty]);

    // --- 2. Refresh-Proof Timer Logic ---
    useEffect(() => {
        if (!isLoading && isTimed && testData && !isSubmitting) {
            const timeKey = `practice_endTime_${testData.testId}`;
            let endTime = sessionStorage.getItem(timeKey);

            // If no end time exists, set it 20 mins into the future
            if (!endTime) {
                endTime = Date.now() + 20 * 60 * 1000;
                sessionStorage.setItem(timeKey, endTime);
            }

            const updateTimer = () => {
                const remaining = Math.floor((parseInt(endTime) - Date.now()) / 1000);
                if (remaining <= 0) {
                    setTimeLeft(0);
                    clearInterval(timerRef.current);
                } else {
                    setTimeLeft(remaining);
                }
            };

            updateTimer(); // Initial check
            timerRef.current = setInterval(updateTimer, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [isLoading, isTimed, testData, isSubmitting]);

    // Format timer for UI
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // --- 3. Handle Auto-Submit when Time hits 0 ---
    useEffect(() => {
        if (timeLeft === 0 && isTimed && testData && !isSubmitting) {
            alert("Time is up! Submitting your answers automatically.");
            submitTest(answers);
        }
    }, [timeLeft]);

    // --- 4. User Inputs & Submission ---
    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => {
            const newAnswers = { ...prev, [questionId]: value };
            // Save to session storage so they survive a page refresh
            if (testData) {
                sessionStorage.setItem(`practice_answers_${testData.testId}`, JSON.stringify(newAnswers));
            }
            return newAnswers;
        });
    };

    // Clear the storage so the next test starts fresh
    const clearSessionStorage = () => {
        if (testData) {
            sessionStorage.removeItem(`practice_endTime_${testData.testId}`);
            sessionStorage.removeItem(`practice_answers_${testData.testId}`);
        }
    };

    const submitTest = async (finalAnswers) => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const guestId = localStorage.getItem('guestId') || sessionStorage.getItem('guestId');

            const response = await api.post('/attempts/practice-submit', {
                testId: testData.testId, 
                readingSetId: testData.reading_sets[0]._id, 
                answers: finalAnswers,
                timeSpent: (20 * 60) - timeLeft 
            }, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'x-guest-id': guestId || ''
                }
            });

            if (response.data.success) {
                clearSessionStorage(); // Success! Clean up storage.
                navigate(`/learner/assessment/result/${response.data.data.attemptId}`);
            }
        } catch (err) {
            console.error("Submission failed:", err);
            alert("Failed to submit test. Please check your connection.");
            setIsSubmitting(false);
        }
    };

    const handleManualSubmit = () => {
        if (window.confirm("Are you sure you want to submit your practice test?")) {
            submitTest(answers);
        }
    };

    const handleExit = () => {
        if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
            clearSessionStorage();
            navigate('/practice');
        }
    };

    // --- Helpers for Question Rendering ---
    const getOptionsForQuestion = (question) => {
        // If the DB provided options, use them!
        if (question.options && question.options.length > 0) return question.options;
        
        // 🐛 BUGFIX: If no options are in DB, but it is a T/F/NG question, force the options!
        if (question.question_type === 'true_false_not_given') return ['True', 'False', 'Not Given'];
        if (question.question_type === 'yes_no_not_given') return ['Yes', 'No', 'Not Given'];
        
        return [];
    };

    const isRadioQuestion = (question) => {
        const options = getOptionsForQuestion(question);
        return options.length > 0 || question.question_type === 'multiple_choice';
    };

    // --- Loading & Error UI ---
    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-indigo-600 w-12 h-12 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-wider">Preparing your passage...</p>
        </div>
    );

    if (error || !testData || !testData.reading_sets[0]) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
            <FaExclamationTriangle className="text-red-500 w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error || "Something went wrong loading the test."}</p>
            <button onClick={() => navigate('/practice')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Go Back</button>
        </div>
    );

    const passage = testData.reading_sets[0];

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            
            {/* TOP NAVBAR */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleExit}
                        className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                    >
                        <FaSignOutAlt /> Exit
                    </button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <h1 className="text-xl font-extrabold text-gray-900 hidden sm:block">
                        {testData.testTitle}
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    {isTimed && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg border-2 ${
                            timeLeft <= 300 ? 'border-red-200 bg-red-50 text-red-600 animate-pulse' : 'border-gray-200 bg-gray-50 text-gray-700'
                        }`}>
                            <FaClock className={timeLeft <= 300 ? 'text-red-500' : 'text-indigo-500'} />
                            {formatTime(timeLeft)}
                        </div>
                    )}

                    <button 
                        onClick={handleManualSubmit}
                        disabled={isSubmitting}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                        Submit
                    </button>
                </div>
            </header>

            {/* SPLIT SCREEN LAYOUT */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                
                {/* LEFT SIDE: Reading Passage */}
                <section className="w-full lg:w-1/2 h-full bg-white border-r border-gray-200 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                    <div className="max-w-2xl mx-auto">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-md mb-4 inline-block">
                            Difficulty: {testData.difficulty}
                        </span>
                        <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                            {passage.title}
                        </h2>
                        <div 
                            className="prose prose-lg prose-indigo text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: passage.content }}
                        />
                    </div>
                </section>

                {/* RIGHT SIDE: Questions */}
                <section className="w-full lg:w-1/2 h-full bg-gray-50 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <h3 className="text-xl font-extrabold text-gray-900">Questions</h3>
                            <p className="text-gray-500 text-sm mt-1">Answer all questions based on the passage.</p>
                        </div>

                        {passage.questions.map((question, index) => (
                            <div key={question._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 font-bold rounded-lg flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-lg mb-4">
                                            {question.content}
                                        </p>
                                        
                                        {/* 🐛 BUGFIX: Dynamic Rendering based on isRadioQuestion helper */}
                                        {isRadioQuestion(question) ? (
                                            <div className="space-y-3">
                                                {getOptionsForQuestion(question).map((opt, i) => (
                                                    <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                                                        <input 
                                                            type="radio" 
                                                            name={`q_${question._id}`}
                                                            value={opt}
                                                            checked={answers[question._id] === opt}
                                                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-gray-700 font-medium">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <input 
                                                type="text"
                                                value={answers[question._id] || ''}
                                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                                placeholder="Type your answer here..."
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MiniPractice;