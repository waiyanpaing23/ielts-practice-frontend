// src/components/QuestionRenderer.jsx
import React from 'react';

const QuestionRenderer = ({ q, currentAnswer, onChange }) => {
  const type = q.question_type;

  // 1. Radio Buttons (Multiple Choice, True/False, Yes/No)
  if (['multiple_choice', 'true_false_not_given', 'yes_no_not_given'].includes(type)) {
    // Failsafe for true/false options if not in DB
    const options = q.options?.length > 0 ? q.options : 
      (type === 'true_false_not_given' ? ['True', 'False', 'Not Given'] : 
      type === 'yes_no_not_given' ? ['Yes', 'No', 'Not Given'] : []);

    return (
      <div className="space-y-3">
        {options.map((opt, i) => (
          <label key={i} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            currentAnswer === opt 
              ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
          }`}>
            <input 
              type="radio" 
              name={`question_${q._id}`} 
              value={opt}
              checked={currentAnswer === opt}
              onChange={(e) => onChange(q._id, e.target.value)}
              className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className={`font-medium ${currentAnswer === opt ? 'text-indigo-900' : 'text-gray-700'}`}>
              {opt}
            </span>
          </label>
        ))}
      </div>
    );
  }

  // 2. Dropdown (Matching Headings)
  if (type === 'matching_headings') {
    return (
      <select
        value={currentAnswer || ''}
        onChange={(e) => onChange(q._id, e.target.value)}
        className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900 bg-white cursor-pointer"
      >
        <option value="" disabled>Select a heading...</option>
        {q.options?.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  // 3. Default Text Input (Fill in the Blank, Short Answer)
  return (
    <input 
      type="text"
      value={currentAnswer || ''}
      onChange={(e) => onChange(q._id, e.target.value)}
      placeholder="Type your exact answer here..."
      className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900"
    />
  );
};

export default QuestionRenderer;