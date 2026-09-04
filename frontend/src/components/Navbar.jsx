import React from 'react';
import { Search, Zap, Bell, Monitor, Grid, LogOut, ShieldAlert } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="h-14 bg-[#050810] border-b border-cyan-900/40 sticky top-0 z-40 px-4 flex items-center justify-between font-tech text-xs select-none">
      {/* Left Brand & Search */}
      <div className="flex items-center space-x-3">
        {/* CORE-INDEX Tag */}
        <div className="flex items-center space-x-2 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded text-cyan-400 font-bold tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>CORE-INDEX</span>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-cyan-500/70" />
          <input
            type="text"
            placeholder="SEARCH FIR# / IMEI / PHONE..."
            className="bg-[#090E1A] border border-cyan-900/60 text-cyan-200 text-[11px] placeholder-cyan-700/60 pl-8 pr-12 py-1 rounded w-64 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <span className="absolute right-2 text-[9px] font-mono px-1 py-0.2 bg-cyan-950 border border-cyan-800 text-cyan-400 rounded">
            CTRL+K
          </span>
        </div>
      </div>

      {/* Center Operational Metrics */}
      <div className="hidden lg:flex items-center space-x-6 text-gray-300 font-mono tracking-tight">
        {/* DRIA Status */}
        <div className="flex items-center space-x-1.5">
          <span className="text-gray-500">DRIA:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>ACTIVE</span>
          </span>
        </div>

        {/* Latency */}
        <div className="flex items-center space-x-1">
          <span className="text-gray-500">LATENCY:</span>
          <span className="text-cyan-300 font-bold">1.2ms [O(1)]</span>
        </div>

        {/* Cases */}
        <div className="flex items-center space-x-1">
          <span className="text-gray-500">CASES:</span>
          <span className="text-white font-bold">142</span>
        </div>

        {/* Correlations */}
        <div className="flex items-center space-x-1">
          <span className="text-gray-500">CORRELATIONS:</span>
          <span className="text-cyan-300 font-bold">98.4%</span>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center space-x-3">
        {/* Index Query Button */}
        <button className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-3 py-1 rounded flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] text-[11px] tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5 fill-black" />
          <span>INDEX QUERY</span>
        </button>

        {/* Icon Actions */}
        <div className="flex items-center space-x-1 border-l border-r border-cyan-900/40 px-2 text-cyan-500/80">
          <button className="p-1.5 hover:text-cyan-300 hover:bg-cyan-950/40 rounded">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:text-cyan-300 hover:bg-cyan-950/40 rounded">
            <Monitor className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:text-cyan-300 hover:bg-cyan-950/40 rounded">
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Badge */}
        {user && (
          <div className="flex items-center space-x-2 bg-[#090F1C] border border-cyan-900/50 px-2.5 py-1 rounded text-right">
            <div>
              <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest leading-none">ANALYS-42-ALPHA</div>
              <div className="text-[9px] text-cyan-600 font-mono">LVL-4 TS/SCI</div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="p-1.5 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-800/40 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
