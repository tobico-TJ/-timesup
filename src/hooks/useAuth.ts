import { useState, useEffect } from 'react';
import { User } from '../types';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Convert date strings back to Date objects
      if (user.lastQueryReset) user.lastQueryReset = new Date(user.lastQueryReset);
      if (user.createdAt) user.createdAt = new Date(user.createdAt);
      if (user.lastStreakDate) user.lastStreakDate = new Date(user.lastStreakDate);
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.username === username && u.password === password);
    
    if (user) {
      // Convert date strings back to Date objects
      if (user.lastQueryReset) user.lastQueryReset = new Date(user.lastQueryReset);
      if (user.createdAt) user.createdAt = new Date(user.createdAt);
      if (user.lastStreakDate) user.lastStreakDate = new Date(user.lastStreakDate);
      
      setCurrentUser(user);
      localStorage.setItem('current_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = (username: string, password: string, name: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: User) => u.username === username)) {
      return false; // User already exists
    }

    // Check if this is the admin user
    const isAdmin = username === 'JCRACKER66' && password === 'Manicho$2026' && name === 'Juan Carlos Vásquez';

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      name,
      isPremium: isAdmin, // Admin gets premium automatically
      isAdmin: isAdmin,
      chatbotQueries: 0,
      lastQueryReset: new Date(),
      createdAt: new Date(),
      streak: 0,
      totalPoints: 0,
      points: 0,
      level: 1
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setCurrentUser(newUser);
    localStorage.setItem('current_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('current_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const canUseChatbot = (): boolean => {
    if (!currentUser) return false;
    if (currentUser.isPremium) return true;

    const today = new Date();
    const lastReset = new Date(currentUser.lastQueryReset);
    
    // Reset daily queries if it's a new day
    if (today.toDateString() !== lastReset.toDateString()) {
      updateUser({ chatbotQueries: 0, lastQueryReset: today });
      return true;
    }

    return currentUser.chatbotQueries < 5;
  };

  const incrementChatbotQueries = () => {
    if (!currentUser || currentUser.isPremium) return;
    updateUser({ chatbotQueries: currentUser.chatbotQueries + 1 });
  };

  const upgradeToPremium = () => {
    updateUser({ isPremium: true });
  };

  return {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    canUseChatbot,
    incrementChatbotQueries,
    upgradeToPremium
  };
}