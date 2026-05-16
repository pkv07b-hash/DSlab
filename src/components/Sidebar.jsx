import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  BarChart3, 
  Timer, 
  Moon, 
  Trophy,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Crown,
  Phone,
  Star,
  History
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ContactModal from './ContactModal';
import ReviewModal from './ReviewModal';
import HistoryModal from './HistoryModal';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isPremium } = useUser();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    ...(isPremium ? [{ icon: Crown, label: 'Premium Hub', path: '/premium' }] : []),
    { icon: CheckCircle2, label: 'Habits', path: '/habits' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Timer, label: 'Focus', path: '/focus' },
    { icon: Moon, label: 'Sleep & Health', path: '/sleep' },
    { icon: Trophy, label: 'Challenges', path: '/challenges' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className={`logo-icon ${isPremium ? 'premium-logo' : ''}`}>
          {isPremium ? <Crown size={24} /> : 'P'}
        </div>
        <span className={`logo-text ${isPremium ? 'text-premium' : 'text-gradient'}`}>
          {isPremium ? 'HealHabit Elite' : 'HealHabit'}
        </span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        <button className="nav-item" onClick={() => setIsHistoryOpen(true)} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <History size={20} />
          <span>History</span>
        </button>
        
        {/* New Community / Contact Buttons */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
          <button className="nav-item" onClick={() => setIsContactOpen(true)} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <Phone size={20} />
            <span>Connect Us</span>
          </button>
          <button className="nav-item" onClick={() => setIsReviewOpen(true)} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <Star size={20} />
            <span>Reviews</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item theme-toggle" onClick={toggleTheme} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="nav-item logout" onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </aside>
  );
};

export default Sidebar;
