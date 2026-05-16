import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Share2, User, Camera } from 'lucide-react';
import '../styles/Modals.css';

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="modal-content"
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <X size={32} />
          </button>
          
          <h2 className="modal-title" style={{ fontSize: '32px', marginBottom: '40px' }}>
            <User size={32} className="text-primary" />
            Connect With the Developer
          </h2>

          <div className="contact-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="contact-item" style={{ padding: '24px' }}>
              <div className="contact-icon" style={{ width: '60px', height: '60px' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>P</span>
              </div>
              <div className="contact-info">
                <h4 style={{ fontSize: '20px' }}>HealHabit</h4>
                <p>Official Developer Profile</p>
              </div>
            </div>

            <div className="contact-item" style={{ padding: '24px' }}>
              <div className="contact-icon" style={{ background: '#10b981', width: '60px', height: '60px' }}>
                <Phone size={28} />
              </div>
              <div className="contact-info">
                <h4 style={{ fontSize: '20px' }}>Phone</h4>
                <p>70040XXXXX</p>
              </div>
            </div>

            <div className="contact-item" style={{ padding: '24px' }}>
              <div className="contact-icon" style={{ background: '#f59e0b', width: '60px', height: '60px' }}>
                <Mail size={28} />
              </div>
              <div className="contact-info">
                <h4 style={{ fontSize: '20px' }}>Email</h4>
                <p>pkvXX@gmail.com</p>
              </div>
            </div>

            <div className="contact-item" style={{ padding: '24px' }}>
              <div className="contact-icon" style={{ background: '#000000', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '32px', fontWeight: '900', color: 'white', fontFamily: 'system-ui' }}>X</span>
              </div>
              <div className="contact-info">
                <h4 style={{ fontSize: '20px' }}>X (Twitter)</h4>
                <p>@AuraWellnessApp</p>
              </div>
            </div>

            <div className="contact-item" style={{ padding: '24px' }}>
              <div className="contact-icon" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', width: '60px', height: '60px' }}>
                <Camera size={28} />
              </div>
              <div className="contact-info">
                <h4 style={{ fontSize: '20px' }}>Instagram</h4>
                <p>@aura_wellness_official</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;
