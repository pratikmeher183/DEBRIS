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

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('deris_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [focusCaseId, setFocusCaseId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (officerData) => {
    setUser(officerData);
    try {
      localStorage.setItem('deris_current_user', JSON.stringify(officerData));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('deris_current_user');
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  };

  const handleNavigateToNexus = (caseId = null) => {
    setFocusCaseId(caseId);
    setActiveTab('nexus');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main App Workspace */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 overflow-y-auto max-w-7xl w-full">
          {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'cases' && <CaseManagement onNavigateToNexus={handleNavigateToNexus} />}
          {activeTab === 'evidence' && <EvidenceManagement onNavigateToNexus={handleNavigateToNexus} />}
          {activeTab === 'persons' && <PersonManagement />}
          {activeTab === 'nexus' && <RelationshipNexus focusCaseId={focusCaseId} />}
          {activeTab === 'analytics' && <Analytics />}
        </main>
      </div>
    </div>
  );
}
