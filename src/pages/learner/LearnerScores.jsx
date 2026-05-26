import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHistory, FaCalendarAlt, FaCheckCircle, FaChartBar, 
  FaSpinner, FaTrophy, FaArrowLeft, FaChevronRight, FaGraduationCap,
  FaStar,
  FaExclamationTriangle
} from 'react-icons/fa';
import api from '../../api/axios';
import { formatQuestionType } from '../../utils/formatters';

const LearnerScores = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const guestId = localStorage.getItem('guestId') || sessionStorage.getItem('guestId');
        
        const headers = {
          'Authorization': token ? `Bearer ${token}` : '',
          'x-guest-id': guestId || ''
        };

        const [historyRes, insightsRes] = await Promise.all([
          api.get('/attempts/history', { headers }),
          api.get('/attempts/lifetime-insights', { headers }).catch(() => ({ data: { success: false, data: [] } }))
        ]);

        if (historyRes.data.success) {
          setHistory(historyRes.data.data);
        }
        
        if (insightsRes.data && insightsRes.data.success) {
          setInsights(insightsRes.data.data);
        }

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load your score history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

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

  const topSkill = insights.length > 0 ? insights[0] : null;
  const worstSkill = insights.length > 1 ? insights[insights.length - 1] : null;

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

            {insights.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Skill Analysis</h3>
                  <span className="text-xs font-bold text-gray-400 uppercase bg-white px-3 py-1 rounded-full border border-gray-200">Based on all attempts</span>
                </div>
                
                <div className="p-6">
                  {/* Highlights */}
                  {topSkill && worstSkill && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-green-100 text-green-600 p-3 rounded-full"><FaStar /></div>
                        <div>
                          <p className="text-xs font-bold text-green-600 uppercase">Top Strength</p>
                        <p className="font-bold text-gray-900">{formatQuestionType(topSkill.questionType)}</p>
                          <p className="text-sm text-green-700 font-medium">{topSkill.winRate}% Accuracy</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-amber-100 text-amber-600 p-3 rounded-full"><FaExclamationTriangle /></div>
                        <div>
                          <p className="text-xs font-bold text-amber-600 uppercase">Needs Focus</p>
                          <p className="font-bold text-gray-900">{formatQuestionType(worstSkill.questionType)}</p>
                          <p className="text-sm text-amber-700 font-medium">{worstSkill.winRate}% Accuracy</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Progress Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {insights.map((insight, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-semibold text-gray-700">{formatQuestionType(insight.questionType) || 'General'}</span>
                          <span className="text-sm font-bold text-gray-900">{insight.winRate}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              insight.winRate >= 80 ? 'bg-green-500' : 
                              insight.winRate >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.max(insight.winRate, 5)}%` }} 
                          ></div>
                        </div>
                        <p className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider text-right">
                          {insight.totalCorrect} / {insight.totalAttempted} Correct
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
                      
                      {/* IELTS Band and Percentage */}
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