import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaSpinner, FaExclamationTriangle, FaBookOpen } from 'react-icons/fa';
import api from '../../api/axios';
import socket from '../../api/socket';

const LiveAssessment = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  const getStudentId = () => {
    // 1. Check for a logged-in user (in either local or session storage)
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        return userObj._id || userObj.id || 'unknown';
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
    // 2. Fallback to Guest ID
    return localStorage.getItem('guestId') || 'unknown';
  };

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit('join-room', roomId);
    
    return () => {
      //
    };
  }, [roomId]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const guestId = localStorage.getItem('guestId');

        const response = await api.get(`/rooms/${roomId}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'x-guest-id': guestId || ''
          }
        });

        const room = response.data.data;

        if (room.status === 'waiting') {
          alert("The tutor has not started this assessment yet. Please wait in the lobby.");
          navigate(`/learner/lobby/${roomId}`);
          return;
        }
        
        if (!room.test || !room.test.reading_sets || room.test.reading_sets.length === 0) {
          alert("The test for this room is empty or hasn't been fully configured.");
          navigate('/');
          return;
        }

        setRoomData(room);
        setTestData(room.test);

        const savedAnswers = localStorage.getItem(`answers_${roomId}`);
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }

        // const savedEndTime = localStorage.getItem(`endTime_${roomId}`);
        // if (savedEndTime) {
        //   const remainingSeconds = Math.floor((parseInt(savedEndTime) - Date.now()) / 1000);
        //   setTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);
        // } else {
        //   const timeToUse = room.customTimeLimit || room.test.timeLimit || 60;
        //   const totalSeconds = timeToUse * 60;
        //   setTimeLeft(totalSeconds);
        //   localStorage.setItem(`endTime_${roomId}`, Date.now() + (totalSeconds * 1000));
        // }
        
        const timeToUse = room.customTimeLimit || room.test.timeLimit || 60;
        setTimeLeft(timeToUse * 60);
        
        setIsLoading(false);

      } catch (error) {
        console.error("Failed to load assessment:", error);
        alert("Failed to load the assessment. Please check your connection.");
        navigate('/');
      }
    };

    fetchExamData();
  }, [roomId, navigate]);


  useEffect(() => {
    if (timeLeft <= 0 || isLoading) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isLoading]);


  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      // Backup instantly to browser storage
      localStorage.setItem(`answers_${roomId}`, JSON.stringify(newAnswers));

      const studentId = getStudentId();
      const answeredCount = Object.keys(newAnswers).length;

      socket.emit('student-progress-update', {
        roomId,
        studentId,
        answeredCount,
        currentPart: activeSetIndex + 1
      });

      return newAnswers;
    });
  };


  const handleTabChange = (index) => {
    setActiveSetIndex(index);
    
    const studentId = getStudentId();
    
    socket.emit('student-progress-update', {
      roomId,
      studentId,
      answeredCount: Object.keys(answers).length,
      currentPart: index + 1
    });
  };


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = () => {
    alert("Time is up! Submitting your assessment.");
    submitExam();
  };

  const handleManualSubmit = () => {
    if (window.confirm("Are you sure you want to submit your assessment? You cannot change your answers after this.")) {
      submitExam();
    }
  };

  const submitExam = async () => {
    try {
      setIsLoading(true);
      
      const studentId = getStudentId();
      
      const currentAnswers = JSON.parse(localStorage.getItem(`answers_${roomId}`)) || answers;
      
      // 1. Send the answers to your new grading engine
      const response = await api.post(`/rooms/${roomId}/submit`, {
        answers: currentAnswers,
        studentId: studentId
      });

      if (response.data.success) {
        console.log(`Scored: ${response.data.data.score}%`);
        
        // Clean up browser storage
        localStorage.removeItem('activeRoomId');
        localStorage.removeItem(`answers_${roomId}`);
        localStorage.removeItem(`endTime_${roomId}`);

        const attemptId = response.data.data.attemptId;
        navigate(`/learner/assessment/result/${attemptId}`);
      }
    } catch (error) {
      console.error("Failed to submit exam:", error);
      alert("There was an error saving your exam. Please do not close the window, and contact your tutor.");
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (!socket) return;

    const handleRoomEnded = () => {
      alert("The tutor has ended the assessment. Submitting your current answers...");
      submitExam(); 
    };

    socket.on('room-ended', handleRoomEnded);

    return () => {
      socket.off('room-ended', handleRoomEnded);
    };
  }, [roomId, navigate]);


  if (isLoading || !testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-indigo-600 w-12 h-12 mb-4" />
        <p className="text-gray-500 font-bold text-lg tracking-wider uppercase">Loading Assessment...</p>
      </div>
    );
  }

  const activeSet = testData.reading_sets[activeSetIndex];

  const renderQuestionInput = (q) => {
    const type = q.question_type;

    // 1. Radio Buttons (Multiple Choice, True/False, Yes/No)
    if (['multiple_choice', 'true_false_not_given', 'yes_no_not_given'].includes(type)) {
      return (
        <div className="space-y-3">
          {q.options?.map((opt, i) => (
            <label key={i} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              answers[q._id] === opt 
                ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}>
              <input 
                type="radio" 
                name={`question_${q._id}`} 
                value={opt}
                checked={answers[q._id] === opt}
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className={`font-medium ${answers[q._id] === opt ? 'text-indigo-900' : 'text-gray-700'}`}>
                {opt}
              </span>
            </label>
          ))}
        </div>
      );
    }

    // 2. Dropdown (Matching Headings)
    if (type === 'matching_headings') {
      return (
        <select
          value={answers[q._id] || ''}
          onChange={(e) => handleAnswerChange(q._id, e.target.value)}
          className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900 bg-white cursor-pointer"
        >
          <option value="" disabled>Select a heading...</option>
          {q.options?.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    // 3. Default to Text Input (Fill in the Blank, short answer, etc)
    return (
      <input 
        type="text"
        value={answers[q._id] || ''}
        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
        placeholder="Type your exact answer here..."
        className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900"
      />
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 flex-none flex flex-col z-50">
        <div className="w-full px-6 h-20 flex items-center justify-between">
          <div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold uppercase tracking-wider mb-1 inline-block">
              {roomData?.code || 'ROOM'}
            </span>
            <h1 className="text-xl font-bold text-gray-900 truncate">{testData.title}</h1>
          </div>
          
          <div className="flex items-center gap-6">

            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-100">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
              Session Synced
            </span>
          </div>

            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xl font-bold transition-colors ${
              timeLeft < 300 ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              <FaClock className={timeLeft < 300 ? 'text-red-500' : 'text-gray-500'} />
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={handleManualSubmit}
              className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <FaCheckCircle /> Submit Test
            </button>
          </div>
        </div>

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

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-white border-t border-gray-200">
        
        {/* LEFT COLUMN: Active Reading Passage */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200 bg-white overflow-y-auto p-8 lg:p-12 shadow-[inset_-10px_0_20px_-20px_rgba(0,0,0,0.1)]">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-bold uppercase tracking-wider mb-6">
              <FaBookOpen /> Reading Passage {activeSetIndex + 1}
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 leading-tight">
              {activeSet?.title || `Section ${activeSetIndex + 1}`}
            </h2>
            
              {activeSet?.content ? (
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
                  "
                  dangerouslySetInnerHTML={{ __html: activeSet.content }} 
                />
              ) : (
                <p className="text-gray-400 italic">No passage text provided.</p>
              )}
            </div>
          </div>

        {/* RIGHT COLUMN: Active Questions */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-gray-50 overflow-y-auto p-8 lg:p-12">
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
                    {renderQuestionInput(q)}
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

export default LiveAssessment;