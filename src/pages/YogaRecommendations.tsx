import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

// Yoga asana recommendations by condition
const yogaRecommendations: Record<string, Array<{name: string, benefits: string, description: string, imageUrl: string, videoUrl: string}>> = {
  back_pain: [
    {
      name: 'Cat-Cow Pose (Marjaryasana-Bitilasana)',
      benefits: 'Improves spine flexibility and relieves back tension',
      description: 'Start on hands and knees. Inhale, arch your back and look up (Cow). Exhale, round your spine and tuck your chin (Cat). Repeat 10-15 times.',
      imageUrl: 'https://images.pexels.com/photos/17572172/pexels-photo-17572172.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/38xc7KX7h3A'
    },
    {
      name: 'Child\'s Pose (Balasana)',
      benefits: 'Gently stretches the lower back and promotes relaxation',
      description: 'Kneel on the floor, touch your big toes together, sit on your heels, and then lay your torso down between your thighs. Extend arms forward or alongside body.',
      imageUrl: 'https://images.pexels.com/photos/4534597/pexels-photo-4534597.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/k3C-3B5y9-E'
    },
  ],
  neck_pain: [
    {
      name: 'Shoulder Rolls',
      benefits: 'Releases tension in shoulders and neck',
      description: 'Inhale as you roll your shoulders up towards your ears, then exhale as you roll them back and down. Repeat 8-10 times, then reverse direction.',
      imageUrl: "https://d5sbbf6usl3xq.cloudfront.net/standing_shoulder_rolls_bent_elbows___yoga.png",
      videoUrl: 'https://www.youtube.com/embed/QANnCNXd5q8'
    },
    {
      name: 'Seated Neck Release',
      benefits: 'Stretches side neck muscles and reduces stiffness',
      description: 'Sit tall. Gently tilt right ear toward right shoulder until you feel a stretch. Hold 30 seconds. Repeat on left side.',
      imageUrl: 'https://images.pexels.com/photos/8534778/pexels-photo-8534778.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/SedzSwEcqSw'
    },
  ],
  stress: [
    {
      name: 'Corpse Pose (Savasana) with Deep Breathing',
      benefits: 'Promotes deep relaxation and stress relief',
      description: 'Lie on your back with legs slightly apart and arms at sides, palms up. Close your eyes and focus on deep, slow breathing for 5-10 minutes.',
      imageUrl: 'https://images.pexels.com/photos/6998214/pexels-photo-6998214.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/Xv4dnUpWRLU'
    },
    {
      name: 'Forward Fold (Uttanasana)',
      benefits: 'Calms the mind and relieves stress',
      description: 'Stand with feet hip-width apart. Exhale and hinge at hips to fold forward. Let head hang heavy. Hold and breathe for 1-2 minutes.',
      imageUrl: 'https://images.pexels.com/photos/6698528/pexels-photo-6698528.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/8xHt8wGYC6A'
    },
  ],
  insomnia: [
    {
      name: 'Legs Up The Wall (Viparita Karani)',
      benefits: 'Calms the nervous system and promotes better sleep',
      description: 'Sit with one hip against a wall. Swing legs up the wall as you lie back. Rest with buttocks near or against wall and legs extended up. Hold 5-15 minutes.',
      imageUrl: 'https://media.yogauonline.com/app/uploads/2023/07/09234339/0-Legs-up-the-Wall-Pose-or-Viparita-Karani-a-restorative-yoga-pose.webp',
      videoUrl: 'https://www.youtube.com/embed/pUcmxKCGpXU'
    },
    {
      name: 'Supine Spinal Twist (Supta Matsyendrasana)',
      benefits: 'Releases tension in the spine and promotes relaxation',
      description: 'Lie on back, bring knees to chest. Extend arms out in T position. Drop knees to right while turning head left. Hold, then switch sides.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM72G6ohN5Gx6ll8Z9ndenhGZGVn-DY0NF-Q&s',
      videoUrl: 'https://www.youtube.com/embed/qmPdUZnPqr4'
    },
  ],
  digestive_issues: [
    {
      name: 'Wind-Relieving Pose (Pawanmuktasana)',
      benefits: 'Relieves gas and improves digestion',
      description: 'Lie on back. Bring right knee to chest and hold for 30 seconds. Release and repeat with left leg. Then bring both knees to chest and hold.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGdcENKPqVq3pyCWtcwdOo9bvugRWj3KWQvg&s',
      videoUrl: 'https://www.youtube.com/embed/X0DCQRxKBGI'
    },
    {
      name: 'Seated Twist (Ardha Matsyendrasana)',
      benefits: 'Massages abdominal organs and aids digestion',
      description: 'Sit with legs extended. Bend right knee and place foot outside left thigh. Twist torso right, placing left elbow outside right knee. Hold, then switch sides.',
      imageUrl: 'https://www.keralatourism.org/images/yoga/static-banner/large/Ardha_Matsyendrasana_-_The_Spinal_Twist-07032020173900.jpg',
      videoUrl: 'https://www.youtube.com/embed/0bAoq8_0SFU'
    },
  ],
  joint_pain: [
    {
      name: 'Gentle Joint Rotations',
      benefits: 'Improves joint mobility and reduces stiffness',
      description: 'Sitting comfortably, gently rotate each major joint (wrists, elbows, shoulders, ankles, knees, hips) 5-10 times in each direction.',
      imageUrl: 'https://www.dmoose.com/cdn/shop/articles/1_Main_Image_5db14a4e-660d-43ac-8b67-70e00c7962e1.jpg?v=1670938957',
      videoUrl: 'https://www.youtube.com/embed/YOztP47DGfM'
    },
    {
      name: 'Mountain Pose (Tadasana)',
      benefits: 'Improves posture and body alignment',
      description: 'Stand with feet together or hip-width apart. Distribute weight evenly through feet. Engage legs, lift chest, relax shoulders. Breathe deeply for 30-60 seconds.',
      imageUrl: 'https://media.istockphoto.com/id/1366703229/vector/palm-tree-pose-urdhva-hastasana-upward-hand-stretch-pose-upward-salute-raised-hands-pose.jpg?s=612x612&w=0&k=20&c=rY1lIudAf5GTFGFQq1FP_aIMOSXDuwBgTp5ipngSu5E=',
      videoUrl: 'https://www.youtube.com/embed/3lKyJZjUWt0'
    },
  ],
  high_blood_pressure: [
    {
      name: 'Easy Seated Pose (Sukhasana) with Deep Breathing',
      benefits: 'Lowers blood pressure through relaxation',
      description: 'Sit cross-legged with hands on knees. Keep spine straight. Practice slow, deep breathing for 5-10 minutes.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkPWttz7UEMIgBbvZUEvLFHPyxdwqtRSGKNg&s',
      videoUrl: 'https://www.youtube.com/embed/EWQtTem8aJI'
    },
    {
      name: 'Bound Angle Pose (Baddha Konasana)',
      benefits: 'Reduces stress and lowers blood pressure',
      description: 'Sit with soles of feet together, knees wide. Hold feet with hands. Sit tall and breathe deeply for 1-3 minutes.',
      imageUrl: 'https://images.pexels.com/photos/7592496/pexels-photo-7592496.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/i2kgPkYwOFE'
    },
  ],
  obesity: [
    {
      name: 'Sun Salutation (Surya Namaskar)',
      benefits: 'Boosts metabolism and promotes weight loss',
      description: 'A sequence of 12 flowing postures that provide a full-body workout. Practice 3-5 rounds daily, gradually increasing to 10-12 rounds.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaWAVQOAa06BN2AjF8wPa-2PugIURgDF66Iw&s',
      videoUrl: 'https://www.youtube.com/embed/1Y_Omt2xW8M'
    },
    {
      name: 'Boat Pose (Navasana)',
      benefits: 'Strengthens core muscles and boosts metabolism',
      description: 'Sit with knees bent. Lean back slightly while lifting feet off floor. Extend arms forward. Form a V-shape with body. Hold for 30-60 seconds.',
      imageUrl: 'https://images.pexels.com/photos/3758138/pexels-photo-3758138.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/VzttsHBNTCM'
    },
  ],
  respiratory_issues: [
    {
      name: 'Victorious Breath (Ujjayi Pranayama)',
      benefits: 'Improves lung capacity and respiratory function',
      description: 'Sit comfortably. Breathe in and out through nose with slight constriction at back of throat, creating an ocean-like sound. Practice for 5 minutes.',
      imageUrl: 'https://adiyogaashram.com/blog/wp-content/uploads/2024/08/ujaayi-pranayama-psychic-breathing.jpg',
      videoUrl: 'https://www.youtube.com/embed/S6d83BXbRJM'
    },
    {
      name: 'Bridge Pose (Setu Bandhasana)',
      benefits: 'Opens chest and improves breathing',
      description: 'Lie on back with knees bent, feet flat. Lift hips toward ceiling, rolling spine off floor. Hold 30-60 seconds while breathing deeply.',
      imageUrl: 'https://images.pexels.com/photos/3822650/pexels-photo-3822650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/9UhGvUJjGU4'
    },
  ],
  diabetes: [
    {
      name: 'Seated Forward Bend (Paschimottanasana)',
      benefits: 'Stimulates pancreas and helps regulate blood sugar',
      description: 'Sit with legs extended. Inhale, lengthen spine. Exhale, hinge at hips to fold forward, reaching toward feet. Hold 1-3 minutes.',
      imageUrl: 'https://images.pexels.com/photos/3822191/pexels-photo-3822191.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/KRCjWQ3fTL8'
    },
    {
      name: 'Half Spinal Twist (Ardha Matsyendrasana)',
      benefits: 'Stimulates digestive organs and helps manage blood sugar',
      description: 'Sit with legs extended. Bend right knee and place foot outside left thigh. Twist torso right, placing left elbow outside right knee. Hold, then switch sides.',
      imageUrl: 'https://www.keralatourism.org/images/yoga/static-banner/large/Ardha_Matsyendrasana_-_The_Spinal_Twist-07032020173900.jpg',
      videoUrl: 'https://www.youtube.com/embed/0bAoq8_0SFU'
    },
  ],
  arthritis: [
    {
      name: 'Gentle Wrist and Ankle Rotations',
      benefits: 'Improves joint mobility and reduces stiffness',
      description: 'Sitting comfortably, gently rotate wrists and ankles 5-10 times',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0585/3845/9329/files/Wrist-Rotation.jpg',
      videoUrl: 'https://www.youtube.com/embed/hzf_3WYLMY4'
    },
    {
      name: 'Seated Twist (Ardha Matsyendrasana)',
      benefits: 'Massages abdominal organs and aids digestion',
      description: 'Sit with legs extended. Bend right knee and place foot outside left thigh. Twist torso right, placing left elbow outside right knee. Hold, then switch sides.',
      imageUrl: 'https://www.keralatourism.org/images/yoga/static-banner/large/Ardha_Matsyendrasana_-_The_Spinal_Twist-07032020173900.jpg',
      videoUrl: 'https://www.youtube.com/embed/0bAoq8_0SFU'
    },
    {
      name: 'Forward Fold (Uttanasana)',
      benefits: 'Calms the mind and relieves stress',
      description: 'Stand with feet hip-width apart. Exhale and hinge at hips to fold forward. Let head hang heavy. Hold and breathe for 1-2 minutes.',
      imageUrl: 'https://images.pexels.com/photos/6698528/pexels-photo-6698528.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/1WCdOCtrHkM'

    },
  ],
  anxiety: [
    {
      name: 'Child\'s Pose (Balasana)',
      benefits: 'Gently stretches the lower back and promotes relaxation',
      description: 'Kneel on the floor, touch your big toes together, sit on your heels, and then lay your torso down between your thighs. Extend arms forward or alongside body.',
      imageUrl: 'https://images.pexels.com/photos/4534597/pexels-photo-4534597.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/YQampHZSJRs'
    },
    {
      name: 'Corpse Pose (Savasana) with Deep Breathing',
      benefits: 'Promotes deep relaxation and stress relief',
      description: 'Lie on your back with legs slightly apart and arms at sides, palms up. Close your eyes and focus on deep, slow breathing for 5-10 minutes.',
      imageUrl: 'https://images.pexels.com/photos/6998214/pexels-photo-6998214.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/ihO02wUzgks'
    },
    {
      name: 'Surya Namaskar (Sun Salutation)',
      benefits: 'Improves flexibility, strengthens muscles and joints, boosts blood circulation, and energizes the body',
      description: 'A dynamic sequence of 12 yoga poses performed in a flowing manner, combining breath with movement. Each round includes forward and backward bending, engaging different muscle groups and enhancing overall vitality.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaWAVQOAa06BN2AjF8wPa-2PugIURgDF66Iw&s',
      videoUrl: 'https://www.youtube.com/embed/1Y_Omt2xW8M'
    }
  ],
  migraine: [
    {
      name: 'Child\'s Pose (Balasana)',
      benefits: 'Gently stretches the lower back and promotes relaxation',
      description: 'Kneel on the floor, touch your big toes together, sit on your heels, and then lay your torso down between your thighs. Extend arms forward or alongside body.',
      imageUrl: 'https://images.pexels.com/photos/4534597/pexels-photo-4534597.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/YQampHZSJRs'
    },
    {
      name: 'Downward-Facing Dog (Adho Mukha Svanasana)',
      benefits: 'Strengthens arms and legs, stretches the spine and hamstrings, improves circulation, and relieves fatigue',
      description: 'Start on hands and knees, tuck your toes, and lift your hips up and back to form an inverted V-shape. Keep your hands shoulder-width apart and feet hip-width apart. Hold the pose for 1-3 minutes while breathing deeply.',
      imageUrl: 'https://images.pexels.com/photos/4534578/pexels-photo-4534578.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/DP3xpw2xtVE'
    },
    {
      name: 'Lotus Pose (Padmasana)',
      benefits: 'Calms the mind, improves posture, enhances digestion, and prepares the body for meditation',
      description: 'Sit with legs crossed, placing each foot on the opposite thigh with soles facing upward. Keep your spine straight, hands resting on knees, and eyes gently closed. Focus on your breath and remain in the pose for 5–15 minutes.',
      imageUrl: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/2-cKoBT0YZ8'
    },
    {
      name: 'Corpse Pose (Savasana) with Deep Breathing',
      benefits: 'Promotes deep relaxation and stress relief',
      description: 'Lie on your back with legs slightly apart and arms at sides, palms up. Close your eyes and focus on deep, slow breathing for 5-10 minutes.',
      imageUrl: 'https://images.pexels.com/photos/6998214/pexels-photo-6998214.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/ihO02wUzgks'
    }
  ],
  depression : [
    {
      name: 'Cobra Pose (Bhujangasana)',
      benefits: 'Strengthens the spine, opens the chest and shoulders, improves posture, and helps relieve stress and fatigue',
      description: 'Lie on your stomach with legs extended and palms placed under the shoulders. Inhale and gently lift your chest off the ground by pressing into your hands, keeping elbows slightly bent. Hold for 15–30 seconds while breathing deeply, then release back down.',
      imageUrl: 'https://images.pexels.com/photos/3823076/pexels-photo-3823076.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/z21SCcKogWQ'
    },
    {
      name: 'Tree Pose (Vrikshasana)',
      benefits: 'Improves balance and stability, strengthens legs and core, and enhances focus and concentration',
      description: 'Stand tall, shift your weight onto one leg, and place the sole of the opposite foot on the inner thigh or calf (avoid the knee). Bring palms together in prayer position at the chest or overhead. Hold for 30 seconds to 1 minute while maintaining steady breath, then switch sides.',
      imageUrl: 'https://images.pexels.com/photos/9004274/pexels-photo-9004274.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/IfiN2y7vGGo'
    },
    {
      name: 'Downward-Facing Dog (Adho Mukha Svanasana)',
      benefits: 'Strengthens arms and legs, stretches the spine and hamstrings, improves circulation, and relieves fatigue',
      description: 'Start on hands and knees, tuck your toes, and lift your hips up and back to form an inverted V-shape. Keep your hands shoulder-width apart and feet hip-width apart. Hold the pose for 1-3 minutes while breathing deeply.',
      imageUrl: 'https://images.pexels.com/photos/4534578/pexels-photo-4534578.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/DP3xpw2xtVE'

    }
  ],
  thyroid: [
    {
      name: 'Shoulder Stand (Sarvangasana)',
      benefits: 'Stimulates thyroid gland, improves circulation, and calms the mind',
      description: 'Lie on your back, lift your legs overhead, and support your lower back with your hands. Keep your elbows close together and hold for 30 seconds to 1 minute.',
      imageUrl: 'https://images.pexels.com/photos/6246676/pexels-photo-6246676.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/8vBuJ1GJo5w'
    },
    {
      name: 'Fish Pose (Matsyasana)',
      benefits: 'Stretches the neck and throat, opens the chest, and stimulates the thyroid gland',
      description: 'Lie on your back, lift your chest, and arch your back while resting the crown of your head on the floor. Hold for 30 seconds to 1 minute.',
      imageUrl: 'https://images.pexels.com/photos/3822585/pexels-photo-3822585.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/JVJBEhPPcUU'
    },
    {
      name: 'Bridge Pose (Setu Bandhasana)',
      benefits: 'Opens chest and improves breathing',
      description: 'Lie on back with knees bent, feet flat. Lift hips toward ceiling, rolling spine off floor. Hold 30-60 seconds while breathing deeply.',
      imageUrl: 'https://images.pexels.com/photos/3822650/pexels-photo-3822650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      videoUrl: 'https://www.youtube.com/embed/9UhGvUJjGU4'
    }
  ]
};

