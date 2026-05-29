import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  FileText, 
  Calendar, 
  Printer, 
  Download, 
  RefreshCw,
  Building,
  AlertTriangle,
  ChevronRight,
  Info
} from 'lucide-react';

const PoliceNoticeTemplate = () => {
  const [formData, setFormData] = useState({
    // Police Station Details
    psName: '[POLICE STATION NAME]',
    departmentName: 'CYBER CELL / POLICE DEPARTMENT NAME',
    officeAddress: '[FULL OFFICE ADDRESS]',
    cityStatePin: '[CITY, STATE, PIN CODE]',
    phone: '[PHONE NUMBER]',
    email: '[OFFICIAL EMAIL]',
    secondaryEmail: '[SECOND EMAIL]',
    
    // Legal Provision
    legalProvision: 'Under Section 94 Cr.P.C / BNSS 2023',
    
    // Recipient Details
    companyName: '[COMPANY NAME]',
    companyAddress: '[COMPANY ADDRESS]',
    country: '[COUNTRY]',
    
    // Case Details
    complaintNumber: '[Complaint Number]',
    firNumber: '[FIR Number]',
    victimName: '[Victim Name]',
    accusedName: '[Accused/Fake Profile Name]',
    platformName: '[Platform Name]',
    profileUrl: '[Profile URL]',
    currentDate: new Date().toLocaleDateString('en-IN'),
    
    // Officer Details
    officerName: '[OFFICER NAME]',
    officerRank: '[RANK]',
    stateName: '[STATE NAME]',
  });

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="police-notice-container">
      <div className="tool-header">
        <div className="title-section">
          <Shield className="text-accent" size={32} />
          <div>
            <h2>Police Notice Generator</h2>
            <p>Official Law Enforcement Investigation Template</p>
          </div>
        </div>
        <div className="action-buttons no-print">
          <button 
            className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <FileText size={18} /> Edit Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Shield size={18} /> Preview Notice
          </button>
          <button className="official-btn" onClick={printDocument}>
            <Printer size={18} /> Print Notice
          </button>
        </div>
      </div>

      <div className={`main-layout ${activeTab}`}>
        {/* Editor Side */}
        <div className="editor-pane no-print">
          <div className="form-section">
            <h3 className="section-title"><Building size={16} /> Police Station Information</h3>
            <div className="input-grid">
              <div className="input-group">
                <label>Police Station Name</label>
                <input name="psName" value={formData.psName} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Department Name</label>
                <input name="departmentName" value={formData.departmentName} onChange={handleInputChange} />
              </div>
              <div className="input-group full-width">
                <label>Office Address</label>
                <input name="officeAddress" value={formData.officeAddress} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>City, State, Pin</label>
                <input name="cityStatePin" value={formData.cityStatePin} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Official Email</label>
                <input name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Secondary Email</label>
                <input name="secondaryEmail" value={formData.secondaryEmail} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><User size={16} /> Case & Recipient Details</h3>
            <div className="input-grid">
              <div className="input-group">
                <label>Company Name</label>
                <input name="companyName" value={formData.companyName} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Company Country</label>
                <input name="country" value={formData.country} onChange={handleInputChange} />
              </div>
              <div className="input-group full-width">
                <label>Company Address</label>
                <input name="companyAddress" value={formData.companyAddress} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Complaint/FIR Number</label>
                <input name="complaintNumber" value={formData.complaintNumber} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Victim Name</label>
                <input name="victimName" value={formData.victimName} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Platform (e.g. Meta, X)</label>
                <input name="platformName" value={formData.platformName} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Profile URL/Handle</label>
                <input name="profileUrl" value={formData.profileUrl} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><AlertTriangle size={16} /> Officer & Legal Info</h3>
            <div className="input-grid">
              <div className="input-group">
                <label>Officer Name</label>
                <input name="officerName" value={formData.officerName} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Rank/Designation</label>
                <input name="officerRank" value={formData.officerRank} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>State Name</label>
                <input name="stateName" value={formData.stateName} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Legal Provision</label>
                <select name="legalProvision" value={formData.legalProvision} onChange={handleInputChange}>
                  <option value="Under Section 94 Cr.P.C / BNSS 2023">Under Section 94 Cr.P.C / BNSS 2023</option>
                  <option value="Under Section 91 Cr.P.C">Under Section 91 Cr.P.C</option>
                  <option value="Under Section 102 BNSS">Under Section 102 BNSS</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className="preview-pane">
          <div className="letter-paper official-notice">
            <div className="notice-header">
              <div className="emblem-placeholder">
                {/* Visual placeholder for Ashoka Emblem */}
                <div className="emblem-circle">
                  <Shield size={40} />
                </div>
              </div>
              <div className="header-text">
                <h1 className="ps-name">{formData.psName}</h1>
                <h2 className="dept-name">{formData.departmentName}</h2>
                <p className="address-line">{formData.officeAddress}</p>
                <p className="address-line">{formData.cityStatePin}</p>
                <p className="contact-line">Phone No.: {formData.phone} | Email: {formData.email}</p>
                {formData.secondaryEmail && <p className="contact-line">Addl. Email: {formData.secondaryEmail}</p>}
              </div>
            </div>

            <div className="notice-body">
              <div className="legal-citation">
                ({formData.legalProvision})
              </div>

              <div className="recipient-info">
                <strong>To,</strong><br />
                {formData.companyName}<br />
                {formData.companyAddress}<br />
                {formData.country}
              </div>

              <div className="subject-line">
                <strong>Subject: Request for Information / Blocking of Social Media Account in Cyber Crime Investigation</strong>
              </div>

              <div className="content-paragraphs">
                <p>
                  This is to inform you that the {formData.psName} is a Law Enforcement Agency under the Government of India, 
                  responsible for investigating cyber-related offenses.
                </p>

                <p>
                  A formal investigation/inquiry is currently being conducted regarding a cybercrime complaint 
                  (Complaint No: <strong>{formData.complaintNumber}</strong> / FIR No: <strong>{formData.firNumber}</strong>). 
                  The complaint has been lodged by <strong>{formData.victimName}</strong>.
                </p>

                <p>
                  Preliminary investigation reveals that the accused/suspect using the name/handle <strong>{formData.accusedName}</strong> 
                  on your platform (<strong>{formData.platformName}</strong>) has allegedly created or used a fake online profile/account 
                  (URL: <strong>{formData.profileUrl}</strong>) for the purpose of impersonation, hacking, identity theft, or online fraud.
                </p>

                <p>
                  These acts are punishable under <strong>Section 66 and Section 66-C of the Information Technology Act</strong>, 
                  read with relevant provisions of the <strong>BNSS / Cr.P.C</strong>.
                </p>

                <p>
                  In view of the above, you are hereby requested to provide the following details associated with the aforementioned account/profile:
                </p>

                <ol className="request-list">
                  <li>Registration details of the account (Name, Date of Creation, etc.)</li>
                  <li>Access details and login history</li>
                  <li>IP login logs with date, time, and timezone</li>
                  <li>Registered mobile number used for the account</li>
                  <li>Registered email address</li>
                  <li>Any linked recovery information or alternative contact methods</li>
                </ol>

                <p>
                  Furthermore, it is requested that you <strong>immediately preserve all data</strong> related to this account 
                  for the last 180 days and <strong>block/deactivate</strong> the fraudulent profile if required to prevent further misuse.
                </p>

                <p className="closing-statement">
                  Looking forward to receiving the relevant information at the earliest for investigation purposes.
                </p>
              </div>

              <div className="signature-block">
                <div className="signature-space">
                  {/* Space for manual signature */}
                </div>
                <div className="officer-details">
                  <strong>{formData.officerName}</strong><br />
                  {formData.officerRank}<br />
                  {formData.psName}<br />
                  {formData.stateName}, India<br />
                  Date: {formData.currentDate}
                </div>
              </div>
            </div>
            
            <div className="footer-seal">
              <div className="seal-placeholder">
                OFFICIAL SEAL
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .police-notice-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          color: white;
        }

        .tool-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 1rem;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .title-section h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .title-section p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .tab-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: var(--primary);
          border-color: var(--primary);
        }

        .main-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .main-layout.preview .editor-pane {
          display: none;
        }

        .main-layout.preview {
          grid-template-columns: 1fr;
        }

        .editor-pane {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-section {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .section-title {
          margin: 0 0 1.25rem 0;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent);
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.75rem;
        }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .full-width {
          grid-column: span 2;
        }

        .official-notice {
          font-family: 'Times New Roman', Times, serif !important;
          color: #000 !important;
          background: #fff !important;
          padding: 3rem !important;
          line-height: 1.5 !important;
        }

        .notice-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .emblem-circle {
          width: 80px;
          height: 80px;
          border: 2px solid #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .ps-name {
          font-size: 1.5rem;
          text-transform: uppercase;
          margin: 0;
          font-weight: bold;
        }

        .dept-name {
          font-size: 1.2rem;
          margin: 0.25rem 0;
          font-weight: bold;
        }

        .address-line {
          margin: 0;
          font-size: 1rem;
        }

        .contact-line {
          margin: 0;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .legal-citation {
          text-align: center;
          font-weight: bold;
          margin-bottom: 2rem;
          text-decoration: underline;
        }

        .recipient-info {
          margin-bottom: 2rem;
        }

        .subject-line {
          margin-bottom: 2rem;
          text-align: justify;
        }

        .content-paragraphs p {
          margin-bottom: 1rem;
          text-align: justify;
        }

        .request-list {
          margin-bottom: 1.5rem;
        }

        .signature-block {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .signature-space {
          height: 60px;
          width: 200px;
        }

        .officer-details {
          text-align: right;
        }

        .footer-seal {
          margin-top: 2rem;
        }

        .seal-placeholder {
          width: 120px;
          height: 120px;
          border: 1px dashed #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ccc;
          font-size: 0.75rem;
          border-radius: 50%;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .police-notice-container {
            display: block;
          }
          .main-layout {
            display: block;
          }
          .preview-pane {
            width: 100%;
          }
          .official-notice {
            box-shadow: none !important;
            padding: 0 !important;
          }
        }

        @media (max-width: 1024px) {
          .main-layout {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
};

export default PoliceNoticeTemplate;
