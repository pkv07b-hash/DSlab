import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
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
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import HistoryModal from '../components/HistoryModal';
import ManualScreenTimeModal from '../components/ManualScreenTimeModal';
import { History } from 'lucide-react';
import '../styles/Dashboard.css';

const data = [
  { name: '6am', usage: 10 },
  { name: '9am', usage: 45 },
  { name: '12pm', usage: 30 },
  { name: '3pm', usage: 60 },
  { name: '6pm', usage: 85 },
  { name: '9pm', usage: 40 },
  { name: '12am', usage: 5 },
];

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
    { icon: Brain, label: 'Focus Score', value: `${user?.focusScore || 0}/100`, change: '+15%', color: 'var(--secondary)' },
  ];

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
                {!stat.isWater && !stat.isScreenTime && !stat.isSleep && (
                  <span className={`stat-change up`}>
                    {stat.change} vs avg
                  </span>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-main-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="main-grid-left" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <GlassCard className="chart-card" title="Elite Usage Trends" subtitle="Optimized digital activity patterns">
            <div className="chart-container" style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-dim)', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--bg-dark)', 
                      border: '1px solid var(--card-border)',
                      borderRadius: '12px',
                      color: 'var(--text-main)'
                    }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorPremium)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

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
