import React, { useState } from 'react';
import { BookOpen, FileText, Database, Award, CheckCircle2 } from 'lucide-react';

export default function DocsViewer() {
  const [docType, setDocType] = useState('paper');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>Project Documentation & Research Papers</span>
          </h1>
          <p className="text-xs text-gray-400">Complete IEEE paper draft, SRS, ER diagrams, and academic report.</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-gray-900 p-1 rounded-2xl border border-gray-800 self-start">
          {[
            { id: 'paper', label: 'IEEE Research Paper' },
            { id: 'er', label: 'ER Diagram & Schemas' },
            { id: 'srs', label: 'SRS Specification' },
            { id: 'report', label: 'Project Report' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDocType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                docType === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Doc Viewer Content */}
      <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-800 space-y-6 leading-relaxed max-w-5xl mx-auto">
        {docType === 'paper' && (
          <div className="space-y-6 text-xs text-gray-300">
            <div className="text-center space-y-2 border-b border-gray-800 pb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                IEEE Conference Publication Draft
              </span>
              <h2 className="text-xl font-extrabold text-white">
                DERIS: A Novel DBMS-Based Evidence Correlation Framework for Crime Investigation
              </h2>
              <p className="text-xs text-gray-400">Department of Computer Science & Engineering • Crime Analytics Research Group</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-cyan-400 uppercase font-mono">Abstract</h3>
              <p className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 text-gray-300 leading-normal">
                Modern law enforcement databases store millions of criminal records across disparate tables representing FIRs, suspects, evidence, weapons, vehicles, and biometrics. Traditional Relational Database Management Systems (RDBMS) require costly multi-table SQL JOIN operations every time an investigator searches for cross-case links. To overcome this computational bottleneck, we present <strong>DERIS (Dynamic Evidence Relationship Indexing System)</strong>, introducing the <strong>Dynamic Relationship Indexing Algorithm (DRIA)</strong>. DRIA automatically constructs and updates a centralized Relationship Index layer at insertion time via database triggers, reducing multi-case correlation query complexity from O(N*M) to O(1).
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-cyan-400 uppercase font-mono">I. Introduction & Innovation</h3>
              <p>
                In standard crime management systems, querying if a newly recovered phone number or vehicle registration exists in prior cases requires scanning multiple tables using complex JOIN clauses. As dataset scale grows to hundreds of thousands of records, search latency increases exponentially. DERIS solves this by decoupling evidence storage from relationship discovery.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-cyan-400 uppercase font-mono">II. The DRIA Engine Architecture</h3>
              <p>
                Whenever an evidence record (Phone, Vehicle, Weapon, Fingerprint, DNA) is committed, the DRIA trigger extracts entity signatures, calculates confidence scores (ranging from 85% to 99%), inserts correlation records into <code>Relationship_Index</code>, updates cluster edges in <code>Investigation_Graph</code>, and invalidates query caches.
              </p>
            </div>
          </div>
        )}

        {docType === 'er' && (
          <div className="space-y-6 text-xs text-gray-300">
            <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">Entity-Relationship & BCNF Normalization Report</h2>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-cyan-400 font-mono">Core Domain Entities (14 Tables)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300 font-mono">
                <li>Police_Stations (station_id PK)</li>
                <li>Officers (officer_id PK, badge_number UNIQUE)</li>
                <li>FIRs (fir_id PK, fir_number UNIQUE, station_id FK)</li>
                <li>Cases (case_id PK, fir_id FK, lead_officer_id FK)</li>
                <li>Suspects, Victims, Witnesses (FK to Cases)</li>
                <li>Evidence (evidence_id PK, case_id FK)</li>
                <li>Subtypes: Weapons, Vehicles, Phones, Fingerprints, DNA_Samples, Locations (FK to Evidence)</li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-800">
              <h3 className="text-sm font-bold text-amber-400 font-mono">Novel DERIS Tables (4 Innovation Tables)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300 font-mono">
                <li>Relationship_Index (link_id PK, source_case_id FK, target_case_id FK, score)</li>
                <li>Relationship_History (history_id PK, link_id FK, trigger_source)</li>
                <li>Investigation_Graph (cluster_id PK, case_id FK, connected_case_id FK)</li>
                <li>Query_Cache (cache_id PK, query_hash UNIQUE)</li>
              </ul>
            </div>
          </div>
        )}

        {docType === 'srs' && (
          <div className="space-y-4 text-xs text-gray-300">
            <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">System Requirements Specification (SRS)</h2>
            <p><strong>1. System Purpose:</strong> Automated cross-case evidence correlation framework for crime investigation agencies.</p>
            <p><strong>2. User Roles:</strong> Admin (System config), Investigation Officer (Case creation & search), Forensic Officer (Biometric & laboratory evidence logging).</p>
            <p><strong>3. Non-Functional Requirements:</strong> Pre-indexed correlation query response under 10ms at 100,000 cases scale; strict foreign key constraint enforcement.</p>
          </div>
        )}

        {docType === 'report' && (
          <div className="space-y-4 text-xs text-gray-300">
            <h2 className="text-lg font-bold text-white border-b border-gray-800 pb-3">Academic Project Report Summary</h2>
            <p>Project Title: DERIS (Dynamic Evidence Relationship Indexing System)</p>
            <p>Tagline: "A Novel DBMS-Based Evidence Correlation Framework for Crime Investigation."</p>
            <p>Technology Stack: PostgreSQL / SQLite DBMS, Node.js + Express REST Backend, React + Tailwind CSS Frontend.</p>
          </div>
        )}
      </div>
    </div>
  );
}
