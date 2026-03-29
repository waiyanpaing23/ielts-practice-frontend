import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaClipboardList, FaClock, FaPlay, FaBookOpen, FaSpinner } from 'react-icons/fa';
import api from '../api/axios';

const TestLibrary = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get('/tests');
        if (response.data.success) {
          // Filter to only show published tests (isPublic: true)
          const publishedTests = response.data.data.filter(test => test.isPublic);
          setTests(publishedTests);
        }
      } catch (err) {
        console.error('Failed to fetch tests', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTests();
  }, []);

  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Test Library</h1>
          <p className="text-gray-500">Browse official mock exams and assign them to your live rooms.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by test title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
      </div>

      {/* Test Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <FaSpinner className="animate-spin text-indigo-600 w-10 h-10" />
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <FaClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No tests available</h3>
          <p className="text-gray-500 mt-1">There are currently no published tests matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden group">
              
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
                    Reading Test
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 text-sm font-semibold">
                    <FaClock className="text-gray-400" /> {test.timeLimit}m
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {test.title}
                </h3>
                
                <div className="space-y-2 mb-6">
                  {test.reading_sets?.map((passage, index) => (
                    <div key={passage._id || index} className="flex items-start gap-2 text-sm text-gray-600">
                      <FaBookOpen className="text-gray-400 mt-1 w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-1">{passage.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex gap-3">
                <button 
                  onClick={() => navigate(`/tutor/tests/preview/${test._id}`)}
                  className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex-1 text-center"
                >
                  Preview
                </button>
                
                {/* 👇 The Magic Host Button 👇 */}
                <button 
                  onClick={() => navigate(`/tutor/create-room?testId=${test._id}`)}
                  className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex-[2] flex items-center justify-center gap-2"
                >
                  <FaPlay className="text-xs" /> Host Room
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestLibrary;