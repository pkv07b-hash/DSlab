import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, Sparkles, Brain, ShieldCheck } from 'lucide-react';
import '../styles/Modals.css';

const PremiumPreviewModal = ({ isOpen, onClose, onContinue }) => {
  if (!isOpen) return null;

  const features = [
    { icon: Zap, title: 'Neural AI Processing', desc: 'Get faster, more detailed and personalized coaching answers.' },
    { icon: Brain, title: 'Advanced Analytics', desc: 'Deep dive into your neural patterns and focus trends.' },
    { icon: ShieldCheck, title: 'Exclusive Challenges', desc: 'Unlock Legendary missions with higher XP rewards.' },
    { icon: Sparkles, title: 'Aura Elite Theme', desc: 'Beautiful Sage Green & Soft Beige theme for a premium feel.' }
  ];

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="modal-content"
          style={{ maxWidth: '800px', textAlign: 'center' }}
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <X size={32} />
          </button>
          
          <div style={{ marginBottom: '40px' }}>
            <div className="contact-icon" style={{ margin: '0 auto 20px', background: 'linear-gradient(135deg, #00C2CB, #0B1F3A)', width: '80px', height: '80px', boxShadow: '0 0 30px rgba(0, 194, 203, 0.4)' }}>
              <Crown size={40} color="white" />
            </div>
            <h2 className="text-premium" style={{ fontSize: '42px', marginBottom: '16px' }}>Unlock Aura Elite</h2>
            <p className="text-muted" style={{ fontSize: '18px' }}>Experience the full power of AI-driven wellness tracking.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px', textAlign: 'left' }}>
            {features.map((f, i) => (
              <div key={i} className="contact-item" style={{ padding: '20px', background: 'rgba(0, 194, 203, 0.05)', border: '1px solid rgba(0, 194, 203, 0.1)' }}>
                <div className="contact-icon" style={{ width: '40px', height: '40px', background: 'rgba(0, 194, 203, 0.1)', color: '#00C2CB' }}>
                  <f.icon size={20} />
                </div>
                <div className="contact-info">
                  <h4 style={{ fontSize: '18px' }}>{f.title}</h4>
                  <p style={{ fontSize: '14px' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="btn-primary" 
            onClick={onContinue}
            style={{ 
              padding: '18px 60px', 
              fontSize: '20px', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, #00C2CB, #071526)',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0, 194, 203, 0.3)'
            }}
          >
            Explore Plans & Continue
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumPreviewModal;
