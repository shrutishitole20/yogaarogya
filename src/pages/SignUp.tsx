import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, UserCircle, MapPin, Calendar, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

const SignUp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Step 1 - Account Creation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2 - Personal Information
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  
  // Step 3 - Yoga Experience
  const [previousYogaExperience, setPreviousYogaExperience] = useState<boolean | null>(null);
  const [experienceYears, setExperienceYears] = useState('');
  const [goals, setGoals] = useState('');
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const validateStep1 = () => {
    if (!email) {
      setErrorMsg('Email is required');
      return false;
    }
    if (!password) {
      setErrorMsg('Password is required');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!name) {
      setErrorMsg('Name is required');
      return false;
    }
    if (!age) {
      setErrorMsg('Age is required');
      return false;
    }
    if (!city) {
      setErrorMsg('City is required');
      return false;
    }
    return true;
  };
  
  const validateStep3 = () => {
    if (previousYogaExperience === null) {
      setErrorMsg('Please indicate if you have previous yoga experience');
      return false;
    }
    if (previousYogaExperience && !experienceYears) {
      setErrorMsg('Please indicate your years of experience');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setErrorMsg('');
    
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    setErrorMsg('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // 1. Create auth user
      const { data, error } = await signUp(email, password);

      if (error) {
        throw error;
      }

      const userId = data?.user?.id;

      if (!userId) {
        throw new Error('User creation failed');
      }

      // 2. Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Create profile using service role to bypass RLS during signup
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        name,
        age: parseInt(age),
        city,
        previous_yoga_experience: previousYogaExperience,
        experience_years: previousYogaExperience ? parseInt(experienceYears) : null,
        goals: goals || null
      });

      if (profileError) {
        throw profileError;
      }

      // Navigate to health assessment
      navigate('/health-assessment');

    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-purple-700 py-6 px-6">
          <h2 className="text-2xl font-serif font-bold text-white text-center">Join YOGAAROGYA</h2>
          <p className="text-purple-200 text-center">Create your account and start your yoga journey</p>
          
          {/* Progress Steps */}
          <div className="flex justify-between items-center mt-6 px-6">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${
                currentStep >= 1 ? 'bg-green-600 border-green-600 text-white' : 'border-purple-300 text-purple-300'
              }`}>
                1
              </div>
              <div className={`ml-2 text-sm ${currentStep >= 1 ? 'text-white' : 'text-purple-300'}`}>Account</div>
            </div>
            
            <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-green-600' : 'bg-purple-300'}`}></div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${
                currentStep >= 2 ? 'bg-green-600 border-green-600 text-white' : 'border-purple-300 text-purple-300'
              }`}>
                2
              </div>
              <div className={`ml-2 text-sm ${currentStep >= 2 ? 'text-white' : 'text-purple-300'}`}>Personal</div>
            </div>
            
            <div className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-green-600' : 'bg-purple-300'}`}></div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${
                currentStep >= 3 ? 'bg-green-600 border-green-600 text-white' : 'border-purple-300 text-purple-300'
              }`}>
                3
              </div>
              <div className={`ml-2 text-sm ${currentStep >= 3 ? 'text-white' : 'text-purple-300'}`}>Experience</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1 - Account Creation */}
            {currentStep === 1 && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Mail size={18} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Lock size={18} />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Lock size={18} />
                    </span>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            )}
            
            {/* Step 2 - Personal Information */}
            {currentStep === 2 && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <UserCircle size={18} />
                    </span>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Calendar size={18} />
                    </span>
                    <input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City/Place
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <MapPin size={18} />
                    </span>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="New York"
                    />
                  </div>
                </div>
              </>
            )}
            
            {/* Step 3 - Yoga Experience */}
            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Have you practiced yoga before?
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setPreviousYogaExperience(true)}
                      className={`flex-1 py-2 px-4 border rounded-md ${
                        previousYogaExperience === true
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviousYogaExperience(false);
                        setExperienceYears('');
                      }}
                      className={`flex-1 py-2 px-4 border rounded-md ${
                        previousYogaExperience === false
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
                
                {previousYogaExperience && (
                  <div>
                    <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <Info size={18} />
                      </span>
                      <input
                        id="experienceYears"
                        type="number"
                        min="0"
                        max="70"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        required={previousYogaExperience}
                        className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="2"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                    What are your goals with yoga? (Optional)
                  </label>
                  <textarea
                    id="goals"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={4}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="I want to improve flexibility, reduce stress, etc."
                  ></textarea>
                </div>
              </>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Creating Account...' : 'Complete Sign Up'}
                </button>
              )}
            </div>
          </form>
          
          {currentStep === 1 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
