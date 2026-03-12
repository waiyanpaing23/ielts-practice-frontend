import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaClipboardCheck, FaPlus, FaArrowRight } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Dashboard Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your IELTS testing platform content and resources.</p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ========================================== */}
        {/* CARD 1: PASSAGE BANK (READING SETS)        */}
        {/* ========================================== */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
          
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <FaBookOpen className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Passage Bank</h2>
          <p className="text-gray-500 mb-8 flex-1 leading-relaxed">
            Create and manage individual IELTS reading passages. Add rich text content, configure question types, and set difficulty levels to build your content library.
          </p>
          
          <div className="flex flex-col xl:flex-row gap-4 mt-auto">
            <Link 
              to="/admin/create-reading" 
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-3.5 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
            >
              <FaPlus /> Create Passage
            </Link>
            <Link 
              to="/admin/reading-sets" 
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-100 text-gray-700 px-4 py-3.5 rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-colors"
            >
              View Passages <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* ========================================== */}
        {/* CARD 2: FULL IELTS TESTS                   */}
        {/* ========================================== */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
          
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
            <FaClipboardCheck className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Full IELTS Tests</h2>
          <p className="text-gray-500 mb-8 flex-1 leading-relaxed">
            Compile 3 passages from your bank into a complete, 60-minute IELTS reading exam. Publish them so Tutors can assign them to student rooms.
          </p>
          
          <div className="flex flex-col xl:flex-row gap-4 mt-auto">
            <Link 
              to="/admin/create-test" 
              className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-4 py-3.5 rounded-xl font-bold hover:bg-purple-100 transition-colors"
            >
              <FaPlus /> Compile Test
            </Link>
            <Link 
              to="/admin/tests" 
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-100 text-gray-700 px-4 py-3.5 rounded-xl font-bold hover:border-purple-600 hover:text-purple-600 transition-colors"
            >
              View Tests <FaArrowRight />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;