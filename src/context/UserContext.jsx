import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, updateUserInDb } = useAuth();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (user) {
      setIsPremium(user.isPremium || false);
    } else {
      setIsPremium(false);
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-user-type', isPremium ? 'premium' : 'free');
  }, [isPremium]);

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
    <UserContext.Provider value={{ isPremium, upgradeToPremium, logout: logoutContext }}>
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
