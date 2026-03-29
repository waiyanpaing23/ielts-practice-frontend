import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner, FaPlay, FaClock, FaBookOpen, FaQuestionCircle } from 'react-icons/fa';
import api from '../api/axios';

const TestPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0, 1, or 2 for the three passages

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await api.get(`/tests/${id}`);
        if (response.data.success) {
          setTest(response.data.data);
        }
      } catch (err) {
        setError('Failed to load test details. It may have been deleted.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <FaSpinner className="animate-spin text-indigo-600 w-10 h-10" />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100 mb-6">
          {error}
        </div>
        <button onClick={() => navigate(-1)} className="text-indigo-600 font-bold hover:underline">
          &larr; Go back
        </button>
      </div>
    );
  }

  const activePassage = test.reading_sets[activeTab];
  const cleanContent = activePassage?.content 
    ? activePassage.content.replace(/&nbsp;/g, ' ') 
    : '';

  return (
    <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <button 
            onClick={() => navigate('/tutor/library')} 
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium mb-4"
          >
            <FaArrowLeft className="w-4 h-4" /> Back to Library
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
              Reading Test
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-sm font-semibold">
              <FaClock className="text-gray-400" /> {test.timeLimit} Minutes
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{test.title}</h1>
        </div>

        <button 
          onClick={() => navigate(`/tutor/create-room?testId=${test._id}`)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap"
        >
          <FaPlay className="w-4 h-4" /> Host Room with this Test
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-12rem)] min-h-[600px]">
        
        {/* Left Sidebar: Tabs */}
        <div className="lg:w-64 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-4 lg:p-6 flex flex-row lg:flex-col gap-2 overflow-x-auto">
          {test.reading_sets.map((passage, index) => (
            <button
              key={passage._id || index}
              onClick={() => setActiveTab(index)}
              className={`flex-shrink-0 lg:flex-shrink flex flex-col items-start p-4 rounded-xl transition-all border-2 text-left ${
                activeTab === index 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                  : 'bg-white border-transparent hover:border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${activeTab === index ? 'text-indigo-600' : 'text-gray-400'}`}>
                Passage {index + 1}
              </span>
              <span className={`font-bold line-clamp-2 ${activeTab === index ? 'text-gray-900' : 'text-gray-600'}`}>
                {passage.title}
              </span>
            </button>
          ))}
        </div>

        {/* Right Content Area: Passage & Questions */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar">
          {activePassage ? (
            <div className="space-y-10">
              
              {/* Passage Content */}
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <FaBookOpen className="text-indigo-500 w-5 h-5" />
                  <h2 className="text-xl font-bold text-gray-900">Reading Text</h2>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    activePassage.difficulty === 'hard' ? 'bg-red-50 text-red-700' : 
                    activePassage.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700' : 
                    'bg-green-50 text-green-700'
                  }`}>
                    {activePassage.difficulty}
                  </span>
                </div>
                {/* We use dangerouslySetInnerHTML here so the Tutor sees the actual formatting (bolding, headers) */}
                <div 
                  className="prose prose-indigo max-w-none text-gray-700 leading-relaxed [&>p]:mb-6"
                  dangerouslySetInnerHTML={{ __html: cleanContent }}
                />
              </section>

              {/* Questions Preview */}
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <FaQuestionCircle className="text-purple-500 w-5 h-5" />
                  <h2 className="text-xl font-bold text-gray-900">Questions ({activePassage.questions?.length || 0})</h2>
                </div>
                
                <div className="space-y-6">
                  {activePassage.questions?.map((q, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className="flex gap-3">
                        <span className="font-bold text-gray-400 mt-0.5">{idx + 1}.</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-3">{q.content}</p>
                          
                          {/* Options if Multiple Choice */}
                          {q.options && q.options.length > 0 && (
                            <ul className="space-y-2 mb-4">
                              {q.options.map((opt, optIdx) => (
                                <li key={optIdx} className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                  <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded text-xs font-bold text-gray-500">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  {opt}
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                            <span className="font-medium text-gray-500">Correct Answer:</span>
                            <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-md">{q.correct_answer}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a passage to preview its content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPreview;