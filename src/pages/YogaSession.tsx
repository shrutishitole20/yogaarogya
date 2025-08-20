import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Pause, Square, Timer, Target, Award, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

interface YogaSessionProps {
  pose?: {
    name: string;
    duration: number;
    instructions: string;
    videoUrl: string;
  };
}

const YogaSession: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Session state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [totalDuration, setTotalDuration] = useState(300);
  const [currentPose, setCurrentPose] = useState<any>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [completedPoses, setCompletedPoses] = useState<string[]>([]);

  // Get pose data from navigation state
  useEffect(() => {
    if (location.state?.pose) {
      const pose = location.state.pose;
      setCurrentPose(pose);
      setTimeLeft(pose.duration || 300);
      setTotalDuration(pose.duration || 300);
    }
  }, [location.state]);

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft]);

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const stopSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(totalDuration);
  };

  const handleSessionComplete = async () => {
    setIsActive(false);
    
    if (user && currentPose) {
      try {
        // Save session to database
        await supabase.from('yoga_sessions').insert({
          user_id: user.id,
          pose_name: currentPose.name,
          duration: totalDuration,
          completed_at: new Date().toISOString(),
          pose_category: currentPose.category || 'general'
        });

        // Update completed poses
        setCompletedPoses([...completedPoses, currentPose.name]);
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const setCustomTime = (minutes: number) => {
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setTotalDuration(seconds);
    setIsActive(false);
    setIsPaused(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 py-6 px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/yoga-recommendations')}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-serif font-bold text-white text-center">
              {currentPose ? currentPose.name : 'Yoga Session'}
            </h2>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="p-6">
          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Progress Circle */}
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#7C3AED"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${getProgressPercentage() * 2.827} 282.7`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              
              {/* Timer Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-700 mb-1">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isActive ? (isPaused ? 'Paused' : 'Active') : 'Ready'}
                  </div>
                </div>
              </div>
            </div>

            {/* Session Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              {!isActive ? (
                <button
                  onClick={startSession}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Session
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseSession}
                    className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={stopSession}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </button>
                </>
              )}
            </div>

            {/* Quick Time Presets */}
            <div className="flex justify-center space-x-2 mb-6">
              <span className="text-sm text-gray-600 mr-2">Quick times:</span>
              {[1, 5, 10, 15, 30].map(minutes => (
                <button
                  key={minutes}
                  onClick={() => setCustomTime(minutes)}
                  disabled={isActive}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    isActive 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  {minutes}m
                </button>
              ))}
            </div>
          </div>

          {/* Pose Instructions */}
          {currentPose && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Instructions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {currentPose.description || currentPose.instructions}
              </p>
            </div>
          )}

          {/* Session Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">
                {formatTime(totalDuration - timeLeft)}
              </div>
              <div className="text-sm text-blue-600">Time Practiced</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">
                {Math.round(getProgressPercentage())}%
              </div>
              <div className="text-sm text-green-600">Progress</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">
                {completedPoses.length}
              </div>
              <div className="text-sm text-purple-600">Poses Completed</div>
            </div>
          </div>

          {/* Completion Message */}
          {timeLeft === 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Session Complete! 🎉
              </h3>
              <p className="text-green-600 mb-4">
                Great job! You've completed your yoga session.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => navigate('/yoga-recommendations')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Try Another Pose
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  View Progress
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default YogaSession;
