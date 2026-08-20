import React, { useEffect, useRef, useState } from 'react';
import { 
  GitMerge, 
  Zap, 
  Network, 
  Search, 
  Filter, 
  CheckCircle2, 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  Phone, 
  Car, 
  Fingerprint, 
  Dna,
  History,
  Layers
} from 'lucide-react';

export default function RelationshipNexus({ focusCaseId }) {
  const [links, setLinks] = useState([]);
  const [history, setHistory] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [minScore, setMinScore] = useState(0);
  const [selectedLink, setSelectedLink] = useState(null);

  // DRIA Simulator State
  const [simType, setSimType] = useState('Phone');
  const [simValue, setSimValue] = useState('9876543210');
  const [simSourceCase, setSimSourceCase] = useState('C250');
  const [simMessage, setSimMessage] = useState('');

  // Canvas Graph Ref
  const canvasRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);

  const fetchNexusData = () => {
    let url = '/api/relationships';
    if (focusCaseId) url += `?case_id=${focusCaseId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLinks(data);
      });

    fetch('/api/relationships/history')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
      });

    fetch('/api/graph/nexus')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.nodes) {
          setGraphData(data);
        }
      });
  };

  useEffect(() => {
    fetchNexusData();
  }, [focusCaseId]);

  // Interactive HTML5 Canvas Graph Physics Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graphData.nodes.length) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 420;

    // Initialize node coordinates if not present
    const nodes = graphData.nodes.map((n, idx) => {
      const angle = (idx / graphData.nodes.length) * Math.PI * 2;
      const radius = 130 + (idx % 2) * 50;
      return {
        ...n,
        x: n.x || width / 2 + Math.cos(angle) * radius,
        y: n.y || height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0
      };
    });

    const edges = graphData.edges;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Grid Lines background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw Edges
      edges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (sourceNode && targetNode) {
          const isSelected = selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);
          
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          
          if (edge.type === 'Correlation') {
            ctx.strokeStyle = isSelected ? '#06B6D4' : 'rgba(59, 130, 246, 0.6)';
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.setLineDash([5, 5]);
          } else {
            ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Edge Label (Match Type & Score)
          if (edge.type === 'Correlation') {
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;
            ctx.fillStyle = '#0B0F19';
            ctx.fillRect(midX - 25, midY - 10, 50, 18);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
            ctx.strokeRect(midX - 25, midY - 10, 50, 18);
            ctx.fillStyle = '#38BDF8';
            ctx.font = '10px monospace';
            ctx.fillText(`${edge.score}%`, midX - 12, midY + 3);
          }
        }
      });

      // Draw Nodes
      nodes.forEach((node) => {
        const isSelected = selectedNode && selectedNode.id === node.id;
        const isCase = node.type === 'Case';

        // Outer Glow
        if (isSelected || isCase) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, isCase ? 22 : 16, 0, Math.PI * 2);
          ctx.fillStyle = isCase ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)';
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, isCase ? 16 : 12, 0, Math.PI * 2);
        ctx.fillStyle = isCase ? '#2563EB' : node.type === 'Suspect' ? '#F59E0B' : '#06B6D4';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();

        // Node Text
        ctx.fillStyle = '#F3F4F6';
        ctx.font = isCase ? 'bold 11px Inter' : '10px Inter';
        ctx.fillText(node.label, node.x - (node.label.length * 3), node.y + (isCase ? 30 : 24));
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Click handler for node selection
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const clicked = nodes.find((n) => {
        const dist = Math.hypot(n.x - clickX, n.y - clickY);
        return dist < 20;
      });

      setSelectedNode(clicked || null);
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [graphData, selectedNode]);

  // Run DRIA Live Simulation
  const handleRunSimulation = () => {
    setSimMessage('DRIA Engine Executing: Extracting evidence signature...');

    setTimeout(() => {
      setSimMessage(`DRIA Trigger: Searching pre-indexed tables for match value '${simValue}'...`);
    }, 600);

    setTimeout(() => {
      fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: simSourceCase,
          evidence_type: simType,
          description: `Simulated ${simType} evidence insertion`,
          details: {
            phone_number: simValue,
            registration_number: simValue,
            match_signature: simValue,
            minutiae_hash: simValue,
            match_code: simValue
          }
        })
      })
        .then((res) => res.json())
        .then((data) => {
          setSimMessage(`✅ DRIA Success! Dynamic Relationship Index created instant connection across cases!`);
          fetchNexusData();
        });
    }, 1400);
  };

  const filteredLinks = links.filter((l) => {
    const matchesType = filterType === 'ALL' || l.match_type === filterType;
    const matchesScore = l.score >= minScore;
    return matchesType && matchesScore;
  });

  return (
    <div className="space-y-8">
      {/* Hero Title Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-gray-900 to-indigo-950 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <GitMerge className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Relationship Index & Evidence Nexus</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">PATENTED INNOVATION ⭐</span>
          </div>
          <p className="text-xs text-gray-400">Pre-computed cross-case correlations updated automatically by DRIA DBMS triggers.</p>
        </div>

        <button
          onClick={fetchNexusData}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Correlation Index</span>
        </button>
      </div>

      {/* Hero Canvas Network Graph Visualization */}
      <div className="glass-panel p-5 rounded-3xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Interactive Case Investigation Network Graph</h2>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center space-x-1.5 text-blue-400"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span><span>Case Nodes</span></span>
            <span className="flex items-center space-x-1.5 text-amber-400"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span><span>Suspects</span></span>
            <span className="flex items-center space-x-1.5 text-cyan-400"><span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span><span>DRIA Correlations</span></span>
          </div>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden bg-gray-950/80 border border-gray-800/80">
          <canvas ref={canvasRef} className="w-full cursor-pointer" />
          {selectedNode && (
            <div className="absolute top-4 right-4 p-4 rounded-xl bg-gray-900/90 border border-cyan-500/40 text-xs space-y-1 shadow-2xl max-w-xs">
              <div className="font-bold text-white">{selectedNode.label}</div>
              <div className="text-gray-400">Type: <span className="text-cyan-400 font-mono">{selectedNode.type}</span></div>
              {selectedNode.crime_type && <div className="text-gray-400">Crime: {selectedNode.crime_type}</div>}
              {selectedNode.phone && <div className="text-gray-400">Phone: {selectedNode.phone}</div>}
            </div>
          )}
        </div>
      </div>

      {/* DRIA Engine Live Interactive Playground / Simulator */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-blue-950/40 to-gray-900 border border-blue-500/30 space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">DRIA Algorithm Live Correlation Playground</h2>
        </div>
        <p className="text-xs text-gray-400">
          Test how DERIS automatically discovers cross-case links the instant new evidence arrives without running manual SQL JOINs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Target Case</label>
            <select
              value={simSourceCase}
              onChange={(e) => setSimSourceCase(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
            >
              <option value="C250">Case C250 (Tech Park Homicide)</option>
              <option value="C101">Case C101 (Commercial Bank Heist)</option>
              <option value="C300">Case C300 (Seaport Narcotics)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 font-semibold mb-1">Evidence Type</label>
            <select
              value={simType}
              onChange={(e) => setSimType(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
            >
              <option value="Phone">Phone Number</option>
              <option value="Vehicle">Vehicle Number</option>
              <option value="Weapon">Weapon Signature</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 font-semibold mb-1">Match Value / Signature</label>
            <input
              type="text"
              value={simValue}
              onChange={(e) => setSimValue(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunSimulation}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Simulate DRIA Trigger</span>
            </button>
          </div>
        </div>

        {simMessage && (
          <div className="p-3 rounded-xl bg-gray-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            {simMessage}
          </div>
        )}
      </div>

      {/* Pre-Indexed Relationship Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Master Relationship Index Table (`Relationship_Index`)</span>
          </h2>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-gray-400 font-medium">Filter Type:</span>
            {['ALL', 'Phone', 'Vehicle', 'Weapon', 'Fingerprint', 'DNA'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  filterType === t ? 'bg-blue-600 text-white' : 'bg-gray-800/60 text-gray-400 hover:text-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl glass-panel overflow-hidden border border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60 text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Link ID</th>
                <th className="p-4">Source Case</th>
                <th className="p-4">Connected Target Case</th>
                <th className="p-4">Match Type</th>
                <th className="p-4">Match Signature / Value</th>
                <th className="p-4">Score</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-xs">
              {filteredLinks.map((link) => (
                <tr key={link.link_id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-cyan-400">{link.link_id}</td>
                  <td className="p-4 font-semibold text-white">{link.source_case_id}: {link.source_case_title}</td>
                  <td className="p-4 font-semibold text-cyan-300">{link.target_case_id}: {link.target_case_title}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-bold">
                      {link.match_type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-200">{link.match_value}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      {link.score}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {link.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
