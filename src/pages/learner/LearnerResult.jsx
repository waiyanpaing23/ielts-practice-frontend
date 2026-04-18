import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaHome, FaCheckCircle, FaChartPie, FaTimesCircle, FaLightbulb, FaCalendarDay, FaGraduationCap } from 'react-icons/fa';
import api from '../../api/axios';

const LearnerResult = () => {
  const navigate = useNavigate();
  const { attemptId } = useParams(); 
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/attempts/${attemptId}`);
        if (response.data.success) {
          setResult(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load result", error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (attemptId) fetchResult();
  }, [attemptId, navigate]);

  if (!result || isLoading) return null;

  // --- IELTS Specific Helpers ---
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-indigo-500';
    return 'text-amber-500';
  };

  const getScoreStroke = (score) => {
    if (score >= 80) return '#10b981'; 
    if (score >= 60) return '#6366f1'; 
    return '#f59e0b'; 
  };

  // Keep this ONLY as a fallback for older attempts that didn't have bandScore saved in the DB
  const calculateBandScoreFallback = (correct, total) => {
    if (!total || total === 0) return '0.0';
    const percentage = correct / total;
    if (percentage >= 0.95) return '9.0';
    if (percentage >= 0.88) return '8.5';
    if (percentage >= 0.80) return '8.0';
    if (percentage >= 0.73) return '7.5';
    if (percentage >= 0.65) return '7.0';
    if (percentage >= 0.58) return '6.5';
    if (percentage >= 0.50) return '6.0';
    if (percentage >= 0.40) return '5.5';
    return '5.0';
  };

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((result.score || 0) / 100) * circumference;
  
  const testDate = result.createdAt 
    ? new Date(result.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // 👇 NEW: Extract values safely, handling both new and old database schemas
  const totalQs = result.totalQuestions || 0;
  const correctQs = result.rawScore !== undefined ? result.rawScore : (result.correctAnswers || 0);
  
  // Use the backend's smart band score if it exists (for Mini Practice), otherwise use fallback
  const finalBandScore = result.bandScore 
    ? result.bandScore.toFixed(1) 
    : calculateBandScoreFallback(correctQs, totalQs);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="max-w-7xl mx-auto mb-8 pb-6 border-b border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase mb-2">
            <FaGraduationCap className="text-lg" />
            <span>Assessment Results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
             {result.testTitle || 'Reading Mini Practice'}
          </h1>
          {result.roomName && (
             <p className="text-gray-500 font-medium mt-1">{result.roomName}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-500 font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <FaCalendarDay className="text-gray-400" />
          <span>{testDate}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24 pt-1">
          <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden text-center relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-indigo-100/50"></div>
            <div className="relative pt-10 px-8 pb-8">
              
              <div className="w-36 h-36 mx-auto bg-white rounded-full shadow-lg border-4 border-white flex flex-col items-center justify-center relative z-10 mb-6">
                <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                  <circle cx="68" cy="68" r={radius} fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                  <circle cx="68" cy="68" r={radius} fill="transparent" stroke={getScoreStroke(result.score || 0)} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out"/>
                </svg>
                <span className={`text-4xl font-black ${getScoreColor(result.score || 0)}`}>{result.score || 0}%</span>
              </div>

              <div className="inline-block bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-3 mb-8">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Estimated Band</p>
                <p className="text-3xl font-black text-indigo-700">
                  {finalBandScore}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100">
                  <FaCheckCircle className="text-green-500 mx-auto text-2xl mb-2" />
                  {/* 👇 FIXED: Using correctQs mapped from rawScore */}
                  <p className="text-2xl font-bold text-gray-900">{correctQs}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Correct</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100">
                  <FaChartPie className="text-indigo-500 mx-auto text-2xl mb-2" />
                  {/* 👇 FIXED: Using totalQs mapped safely */}
                  <p className="text-2xl font-bold text-gray-900">{totalQs}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all shadow-md flex items-center justify-center gap-2"
              >
                <FaHome /> Return to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="flex items-center justify-between mb-2 px-2 hidden lg:flex">
            <h2 className="text-2xl font-extrabold text-gray-900">Detailed Review</h2>
            <span className="text-sm font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">{totalQs} Questions</span>
          </div>

          {result.analysis && result.analysis.length > 0 ? (
            // 👇 FIXED: Added fallback for item.id vs item.question_id
            result.analysis.map((item, index) => (
              <div key={item.question_id || item.id || index} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 border ${item.isCorrect ? 'border-l-green-500 border-gray-200' : 'border-l-red-500 border-red-100'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`mt-1 flex-shrink-0 ${item.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {item.isCorrect ? <FaCheckCircle className="text-xl" /> : <FaTimesCircle className="text-xl" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Question {index + 1}</p>
                    <p className="font-semibold text-gray-900 text-lg">{item.content}</p>
                  </div>
                </div>

                <div className="ml-9 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 w-24">Your Answer:</span>
                    <span className={`font-bold px-2 py-1 rounded ${item.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700 line-through'}`}>
                      {item.studentAnswer}
                    </span>
                  </div>
                  
                  {!item.isCorrect && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 w-24">Correct Answer:</span>
                      <span className="font-bold px-2 py-1 rounded bg-green-50 text-green-700">
                        {item.correctAnswer}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-left">
                    <FaLightbulb className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Explanation</p>
                      <p className="text-sm text-blue-900 leading-relaxed font-medium">
                        {item.explanation || 'No explanation provided for this question.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
              <FaLightbulb className="text-gray-300 w-12 h-12 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Detailed review data is not available for this older test.</p>
              <p className="text-sm text-gray-400 mt-1">Take a new assessment to see your full analysis.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LearnerResult;