import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Flame, Trash2, Calendar, Target } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import '../styles/Habits.css';

const defaultHabits = [
  { id: 1, name: 'Morning Meditation', streak: 12, completed: true, category: 'Mindfulness' },
  { id: 2, name: 'Reading 20 Pages', streak: 5, completed: false, category: 'Growth' },
  { id: 3, name: 'No Social Media before 10am', streak: 8, completed: true, category: 'Digital Wellness' },
  { id: 4, name: 'Drink 2L Water', streak: 20, completed: false, category: 'Health' },
];

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
            <h3>{Math.round((habits.filter(h => h.completed).length / habits.length) * 100)}%</h3>
          </div>
        </div>
        <div className="h-stat">
          <Flame className="text-warning" />
          <div>
            <span>Longest Streak</span>
            <h3>20 Days</h3>
          </div>
        </div>
        <div className="h-stat">
          <Calendar className="text-accent" />
          <div>
            <span>Perfect Days</span>
            <h3>14</h3>
          </div>
        </div>
      </div>

      <div className="habits-grid">
        <AnimatePresence>
          {habits.map((habit) => (
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
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HabitTracker;
