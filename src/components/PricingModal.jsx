import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Zap, Trophy, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import '../styles/PricingModal.css';

const PricingModal = ({ isOpen, onClose }) => {
  const { upgradeToPremium } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [isDiscounted, setIsDiscounted] = useState(false);

  const checkCoupon = (value) => {
    setCoupon(value);
    const validCoupon = `${user?.name || 'user'}50`.toLowerCase();
    if (value.toLowerCase() === validCoupon) {
      setIsDiscounted(true);
    } else {
      setIsDiscounted(false);
    }
  };

  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: '7 days',
      features: ['Basic Analytics', 'Standard Support', 'Limited AI Chat'],
      icon: <Zap className="plan-icon free" />,
      color: '#94a3b8'
    },
    {
      name: 'Monthly',
      price: isDiscounted ? '$3' : '$5',
      originalPrice: isDiscounted ? '$5' : null,
      period: '/month',
      features: ['Advanced Analytics', 'Priority Support', 'Full AI Access', 'Custom Goals'],
      icon: <Sparkles className="plan-icon monthly" />,
      color: '#6366f1',
      popular: true
    },
    {
      name: 'Yearly',
      price: isDiscounted ? '$30' : '$50',
      originalPrice: isDiscounted ? '$50' : null,
      period: '/year',
      features: ['Everything in Monthly', 'Save $10 Yearly', 'Exclusive Challenges', 'Beta Access'],
      icon: <Trophy className="plan-icon yearly" />,
      color: '#a855f7'
    }
  ];

  const handleSelect = () => {
    upgradeToPremium();
    onClose();
    navigate('/premium');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pricing-modal glass-card"
            onClick={e => e.stopPropagation()}
          >
            <button className="close-modal" onClick={onClose}>
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <h2 className="text-gradient">Upgrade to Premium</h2>
              <p>Unlock the full power of Aura Wellness with AI-driven coaching.</p>
            </div>

            <div className="coupon-section glass-card" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', border: isDiscounted ? '1px solid var(--success)' : '1px solid var(--card-border)' }}>
              <Ticket size={20} className={isDiscounted ? 'text-success' : 'text-muted'} />
              <div style={{ flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="Enter discount coupon..." 
                  value={coupon}
                  onChange={(e) => checkCoupon(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '14px' }}
                />
              </div>
              {isDiscounted && <span className="discount-tag" style={{ background: 'var(--success)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>50% OFF Applied</span>}
            </div>
 
            <div className="plans-grid">
              {plans.map((plan, index) => (
                <div key={index} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && <div className="popular-tag">Most Popular</div>}
                  <div className="plan-header">
                    {plan.icon}
                    <h3>{plan.name}</h3>
                    <div className="plan-price">
                      {plan.originalPrice && <span className="original-price" style={{ textDecoration: 'line-through', fontSize: '14px', color: 'var(--text-dim)', marginRight: '8px' }}>{plan.originalPrice}</span>}
                      <span className="amount">{plan.price}</span>
                      <span className="period">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <Check size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`select-btn ${plan.popular ? 'btn-primary' : ''}`}
                    onClick={handleSelect}
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PricingModal;
