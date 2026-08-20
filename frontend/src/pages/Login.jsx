import React, { useState } from 'react';
import { ShieldAlert, Lock, UserCheck, ChevronRight, Shield, Award } from 'lucide-react';

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('Investigation Officer');

  const demoUsers = [
    {
      role: 'Investigation Officer',
      name: 'Inspector Rahul Verma',
      email: 'rahul.verma@deris.gov',
      station: 'Central Crime Branch HQ',
      badge: 'BADGE-102',
      desc: 'Full case creation, evidence logging & DRIA correlation query access.'
    },
    {
      role: 'Admin',
      name: 'Commissioner Rajesh Sharma',
      email: 'admin@deris.gov',
      station: 'State Police Command',
      badge: 'BADGE-001',
      desc: 'System administration, police station management & officer role delegation.'
    },
    {
      role: 'Forensic Officer',
      name: 'Dr. Vikram Adani',
      email: 'vikram.forensic@deris.gov',
      station: 'State Forensic Science Lab',
      badge: 'BADGE-104',
      desc: 'Specialized evidence registration (DNA profiles, Fingerprint minutiae, Ballistics).'
    }
  ];

  const handleSelect = (user) => {
    onLogin({
      officer_id: user.badge,
      badge_number: user.badge,
      name: user.name,
      rank: user.role === 'Admin' ? 'Commissioner' : user.role === 'Forensic Officer' ? 'Chief Forensic Specialist' : 'Senior Inspector',
      email: user.email,
      role: user.role,
      station_name: user.station
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor Shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl relative z-10">
        {/* Left Side: System Branding */}
        <div className="flex flex-col justify-between space-y-6 pr-0 md:pr-4">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-wide">DERIS</h1>
              <p className="text-sm text-cyan-400 font-medium">Dynamic Evidence Relationship Indexing System</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              "A Novel DBMS-Based Evidence Correlation Framework for Crime Investigation."
            </p>
          </div>

          {/* Key Innovation Card */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
              <Shield className="w-4 h-4" />
              <span>DBMS Pre-Indexed Relationship Layer</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">
              Instead of running costly multi-table SQL JOINs every time an investigator searches connected cases, DERIS automatically updates a centralized Relationship Index.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-gray-500">
            <Award className="w-3.5 h-3.5" />
            <span>Patent-Pending Algorithm (DRIA v1.0) • Encrypted Session</span>
          </div>
        </div>

        {/* Right Side: Role Selection & Quick Access */}
        <div className="flex flex-col justify-center space-y-4 border-t md:border-t-0 md:border-l border-gray-800 pl-0 md:pl-8 pt-6 md:pt-0">
          <div>
            <h2 className="text-lg font-bold text-white">Select Officer Role</h2>
            <p className="text-xs text-gray-400">Click any role to authenticate into the DERIS Console instantly.</p>
          </div>

          <div className="space-y-3">
            {demoUsers.map((user) => (
              <button
                key={user.role}
                onClick={() => handleSelect(user)}
                className="w-full text-left p-4 rounded-2xl bg-gray-800/40 hover:bg-gray-800/80 border border-gray-700/40 hover:border-blue-500/50 transition-all duration-200 group flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{user.role}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">{user.badge}</span>
                  </div>
                  <div className="text-xs text-gray-300">{user.name}</div>
                  <div className="text-[11px] text-gray-400">{user.station}</div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 group-hover:bg-blue-600 text-blue-400 group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
