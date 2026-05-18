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
  Zap, 
  Droplets, 
  Moon,
  Clock, 
  Brain,
  TrendingUp,
  Award,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import GlassCard from '../components/GlassCard';
import ManualScreenTimeModal from '../components/ManualScreenTimeModal';

const data = [
  { name: '6am', usage: 10 },
  { name: '9am', usage: 45 },
  { name: '12pm', usage: 30 },
  { name: '3pm', usage: 60 },
  { name: '6pm', usage: 85 },
  { name: '9pm', usage: 40 },
  { name: '12am', usage: 5 },
];

const Dashboard = () => {
  const { user, updateWater, updateStats, addHistory } = useAuth();
  const { isPremium } = useUser();
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
    { icon: Clock, label: 'Screen Time', value: getScreenTimeDisplay(), change: '-12%', color: '#6366f1', isScreenTime: true },
    { 
      icon: Droplets, 
      label: 'Water Intake', 
      value: `${user?.water || 0}L / 2.5L`, 
      change: '+5%', 
      color: '#22d3ee',
      isWater: true
    },
    { icon: Moon, label: 'Sleep Duration', value: formatSleepDuration(user?.sleepDuration || 0), change: '+30m', color: '#a855f7', isSleep: true },
    { icon: Brain, label: 'Focus Score', value: `${user?.focusScore || 0}/100`, change: '+8%', color: '#10b981' },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-gradient">Welcome back, {user?.name || 'Pravin'}</h1>
          <p className="text-muted">Redesign your lifestyle with Digital Habit Tracking built for productivity and personal growth.</p>
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
                      style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#6366f1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
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
                  <span className={`stat-change ${stat.change.startsWith('+') ? 'up' : 'down'}`}>
                    {stat.change} vs yesterday
                  </span>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <GlassCard className="chart-card" title="Usage Trends" subtitle="Digital activity over the last 24 hours">
          <div className="chart-container" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 15, 20, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="usage" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="side-grid">
          {isPremium && (
            <GlassCard className="ai-coach-card">
              <div className="ai-header">
                <div className="ai-avatar">
                  <Zap size={20} />
                </div>
                <div>
                  <h3>AI Wellness Coach</h3>
                  <span className="online-tag">Online</span>
                </div>
              </div>
              <p className="ai-suggestion">
                "You've been on social media for 45 minutes straight. How about a 5-minute eye-strain exercise?"
              </p>
              <button className="btn-primary w-full">Start Exercise</button>
            </GlassCard>
          )}

          <GlassCard className="goals-card" title="Daily Goals">
            <div className="goal-item">
              <div className="goal-progress-container">
                <div className="goal-info">
                  <span>Meditate</span>
                  <span>10/10m</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '100%', background: 'var(--success)' }}></div>
                </div>
              </div>
            </div>
            <div className="goal-item">
              <div className="goal-progress-container">
                <div className="goal-info">
                  <span>Deep Work</span>
                  <span>2/4h</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '50%', background: 'var(--primary)' }}></div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      <ManualScreenTimeModal
        isOpen={isScreenTimeModalOpen}
        onClose={() => setIsScreenTimeModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
