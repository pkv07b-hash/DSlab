import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, Wind, Coffee, Brain, Sparkles, Music } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import '../styles/Focus.css';

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, short-break, long-break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound notification here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : mode === 'short-break' ? 5 * 60 : 15 * 60);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : newMode === 'short-break' ? 5 * 60 : 15 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'focus' ? 25 * 60 : mode === 'short-break' ? 5 * 60 : 15 * 60)) * 100;

  return (
    <div className="focus-page">
      <div className="focus-container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="timer-display glass-card"
        >
          <div className="timer-modes">
            <button className={mode === 'focus' ? 'active' : ''} onClick={() => changeMode('focus')}>Focus</button>
            <button className={mode === 'short-break' ? 'active' : ''} onClick={() => changeMode('short-break')}>Short Break</button>
            <button className={mode === 'long-break' ? 'active' : ''} onClick={() => changeMode('long-break')}>Long Break</button>
          </div>

          <div className="timer-circle-container">
            <svg className="timer-svg" viewBox="0 0 100 100">
              <circle className="timer-bg" cx="50" cy="50" r="45" />
              <motion.circle 
                className="timer-progress" 
                cx="50" cy="50" r="45"
                style={{
                  strokeDasharray: 283,
                  strokeDashoffset: 283 - (283 * (100 - progress)) / 100,
                  stroke: mode === 'focus' ? 'var(--primary)' : 'var(--success)'
                }}
              />
            </svg>
            <div className="timer-content">
              <h1>{formatTime(timeLeft)}</h1>
              <p>{mode === 'focus' ? 'Stay Focused' : 'Take a Break'}</p>
            </div>
          </div>

          <div className="timer-controls">
            <button className="control-btn secondary" onClick={resetTimer}>
              <RotateCcw size={24} />
            </button>
            <button className="control-btn primary" onClick={toggleTimer}>
              {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
            </button>
            <button className="control-btn secondary">
              <Volume2 size={24} />
            </button>
          </div>
        </motion.div>

        <div className="focus-sidebar">
          <GlassCard title="Ambient Sounds" className="ambient-card">
            <div className="sounds-grid">
              <button className="sound-item active"><Wind size={20} /> <span>Rain</span></button>
              <button className="sound-item"><Wind size={20} /> <span>Forest</span></button>
              <button className="sound-item"><Wind size={20} /> <span>White Noise</span></button>
              <button className="sound-item"><Wind size={20} /> <span>Waves</span></button>
            </div>
          </GlassCard>

          <GlassCard title="Focus Tips" className="tips-card">
            <div className="tip-item">
              <Brain size={18} className="text-primary" />
              <p>Close all unnecessary browser tabs to reduce distractions.</p>
            </div>
            <div className="tip-item">
              <Coffee size={18} className="text-success" />
              <p>During breaks, stand up and stretch or drink some water.</p>
            </div>
            <div className="tip-item">
              <Sparkles size={18} style={{ color: '#fbbf24' }} />
              <p>Maintain a clean workspace to improve concentration and clarity.</p>
            </div>
            <div className="tip-item">
              <Music size={18} style={{ color: '#a855f7' }} />
              <p>Avoid constantly changing songs while working to stay focused.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
