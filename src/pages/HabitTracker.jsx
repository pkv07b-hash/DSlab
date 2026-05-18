import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Flame, Trash2, Calendar, Target } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import '../styles/Habits.css';

const defaultHabits = [];

const HabitTracker = () => {
  const { user, updateUserInDb } = useAuth();
  const [habits, setHabits] = useState(user?.habits || defaultHabits);
  const [newHabit, setNewHabit] = useState('');

  // Sync with AuthContext whenever habits change
  useEffect(() => {
    if (user && habits !== user.habits) {
      updateUserInDb({ ...user, habits });
    }
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const habit = {
      id: Date.now(),
      name: newHabit,
      streak: 0,
      completed: false,
      category: 'General'
    };
    setHabits([...habits, habit]);
    setNewHabit('');
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed, streak: h.completed ? h.streak - 1 : h.streak + 1 } : h
    ));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="habits-page">
      <header className="page-header">
        <div>
          <h1 className="text-gradient">Habit Tracker</h1>
          <p className="text-muted">Consistency is the bridge between goals and accomplishment.</p>
        </div>
        <div className="add-habit-container glass-card">
          <input 
            type="text" 
            placeholder="Build a new habit..." 
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          />
          <button onClick={addHabit} className="add-btn">
            <Plus size={20} />
          </button>
        </div>
      </header>

      <div className="habits-stats glass-card">
        <div className="h-stat">
          <Target className="text-primary" />
          <div>
            <span>Daily Completion</span>
            <h3>{habits.length > 0 ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100) : 0}%</h3>
          </div>
        </div>
        <div className="h-stat">
          <Flame className="text-warning" />
          <div>
            <span>Longest Streak</span>
            <h3>{habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0} Days</h3>
          </div>
        </div>
        <div className="h-stat">
          <Calendar className="text-accent" />
          <div>
            <span>Perfect Days</span>
            <h3>{habits.length > 0 ? Math.floor(Math.max(...habits.map(h => h.streak)) * 0.7) : 0}</h3>
          </div>
        </div>
      </div>

      <div className="habits-grid">
        <AnimatePresence>
          {habits.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.01)',
                borderRadius: '24px',
                border: '1px dashed rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                justifyContent: 'center',
              }}
            >
              <div 
                style={{ 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  color: 'var(--primary)',
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px'
                }}
              >
                <Target size={32} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: 600 }}>Create Your First Habit</h3>
              <p style={{ margin: 0, fontSize: '14px', maxWidth: '380px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>
                There are no habits added yet. Type a goal in the input box above and press enter to start your journey of consistency!
              </p>
            </motion.div>
          ) : (
            habits.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <GlassCard className={`habit-card ${habit.completed ? 'completed' : ''}`}>
                  <div className="habit-info">
                    <span className="habit-category">{habit.category}</span>
                    <h3 className="habit-name">{habit.name}</h3>
                    <div className="habit-streak">
                      <Flame size={16} />
                      <span>{habit.streak} day streak</span>
                    </div>
                  </div>
                  <div className="habit-actions">
                    <button 
                      className={`check-btn ${habit.completed ? 'active' : ''}`}
                      onClick={() => toggleHabit(habit.id)}
                    >
                      <Check size={24} />
                    </button>
                    <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HabitTracker;
