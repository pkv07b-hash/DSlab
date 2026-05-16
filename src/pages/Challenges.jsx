import React, { useState } from 'react';
import { Trophy, Star, Target, Zap, Shield, Crown, History } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import CommunityButtons from '../components/CommunityButtons';
import HistoryModal from '../components/HistoryModal';

const Challenges = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const challenges = [
    { title: 'Digital Detox', desc: 'No social media for 24 hours', progress: 60, icon: Shield },
    { title: 'Morning Bird', desc: 'Wake up at 6 AM for 5 days', progress: 80, icon: Zap },
    { title: 'Deep Work Master', desc: 'Complete 10 focus sessions', progress: 40, icon: Target },
  ];

  const badges = [
    { name: 'Consistency King', icon: Crown, color: '#f59e0b' },
    { name: 'Zen Master', icon: Star, color: '#6366f1' },
    { name: 'Health Nut', icon: Trophy, color: '#10b981' },
  ];

  return (
    <div className="challenges-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient">Challenges & Rewards</h1>
          <p className="text-muted">Level up your life by completing daily goals:-</p>
        </div>
        <div />
      </header>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="btn-glass"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '12px 24px', 
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <History size={18} className="text-primary" />
          View History
        </button>
      </div>

      <div className="challenges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {challenges.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard title={c.title} subtitle={c.desc}>
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>Progress</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${c.progress}%`, background: 'var(--primary)' }}></div>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontWeight: 600 }}>
                  <Star size={16} /> Completion Badge
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
        <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>

      <GlassCard title="Achievement Badges">
        <div style={{ display: 'flex', gap: '24px', padding: '20px', flexWrap: 'wrap' }}>
          {badges.map(badge => (
            <div key={badge.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: 80, height: 80, borderRadius: '24px', background: `${badge.color}15`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: badge.color,
                border: `1px solid ${badge.color}30`
              }}>
                <badge.icon size={40} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{badge.name}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Connect & Feedback</h3>
        <CommunityButtons />
      </div>
    </div>
  );
};

export default Challenges;
