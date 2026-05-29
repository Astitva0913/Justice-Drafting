import React, { useState, useRef, useEffect } from 'react';
import {
  Shield, User, Phone, Mail, Lock, Eye, EyeOff,
  CheckCircle, AlertCircle, ArrowRight, RefreshCw, KeyRound
} from 'lucide-react';

export const SESSION_KEY = 'jd_session';
const LOGINS_KEY = 'jd_login_log';

const logLogin = (user) => {
  try {
    const log = JSON.parse(localStorage.getItem(LOGINS_KEY) || '[]');
    log.push({ username: user.username, fullName: user.fullName, at: new Date().toISOString() });
    localStorage.setItem(LOGINS_KEY, JSON.stringify(log));
  } catch {}
};

const safeFetchJson = async (url, options) => {
  let response;
  try {
    response = await fetch(url, options);
  } catch (err) {
    throw new Error('Connection refused. Please check if the backend server is running.');
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      const data = await response.json();
      return { response, data };
    } catch (err) {
      throw new Error('Invalid response data from server.');
    }
  } else {
    if (response.status >= 500) {
      throw new Error(`Server error (${response.status}). Please check server logs.`);
    } else if (response.status === 404) {
      throw new Error('API endpoint not found (404).');
    } else {
      throw new Error(`Unexpected server response (Status ${response.status}).`);
    }
  }
};

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ icon: Icon, label, field, type, placeholder, value, onChange, showPass, onTogglePass, disabled }) => {
  const isPass = field === 'password' || field === 'confirmPassword';
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type={isPass ? (showPass ? 'text' : 'password') : (type || 'text')}
          value={value} onChange={onChange} placeholder={placeholder}
          disabled={disabled} autoComplete="off"
          className={`w-full bg-slate-900/60 border-2 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-700
            ${disabled ? 'border-slate-800/40 opacity-50 cursor-not-allowed' : 'border-slate-800 focus:border-blue-500 focus:bg-slate-900'}`}
        />
        {isPass && !disabled && (
          <button type="button" onClick={onTogglePass}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── 6-box OTP Input ──────────────────────────────────────────────────────────
const OTPInput = ({ value, onChange }) => {
  const inputs = useRef([]);
  const digits = value.split('');

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = [...digits];
    arr[i] = val;
    onChange(arr.join(''));
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {[0,1,2,3,4,5].map(i => (
        <input key={i} ref={el => inputs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1}
          value={digits[i] || ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          className={`w-12 h-14 text-center text-xl font-black bg-slate-900/60 border-2 rounded-xl text-slate-100 outline-none transition-all
            ${digits[i] ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-slate-700 focus:border-blue-500'}`}
        />
      ))}
    </div>
  );
};

// ─── Main Auth ────────────────────────────────────────────────────────────────
const Auth = ({ onAuth }) => {
  const [mode, setMode]   = useState('login');
  const [stage, setStage] = useState('form');   // 'form' | 'otp'
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);
  const [otpValue, setOtpValue]         = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const timerRef = useRef(null);

  // Register fields
  const [fullName, setFullName]               = useState('');
  const [phone, setPhone]                     = useState('');
  const [email, setEmail]                     = useState('');
  const [username, setUsername]               = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login fields
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startTimer = () => {
    setOtpTimer(300);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
    }, 1000);
  };

  const fmtTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const resetAll = () => {
    setStage('form'); setError(''); setSuccess(''); setOtpValue(''); setGeneratedOTP('');
    setFullName(''); setPhone(''); setEmail(''); setUsername(''); setPassword(''); setConfirmPassword('');
    setLoginUser(''); setLoginPass('');
    clearInterval(timerRef.current); setOtpTimer(0); setSending(false);
  };

  const switchMode = (m) => { setMode(m); resetAll(); };

  // ── LOGIN: via server ─────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!loginUser.trim()) return setError('Enter your username.');
    if (!loginPass)        return setError('Enter your password.');

    setSending(true);
    setError('');
    try {
      const { data } = await safeFetchJson('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      
      if (!data.success) {
        setSending(false);
        return setError(data.message || 'Login failed.');
      }

      setSuccess(`Welcome back, ${data.user.fullName}!`);
      setTimeout(() => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
        logLogin(data.user);
        onAuth(data.user);
      }, 600);
    } catch (err) {
      setSending(false);
      setError(`Login error: ${err.message}`);
    }
  };

  // ── REGISTER Step 1: validate → send email OTP ────────────────────────────
  const handleRegisterSubmit = async () => {
    if (!fullName.trim())                           return setError('Full name is required.');
    if (!/^\d{10}$/.test(phone))                    return setError('Enter a valid 10-digit phone number.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.');
    if (username.trim().length < 4)                 return setError('Username must be at least 4 characters.');
    if (password.length < 6)                        return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword)               return setError('Passwords do not match.');

    setSending(true);
    setError('');
    try {
      const { data } = await safeFetchJson('/api/register-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, username, password })
      });

      if (!data.success) {
        setSending(false);
        return setError(data.message || 'Registration failed.');
      }

      setSuccess('OTP sent to your email!');
      setGeneratedOTP(data.otp);
      setOtpValue('');
      startTimer();
      setStage('otp');
      setSending(false);
    } catch (err) {
      setSending(false);
      setError(`Registration error: ${err.message}`);
    }
  };

  // ── REGISTER Step 2: verify OTP → create account ─────────────────────────
  const handleVerifyOTP = async () => {
    if (otpValue.length < 6) return setError('Enter the complete 6-digit OTP.');
    if (otpValue !== generatedOTP) return setError('Incorrect OTP. Please try again.');

    setSending(true);
    setError('');
    try {
      const { data } = await safeFetchJson('/api/register-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, username, password, otp: otpValue })
      });

      if (!data.success) {
        setSending(false);
        return setError(data.message || 'Account creation failed.');
      }

      clearInterval(timerRef.current);
      setSuccess('Account created! Logging you in...');
      setTimeout(() => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
        logLogin(data.user);
        onAuth(data.user);
      }, 900);
    } catch (err) {
      setSending(false);
      setError(`Verification error: ${err.message}`);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const resendOTP = async () => {
    setSending(true);
    setError('');
    try {
      const { data } = await safeFetchJson('/api/register-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, username, password })
      });

      if (!data.success) {
        setError(data.message || 'Failed to resend OTP.');
      } else {
        setGeneratedOTP(data.otp);
        setOtpValue('');
        setSuccess('New OTP sent to your email.');
        startTimer();
      }
    } catch (e) {
      setError(`Resend error: ${e.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    if (stage === 'form') { mode === 'login' ? handleLogin() : handleRegisterSubmit(); return; }
    if (stage === 'otp')  handleVerifyOTP();
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden" onKeyDown={handleKeyDown}>
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px,transparent 1px),linear-gradient(90deg,#1e293b 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 space-y-3">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative bg-blue-600 p-4 rounded-2xl shadow-2xl shadow-blue-900/50 border border-blue-400/30">
              <Shield size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-400">
            JusticeDraft
          </h1>
          <p className="text-blue-400/70 font-mono text-xs tracking-[0.2em] uppercase">
            LEA Access Portal // Secure Authentication
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)]">

          {/* Mode tabs — only on form stage */}
          {stage === 'form' && (
            <div className="flex bg-slate-950/60 rounded-2xl p-1 mb-6 border border-slate-800">
              {['login', 'register'].map(m => (
                <button key={m} onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300
                    ${mode === m ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}>
                  {m === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>
          )}

          {/* Register step indicator */}
          {mode === 'register' && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {[{ n: 1, label: 'Details' }, { n: 2, label: 'Verify Email' }].map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all
                      ${(stage === 'form' ? 1 : 2) >= s.n ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      {stage === 'otp' && s.n === 1 ? <CheckCircle size={14} /> : s.n}
                    </div>
                    <span className="text-[9px] text-slate-600 font-black uppercase">{s.label}</span>
                  </div>
                  {i < 1 && <div className={`h-px w-10 mb-4 transition-all ${stage === 'otp' ? 'bg-blue-600' : 'bg-slate-800'}`} />}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* LOGIN form */}
          {mode === 'login' && stage === 'form' && (
            <div className="space-y-4">
              <Field icon={User} label="Username" field="username" placeholder="Enter your username"
                value={loginUser} onChange={e => { setError(''); setLoginUser(e.target.value); }}
                showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />
              <Field icon={Lock} label="Password" field="password" placeholder="Enter your password"
                value={loginPass} onChange={e => { setError(''); setLoginPass(e.target.value); }}
                showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />
            </div>
          )}

          {/* REGISTER form */}
          {mode === 'register' && stage === 'form' && (
            <div className="space-y-4">
              <Field icon={User}  label="Full Name"        field="fullName"        placeholder="e.g. Rajesh Kumar"             value={fullName}        onChange={e => { setError(''); setFullName(e.target.value); }}        showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />
              <Field icon={Phone} label="Phone Number"     field="phone"           placeholder="10-digit mobile number" type="tel" value={phone}       onChange={e => { setError(''); setPhone(e.target.value); }}           showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />
              <Field icon={Mail}  label="Email Address"    field="email"           placeholder="official@example.com"   type="email" value={email}     onChange={e => { setError(''); setEmail(e.target.value); }}           showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />
              <Field icon={User}  label="Username"         field="username"        placeholder="Create a username (min 4 chars)" value={username}      onChange={e => { setError(''); setUsername(e.target.value); }}       showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />
              <Field icon={Lock}  label="Password"         field="password"        placeholder="Create a password (min 6 chars)" value={password}      onChange={e => { setError(''); setPassword(e.target.value); }}       showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />
              <Field icon={Lock}  label="Confirm Password" field="confirmPassword" placeholder="Re-enter your password"           value={confirmPassword} onChange={e => { setError(''); setConfirmPassword(e.target.value); }} showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />
            </div>
          )}

          {/* OTP stage */}
          {stage === 'otp' && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl">
                  <KeyRound size={24} className="text-blue-400" />
                </div>
                <h3 className="font-black text-white text-lg">Verify Your Email</h3>
                <p className="text-[12px] text-slate-500">
                  A 6-digit OTP has been sent to<br />
                  <span className="text-blue-400 font-bold">{email}</span>
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-4 py-3 text-[11px] text-blue-300 text-center">
                Check your inbox (and spam folder) for the OTP email from JusticeDraft.
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Enter 6-digit OTP</label>
                <OTPInput value={otpValue} onChange={setOtpValue} />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={`font-mono font-black ${otpTimer < 60 ? 'text-red-400' : 'text-slate-500'}`}>
                  {otpTimer > 0 ? `Expires in ${fmtTimer(otpTimer)}` : 'OTP expired'}
                </span>
                <button onClick={resendOTP} disabled={sending}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-400 font-black transition-colors disabled:opacity-50">
                  <RefreshCw size={11} className={sending ? 'animate-spin' : ''} /> Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-xs text-red-400 font-bold">
              <AlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mt-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-xs text-emerald-400 font-bold">
              <CheckCircle size={14} className="shrink-0" /> {success}
            </div>
          )}

          {/* Submit button */}
          <button
            disabled={sending}
            onClick={() => {
              if (stage === 'form') { mode === 'login' ? handleLogin() : handleRegisterSubmit(); return; }
              if (stage === 'otp')  handleVerifyOTP();
            }}
            className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-sm font-black text-white shadow-lg shadow-blue-900/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {sending
              ? <><RefreshCw size={16} className="animate-spin" /> SENDING OTP...</>
              : stage === 'otp'
                ? <><CheckCircle size={16} /> VERIFY & CREATE ACCOUNT</>
                : mode === 'login'
                  ? <><ArrowRight size={16} /> LOGIN TO PORTAL</>
                  : <><ArrowRight size={16} /> SEND OTP TO EMAIL</>
            }
          </button>

          {stage === 'otp' && (
            <button onClick={resetAll}
              className="mt-3 w-full py-2.5 text-xs text-slate-600 hover:text-slate-400 font-black uppercase tracking-widest transition-colors">
              ← Go Back
            </button>
          )}

          {stage === 'form' && (
            <p className="text-center text-[11px] text-slate-600 mt-5">
              {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
              <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-blue-500 hover:text-blue-400 font-black transition-colors">
                {mode === 'login' ? 'Register here' : 'Login here'}
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-6 font-mono">
          OFFICIAL LAW ENFORCEMENT ASSISTANCE PORTAL // DATA STORED LOCALLY
        </p>
      </div>
    </div>
  );
};

export default Auth;
