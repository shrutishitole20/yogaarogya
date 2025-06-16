import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, BarChart, Heart, Shield } from 'lucide-react';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-purple-600 opacity-90"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Discover Your Path to <span className="text-green-300">Balance</span> and <span className="text-green-300">Wellness</span>
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mb-8">
            Personalized yoga practices tailored to your unique health needs and goals.
            Join our community of wellness seekers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Begin Your Journey
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
              Why Choose YOGAAROGYA?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers comprehensive yoga solutions tailored to your specific health needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Expert Guidance
              </h3>
              <p className="text-gray-600">
                Access professionally designed yoga practices perfect for all experience levels.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Personalized Recommendations
              </h3>
              <p className="text-gray-600">
                Receive yoga asanas tailored to your specific health conditions and wellness goals.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <BarChart className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Track Your Progress
              </h3>
              <p className="text-gray-600">
                Monitor your yoga journey with easy-to-understand metrics and insights.
              </p>
            </div>
            
            
          </div>
        </div>
      </section>
      
      {/* Health Conditions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
              Yoga for Every Health Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer specialized yoga practices for a wide range of health conditions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Back Pain',
              'Stress & Anxiety',
              'Digestive Issues',
              'Insomnia',
              'High Blood Pressure',
              'Joint Pain',
              'Migraine',
              'Respiratory Issues'
            ].map((condition, index) => (
              <div key={index} className="bg-purple-50 rounded-lg p-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-800">{condition}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Start Your Health Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-purple-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Hear from people who've transformed their lives with YOGAAROGYA.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-800 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-purple-100 mb-4">
                "The personalized yoga recommendations helped me manage my back pain effectively. I feel relieved after just 3 days!"
              </p>
              <div className="font-medium">Lahari..., 18</div>
            </div>
            
            <div className="bg-purple-800 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-purple-100 mb-4">
                "As someone with high blood pressure, finding the right exercise was challenging. YOGAAROGYA's recommendations were perfect for my condition."
              </p>
              <div className="font-medium">Phani Kumar.., 52</div>
            </div>
            
            <div className="bg-purple-800 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-purple-100 mb-4">
                "I've struggled with Migraine for months. The aasanas recommended by YOGAAROGYA have become an essential part of my daily routine."
              </p>
              <div className="font-medium">Siri., 20</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
            Ready to Transform Your Wellness Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who have discovered the perfect yoga practice for their unique needs.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
          >
            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

// Star component for testimonials
const Star = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export default Home;