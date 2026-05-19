import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History as HistoryIcon, Calendar, CheckCircle2, Clock } from 'lucide-react';
import '../styles/Modals.css';

import { useAuth } from '../context/AuthContext';

const HistoryModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const history = user?.history || [];

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
              <div key={item.id} className="history-item glass-card">
                <div className="history-icon-box">
                  <CheckCircle2 size={24} />
                </div>
                
                <div className="history-details">
                  <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>{item.action}</h4>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
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
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {history.length > 0 ? `Showing your last ${history.length} activities` : 'No history yet'}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HistoryModal;
