import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

if (!globalThis.__UserContext) {
  globalThis.__UserContext = createContext();
}
const UserContext = globalThis.__UserContext;

export const UserProvider = ({ children }) => {
  const { user, updateUserInDb, addHistory, updateStats } = useAuth();
  const [isPremium, setIsPremium] = useState(false);

  // Derived state: screenTime is read directly from user.screenTime to avoid duplicate state and HMR race conditions
  const screenTime = (user && typeof user.screenTime === 'object')
    ? user.screenTime
    : { total: 0, categories: { entertainment: 0, news: 0, coding: 0, focus: 0, custom: {} } };

  // Manual screen-time entries: [{ id, website, minutes }]
  const [manualEntries, setManualEntries] = useState(() => {
    try {
      const stored = localStorage.getItem('manualScreenTimeEntries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ---------- 1️⃣ Initialise premium flag ----------
  useEffect(() => {
    if (user) {
      setIsPremium(user.isPremium || false);
    } else {
      setIsPremium(false);
    }
  }, [user]);

  // ---------- 2️⃣ Set HTML attribute for premium/free ----------
  useEffect(() => {
    document.documentElement.setAttribute('data-user-type', isPremium ? 'premium' : 'free');
  }, [isPremium]);

  const addScreenTime = (category, minutes) => {
    const newCategories = { ...screenTime.categories };
    if (category in newCategories) {
      newCategories[category] = (newCategories[category] || 0) + minutes;
    } else {
      // custom category
      newCategories.custom = { ...(newCategories.custom || {}), [category]: (newCategories.custom[category] || 0) + minutes };
    }
    const newTotal = screenTime.total + minutes;
    
    let newFocusScore = user?.focusScore || 0;
    if (newTotal > 120) {
      newFocusScore = Math.max(0, newFocusScore - 5);
    } else if (newTotal > 0) {
      newFocusScore = Math.min(100, newFocusScore + 5);
    }
    
    updateStats({ 
      screenTime: { total: newTotal, categories: newCategories },
      focusScore: newFocusScore 
    });
    addHistory(`Logged +${minutes}m screen time (${category})`, 'Screen Time');
  };

  const addCustomCategory = name => {
    if (screenTime.categories.custom && screenTime.categories.custom[name]) {
      return; // already exists
    }
    const newCustom = { ...(screenTime.categories.custom || {}), [name]: 0 };
    updateStats({
      screenTime: { ...screenTime, categories: { ...screenTime.categories, custom: newCustom } }
    });
  };

  const resetForNewUser = () => {
    updateStats({
      screenTime: { total: 0, categories: { entertainment: 0, news: 0, coding: 0, focus: 0, custom: {} } }
    });
  };

  // Persist manualEntries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('manualScreenTimeEntries', JSON.stringify(manualEntries));
  }, [manualEntries]);

  // Add a new manual entry or update minutes if website already exists
  const addManualEntry = (website, minutes) => {
    const name = website.trim();
    if (!name || minutes < 0) return;
    setManualEntries(prev => {
      const existing = prev.find(e => e.website.toLowerCase() === name.toLowerCase());
      if (existing) {
        return prev.map(e =>
          e.id === existing.id ? { ...e, minutes: e.minutes + minutes } : e
        );
      }
      return [...prev, { id: Date.now(), website: name, minutes }];
    });
  };

  // Update minutes for an existing entry by id (delta can be negative)
  const updateManualEntry = (id, delta) => {
    setManualEntries(prev =>
      prev.map(e =>
        e.id === id ? { ...e, minutes: Math.max(0, e.minutes + delta) } : e
      )
    );
  };

  // Remove an entry
  const removeManualEntry = (id) => {
    setManualEntries(prev => prev.filter(e => e.id !== id));
  };

  const upgradeToPremium = () => {
    if (user) {
      setIsPremium(true);
      updateUserInDb({ ...user, isPremium: true });
    }
  };

  const logoutContext = () => {
    setIsPremium(false);
  };

  return (
    <UserContext.Provider
      value={{
        isPremium,
        upgradeToPremium,
        logout: logoutContext,
        screenTime,
        addScreenTime,
        addCustomCategory,
        resetForNewUser,
        manualEntries,
        addManualEntry,
        updateManualEntry,
        removeManualEntry,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
