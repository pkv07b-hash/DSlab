import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

if (!globalThis.__ThemeContext) {
  globalThis.__ThemeContext = createContext();
}
const ThemeContext = globalThis.__ThemeContext;

export const ThemeProvider = ({ children }) => {
  const { user, updateUserInDb, addHistory } = useAuth();
  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('aura-theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    if (user && user.theme) {
      setTheme(user.theme);
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aura-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (user) {
      updateUserInDb({ ...user, theme: newTheme });
      if (addHistory) {
        addHistory(`Switched to ${newTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'Settings');
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
