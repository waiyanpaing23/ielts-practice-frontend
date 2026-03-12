import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaSpinner, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../api/axios';

const ViewTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get('/tests');
        if (response.data.success) {
          setTests(response.data.data);
        }
      } catch (err) {
        setError('Failed to load tests. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Format date utility
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium mb-4 transition-colors">
            <FaArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">IELTS Tests</h1>
          <p className="text-gray-500 mt-1">Manage and view your compiled IELTS reading exams.</p>
        </div>
        <Link 
          to="/admin/test/create" 
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <FaPlus /> Compile New Test
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-indigo-500 w-8 h-8" />
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEye className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Tests Found</h3>
            <p className="text-gray-500 mb-6">You haven't compiled any IELTS tests yet.</p>
            <Link to="/admin/test/create" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              Get started by compiling your first test &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">Test Title</th>
                  <th className="px-6 py-4">Passages</th>
                  <th className="px-6 py-4">Time Limit</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tests.map((test) => (
                  <tr key={test._id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{test.title}</div>
                    </td>
                    
                    {/* Passages List */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex flex-col gap-1">
                        {test.reading_sets.map((passage, index) => (
                          <span key={passage._id || index} className="truncate max-w-[200px]" title={passage.title}>
                            {index + 1}. {passage.title}
                          </span>
                        ))}
                      </div>
                    </td>
                    
                    {/* Time Limit */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {test.timeLimit} mins
                    </td>
                    
                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        test.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.isPublic ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    
                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(test.createdAt)}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        {/* Placeholder buttons for future functionality */}
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="View Test">
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit Test">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete Test">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTests;