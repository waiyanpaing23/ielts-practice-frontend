import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaTrophy, FaMedal, FaTimes, FaCheckCircle, FaTimesCircle, 
  FaLightbulb, FaSpinner, FaChartLine, FaUsers, FaStar 
} from 'react-icons/fa';
import api from '../../api/axios'; 

const TutorLeaderboard = ({ roomId: propRoomId }) => {
  const { roomId: urlRoomId } = useParams();
  const roomId = propRoomId || urlRoomId;

  const [students, setStudents] = useState([]);
  const [roomInfo, setRoomInfo] = useState({ roomName: '', testTitle: '' });
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer State
  const [selectedAttemptId, setSelectedAttemptId] = useState(null);
  const [studentPaper, setStudentPaper] = useState(null);
  const [isPaperLoading, setIsPaperLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get(`/rooms/${roomId}/leaderboard`);
        if (response.data.success) {
          setStudents(response.data.data.leaderboard);
          setRoomInfo({
            roomName: response.data.data.roomName,
            testTitle: response.data.data.testTitle
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (roomId) fetchLeaderboard();
  }, [roomId]);

  const viewStudentPaper = async (attemptId) => {
    setSelectedAttemptId(attemptId);
    setIsPaperLoading(true);
    try {
      const response = await api.get(`/attempts/${attemptId}`);
      if (response.data.success) {
        setStudentPaper(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load paper", error);
    } finally {
      setIsPaperLoading(false);
    }
  };

  // --- Derived Analytics ---
  const totalStudents = students.length;
  const highestScore = totalStudents > 0 ? Math.max(...students.map(s => s.score)) : 0;
  const averageScore = totalStudents > 0 ? Math.round(students.reduce((acc, curr) => acc + curr.score, 0) / totalStudents) : 0;
  const top5 = students.slice(0, 5);

  // Quick Band Score Estimator based on Percentage
  const getEstimatedBand = (percentage) => {
    if (percentage >= 95) return '9.0';
    if (percentage >= 88) return '8.5';
    if (percentage >= 80) return '8.0';
    if (percentage >= 73) return '7.5';
    if (percentage >= 65) return '7.0';
    if (percentage >= 58) return '6.5';
    if (percentage >= 50) return '6.0';
    if (percentage >= 40) return '5.5';
    return '5.0';
  };

  const getRankStyle = (index) => {
    if (index === 0) return { color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (index === 1) return { color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-200' };
    if (index === 2) return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { color: 'text-indigo-400', bg: 'bg-gray-50', border: 'border-gray-100' };
  };

  if (isLoading) return <div className="text-center p-20"><FaSpinner className="animate-spin text-indigo-600 w-10 h-10 mx-auto" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 rounded-lg py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3 text-indigo-600 font-bold tracking-wider text-xs uppercase mb-3">
            <span className="bg-indigo-100 px-3 py-1 rounded-md border border-indigo-200">
              {roomInfo.roomName ? roomInfo.roomName.replace(/^Room:\s*/i, '') : 'ROOM'}
            </span>
            <span>Assessment Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {roomInfo.testTitle || 'Loading Assessment...'}
          </h1>
          <p className="text-gray-500 font-medium mt-2">Review class performance and individual learner papers.</p>
        </div>
        
        {/* ========================================== */}
        {/* ROW 1: Analytics & Podium                  */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Analytics Overview */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">
                <FaStar />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Highest Score</p>
                <p className="text-3xl font-black text-gray-900">{highestScore}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl">
                <FaChartLine />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Class Average</p>
                <p className="text-3xl font-black text-gray-900">{averageScore}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">
                <FaUsers />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Submissions</p>
                <p className="text-3xl font-black text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Top 5 Leaderboard */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gray-900 px-6 py-4 flex items-center gap-3">
              <FaTrophy className="text-yellow-400 text-xl" />
              <h2 className="text-lg font-bold text-white">Top Performers</h2>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-3 justify-center">
              {top5.length === 0 ? (
                <p className="text-center text-gray-500 font-medium">No results submitted yet.</p>
              ) : (
                top5.map((learner, index) => {
                  const style = getRankStyle(index);
                  return (
                    <div 
                      key={learner.attemptId}
                      onClick={() => viewStudentPaper(learner.attemptId)}
                      className={`flex items-center justify-between p-4 rounded-xl border ${style.border} ${style.bg} hover:shadow-md transition-all cursor-pointer group`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center font-black text-lg bg-white rounded-full shadow-sm">
                          {index < 3 ? <FaMedal className={`text-xl ${style.color}`} /> : <span className="text-gray-400 text-sm">#{index + 1}</span>}
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{learner.name}</h3>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-bold text-gray-500 text-sm hidden sm:block">{learner.correctAnswers} Correct</span>
                        <span className="text-xl font-black text-gray-900">{learner.score}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* ========================================== */}
        {/* ROW 2: All Learners Grid                   */}
        {/* ========================================== */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">All Learner Results</h2>
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden">
            {students.map((learner) => (
              <div 
                key={learner.attemptId} 
                className="w-80 flex-shrink-0 snap-start bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl border border-indigo-100">
                    {learner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Est. Band</p>
                    <p className="text-xl font-black text-indigo-600">{getEstimatedBand(learner.score)}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{learner.name}</h3>
                <p className="text-gray-500 font-medium text-sm mb-6">Final Score: {learner.score}%</p>
                
                <button 
                  onClick={() => viewStudentPaper(learner.attemptId)}
                  className="mt-auto w-full py-2.5 bg-gray-50 hover:bg-indigo-50 text-indigo-600 font-bold rounded-xl border border-gray-200 hover:border-indigo-200 transition-colors"
                >
                  View Full Paper
                </button>
              </div>
            ))}
            {students.length === 0 && (
               <p className="text-gray-500 col-span-full">Waiting for students to submit...</p>
            )}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* SLIDE-OUT PAPER REVIEW DRAWER (Unchanged)  */}
      {/* ========================================== */}
      {selectedAttemptId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedAttemptId(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-gray-50 h-full shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">Student Paper Review</h3>
              <button onClick={() => setSelectedAttemptId(null)} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors">
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              {isPaperLoading || !studentPaper ? (
                 <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-indigo-600 w-10 h-10" /></div>
              ) : (
                <div className="space-y-6">
                  <div className="flex gap-4 mb-8">
                     <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 text-center shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Final Score</p>
                        <p className="text-3xl font-black text-indigo-600">{studentPaper.score}%</p>
                     </div>
                     <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 text-center shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Correct</p>
                        <p className="text-3xl font-black text-green-500">{studentPaper.correctAnswers} / {studentPaper.totalQuestions}</p>
                     </div>
                  </div>

                  {studentPaper.analysis.map((item, index) => (
                    <div key={item.id} className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 border ${item.isCorrect ? 'border-l-green-500 border-gray-200' : 'border-l-red-500 border-red-100'}`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`mt-1 flex-shrink-0 ${item.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                          {item.isCorrect ? <FaCheckCircle className="text-lg" /> : <FaTimesCircle className="text-lg" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Question {index + 1}</p>
                          <p className="font-semibold text-gray-800 text-base">{item.content}</p>
                        </div>
                      </div>

                      <div className="ml-8 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500 w-24">Student:</span>
                          <span className={`font-bold px-2 py-1 rounded ${item.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700 line-through'}`}>
                            {item.studentAnswer}
                          </span>
                        </div>
                        {!item.isCorrect && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 w-24">Correct:</span>
                            <span className="font-bold px-2 py-1 rounded bg-green-50 text-green-700">{item.correctAnswer}</span>
                          </div>
                        )}
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                          <FaLightbulb className="text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-900 font-medium">{item.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorLeaderboard;