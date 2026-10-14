import React, { useState } from 'react';
import { Eye, EyeOff, Package, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // natural feel
    const result = login(email, password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  const fillDemo = (role: 'admin' | 'staff') => {
    if (role === 'admin') {
      setEmail('admin@smartstock.com');
      setPassword('Admin@123');
    } else {
      setEmail('staff@smartstock.com');
      setPassword('Staff@123');
    }
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1e40af 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative circles */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(37,99,235,0.15)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(50px)' }} />

      <div style={{ display: 'flex', width: '100%', maxWidth: '900px', minHeight: '540px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.45)', position: 'relative', zIndex: 1 }}>

        {/* Left Panel — Branding */}
        <div style={{
          flex: '1', background: 'linear-gradient(160deg, #1d4ed8 0%, #1e40af 60%, #312e81 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 2rem', color: '#fff', gap: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '10px', display: 'flex' }}>
              <Package size={32} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.6rem', lineHeight: 1 }}>SmartStock</div>
              <div style={{ fontWeight: 400, fontSize: '0.78rem', opacity: 0.75, letterSpacing: '0.08em' }}>ERP · POWERED BY AI</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', maxWidth: '240px' }}>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Intelligent Inventory Management
            </p>
            <p style={{ fontSize: '0.82rem', opacity: 0.7, lineHeight: 1.6 }}>
              Manage stock, predict demand, track purchases & sales — all in one place.
            </p>
          </div>

          {/* Feature pills */}
          {['AI Demand Forecasting', '₹ Indian Rupee Support', 'Real-time Stock Alerts', 'Full ERP Suite'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', borderRadius: '100px', padding: '0.4rem 1rem', fontSize: '0.78rem', fontWeight: 500 }}>
              <Sparkles size={12} />
              {f}
            </div>
          ))}

          {/* Demo credentials hint */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.75rem', width: '100%', maxWidth: '240px' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.4rem', opacity: 0.9 }}>🔑 Demo Credentials</div>
            <div style={{ opacity: 0.8 }}>Admin: admin@smartstock.com</div>
            <div style={{ opacity: 0.8 }}>Pass: Admin@123</div>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div style={{ flex: '1', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2.5rem', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Welcome back</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.3rem' }}>Sign in to your SmartStock account</p>
          </div>

          {/* Quick fill buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => fillDemo('admin')} style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem', fontWeight: 600, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '8px', cursor: 'pointer' }}>
              Fill Admin Demo
            </button>
            <button onClick={() => fillDemo('staff')} style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem', fontWeight: 600, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer' }}>
              Fill Staff Demo
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  style={{
                    width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    border: `1.5px solid ${error ? '#f87171' : '#e5e7eb'}`,
                    borderRadius: '10px', fontSize: '0.9rem', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                    background: '#fafafa',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = error ? '#f87171' : '#e5e7eb')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%', padding: '0.65rem 2.5rem 0.65rem 2.4rem',
                    border: `1.5px solid ${error ? '#f87171' : '#e5e7eb'}`,
                    borderRadius: '10px', fontSize: '0.9rem', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                    background: '#fafafa',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = error ? '#f87171' : '#e5e7eb')}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#6b7280' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.82rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.75rem',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
            Don't have an account?{' '}
            <button onClick={onGoToRegister} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>
              Create Account
            </button>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
