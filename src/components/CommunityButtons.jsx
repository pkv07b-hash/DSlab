import React, { useState } from 'react';
import { Phone, Star } from 'lucide-react';
import ContactModal from './ContactModal';
import ReviewModal from './ReviewModal';

const CommunityButtons = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  return (
    <div className="community-buttons" style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
      <button 
        className="btn-glass" 
        onClick={() => setIsContactOpen(true)}
        style={{ 
          padding: '12px 24px', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-main)',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        <Phone size={18} />
        Connect Us
      </button>
      <button 
        className="btn-glass" 
        onClick={() => setIsReviewOpen(true)}
        style={{ 
          padding: '12px 24px', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-main)',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        <Star size={18} />
        Review
      </button>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
    </div>
  );
};

export default CommunityButtons;
