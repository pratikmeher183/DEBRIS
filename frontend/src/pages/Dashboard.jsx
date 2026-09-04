import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  GitMerge, 
  Layers, 
  ShieldAlert, 
  Crosshair, 
  Search, 
  Activity, 
  Maximize2, 
  Plus, 
  Minus, 
  Radio, 
  Dna, 
  Phone, 
  Car, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Database,
  Lock
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const [simInput, setSimInput] = useState('+1 (555) 019-2849');
  const [simResult, setSimResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const handleSimulate = (e) => {
    e.preventDefault();
    setIsSimulating(true);
    setTimeout(() => {
      setSimResult({
        cost: '0 SQL JOINS',
        source: '#FIR-2024-892',
        target: '#FIR-2024-411',
        latency: '1.18ms',
        nodesExpanded: '+3',
        confidence: '98.4%',
        cpuSpike: '0.00%'
      });
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="space-y-4 font-tech text-xs select-none text-gray-200">
      
      {/* 1. TOP AUDIT BANNER: ALGORITHMIC EFFICIENCY AUDIT */}
      <div className="tactical-panel p-4 rounded border border-cyan-900/50 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-mono text-[10px] uppercase tracking-wider">ALGORITHMIC EFFICIENCY AUDIT</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold">
              • 99.8% FASTER RESOLUTION
            </span>
          </div>
          <div className="text-[10px] text-cyan-600 font-mono">NODE: US-WEST-MIL-SECURE</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Main Title & Comparison Box */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-lg font-bold text-white tracking-wide font-heading uppercase">
              DERIS In-Memory Real-Time Graph Nexus
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Legacy SQL Box */}
              <div className="p-3 bg-[#0B0F19] border border-rose-900/40 rounded space-y-1">
                <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold uppercase">
                  <span>LEGACY MULTI-JOIN SQL</span>
                  <span className="px-1.5 py-0.2 bg-rose-950 text-rose-300 rounded border border-rose-800 text-[8px]">DEPRECATED</span>
                </div>
                <div className="text-base font-bold text-white font-mono">O(N·M) ~ 840ms</div>
                <p className="text-[10px] text-gray-400 leading-tight">
                  Exponential cross-table joins choke at scale with 20+ FIR correlations.
                </p>
              </div>

              {/* DERIS DRIA Box */}
              <div className="p-3 bg-cyan-950/40 border border-cyan-400 rounded space-y-1 glow-cyan-box">
                <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold uppercase">
                  <span>DERIS PRE-INDEXED (DRIA)</span>
                  <span className="px-1.5 py-0.2 bg-cyan-400 text-black font-extrabold rounded text-[8px]">OPTIMAL</span>
                </div>
                <div className="text-base font-bold text-cyan-300 font-mono">O(1) ~ 1.2ms</div>
                <p className="text-[10px] text-cyan-200/80 leading-tight">
                  Instant collision graph traversal with zero runtime joins and constant lookup.
                </p>
              </div>
            </div>
          </div>

          {/* Key Metric Counters */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-[#090E18] border border-cyan-900/40 rounded">
              <div className="text-[9px] text-gray-400 uppercase tracking-wider font-mono">TOTAL INDEXED RELATIONS</div>
              <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">4,892</div>
              <div className="text-[9px] text-emerald-400 font-mono flex items-center space-x-1 mt-0.5">
                <span>▲ +14.2% / 24h</span>
              </div>
            </div>

            <div className="p-2.5 bg-[#090E18] border border-cyan-900/40 rounded">
              <div className="text-[9px] text-gray-400 uppercase tracking-wider font-mono">CROSS-CASE COLLISIONS</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">381</div>
              <div className="text-[9px] text-cyan-400 font-mono mt-0.5">ACTIVE MULTI-FIR</div>
            </div>

            <div className="p-2.5 bg-[#090E18] border border-cyan-900/40 rounded">
              <div className="text-[9px] text-gray-400 uppercase tracking-wider font-mono">AUTOMATED FIR LINKS</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">94</div>
              <div className="text-[9px] text-gray-500 font-mono mt-0.5">AUTO-DISCOVERED</div>
            </div>

            <div className="p-2.5 bg-[#090E18] border border-rose-900/50 rounded bg-rose-950/10">
              <div className="text-[9px] text-rose-400 uppercase tracking-wider font-mono">HIGH-PRIORITY SYNDICATES</div>
              <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">7</div>
              <div className="text-[9px] text-rose-400/80 font-mono mt-0.5 font-bold uppercase">ACTION REQUIRED</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE GRID: NEXUS GRAPH & AUTO-COLLISION STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Middle Left: Relationship Nexus Graph Viewport */}
        <div className="lg:col-span-8 tactical-panel rounded border border-cyan-900/50 p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white uppercase tracking-wider font-heading text-sm">
                RELATIONSHIP NEXUS GRAPH
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 bg-cyan-950 border border-cyan-800 rounded">
                [INVESTIGATION_GRAPH_ACTIVE]
              </span>
            </div>

            {/* Modality Filter Pills & Toolbar Controls */}
            <div className="flex items-center space-x-1 text-[10px]">
              {['PHONE', 'WEAPON', 'PLATE', 'DNA', 'PRINT'].map((m) => (
                <button
                  key={m}
                  className="px-2 py-0.5 bg-[#080E1B] hover:bg-cyan-950 border border-cyan-900/60 text-cyan-300 rounded font-mono uppercase"
                >
                  {m}
                </button>
              ))}
              <div className="h-4 w-px bg-cyan-900/50 mx-1"></div>
              <button className="p-1 bg-[#080E1B] border border-cyan-900/60 text-cyan-400 rounded"><Plus className="w-3 h-3" /></button>
              <button className="p-1 bg-[#080E1B] border border-cyan-900/60 text-cyan-400 rounded"><Minus className="w-3 h-3" /></button>
              <button className="p-1 bg-[#080E1B] border border-cyan-900/60 text-cyan-400 rounded"><Maximize2 className="w-3 h-3" /></button>
              <button 
                onClick={() => onNavigate && onNavigate('nexus')}
                className="bg-cyan-400 text-black font-bold px-2 py-0.5 rounded flex items-center space-x-1 shadow-[0_0_10px_rgba(0,240,255,0.3)]"
              >
                <Zap className="w-3 h-3 fill-black" />
                <span>RE-INDEX</span>
              </button>
            </div>
          </div>

          {/* Active Interconnected Breadcrumb Banner */}
          <div className="px-3 py-1.5 bg-cyan-950/40 border border-cyan-800/60 rounded text-[10px] font-mono flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400 font-bold">● CASE #FIR-2024-892 // METRO ARMED HEIST</span>
            </div>
            <div className="text-gray-400">
              INTERCONNECTED WITH: <span className="text-amber-400 font-bold">#FIR-2024-411 [CARGO HIJACK]</span>
            </div>
          </div>

          {/* Interactive Graph Canvas Box */}
          <div className="relative h-64 bg-[#04070F] rounded border border-cyan-950 overflow-hidden flex items-center justify-center p-4 scanline-bg">
            {/* Background SVG Connectivity Graph Lines & Glowing Nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="20%" y1="35%" x2="50%" y2="50%" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="30%" y1="75%" x2="50%" y2="50%" stroke="#F59E0B" strokeWidth="2" />
              <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />

              {/* Edge Label Badges */}
              <rect x="30%" y="38%" width="120" height="16" fill="#060C18" stroke="#00F0FF" rx="3" />
              <text x="31%" y="48%" fill="#00F0FF" fontSize="9" fontFamily="Share Tech Mono">98.6% MATCH (BALLISTICS)</text>

              <rect x="58%" y="36%" width="115" height="16" fill="#060C18" stroke="#00F0FF" rx="3" />
              <text x="59%" y="46%" fill="#00F0FF" fontSize="9" fontFamily="Share Tech Mono">99.1% CONFIDENCE (IMEI)</text>
            </svg>

            {/* Central Suspect Hub Node */}
            <div className="absolute top-[42%] left-[45%] z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center text-rose-300 font-bold shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse">
                SUSP
              </div>
              <div className="mt-1 bg-rose-950/90 border border-rose-500/60 px-2 py-0.5 rounded text-[9px] text-rose-200 font-bold font-mono">
                VIKTOR VANCE (T-809)
              </div>
            </div>

            {/* Satellite Nodes */}
            {/* Top Left FIR Node */}
            <div className="absolute top-[25%] left-[16%] flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono text-[9px] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                FIR
              </div>
              <div className="text-[8px] font-mono text-cyan-400 mt-1 bg-[#060A14] px-1 border border-cyan-900 rounded">
                FIR-2024-892
              </div>
            </div>

            {/* Top Right Weapon Node */}
            <div className="absolute top-[20%] left-[76%] flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono text-[9px] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                WEAP
              </div>
              <div className="text-[8px] font-mono text-cyan-400 mt-1 bg-[#060A14] px-1 border border-cyan-900 rounded">
                GLOCK 19 (#GK-9821)
              </div>
            </div>

            {/* Bottom Left Phone Node */}
            <div className="absolute top-[70%] left-[24%] flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-950 border border-amber-400 flex items-center justify-center text-amber-300 font-mono text-[9px] font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                CELL
              </div>
              <div className="text-[8px] font-mono text-amber-300 mt-1 bg-[#060A14] px-1 border border-amber-900 rounded">
                BURNER SIM (+1 555-8291)
              </div>
            </div>

            {/* Bottom Right DNA Node */}
            <div className="absolute top-[70%] left-[70%] flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono text-[9px] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                BIO
              </div>
              <div className="text-[8px] font-mono text-cyan-400 mt-1 bg-[#060A14] px-1 border border-cyan-900 rounded">
                MINUTIAE MODEL-02
              </div>
            </div>

            {/* Bottom Left Coordinate Bar */}
            <div className="absolute bottom-2 left-3 text-[9px] text-gray-500 font-mono">
              LAT: 34.0522° N | LON: -118.2437° W | PROJECTION: EPSG:4326 | DRIA_EDGES: 11
            </div>
          </div>

          {/* Graph Footer Status */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-1">
            <div>ACTIVE GRAPH SEED: <span className="text-cyan-300 font-bold">FIR-2024-892</span></div>
            <div>INDEX RESOLVER: <span className="text-cyan-300 font-bold">DRIA-KDTREE-V4</span></div>
            <div className="flex items-center space-x-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>SYNCHRONIZED WITH EVIDENCE LEDGER</span>
            </div>
          </div>
        </div>

        {/* Middle Right: DRIA Auto-Collision Stream */}
        <div className="lg:col-span-4 tactical-panel rounded border border-cyan-900/50 p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
            <h3 className="font-bold text-white uppercase tracking-wider font-heading text-sm">
              DRIA AUTO-COLLISION STREAM
            </h3>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-700 font-mono text-[9px] font-bold">
              3 UNCONFIRMED HITS
            </span>
          </div>

          {/* Collision Tabs */}
          <div className="flex border-b border-cyan-900/40 text-[10px] font-mono">
            <button className="px-3 py-1 text-cyan-300 border-b-2 border-cyan-400 font-bold">
              Live Collisions (3 new)
            </button>
            <button className="px-3 py-1 text-gray-500 hover:text-gray-300">
              Pending Ingestion
            </button>
            <button className="px-3 py-1 text-gray-500 hover:text-gray-300">
              Chain of Custody
            </button>
          </div>

          {/* Collision Cards Stream */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {/* Card 1: Weapon Striation Hit */}
            <div className="p-3 bg-[#080E1B] border border-cyan-900/60 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-700 rounded font-mono font-bold">
                  [EV-BAL-9821]
                </span>
                <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono">
                  WEAPON STRIATION HIT
                </span>
                <span className="text-cyan-300 font-bold font-mono">🎯 98.6%</span>
              </div>
              <p className="text-[10px] text-gray-300 leading-relaxed font-mono">
                Glock 19 (S/N <span className="text-cyan-300 font-bold">#GK-9821</span>) ballistic rifling striation matches recovered slug in Cold Case <span className="text-amber-400 font-bold">#FIR-203</span> [Unsolved 2022 Armored Truck Robbery].
              </p>
              <div className="flex items-center justify-between pt-1 text-[9px] font-mono">
                <span className="text-gray-500">AUTO-COLLISION: 1.2ms [DRIA-HASH]</span>
                <div className="flex items-center space-x-1">
                  <button className="px-2 py-1 bg-cyan-400 text-black font-bold rounded">Merge Leads</button>
                  <button className="px-2 py-1 bg-[#0F172A] text-cyan-300 border border-cyan-800 rounded">View Report</button>
                </div>
              </div>
            </div>

            {/* Card 2: Burner Phone IMEI Overlap */}
            <div className="p-3 bg-[#080E1B] border border-amber-900/60 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-700 rounded font-mono font-bold">
                  [EV-TEL-4819]
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">
                  BURNER PHONE IMEI OVERLAP
                </span>
                <span className="text-amber-300 font-bold font-mono">📡 99.1%</span>
              </div>
              <p className="text-[10px] text-gray-300 leading-relaxed font-mono">
                IMEI <span className="text-amber-300 font-bold">864291048291042</span> pinged tower sectors within 48h across 3 distinct active heist cases: <span className="text-cyan-300 font-bold">FIR-892, FIR-740, FIR-688</span>.
              </p>
              <div className="flex items-center justify-between pt-1 text-[9px] font-mono">
                <span className="text-gray-500">TOWER HOPPING: 3 SECTORS</span>
                <div className="flex items-center space-x-1">
                  <button className="px-2 py-1 bg-amber-500 text-black font-bold rounded">Ping Geo-Cell</button>
                  <button className="px-2 py-1 bg-[#0F172A] text-amber-300 border border-amber-800 rounded">Flag Syndicate</button>
                </div>
              </div>
            </div>

            {/* Card 3: STR Loci DNA Profile Match */}
            <div className="p-3 bg-[#080E1B] border border-rose-900/60 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-700 rounded font-mono font-bold">
                  [EV-DNA-7740]
                </span>
                <span className="text-[10px] font-bold text-rose-400 uppercase font-mono">
                  STR LOCI DNA PROFILE MATCH
                </span>
                <span className="text-rose-300 font-bold font-mono">🧬 1 in 4.2B</span>
              </div>
              <p className="text-[10px] text-gray-300 leading-relaxed font-mono">
                16-Marker STR DNA sample lifted from Safe Box Handle matched national offender profile <span className="text-rose-400 font-bold">#S-1049</span> (Viktor Vance alias 'Kestrel').
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] text-gray-500 font-mono pt-1">
            <span>INGESTION PIPELINE: RUNNING (184 evt/sec)</span>
            <span className="text-cyan-400">DRIA BUFFER: 0% DROPPED</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM GRID: CASE LIFECYCLE DIRECTORY & DRIA SIMULATOR CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Bottom Left: Case & FIR Lifecycle Directory */}
        <div className="lg:col-span-7 tactical-panel rounded border border-cyan-900/50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
            <div className="flex items-center space-x-2">
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white uppercase tracking-wider font-heading text-sm">
                CASE & FIR LIFECYCLE DIRECTORY
              </h3>
            </div>

            <div className="flex items-center space-x-1 text-[9px] font-mono">
              <span className="text-gray-500 mr-1">FILTER BY:</span>
              <button className="px-2 py-0.5 bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold rounded">
                ALL (142)
              </button>
              <button className="px-2 py-0.5 bg-[#080E1B] border border-cyan-900 text-gray-400 rounded">
                OPEN (18)
              </button>
              <button className="px-2 py-0.5 bg-[#080E1B] border border-cyan-900 text-gray-400 rounded">
                PRE-INDEXED
              </button>
            </div>
          </div>

          {/* Directory Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px]">
              <thead>
                <tr className="border-b border-cyan-900/40 text-gray-500 uppercase">
                  <th className="py-2 px-2">FIR IDENTIFIER</th>
                  <th className="py-2 px-2">STATUS & CLASSIFICATION</th>
                  <th className="py-2 px-2">DRIA CORRELATIONS</th>
                  <th className="py-2 px-2">LEAD INVESTIGATOR</th>
                  <th className="py-2 px-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-950/60">
                <tr className="hover:bg-cyan-950/30">
                  <td className="py-2.5 px-2">
                    <div className="font-bold text-white">FIR-2024-892</div>
                    <div className="text-[9px] text-gray-400">Metro Armed Heist Ring</div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-700 rounded font-bold">
                      🔴 CRITICAL PRIORITY
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-cyan-300">
                    <div className="font-bold">5 Nodes Linked</div>
                    <div className="text-[9px] text-gray-500">Striations, IMEI, DNA</div>
                  </td>
                  <td className="py-2.5 px-2 text-gray-300">
                    <div>Det. Marcus Vance</div>
                    <div className="text-[9px] text-gray-500">Badge #4910</div>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button 
                      onClick={() => onNavigate && onNavigate('cases')}
                      className="px-2.5 py-1 bg-[#0F172A] hover:bg-cyan-950 border border-cyan-800 text-cyan-300 rounded"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-cyan-950/30">
                  <td className="py-2.5 px-2">
                    <div className="font-bold text-white">FIR-2024-740</div>
                    <div className="text-[9px] text-gray-400">Dockland Cargo Hijack</div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-700 rounded font-bold">
                      HIGH RISK
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-cyan-300">
                    <div className="font-bold">Ballistic Match Linked</div>
                    <div className="text-[9px] text-gray-500">Pre-Indexed O(1)</div>
                  </td>
                  <td className="py-2.5 px-2 text-gray-300">
                    <div>Det. Elena Rostova</div>
                    <div className="text-[9px] text-gray-500">Badge #2199</div>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button 
                      onClick={() => onNavigate && onNavigate('cases')}
                      className="px-2.5 py-1 bg-[#0F172A] hover:bg-cyan-950 border border-cyan-800 text-cyan-300 rounded"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-cyan-950/30">
                  <td className="py-2.5 px-2">
                    <div className="font-bold text-white">FIR-2024-612</div>
                    <div className="text-[9px] text-gray-400">Substation Wire Sabotage</div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded font-bold">
                      SOLVED
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-gray-400">
                    <div>Auto-Archived</div>
                    <div className="text-[9px] text-gray-500">DRIA Evidence Linkage</div>
                  </td>
                  <td className="py-2.5 px-2 text-gray-300">
                    <div>Forensic Unit Alpha</div>
                    <div className="text-[9px] text-gray-500">Automated Resolution</div>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button className="px-2.5 py-1 bg-[#0B101D] text-gray-500 border border-gray-800 rounded">
                      Vault
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Right: DRIA Simulator Console */}
        <div className="lg:col-span-5 tactical-panel rounded border border-cyan-900/50 p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white uppercase tracking-wider font-heading text-sm">
                DRIA SIMULATOR CONSOLE
              </h3>
            </div>
            <span className="text-[9px] font-mono text-cyan-500">RUNTIME ENGINE: v4.2-STABLE</span>
          </div>

          <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
            Test instant O(1) pre-indexed entity ingestion. Emulates real-time cross-case collision detection with zero database join latency overhead.
          </p>

          <form onSubmit={handleSimulate} className="space-y-2">
            <div className="text-[9px] font-mono text-gray-400 uppercase">MODALITY TARGET TYPE</div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={simInput}
                onChange={(e) => setSimInput(e.target.value)}
                placeholder="Burner Phone Number / MSISDN (+1 555...)"
                className="flex-1 bg-[#070C18] border border-cyan-900 text-cyan-200 text-[11px] font-mono px-3 py-1.5 rounded focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={isSimulating}
                className="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold px-3 py-1.5 rounded flex items-center space-x-1.5 shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all uppercase"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>{isSimulating ? 'INDEXING...' : 'SIMULATE'}</span>
              </button>
            </div>
          </form>

          {/* Live Simulator Results Terminal Display */}
          <div className="p-3 bg-[#04070E] border border-cyan-950 rounded font-mono text-[10px] space-y-1.5">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span>● O(1) PRE-INDEXED LINK DISCOVERED</span>
              <span className="text-gray-500">COST: 0 SQL JOINS</span>
            </div>

            <div className="text-gray-300">
              TARGET MATCHED: <span className="text-cyan-300 font-bold">#FIR-2024-892</span> &lt;---&gt; <span className="text-amber-400 font-bold">#FIR-2024-411</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-cyan-950 text-[9px]">
              <div>
                <span className="text-gray-500">LOOKUP LATENCY:</span>
                <div className="text-cyan-300 font-bold">1.18ms</div>
              </div>
              <div>
                <span className="text-gray-500">GRAPH NODES:</span>
                <div className="text-white font-bold">EXPANDED: +3</div>
              </div>
              <div>
                <span className="text-gray-500">CONFIDENCE:</span>
                <div className="text-emerald-400 font-bold">98.4%</div>
              </div>
            </div>

            <div className="pt-1 text-[8px] text-cyan-700 flex items-center justify-between">
              <span>DATABASE ENGINE OVERHEAD:</span>
              <span className="text-emerald-400 font-bold">0.00% CPU SPIKE (PRE-INDEXED BUFFER)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SYSTEM SECURITY FOOTER BAR */}
      <div className="p-2 bg-[#050810] border border-cyan-950 rounded flex items-center justify-between text-[9px] font-mono text-cyan-700 tracking-wider">
        <div className="flex items-center space-x-2">
          <Lock className="w-3 h-3 text-cyan-600" />
          <span>DERIS INVESTIGATIVE WORKSTATION // CLEARANCE: LVL-4 TS/SCI // SESSION ID: #8892-ALPHA-TS</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>ENCRYPTION: AES-256-GCM</span>
          <span>INTEGRITY HASH: SHA-512-VERIFIED</span>
          <span className="text-cyan-400 font-bold">NODE: US-WEST-MIL-SECURE</span>
        </div>
      </div>
    </div>
  );
}
