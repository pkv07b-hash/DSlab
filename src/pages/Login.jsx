import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const res = login(email, password);
      if (res.success) navigate('/');
      else setError(res.message);
    } else {
      const res = signup(email, password, name);
      if (res.success) {
        setIsLogin(true);
        setError('Account created! Please login.');
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-content-wrapper">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="login-hero-section"
        >
          <h1 className="hero-title">Optimized Digital Habit Tracker</h1>
          <p className="hero-subtitle">Redesign your lifestyle with Digital Habit Tracking built for productivity and personal growth,<br />helping you to reduce distractions, stay consistent, and focus on achieving real-world goals...</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="login-card-left"
        >
          <div className="card-header">
            <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
            <p>{isLogin ? 'Login to your wellness dashboard' : 'Start your journey with Aura today'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="input-group">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            )}
            
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-submit">
              {isLogin ? 'Login' : 'Sign Up'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-footer">
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="bg-glow"></div>
    </div>
  );
};

export default Login;
