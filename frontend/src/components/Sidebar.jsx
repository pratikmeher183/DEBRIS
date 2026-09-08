import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  GitMerge, 
  BarChart3, 
  BookOpen,
  Zap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Case Management', icon: Briefcase },
    { id: 'evidence', label: 'Evidence Vault', icon: FileText },
    { id: 'persons', label: 'Persons Directory', icon: Users },
    { 
      id: 'nexus', 
      label: 'Evidence Nexus', 
      icon: GitMerge, 
      badge: 'HERO',
      highlight: true 
    },
    { id: 'analytics', label: 'DBMS Benchmark', icon: BarChart3 },
    { id: 'docs', label: 'Documentation', icon: BookOpen }
  ];

  return (
    <aside className="w-64 border-r border-gray-800 bg-[#0C101C] flex flex-col justify-between py-6 px-3 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 pb-3">
          <p className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">Navigation Menu</p>
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? item.highlight
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-semibold'
                    : 'bg-gray-800/80 text-white border border-gray-700/60 font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold uppercase ${
                  isActive ? 'bg-white/20 text-white' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* DRIA Novel Core Summary Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-blue-900/30 to-indigo-900/30 border border-blue-500/20 space-y-2">
        <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs">
          <Zap className="w-3.5 h-3.5" />
          <span>DRIA Innovation</span>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Pre-indexed evidence correlation layer replaces heavy SQL JOIN scans across 14 tables.
        </p>
      </div>
    </aside>
  );
}
