import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cog as Yoga, User, BarChart3, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserCounter from './UserCounter';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Yoga size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { path: '/health-assessment', label: 'Health Assessment', icon: <User size={20} /> },
    { path: '/feedback', label: 'Feedback', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Yoga className="text-green-700" size={32} />
            <span className="text-2xl font-serif font-bold text-purple-800">YOGAAROGYA</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'text-purple-800 bg-purple-50'
                        : 'text-gray-600 hover:text-purple-800 hover:bg-purple-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button 
                  onClick={() => signOut()} 
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-gray-700">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute z-20 w-full border-t">
            <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
              {user ? (
                <>
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      className={`flex items-center space-x-2 px-4 py-3 rounded-md ${
                        location.pathname === item.path
                          ? 'text-purple-800 bg-purple-50'
                          : 'text-gray-600 hover:text-purple-800 hover:bg-purple-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }} 
                    className="flex items-center space-x-2 px-4 py-3 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-4 py-3 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-serif font-semibold mb-4">YOGAAROGYA</h3>
              <p className="text-purple-200">
                Bringing balance to your life through the ancient practice of yoga.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-purple-200 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-purple-200 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/privacy" className="text-purple-200 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-purple-200 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold mb-4">Contact Us</h3>
              <p className="text-purple-200">info@yogaarogya.com</p>
              <p className="text-purple-200">+1 123 456 7890</p>
              <div className="mt-4">
                <UserCounter />
              </div>
            </div>
          </div>
          <div className="border-t border-purple-800 mt-8 pt-4 text-center text-purple-300">
            <p>&copy; {new Date().getFullYear()} YOGAAROGYA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;