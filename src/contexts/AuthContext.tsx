import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'President' | 'Auditor' | 'Secretary';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for testing
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'President',
    email: 'president@sbo.edu',
    avatar: '/api/placeholder/150/150'
  },
  {
    id: '2', 
    name: 'Sarah Chen',
    role: 'Auditor',
    email: 'auditor@sbo.edu',
    avatar: '/api/placeholder/150/150'
  },
  {
    id: '3',
    name: 'Marcus Williams',
    role: 'Secretary', 
    email: 'secretary@sbo.edu',
    avatar: '/api/placeholder/150/150'
  }
];

// Sample credentials (in real app, this would be backend authentication)
const credentials = {
  'president@sbo.edu': 'president123',
  'auditor@sbo.edu': 'auditor123',
  'secretary@sbo.edu': 'secretary123'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('sbo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (credentials[email as keyof typeof credentials] === password) {
      const foundUser = sampleUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('sbo_user', JSON.stringify(foundUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sbo_user');
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}