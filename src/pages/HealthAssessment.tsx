import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

// Extended health conditions list
const healthConditions = [
  { id: 'back_pain', label: 'Back Pain', description: 'Pain in the lower, middle, or upper back' },
  { id: 'neck_pain', label: 'Neck Pain', description: 'Stiffness or pain in the neck area' },
  { id: 'stress', label: 'Stress', description: 'Feeling overwhelmed or tense' },
  { id: 'insomnia', label: 'Insomnia', description: 'Difficulty falling or staying asleep' },
  { id: 'digestive_issues', label: 'Digestive Issues', description: 'Problems with digestion, bloating, or gut health' },
  { id: 'joint_pain', label: 'Joint Pain', description: 'Pain in joints like knees, shoulders, or hips' },
  { id: 'high_blood_pressure', label: 'High Blood Pressure', description: 'Elevated blood pressure readings' },
  { id: 'obesity', label: 'Weight Management', description: 'Desire to manage or reduce weight' },
  { id: 'respiratory_issues', label: 'Respiratory Issues', description: 'Breathing problems or allergies' },
  { id: 'diabetes', label: 'Diabetes', description: 'Type 1 or Type 2 diabetes' },
  { id: 'arthritis', label: 'Arthritis', description: 'Joint inflammation and stiffness' },
  { id: 'anxiety', label: 'Anxiety', description: 'Excessive worry or fear' },
  { id: 'depression', label: 'Depression', description: 'Persistent feelings of sadness or loss of interest' },
  { id: 'migraine', label: 'Migraine', description: 'Severe headaches, often with other symptoms' },
  { id: 'thyroid', label: 'Thyroid Issues', description: 'Thyroid gland disorders' },
];

const HealthAssessment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    healthConditions.forEach(condition => {
      initialState[condition.id] = false;
    });
    console.log('Initial state created:', initialState);
    return initialState;
  });

  useEffect(() => {
    const checkExistingAssessment = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Test connection first
        console.log('Testing Supabase connection...');
        try {
          const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('count', { count: 'exact', head: true });

          if (testError) {
            console.error('Supabase connection test failed:', testError);
          } else {
            console.log('Supabase connection test successful');
          }
        } catch (connError) {
          console.error('Network connectivity issue:', connError);
        }

        const { data, error } = await supabase
          .from('health_assessments')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          // If table doesn't exist, skip loading previous data
          if (error.message?.includes('does not exist')) {
            console.log('Health assessments table does not exist yet');
            setLoading(false);
            return;
          }
          throw error;
        }

        if (data) {
          const conditionState: Record<string, boolean> = {};
          healthConditions.forEach(condition => {
            conditionState[condition.id] = data[condition.id] || false;
          });
          setSelectedConditions(conditionState);
        }
      } catch (error: any) {
        console.error('Error fetching health assessment:', error);
        const errorMessage = error?.message || error?.toString() || 'Failed to load health assessment data';
        console.error('Detailed error:', JSON.stringify(error, null, 2));
        setErrorMsg(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    checkExistingAssessment();
  }, [user]);

  const handleToggleCondition = (conditionId: string) => {
    console.log('Toggle condition clicked:', conditionId);
    console.log('Current state before toggle:', selectedConditions);
    setSelectedConditions(prev => {
      const newState = {
        ...prev,
        [conditionId]: !prev[conditionId]
      };
      console.log('New state after toggle:', newState);
      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrorMsg('You must be logged in to submit a health assessment');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMsg('');

      console.log('Starting health assessment submission...');
      console.log('Selected conditions:', selectedConditions);
      console.log('User ID:', user.id);

      // Check if user already has an assessment
      const { data, error: fetchError } = await supabase
        .from('health_assessments')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing assessment:', fetchError);
        throw fetchError;
      }

      if (data) {
        console.log('Updating existing assessment with ID:', data.id);
        // Update existing assessment
        const { error: updateError } = await supabase
          .from('health_assessments')
          .update(selectedConditions)
          .eq('id', data.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
        console.log('Assessment updated successfully');
      } else {
        console.log('Creating new assessment');
        // Create new assessment
        const { error: insertError } = await supabase
          .from('health_assessments')
          .insert({
            user_id: user.id,
            ...selectedConditions
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        console.log('Assessment created successfully');
      }

      console.log('Navigating to yoga recommendations...');
      // Navigate to recommendations page
      navigate('/yoga-recommendations');
      
    } catch (error: any) {
      console.error('Health assessment submission error:', error);
      const errorMessage = error?.message || error?.toString() || 'Failed to save health assessment';
      console.error('Detailed error:', JSON.stringify(error, null, 2));
      setErrorMsg(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <p className="text-lg text-gray-700">Please login to access the health assessment.</p>
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-purple-700 py-6 px-6">
          <h2 className="text-2xl font-serif font-bold text-white">Health Assessment</h2>
          <p className="text-purple-200">
            Select any health conditions you're experiencing to receive personalized yoga recommendations
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
          
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  This assessment is not a medical diagnosis. Always consult with a healthcare professional before starting any new exercise program.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <fieldset>
              {console.log('Form disabled state:', loading || isSubmitting, 'loading:', loading, 'isSubmitting:', isSubmitting)}
              <legend className="text-lg font-medium text-gray-700 mb-4">
                Please select all that apply:
              </legend>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthConditions.map(condition => (
                  <div 
                    key={condition.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedConditions[condition.id] 
                        ? 'bg-purple-50 border-purple-300' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleToggleCondition(condition.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={condition.id}
                          type="checkbox"
                          checked={!!selectedConditions[condition.id]}
                          onChange={(e) => {
                            console.log('Checkbox onChange:', condition.id, e.target.checked);
                            handleToggleCondition(condition.id);
                          }}
                          onClick={(e) => {
                            console.log('Checkbox onClick:', condition.id);
                            e.stopPropagation();
                          }}
                          className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={condition.id} className="font-medium text-gray-700">{condition.label}</label>
                        <p className="text-gray-500">{condition.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {isSubmitting ? (
                    'Saving...'
                  ) : (
                    <>
                      Get Recommendations
                      <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default HealthAssessment;
