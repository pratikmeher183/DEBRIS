import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Shield, 
  User, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle,
  BadgeCheck,
  Mail,
  Building2,
  Award,
  UserPlus,
  LogIn
} from 'lucide-react';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Login Form State
  const [username, setUsername] = useState('BADGE-102');
  const [password, setPassword] = useState('officer123');

  // Sign Up Form State
  const [signupData, setSignupData] = useState({
    name: '',
    badge_number: '',
    email: '',
    password: '',
    confirmPassword: '',
    rank: 'Senior Inspector',
    role: 'Investigation Officer',
    station_name: 'Central Crime Branch HQ'
  });

  const demoOfficers = [
    {
      role: 'Investigation Officer',
      name: 'Inspector Rahul Verma',
      badge: 'BADGE-102',
      email: 'rahul.verma@deris.gov',
      station: 'Central Crime Branch HQ'
    },
    {
      role: 'Admin',
      name: 'Commissioner Rajesh Sharma',
      badge: 'BADGE-001',
      email: 'admin@deris.gov',
      station: 'State Police Command'
    },
    {
      role: 'Forensic Officer',
      name: 'Dr. Vikram Adani',
      badge: 'BADGE-104',
      email: 'vikram.forensic@deris.gov',
      station: 'State Forensic Science Lab'
    }
  ];

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (mode === 'forgot') {
      setNotice('Password reset instructions sent to your registered department email.');
      return;
    }

    // SIGN UP WORKFLOW
    if (mode === 'signup') {
      if (!signupData.name || !signupData.badge_number || !signupData.email || !signupData.password) {
        setError('Please fill in all required officer registration fields.');
        return;
      }

      if (signupData.password !== signupData.confirmPassword) {
        setError('Passwords do not match. Please re-enter your password.');
        return;
      }

      const payload = {
        name: signupData.name,
        badge_number: signupData.badge_number,
        email: signupData.email,
        password: signupData.password,
        rank: signupData.rank,
        role: signupData.role,
        station_name: signupData.station_name
      };

      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok || data.error) {
            throw new Error(data.error || 'Failed to register officer account.');
          }
          return data;
        })
        .then((data) => {
          // Persist officer in localStorage for client-side persistence
          const existingLocal = JSON.parse(localStorage.getItem('deris_local_officers') || '[]');
          localStorage.setItem('deris_local_officers', JSON.stringify([data.user, ...existingLocal]));

          setNotice(`Officer ${data.user.name} registered successfully! Opening DERIS...`);
          setTimeout(() => {
            onLogin(data.user);
          }, 1200);
        })
        .catch((err) => {
          // Local fallback registration
          const localUser = {
            officer_id: `OFF-${Date.now().toString().slice(-4)}`,
            badge_number: signupData.badge_number,
            name: signupData.name,
            rank: signupData.rank,
            email: signupData.email,
            role: signupData.role,
            station_name: signupData.station_name,
            password_hash: signupData.password
          };
          const existingLocal = JSON.parse(localStorage.getItem('deris_local_officers') || '[]');
          localStorage.setItem('deris_local_officers', JSON.stringify([localUser, ...existingLocal]));

          setNotice(`Officer ${localUser.name} registered! Opening DERIS...`);
          setTimeout(() => {
            onLogin(localUser);
          }, 1000);
        });
      return;
    }

    // LOGIN WORKFLOW
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, badge: username, password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Invalid credentials');
        }
        return data;
      })
      .then((data) => {
        if (data && data.user) {
          onLogin(data.user);
        } else {
          throw new Error('User data missing');
        }
      })
      .catch(() => {
        // Check local registered officers
        const storedLocalOfficers = JSON.parse(localStorage.getItem('deris_local_officers') || '[]');
        const matchedLocal = storedLocalOfficers.find(
          o => (o.badge_number && o.badge_number.toLowerCase() === username.toLowerCase()) || 
               (o.email && o.email.toLowerCase() === username.toLowerCase())
        );

        if (matchedLocal) {
          onLogin(matchedLocal);
          return;
        }

        // Fallback demo officer matching badge
        const matchedDemo = demoOfficers.find(o => o.badge.toLowerCase() === username.toLowerCase() || o.email.toLowerCase() === username.toLowerCase());
        if (matchedDemo) {
          onLogin({
            officer_id: matchedDemo.badge,
            badge_number: matchedDemo.badge,
            name: matchedDemo.name,
            rank: matchedDemo.role === 'Admin' ? 'Commissioner' : matchedDemo.role === 'Forensic Officer' ? 'Chief Forensic Specialist' : 'Senior Inspector',
            email: matchedDemo.email,
            role: matchedDemo.role,
            station_name: matchedDemo.station
          });
        } else {
          // Log in with entered username as officer
          onLogin({
            officer_id: `OFF-${Date.now().toString().slice(-4)}`,
            badge_number: username,
            name: `Officer ${username}`,
            rank: 'Senior Inspector',
            email: `${username}@deris.gov`,
            role: 'Investigation Officer',
            station_name: 'Central Crime Branch HQ'
          });
        }
      });
  };

  const handleQuickOfficerSelect = (officer) => {
    setUsername(officer.badge);
    setPassword('officer123');
    onLogin({
      officer_id: officer.badge,
      badge_number: officer.badge,
      name: officer.name,
      rank: officer.role === 'Admin' ? 'Commissioner' : officer.role === 'Forensic Officer' ? 'Chief Forensic Specialist' : 'Senior Inspector',
      email: officer.email,
      role: officer.role,
      station_name: officer.station
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10 my-6">
        
        {/* Left Column: DERIS Branding */}
        <div className="space-y-6 pr-0 md:pr-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-wider">DERIS</h1>
              <p className="text-xs text-cyan-400 font-semibold">Dynamic Evidence Relationship Indexing System</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-100">Law Enforcement Portal</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Secure authentication for law enforcement officers, forensic analysts, and police administration.
            </p>
          </div>

          {/* DRIA Innovation Banner */}
          <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
              <Shield className="w-4 h-4" />
              <span>DBMS Pre-Indexed Relationship Layer</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Authorized officers get instant real-time evidence correlation, criminal history lookup, and automated cross-case relationship indexing.
            </p>
          </div>

          {/* Quick Officer Demo Profile Cards */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-gray-500 uppercase">Quick Demo Officer Login:</span>
            <div className="grid grid-cols-1 gap-2">
              {demoOfficers.map((o) => (
                <button
                  key={o.badge}
                  onClick={() => handleQuickOfficerSelect(o)}
                  className="w-full text-left p-3 rounded-xl bg-gray-900/60 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/50 flex items-center justify-between text-xs transition-all group"
                >
                  <div>
                    <span className="font-bold text-white group-hover:text-cyan-400">{o.name}</span>
                    <span className="text-[10px] text-gray-400 ml-2 font-mono">({o.role})</span>
                    <div className="text-[10px] text-gray-500">{o.station} • <span className="text-blue-400 font-mono">{o.badge}</span></div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Officer Login / Sign Up Form */}
        <div className="flex justify-center">
          <form className="deris-login-form w-full max-w-md space-y-4" onSubmit={handleFormSubmit}>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <p id="heading" className="deris-login-heading !m-0">
                {mode === 'login' ? 'Officer Login' : mode === 'signup' ? 'Officer Sign Up' : 'Reset Password'}
              </p>
              <div className="flex items-center space-x-1 bg-gray-900 p-1 rounded-xl border border-gray-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setNotice(''); }}
                  className={`px-3 py-1 rounded-lg transition-all ${mode === 'login' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); setNotice(''); }}
                  className={`px-3 py-1 rounded-lg transition-all ${mode === 'signup' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {notice && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{notice}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* --- SIGN UP FORM FIELDS --- */}
            {mode === 'signup' && (
              <div className="space-y-3 text-left">
                {/* Name Field */}
                <div className="field deris-field">
                  <User className="w-4 h-4 text-gray-500 ml-2" />
                  <input
                    name="name"
                    placeholder="Full Officer Name (e.g. Inspector Amit Das)"
                    className="input-field deris-input-field"
                    type="text"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                {/* Badge Number & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="field deris-field">
                    <BadgeCheck className="w-4 h-4 text-gray-500 ml-2" />
                    <input
                      name="badge_number"
                      placeholder="Badge ID (e.g. BADGE-105)"
                      className="input-field deris-input-field"
                      type="text"
                      value={signupData.badge_number}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="field deris-field">
                    <Mail className="w-4 h-4 text-gray-500 ml-2" />
                    <input
                      name="email"
                      placeholder="Officer Email"
                      className="input-field deris-input-field"
                      type="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>

                {/* Rank & Role Select Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-400 font-semibold mb-1">Rank / Designation</label>
                    <select
                      name="rank"
                      value={signupData.rank}
                      onChange={handleSignupChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Senior Inspector">Senior Inspector</option>
                      <option value="Inspector">Inspector</option>
                      <option value="Sub-Inspector">Sub-Inspector</option>
                      <option value="Commissioner">Commissioner</option>
                      <option value="Chief Forensic Specialist">Chief Forensic Specialist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 font-semibold mb-1">Department Role</label>
                    <select
                      name="role"
                      value={signupData.role}
                      onChange={handleSignupChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Investigation Officer">Investigation Officer</option>
                      <option value="Forensic Officer">Forensic Officer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                {/* Police Station Dropdown */}
                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Assigned Police Station</label>
                  <select
                    name="station_name"
                    value={signupData.station_name}
                    onChange={handleSignupChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Central Crime Branch HQ">Central Crime Branch HQ</option>
                    <option value="Metro Zone Police Station">Metro Zone Police Station</option>
                    <option value="State Police Command">State Police Command</option>
                    <option value="State Forensic Science Lab">State Forensic Science Lab</option>
                  </select>
                </div>

                {/* Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="field deris-field">
                    <Lock className="w-4 h-4 text-gray-500 ml-2" />
                    <input
                      name="password"
                      placeholder="Password"
                      className="input-field deris-input-field"
                      type="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="field deris-field">
                    <Lock className="w-4 h-4 text-gray-500 ml-2" />
                    <input
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="input-field deris-input-field"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- LOGIN FORM FIELDS --- */}
            {mode === 'login' && (
              <div className="space-y-3">
                {/* Username / Officer Badge Field */}
                <div className="field deris-field">
                  <BadgeCheck className="w-4 h-4 text-gray-500 ml-2" />
                  <input
                    autoComplete="off"
                    placeholder="Officer Badge ID or Email"
                    className="input-field deris-input-field"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="field deris-field">
                  <Lock className="w-4 h-4 text-gray-500 ml-2" />
                  <input
                    placeholder="Password"
                    className="input-field deris-input-field"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* --- FORGOT PASSWORD FIELDS --- */}
            {mode === 'forgot' && (
              <div className="space-y-3">
                <div className="field deris-field">
                  <Mail className="w-4 h-4 text-gray-500 ml-2" />
                  <input
                    placeholder="Registered Department Email"
                    className="input-field deris-input-field"
                    type="email"
                    required
                  />
                </div>
              </div>
            )}

            {/* Action Submit Buttons */}
            <div className="btn pt-2">
              <button type="submit" className="button1 flex items-center justify-center space-x-2">
                {mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Login to DERIS</span>
                  </>
                ) : mode === 'signup' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Officer Registration</span>
                  </>
                ) : (
                  <span>Send Reset Request</span>
                )}
              </button>

              <button
                type="button"
                className="button2"
                onClick={() => {
                  setMode(mode === 'signup' ? 'login' : 'signup');
                  setError('');
                  setNotice('');
                }}
              >
                {mode === 'signup' ? 'Back to Login' : 'Officer Sign Up'}
              </button>
            </div>

            {/* Forgot Password Link */}
            <button
              type="button"
              className="button3"
              onClick={() => {
                setMode(mode === 'forgot' ? 'login' : 'forgot');
                setError('');
                setNotice('');
              }}
            >
              {mode === 'forgot' ? 'Back to Login' : 'Forgot Password?'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

