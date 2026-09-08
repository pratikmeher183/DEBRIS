import React, { useState } from 'react';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CaseManagement from './pages/CaseManagement';
import EvidenceManagement from './pages/EvidenceManagement';
import PersonManagement from './pages/PersonManagement';
import RelationshipNexus from './pages/RelationshipNexus';
import Analytics from './pages/Analytics';
import DocsViewer from './pages/DocsViewer';

export default function App() {
  const [user, setUser] = useState({
    officer_id: 'BADGE-102',
    badge_number: 'BADGE-102',
    name: 'Inspector Rahul Verma',
    rank: 'Senior Inspector',
    email: 'rahul.verma@deris.gov',
    role: 'Investigation Officer',
    station_name: 'Central Crime Branch HQ'
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [focusCaseId, setFocusCaseId] = useState(null);

  const handleNavigateToNexus = (caseId = null) => {
    setFocusCaseId(caseId);
    setActiveTab('nexus');
  };

  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar user={user} onLogout={() => setUser(null)} />

      {/* Main App Workspace */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Page Content Viewport */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl">
          {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'cases' && <CaseManagement onNavigateToNexus={handleNavigateToNexus} />}
          {activeTab === 'evidence' && <EvidenceManagement onNavigateToNexus={handleNavigateToNexus} />}
          {activeTab === 'persons' && <PersonManagement />}
          {activeTab === 'nexus' && <RelationshipNexus focusCaseId={focusCaseId} />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'docs' && <DocsViewer />}
        </main>
      </div>
    </div>
  );
}
