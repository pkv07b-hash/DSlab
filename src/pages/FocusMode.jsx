import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Wind, Coffee, Brain, Sparkles, Music, Zap, Clock, ShieldCheck } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import '../styles/Focus.css';

// Global variable to cache the AudioContext instance and prevent browser audio instance leaks/limitations
let sharedAudioCtx = null;

const getAudioContext = () => {
  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch (e) {
    console.warn("Web Audio API not supported", e);
    return null;
  }
};

// Synthesized Audio Chimes & Sounds using standard Web Audio API
const playTick = (isMuted) => {
  if (isMuted) return;
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;
    
    // Primary warm mechanical woodblock body tone
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(380, audioCtx.currentTime); // Warm acoustic woodblock frequency
    gain1.gain.setValueAtTime(0.35, audioCtx.currentTime); // Increased audible volume
    gain1.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.06); // Soft mechanical decay
    
    // Crisp transient snap
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(950, audioCtx.currentTime); // High clock click snap
    gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.02);
    
    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.08);
    osc2.stop(audioCtx.currentTime + 0.04);
  } catch (e) {
    console.warn("Web Audio Context tick sound blocked/not supported", e);
  }
};

const playRingStart = (isMuted) => {
  if (isMuted) return;
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;
    
    // First high note
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
    gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
    
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.4);

    // Second harmony note slightly delayed
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.08); // A5 ring chime
    gain2.gain.setValueAtTime(0.06, audioCtx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.45);
    
    osc2.start(audioCtx.currentTime + 0.08);
    osc2.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.warn("Web Audio ring start blocked/not supported", e);
  }
};

const playRingEnd = (isMuted) => {
  if (isMuted) return;
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 bell tone
    osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.15); // Slide up to A5
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2); // Elegant long bell chime decay
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1.3);
  } catch (e) {
    console.warn("Web Audio ring end blocked/not supported", e);
  }
};

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // break, focus, short-break, long-break
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            playRingEnd(isMuted); // Elegant end ring chime
            return 0;
          }
          playTick(isMuted); // Synthesized clock tick sound every single second
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isMuted]);

  const toggleTimer = () => {
    if (!isActive) {
      playRingStart(isMuted); // Ring starting chime!
    }
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'break') {
      setTimeLeft(totalTime);
    } else {
      setTimeLeft(mode === 'focus' ? 25 * 60 : mode === 'short-break' ? 5 * 60 : 15 * 60);
    }
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'break') {
      const minutes = prompt("Enter your custom time (in minutes):", "15");
      const minsParsed = parseInt(minutes, 10);
      if (!isNaN(minsParsed) && minsParsed > 0) {
        setTimeLeft(minsParsed * 60);
        setTotalTime(minsParsed * 60);
      } else {
        setTimeLeft(15 * 60);
        setTotalTime(15 * 60);
      }
    } else {
      const mins = newMode === 'focus' ? 25 * 60 : newMode === 'short-break' ? 5 * 60 : 15 * 60;
      setTimeLeft(mins);
      setTotalTime(mins);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  // Circular progress scale factor: shrinks down and reduces to 0 (appears as nothing) as the timer reaches 0
  const circleScale = progress / 100;

  return (
    <div className="focus-page">
      <div className="focus-container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="timer-display glass-card"
        >
          <div className="timer-modes">
            <button className={mode === 'break' ? 'active' : ''} onClick={() => changeMode('break')}>Manual</button>
            <button className={mode === 'focus' ? 'active' : ''} onClick={() => changeMode('focus')}>Focus</button>
            <button className={mode === 'short-break' ? 'active' : ''} onClick={() => changeMode('short-break')}>Short Break</button>
            <button className={mode === 'long-break' ? 'active' : ''} onClick={() => changeMode('long-break')}>Long Break</button>
          </div>

          <div className="timer-circle-container">
            <svg 
              className="timer-svg" 
              viewBox="0 0 100 100"
              style={{
                transform: `rotate(-90deg) scale(${circleScale})`,
                transformOrigin: 'center',
                transition: 'transform 1s linear, opacity 1s linear',
                opacity: circleScale
              }}
            >
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
              <p>{mode === 'focus' ? 'Stay Focused' : mode === 'break' ? 'Custom Time' : 'Take a Break'}</p>
            </div>
          </div>

          <div className="timer-controls">
            <button className="control-btn secondary" onClick={resetTimer}>
              <RotateCcw size={24} />
            </button>
            <button className="control-btn primary" onClick={toggleTimer}>
              {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
            </button>
            <button className="control-btn secondary" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={24} style={{ color: 'var(--danger)' }} /> : <Volume2 size={24} />}
            </button>
          </div>
        </motion.div>

        <div className="focus-sidebar">
          <GlassCard title="Focus Tips" className="tips-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="tip-item">
                <Brain size={20} className="text-primary" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0 }}>Close all unnecessary browser tabs to reduce distractions.</p>
              </div>
              <div className="tip-item">
                <Coffee size={20} className="text-success" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0 }}>During breaks, stand up and stretch or drink some water.</p>
              </div>
              <div className="tip-item">
                <Sparkles size={20} style={{ color: '#fbbf24', flexShrink: 0 }} />
                <p style={{ margin: 0 }}>Maintain a clean workspace to improve concentration and clarity.</p>
              </div>
              <div className="tip-item">
                <Music size={20} style={{ color: '#a855f7', flexShrink: 0 }} />
                <p style={{ margin: 0 }}>Avoid constantly changing songs while working to stay focused.</p>
              </div>
              <div className="tip-item">
                <Zap size={20} className="text-premium" style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <p style={{ margin: 0 }}>Use the Pomodoro technique: 25 minutes of work followed by a 5-minute break.</p>
              </div>
              <div className="tip-item">
                <ShieldCheck size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                <p style={{ margin: 0 }}>Mute your phone notifications or put it in another room to prevent interruptions.</p>
              </div>
              <div className="tip-item">
                <Clock size={20} style={{ color: '#22d3ee', flexShrink: 0 }} />
                <p style={{ margin: 0 }}>Set clear goals for each focus session so you know exactly what needs to be done.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
