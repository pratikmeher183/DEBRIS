import React, { useState } from 'react';
import { ShieldAlert, Shield, Award, User, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('BADGE-102');
  const [password, setPassword] = useState('officer123');
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (mode === 'forgot') {
      setNotice('Password reset instructions sent to your registered department email.');
      return;
    }

    if (mode === 'signup') {
      setNotice('Account registration request submitted to Police Admin for badge verification.');
      return;
    }

    // Login Authentication
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password, badge: username })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          onLogin(data.user);
        } else {
          // Fallback demo officer matching badge
          const matched = demoOfficers.find(o => o.badge.toLowerCase() === username.toLowerCase() || o.email.toLowerCase() === username.toLowerCase());
          if (matched) {
            onLogin({
              officer_id: matched.badge,
              badge_number: matched.badge,
              name: matched.name,
              rank: matched.role === 'Admin' ? 'Commissioner' : matched.role === 'Forensic Officer' ? 'Chief Forensic Specialist' : 'Senior Inspector',
              email: matched.email,
              role: matched.role,
              station_name: matched.station
            });
          } else {
            // Log in with entered username as officer
            onLogin({
              officer_id: `BADGE-${username}`,
              badge_number: username,
              name: `Officer ${username}`,
              rank: 'Senior Inspector',
              email: `${username}@deris.gov`,
              role: 'Investigation Officer',
              station_name: 'Central Crime Branch HQ'
            });
          }
        }
      })
      .catch(() => {
        // Fallback offline login
        onLogin({
          officer_id: 'BADGE-102',
          badge_number: username || 'BADGE-102',
          name: 'Inspector Rahul Verma',
          rank: 'Senior Inspector',
          email: 'rahul.verma@deris.gov',
          role: 'Investigation Officer',
          station_name: 'Central Crime Branch HQ'
        });
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
        
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
              "A Novel DBMS-Based Evidence Correlation Framework for Crime Investigation."
            </p>
          </div>

          {/* DRIA Innovation Banner */}
          <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
              <Shield className="w-4 h-4" />
              <span>DBMS Pre-Indexed Relationship Layer</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              DRIA triggers automatically correlate incoming evidence across prior cases, replacing heavy multi-table SQL JOIN scans with instant indexed lookups.
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

        {/* Right Column: Officer Login Form (Custom Styled Form) */}
        <div className="flex justify-center">
          <form className="deris-login-form w-full max-w-sm" onSubmit={handleFormSubmit}>
            <p id="heading" className="deris-login-heading">
              {mode === 'login' ? 'Officer Login' : mode === 'signup' ? 'Officer Registration' : 'Reset Password'}
            </p>

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

            {/* Username / Officer Badge Field */}
            <div className="field deris-field">
              <svg className="input-icon deris-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
              </svg>
              <input
                autoComplete="off"
                placeholder="Officer Username / Badge ID"
                className="input-field deris-input-field"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            {mode !== 'forgot' && (
              <div className="field deris-field">
                <svg className="input-icon deris-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                </svg>
                <input
                  placeholder="Password"
                  className="input-field deris-input-field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Buttons Row */}
            <div className="btn">
              <button type="submit" className="button1">
                {mode === 'login' ? 'Login' : mode === 'signup' ? 'Submit' : 'Reset'}
              </button>
              <button
                type="button"
                className="button2"
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              >
                {mode === 'signup' ? 'Back' : 'Sign Up'}
              </button>
            </div>

            {/* Forgot Password Button */}
            <button
              type="button"
              className="button3"
              onClick={() => setMode(mode === 'forgot' ? 'login' : 'forgot')}
            >
              {mode === 'forgot' ? 'Back to Login' : 'Forgot Password?'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
