import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HabitTracker from './pages/HabitTracker';
import Analytics from './pages/Analytics';
import FocusMode from './pages/FocusMode';
import SleepHealth from './pages/SleepHealth';
import Challenges from './pages/Challenges';
import PremiumDashboard from './pages/PremiumDashboard';
import Login from './pages/Login';
import './index.css';
import './styles/Premium.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* Wrap routes that need the Layout and protection */}
              <Route element={<ProtectedRoute><LayoutWrapper /></ProtectedRoute>}>
              <Route path="/" element={<HomeSelector />} />
              <Route path="/habits" element={<HabitTracker />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/focus" element={<FocusMode />} />
              <Route path="/sleep" element={<SleepHealth />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/premium" element={<PremiumDashboard />} />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
    </AuthProvider>
  );
}

// Helper components to handle dynamic layout and home page
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const HomeSelector = () => {
  const { isPremium } = useUser();
  return isPremium ? <PremiumDashboard /> : <Dashboard />;
};

export default App;
