import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import HealthAssessment from './pages/HealthAssessment';
import YogaRecommendations from './pages/YogaRecommendations';
import YogaSession from './pages/YogaSession';
import Feedback from './pages/Feedback';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health-assessment" element={<HealthAssessment />} />
            <Route path="/yoga-recommendations" element={<YogaRecommendations />} />
            <Route path="/yoga-session" element={<YogaSession />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
