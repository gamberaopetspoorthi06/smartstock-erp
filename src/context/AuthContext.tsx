import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER';

export interface AuthUser {
  username: string;
  email: string;
  role: UserRole;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, role?: UserRole) => void;
  logout: () => void;
  toggleRole: () => void; // Convenient switcher for viva defense demonstration
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to logged-in Admin for immediate demonstration
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('nexus_erp_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      username: 'admin',
      email: 'admin@nexus.com',
      role: 'ROLE_ADMIN',
      token: 'jwt_mock_token_admin_eyJh...'
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_erp_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_erp_auth_user');
    }
  }, [user]);

  const login = (username: string, role: UserRole = 'ROLE_ADMIN') => {
    const newUser: AuthUser = {
      username,
      email: `${username}@nexus.com`,
      role,
      token: `jwt_token_${username}_${Date.now()}`
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleRole = () => {
    if (!user) return;
    const nextRole: UserRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    setUser({ ...user, role: nextRole });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ROLE_ADMIN',
        login,
        logout,
        toggleRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
