import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PracticeSelection from './pages/PracticeSelection'
import LearnerDashboard from './pages/LearnerDashboard'
import TutorDashboard from './pages/TutorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CreateRoom from './pages/CreateRoom'
import CreateReadingSet from './pages/CreateReadingSet'
import ReadingSetDetail from './pages/ReadingSetDetail'
import CreateTest from './pages/CreateTest'
import ReadingSetList from './pages/ReadingSetList'
import TestList from './pages/TestList'
import TutorLiveRoom from './pages/TutorLiveRoom'
import JoinRoom from './pages/JoinRoom'
import TestLibrary from './pages/TestLibrary'
import TestPreview from './pages/TestPreview'
import LearnerLobby from './pages/LearnerLobby'
import EditProfile from './pages/EditProfile'
import LearnerTestLibrary from './pages/LearnerTestLibrary'
import { FaUserClock, FaArrowRight } from 'react-icons/fa';
import LiveAssessment from './pages/learner/LiveAssessment'
import LearnerResult from './pages/learner/LearnerResult'
import TutorLeaderboard from './pages/tutor/TutorLeaderboard'
import LearnerScores from './pages/learner/LearnerScores'
import MiniPractice from './pages/learner/MiniPractice'

// Home Page Component
const Home = () => {
  const [previousGuestInfo, setPreviousGuestInfo] = useState(null);

  useEffect(() => {
    // Check if this browser has an active guest session
    const guestId = localStorage.getItem('guestId');
    const guestName = localStorage.getItem('guestName');
    const activeRoomId = localStorage.getItem('activeRoomId');
    
    const isLoggedIn = !!localStorage.getItem('token');

    if (!isLoggedIn && guestId && guestName && activeRoomId) {
      setPreviousGuestInfo({ 
        name: guestName, 
        roomId: activeRoomId
      });
    }
  }, []);

  return (
    <div className="relative py-20 lg:py-32 overflow-hidden">

      <div className="text-center relative z-10">
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
          Prep like a Pro
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Master the IELTS <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            with Confidence
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Access hundreds of practice tests, vocabulary builders, and real-time feedback designed to help you hit Band 8+.
        </p>

        {previousGuestInfo && (
          <div className="flex justify-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-4 p-2 pr-6 bg-amber-50 border border-amber-200 rounded-full shadow-sm text-amber-800 transition-all hover:shadow-md hover:bg-amber-100">
              <span className="flex items-center justify-center w-10 h-10 bg-amber-400 text-amber-900 rounded-full shadow-inner">
                <FaUserClock className="w-5 h-5" />
              </span>
              <div className="text-left flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-sm font-medium">
                  Welcome back, <strong className="font-bold">{previousGuestInfo.name}</strong>! Were you in an assessment?
                </span>
                <Link 
                  to={`/learner/lobby/${previousGuestInfo.roomId}`}
                  className="text-sm font-black text-indigo-700 hover:text-indigo-900 flex items-center gap-1 group"
                >
                  Rejoin Room <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/practice"
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all text-center"
          >
            Start Free Practice
          </Link>
          <Link 
            to="/join-room"
            className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-gray-50 transition-all">
            Join Assessment Room
          </Link>
        </div>
      </div>

    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/learner/assessment/:roomId" element={<LiveAssessment />} />
        <Route path="/learner/mini-practice" element={<MiniPractice />} />

        <Route element={<MainLayout />}>
          
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<PracticeSelection />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/learner/lobby/:roomId" element={<LearnerLobby />} />
          <Route path="/learner/assessment/result/:attemptId" element={<LearnerResult />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<LearnerDashboard />} />
            <Route path="/learner/library" element={<LearnerTestLibrary />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/learner/scores" element={<LearnerScores />} />

            <Route path="/tutor" element={<TutorDashboard />} />
            <Route path="/tutor/create-room" element={<CreateRoom />} />
            <Route path="/tutor/live/:roomId" element={<TutorLiveRoom />} />
            <Route path="/tutor/library" element={<TestLibrary />} />
            <Route path="/tutor/room/:roomId/results" element={<TutorLeaderboard />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/reading-sets" element={<ReadingSetList />} />
            <Route path="/reading-set/create" element={<CreateReadingSet />} />
            <Route path="/reading-set/:id" element={<ReadingSetDetail />} />

            <Route path="/tests" element={<TestList />} />
            <Route path="/test/create" element={<CreateTest />} />
            <Route path="/tutor/tests/preview/:id" element={<TestPreview />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App