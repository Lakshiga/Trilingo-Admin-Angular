import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  userId: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate auto-login for demo purposes
    setUser({
      userId: 1,
      username: 'Tamil Learner',
      email: 'learner@trillingo.com'
    });
    setIsAuthenticated(true);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate login
    setUser({
      userId: 1,
      username: username,
      email: `${username}@trillingo.com`
    });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate registration
    setUser({
      userId: 1,
      username: username,
      email: email
    });
    setIsAuthenticated(true);
    return true;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};