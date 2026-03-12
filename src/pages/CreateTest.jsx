import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaSpinner, FaPlus, FaTrash, FaSearch, FaBookOpen } from 'react-icons/fa';
import api from '../api/axios';

const CreateTest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [isPublic, setIsPublic] = useState(false);

  // Passage Selection State
  const [availablePassages, setAvailablePassages] = useState([]);
  const [selectedPassages, setSelectedPassages] = useState([]); // Max 3 items
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch available passages on mount
  useEffect(() => {
    const fetchPassages = async () => {
      try {
        const response = await api.get('/reading-sets');
        if (response.data.success) {
          setAvailablePassages(response.data.data);
        }
      } catch (err) {
        setError('Failed to load available passages.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchPassages();
  }, []);

  // Handlers
  const handleSelectPassage = (passage) => {
    if (selectedPassages.length >= 3) {
      setError('An IELTS test can only have exactly 3 passages.');
      return;
    }
    // Prevent selecting the same passage twice
    if (selectedPassages.find(p => p._id === passage._id)) {
      setError('This passage is already selected.');
      return;
    }
    setError('');
    setSelectedPassages([...selectedPassages, passage]);
  };

  const handleRemovePassage = (index) => {
    const updated = selectedPassages.filter((_, i) => i !== index);
    setSelectedPassages(updated);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedPassages.length !== 3) {
      setError('You must select exactly 3 passages to compile a test.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title,
        timeLimit: Number(timeLimit),
        isPublic,
        reading_sets: selectedPassages.map(p => p._id) // Just send the IDs to the backend!
      };

      const response = await api.post('/tests', payload);
      if (response.data.success) {
        navigate('/admin'); // Redirect back to dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPassages = availablePassages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium mb-6">
        <FaArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Compile Mock Test</h1>
        <p className="text-gray-500 mt-1">Select exactly 3 reading passages to create a full IELTS exam.</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* TOP SECTION: Test Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Test Title <span className="text-red-500">*</span></label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Cambridge IELTS 18 - Reading Test 1" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time Limit (Minutes)</label>
              <input type="number" required value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" />
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsPublic(!isPublic)}>
            <input type="checkbox" checked={isPublic} readOnly className="w-5 h-5 text-indigo-600 rounded" />
            <div>
              <span className="font-semibold text-gray-900 block">Publish immediately?</span>
              <span className="text-sm text-gray-500">If unchecked, this test will be saved as a draft and hidden from tutors.</span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: The 3 Slots */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaBookOpen className="text-indigo-500" /> Selected Passages ({selectedPassages.length}/3)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((slotIndex) => {
              const passage = selectedPassages[slotIndex];
              return (
                <div key={slotIndex} className={`h-32 rounded-2xl border-2 flex flex-col justify-center p-5 relative transition-all ${passage ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-gray-50 border-dashed border-gray-300 text-gray-400 items-center'}`}>
                  {passage ? (
                    <>
                      <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Passage {slotIndex + 1}</div>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{passage.title}</h3>
                      <button type="button" onClick={() => handleRemovePassage(slotIndex)} className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 bg-white rounded-full shadow-sm hover:shadow">
                        <FaTrash size={12} />
                      </button>
                    </>
                  ) : (
                    <span className="font-medium text-sm">Empty Slot {slotIndex + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SECTION: Passage Bank */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Passage Bank</h2>
            <div className="relative w-full md:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search passages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm" />
            </div>
          </div>

          {isFetching ? (
            <div className="py-12 flex justify-center text-indigo-500"><FaSpinner className="animate-spin w-8 h-8" /></div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {filteredPassages.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No passages found.</div>
              ) : (
                filteredPassages.map((passage) => {
                  const isSelected = selectedPassages.some(p => p._id === passage._id);
                  return (
                    <div key={passage._id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isSelected ? 'border-indigo-200 bg-indigo-50/50 opacity-50' : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                      <div>
                        <h4 className="font-bold text-gray-900">{passage.title}</h4>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 inline-block ${passage.difficulty === 'hard' ? 'bg-red-50 text-red-700' : passage.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                          {passage.difficulty}
                        </span>
                      </div>
                      <button 
                        type="button" 
                        disabled={isSelected || selectedPassages.length >= 3} 
                        onClick={() => handleSelectPassage(passage)} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isSelected ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                      >
                        {isSelected ? 'Selected' : <><FaPlus size={10} /> Select</>}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isLoading || selectedPassages.length !== 3} className={`px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 ${isLoading || selectedPassages.length !== 3 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}>
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
            Compile & Save Test
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;