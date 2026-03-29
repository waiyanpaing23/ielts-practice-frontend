import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDoorOpen, FaSpinner, FaKeyboard, FaUser } from 'react-icons/fa';
import api from '../api/axios';

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check if the user is logged in by looking for your auth token
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const isLoggedIn = !!token;

  // If they played before as a guest, grab their old name so they don't have to retype it
  useEffect(() => {
    if (!isLoggedIn) {
      const savedName = localStorage.getItem('guestName');
      if (savedName) setGuestName(savedName);
    }
  }, [isLoggedIn]);

  const handleCodeChange = (e) => {
    // Automatically uppercase the input and limit it to 6 characters
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setRoomCode(val);
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (roomCode.length !== 6) {
      setError('Please enter a valid 6-character room code.');
      return;
    }

    if (!isLoggedIn && !guestName.trim()) {
      setError('Please enter your name to join the room.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let payload = { code: roomCode };

      // If they are a guest, prepare their guest credentials
      if (!isLoggedIn) {
        let guestId = localStorage.getItem('guestId');
        
        // Generate a random ID if they don't have one yet
        if (!guestId) {
            guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('guestId', guestId);
        }
        
        localStorage.setItem('guestName', guestName);
        payload.guestName = guestName;
        payload.guestId = guestId;
      }

      const response = await api.post('/rooms/join', payload);
      
      if (response.data.success) {
        const roomId = response.data.data.roomId;
        localStorage.setItem('activeRoomId', roomId);
        navigate(`/learner/lobby/${roomId}`); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid room code. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Back to Dashboard Link */}
      <div className="w-full max-w-md mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <FaArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-purple-900 p-8 text-center border-b border-gray-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-indigo-600">
              <FaDoorOpen className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Join Assessment</h2>
            <p className="text-white text-sm">Enter the 6-character code provided by your tutor.</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Show Name Input ONLY if they are not logged in */}
            {!isLoggedIn && (
              <div>
                <label htmlFor="guestName" className="block text-sm font-bold text-gray-700 mb-3 text-center uppercase tracking-wider">
                  Your Name
                </label>
                <div className="relative">
                  <input
                    id="guestName"
                    type="text"
                    value={guestName}
                    onChange={(e) => { setGuestName(e.target.value); setError(''); }}
                    placeholder="Enter your full name"
                    autoComplete="off"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                  />
                  <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="roomCode" className="block text-sm font-bold text-gray-700 mb-3 text-center uppercase tracking-wider">
                Room Code
              </label>
              <div className="relative">
                <input
                  id="roomCode"
                  type="text"
                  value={roomCode}
                  onChange={handleCodeChange}
                  placeholder="e.g. A1B2C3"
                  autoComplete="off"
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-center text-3xl font-black tracking-[0.25em] text-gray-900 placeholder-gray-300"
                />
                {!roomCode && (
                  <FaKeyboard className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 pointer-events-none" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || roomCode.length < 6 || (!isLoggedIn && !guestName.trim())}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                isLoading || roomCode.length < 6 || (!isLoggedIn && !guestName.trim())
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : null}
              {isLoading ? 'Joining...' : 'Join Room'}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default JoinRoom;