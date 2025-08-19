import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

const Feedback: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isUserFriendly, setIsUserFriendly] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState('');
  
  useEffect(() => {
    // Check if user already submitted feedback
    const fetchExistingFeedback = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }
        
        if (data) {
          // Pre-populate form with existing feedback
          setRating(data.rating);
          setIsUserFriendly(data.is_user_friendly);
          setSuggestions(data.suggestions || '');
        }
      } catch (error: any) {
        console.error('Error fetching feedback:', error);
        const errorMessage = error?.message || error?.toString() || 'Failed to load feedback data';
        console.error('Detailed error:', JSON.stringify(error, null, 2));
        setErrorMsg(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExistingFeedback();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrorMsg('You must be logged in to submit feedback');
      return;
    }
    
    if (rating === 0) {
      setErrorMsg('Please provide a rating');
      return;
    }
    
    if (isUserFriendly === null) {
      setErrorMsg('Please indicate if the website is user-friendly');
      return;
    }
    
    try {
      setSaving(true);
      setErrorMsg('');
      setSuccessMsg('');
      
      // Check if user already submitted feedback
      const { data, error: fetchError } = await supabase
        .from('feedback')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (data) {
        // Update existing feedback
        const { error: updateError } = await supabase
          .from('feedback')
          .update({
            rating,
            is_user_friendly: isUserFriendly,
            suggestions: suggestions || null
          })
          .eq('id', data.id);
        
        if (updateError) throw updateError;
        setSuccessMsg('Your feedback has been updated. Thank you!');
      } else {
        // Create new feedback
        const { error: insertError } = await supabase
          .from('feedback')
          .insert({
            user_id: user.id,
            rating,
            is_user_friendly: isUserFriendly,
            suggestions: suggestions || null
          });
        
        if (insertError) throw insertError;
        setSuccessMsg('Your feedback has been submitted. Thank you!');
      }
      
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to save feedback');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <p className="text-lg text-gray-700">Please login to submit feedback.</p>
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

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-purple-700 py-6 px-6">
          <h2 className="text-2xl font-serif font-bold text-white">Feedback</h2>
          <p className="text-purple-200">
            We value your input! Please share your thoughts about YOGAAROGYA.
          </p>
        </div>
        
        <div className="p-6">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
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
          
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  How would you rate your experience with YOGAAROGYA?
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none p-1"
                      title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={32}
                        className={`${
                          (hoverRating || rating) >= star
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Do you find our website user-friendly?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsUserFriendly(true)}
                    className={`py-2 px-4 border rounded-md ${
                      isUserFriendly === true
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUserFriendly(false)}
                    className={`py-2 px-4 border rounded-md ${
                      isUserFriendly === false
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="suggestions" className="block text-lg font-medium text-gray-700 mb-3">
                  Do you have any suggestions for improvements?
                </label>
                <textarea
                  id="suggestions"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  rows={4}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Share your thoughts here..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                    saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
