import React from 'react'
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
import LiveAssessment from './pages/learner/LiveAssessment'
import LearnerResult from './pages/learner/LearnerResult'
import TutorLeaderboard from './pages/tutor/TutorLeaderboard'
import LearnerScores from './pages/learner/LearnerScores'
import MiniPractice from './pages/learner/MiniPractice'
import FullPractice from './pages/learner/FullPractice'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/learner/assessment/:roomId" element={<LiveAssessment />} />
        <Route path="/learner/mini-practice" element={<MiniPractice />} />
        <Route path="/learner/full-practice" element={<FullPractice />} />

        <Route element={<MainLayout />}>
          
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<PracticeSelection />} />
          <Route path="/learner/library" element={<LearnerTestLibrary />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/learner/lobby/:roomId" element={<LearnerLobby />} />
          <Route path="/learner/assessment/result/:attemptId" element={<LearnerResult />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<LearnerDashboard />} />
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