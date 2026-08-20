import React from 'react';
import { ShieldAlert, Zap, LogOut, User, Bell } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="h-16 border-b border-gray-800 bg-[#0F1523]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-wider text-white">DERIS</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono uppercase tracking-widest">v1.0.0</span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">Dynamic Evidence Relationship Indexing System</p>
        </div>
      </div>

      {/* DRIA Engine Status & Officer Controls */}
      <div className="flex items-center space-x-5">
        {/* DRIA Engine Badge */}
        <div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-emerald-400">DRIA ENGINE: AUTO-INDEXING</span>
        </div>

        {/* User Info Pill */}
        {user && (
          <div className="flex items-center space-x-3 bg-gray-800/60 border border-gray-700/50 px-3.5 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-gray-200">{user.name}</div>
              <div className="text-[10px] text-gray-400">{user.role} ({user.station_name || 'Central HQ'})</div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="p-2 rounded-xl bg-gray-800/40 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-gray-700/40 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
