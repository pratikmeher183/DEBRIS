import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  GitMerge, 
  Network, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    total_cases: 5,
    open_cases: 4,
    solved_cases: 1,
    total_evidence: 10,
    indexed_links: 5,
    active_clusters: 4,
    recent_activities: []
  });

  useEffect(() => {
    fetch('/api/analytics/dashboard-stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setStats(data);
        }
      })
      .catch((err) => console.log('Fetch stats error:', err));
  }, []);

  const statCards = [
    { title: 'Total Cases', value: stats.total_cases, sub: `${stats.open_cases} Active / ${stats.solved_cases} Solved`, icon: Briefcase, color: 'from-blue-600 to-indigo-600' },
    { title: 'Evidence Logged', value: stats.total_evidence, sub: 'Phones, Vehicles, Weapons, DNA, Prints', icon: FileText, color: 'from-cyan-600 to-blue-600' },
    { title: 'Pre-Indexed Links', value: stats.indexed_links, sub: 'Auto-correlated by DRIA Engine', icon: GitMerge, color: 'from-emerald-600 to-teal-600', highlight: true },
    { title: 'Investigation Clusters', value: stats.active_clusters, sub: 'Connected multi-case graphs', icon: Network, color: 'from-amber-600 to-orange-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-blue-950/60 border border-gray-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-extrabold text-white">Investigation Command Center</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">DBMS DRIA ENGINE</span>
          </div>
          <p className="text-xs text-gray-400">Automated relationship indexing active. Cross-case evidence correlations pre-computed in real time.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('cases')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Case</span>
          </button>

          <button
            onClick={() => onNavigate('nexus')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-all"
          >
            <GitMerge className="w-4 h-4" />
            <span>Open Evidence Nexus</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="p-5 rounded-2xl glass-panel space-y-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">{card.title}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight">{card.value}</div>
                <div className="text-[11px] text-gray-400 mt-1">{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Innovation Comparison & Recent DRIA Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent DRIA Correlation Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Recent DRIA Auto-Index Correlative Matches</h2>
            </div>
            <button 
              onClick={() => onNavigate('nexus')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
            >
              <span>View Relationship Index</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats.recent_activities && stats.recent_activities.length > 0 ? (
              stats.recent_activities.map((act, i) => (
                <div key={i} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex items-center justify-between hover:border-gray-700 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                      {act.match_type ? act.match_type.slice(0, 2).toUpperCase() : 'RL'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{act.source_case}</span>
                        <span className="text-[10px] text-gray-500">↔</span>
                        <span className="text-xs font-bold text-cyan-400">{act.target_case}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Matched {act.match_type}: <span className="font-mono text-gray-200">{act.match_value}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Score: {act.new_score}%
                    </span>
                    <div className="text-[10px] text-gray-500">{new Date(act.changed_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-gray-500 glass-card rounded-2xl">
                No recent correlations found. Register new evidence to test DRIA auto-indexing!
              </div>
            )}
          </div>
        </div>

        {/* Traditional DBMS vs DERIS Architecture Callout */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Why DERIS? Architecture Comparison</span>
          </h2>

          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-1">
              <div className="text-xs font-bold text-rose-400">Traditional DBMS</div>
              <div className="text-[11px] text-gray-400 font-mono">
                Evidence → SQL JOIN → Suspect → SQL JOIN → Vehicle → SQL JOIN → FIR
              </div>
              <p className="text-[10px] text-rose-300/80 pt-1">
                Scans 14+ tables on every search query. High latency at scale.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
              <div className="text-xs font-bold text-emerald-400">DERIS (Our Innovation)</div>
              <div className="text-[11px] text-gray-400 font-mono">
                Evidence → Relationship Index → Connected Cases
              </div>
              <p className="text-[10px] text-emerald-300/80 pt-1">
                DRIA trigger pre-indexes matches on insert. O(1) indexed lookup!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
