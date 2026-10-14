import React, { useState } from 'react';
import { Eye, EyeOff, Package, User, Mail, Lock, ArrowRight, Shield, Users } from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';

interface RegisterPageProps {
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onGoToLogin }) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [role, setRole]         = useState<UserRole>('ROLE_STAFF');
  const [showPwd, setShowPwd]   = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPwd) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = register(fullName, email, password, role);
    if (!result.success) setError(result.message);
    setLoading(false);
  };

  const inputStyle = (hasError: boolean = false): React.CSSProperties => ({
    width: '100%', padding: '0.62rem 0.75rem 0.62rem 2.4rem',
    border: `1.5px solid ${hasError ? '#f87171' : '#e5e7eb'}`,
    borderRadius: '10px', fontSize: '0.88rem', outline: 'none',
    boxSizing: 'border-box', background: '#fafafa',
    transition: 'border-color 0.2s',
  });

  const pwdStrength = (p: string) => {
    if (!p) return { label: '', color: '#e5e7eb', pct: 0 };
    if (p.length < 4) return { label: 'Too short', color: '#ef4444', pct: 20 };
    if (p.length < 6) return { label: 'Weak', color: '#f97316', pct: 40 };
    if (p.length < 8) return { label: 'Fair', color: '#eab308', pct: 60 };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Strong', color: '#22c55e', pct: 100 };
    return { label: 'Good', color: '#3b82f6', pct: 80 };
  };
  const strength = pwdStrength(password);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1e40af 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)', padding: '1rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(37,99,235,0.12)', filter: 'blur(50px)' }} />

      <div style={{ display: 'flex', width: '100%', maxWidth: '900px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.45)', position: 'relative', zIndex: 1 }}>

        {/* Left Branding Panel */}
        <div style={{
          flex: '1', background: 'linear-gradient(160deg, #4f46e5 0%, #1d4ed8 60%, #0f172a 100%)',
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

          <p style={{ textAlign: 'center', maxWidth: '220px', fontSize: '0.88rem', opacity: 0.8, lineHeight: 1.7 }}>
            Create your account and start managing your inventory smarter.
          </p>

          {/* Role cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '240px' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '0.85rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                <Shield size={15} /> Admin Role
              </div>
              <p style={{ fontSize: '0.75rem', opacity: 0.75, margin: 0, lineHeight: 1.5 }}>Full access: manage products, users, reports & purchase orders.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '0.85rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                <Users size={15} /> Staff Role
              </div>
              <p style={{ fontSize: '0.75rem', opacity: 0.75, margin: 0, lineHeight: 1.5 }}>View inventory, record stock movements & view alerts.</p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{ flex: '1.1', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem 2.5rem', gap: '1.1rem', overflowY: 'auto' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Create Account</h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Join SmartStock ERP — it's free</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required style={inputStyle()}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" style={inputStyle()}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required style={{ ...inputStyle(), paddingRight: '2.5rem' }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')} />
                <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: '0.4rem' }}>
                  <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, transition: 'all 0.3s', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showCPwd ? 'text' : 'password'} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Re-enter password" required
                  style={{ ...inputStyle(confirmPwd.length > 0 && confirmPwd !== password), paddingRight: '2.5rem' }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = (confirmPwd.length > 0 && confirmPwd !== password) ? '#f87171' : '#e5e7eb')} />
                <button type="button" onClick={() => setShowCPwd(p => !p)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  {showCPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {confirmPwd && confirmPwd !== password && <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>Passwords don't match</span>}
            </div>

            {/* Role Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Account Role</label>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {([
                  { value: 'ROLE_ADMIN', label: 'Admin', icon: <Shield size={14} />, desc: 'Full access' },
                  { value: 'ROLE_STAFF', label: 'Staff', icon: <Users size={14} />, desc: 'View & record' },
                ] as const).map(r => (
                  <button
                    key={r.value} type="button"
                    onClick={() => setRole(r.value)}
                    style={{
                      flex: 1, padding: '0.65rem 0.75rem',
                      border: `2px solid ${role === r.value ? '#6366f1' : '#e5e7eb'}`,
                      borderRadius: '10px', cursor: 'pointer',
                      background: role === r.value ? '#eef2ff' : '#fafafa',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ color: role === r.value ? '#6366f1' : '#9ca3af' }}>{r.icon}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: role === r.value ? '#4f46e5' : '#374151' }}>{r.label}</span>
                    <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.8rem', color: '#b91c1c' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.72rem',
              background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '0.92rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)', transition: 'all 0.2s',
            }}>
              {loading
                ? <><span style={{ display: 'inline-block', width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Creating account...</>
                : <>Create Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.83rem', color: '#6b7280', margin: 0 }}>
            Already have an account?{' '}
            <button onClick={onGoToLogin} style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer', fontSize: '0.83rem', padding: 0 }}>
              Sign In
            </button>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
