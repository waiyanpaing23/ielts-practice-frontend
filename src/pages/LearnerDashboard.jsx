import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaDoorOpen, 
  FaBookReader, 
  FaChartLine, 
  FaUserCircle, 
  FaSpinner, 
  FaHistory,
  FaChevronRight,
  FaArrowRight
} from 'react-icons/fa';
import api from '../api/axios';

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [joinedRooms, setJoinedRooms] = useState([]); // 👈 NEW: State for rooms
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 👈 NEW: Fetch both Profile AND Joined Rooms at the same time
        const [profileRes, roomsRes] = await Promise.all([
          api.get('/users/profile'),
          api.get('/rooms/joined') // We will need to build this backend route!
        ]);
        
        if (profileRes.data.success) {
          setUser(profileRes.data.data);
        }
        
        if (roomsRes.data.success) {
          setJoinedRooms(roomsRes.data.data);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <FaSpinner className="animate-spin text-indigo-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 space-y-8 relative">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Ready to continue your IELTS preparation? Choose an activity below.
          </p>
        </div>

        <Link 
          to="/profile"
          className="flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 hover:border-gray-300 transition-all"
        >
          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <FaUserCircle className="w-5 h-5" />}
          </div>
          <span className="hidden sm:inline">My Profile</span>
        </Link>
      </div>

      {/* Main Action Cards Grid (Unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 h-full flex flex-col justify-between text-white shadow-lg shadow-indigo-200 hover:-translate-y-1 transition-transform duration-300">
            <div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <FaDoorOpen className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Live Assessment</h2>
              <p className="text-indigo-100 mb-8 leading-relaxed">
                Has your tutor given you a 6-character room code? Join your live exam room here.
              </p>
            </div>
            <button 
              onClick={() => navigate('/join-room')}
              className="w-full py-4 bg-white text-indigo-700 rounded-xl font-extrabold shadow-sm hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Enter Room Code <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div 
            onClick={() => navigate('/practice')}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FaBookReader className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Self Practice</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Take full mock exams from the library or practice custom bite-sized practice tests.
              </p>
            </div>
            <div className="mt-6 flex items-center text-blue-600 font-bold text-sm">
              Choose Practice Mode <FaChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/learner/scores')}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FaChartLine className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Past Scores</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Review your previous test results, check correct answers, and track your band score progress.
              </p>
            </div>
            <div className="mt-6 flex items-center text-green-600 font-bold text-sm">
              View History <FaChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 👇 NEW: Dynamic Active Rooms Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaHistory className="text-gray-400 w-5 h-5" />
          <h2 className="text-xl font-bold text-gray-900">Your Active Rooms</h2>
        </div>
        
        {joinedRooms.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">You haven't joined any active rooms.</p>
            <p className="text-sm text-gray-400 mt-1">Join a live room to see your active sessions here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinedRooms.map(room => (
              <div key={room._id} className="border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between bg-gray-50">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold uppercase tracking-wider">
                      {room.code}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${room.status === 'in_progress' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">{room.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{room.test?.title || 'Assessment'}</p>
                </div>
                
                <button 
                  onClick={() => navigate(`/learner/lobby/${room._id}`)}
                  className="mt-5 w-full py-2 bg-white border border-gray-200 rounded-xl text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors flex justify-center items-center gap-2"
                >
                  Rejoin Room <FaArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default LearnerDashboard;