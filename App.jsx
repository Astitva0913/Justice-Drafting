import React, { useState } from 'react';
import LetterDraft from './components/LetterDraft';
import LetterEditor from './components/LetterEditor';
import Dashboard from './pages/Dashboard';
 import PoliceNoticeTemplate from './components/PoliceNoticeTemplate';
import AdminPanel from './pages/AdminPanel';
import Auth, { SESSION_KEY } from './components/Auth';
import { Scale, ShieldCheck, FileText, Shield, Home, LogOut, User, ShieldAlert } from 'lucide-react';

function App() {
  const [draftData, setDraftData] = useState(null);
  const [activeTool, setActiveTool] = useState('dashboard');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  });

  const handleGenerate = (data) => {
    setDraftData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setDraftData(null);
    setSelectedPlatform(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setDraftData(null);
    setSelectedPlatform(null);
    setActiveTool('dashboard');
  };

  if (!currentUser) {
    return <Auth onAuth={(user) => setCurrentUser(user)} />;
  }

  const selectPlatform = (platform) => {
    setSelectedPlatform(platform);
    setActiveTool('complaint');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App min-h-screen bg-[#020617]">
      {/* Global Navigation - Only show if not on Dashboard or when printing */}
      {activeTool !== 'dashboard' && (
        <header className="no-print" style={{ textAlign: 'center', padding: '2rem 0', marginBottom: '1rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Scale size={32} className="text-blue-500" />
            <h1 style={{ fontSize: '1.75rem', margin: 0, letterSpacing: '-1px', color: 'white' }}>
              Justice<span style={{ color: 'var(--primary)' }}>Draft</span>
            </h1>
          </div>

          <div className="tool-selector">
            <button 
              className={`tool-btn ${activeTool === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTool('dashboard'); handleReset(); }}
            >
              <Home size={18} /> Home
            </button>
            <button 
              className={`tool-btn ${activeTool === 'complaint' ? 'active' : ''}`}
              onClick={() => { setActiveTool('complaint'); }}
            >
              <FileText size={18} /> Letter Drafting
            </button>
            <button 
              className={`tool-btn ${activeTool === 'notice' ? 'active' : ''}`}
              onClick={() => { setActiveTool('notice'); handleReset(); }}
            >
              <Shield size={18} /> Notice Generator
            </button>
            {currentUser.role === 'admin' && (
              <button
                className={`tool-btn ${activeTool === 'admin' ? 'active' : ''}`}
                onClick={() => { setActiveTool('admin'); handleReset(); }}
                style={activeTool === 'admin' ? {} : { color: '#f87171', borderColor: '#ef444430' }}
              >
                <ShieldAlert size={18} /> Admin Panel
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(30,41,59,0.6)', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '0.4rem 0.9rem' }}>
              <User size={14} color="#3b82f6" />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>{currentUser.fullName}</span>
              <span style={{ fontSize: '0.7rem', color: '#475569' }}>@{currentUser.username}</span>
            </div>
            <button className="tool-btn" onClick={handleLogout} style={{ color: '#ef4444', borderColor: '#ef444430' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
      )}

      <main style={{ 
        maxWidth: activeTool === 'dashboard' || activeTool === 'admin' ? '100%' : '1200px', 
        margin: '0 auto',
        padding: activeTool === 'dashboard' || activeTool === 'admin' ? '0' : '0 1.5rem 5rem 1.5rem'
      }}>
        {activeTool === 'dashboard' ? (
          <Dashboard onSelectPlatform={selectPlatform} />
        ) : activeTool === 'admin' ? (
          <AdminPanel />
        ) : activeTool === 'notice' ? (
          <PoliceNoticeTemplate />
        ) : (
          !draftData ? (
            <LetterDraft onGenerate={handleGenerate} initialPlatform={selectedPlatform} />
          ) : (
            <LetterEditor data={draftData} onReset={handleReset} />
          )
        )}
      </main>

      {activeTool !== 'dashboard' && (
        <footer className="no-print" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', background: '#020617' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span className="text-sm font-semibold tracking-wide">EMPOWERING JUSTICE THROUGH DIGITAL PRECISION</span>
          </div>
          <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>
            Official Law Enforcement Assistance Portal. Optimized for Indian Legal Statutes (IT Act 2000, BNSS 2023).
          </p>
        </footer>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary: #2563eb;
          --primary-hover: #1d4ed8;
          --accent: #3b82f6;
          --border: #1e293b;
          --text-muted: #94a3b8;
        }

        .tool-selector {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          padding: 0 1rem;
        }

        .tool-btn {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid var(--border);
          color: #94a3b8;
          padding: 0.6rem 1.2rem;
          border-radius: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tool-btn:hover {
          background: rgba(30, 41, 59, 0.8);
          color: white;
          border-color: var(--accent);
        }

        .tool-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.2);
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .App, body, html {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          main {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Fix for dark backgrounds in nested divs */
          div, section, main, header, footer {
            background: transparent !important;
            box-shadow: none !important;
            border-color: transparent !important;
          }
        }
      `}} />
    </div>
  );
}

export default App;


