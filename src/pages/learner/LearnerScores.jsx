import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHistory, FaCalendarAlt, FaCheckCircle, FaChartBar, 
  FaSpinner, FaTrophy, FaArrowLeft, FaChevronRight, FaGraduationCap
} from 'react-icons/fa';
import api from '../../api/axios';

const LearnerScores = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 👇 FIXED: Check both storage locations!
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const guestId = localStorage.getItem('guestId') || sessionStorage.getItem('guestId');

        const response = await api.get('/attempts/history', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'x-guest-id': guestId || ''
          }
        });

        if (response.data.success) {
          setHistory(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Failed to load your score history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // 👇 FIXED: Use 'percentage' for the overall math
  const totalTests = history.length;
  const averageScore = totalTests > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests) 
    : 0;
  const highestBand = totalTests > 0 
    ? Math.max(...history.map(h => h.bandScore)) 
    : 0;

  const getScoreBadgeColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (percentage >= 60) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-indigo-600 w-12 h-12 mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-wider">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 transition-colors"
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <FaHistory className="text-indigo-500" /> My Assessment History
            </h1>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center font-medium">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FaChartBar className="text-gray-300 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tests taken yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Once you complete an assessment, your score and detailed history will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                  <FaCheckCircle />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tests Taken</p>
                  <p className="text-3xl font-black text-gray-900">{totalTests}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                  <FaChartBar />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Score</p>
                  <p className="text-3xl font-black text-gray-900">{averageScore}%</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-xl">
                  <FaTrophy />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Highest Band</p>
                  <p className="text-3xl font-black text-gray-900">{highestBand.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* History Table/List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">Recent Assessments</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {history.map((record, index) => (
                  <div key={record.attemptId || index} 
                    onClick={() => navigate(`/learner/assessment/result/${record.attemptId}`)}
                    className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                  >
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 mt-1 sm:mt-0">
                        <FaCalendarAlt />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          {record.testTitle}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                          <span>{new Date(record.dateCompleted).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>
                            {record.roomName === 'Self Practice' ? 'Mode: ' : 'Room: '}
                            <span className={record.roomName === 'Self Practice' ? 'text-indigo-500 font-bold' : ''}>
                                {record.roomName}
                            </span>
                            </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0">
                      
                      {/* 👇 NEW: Displaying IELTS Band and Percentage! */}
                      <div className="text-right flex items-center gap-4">
                        <div className="hidden md:block">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Score</p>
                          <span className="text-gray-500 font-medium">{record.percentage}%</span>
                        </div>
                        
                        <div className={`px-4 py-2 rounded-xl border-2 flex flex-col items-center justify-center min-w-[80px] ${getScoreBadgeColor(record.percentage)}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5">Band</span>
                          <span className="text-xl font-black leading-none">{Number(record.bandScore).toFixed(1)}</span>
                        </div>
                      </div>

                      <FaChevronRight className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default LearnerScores;