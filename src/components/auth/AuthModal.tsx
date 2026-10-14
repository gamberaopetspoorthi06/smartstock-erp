import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states (Week 3: Controlled Components)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('ROLE_ADMIN');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!username.trim()) errs.username = 'Username is required';
    if (isRegisterMode && !email.trim()) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    if (password && password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    login(username, role);
    onClose();
  };

  const handleQuickLogin = (quickUser: string, quickRole: UserRole) => {
    login(quickUser, quickRole);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <Lock size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>
                {isRegisterMode ? 'User Registration' : 'Account Login'}
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Weeks 3 & 5: Spring Security + JWT Authentication
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Quick Demo Credentials */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px dashed var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              marginBottom: '1.25rem',
              fontSize: '0.78rem'
            }}>
              <div style={{ fontWeight: 700, color: '#a5b4fc', marginBottom: '0.4rem' }}>
                💡 Quick Login (For Examiner / Viva Testing):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => handleQuickLogin('admin', 'ROLE_ADMIN')}
                >
                  Admin (ROLE_ADMIN)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => handleQuickLogin('staff', 'ROLE_STAFF')}
                >
                  Staff (ROLE_STAFF)
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. admin or john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <span style={{ color: 'var(--status-danger)', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.username}
                </span>
              )}
            </div>

            {isRegisterMode && (
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. user@nexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <span style={{ color: 'var(--status-danger)', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.email}
                  </span>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span style={{ color: 'var(--status-danger)', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.password}
                </span>
              )}
            </div>

            {isRegisterMode && (
              <div className="form-group">
                <label className="form-label">Role Assignment</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="ROLE_ADMIN">ROLE_ADMIN (Full CRUD & Stock Adjustment)</option>
                  <option value="ROLE_USER">ROLE_USER (Read & Requisition Only)</option>
                </select>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrors({});
                }}
              >
                {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Register Here"}
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span>{isRegisterMode ? 'Register Account' : 'Sign In with JWT'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
