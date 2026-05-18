import React, { useMemo } from 'react';
import { Moon, Droplets, Zap, Bed } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';

const SleepHealth = () => {
  const { user, updateWater, updateStats, addHistory } = useAuth();

  // Extract real user stats (default to 0 for new users)
  const waterIntake = user?.water || 0;
  const sleepMinutes = user?.sleepDuration || 0;
  const sleepHours = sleepMinutes / 60;
  const focusScore = user?.focusScore || 0;
  
  // Extract screen time (default to 0)
  const screenTimeMins = (user && typeof user.screenTime === 'object' && user.screenTime.total) 
    ? user.screenTime.total 
    : 0;
  const screenTimeHours = (screenTimeMins / 60).toFixed(1);

  // Dynamic Sleep chart data based on user's actual logged sleep (zero by default for new users)
  const sleepChartData = useMemo(() => {
    return [
      { day: 'Tue', hours: 0 },
      { day: 'Wed', hours: 0 },
      { day: 'Thu', hours: 0 },
      { day: 'Fri', hours: 0 },
      { day: 'Sat', hours: 0 },
      { day: 'Sun', hours: parseFloat(sleepHours.toFixed(1)) }, // Current logged sleep duration
    ];
  }, [sleepHours]);

  // Dynamic stress level calculation based on screen time vs sleep duration
  const stressLevelPercent = useMemo(() => {
    if (screenTimeMins === 0 && sleepMinutes === 0) return 0;
    // High screen time + low sleep = high stress
    const ratio = (screenTimeMins + 1) / (sleepMinutes + 1);
    if (ratio > 2) return 85;
    if (ratio > 1.2) return 65;
    if (ratio > 0.6) return 45;
    return 25;
  }, [screenTimeMins, sleepMinutes]);

  const stressText = useMemo(() => {
    if (stressLevelPercent === 0) return 'Zero Tracking';
    if (stressLevelPercent >= 80) return 'High Stress';
    if (stressLevelPercent >= 60) return 'Moderate Stress';
    if (stressLevelPercent >= 40) return 'Mild Stress';
    return 'Optimal / Relaxed';
  }, [stressLevelPercent]);

  // Compute a dynamic, authentic solid color based on current stress level 
  const stressColor = useMemo(() => {
    if (stressLevelPercent === 0) return 'rgba(255, 255, 255, 0.15)';
    if (stressLevelPercent >= 80) return '#ef4444'; // Red for high stress
    if (stressLevelPercent >= 60) return '#f97316'; // Orange for moderate stress
    if (stressLevelPercent >= 40) return '#fbbf24'; // Yellow for mild stress
    return '#10b981'; // Emerald Green for optimal/relaxed
  }, [stressLevelPercent]);

  const stressAdvice = useMemo(() => {
    if (stressLevelPercent === 0) return 'Log your screen time and sleep to analyze stress indicators.';
    if (stressLevelPercent >= 80) return 'High cognitive strain detected. Shut down screens immediately and do deep breathing.';
    if (stressLevelPercent >= 60) return 'Stress is slightly elevated. Consider a 10-minute short walk and hydrate.';
    return 'Your heart rate variability is stable and stress levels are optimal. Great job!';
  }, [stressLevelPercent]);

  return (
    <div className="sleep-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '80px' }}>
      <header>
        <h1 className="text-gradient">Sleep & Physical Health</h1>
        <p className="text-muted">Track your recovery and maintain physical vitality.</p>
      </header>

      {/* Grid: 3 Glass Cards for Sleep, Water, and Stress */}
      <div className="sleep-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Card 1: Sleep Duration Chart */}
        <GlassCard title="Sleep Duration" subtitle={`Average: ${sleepHours.toFixed(1)} hours`}>
          <div style={{ height: 220, marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepChartData}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-dark)', 
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    color: '#fff' 
                  }} 
                />
                <Area type="monotone" dataKey="hours" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Card 2: Interactive Water Intake */}
        <GlassCard title="Water Intake" className="water-tracking">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '10px' }}>
            <div className="water-bubble" style={{ 
              width: 120, height: 120, borderRadius: '50%', background: 'rgba(34, 211, 238, 0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--accent)',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)', position: 'relative', overflow: 'hidden'
            }}>
              {/* Fill effect depending on hydration */}
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                width: '100%', 
                height: `${Math.min(100, (waterIntake / 2.5) * 100)}%`, 
                background: 'var(--accent)', 
                opacity: 0.25,
                transition: 'height 0.5s ease-in-out'
              }} />
              <h2 style={{ zIndex: 1, color: '#fff', fontSize: '24px', fontWeight: 700 }}>{waterIntake.toFixed(2)}L</h2>
            </div>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Goal: 2.5L</p>
            <button 
              className="btn-primary" 
              onClick={() => {
                updateWater(0.25);
                if (addHistory) {
                  addHistory('Logged +250ml water intake', 'Health');
                }
              }}
              style={{
                background: 'var(--accent)',
                color: '#000',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              + 250ml
            </button>
          </div>
        </GlassCard>

        {/* Card 3: Stress Level Monitor */}
        <GlassCard title="Stress Level" subtitle={`Current: ${stressText}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>Relaxed</span>
              <span>Stressed</span>
            </div>
            <div className="progress-bar" style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${stressLevelPercent}%`, 
                  background: stressColor,
                  boxShadow: `0 0 10px ${stressColor}40`,
                  height: '100%',
                  borderRadius: '5px',
                  transition: 'width 0.4s ease-out, background-color 0.3s ease-out'
                }} 
              />
            </div>
            <p className="text-dim" style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              {stressAdvice}
            </p>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default SleepHealth;
