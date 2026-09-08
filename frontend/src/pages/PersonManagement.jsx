import React, { useEffect, useState } from 'react';
import { Users, UserX, ShieldCheck, PlusCircle, Phone, MapPin, X } from 'lucide-react';

export default function PersonManagement() {
  const [activeSubTab, setActiveSubTab] = useState('suspects');
  const [suspects, setSuspects] = useState([]);
  const [victims, setVictims] = useState([]);
  const [witnesses, setWitnesses] = useState([]);

  useEffect(() => {
    fetch('/api/persons/suspects').then((res) => res.json()).then((data) => Array.isArray(data) && setSuspects(data));
    fetch('/api/persons/victims').then((res) => res.json()).then((data) => Array.isArray(data) && setVictims(data));
    fetch('/api/persons/witnesses').then((res) => res.json()).then((data) => Array.isArray(data) && setWitnesses(data));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-400" />
          <span>Persons Directory & Involvement Index</span>
        </h1>
        <p className="text-xs text-gray-400">Track suspects, victims, witnesses, and officers across criminal cases.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
        {[
          { id: 'suspects', label: `Suspects (${suspects.length})` },
          { id: 'victims', label: `Victims (${victims.length})` },
          { id: 'witnesses', label: `Witnesses (${witnesses.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-800/40 text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {activeSubTab === 'suspects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {suspects.map((s) => (
            <div key={s.suspect_id} className="p-5 rounded-2xl glass-panel space-y-3 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{s.name}</h3>
                  {s.alias && <div className="text-[11px] text-cyan-400 font-mono">Alias: "{s.alias}"</div>}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                  s.risk_level === 'Severe' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  s.risk_level === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  Risk: {s.risk_level}
                </span>
              </div>

              <div className="text-xs text-gray-300">
                <span className="text-gray-500 font-mono">Case:</span> {s.case_title}
              </div>

              <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400 space-y-1 font-mono">
                <div>Phone: {s.phone_number || 'N/A'}</div>
                <div>ID: {s.national_id || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'victims' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {victims.map((v) => (
            <div key={v.victim_id} className="p-5 rounded-2xl glass-panel space-y-3 border border-gray-800">
              <h3 className="text-sm font-bold text-white">{v.name}</h3>
              <div className="text-xs text-gray-300"><span className="text-gray-500 font-mono">Case:</span> {v.case_title}</div>
              <p className="text-xs text-gray-400 bg-gray-900/60 p-3 rounded-xl border border-gray-800">"{v.statement}"</p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'witnesses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {witnesses.map((w) => (
            <div key={w.witness_id} className="p-5 rounded-2xl glass-panel space-y-3 border border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{w.name}</h3>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  Reliability: {w.reliability_score}%
                </span>
              </div>
              <div className="text-xs text-gray-300"><span className="text-gray-500 font-mono">Case:</span> {w.case_title}</div>
              <p className="text-xs text-gray-400 bg-gray-900/60 p-3 rounded-xl border border-gray-800">"{w.statement}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
