import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History as HistoryIcon, Calendar, CheckCircle2, Clock } from 'lucide-react';
import '../styles/Modals.css';

const HistoryModal = ({ isOpen, onClose }) => {
  const history = [
    { id: 1, action: 'Completed Digital Detox Challenge', date: '2026-05-14', time: '18:30', category: 'Challenge' },
    { id: 2, action: 'Achieved 8h Sleep Goal', date: '2026-05-14', time: '07:15', category: 'Health' },
    { id: 3, action: 'Finished 2h Deep Work Session', date: '2026-05-13', time: '14:45', category: 'Focus' },
    { id: 4, action: 'Completed Morning Bird Mission', date: '2026-05-12', time: '06:30', category: 'Challenge' },
    { id: 5, action: 'Logged 2.5L Water Intake', date: '2026-05-12', time: '20:00', category: 'Habit' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="modal-content"
          style={{ maxWidth: '800px' }}
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <X size={28} />
          </button>
          
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HistoryIcon className="text-primary" />
            Activity History
          </h2>

          <div className="history-list" style={{ marginTop: '30px' }}>
            {history.map((item) => (
              <div 
                key={item.id} 
                className="history-item glass-card" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '20px', 
                  padding: '20px', 
                  marginBottom: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px'
                }}
              >
                <div className="history-icon-box" style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <CheckCircle2 size={24} />
                </div>
                
                <div className="history-details" style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>{item.action}</h4>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {item.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {item.time}
                    </span>
                    <span className="badge-subtle" style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Showing your last 5 activities</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HistoryModal;
