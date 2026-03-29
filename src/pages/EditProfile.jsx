import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../api/axios';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Fetch the user's current data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        if (response.data.success) {
          setFormData({
            fullName: response.data.data.fullName || '',
            email: response.data.data.email || ''
          });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' }); // Clear messages when typing
  };

  // 3. Submit the changes to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    if (!formData.fullName.trim()) {
      setMessage({ type: 'error', text: 'Full Name is required.' });
      setIsSaving(false);
      return;
    }

    try {
      const response = await api.put('/users/profile', {
        fullName: formData.fullName
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Optional: If you store the user's name in Context or LocalStorage, update it here!
        // localStorage.setItem('user', JSON.stringify(response.data.data));
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <FaSpinner className="animate-spin text-indigo-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <FaUserEdit className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Profile Settings</h1>
            <p className="text-indigo-100 text-sm">Update your personal information.</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.type === 'success' ? <FaCheckCircle className="w-5 h-5" /> : <FaExclamationCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email (Read Only - usually you don't let them change this easily without verification) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1.5 font-medium">Email cannot be changed directly.</p>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter Your Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSaving}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isSaving
                    ? 'bg-indigo-400 text-white cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-lg shadow-indigo-200 active:scale-95'
                }`}
              >
                {isSaving ? <FaSpinner className="animate-spin" /> : null}
                {isSaving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;