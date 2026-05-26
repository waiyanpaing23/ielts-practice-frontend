// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserClock, FaArrowRight, FaBookOpen, FaUsers, 
  FaLaptopCode, FaChalkboardTeacher, FaChartPie, FaCheckCircle 
} from 'react-icons/fa';

const Home = () => {
  const [previousGuestInfo, setPreviousGuestInfo] = useState(null);

  useEffect(() => {
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
    <div className="bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ========================================== */}
      {/* HERO SECTION (Split Layout)                */}
      {/* ========================================== */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                Transform Your Preparation
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                Experience the Modern Way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Master IELTS</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                Step away from static PDFs. Immerse yourself in a distraction-free, computer-delivered testing environment designed to mirror the real exam and accelerate your learning.
              </p>

              {/* Guest Return Banner */}
              {previousGuestInfo && (
                <div className="mb-8 p-4 bg-white border border-amber-200 rounded-2xl shadow-sm text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaUserClock className="text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Welcome back, <strong className="text-gray-900">{previousGuestInfo.name}</strong></p>
                      <p className="text-xs text-gray-500">Your previous session is still active.</p>
                    </div>
                  </div>
                  <Link 
                    to={`/learner/lobby/${previousGuestInfo.roomId}`}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-bold rounded-lg border border-amber-200 transition-colors text-center flex items-center justify-center gap-2 group"
                  >
                    Rejoin <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/practice"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 group"
                >
                  <FaLaptopCode className="text-indigo-200 group-hover:text-white transition-colors" />
                  Start Self-Practice
                </Link>
                <Link 
                  to="/join-room"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
                >
                  <FaUsers className="text-gray-400" />
                  Join Live Room
                </Link>
              </div>
            </div>

            {/* Right Column: Structured Mini Dashboard */}
            <div className="hidden lg:flex relative z-10 w-full justify-center items-center">
              
              {/* Decorative Background Blobs */}
              <div className="absolute top-0 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
              <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>

              {/* Main Frosted Glass Dashboard Container */}
              <div className="relative w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6 transform hover:-translate-y-2 transition-transform duration-500">
                
                {/* Mock Browser/Dashboard Header */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Learner Dashboard</span>
                </div>

                {/* Vertical Stack of Cards */}
                <div className="flex flex-col gap-5">
                  
                  {/* Card 1 (Score) */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Band</span>
                      <FaCheckCircle className="text-green-500 text-lg" />
                    </div>
                    <div className="text-5xl font-black text-indigo-600 mb-3">7.5</div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full w-[80%]"></div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium text-right">32 / 40 Correct</p>
                  </div>

                  {/* Card 2 (Skill Analysis) */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                        <FaChartPie className="text-lg" />
                      </div>
                      <span className="text-sm font-bold text-gray-800">Macro Insights</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-gray-600">Multiple Choice</span>
                          <span className="text-gray-900">100%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full w-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-gray-600">True/False/Not Given</span>
                          <span className="text-gray-900">60%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full w-[60%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FEATURES SECTION                           */}
      {/* ========================================== */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-gray-500">A complete ecosystem designed to bridge the gap between independent practice and supervised assessment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaChalkboardTeacher />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Assessment Rooms</h3>
              <p className="text-gray-600 leading-relaxed">
                Join synchronized virtual testing environments. Perfect for tutor-led mock exams where timing and monitoring mirror the actual test day conditions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaChartPie />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Deep Performance Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Stop guessing your weaknesses. Our dashboard tracks your lifetime win-rate across specific question types, identifying exactly where you need to focus.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaCheckCircle />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Automated Grading</h3>
              <p className="text-gray-600 leading-relaxed">
                Say goodbye to manual checking. Submit your answers and instantly receive estimated band scores alongside detailed, question-by-question explanations.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;