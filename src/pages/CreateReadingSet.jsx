import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaArrowLeft, FaChevronDown, FaChevronRight, FaBookOpen } from 'react-icons/fa';
import api from '../api/axios';
import ReadingSetMinimap from '../components/ReadingSetMinimap';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ],
};

const CreateReadingSet = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(0);

  const passageRef = useRef(null);
  const questionRefs = useRef([]);

  const [passageData, setPassageData] = useState({
    title: '',
    difficulty: 'medium',
    isMatchingHeader: false,
    content: ''
  });

  const [questions, setQuestions] = useState([
    { 
      question_type: 'multiple_choice', 
      content: '', 
      options: [''], 
      correctOptionIndex: 0,
      correct_answer: '',
      explanation: '' 
    }
  ]);

  // --- HANDLERS ---
  const handlePassageChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPassageData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addQuestion = () => {
    const newQuestions = [
      ...questions,
      { question_type: 'multiple_choice', content: '', options: [''], correctOptionIndex: 0, correct_answer: '', explanation: '' }
    ];
    setQuestions(newQuestions);
    scrollToSection(newQuestions.length - 1);
  };

  const removeQuestion = (index, e) => {
    e.stopPropagation();
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    
    if (field === 'question_type') {
        if (value === 'true_false_not_given') {
          updated[index].options = ['True', 'False', 'Not Given'];
          updated[index].correctOptionIndex = 0;
        } else if (value === 'yes_no_not_given') {
          updated[index].options = ['Yes', 'No', 'Not Given'];
          updated[index].correctOptionIndex = 0;
        } else if (value === 'fill_in_the_blank') {
          updated[index].options = []; 
        }
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectOptionSelect = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].correctOptionIndex = optIndex;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);
    
    // If selected correct answer is deleted, reset it to the first option
    if (updated[qIndex].correctOptionIndex === optIndex) {
      updated[qIndex].correctOptionIndex = 0;
    } else if (updated[qIndex].correctOptionIndex > optIndex) {
      updated[qIndex].correctOptionIndex -= 1;
    }
    
    setQuestions(updated);
  };

  const scrollToSection = (index) => {
    if (index === 'passage') {
      passageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
      setTimeout(() => {
        questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanQuestions = [];
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      // Calculate the final answer string based on the UI state
      const finalAnswer = q.question_type === 'fill_in_the_blank' 
        ? q.correct_answer 
        : q.options[q.correctOptionIndex];

      if (!q.content.trim() || !finalAnswer?.trim()) {
        scrollToSection(i);
        setError(`Please fill out the Prompt and ensure a Correct Answer is provided for Question ${i + 1}`);
        return; 
      }

      cleanQuestions.push({
        question_type: q.question_type,
        content: q.content,
        options: q.question_type === 'fill_in_the_blank' ? [] : q.options,
        correct_answer: finalAnswer,
        explanation: q.explanation
      });
    }

    setIsLoading(true);
    try {
      const response = await api.post('/reading-sets', { 
        ...passageData, 
        questions: cleanQuestions 
      });
      if (response.data.success) {
        navigate('/admin'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reading set.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatType = (type) => type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const isStrictOptionsType = (type) => ['true_false_not_given', 'yes_no_not_given'].includes(type);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium mb-4 transition-colors">
        <FaArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
      </button>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Form */}
        <div className="flex-1 w-full space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Create Reading Passage</h1>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium shadow-sm">{error}</div>}

          <form id="reading-set-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* PASSAGE SECTION */}
            <div ref={passageRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 scroll-mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4 flex items-center gap-2">
                <FaBookOpen className="text-indigo-500" /> Passage Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                  <input type="text" name="title" required value={passageData.title} onChange={handlePassageChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                  <select name="difficulty" value={passageData.difficulty} onChange={handlePassageChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white transition-all">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="isMatchingHeader" checked={passageData.isMatchingHeader} onChange={handlePassageChange} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="font-semibold text-gray-700">Includes Matching Headings?</span>
                </label>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Passage Content <span className="text-red-500">*</span>
                </label>
                
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                  <ReactQuill 
                    theme="snow"
                    value={passageData.content}
                    onChange={(content) => setPassageData(prev => ({ ...prev, content }))}
                    modules={quillModules}
                    className="h-[400px] pb-10"
                  />
                </div>
              </div>
            </div>

            {/* QUESTIONS ACCORDION SECTION */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Questions ({questions.length})</h2>

              {questions.map((q, qIndex) => {
                const isOpen = expandedIndex === qIndex;

                return (
                  <div 
                    key={qIndex} 
                    ref={el => questionRefs.current[qIndex] = el}
                    className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 scroll-mt-24 ${isOpen ? 'border-indigo-300 ring-4 ring-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    {/* Accordion Header */}
                    <div onClick={() => setExpandedIndex(isOpen ? null : qIndex)} className="flex items-center justify-between p-5 cursor-pointer select-none">
                      <div className="flex items-center gap-4 truncate pr-4">
                        <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold rounded-lg text-sm transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                          {qIndex + 1}
                        </span>
                        <span className="flex-shrink-0 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
                          {formatType(q.question_type)}
                        </span>
                        {/* <span className="text-gray-600 text-sm truncate font-medium">
                          {q.content || <span className="text-gray-400 italic">Empty Question...</span>}
                        </span> */}
                      </div>
                      
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {questions.length > 1 && (
                          <button type="button" onClick={(e) => removeQuestion(qIndex, e)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                            <FaTrash />
                          </button>
                        )}
                        <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          <FaChevronDown />
                        </div>
                      </div>
                    </div>

                    {/* Accordion Body */}
                    {isOpen && (
                      <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl animate-fade-in">
                        <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Question Type</label>
                          <select value={q.question_type} onChange={(e) => handleQuestionChange(qIndex, 'question_type', e.target.value)} className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white transition-all">
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false_not_given">True / False / Not Given</option>
                            <option value="yes_no_not_given">Yes / No / Not Given</option>
                            <option value="fill_in_the_blank">Fill in the Blank</option>
                            <option value="matching_headings">Matching Headings</option>
                          </select>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Question Prompt <span className="text-red-500">*</span></label>
                          <textarea rows="2" value={q.content} onChange={(e) => handleQuestionChange(qIndex, 'content', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white transition-all"></textarea>
                        </div>

                        {q.question_type !== 'fill_in_the_blank' ? (
                          <div className="mb-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                              <label className="block text-sm font-semibold text-gray-700">
                                Options <span className="text-gray-400 font-normal ml-1">(Select the radio button for the correct answer)</span>
                              </label>
                            </div>
                            
                            <div className="space-y-3">
                              {q.options.map((opt, optIndex) => (
                                <div key={optIndex} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${q.correctOptionIndex === optIndex ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50 border border-transparent'}`}>
                                  {/* Radio Button */}
                                  <input 
                                    type="radio" 
                                    name={`q-${qIndex}-correct`}
                                    checked={q.correctOptionIndex === optIndex}
                                    onChange={() => handleCorrectOptionSelect(qIndex, optIndex)}
                                    className="w-5 h-5 text-green-600 focus:ring-green-500 cursor-pointer flex-shrink-0"
                                  />
                                  {/* Text Input */}
                                  <input 
                                    type="text" 
                                    value={opt} 
                                    disabled={isStrictOptionsType(q.question_type)}
                                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} 
                                    placeholder={`Option ${optIndex + 1}`} 
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-all" 
                                  />
                                  {/* Delete Option */}
                                  {!isStrictOptionsType(q.question_type) && q.options.length > 1 && (
                                    <button type="button" onClick={() => removeOption(qIndex, optIndex)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                      <FaTrash className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            {!isStrictOptionsType(q.question_type) && (
                              <button type="button" onClick={() => addOption(qIndex)} className="mt-4 text-sm text-indigo-600 font-bold flex items-center gap-1 hover:text-indigo-800 transition-colors">
                                <FaPlus className="w-3 h-3" /> Add Option
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Correct Answer (Exact text) <span className="text-red-500">*</span></label>
                            <input type="text" value={q.correct_answer} onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', e.target.value)} placeholder="e.g., technology" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none bg-white transition-all" />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Explanation (Optional)</label>
                          <textarea rows="2" value={q.explanation} onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)} placeholder="Explain why this is correct..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white transition-all"></textarea>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <button type="button" onClick={addQuestion} className="w-full py-5 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 mt-4 shadow-sm hover:shadow-md">
                <FaPlus /> Add Another Question
              </button>
            </div>
          </form>
        </div>

        {/* Minimap */}
        <ReadingSetMinimap 
          questions={questions}
          expandedIndex={expandedIndex}
          scrollToSection={scrollToSection}
          isLoading={isLoading}
        />

      </div>
    </div>
  );
};

export default CreateReadingSet;