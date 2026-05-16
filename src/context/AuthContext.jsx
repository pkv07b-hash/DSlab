import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

  const signup = (email, password, name) => {
    if (db[email]) return { success: false, message: 'User already exists' };
    
    const newUser = { 
      email, 
      password, 
      name, 
      isPremium: false, 
      theme: 'dark',
      water: 0,
      screenTime: '4h 12m',
      sleepQuality: 82,
      focusScore: 74
    };
    setDb(prev => ({ ...prev, [email]: newUser }));
    return { success: true };
  };

  const login = (email, password) => {
    const existingUser = db[email];
    if (existingUser && existingUser.password === password) {
      // Ensure all stats exist for older accounts
      const userWithStats = {
        water: 0,
        screenTime: '4h 12m',
        sleepQuality: 82,
        focusScore: 74,
        ...existingUser
      };
      setUser(userWithStats);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserInDb = (updatedUser) => {
    setDb(prev => ({ ...prev, [updatedUser.email]: updatedUser }));
    setUser(updatedUser);
  };

  const updateWater = (amount) => {
    if (!user) return;
    const newWater = Math.max(0, parseFloat((user.water || 0) + amount)).toFixed(1);
    updateUserInDb({ ...user, water: parseFloat(newWater) });
  };

  const updateStats = (newStats) => {
    if (!user) return;
    updateUserInDb({ ...user, ...newStats });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUserInDb, updateWater, updateStats }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
