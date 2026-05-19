import React, { createContext, useContext, useState, useEffect } from 'react';

if (!globalThis.__AuthContext) {
  globalThis.__AuthContext = createContext();
}
const AuthContext = globalThis.__AuthContext;

export const AuthProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(''); // Default to relative path for Vercel Serverless

  useEffect(() => {
    // If running locally, check if the old Node.js backend is active
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const detectBackend = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/status');
          if (res.ok) {
            setApiUrl('http://localhost:5000');
          }
        } catch (e) {}
      };
      detectBackend();
    }
  }, []);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aura_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [db, setDb] = useState(() => {
    const savedDb = localStorage.getItem('aura_db');
    return savedDb ? JSON.parse(savedDb) : {};
  });

  useEffect(() => {
    localStorage.setItem('aura_db', JSON.stringify(db));
  }, [db]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('aura_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_current_user');
    }
  }, [user]);

  const signup = async (email, password, name) => {
    const newUser = { 
      email, 
      password, 
      name, 
      isPremium: false, 
      theme: 'dark',
      water: 0,
      screenTime: { total: 0, categories: { entertainment: 0, news: 0, coding: 0, focus: 0, custom: {} } },
      sleepDuration: 0,
      focusScore: 0,
      history: [],
      lastActiveDate: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await fetch(`${apiUrl}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      
      if (data.success) {
        setDb(prev => ({ ...prev, [email]: newUser }));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (err) {
      console.warn('Backend offline, using localStorage fallback');
      if (db[email]) return { success: false, message: 'User already exists' };
      setDb(prev => ({ ...prev, [email]: newUser }));
      return { success: true };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.success) {
        const loggedInUser = {
          water: 0,
          screenTime: { total: 252, categories: { entertainment: 120, news: 60, coding: 72, focus: 0, custom: {} } },
          sleepDuration: 0,
          focusScore: 0,
          history: [],
          lastActiveDate: new Date().toISOString().split('T')[0],
          ...data.user
        };
        setUser(loggedInUser);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (err) {
      console.warn('Backend offline, using localStorage login fallback');
      const existingUser = db[email];
      if (existingUser && existingUser.password === password) {
        const userWithStats = {
          water: 0,
          screenTime: { total: 252, categories: { entertainment: 120, news: 60, coding: 72, focus: 0, custom: {} } },
          sleepDuration: 0,
          focusScore: 0,
          history: [],
          lastActiveDate: new Date().toISOString().split('T')[0],
          ...existingUser
        };
        setUser(userWithStats);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserInDb = async (updatedUser) => {
    setDb(prev => ({ ...prev, [updatedUser.email]: updatedUser }));
    setUser(updatedUser);

    try {
      await fetch(`${apiUrl}/api/users/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
    } catch (err) {
      console.warn('Backend update failed, sync cached in localStorage');
    }
  };

  useEffect(() => {
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== todayStr) {
      if (!user.lastActiveDate) {
        updateUserInDb({ ...user, lastActiveDate: todayStr });
      } else {
        const updatedUser = {
          ...user,
          water: 0,
          sleepDuration: 0,
          screenTime: { total: 0, categories: { entertainment: 0, news: 0, coding: 0, focus: 0, custom: {} } },
          lastActiveDate: todayStr
        };
        updateUserInDb(updatedUser);
      }
    }
  }, [user?.email, user?.lastActiveDate]);

  const updateWater = (amount) => {
    if (!user) return;
    const newWater = Math.max(0, parseFloat((user.water || 0) + amount)).toFixed(1);
    
    const action = amount > 0 ? `Logged +${amount}L water` : `Logged -${Math.abs(amount)}L water`;
    const newEntry = {
      id: Date.now(),
      action,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'Habit'
    };
    const updatedHistory = [newEntry, ...(user.history || [])];

    updateUserInDb({ ...user, water: parseFloat(newWater), history: updatedHistory });
  };

  const updateStats = (newStats) => {
    if (!user) return;
    updateUserInDb({ ...user, ...newStats });
  };

  // updateStatsAndHistory merges stats AND history in a single write to avoid
  // the stale-closure bug where two sequential updateUserInDb calls overwrite each other.
  const updateStatsAndHistory = (newStats, action, category) => {
    if (!user) return;
    const newEntry = {
      id: Date.now(),
      action,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category
    };
    const updatedHistory = [newEntry, ...(user.history || [])];
    updateUserInDb({ ...user, ...newStats, history: updatedHistory });
  };

  const addHistory = (action, category) => {
    if (!user) return;
    if (user.history && user.history.length > 0 && user.history[0].action === action) {
      return;
    }
    const newEntry = {
      id: Date.now(),
      action,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category
    };
    const updatedHistory = [newEntry, ...(user.history || [])];
    updateUserInDb({ ...user, history: updatedHistory });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUserInDb, updateWater, updateStats, updateStatsAndHistory, addHistory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
