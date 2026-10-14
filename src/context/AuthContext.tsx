import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_STAFF';

export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (fullName: string, email: string, password: string, role: UserRole) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash for localStorage-based auth (not for production — backend JWT handles real security)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36) + str.length.toString(36);
};

const USERS_KEY = 'smartstock_registered_users_v1';
const SESSION_KEY = 'smartstock_session_user_v1';

const getStoredUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Seed default admin + staff demo accounts on first load
const seedDefaultAccounts = () => {
  const existing = getStoredUsers();
  if (existing.length === 0) {
    const defaults: StoredUser[] = [
      {
        id: 'usr_admin_001',
        fullName: 'System Administrator',
        username: 'admin',
        email: 'admin@smartstock.com',
        role: 'ROLE_ADMIN',
        createdAt: new Date().toISOString(),
        passwordHash: simpleHash('Admin@123'),
      },
      {
        id: 'usr_staff_001',
        fullName: 'Inventory Staff',
        username: 'staff',
        email: 'staff@smartstock.com',
        role: 'ROLE_STAFF',
        createdAt: new Date().toISOString(),
        passwordHash: simpleHash('Staff@123'),
      },
    ];
    saveStoredUsers(defaults);
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  seedDefaultAccounts();

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const login = (email: string, password: string): { success: boolean; message: string } => {
    if (!email.trim() || !password.trim()) {
      return { success: false, message: 'Email and password are required.' };
    }
    const users = getStoredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) {
      return { success: false, message: 'No account found with this email.' };
    }
    if (found.passwordHash !== simpleHash(password)) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }
    const { passwordHash: _, ...sessionUser } = found;
    setUser(sessionUser);
    return { success: true, message: `Welcome back, ${sessionUser.fullName}!` };
  };

  const register = (
    fullName: string,
    email: string,
    password: string,
    role: UserRole
  ): { success: boolean; message: string } => {
    if (!fullName.trim()) return { success: false, message: 'Full name is required.' };
    if (!email.trim() || !email.includes('@')) return { success: false, message: 'Enter a valid email address.' };
    if (password.length < 6) return { success: false, message: 'Password must be at least 6 characters.' };

    const users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: StoredUser = {
      id: `usr_${Date.now()}`,
      fullName: fullName.trim(),
      username: email.split('@')[0],
      email: email.toLowerCase().trim(),
      role,
      createdAt: new Date().toISOString(),
      passwordHash: simpleHash(password),
    };

    saveStoredUsers([...users, newUser]);
    const { passwordHash: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    return { success: true, message: `Welcome, ${fullName}! Account created.` };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin: user?.role === 'ROLE_ADMIN', login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
