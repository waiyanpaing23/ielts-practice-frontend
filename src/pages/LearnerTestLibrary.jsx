import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaClipboardList, FaClock, FaPlay, FaBookOpen, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import api from '../api/axios';

const LearnerTestLibrary = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get('/tests');
        if (response.data.success) {
          // STRICT FILTER: Learners should ONLY see tests that are marked public/published
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
      
      {/* Back Navigation */}
      <div className="mb-6">
        <Link to="/practice" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-medium transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Practice Modes
        </Link>
      </div>

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Full Mock Exams</h1>
          <p className="text-gray-500">Select an official test below to begin your simulated 1-hour session.</p>
        </div>
        
        <div className="relative w-full md:w-96 flex-shrink-0">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search exams..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-gray-50"
          />
        </div>
      </div>

      {/* Test Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <FaSpinner className="animate-spin text-indigo-600 w-12 h-12" />
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <FaClipboardList className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No tests available</h3>
          <p className="text-gray-500 mt-2">Check back later for new official practice materials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test._id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
              
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                    Academic Reading
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm font-bold bg-gray-50 px-3 py-1.5 rounded-lg">
                    <FaClock className="text-gray-400" /> {test.timeLimit}m
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {test.title}
                </h3>
                
                <div className="space-y-3 mb-2">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Includes:</p>
                  {/* Safely map passages, or just show a count if they aren't fully populated */}
                  {test.reading_sets && test.reading_sets.length > 0 ? (
                    test.reading_sets.map((passage, index) => (
                      <div key={passage._id || index} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                        <FaBookOpen className="text-indigo-400 mt-1 flex-shrink-0" />
                        <span className="line-clamp-1">{passage.title || `Reading Passage ${index + 1}`}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <FaBookOpen className="text-indigo-400" /> 3 Full Reading Passages
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <button 
                  // 👇 This will navigate to the actual Exam Interface! 👇
                  onClick={() => navigate(`/learner/test/${test._id}`)}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <FaPlay className="text-xs" /> Start Practice Test
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearnerTestLibrary;