import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, Zap, Plus, Award, ChevronUp, Lock, Crown, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import '../styles/Modals.css';

// 9 Static high-performing global mock users with authentic Indian names
const MOCK_LEADERBOARD = [
  { name: 'Aarav Sharma', points: 1100, isSelf: false },
  { name: 'Vihaan Patel', points: 950, isSelf: false },
  { name: 'Rajesh Kumar', points: 820, isSelf: false },
  { name: 'Ananya Iyer', points: 710, isSelf: false },
  { name: 'Arjun Verma', points: 620, isSelf: false },
  { name: 'Diya Sen', points: 530, isSelf: false },
  { name: 'Sai Prasad', points: 450, isSelf: false },
  { name: 'Priya Nair', points: 380, isSelf: false },
  { name: 'Rohan Das', points: 310, isSelf: false },
];

const Challenges = () => {
  const { user, updateUserInDb, addHistory } = useAuth();
  
  // Custom challenges loaded from user state or defaults
  const userChallenges = user?.challenges || [];
  const userPoints = user?.points || 0;

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [target, setTarget] = useState(7);
  const [reward, setReward] = useState(100);

  // Compute leaderboard ranks dynamically
  const fullLeaderboard = [
    ...MOCK_LEADERBOARD,
    { name: user?.name || 'You', points: userPoints, isSelf: true }
  ].sort((a, b) => b.points - a.points);

  const userRank = fullLeaderboard.findIndex(row => row.isSelf) + 1;
  const isTop10 = userRank <= 10;

  // Auto-upgrade user to premium if they enter Top 10
  useEffect(() => {
    if (user && isTop10 && !user.isPremium) {
      updateUserInDb({ ...user, isPremium: true });
      if (addHistory) {
        addHistory('Unlocked Free Premium Membership by entering Top 10 Leaderboard!', 'Rank Reward');
      }
    }
  }, [isTop10, user?.isPremium]);

  const handleAddChallenge = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newChallenge = {
      id: Date.now(),
      title: title.trim(),
      desc: desc.trim() || 'Custom Wellness Challenge',
      target: parseInt(target) || 1,
      completed: 0,
      reward: parseInt(reward) || 50,
      isDone: false,
    };

    updateUserInDb({
      ...user,
      challenges: [...userChallenges, newChallenge]
    });

    setTitle('');
    setDesc('');
    setTarget(7);
    setReward(100);
    setShowAddForm(false);
    
    if (addHistory) {
      addHistory(`Created custom challenge: "${newChallenge.title}"`, 'Challenges');
    }
  };

  const handleIncrement = (challengeId) => {
    const updated = userChallenges.map(c => {
      if (c.id === challengeId && !c.isDone) {
        const nextCompleted = c.completed + 1;
        const isNowDone = nextCompleted >= c.target;
        return {
          ...c,
          completed: nextCompleted,
          isDone: isNowDone
        };
      }
      return c;
    });

    // Check if any challenge was completed to reward points
    const newlyCompleted = updated.find(c => {
      const original = userChallenges.find(orig => orig.id === c.id);
      return c.isDone && !original.isDone;
    });

    let extraPoints = 0;
    if (newlyCompleted) {
      extraPoints = newlyCompleted.reward;
      if (addHistory) {
        addHistory(`Completed challenge: "${newlyCompleted.title}"! Earned +${extraPoints} points!`, 'Challenges');
      }
    }

    updateUserInDb({
      ...user,
      points: userPoints + extraPoints,
      challenges: updated
    });
  };

  const handleDelete = (challengeId) => {
    updateUserInDb({
      ...user,
      challenges: userChallenges.filter(c => c.id !== challengeId)
    });
  };

  return (
    <div className="challenges-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '80px' }}>
      
      {/* 🏆 Rank Achievement Header / Banner */}
      <AnimatePresence>
        {isTop10 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{
              padding: '24px',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(99, 102, 241, 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '24px',
              gap: '20px',
              flexWrap: 'wrap',
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifySelf: 'center', color: '#fbbf24', justifyContent: 'center' }}>
                <Crown size={28} className="animate-pulse" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: 700 }}>🏆 RANK #{userRank} — TOP 10 REACHED!</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                  You have unlocked our elite **Free Premium Membership** reward! Enjoy advanced dashboards & insights.
                </p>
              </div>
            </div>
            <span style={{ background: '#fbbf24', color: '#000', fontSize: '12px', fontWeight: 800, padding: '6px 12px', borderRadius: '20px', letterSpacing: '0.5px' }}>
              PREMIUM ACTIVE
            </span>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{
              padding: '24px',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '24px',
              gap: '20px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', color: 'var(--primary)', justifyContent: 'center' }}>
                <Trophy size={26} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '17px', color: '#fff', fontWeight: 700 }}>Climb into the Top 10!</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  Reach Rank 10 or higher on the Global Leaderboard to unlock **Free Premium Membership**!
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Your Current Rank</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>#{userRank}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="text-gradient">Custom Challenges</h1>
          <p className="text-muted">Create personalized challenges, earn score points, and climb the Leaderboard!</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          <Plus size={18} /> Add Challenge
        </button>
      </header>

      {/* 📝 Custom Challenge Creation Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <GlassCard title="Create New Challenge" subtitle="Configure target session count and points reward">
              <form onSubmit={handleAddChallenge} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Challenge Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5am Running"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{
                      padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Run 3km every day"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    style={{
                      padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Target Goal (sessions/days)</label>
                  <input
                    type="number"
                    min="1"
                    value={target}
                    onChange={e => setTarget(e.target.value)}
                    style={{
                      padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Score Reward (points)</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={reward}
                    onChange={e => setReward(e.target.value)}
                    style={{
                      padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Create
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid: Challenges list on left, Leaderboard on right */}
      <div className="challenges-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left side: Custom Challenges List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '18px', color: '#fff', margin: '0 0 4px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} className="text-primary" /> Active Goals
          </h2>
          
          <AnimatePresence>
            {userChallenges.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card"
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  border: '1px dashed rgba(255, 255, 255, 0.08)',
                  background: 'rgba(255, 255, 255, 0.005)',
                  borderRadius: '20px'
                }}
              >
                <Zap size={24} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
                  You have no active challenges. Create one above to earn reward points!
                </p>
              </motion.div>
            ) : (
              userChallenges.map(c => {
                const percent = Math.min(100, Math.round((c.completed / c.target) * 100));
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <GlassCard 
                      title={c.title} 
                      subtitle={c.desc}
                      style={{ 
                        background: c.isDone ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                        border: c.isDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Progress ({c.completed} / {c.target})</span>
                          <span style={{ color: c.isDone ? '#10b981' : '#fff', fontWeight: 600 }}>{percent}%</span>
                        </div>
                        
                        <div className="progress-bar" style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${percent}%`, 
                              background: c.isDone ? '#10b981' : 'var(--primary)', 
                              height: '100%', 
                              borderRadius: '4px',
                              transition: 'width 0.3s ease-out'
                            }} 
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '13px', fontWeight: 600 }}>
                            <Star size={14} /> +{c.reward} pts reward
                          </span>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleDelete(c.id)}
                              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Delete
                            </button>
                            <button
                              disabled={c.isDone}
                              onClick={() => handleIncrement(c.id)}
                              style={{ 
                                background: c.isDone ? 'rgba(16, 185, 129, 0.15)' : 'var(--primary)', 
                                color: c.isDone ? '#10b981' : 'white', 
                                border: 'none', 
                                padding: '6px 12px', 
                                borderRadius: '6px', 
                                cursor: c.isDone ? 'default' : 'pointer', 
                                fontSize: '12px',
                                fontWeight: 600 
                              }}
                            >
                              {c.isDone ? 'Completed! 🎉' : '+1 Session'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Right side: Global Unified Leaderboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '18px', color: '#fff', margin: '0 0 4px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={20} style={{ color: '#fbbf24' }} /> Global Leaderboard
          </h2>

          <div 
            className="glass-card" 
            style={{ 
              padding: '16px', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255, 255, 255, 0.015)' 
            }}
          >
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>
              <span>RANK & USER</span>
              <span>Wellness points</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {fullLeaderboard.map((row, i) => {
                const rank = i + 1;
                const isPremiumRank = rank <= 10;
                
                return (
                  <motion.div
                    key={row.name}
                    layout
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: row.isSelf 
                        ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(245, 158, 11, 0.1))'
                        : 'rgba(255, 255, 255, 0.02)',
                      border: row.isSelf 
                        ? '1px solid rgba(245, 158, 11, 0.3)' 
                        : '1px solid rgba(255,255,255,0.04)',
                      boxShadow: row.isSelf ? '0 0 10px rgba(245, 158, 11, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Rank badge */}
                      <span 
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '6px', 
                          background: rank === 1 ? '#fbbf24' : rank === 2 ? '#94a3b8' : rank === 3 ? '#b45309' : 'rgba(255,255,255,0.05)',
                          color: rank <= 3 ? '#000' : '#fff',
                          fontSize: '12px', 
                          fontWeight: 700, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        {rank}
                      </span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: row.isSelf ? 700 : 500, color: row.isSelf ? '#fbbf24' : '#fff' }}>
                          {row.name} {row.isSelf && '(You)'}
                        </span>
                        {isPremiumRank && (
                          <span style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                            <Crown size={8} /> Premium eligible
                          </span>
                        )}
                      </div>
                    </div>

                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                      {row.points} pts
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Challenges;
