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
  const [casesList, setCasesList] = useState([]);

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

    fetch(`/api/cases?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCasesList(data);
          if (data.length > 0 && !data.some(c => c.case_id === simSourceCase)) {
            setSimSourceCase(data[0].case_id);
          }
        }
      });
  };

  useEffect(() => {
    fetchNexusData();
  }, [focusCaseId]);

  // Interactive HTML5 Canvas Graph Physics & Layout Engine
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredNode, setHoveredNode] = useState(null);
  const nodePositionsRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graphData.nodes.length) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = canvas.width = canvas.parentElement.clientWidth || 900;
    const height = canvas.height = 500;

    // Distribute nodes evenly in a wide circle with repulsion spacing
    const totalNodes = graphData.nodes.length;
    const caseNodes = graphData.nodes.filter(n => n.type === 'Case');
    const suspectNodes = graphData.nodes.filter(n => n.type === 'Suspect');

    const nodes = graphData.nodes.map((n, idx) => {
      if (!nodePositionsRef.current[n.id]) {
        if (n.type === 'Case') {
          const caseIdx = caseNodes.findIndex(cn => cn.id === n.id);
          const angle = (caseIdx / Math.max(caseNodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
          const radius = Math.min(width, height) * 0.36;
          nodePositionsRef.current[n.id] = {
            x: width / 2 + Math.cos(angle) * radius,
            y: height / 2 + Math.sin(angle) * radius
          };
        } else {
          const suspIdx = suspectNodes.findIndex(sn => sn.id === n.id);
          const angle = (suspIdx / Math.max(suspectNodes.length, 1)) * Math.PI * 2;
          const radius = Math.min(width, height) * 0.22;
          nodePositionsRef.current[n.id] = {
            x: width / 2 + Math.cos(angle) * radius,
            y: height / 2 + Math.sin(angle) * radius
          };
        }
      }
      return {
        ...n,
        x: nodePositionsRef.current[n.id].x,
        y: nodePositionsRef.current[n.id].y
      };
    });

    const edges = graphData.edges;

    // Helper function for rounded rectangle pills
    const drawRoundRect = (x, y, w, h, radius, fillStyle, strokeStyle) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    // Edge color mapping by match type
    const getEdgeColor = (matchType) => {
      switch (matchType) {
        case 'Phone': return '#06B6D4';
        case 'Vehicle': return '#F59E0B';
        case 'Weapon': return '#F43F5E';
        case 'Fingerprint': return '#10B981';
        case 'DNA': return '#818CF8';
        case 'Location': return '#A855F7';
        default: return '#3B82F6';
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.scale(zoomLevel, zoomLevel);

      // Draw Grid Lines background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width / zoomLevel; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height / zoomLevel); ctx.stroke();
      }
      for (let y = 0; y < height / zoomLevel; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width / zoomLevel, y); ctx.stroke();
      }

      // Draw Edges with Staggered Score Badges
      edges.forEach((edge, edgeIdx) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (sourceNode && targetNode) {
          const isSelected = selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);
          const isCorrelation = edge.type === 'Correlation';
          const edgeColor = isCorrelation ? getEdgeColor(edge.match_type) : 'rgba(156, 163, 175, 0.35)';

          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);

          ctx.strokeStyle = isSelected ? '#38BDF8' : edgeColor;
          ctx.lineWidth = isSelected ? 3 : isCorrelation ? 2 : 1.2;
          if (isCorrelation) {
            ctx.setLineDash([6, 4]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Staggered Edge Score Badges to prevent overlapping
          if (isCorrelation) {
            const fraction = 0.35 + ((edgeIdx % 3) * 0.15);
            const badgeX = sourceNode.x + (targetNode.x - sourceNode.x) * fraction;
            const badgeY = sourceNode.y + (targetNode.y - sourceNode.y) * fraction;

            const badgeText = `${edge.match_type || 'Match'}: ${edge.score}%`;
            ctx.font = 'bold 9px monospace';
            const textWidth = ctx.measureText(badgeText).width;
            const boxW = textWidth + 14;
            const boxH = 18;

            drawRoundRect(
              badgeX - boxW / 2, 
              badgeY - boxH / 2, 
              boxW, 
              boxH, 
              5, 
              '#0F172A', 
              isSelected ? '#38BDF8' : edgeColor
            );

            ctx.fillStyle = edgeColor;
            ctx.fillText(badgeText, badgeX - textWidth / 2, badgeY + 3);
          }
        }
      });

      // Draw Nodes with Crisp Pill Labels
      nodes.forEach((node) => {
        const isSelected = selectedNode && selectedNode.id === node.id;
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        const isCase = node.type === 'Case';

        // Outer Glow Circle
        if (isSelected || isHovered || isCase) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, isCase ? 24 : 18, 0, Math.PI * 2);
          ctx.fillStyle = isCase 
            ? 'rgba(37, 99, 235, 0.25)' 
            : node.type === 'Suspect' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(6, 182, 212, 0.25)';
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, isCase ? 18 : 13, 0, Math.PI * 2);
        ctx.fillStyle = isCase ? '#2563EB' : node.type === 'Suspect' ? '#F59E0B' : '#06B6D4';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = isSelected ? 3 : 1.8;
        ctx.stroke();

        // Node ID Badge Inside Circle
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(node.id, node.x, node.y + 3.5);

        // Clean Wrapped Label Pill Below Node
        const fullTitle = node.label.includes(':') ? node.label.split(':')[1].trim() : node.label;
        const shortTitle = fullTitle.length > 22 ? fullTitle.substring(0, 20) + '...' : fullTitle;
        const mainLabel = `${node.id}: ${shortTitle}`;

        ctx.font = '11px Inter';
        const labelWidth = ctx.measureText(mainLabel).width;
        const pillW = Math.max(labelWidth + 14, 75);
        const pillH = 20;
        const pillX = node.x - pillW / 2;
        const pillY = node.y + (isCase ? 24 : 18);

        drawRoundRect(pillX, pillY, pillW, pillH, 6, 'rgba(15, 23, 42, 0.92)', isSelected ? '#38BDF8' : 'rgba(51, 65, 85, 0.8)');

        ctx.fillStyle = isSelected ? '#38BDF8' : '#F3F4F6';
        ctx.font = isCase ? 'bold 10px Inter' : '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(mainLabel, node.x, pillY + 13.5);
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Node Dragging & Click Selection Handlers
    let isDragging = false;
    let draggedNode = null;

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / zoomLevel,
        y: (e.clientY - rect.top) / zoomLevel
      };
    };

    const handleMouseDown = (e) => {
      const pos = getMousePos(e);
      const clicked = nodes.find((n) => Math.hypot(n.x - pos.x, n.y - pos.y) < 25);
      if (clicked) {
        isDragging = true;
        draggedNode = clicked;
        setSelectedNode(clicked);
      } else {
        setSelectedNode(null);
      }
    };

    const handleMouseMove = (e) => {
      const pos = getMousePos(e);
      const hovered = nodes.find((n) => Math.hypot(n.x - pos.x, n.y - pos.y) < 25);
      setHoveredNode(hovered || null);

      if (isDragging && draggedNode) {
        draggedNode.x = pos.x;
        draggedNode.y = pos.y;
        nodePositionsRef.current[draggedNode.id] = { x: pos.x, y: pos.y };
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      draggedNode = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [graphData, selectedNode, zoomLevel, hoveredNode]);

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
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <GitMerge className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-white">Relationship Index & Evidence Nexus</h1>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Interactive Case Investigation Network Graph</span>
                <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">DRAG NODES TO MOVE</span>
              </h2>
              <p className="text-[11px] text-gray-400">Click & drag any node to reposition • Hover over nodes to inspect details</p>
            </div>
          </div>

          {/* Graph Zoom & Control Buttons */}
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.15, 2.0))}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-mono font-bold"
              title="Zoom In"
            >
              + Zoom
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.15, 0.6))}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-mono font-bold"
              title="Zoom Out"
            >
              - Zoom
            </button>
            <button
              onClick={() => { setZoomLevel(1); nodePositionsRef.current = {}; }}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-800 font-mono font-bold"
              title="Reset View"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Evidence Type Match Legend Row */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] p-2.5 rounded-xl bg-gray-900/80 border border-gray-800/80">
          <span className="text-gray-400 font-mono font-bold uppercase text-[10px]">Evidence Match Types:</span>
          <span className="flex items-center space-x-1.5 text-cyan-400"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span><span>📱 Phone</span></span>
          <span className="flex items-center space-x-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span><span>🚗 Vehicle</span></span>
          <span className="flex items-center space-x-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span><span>⚔️ Weapon</span></span>
          <span className="flex items-center space-x-1.5 text-indigo-400"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span><span>🧬 DNA</span></span>
          <span className="flex items-center space-x-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span>🖐️ Fingerprint</span></span>
          <span className="flex items-center space-x-1.5 text-violet-400"><span className="w-2.5 h-2.5 rounded-full bg-violet-400"></span><span>📍 Location</span></span>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden bg-[#070A12] border border-gray-800/80">
          <canvas ref={canvasRef} className="w-full cursor-grab active:cursor-grabbing" />
          {selectedNode && (
            <div className="absolute top-4 right-4 p-4 rounded-xl bg-gray-900/95 border border-cyan-500/50 text-xs space-y-1.5 shadow-2xl max-w-xs backdrop-blur-md">
              <div className="font-bold text-white flex items-center justify-between">
                <span>{selectedNode.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">{selectedNode.type}</span>
              </div>
              {selectedNode.crime_type && <div className="text-gray-300">Crime Type: <span className="text-white font-medium">{selectedNode.crime_type}</span></div>}
              {selectedNode.status && <div className="text-gray-300">Status: <span className="text-cyan-400 font-mono">{selectedNode.status}</span></div>}
              {selectedNode.priority && <div className="text-gray-300">Priority: <span className="text-amber-400 font-mono">{selectedNode.priority}</span></div>}
              {selectedNode.phone && <div className="text-gray-300">Phone: <span className="text-cyan-400 font-mono">{selectedNode.phone}</span></div>}
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
              {casesList.length > 0 ? (
                casesList.map((c) => (
                  <option key={c.case_id} value={c.case_id}>Case {c.case_id} ({c.case_title})</option>
                ))
              ) : (
                <>
                  <option value="C250">Case C250 (Tech Park Homicide)</option>
                  <option value="C101">Case C101 (Commercial Bank Heist)</option>
                  <option value="C300">Case C300 (Seaport Narcotics)</option>
                </>
              )}
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

          <div className="flex flex-wrap items-center gap-2 text-xs">
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
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
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
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full font-mono font-bold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap leading-none">
                      Score: {link.score}%
                    </div>
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

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
            {filteredLinks.map((link) => (
              <div key={link.link_id} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-400 text-[10px]">{link.link_id}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-bold text-[10px]">
                    {link.match_type}
                  </span>
                </div>
                <div className="text-xs">
                  <div className="text-white font-semibold">{link.source_case_id}: {link.source_case_title}</div>
                  <div className="text-gray-500 text-[10px] my-0.5">↕ linked to</div>
                  <div className="text-cyan-300 font-semibold">{link.target_case_id}: {link.target_case_title}</div>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">Signature: {link.match_value}</div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Score: {link.score}%
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {link.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
