import React from 'react';
import { 
  FaCopy, 
  FaUsers, 
  FaPlay, 
  FaClock, 
  FaClipboardList, 
  FaSpinner, 
  FaCheckCircle,
  FaUserGraduate,
  FaTrash
} from 'react-icons/fa';

const LobbyView = ({ 
  roomData, 
  students, 
  onStartAssessment, 
  handleCopyCode, 
  copied, 
  handleCloseRoom, 
  isDeleting 
}) => {
  return (
    <div className="max-w-6xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
      
      {/* Top Section: Room Info & Invite Code */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-indigo-800 via-indigo-700 to-purple-900 relative">
          
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center md:text-left text-white flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-4 text-indigo-100 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Waiting for Students
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{roomData.name || 'Assessment Room'}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-indigo-100 text-sm font-medium mt-4">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg">
                <FaClipboardList className="text-indigo-300" />
                {roomData.test?.title || 'Assessment'}
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg">
                <FaClock className="text-indigo-300" />
                {roomData.test?.timeLimit || 60} Minutes
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center min-w-[280px]">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Room Code</p>
            <div className="text-5xl font-black text-gray-900 tracking-widest mb-4">
              {roomData.code || roomData.roomCode}
            </div>
            <button 
              onClick={handleCopyCode}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              {copied ? <><FaCheckCircle /> Copied!</> : <><FaCopy /> Copy Code</>}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Student Roster */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-3xl">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FaUsers className="text-indigo-500" /> Joined Students
            </h2>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
              {students.length} Total
            </span>
          </div>
          
          <div className="flex-1 p-6">
            {students.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                <FaUserGraduate className="w-16 h-16 mb-4 text-gray-200" />
                <p className="text-lg font-medium">Waiting for students to join...</p>
                <p className="text-sm">Share the room code above with your class.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {students.map((student, index) => (
                  <div key={student._id || index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700">
                      {student.user ? student.user.fullName.charAt(0) : student.guestName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">
                        {student.user ? student.user.fullName : student.guestName}
                      </div>
                      <div className="text-xs font-semibold text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Ready
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Master Controls */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 flex flex-col h-fit sticky top-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-4">Session Controls</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Test Status</span>
              <span className="font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">Not Started</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Auto-Submit</span>
              <span className="font-bold text-gray-900">On Timer End</span>
            </div>
          </div>

          <button 
            onClick={onStartAssessment}
            disabled={students.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-auto ${
              students.length === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
            }`}
          >
            <FaPlay /> Start Assessment
          </button>
          
          {students.length === 0 && (
            <p className="text-center text-xs text-gray-500 mt-3">
              Waiting for at least 1 student to join before starting.
            </p>
          )}

          <button 
            onClick={handleCloseRoom}
            disabled={isDeleting}
            className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100"
          >
            {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
            {isDeleting ? 'Closing Room...' : 'Close Room'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LobbyView;