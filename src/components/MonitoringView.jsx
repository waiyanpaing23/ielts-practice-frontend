import React from 'react';
import { FaStopCircle, FaClock, FaCheckCircle, FaWifi, FaExclamationTriangle } from 'react-icons/fa';

const MonitoringView = ({ roomData, students, timeLeft, onEndAssessment, formatTime, liveProgress }) => {
  
  // Calculate total questions for the progress bar
  const totalQuestions = roomData.test?.reading_sets?.reduce((acc, set) => acc + (set.questions?.length || 0), 0) || 0;

  const getMilestoneText = (answered, total) => {
    if (total === 0) return "Loading...";
    const percentage = (answered / total) * 100;
    
    if (percentage === 0) return "Just Started";
    if (percentage < 25) return "Warming Up";
    if (percentage < 50) return "Making Progress";
    if (percentage >= 50 && percentage < 75) return "Over Halfway";
    if (percentage >= 75 && percentage < 99) return "Almost There";
    return "Finalizing Answers";
  };


  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 h-screen flex flex-col">
      
      {/* Monitoring Header (Unchanged) */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="font-bold text-red-600 tracking-wider uppercase text-sm">Live Exam</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-bold font-mono ml-2">
              {roomData.code}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{roomData.test?.title}</h1>
        </div>

        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <div className={`flex flex-col items-center px-6 py-2 rounded-xl border ${
            timeLeft < 300 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
          }`}>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Time Remaining</span>
            <div className={`flex items-center gap-2 font-mono text-2xl font-black ${
              timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-gray-800'
            }`}>
              <FaClock /> {formatTime(timeLeft)}
            </div>
          </div>

          <button 
            onClick={onEndAssessment}
            className="px-6 py-3.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-colors flex items-center gap-2"
          >
            <FaStopCircle /> Force End
          </button>
        </div>
      </div>

      {/* Upgraded Student Grid */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">
            Active Students ({students.length})
          </h2>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1.5 text-green-600"><FaWifi /> Online</span>
            <span className="flex items-center gap-1.5 text-red-500"><FaExclamationTriangle /> Disconnected</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {students.map((p, index) => {
            
            // MOCK DATA
            // const mockState = {
            //   status: index === 1 ? 'disconnected' : index === 2 ? 'submitted' : 'testing',
            //   answeredCount: index === 0 ? 12 : index === 2 ? totalQuestions : 5,
            //   currentPart: index === 0 ? 2 : 1,
            //   isStuck: index === 0 
            // };
            const studentId = p.user?._id || p.guestId || p._id;
      
            const studentData = liveProgress[studentId] || {};
            
            const answeredCount = studentData.answeredCount || 0;
            const currentPart = studentData.currentPart || 1;
            
            // 3. The "Stuck" Math: Current Time - Last Active Time
            const lastActiveAt = studentData.lastActiveAt || Date.now();
            const isStuck = (Date.now() - lastActiveAt) > 180000;

            const status = p.hasFinished || p.status === 'submitted' ? 'submitted' : 'testing';
            const progressPercentage = status === 'submitted'
              ? 100
              : totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

            return (
              <div key={index} className={`p-5 rounded-2xl border-2 transition-all ${
                status === 'submitted' ? 'border-green-100 bg-green-50/30' : 
                status === 'disconnected' ? 'border-red-100 bg-red-50/30' : 
                'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md'
              }`}>
                
                {/* Header: Name & Status Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      status === 'submitted' ? 'bg-green-100 text-green-700' : 
                      status === 'disconnected' ? 'bg-red-100 text-red-700' : 
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {p.user ? p.user.fullName.charAt(0) : p.guestName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">
                        {p.user ? p.user.fullName : p.guestName}
                      </p>
                      
                      {/* Status Text */}
                      <p className={`text-xs font-bold uppercase tracking-wider mt-1 flex items-center gap-1 ${
                        status === 'submitted' ? 'text-green-600' : 
                        status === 'disconnected' ? 'text-red-500' : 
                        'text-indigo-600'
                      }`}>
                        {status === 'submitted' && <><FaCheckCircle /> Submitted</>}
                        {status === 'disconnected' && <><FaExclamationTriangle /> Offline</>}
                        {status === 'testing' && <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> Testing (Part {currentPart})</span>}
                        {status === 'testing' && isStuck && (
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-amber-200 shadow-sm animate-pulse">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Getting Stuck?
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                    <span>Progress</span>
                    <span className="text-indigo-600">
                      {status === 'submitted' 
                        ? "Completed" 
                        : getMilestoneText(answeredCount, totalQuestions)
                      }
                    </span>
                    
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        status === 'submitted' ? 'bg-green-500' : 
                        status === 'disconnected' ? 'bg-red-400' : 
                        'bg-indigo-600'
                      }`} 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default MonitoringView;