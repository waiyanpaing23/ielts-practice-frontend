import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaDoorOpen, FaClipboardList, FaClock, FaCheckCircle, FaUsers } from 'react-icons/fa';
import api from '../api/axios';
import socket from '../api/socket';

const LearnerLobby = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const guestId = localStorage.getItem('guestId')
        
        const response = await api.get(`/rooms/${roomId}`, {
          headers: {
            'x-guest-id': guestId || '' // Send the guest ID if they have one
          }
        });

        const roomData = response.data.data;

        if (roomData.status === 'in_progress') {
          console.log("Exam already in progress! Bypassing lobby...");
          navigate(`/learner/assessment/${roomId}`);
          return;
        }

        setRoom(response.data.data);

        socket.connect();
        socket.emit('join-room', roomId);

      } catch (err) {
        setError('Lost connection to the room. Please try joining again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();

    const handleAssessmentStarted = () => {
      console.log("Assessment started by tutor! Teleporting...");
      navigate(`/learner/assessment/${roomId}`);
    };

    socket.on('assessment-started', handleAssessmentStarted);

    // 3. Cleanup on unmount
    return () => {
      socket.off('assessment-started', handleAssessmentStarted);
      socket.disconnect();
    };
    
  }, [roomId]);

  const handleLeaveRoom = async () => {
    if (window.confirm('Are you sure you want to leave the waiting room?')) {
      try {
        const token = localStorage.getItem('token');
        const guestId = localStorage.getItem('guestId');

        await api.post(`/rooms/${roomId}/leave`, {}, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'x-guest-id': guestId || ''
          }
        });

        localStorage.removeItem('activeRoomId');
        navigate('/');

      } catch (err) {
        console.error("Error leaving room:", err);
        localStorage.removeItem('activeRoomId');
        navigate('/');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-indigo-600 w-12 h-12 mb-4" />
        <p className="text-gray-500 font-medium text-lg">Connecting to the assessment room...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-md w-full p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-center mb-6">
          <p className="font-bold mb-2">Connection Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline">
          &larr; Return to Join page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden text-center">
        
        {/* Animated Waiting Header */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-10 border-b border-gray-100 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Connected
          </div>
          
          <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 relative">
            {/* <FaSpinner className="animate-spin text-indigo-200 w-full h-full absolute top-0 left-0" /> */}
            <FaCheckCircle className="text-indigo-600 w-8 h-8 relative z-10" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">You're in the Lobby!</h2>
          <p className="text-gray-500">Please wait for your tutor to start the assessment.</p>

          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 mt-4 rounded-full shadow-sm border border-gray-200 text-sm font-bold text-gray-700">
            <FaUsers className="text-indigo-500" />
            {room.participants?.length || 1} Students Waiting
          </div>

        </div>

        {/* Room & Test Details */}
        <div className="p-8">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 text-left space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Room Name</p>
              <p className="font-bold text-gray-900">{room.name}</p>
            </div>
            
            <div className="h-px bg-gray-200 w-full my-2"></div>
            
            <div className="flex items-start gap-3">
              <FaClipboardList className="text-indigo-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Assessment</p>
                <p className="font-semibold text-gray-800">{room.test.title}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaClock className="text-indigo-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time Limit</p>
                <p className="font-semibold text-gray-800">{room.customTimeLimit || room.test.timeLimit} Minutes</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLeaveRoom}
            className="text-gray-400 hover:text-red-500 font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <FaDoorOpen /> Leave Room
          </button>
        </div>

      </div>
    </div>
  );
};

export default LearnerLobby;