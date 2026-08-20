import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  PlusCircle, 
  Phone, 
  Car, 
  ShieldAlert, 
  Fingerprint, 
  Dna, 
  MapPin, 
  Zap, 
  CheckCircle2,
  X
} from 'lucide-react';

export default function EvidenceManagement({ onNavigateToNexus }) {
  const [evidenceList, setEvidenceList] = useState([]);
  const [casesList, setCasesList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [driaAlert, setDriaAlert] = useState(null);

  // Form State
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [evidenceType, setEvidenceType] = useState('Phone');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState({
    phone_number: '9876543210',
    registration_number: 'OD05AB1234',
    match_signature: 'SIG-K102-TACTICAL',
    minutiae_hash: 'HASH-FP-9982-MINUTIAE',
    match_code: 'DNA-MATCH-STR-441',
    address: 'Infocity Tech Park Tower B'
  });

  const fetchData = () => {
    fetch('/api/evidence')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvidenceList(data);
      });

    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCasesList(data);
          if (data.length > 0) setSelectedCaseId(data[0].case_id);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitEvidence = (e) => {
    e.preventDefault();
    fetch('/api/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: selectedCaseId,
        evidence_type: evidenceType,
        description: description || `Collected ${evidenceType} evidence`,
        details
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setShowModal(false);
        setDriaAlert({
          message: `Evidence ${data.evidence_id} registered into DERIS! DRIA Trigger updated Relationship Index automatically.`,
          evidence_id: data.evidence_id
        });
        fetchData();
        setTimeout(() => setDriaAlert(null), 8000);
      })
      .catch((err) => console.log('Error adding evidence:', err));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Phone': return <Phone className="w-4 h-4 text-cyan-400" />;
      case 'Vehicle': return <Car className="w-4 h-4 text-amber-400" />;
      case 'Weapon': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'Fingerprint': return <Fingerprint className="w-4 h-4 text-emerald-400" />;
      case 'DNA': return <Dna className="w-4 h-4 text-indigo-400" />;
      default: return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <span>Evidence Vault & Biometric Registry</span>
          </h1>
          <p className="text-xs text-gray-400">All registered physical, digital, and forensic evidence items.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Evidence Item</span>
        </button>
      </div>

      {/* DRIA Trigger Notification Toast */}
      {driaAlert && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">DRIA Auto-Indexing Execution Complete!</div>
              <div className="text-xs text-emerald-300/90">{driaAlert.message}</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateToNexus && onNavigateToNexus()}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
          >
            View Relationship Index →
          </button>
        </div>
      )}

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {evidenceList.map((ev) => (
          <div key={ev.evidence_id} className="p-5 rounded-2xl glass-panel space-y-3 border border-gray-800 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-gray-800/80 flex items-center justify-center">
                  {getTypeIcon(ev.evidence_type)}
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400">{ev.evidence_id}</span>
                  <div className="text-[10px] text-gray-400 font-mono">{ev.evidence_type}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {ev.status}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-white">{ev.case_title}</div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{ev.description}</p>
            </div>

            <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span>Location: {ev.storage_location}</span>
              <span>{new Date(ev.collection_date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Register Evidence Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-panel p-6 rounded-3xl space-y-5 border border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-white">Register Evidence (DRIA Auto-Index)</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEvidence} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Associate Case</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {casesList.map((c) => (
                    <option key={c.case_id} value={c.case_id}>{c.case_id}: {c.case_title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Evidence Type</label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Phone">Phone Number / SIM</option>
                  <option value="Vehicle">Vehicle Registration</option>
                  <option value="Weapon">Weapon Serial Signature</option>
                  <option value="Fingerprint">Fingerprint Minutiae</option>
                  <option value="DNA">DNA Loci Match Code</option>
                  <option value="Location">Geographic Location</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Burner smartphone recovered near crime scene"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Dynamic Identifier Input based on Type */}
              <div className="p-3.5 rounded-xl bg-gray-900/90 border border-blue-500/30 space-y-2">
                <div className="text-[11px] font-bold text-cyan-400 uppercase font-mono">
                  DRIA Identifier Signal: {evidenceType}
                </div>
                {evidenceType === 'Phone' && (
                  <input
                    type="text"
                    required
                    placeholder="Phone Number (e.g. 9876543210)"
                    value={details.phone_number}
                    onChange={(e) => setDetails({ ...details, phone_number: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                )}
                {evidenceType === 'Vehicle' && (
                  <input
                    type="text"
                    required
                    placeholder="Vehicle Reg (e.g. OD05AB1234)"
                    value={details.registration_number}
                    onChange={(e) => setDetails({ ...details, registration_number: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                )}
                {evidenceType === 'Weapon' && (
                  <input
                    type="text"
                    required
                    placeholder="Weapon Signature (e.g. SIG-K102-TACTICAL)"
                    value={details.match_signature}
                    onChange={(e) => setDetails({ ...details, match_signature: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                )}
                {evidenceType === 'Fingerprint' && (
                  <input
                    type="text"
                    required
                    placeholder="Minutiae Hash (e.g. HASH-FP-9982-MINUTIAE)"
                    value={details.minutiae_hash}
                    onChange={(e) => setDetails({ ...details, minutiae_hash: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                )}
                {evidenceType === 'DNA' && (
                  <input
                    type="text"
                    required
                    placeholder="DNA Match Code (e.g. DNA-MATCH-STR-441)"
                    value={details.match_code}
                    onChange={(e) => setDetails({ ...details, match_code: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all mt-4"
              >
                Log Evidence & Run DRIA Auto-Index
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
