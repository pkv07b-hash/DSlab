import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot';
import PricingModal from './PricingModal';
import PremiumPreviewModal from './PremiumPreviewModal';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { Crown, Sparkles, User as UserIcon } from 'lucide-react';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const { isPremium } = useUser();
  const { user } = useAuth();

  const handleStartPremiumFlow = () => {
    setIsPreviewOpen(true);
  };

  const handleContinueToPricing = () => {
    setIsPreviewOpen(false);
    setIsPricingOpen(true);
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <div className="user-profile">
            {isPremium ? (
              <div className="premium-badge glass-card">
                <Crown size={16} />
                <span>Premium Member</span>
              </div>
            ) : (
              <button 
                className="btn-premium glass-card"
                onClick={handleStartPremiumFlow}
              >
                <Sparkles size={16} />
                <span>Get Premium</span>
              </button>
            )}
            <div className="user-info glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', borderRadius: '12px' }}>
              <UserIcon size={16} />
              <span style={{ fontWeight: 600 }}>{user?.name || 'Guest'}</span>
            </div>
          </div>
        </header>
        <div className="page-container">
          {children}
        </div>
      </main>
      {isPremium && <Chatbot />}
      <PremiumPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        onContinue={handleContinueToPricing} 
      />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </div>
  );
};

export default Layout;
