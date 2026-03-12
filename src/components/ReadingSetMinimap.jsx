import React from 'react';
import { FaBookOpen, FaSave, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const ReadingSetMinimap = ({ 
  questions, 
  expandedIndex, 
  scrollToSection, 
  isLoading
}) => {
  return (
    <div className="hidden lg:flex w-72 flex-shrink-0 sticky top-24 self-start bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex-col max-h-[calc(100vh-12rem)] overflow-hidden z-10">
      
      <div className="p-5 pb-2 flex-shrink-0 bg-white">
        <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-4 border-b pb-3">Test Outline</h3>
        
        <button 
          onClick={() => scrollToSection('passage')}
          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${expandedIndex === null ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FaBookOpen className={expandedIndex === null ? 'text-indigo-500' : 'text-gray-400'} /> 
          Passage Details
        </button>

        <div className="pt-4 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider px-3">Questions</div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 custom-scrollbar space-y-1 bg-white">
        {questions.map((q, idx) => (
          <button 
            key={idx}
            onClick={() => scrollToSection(idx)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${expandedIndex === idx ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${expandedIndex === idx ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
              {idx + 1}
            </span>
            <span className="truncate flex-1">
              {q.content ? q.content.substring(0, 20) + '...' : 'Empty Question'}
            </span>

            {(q.content.trim() && (q.question_type !== 'fill_in_the_blank' || q.correct_answer.trim())) && (
              <FaCheckCircle className={`flex-shrink-0 ${expandedIndex === idx ? 'text-indigo-200' : 'text-green-500'}`} size={12} />
            )}
          </button>
        ))}
      </div>

      <div className="p-5 flex-shrink-0 border-t border-gray-100 bg-gray-50">
        <button 
          type="submit" 
          form="reading-set-form" 
          disabled={isLoading} 
          className={`w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'}`}
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {isLoading ? 'Saving...' : 'Save & Publish'}
        </button>
      </div>

    </div>
  );
};

export default ReadingSetMinimap;