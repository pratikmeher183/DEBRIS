import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  GitMerge, 
  User, 
  ShieldAlert, 
  MapPin, 
  Calendar,
  X,
  FileText,
  CheckCircle2,
  CheckCircle,
  Archive
} from 'lucide-react';

export default function CaseManagement({ onNavigateToNexus }) {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [solvedNotice, setSolvedNotice] = useState(null);

  // New Case Form State
  const [formData, setFormData] = useState({
    case_title: '',
    crime_type: 'Armed Robbery',
    priority: 'High',
    location: '',
    incident_date: new Date().toISOString().slice(0, 16)
  });

  const fetchCases = () => {
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCases(data);
      })
      .catch((err) => console.log('Error fetching cases:', err));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleOpenDetail = (caseId) => {
    fetch(`/api/cases/${caseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSelectedCase(data);
        }
      })
      .catch((err) => console.log('Error loading case detail:', err));
  };

  const handleMarkSolved = (caseId, title) => {
    fetch(`/api/cases/${caseId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Solved' })
    })
      .then((res) => res.json())
      .then((data) => {
        fetchCases();
        if (selectedCase && selectedCase.case_id === caseId) {
          setSelectedCase({ ...selectedCase, status: 'Solved' });
        }
        setSolvedNotice(`Case ${caseId} (${title || ''}) marked as SOLVED! FIR closed and saved to Solved tab.`);
        setStatusFilter('Solved');
        setTimeout(() => setSolvedNotice(null), 6000);
      })
      .catch((err) => console.log('Error marking case solved:', err));
  };

  const handleCreateCase = (e) => {
    e.preventDefault();
    fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        setShowModal(false);
        fetchCases();
        setFormData({
          case_title: '',
          crime_type: 'Armed Robbery',
          priority: 'High',
          location: '',
          incident_date: new Date().toISOString().slice(0, 16)
        });
      })
      .catch((err) => console.log('Error creating case:', err));
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.case_title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.fir_number && c.fir_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-blue-400" />
            <span>Case Management & FIR Registry</span>
          </h1>
          <p className="text-xs text-gray-400">View and manage criminal cases. DERIS automatically indexes evidence relationships across all cases.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New FIR & Case</span>
        </button>
      </div>

      {/* Solved Notification Banner */}
      {solvedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-xl animate-pulse">
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{solvedNotice}</span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            STATUS: SOLVED
          </span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Case ID, FIR Number, Crime Type, Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Status:</span>
          {['ALL', 'Active', 'Open', 'Under Review', 'Solved'].map((st) => {
            const count = cases.filter(c => st === 'ALL' || c.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  statusFilter === st
                    ? st === 'Solved'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <span>{st}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  statusFilter === st ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-gray-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60 text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4">Case ID</th>
              <th className="p-4">Case Title & FIR</th>
              <th className="p-4">Crime Type</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Evidence</th>
              <th className="p-4">Pre-Indexed Links</th>
              <th className="p-4 text-right">Actions & Solved Option</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-xs">
            {filteredCases.map((c) => (
              <tr key={c.case_id} className="hover:bg-gray-800/40 transition-colors group">
                <td className="p-4 font-mono font-bold text-cyan-400">{c.case_id}</td>
                <td className="p-4 space-y-0.5">
                  <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">{c.case_title}</div>
                  <div className="text-[11px] text-gray-500 font-mono">{c.fir_number || 'FIR-PENDING'}</div>
                </td>
                <td className="p-4 text-gray-300">{c.crime_type}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase font-mono ${
                    c.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    c.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {c.priority}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                    c.status === 'Solved' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {c.status === 'Solved' ? '✓ Solved' : c.status}
                  </span>
                </td>
                <td className="p-4 font-mono text-gray-300">{c.total_evidence || 0} items</td>
                <td className="p-4">
                  <button 
                    onClick={() => onNavigateToNexus && onNavigateToNexus(c.case_id)}
                    className="flex items-center space-x-1.5 text-cyan-400 hover:text-cyan-300 font-mono font-bold"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    <span>{c.linked_cases_count || 0} Linked Cases</span>
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Mark Solved Action Button */}
                    {c.status !== 'Solved' ? (
                      <button
                        onClick={() => handleMarkSolved(c.case_id, c.case_title)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 text-xs font-semibold flex items-center space-x-1 transition-all shadow"
                        title="Mark Case as Solved"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Solved</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Solved</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenDetail(c.case_id)}
                      className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white hover:bg-blue-600 transition-all"
                      title="View Full Case Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full glass-panel p-6 rounded-3xl space-y-6 max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-start justify-between border-b border-gray-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{selectedCase.case_id}</span>
                  <h2 className="text-xl font-bold text-white">{selectedCase.case_title}</h2>
                </div>
                <p className="text-xs text-gray-400 mt-1">{selectedCase.crime_type} • Lead Inspector: {selectedCase.lead_officer_name || 'Rahul Verma'}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Solved Decision Status Banner inside Modal */}
            <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-300">Case Investigation Resolution Status</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Current Status: <span className={`font-bold ${selectedCase.status === 'Solved' ? 'text-emerald-400' : 'text-cyan-400'}`}>{selectedCase.status}</span>
                </div>
              </div>

              {selectedCase.status !== 'Solved' ? (
                <button
                  onClick={() => handleMarkSolved(selectedCase.case_id, selectedCase.case_title)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Case as Solved & Close FIR</span>
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Case Solved & Archived in Solved Record</span>
                </div>
              )}
            </div>

            {/* Pre-Indexed Case Connections (DERIS Hero Feature) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <GitMerge className="w-4 h-4 text-cyan-400" />
                  <span>DERIS Pre-Indexed Connected Cases</span>
                </h3>
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedCase.connections ? selectedCase.connections.length : 0} Matches Found</span>
              </div>

              <div className="space-y-2">
                {selectedCase.connections && selectedCase.connections.length > 0 ? (
                  selectedCase.connections.map((conn, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{conn.connected_case_id}: {conn.connected_case_title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">Matched via {conn.match_type}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 font-mono">Match Signature: {conn.match_value}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 whitespace-nowrap inline-flex items-center">
                          {conn.score}% Confidence
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-gray-500 glass-card rounded-xl">No correlated cases indexed yet for this case.</div>
                )}
              </div>
            </div>

            {/* Evidence List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Evidence Items Collected</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCase.evidence && selectedCase.evidence.map((ev) => (
                  <div key={ev.evidence_id} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-400 font-mono">{ev.evidence_id}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{ev.evidence_type}</span>
                    </div>
                    <div className="text-xs text-gray-300">{ev.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Case Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-panel p-6 rounded-3xl space-y-5 border border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-white">Register New FIR & Case</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Street Bank Vault Armed Heist"
                  value={formData.case_title}
                  onChange={(e) => setFormData({ ...formData, case_title: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Crime Type</label>
                  <select
                    value={formData.crime_type}
                    onChange={(e) => setFormData({ ...formData, crime_type: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>Armed Robbery</option>
                    <option>Homicide</option>
                    <option>Grand Theft Auto</option>
                    <option>Cyber Extortion</option>
                    <option>Organized Crime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Crime Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infocity Tech Park Tower B Parking"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all mt-4"
              >
                Register Case into DERIS Engine
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
