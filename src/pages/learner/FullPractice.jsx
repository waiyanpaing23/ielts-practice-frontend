// src/pages/FullPractice.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaSpinner, FaBookOpen } from 'react-icons/fa';
import api from '../../api/axios';
import QuestionRenderer from '../../components/QuestionRenderer'; // Import our shared UI!

const FullPractice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId'); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  
  // Default to 60 mins (3600 seconds)
  const [timeLeft, setTimeLeft] = useState(60 * 60); 
  const timerRef = useRef(null);
  const passageRef = useRef(null);
  const questionsRef = useRef(null);

  // --- 1. Fetch Full Test Data & Restore Session ---
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        // Fetch the full test (Assuming you have a standard GET /tests/:id route)
        const response = await api.get(`/tests/${testId}`);
        
        if (response.data.success) {
          setTestData(response.data.data);
          
          // Restore answers if page refreshes
          const savedAnswers = sessionStorage.getItem(`full_answers_${testId}`);
          if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
        }
      } catch (error) {
        console.error("Failed to load test:", error);
        alert("Failed to load the practice test.");
        navigate('/practice');
      } finally {
        setIsLoading(false);
      }
    };

    if (testId) fetchExamData();
  }, [testId, navigate]);

  // --- 2. Refresh-Proof Timer Logic ---
  useEffect(() => {
    if (!isLoading && testData && !isSubmitting) {
      const timeKey = `full_endTime_${testId}`;
      let endTime = sessionStorage.getItem(timeKey);

      if (!endTime) {
        // 60 minutes from now
        endTime = Date.now() + (60 * 60 * 1000); 
        sessionStorage.setItem(timeKey, endTime);
      }

      const updateTimer = () => {
        const remaining = Math.floor((parseInt(endTime) - Date.now()) / 1000);
        if (remaining <= 0) {
          setTimeLeft(0);
          clearInterval(timerRef.current);
          handleAutoSubmit();
        } else {
          setTimeLeft(remaining);
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isLoading, testData, isSubmitting]);

  // Auto scroll to top on tab change
  useEffect(() => {
    if (passageRef.current) passageRef.current.scrollTop = 0;
    if (questionsRef.current) questionsRef.current.scrollTop = 0;
  }, [activeSetIndex]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- 3. Handle Interactions ---
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      sessionStorage.setItem(`full_answers_${testId}`, JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  const handleTabChange = (index) => {
    setActiveSetIndex(index);
  };

  // --- 4. Submission Logic ---
  const submitExam = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const guestId = localStorage.getItem('guestId') || sessionStorage.getItem('guestId');

      // We will build this backend route next!
      const response = await api.post('/attempts/full-practice-submit', {
        testId: testId,
        answers: answers,
        timeSpent: (60 * 60) - timeLeft
      }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'x-guest-id': guestId || ''
        }
      });

      if (response.data.success) {
        sessionStorage.removeItem(`full_endTime_${testId}`);
        sessionStorage.removeItem(`full_answers_${testId}`);
        navigate(`/learner/assessment/result/${response.data.data.attemptId}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit. Check your connection.");
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = () => {
    if (window.confirm("Submit your full mock test for grading?")) submitExam();
  };

  const handleAutoSubmit = () => {
    alert("Time is up! Submitting your test automatically.");
    submitExam();
  };

  // --- Rendering ---
  if (isLoading || !testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-indigo-600 w-12 h-12 mb-4" />
        <p className="text-gray-500 font-bold tracking-wider uppercase">Loading Full Test...</p>
      </div>
    );
  }

  const activeSet = testData.reading_sets[activeSetIndex];

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 flex-none flex flex-col z-50">
        <div className="w-full px-6 h-20 flex items-center justify-between">
          <div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold uppercase tracking-wider mb-1 inline-block">
              Self Practice
            </span>
            <h1 className="text-xl font-bold text-gray-900 truncate">{testData.title}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xl font-bold transition-colors ${
              timeLeft < 300 ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              <FaClock className={timeLeft < 300 ? 'text-red-500' : 'text-gray-500'} />
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} 
              Submit Test
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="w-full bg-gray-100 px-6 flex items-center gap-2 pt-2">
          {testData.reading_sets.map((set, index) => (
            <button
              key={set._id || index}
              onClick={() => handleTabChange(index)}
              className={`px-6 py-3 font-bold rounded-t-xl transition-colors border-t border-l border-r ${
                activeSetIndex === index 
                  ? 'bg-white text-indigo-700 border-gray-200 border-b-white translate-y-[1px]' 
                  : 'bg-gray-200 text-gray-500 border-transparent hover:bg-gray-300'
              }`}
            >
              Part {index + 1}
            </button>
          ))}
        </div>
      </header>

      {/* SPLIT SCREEN WORKSPACE */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-white border-t border-gray-200">
        
        {/* LEFT: Passage */}
        <div ref={passageRef} className="w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200 bg-white overflow-y-auto p-8 lg:p-12 shadow-[inset_-10px_0_20px_-20px_rgba(0,0,0,0.1)]">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-bold uppercase tracking-wider mb-6">
              <FaBookOpen /> Reading Passage {activeSetIndex + 1}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 leading-tight">
              {activeSet?.title || `Section ${activeSetIndex + 1}`}
            </h2>
            <div 
              className="
                    text-gray-700 leading-relaxed 
                    [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:mb-6 [&_h2]:mt-2
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mb-4 [&_h3]:mt-6
                    [&_p]:mb-5 [&_p]:text-lg
                    [&_strong]:font-bold [&_strong]:text-gray-900
                    [&_em]:italic
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5
                    break-words whitespace-pre-wrap [&_*]:whitespace-pre-wrap
                  "
              dangerouslySetInnerHTML={{ __html: activeSet?.content || '' }} 
            />
          </div>
        </div>

        {/* RIGHT: Questions */}
        <div ref={questionsRef} className="w-full lg:w-1/2 h-1/2 lg:h-full bg-gray-50 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-2xl mx-auto pb-20">
            <h3 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Questions for Part {activeSetIndex + 1}
            </h3>
            <div className="space-y-8">
              {activeSet?.questions?.map((q, index) => (
                <div key={q._id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-indigo-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{q.content}</span>
                  </h3>
                  <div className="ml-11">
                    {/* 👇 THIS IS WHERE WE USE OUR REUSABLE COMPONENT! 👇 */}
                    <QuestionRenderer 
                      q={q} 
                      currentAnswer={answers[q._id]} 
                      onChange={handleAnswerChange} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default FullPractice;