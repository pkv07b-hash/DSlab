import React, { useState, useEffect } from 'react';
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
  History,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ContactModal from './ContactModal';
import ReviewModal from './ReviewModal';
import HistoryModal from './HistoryModal';
import SettingsModal from './SettingsModal';

const Sidebar = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { isPremium } = useUser();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const { addHistory } = useAuth();

  useEffect(() => {
    if (!addHistory) return;
    const path = location.pathname;
    let pageName = '';
    if (path === '/') pageName = isPremium ? 'Elite Dashboard' : 'Dashboard';
    else if (path === '/habits') pageName = 'Habits Tracker';
    else if (path === '/analytics') pageName = 'Analytics';
    else if (path === '/focus') pageName = 'Focus Mode';
    else if (path === '/sleep') pageName = 'Sleep & Health';
    else if (path === '/challenges') pageName = 'Challenges';

    if (pageName) {
      addHistory(`Visited ${pageName}`, 'Navigation');
    }
  }, [location.pathname, isPremium]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    ...(isPremium ? [] : [{ icon: LayoutDashboard, label: 'Dashboard', path: '/' }]),
    ...(isPremium ? [{ icon: Crown, label: 'Dashboard', path: '/' }] : []),
    { icon: CheckCircle2, label: 'Habits', path: '/habits' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Timer, label: 'Focus', path: '/focus' },
    { icon: Moon, label: 'Sleep & Health', path: '/sleep' },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className={`logo-icon ${isPremium ? 'premium-logo' : ''}`} style={{ overflow: 'hidden' }}>
            <img src="/logo.png" alt="HealHabit Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span className={`logo-text ${isPremium ? 'text-premium' : 'text-gradient'}`}>
            {isPremium ? 'HealHabit Elite' : 'HealHabit'}
          </span>
        </div>
        <button 
          className="mobile-close-btn" 
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        <button className="nav-item" onClick={() => { setIsHistoryOpen(true); onClose(); }} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <History size={20} />
          <span>History</span>
        </button>
        
        <NavLink 
          to="/challenges"
          onClick={onClose}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Trophy size={20} />
          <span>Challenges</span>
        </NavLink>
        
        <button className="nav-item" onClick={() => { setIsReviewOpen(true); onClose(); }} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <Star size={20} />
          <span>Reviews</span>
        </button>
        
        <button className="nav-item" onClick={() => { setIsContactOpen(true); onClose(); }} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <MessageSquare size={20} />
          <span>Connect Us</span>
        </button>

      </nav>

      <div className="sidebar-footer">
        <button className="nav-item theme-toggle" onClick={() => { toggleTheme(); onClose(); }} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="nav-item" onClick={() => { setIsSettingsOpen(true); onClose(); }} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="nav-item logout" onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
    <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
  </>
  );
};

export default Sidebar;
