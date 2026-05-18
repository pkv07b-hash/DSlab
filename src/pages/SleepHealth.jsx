import React, { useMemo } from 'react';
import { Moon, Droplets, Zap, Bed, Activity, Sparkles, Heart, Brain } from 'lucide-react';
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

  const stressAdvice = useMemo(() => {
    if (stressLevelPercent === 0) return 'Log your screen time and sleep to analyze stress indicators.';
    if (stressLevelPercent >= 80) return 'High cognitive strain detected. Shut down screens immediately and do deep breathing.';
    if (stressLevelPercent >= 60) return 'Stress is slightly elevated. Consider a 10-minute short walk and hydrate.';
    return 'Your heart rate variability is stable and stress levels are optimal. Great job!';
  }, [stressLevelPercent]);

  // AI Wellness Report Generator (Simulating full data payload sent to AI for lifestyle and routine analysis)
  const aiReport = useMemo(() => {
    const isNewUser = waterIntake === 0 && sleepMinutes === 0 && screenTimeMins === 0;

    if (isNewUser) {
      return {
        healthStatus: "Initializing Biometric Engine",
        lifestyleSummary: "Ready to analyze",
        routineScore: "0/100",
        note: "Welcome to Aura AI! Our cognitive analysis engine is fully primed. Currently, your daily wellness dashboard is starting from zero. Please begin logging your screen time, sleep duration, and water intake on the home screen. Once logged, this AI hub will instantly run an advanced analysis of your lifestyle habits, hydration cells, and bedtime routines to deliver highly tailored optimization notes!"
      };
    }

    // Hydration analysis
    const waterGoalPercent = Math.min(100, Math.round((waterIntake / 2.5) * 100));
    const hydrationFeedback = waterIntake >= 2.5 
      ? "Hydration cells are perfectly filled! Your kidney and cognitive functions are operating at maximum capacity." 
      : `Hydration is at ${waterIntake}L (${waterGoalPercent}% of the 2.5L goal). Increasing water intake will immediately improve concentration levels and reduce fatigue.`;

    // Bedtime analysis
    const sleepFeedback = sleepHours >= 8 
      ? "Excellent sleep recovery! Your body is logging over 8 hours of premium deep rest, boosting physical muscle repair."
      : sleepHours >= 6
      ? `Rest period is moderate (${sleepHours.toFixed(1)}h). Aiming for 7-8 hours will dramatically improve your focus score and memory retention.`
      : `Critical sleep deficit detected (${sleepHours.toFixed(1)}h). Your circadian rhythm is compromised. Establish a strict screen-free wind-down routine 30 minutes before bed.`;

    // Digital routine analysis
    const digitalFeedback = screenTimeMins > 240
      ? `Excessive screen exposure observed (${screenTimeHours}h). Your central nervous system is highly stimulated. This screen routine impairs sleep quality.`
      : `Balanced digital routine (${screenTimeHours}h). Your screen-to-sleep ratios are healthy, keeping stress hormones minimal.`;

    const overallScore = Math.min(100, Math.round(
      (Math.min(1, waterIntake / 2.5) * 40) + 
      (Math.min(1, sleepHours / 8) * 40) + 
      (screenTimeMins < 180 ? 20 : Math.max(0, 20 - (screenTimeMins - 180) / 10))
    ));

    const finalNote = `AI CLINICAL INSIGHT: Your overall digital-wellness score is ${overallScore}/100. ${hydrationFeedback} ${sleepFeedback} ${digitalFeedback} Recommendation: To improve your routine tomorrow, establish a strict sleep goal and take regular 250ml water intervals.`;

    return {
      healthStatus: waterIntake >= 2.0 && sleepHours >= 7 ? "Optimal Vitality" : "Rest & Rehydrate Required",
      lifestyleSummary: screenTimeMins > 240 ? "Sedentary Screen-Dominant" : "Active Balanced Wellness",
      routineScore: `${overallScore}/100`,
      note: finalNote
    };
  }, [waterIntake, sleepMinutes, screenTimeMins, sleepHours, screenTimeHours]);

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
                  background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)',
                  height: '100%',
                  borderRadius: '5px',
                  transition: 'width 0.4s ease-out'
                }} 
              />
            </div>
            <p className="text-dim" style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              {stressAdvice}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* 🧠 Premium AI Wellness & Lifestyle Analysis Report Card */}
      <GlassCard 
        title="AI Wellness & Lifestyle Analysis" 
        subtitle="Dynamic routine review synthesized from your live biometrics"
        style={{
          border: '1px solid rgba(99, 102, 241, 0.2)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(30, 30, 40, 0.6))',
          boxShadow: '0 10px 40px rgba(99, 102, 241, 0.05)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px' }}>
          
          {/* Sub-Header Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={20} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>HEALTH VITALITY</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{aiReport.healthStatus}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>LIFESTYLE PATH</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{aiReport.lifestyleSummary}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={20} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>DYNAMIC ROUTINE SCORE</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>{aiReport.routineScore}</span>
              </div>
            </div>
          </div>

          {/* AI Analysis Note */}
          <div style={{ position: 'relative', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '4px', color: 'var(--primary)', animation: 'pulse 2s infinite' }}>
              <Sparkles size={24} className="text-gradient" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#fff', fontWeight: 600 }}>AI Wellness Coach Report:</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {aiReport.note}
              </p>
            </div>
          </div>
          
        </div>
      </GlassCard>

    </div>
  );
};

export default SleepHealth;