const YogaRecommendations: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for video modal
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedPose, setSelectedPose] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [userConditions, setUserConditions] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Array<{
    name: string,
    benefits: string,
    description: string,
    imageUrl: string,
    videoUrl: string,
    forCondition: string
  }>>([]);

  useEffect(() => {
    const fetchHealthAssessment = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('health_assessments')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No assessment found
            navigate('/health-assessment');
            return;
          }
          throw error;
        }
        
        // Extract the user's health conditions
        const conditions = Object.entries(data)
          .filter(([key, value]) => 
            value === true && 
            key !== 'id' && 
            key !== 'created_at' && 
            key !== 'user_id')
          .map(([key]) => key);
        
        setUserConditions(conditions);
        
        // Generate recommendations based on conditions
        const allRecommendations: Array<{
          name: string,
          benefits: string,
          description: string,
          imageUrl: string,
          forCondition: string
        }> = [];
        
        conditions.forEach(condition => {
          const conditionRecs = yogaRecommendations[condition] || [];
          conditionRecs.forEach(rec => {
            allRecommendations.push({
              ...rec,
              forCondition: condition.replace(/_/g, ' ')
            });
          });
        });
        
        setRecommendations(allRecommendations);
        
      } catch (error: any) {
        console.error('Error fetching health assessment:', error);
        setErrorMsg(error.message || 'Failed to load health assessment');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthAssessment();
  }, [user, navigate]);

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <p className="text-lg text-gray-700">Please login to view your yoga recommendations.</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-purple-700 py-6 px-6">
            <h2 className="text-2xl font-serif font-bold text-white">Your Personalized Yoga Recommendations</h2>
            <p className="text-purple-200">
              Based on your health assessment, we've curated these yoga poses to help with your specific needs
            </p>
          </div>
          
          <div className="p-6">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                <p>{errorMsg}</p>
                <button
                  onClick={() => navigate('/health-assessment')}
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Retake Health Assessment
                </button>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
              </div>
            ) : userConditions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-700 mb-4">
                  You haven't selected any health conditions in your assessment.
                </p>
                <button
                  onClick={() => navigate('/health-assessment')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Update Health Assessment
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Your selected health concerns:</h3>
                  <div className="flex flex-wrap gap-2">
                    {userConditions.map(condition => (
                      <span 
                        key={condition}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                      >
                        {condition.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec, index) => (
                    <div
                      key={`${rec.name}-${index}`}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setVideoLoading(true);
                        setSelectedVideo(rec.videoUrl);
                        setSelectedPose(rec.name);
                      }}
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={rec.imageUrl}
                          alt={rec.name}
                          className="w-full h-full object-cover object-center"
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="bg-white bg-opacity-90 rounded-full p-3">
                            <Play className="h-8 w-8 text-purple-600" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full mb-2">
                          For {rec.forCondition}
                        </span>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">{rec.name}</h3>
                        <p className="text-sm text-purple-700 font-medium mb-2">{rec.benefits}</p>
                        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-purple-600 font-medium">
                            <Play className="h-4 w-4 mr-1" />
                            Click to watch video
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/yoga-session', {
                                state: {
                                  pose: {
                                    name: rec.name,
                                    duration: 300,
                                    description: rec.description,
                                    instructions: rec.description,
                                    category: rec.forCondition,
                                    videoUrl: rec.videoUrl
                                  }
                                }
                              });
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                          >
                            Start Session
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => navigate('/health-assessment')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Update Health Assessment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal with Lazy Loading */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">{selectedPose}</h3>
              <button
                onClick={() => {
                  setSelectedVideo(null);
                  setSelectedPose(null);
                  setVideoLoading(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="aspect-video relative">
              {/* Loading spinner while video loads */}
              {videoLoading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm">Loading video...</p>
                  </div>
                </div>
              )}
              {/* Lazy loaded YouTube iframe */}
              <iframe
                src={selectedVideo}
                title={selectedPose}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                onLoad={() => setVideoLoading(false)}
                style={{ display: videoLoading ? 'none' : 'block' }}
              />
            </div>
            <div className="p-4 text-center">
              <p className="text-sm text-gray-600">
                Follow along with this video to practice the pose safely and effectively.
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default YogaRecommendations;
