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
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import CommunityButtons from '../components/CommunityButtons';
import HistoryModal from '../components/HistoryModal';
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
  const { user, updateWater } = useAuth();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const stats = [
    { icon: Clock, label: 'Screen Time', value: user?.screenTime || '0h 0m', change: '-22%', color: 'var(--primary)' },
    { 
      icon: Droplets, 
      label: 'Water Intake', 
      value: `${user?.water || 0}L / 2.5L`, 
      change: '+10%', 
      color: '#22d3ee',
      isWater: true
    },
    { icon: Moon, label: 'Sleep Quality', value: `${user?.sleepQuality || 0}%`, change: '+12%', color: '#a855f7' },
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
                {!stat.isWater && (
                  <span className={`stat-change up`}>
                    {stat.change} vs avg
                  </span>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <div className="main-grid-left">
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

          <div className="premium-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '24px' }}>
            <div className="glass-card premium-feature">
              <Zap size={24} className="text-gradient" />
              <h4>Priority Neural Processing</h4>
              <p>Your AI requests are routed through high-frequency servers.</p>
            </div>
            <div className="glass-card premium-feature">
              <Star size={24} className="text-gradient" />
              <h4>Advanced Sleep Bio-hacks</h4>
              <p>Customized light and sound therapy based on your circadian rhythm.</p>
            </div>
          </div>
        </div>

        <div className="side-grid">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card exclusive-challenges"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0 }}>Exclusive Challenges</h3>
              <button 
                onClick={() => setIsHistoryOpen(true)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  fontSize: '13px'
                }}
              >
                <History size={14} /> History
              </button>
            </div>
            <div className="challenge-list">
              {[
                { title: 'Neural Flow State', difficulty: 'Hard' },
                { title: 'Zen Master Ritual', difficulty: 'Expert' },
                { title: 'Bio-Sync Week', difficulty: 'Legendary' }
              ].map((c, i) => (
                <div key={i} className="challenge-item-premium">
                  <div className="challenge-icon-gold">
                    <Crown size={16} />
                  </div>
                  <div className="challenge-info">
                    <p className="title">{c.title}</p>
                    <p className="meta">{c.difficulty} Achievement</p>
                  </div>
                  <ChevronRight size={16} className="text-dim" />
                </div>
              ))}
            </div>
          </motion.div>

          <div style={{ marginTop: '24px' }}>
            <CommunityButtons />
          </div>

          <div className="glass-card coaching-log">
            <div className="header-with-icon">
              <BarChart3 size={18} className="text-gradient" />
              <h4>Coaching Log</h4>
            </div>
            <div className="log-entries">
              <p className="empty-log">AI is currently analyzing your last session...</p>
            </div>
          </div>
        </div>
      </div>
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};

export default PremiumDashboard;
