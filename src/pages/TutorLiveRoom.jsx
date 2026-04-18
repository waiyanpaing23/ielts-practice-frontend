import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

import api from '../api/axios';
import MonitoringView from '../components/MonitoringView';
import socket from '../api/socket';
import LobbyView from '../components/LobbyView';

const TutorLiveRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [students, setStudents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liveProgress, setLiveProgress] = useState({});

  useEffect(() => {

    if (!socket.connected) socket.connect();
    socket.emit('join-room', roomId);
    socket.emit('request-progress-sync', roomId);

    const handleStudentJoined = () => {
      console.log("A new student arrived! Refreshing the lobby...");
      fetchRoomDetails();
    };

    const handleProgressUpdate = (data) => {
      setLiveProgress(prev => ({
        ...prev,
        [data.studentId]: data // Store it using the studentId as the key
      }));
    };

    // store and sync progress on tutor monitoring view as progress is lost when tutor refreshes the page
    const handleSyncData = (cachedData) => {
      console.log("Synced progress from server cache!");
      setLiveProgress(cachedData);
    };

    const handleStudentSubmitted = ({ data }) => {
      console.log(`Student ${data.studentId} just finished!`);

      setStudents(prevStudents => 
        prevStudents.map(student => 
          student._id === data.studentId 
            ? { ...student, status: 'submitted', hasFinished: true } 
            : student
        )
      );

      // Re-fetch to turn the card green
      fetchRoomDetails(); 
    };

    socket.on('student-joined', handleStudentJoined);
    socket.on('progress-updated', handleProgressUpdate);
    socket.on('progress-sync-data', handleSyncData);
    socket.on('student-submitted', handleStudentSubmitted);
    
    return () => {
      socket.off('student-joined', handleStudentJoined);
      socket.off('progress-updated', handleProgressUpdate);
      socket.off('progress-sync-data', handleSyncData);
      socket.off('student-submitted', handleStudentSubmitted);
    };
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      if (response.data.success) {
        const room = response.data.data;
        setRoomData(room);
        setStudents(room.participants || []);

        if (room.status === 'in_progress' && room.startTime) {
          const timeLimit = room.customTimeLimit || room.test?.timeLimit || 60;
          const endTime = new Date(room.startTime).getTime() + (timeLimit * 60 * 1000);
          const remainingSeconds = Math.floor((endTime - Date.now()) / 1000);
          setTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);
        }
      }
    } catch (error) {
      console.error("Failed to load room details:", error);
      alert("Failed to load room. Returning to dashboard.");
      navigate('/tutor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    if (roomData?.status !== 'in_progress' || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, roomData?.status]);

  const handleStartAssessment = async () => {
    if (students.length === 0) {
      alert("You cannot start the assessment without any students in the room.");
      return;
    }

    if (window.confirm("Are you sure you want to start? Once started, the timer begins for all students.")) {
      try {
        const response = await api.post(`/rooms/${roomId}/start`);
        if (response.data.success) {

          socket.emit('tutor-start-assessment', roomId);
          fetchRoomDetails();
        }
      } catch (error) {
        console.error("Failed to start assessment:", error);
        alert("Failed to start the assessment.");
      }
    }
  };

  const handleEndAssessment = async () => {
    if (window.confirm("Are you sure you want to FORCE END this assessment? All student sessions will be terminated.")) {
      await api.post(`/rooms/${roomId}/end`);
      navigate(`/tutor/room/${roomId}/results`);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = () => {
    const codeToCopy = roomData?.code || roomData?.roomCode;
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseRoom = async () => {
    if (!window.confirm('Are you sure you want to close this room? The invite code will be invalidated and students will be disconnected.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await api.delete(`/rooms/${roomId}`);
      if (response.data.success) {
        navigate('/tutor');
      }
    } catch (error) {
      console.error("Failed to close room", error);
      alert('Failed to close the room. Please try again.');
      setIsDeleting(false);
    }
  };

  if (isLoading || !roomData) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <FaSpinner className="animate-spin text-indigo-600 w-10 h-10" />
      </div>
    );
  }

  // 👇 The magical clean return statement
  return roomData.status === 'waiting' ? (
    <LobbyView 
    roomData={roomData} 
    students={students} 
    onStartAssessment={handleStartAssessment} 
    handleCopyCode={handleCopyCode}
    copied={copied}
    handleCloseRoom={handleCloseRoom}
    isDeleting={isDeleting}
  />
  ) : (
    <MonitoringView 
      roomData={roomData} 
      students={students} 
      timeLeft={timeLeft} 
      onEndAssessment={handleEndAssessment} 
      formatTime={formatTime} 
      liveProgress={liveProgress}
    />
  );
};

export default TutorLiveRoom;