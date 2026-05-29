import React from 'react';
import { Download, Copy, RefreshCcw, FileCheck } from 'lucide-react';

const LetterPreview = ({ data, onReset }) => {
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getActs = () => {
    if (data.incidentType === 'account_hack') return 'Section 43, 66 and 66C of the Information Technology Act, 2000';
    if (data.incidentType === 'online_fraud') return 'Section 420 of the Indian Penal Code (IPC) read with Section 66D of the Information Technology Act, 2000';
    if (data.incidentType === 'identity_theft') return 'Section 66C and 66D of the Information Technology Act, 2000';
    return 'relevant provisions of the Information Technology Act, 2000';
  };

  const getCompanyAddress = () => {
    const addresses = {
      instagram: 'Legal Department,\nMeta Platforms, Inc.\nvia Meta India Legal Cell',
      facebook: 'Legal Department,\nMeta Platforms, Inc.\nvia Meta India Legal Cell',
      whatsapp: 'Legal Department,\nMeta Platforms, Inc.\nvia Meta India Legal Cell',
      snapchat: 'Legal Department,\nSnap Inc.',
      googlepay: 'GPay Compliance Team,\nGoogle India Digital Services Private Limited',
      phonepe: 'Legal & Compliance Cell,\nPhonePe Private Limited',
      amazon: 'Amazon.com, Inc.\nLegal & Compliance Dept.'
    };
    return addresses[data.company] || `${data.company.toUpperCase()} Legal Dept.`;
  };

  const copyToClipboard = () => {
    const text = document.getElementById('letter-content').innerText;
    navigator.clipboard.writeText(text);
    alert('Letter copied to clipboard!');
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCheck color="var(--accent)" />
          Official Letter Preview
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="official-btn" style={{ background: '#2d3748' }} onClick={onReset}>
            <RefreshCcw size={18} /> New Letter
          </button>
          <button className="official-btn" style={{ background: '#2d3748' }} onClick={copyToClipboard}>
            <Copy size={18} /> Copy Text
          </button>
          <button className="official-btn" onClick={() => window.print()}>
            <Download size={18} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div id="letter-content" className="letter-paper">
        <div className="letter-header">
          {data.policeStationName && (
            <div style={{ marginBottom: '1rem', borderBottom: '2px solid #2d3748', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, textTransform: 'uppercase' }}>{data.policeStationName}</h2>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{data.policeDepartment}</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{data.officeAddress}</p>
            </div>
          )}
          <h3 style={{ margin: '1rem 0 0 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Formal Investigation Request / Notice</h3>
          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', fontSize: '0.85rem' }}>Under Sec. 94 Cr.P.C / BNSS 2023 & IT Act, 2000</p>
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>To,</strong><br />
            {getCompanyAddress().split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Date:</strong> {today}<br />
            <strong>Ref No:</strong> CYB/{new Date().getFullYear()}/{(Math.random() * 1000).toFixed(0)}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <strong>Subject:</strong> Formal Investigation regarding {data.incidentType.replace('_', ' ').toUpperCase()} under {getActs()}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          Dear Legal Team / Compliance Officer,
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
          This is to bring to your notice that an investigation is being conducted regarding a cybercrime complaint filed by <strong>{data.victimName}</strong>. 
          The incident involves <strong>{data.incidentType.replace('_', ' ')}</strong> that occurred on your platform.
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
          <strong>Case Details:</strong><br />
          The incident was reported on <strong>{data.incidentDate}</strong>. 
          The associated account handle/profile or ID is <strong>{data.accountHandle}</strong>.
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
          <strong>Description of Investigation:</strong><br />
          {data.description}
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
          <strong>Legal Provision:</strong><br />
          This request is issued under <strong>{getActs()}</strong> and relevant provisions of the **BNSS / Cr.P.C**. Intermediaries are legally obligated to provide information and preserve evidence for law enforcement purposes.
        </div>

        <div style={{ marginBottom: '2rem', textAlign: 'justify' }}>
          <strong>Required Actions:</strong><br />
          1. Provide registration details, IP logs, and login history for the mentioned account.<br />
          2. Immediately preserve all data associated with this profile/activity.<br />
          3. Block/Deactivate the fraudulent profile to prevent further misuse.
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            (Official Seal)
          </div>
          <div style={{ textAlign: 'right' }}>
            <br /><br />
            __________________________<br />
            <strong>{data.officerName || '(Investigating Officer)'}</strong><br />
            {data.officerRank}<br />
            {data.policeStationName}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '2rem', paddingTop: '1rem', fontSize: '0.75rem', color: '#718096', textAlign: 'center' }}>
          This is an official communication from a Law Enforcement Agency. Please treat this with utmost urgency.
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .official-btn, h2, .glass-card { display: none !important; }
          .letter-paper { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
          #root { padding: 0 !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LetterPreview;
