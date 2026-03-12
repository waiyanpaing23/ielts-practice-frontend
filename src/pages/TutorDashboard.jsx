import React from 'react';
import { FaPlus, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TutorDashboard = () => {
  return (
    <div className="space-y-8 relative">
      {/* Dashboard Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Tutor Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your classes, assign tests, and host live sessions.
          </p>
        </div>

        {/* Create Room Button - Now navigates to a new page! */}
        <Link
          to="/tutor/create-room"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FaPlay className="w-4 h-4" />
          <span>Create Assessment Room</span>
        </Link>
      </div>

      {/* Quick Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold mb-1">Active Rooms</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold mb-1">Total Students</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold mb-1">Tests Created</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Recent Rooms Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Live Sessions</h2>
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">You haven't hosted any live rooms yet.</p>
          <Link 
            to="/tutor/create-room"
            className="mt-4 text-indigo-600 font-semibold hover:text-indigo-700 flex items-center justify-center gap-1 mx-auto transition-colors inline-flex"
          >
            <FaPlus className="w-3 h-3" /> Create your first room
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;