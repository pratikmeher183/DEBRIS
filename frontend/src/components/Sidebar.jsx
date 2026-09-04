import React from 'react';
import { 
  LayoutDashboard, 
  GitMerge, 
  Layers, 
  FolderKanban, 
  Cpu, 
  ShieldCheck, 
  FileCode2, 
  Zap, 
  Activity, 
  Terminal 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { id: 'nexus', label: 'Relationship Nexus Graph', icon: GitMerge },
    { id: 'evidence', label: 'Multi-Modal Evidence Log', icon: Layers },
    { id: 'cases', label: 'Case & FIR Directory', icon: FolderKanban },
    { id: 'simulator', label: 'DRIA Simulator', icon: Cpu },
    { id: 'custody', label: 'Chain of Custody Ledger', icon: ShieldCheck },
    { id: 'docs', label: 'System Architecture Docs', icon: FileCode2 }
  ];

  return (
    <aside className="w-64 bg-[#050810] border-r border-cyan-900/30 flex flex-col justify-between select-none font-tech text-xs">
      {/* Top Console Clearance Banner */}
      <div>
        <div className="p-4 border-b border-cyan-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-600 tracking-wider">v4.2 CONSOLE</span>
            <span className="flex items-center space-x-1 text-[9px] text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>ONLINE</span>
            </span>
          </div>
          <h1 className="text-sm font-bold text-gray-100 tracking-wide font-heading uppercase mt-0.5">
            INVESTIGATIVE WORKSTATION
          </h1>
          <div className="text-[9px] text-amber-500/90 font-mono mt-1 flex items-center space-x-1">
            <span className="h-1 w-1 rounded-full bg-amber-400"></span>
            <span>CLEARANCE: LVL-4 TS/SCI</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-left transition-all ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] font-bold'
                    : 'text-gray-400 hover:text-cyan-200 hover:bg-cyan-950/30 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                <span className="truncate tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Simulator Execution Action */}
        <div className="px-3 py-2">
          <button
            onClick={() => setActiveTab('nexus')}
            className="w-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-400 text-cyan-300 font-bold py-2 px-3 rounded flex items-center justify-center space-x-2 transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] tracking-wider uppercase"
          >
            <Zap className="w-3.5 h-3.5 fill-cyan-400" />
            <span>EXECUTE SIMULATOR</span>
          </button>
        </div>
      </div>

      {/* Bottom Diagnostics Footer */}
      <div className="p-3 border-t border-cyan-900/30 space-y-2 text-[10px] text-gray-500 font-mono">
        <button className="w-full flex items-center space-x-2 px-2 py-1 hover:text-cyan-400 hover:bg-cyan-950/20 rounded">
          <Activity className="w-3.5 h-3.5 text-cyan-600" />
          <span>Diagnostics</span>
        </button>
        <button className="w-full flex items-center space-x-2 px-2 py-1 hover:text-cyan-400 hover:bg-cyan-950/20 rounded">
          <Terminal className="w-3.5 h-3.5 text-cyan-600" />
          <span>Terminal Access</span>
        </button>

        <div className="pt-2 border-t border-cyan-950 flex items-center justify-between text-[9px] text-cyan-700">
          <span>DRIA MEM: 4.8GB</span>
          <span className="text-emerald-500 font-bold">HEAP OK</span>
        </div>
      </div>
    </aside>
  );
}
