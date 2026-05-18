import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import '../styles/ManualScreenTimeModal.css';

const STEP = 5; // minutes per click

const ManualScreenTimeModal = ({ isOpen, onClose }) => {
  const { manualEntries, addManualEntry, updateManualEntry, removeManualEntry } = useUser();
  const { user, updateStats, addHistory } = useAuth();
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!website.trim()) {
      setError('Please enter a website or app name.');
      return;
    }
    setError('');
    addManualEntry(website.trim(), 0);
    setWebsite('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  const totalMinutes = manualEntries.reduce((sum, e) => sum + e.minutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  const handleSave = () => {
    const currentScreenTimeObj = (typeof user?.screenTime === 'object' && user?.screenTime)
      ? user.screenTime
      : { categories: { entertainment: 0, news: 0, coding: 0, focus: 0, custom: {} } };

    const newScreenTime = {
      ...currentScreenTimeObj,
      total: totalMinutes
    };
    
    let newFocusScore = user?.focusScore || 0;
    if (totalMinutes > 120) {
      newFocusScore = Math.max(0, newFocusScore - 5);
    } else if (totalMinutes > 0) {
      newFocusScore = Math.min(100, newFocusScore + 5);
    }
    
    updateStats({ screenTime: newScreenTime, focusScore: newFocusScore });
    addHistory(`Logged ${totalHours > 0 ? totalHours + 'h ' : ''}${totalMins}m screen time`, 'Screen Time');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="mst-overlay" onClick={onClose}>
        <motion.div
          className="mst-modal"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mst-header">
            <div className="mst-title-row">
              <Clock size={20} className="mst-icon" />
              <h2 className="mst-title">Log Screen Time</h2>
            </div>
            <button className="mst-close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Add new entry */}
          <div className="mst-add-row">
            <input
              className="mst-input"
              type="text"
              placeholder="Website / App name (e.g. Instagram)"
              value={website}
              onChange={e => { setWebsite(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
            />
            <button className="mst-add-btn" onClick={handleAdd}>
              <Plus size={16} /> Add
            </button>
          </div>
          {error && <p className="mst-error">{error}</p>}

          {/* Entries list */}
          <div className="mst-entries">
            {manualEntries.length === 0 && (
              <p className="mst-empty">No entries yet. Add a website or app above.</p>
            )}
            {manualEntries.map(entry => (
              <motion.div
                key={entry.id}
                className="mst-entry"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                layout
              >
                <span className="mst-entry-name">{entry.website}</span>
                <div className="mst-stepper">
                  <button
                    className="mst-step-btn minus"
                    onClick={() => updateManualEntry(entry.id, -STEP)}
                    disabled={entry.minutes === 0}
                    aria-label={`Decrease ${entry.website} by ${STEP} min`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="mst-minutes">
                    {entry.minutes >= 60
                      ? `${Math.floor(entry.minutes / 60)}h ${entry.minutes % 60}m`
                      : `${entry.minutes}m`}
                  </span>
                  <button
                    className="mst-step-btn plus"
                    onClick={() => updateManualEntry(entry.id, STEP)}
                    aria-label={`Increase ${entry.website} by ${STEP} min`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  className="mst-remove-btn"
                  onClick={() => removeManualEntry(entry.id)}
                  aria-label={`Remove ${entry.website}`}
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Footer total */}
          {manualEntries.length > 0 && (
            <div className="mst-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="mst-total-label">Total logged: </span>
                <span className="mst-total-value">
                  {totalHours > 0 ? `${totalHours}h ` : ''}{totalMins}m
                </span>
              </div>
              <button 
                onClick={handleSave}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
              >
                Save & Sync
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ManualScreenTimeModal;
