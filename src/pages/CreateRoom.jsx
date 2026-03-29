import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import api from '../api/axios'; 

const CreateRoom = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTestId = searchParams.get('testId') || '';
  
  const [formData, setFormData] = useState({
    name: '',
    testId: preselectedTestId,
    customTimeLimit: ''
  });

  const [tests, setTests] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTests, setIsFetchingTests] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsFetchingTests(true);
        const response = await api.get('/tests'); 
        setTests(response.data.data);
      } catch (err) {
        console.error("Failed to fetch tests", err);
        setTests([
          { _id: 'dummy1', title: 'IELTS Reading Mock Test 1', timeLimit: 60 },
          { _id: 'dummy2', title: 'IELTS Listening Practice A', timeLimit: 40 }
        ]);
      } finally {
        setIsFetchingTests(false);
      }
    };
    fetchTests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/rooms', {
        name: formData.name,
        testId: formData.testId,
        customTimeLimit: formData.customTimeLimit ? Number(formData.customTimeLimit) : undefined
      });

      if (response.data.success) {
        const newRoomId = response.data.data._id;
        navigate(`/tutor/live/${newRoomId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium mb-6"
      >
        <FaArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-2xl font-extrabold text-gray-900">Configure Assessment Room</h1>
          {/* <p className="text-gray-500 mt-1 text-sm">Set up your test parameters before opening the lobby to students.</p> */}
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Test to Host <span className="text-red-500">*</span>
              </label>
              <select
                name="testId"
                value={formData.testId}
                onChange={handleChange}
                required
                disabled={isFetchingTests}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white disabled:bg-gray-50"
              >
                <option value="">-- Choose a Practice Test --</option>
                {tests.map(test => (
                  <option key={test._id} value={test._id}>
                    {test.title} ({test.timeLimit} mins)
                  </option>
                ))}
              </select>
              {isFetchingTests && <p className="text-xs text-indigo-500 mt-2 flex items-center gap-1"><FaSpinner className="animate-spin" /> Loading your tests...</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Custom Time Limit <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="customTimeLimit"
                  value={formData.customTimeLimit}
                  onChange={handleChange}
                  placeholder="Leave blank to use default"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  minutes
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Monday Evening Batch"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
              {/* <p className="text-xs text-gray-500 mt-2">If left blank, a smart name will be generated automatically.</p> */}
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.testId}
                className={`flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${
                  isLoading || !formData.testId ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-indigo-200 active:scale-95'
                }`}
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : null}
                {isLoading ? 'Creating Room...' : 'Create Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;