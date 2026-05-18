import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  TrendingUp, 
  Zap, 
  Brain, 
  Star, 
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Clock,
  Droplets,
  Moon,
  Award,
  PlusCircle,
  Heart,
  Activity,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import HistoryModal from '../components/HistoryModal';
import ManualScreenTimeModal from '../components/ManualScreenTimeModal';
import { History } from 'lucide-react';
import '../styles/Dashboard.css';

const PremiumDashboard = () => {
  const { user, updateWater, updateStats, addHistory } = useAuth();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isScreenTimeModalOpen, setIsScreenTimeModalOpen] = useState(false);
  
  const getScreenTimeDisplay = () => {
    if (typeof user?.screenTime === 'string') {
      return user.screenTime;
    }
    if (user?.screenTime?.total) {
      const hours = Math.floor(user.screenTime.total / 60);
      const minutes = user.screenTime.total % 60;
      return `${hours}h ${minutes}m`;
    }
    return '0h 0m';
  };
  
  const formatSleepDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };
  
  const stats = [
    { icon: Clock, label: 'Screen Time', value: getScreenTimeDisplay(), change: '-22%', color: 'var(--primary)', isScreenTime: true },
    { 
      icon: Droplets, 
      label: 'Water Intake', 
      value: `${user?.water || 0}L / 2.5L`, 
      change: '+10%', 
      color: '#22d3ee',
      isWater: true
    },
    { icon: Moon, label: 'Sleep Duration', value: formatSleepDuration(user?.sleepDuration || 0), change: '+30m', color: '#a855f7', isSleep: true },
    { icon: Brain, label: 'Focus Score', value: '0/100', color: 'var(--secondary)' },
  ];

  const waterIntake = user?.water || 0;
  const sleepMinutes = user?.sleepDuration || 0;
  const sleepHours = sleepMinutes / 60;
  const screenTimeMins = (user && typeof user.screenTime === 'object' && user.screenTime.total) 
    ? user.screenTime.total 
    : 0;
  const screenTimeHours = (screenTimeMins / 60).toFixed(1);

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

    const waterGoalPercent = Math.min(100, Math.round((waterIntake / 2.5) * 100));
    const hydrationFeedback = waterIntake >= 2.5 
      ? "Hydration cells are perfectly filled! Your kidney and cognitive functions are operating at maximum capacity." 
      : `Hydration is at ${waterIntake}L (${waterGoalPercent}% of the 2.5L goal). Increasing water intake will immediately improve concentration levels and reduce fatigue.`;

    const sleepFeedback = sleepHours >= 8 
      ? "Excellent sleep recovery! Your body is logging over 8 hours of premium deep rest, boosting physical muscle repair."
      : sleepHours >= 6
      ? `Rest period is moderate (${sleepHours.toFixed(1)}h). Aiming for 7-8 hours will dramatically improve your focus score and memory retention.`
      : `Critical sleep deficit detected (${sleepHours.toFixed(1)}h). Your circadian rhythm is compromised. Establish a strict screen-free wind-down routine 30 minutes before bed.`;

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
    <div className="dashboard-page premium-view">
      <header className="dashboard-header">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="premium-header-content"
        >
          <h1 className="text-premium">Elite Dashboard</h1>
          <p className="text-muted"><i>You are performing good ,Stay focused and keep pushing towards imporve yourself:--</i></p>
        </motion.div>
      </header>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="stat-card">
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <h2 className="stat-value">{stat.value}</h2>
                {stat.isWater && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button 
                      onClick={() => updateWater(0.2)}
                      style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.2)', color: '#22d3ee', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      + 0.2L
                    </button>
                    <button 
                      onClick={() => updateWater(-0.2)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      - 0.2L
                    </button>
                  </div>
                )}
                {stat.isScreenTime && (
                  <div style={{ marginTop: '8px' }}>
                    <button 
                      onClick={() => setIsScreenTimeModalOpen(true)}
                      style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                    >
                      <PlusCircle size={14} /> Add screen time
                    </button>
                  </div>
                )}
                {stat.isSleep && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button 
                      onClick={() => {
                        updateStats({ sleepDuration: (user?.sleepDuration || 0) + 30 });
                        addHistory('Logged +30m sleep', 'Health');
                      }}
                      style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', color: '#a855f7', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      + 30m
                    </button>
                    <button 
                      onClick={() => {
                        updateStats({ sleepDuration: Math.max(0, (user?.sleepDuration || 0) - 30) });
                        addHistory('Removed 30m sleep', 'Health');
                      }}
                      style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', color: '#a855f7', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      - 30m
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* 🧠 AI Wellness & Lifestyle Analysis Report Card */}
      <GlassCard 
        title="AI Wellness & Lifestyle Analysis" 
        subtitle="Dynamic routine review synthesized from your live biometrics"
        style={{
          marginTop: '24px',
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

      <div className="dashboard-main-grid" style={{ gridTemplateColumns: '1fr', marginTop: '24px' }}>
        <div className="main-grid-left" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div className="premium-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '0' }}>
            <div className="glass-card premium-feature" style={{ padding: '24px', borderRadius: '20px' }}>
              <Zap size={24} className="text-gradient" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fff' }}>Priority Neural Processing</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>Your AI requests are routed through high-frequency servers for lightning-fast analysis.</p>
            </div>
            <div className="glass-card premium-feature" style={{ padding: '24px', borderRadius: '20px' }}>
              <Star size={24} className="text-gradient" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fff' }}>Advanced Sleep Bio-hacks</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>Customized light and sound therapy based on your circadian rhythm to optimize recovery.</p>
            </div>
            <div className="glass-card premium-feature" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.15)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(255, 255, 255, 0.01))' }}>
              <Award size={24} className="text-gradient" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fff' }}>Excellence as a Habit</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', fontStyle: 'italic' }}>
                "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--primary)', fontWeight: 600, textAlign: 'right' }}>
                — Aristotle
              </p>
            </div>
            <div className="glass-card premium-feature" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(168, 85, 247, 0.15)', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(255, 255, 255, 0.01))' }}>
              <Brain size={24} className="text-gradient" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fff' }}>Small Beginnings</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', fontStyle: 'italic' }}>
                "All big things come from small beginnings. The seed of every habit is a single, tiny decision."
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#a855f7', fontWeight: 600, textAlign: 'right' }}>
                — James Clear
              </p>
            </div>
            <div className="glass-card premium-feature" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(34, 211, 238, 0.15)', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.05), rgba(255, 255, 255, 0.01))' }}>
              <Star size={24} className="text-gradient" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fff' }}>Power of Consistency</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', fontStyle: 'italic' }}>
                "It is not what we do once in a while that shapes our lives. It's what we do consistently."
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#22d3ee', fontWeight: 600, textAlign: 'right' }}>
                — Tony Robbins
              </p>
            </div>
            <div className="glass-card premium-feature" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.15)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(255, 255, 255, 0.01))' }}>
              <ShieldCheck size={24} className="text-gradient" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fff' }}>Habit & Motivation</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', fontStyle: 'italic' }}>
                "Motivation is what gets you started. Habit is what keeps you going."
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#10b981', fontWeight: 600, textAlign: 'right' }}>
                — Jim Ryun
              </p>
            </div>
          </div>
        </div>
      </div>
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <ManualScreenTimeModal
        isOpen={isScreenTimeModalOpen}
        onClose={() => setIsScreenTimeModalOpen(false)}
      />
    </div>
  );
};

export default PremiumDashboard;
