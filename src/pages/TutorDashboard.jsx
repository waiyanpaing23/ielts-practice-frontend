import React, { useState, useEffect } from 'react';
import { FaPlus, FaBookOpen, FaSpinner, FaUsers, FaArrowRight } from 'react-icons/fa';
import { MdMeetingRoom } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TutorDashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const [stats, setStats] = useState({ totalUniqueStudents: 0, activeRoomsCount: 0, totalSessions: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/rooms');
        if (response.data.success) {
          setRooms(response.data.data);

          if (response.data.stats) {
            setStats(response.data.stats);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Dashboard Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Tutor Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your classes, assign tests, and host live sessions.
          </p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link
            to="/tutor/library"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-100 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <FaBookOpen className="w-5 h-5" />
            <span>Test Library</span>
          </Link>

          <Link
            to="/tutor/create-room"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <MdMeetingRoom className="w-6 h-6" />
            <span>Create Room</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Active Rooms</h3>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-indigo-600">{isLoading ? '-' : stats.activeRoomsCount}</p>
            {stats.activeRoomsCount > 0 && <span className="flex h-3 w-3 relative mb-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>}
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Students</h3>
          <p className="text-4xl font-black text-gray-900">{isLoading ? '-' : stats.totalUniqueStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Sessions</h3>
          <p className="text-4xl font-black text-gray-900">{isLoading ? '-' : stats.totalSessions}</p>
        </div>
      </div>

      {/* Recent Rooms Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Live Sessions</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-indigo-600 w-8 h-8" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <MdMeetingRoom className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-4">You haven't hosted any live rooms yet.</p>
            <Link 
              to="/tutor/create-room"
              className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center justify-center gap-2 transition-colors inline-flex bg-indigo-50 px-6 py-2.5 rounded-full"
            >
              <FaPlus className="w-3 h-3" /> Create your first room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div 
                key={room._id} 
                onClick={() => {
                  if (room.status === 'completed') {
                    // If the room is finished, send them to the Results page
                    navigate(`/tutor/room/${room._id}/results`); 
                  } else {
                    navigate(`/tutor/live/${room._id}`);
                  }
                }}
                className="group border border-gray-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer bg-white flex items-center justify-between gap-4"
              >
                {/* Left Side: Room Info & Student Count */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                      room.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                      room.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {room.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-gray-400 font-mono tracking-widest">{room.code}</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors mb-2.5">
                    {room.name}
                  </h3>
                  
                  {/* 👇 Grouped Test Title & Student Count 👇 */}
                  <div className="flex items-center flex-wrap gap-4 text-sm font-medium text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <FaBookOpen className="text-gray-400" /> 
                      <span className="truncate max-w-[200px]">{room.test?.title || 'Unknown Test'}</span>
                    </span>
                    
                    <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 border border-gray-100">
                      <FaUsers className="text-indigo-500 w-6" /> {room.participants?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Right Side: Clean Arrow Button */}
                <div className="pl-2">
                  <button className="text-indigo-600 bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                    <FaArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;