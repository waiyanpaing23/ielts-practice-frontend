import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaSpinner, FaCheckCircle, FaExclamationCircle, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import api from '../api/axios';
// Optional: import { useNavigate } from 'react-router-dom'; if you need to redirect after deletion

const EditProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // const navigate = useNavigate();

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

  // 3. Submit the profile changes
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
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Handle Account Deletion
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Point this to your backend cascading delete route
      const response = await api.delete('/users/me'); 
      
      if (response.data.success) {
        // Clear local storage and redirect to home/login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/'; // or use navigate('/')
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete account.' });
      setShowDeleteModal(false);
      setIsDeleting(false);
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
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
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

        {/* Form Content */}
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
            
            {/* Email (Read Only) */}
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

            <div className="pt-4 pb-6 border-b border-gray-100">
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

          {/* Danger Zone: Account Deletion */}
          <div className="mt-8 pt-6 border-t border-red-100">
            <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
              <FaExclamationTriangle /> Danger Zone
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-2"
            >
              <FaTrashAlt /> Delete Account
            </button>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-2">Are you absolutely sure?</h2>
            <p className="text-center text-gray-500 mb-8">
              This action cannot be undone. This will permanently delete your account, remove your test history, and wipe all your data from our servers.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`flex-1 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isDeleting 
                  ? 'bg-red-400 text-white cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isDeleting ? <FaSpinner className="animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EditProfile;