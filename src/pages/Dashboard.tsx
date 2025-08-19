import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';
import { Activity, Heart, Brain, Award, AlertTriangle } from 'lucide-react';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type UserGrowthData = {
  date: string;
  count: number;
}[];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [profileData, setProfileData] = useState<any>(null);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        setProfileData(profileData);
        
        // Fetch health assessment
        try {
          const { data: healthData, error: healthError } = await supabase
            .from('health_assessments')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (healthError && healthError.code !== 'PGRST116') {
            console.error('Health assessment error:', healthError);
          }

          if (healthData) {
            // Extract health conditions
            const conditions = Object.entries(healthData)
              .filter(([key, value]) =>
                value === true &&
                key !== 'id' &&
                key !== 'created_at' &&
                key !== 'user_id')
              .map(([key]) => key.replace(/_/g, ' '));

            setHealthConditions(conditions);
          } else {
            setHealthConditions([]);
          }
        } catch (healthError) {
          console.error('Error loading health conditions:', healthError);
          setHealthConditions([]);
        }
        
        // Fetch total user count
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setUserCount(count || 0);
        
        // Generate mock growth data (for demonstration)
        // In a real app, this would come from the database with actual historical data
        const today = new Date();
        const mockData: UserGrowthData = [];
        
        for (let i = 30; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          mockData.push({
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10) + (count || 100) - Math.floor(i * 1.5)
          });
        }
        
        setUserGrowthData(mockData);
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        const errorMessage = error?.message || error?.toString() || 'Failed to load dashboard data';
        console.error('Detailed error:', JSON.stringify(error, null, 2));
        setErrorMsg(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <p className="text-lg text-gray-700">Please login to view your dashboard.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const chartData = {
    labels: userGrowthData.map(item => item.date),
    datasets: [
      {
        label: 'User Growth',
        data: userGrowthData.map(item => item.count),
        fill: true,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(124, 58, 237, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'YOGAAROGYA User Growth',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Number of Users',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-purple-700 py-4 px-6">
                <h3 className="text-xl font-medium text-white">Your Profile</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-col space-y-4">
                  <div>
                    <span className="text-gray-500 text-sm">Name</span>
                    <p className="text-gray-800 font-medium">{profileData?.name || 'Not available'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Age</span>
                    <p className="text-gray-800 font-medium">{profileData?.age || 'Not available'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">City</span>
                    <p className="text-gray-800 font-medium">{profileData?.city || 'Not available'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Previous Yoga Experience</span>
                    <p className="text-gray-800 font-medium">
                      {profileData?.previous_yoga_experience ? 'Yes' : 'No'}
                      {profileData?.previous_yoga_experience && profileData?.experience_years && 
                        ` (${profileData.experience_years} years)`}
                    </p>
                  </div>
                  {profileData?.goals && (
                    <div>
                      <span className="text-gray-500 text-sm">Goals</span>
                      <p className="text-gray-800">{profileData.goals}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/health-assessment')}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Update Health Assessment
                  </button>
                </div>
              </div>
            </div>
            
            {/* Health Conditions Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-700 py-4 px-6">
                <h3 className="text-xl font-medium text-white">Your Health Focus</h3>
              </div>
              <div className="p-6">
                {healthConditions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-700 mb-4">
                      You haven't completed your health assessment yet.
                    </p>
                    <button
                      onClick={() => navigate('/health-assessment')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Complete Assessment
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-gray-700">
                        Your yoga recommendations are tailored to these conditions:
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {healthConditions.map(condition => (
                        <span 
                          key={condition}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => navigate('/yoga-recommendations')}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        View Yoga Recommendations
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-700 py-4 px-6">
                <h3 className="text-xl font-medium text-white">YOGAAROGYA Stats</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="h-8 w-8 text-blue-700" />
                    </div>
                    <p className="text-center text-2xl font-bold text-blue-700">{userCount}</p>
                    <p className="text-center text-sm text-blue-600">Total Users</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="h-8 w-8 text-purple-700" />
                    </div>
                    <p className="text-center text-2xl font-bold text-purple-700">15+</p>
                    <p className="text-center text-sm text-purple-600">Yoga Poses</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Brain className="h-8 w-8 text-green-700" />
                    </div>
                    <p className="text-center text-2xl font-bold text-green-700">10+</p>
                    <p className="text-center text-sm text-green-600">Health Conditions</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-8 w-8 text-amber-700" />
                    </div>
                    <p className="text-center text-2xl font-bold text-amber-700">1+</p>
                    <p className="text-center text-sm text-amber-600">Experience Years</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/feedback')}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
            
            {/* User Growth Chart - Full Width */}
            <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-700 py-4 px-6">
                <h3 className="text-xl font-medium text-white">User Growth</h3>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
