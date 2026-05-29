import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Globe, 
  MessageSquare, 
  Phone, 
  CreditCard, 
  ShieldAlert, 
  FileText, 
  Send, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  BadgeInfo,
  ShoppingBag,
  Scale,
  Zap,
  Building,
  Cpu,
  Mail,
  Shield,
  Gamepad2,
  MoreHorizontal
} from 'lucide-react';

const defaultCompanies = [
  { id: 'instagram', name: 'Instagram', icon: <Camera size={20} />, address: 'Legal Department, Meta Platforms, Inc.' },
  { id: 'facebook', name: 'Facebook', icon: <Globe size={20} />, address: 'Legal Department, Meta Platforms, Inc.' },
  { id: 'whatsapp', name: 'WhatsApp', icon: <MessageSquare size={20} />, address: 'Legal Department, Meta Platforms, Inc.' },
  { id: 'snapchat', name: 'Snapchat', icon: <MessageSquare size={20} />, address: 'Legal Department, Snap Inc.' },
  { id: 'googlepay', name: 'Google Pay', icon: <CreditCard size={20} />, address: 'GPay Support, Google India Pvt Ltd.' },
  { id: 'phonepe', name: 'PhonePe', icon: <Phone size={20} />, address: 'PhonePe Private Limited, Legal Cell.' },
  { id: 'amazon', name: 'Amazon', icon: <ShoppingBag size={20} />, address: 'Amazon.com, Inc. Legal Dept.' },
];

const incidentTypes = [
  { 
    id: 'account_hack', 
    name: 'Social Media Hacking', 
    acts: ['Section 43 IT Act', 'Section 66 IT Act', 'Section 66C IT Act', 'Section 111 BNS', 'Section 94 BNSS'],
    description: 'Unauthorized access to social media accounts or profile hijacking.'
  },
  { 
    id: 'financial_fraud', 
    name: 'UPI / Banking Fraud', 
    acts: ['Section 318(4) BNS', 'Section 66D IT Act', 'Section 318(2) BNS', 'Section 94 BNSS'],
    description: 'Fraudulent transactions via UPI, Credit/Debit cards or Net Banking.'
  },
  { 
    id: 'sextortion', 
    name: 'Sextortion / Morphing', 
    acts: ['Section 66E IT Act', 'Section 67 IT Act', 'Section 67A IT Act', 'Section 74 BNS', 'Section 94 BNSS'],
    description: 'Threatening with private photos or sharing morphed/obscene content.'
  },
  { 
    id: 'cyber_stalking', 
    name: 'Cyber Stalking / Bullying', 
    acts: ['Section 78 BNS', 'Section 66 IT Act', 'Section 67 IT Act', 'Section 94 BNSS'],
    description: 'Repeated harassment, monitoring, or threatening via digital platforms.'
  },
  { 
    id: 'job_fraud', 
    name: 'Job / Investment Fraud', 
    acts: ['Section 318(4) BNS', 'Section 61(2) BNS', 'Section 66D IT Act', 'Section 94 BNSS'],
    description: 'Fake job offers, part-time work scams, or crypto investment fraud.'
  },
  { 
    id: 'csam', 
    name: 'CSAM / Child Pornography', 
    acts: ['Section 67B IT Act', 'POCSO Act 2012', 'Section 67 IT Act', 'Section 94 BNSS'],
    description: 'Creation, storage, or distribution of child sexual abuse material.'
  },
  { 
    id: 'data_breach', 
    name: 'Data Breach / Theft', 
    acts: ['Section 43 IT Act', 'Section 66 IT Act', 'Section 72 IT Act', 'Section 94 BNSS'],
    description: 'Unauthorized access to databases, source code theft, or data exfiltration.'
  },
  { 
    id: 'identity_theft', 
    name: 'Identity Theft', 
    acts: ['Section 66C IT Act', 'Section 66D IT Act', 'Section 318(2) BNS', 'Section 94 BNSS'],
    description: 'Misusing Aadhaar, Pan, or personal documents for fraudulent purposes.'
  },
  { 
    id: 'ecommerce_fraud', 
    name: 'E-commerce / OLX Fraud', 
    acts: ['Section 318(4) BNS', 'Section 318(2) BNS', 'Section 66D IT Act', 'Section 94 BNSS'],
    description: 'Fraudulent listings, courier scams, or QR code scams on marketplace apps.'
  }
];

const templates = [
  { id: 'standard', name: 'Standard Cyber Crime Notice', icon: <FileText size={18} /> },
  { id: 'emergency', name: 'Emergency Data Preservation Request', icon: <Zap size={18} /> },
  { id: 'banking', name: 'Banking/UPI Fraud Investigation Notice', icon: <CreditCard size={18} /> },
  { id: 'social', name: 'Social Media Account/Takedown Request', icon: <ShieldAlert size={18} /> }
];

const LetterDraft = ({ onGenerate, initialPlatform }) => {
  const [step, setStep] = useState(1);
  const [selectableCompanies, setSelectableCompanies] = useState(defaultCompanies);
  const [formData, setFormData] = useState({
    company: '',
    template: 'standard',
    incidentType: '',
    legalSections: [],
    victimName: '',
    victimContact: '',
    victimAddress: '',
    incidentDate: '',
    incidentTime: '',
    description: '',
    firNumber: '',
    complaintNumber: '',
    suspectName: '',
    accountHandle: '',
    
    // Police Details
    policeStationName: '',
    policeDepartment: 'Cyber Crime Police Station',
    officeAddress: '',
    pinCode: '',
    officerName: '',
    officerRank: '',
    contactNumber: '',
    email1: '',
    email2: '',
  });

  const bankingApps = ['googlepay', 'phonepe', 'paytm', 'bhim', 'paypal', 'sbi', 'hdfc', 'icici', 'axisbank'];
  const socialApps = ['instagram', 'facebook', 'whatsapp', 'telegram', 'snapchat', 'xtwitter', 'linkedin', 'youtube', 'discord', 'threads', 'x', 'twitter'];
  const shoppingApps = ['amazon', 'flipkart', 'myntra', 'meesho', 'ajio', 'olx', 'quikr', 'alibaba'];
  const cloudApps = ['google', 'gmail', 'outlook', 'yahoo', 'microsoft', 'icloud', 'dropbox', 'onedrive'];
  const gamingApps = ['pubg', 'freefire', 'steam', 'epicgames', 'netflix', 'spotify'];

  useEffect(() => {
    if (initialPlatform) {
      const compId = initialPlatform.toLowerCase().replace(/[^a-z0-9]/g, '');
      const compExists = defaultCompanies.some(c => c.id === compId);
      
      if (!compExists) {
        let icon = <Globe size={20} />;
        if (bankingApps.includes(compId)) {
          icon = <CreditCard size={20} />;
        } else if (shoppingApps.includes(compId)) {
          icon = <ShoppingBag size={20} />;
        } else if (cloudApps.includes(compId)) {
          icon = <Mail size={20} />;
        } else if (gamingApps.includes(compId)) {
          icon = <Gamepad2 size={20} />;
        } else {
          icon = <MoreHorizontal size={20} />;
        }
        const newComp = {
          id: compId,
          name: initialPlatform,
          icon: icon,
          address: 'Legal Department'
        };
        setSelectableCompanies([...defaultCompanies, newComp]);
      }

      // Auto pre-selection logic
      let preselectedTemplate = 'standard';
      let preselectedIncident = '';

      if (bankingApps.includes(compId)) {
        preselectedTemplate = 'banking';
        preselectedIncident = 'financial_fraud';
      } else if (socialApps.includes(compId)) {
        preselectedTemplate = 'social';
        preselectedIncident = 'account_hack';
      } else if (shoppingApps.includes(compId)) {
        preselectedTemplate = 'standard';
        preselectedIncident = 'ecommerce_fraud';
      } else if (cloudApps.includes(compId)) {
        preselectedTemplate = 'standard';
        preselectedIncident = 'data_breach';
      } else if (gamingApps.includes(compId)) {
        preselectedTemplate = 'standard';
        preselectedIncident = 'account_hack';
      } else {
        // Fallback for custom platforms / others
        preselectedTemplate = 'standard';
        preselectedIncident = 'identity_theft';
      }

      let acts = [];
      if (preselectedIncident) {
        const match = incidentTypes.find(i => i.id === preselectedIncident);
        if (match) acts = match.acts;
      }

      setFormData(prev => ({ 
        ...prev, 
        company: compId,
        template: preselectedTemplate,
        incidentType: preselectedIncident,
        legalSections: acts
      }));
      setStep(2);
    }
  }, [initialPlatform]);

  useEffect(() => {
    if (formData.incidentType) {
      const selected = incidentTypes.find(i => i.id === formData.incidentType);
      if (selected) {
        setFormData(prev => ({ ...prev, legalSections: selected.acts }));
      }
    }
  }, [formData.incidentType]);

  const handleInputChange = (e, val) => {
    if (typeof e === 'string') {
      setFormData(prev => ({ ...prev, [e]: val }));
    } else {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleLegalSection = (act) => {
    setFormData(prev => ({
      ...prev,
      legalSections: prev.legalSections.includes(act)
        ? prev.legalSections.filter(a => a !== act)
        : [...prev.legalSections, act]
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 2 && initialPlatform) setStep(1);
    else setStep(s => s - 1);
  };

  return (
    <div className="glass-card">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Scale className="text-blue-500" />
            Letter Drafting Wizard
          </h2>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Step {step} of 5 // SECURE_ACCESS</p>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map(s => (
            <div 
              key={s} 
              className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Step 1: Select Platform</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {selectableCompanies.map(company => (
                <div 
                  key={company.id}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${formData.company === company.id ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'}`}
                  onClick={() => setFormData(prev => ({ ...prev, company: company.id }))}
                >
                  <div className={`p-3 rounded-xl mb-3 ${formData.company === company.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {company.icon}
                  </div>
                  <span className="text-sm font-bold">{company.name}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button className="official-btn" onClick={nextStep} disabled={!formData.company}>
                Next Step <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Step 2: Letter Template & Crime Type</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Select Notice Type</label>
                <div className="space-y-2">
                  {templates.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => setFormData(prev => ({ ...prev, template: t.id }))}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${formData.template === t.id ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900/40 border-slate-800'}`}
                    >
                      <div className={formData.template === t.id ? 'text-blue-400' : 'text-slate-500'}>{t.icon}</div>
                      <span className="text-sm font-bold">{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Incident Classification</label>
                <div className="space-y-2">
                  {incidentTypes.map(type => (
                    <div 
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, incidentType: type.id }))}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${formData.incidentType === type.id ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900/40 border-slate-800'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold">{type.name}</span>
                        {formData.incidentType === type.id && <CheckCircle size={16} className="text-blue-500" />}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button className="official-btn bg-transparent border border-slate-700" onClick={prevStep}>
                <ArrowLeft size={18} /> Back
              </button>
              <button className="official-btn" onClick={nextStep} disabled={!formData.incidentType}>
                Next Step <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Step 3: Confirm Legal Sections</h3>
            <div className="grid md:grid-cols-1 gap-4">
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-4 italic">Select the legal provisions to be cited in the final notice:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Section 43 IT Act', 'Section 66 IT Act', 'Section 66C IT Act', 'Section 66D IT Act', 
                    'Section 66E IT Act', 'Section 67 IT Act', 'Section 67A IT Act', 'Section 67B IT Act',
                    'Section 72 IT Act',
                    'Section 318(4) BNS', 'Section 318(2) BNS', 'Section 61(2) BNS',
                    'Section 74 BNS', 'Section 78 BNS', 'Section 111 BNS',
                    'Section 94 BNSS', 'Section 97 BNSS', 'Section 102 BNSS', 'Section 165 BNSS',
                    'POCSO Act 2012'
                  ].map(act => (
                    <button 
                      key={act}
                      onClick={() => toggleLegalSection(act)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${formData.legalSections.includes(act) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button className="official-btn bg-transparent border border-slate-700" onClick={prevStep}>
                <ArrowLeft size={18} /> Back
              </button>
              <button className="official-btn" onClick={nextStep}>
                Next Step <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Step 4: Identification & Authority</h3>
              <User size={18} className="text-blue-500/50" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Victim Details */}
              <div className="space-y-4">
                <div className="text-[10px] text-blue-500 font-black tracking-widest uppercase mb-2">Complainant Information</div>
                <div className="input-group">
                  <label><User size={12} /> Full Name</label>
                  <input name="victimName" value={formData.victimName} onChange={handleInputChange} placeholder="Victim Name" />
                </div>
                <div className="input-group">
                  <label><BadgeInfo size={12} /> FIR / NCRP ID</label>
                  <input name="firNumber" value={formData.firNumber} onChange={handleInputChange} placeholder="Case Reference" />
                </div>
              </div>

              {/* Officer Details */}
              <div className="space-y-4">
                <div className="text-[10px] text-blue-500 font-black tracking-widest uppercase mb-2">Investigating Officer</div>
                <div className="input-group">
                  <label><User size={12} /> Officer Name</label>
                  <input name="officerName" value={formData.officerName} onChange={handleInputChange} placeholder="Name" />
                </div>
                <div className="input-group">
                  <label><Shield size={12} /> Rank</label>
                  <input name="officerRank" value={formData.officerRank} onChange={handleInputChange} placeholder="e.g. SHO, Inspector" />
                </div>
              </div>

              {/* Suspect / Target Details based on Notice Type */}
              <div className="md:col-span-2 border-t border-slate-800/50 pt-6 space-y-4">
                {formData.template === 'banking' ? (
                  <>
                    <div className="text-[10px] text-blue-500 font-black tracking-widest uppercase mb-2">Suspect Bank / Account Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label><CreditCard size={12} /> Suspect Account Number</label>
                        <input name="accountHandle" value={formData.accountHandle} onChange={handleInputChange} placeholder="Suspect Account Number" />
                      </div>
                      <div className="input-group">
                        <label><User size={12} /> Suspect Account Holder Name (If Known)</label>
                        <input name="suspectName" value={formData.suspectName} onChange={handleInputChange} placeholder="Suspect Account Holder Name" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[10px] text-blue-500 font-black tracking-widest uppercase mb-2">Suspect Profile / Target Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label><MessageSquare size={12} /> Profile Username / ID / Link</label>
                        <input name="accountHandle" value={formData.accountHandle} onChange={handleInputChange} placeholder="e.g. @suspect_username or profile link" />
                      </div>
                      <div className="input-group">
                        <label><User size={12} /> Suspect Name / Handle Name (If Known)</label>
                        <input name="suspectName" value={formData.suspectName} onChange={handleInputChange} placeholder="Suspect Name" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Station Details - Full Width */}
              <div className="md:col-span-2 border-t border-slate-800/50 pt-6 space-y-5">
                <div className="text-[10px] text-blue-500 font-black tracking-widest uppercase mb-2">Police Station / Office Details</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="input-group md:col-span-2">
                    <label><Building size={12} /> Station Name</label>
                    <input name="policeStationName" value={formData.policeStationName} onChange={handleInputChange} placeholder="e.g. Cyber Crime Police Station, Bhopal" />
                  </div>
                  
                  <div className="input-group">
                    <label><MapPin size={12} /> Full Address</label>
                    <input name="officeAddress" value={formData.officeAddress} onChange={handleInputChange} placeholder="Street, Area, Building" />
                  </div>
                  
                  <div className="input-group">
                    <label><MapPin size={12} /> Pin Code</label>
                    <input name="pinCode" value={formData.pinCode} onChange={handleInputChange} placeholder="462003" />
                  </div>

                  <div className="input-group">
                    <label><Phone size={12} /> Landline / Contact No.</label>
                    <input name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="+91-755-XXXXXXX" />
                  </div>

                  <div className="input-group">
                    <label><Mail size={12} /> Primary Email</label>
                    <input name="email1" value={formData.email1} onChange={handleInputChange} placeholder="official@mppolice.gov.in" />
                  </div>

                  <div className="input-group md:col-span-2">
                    <label><Mail size={12} /> Secondary Email (Optional)</label>
                    <input name="email2" value={formData.email2} onChange={handleInputChange} placeholder="backup@mppolice.gov.in" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button className="official-btn bg-transparent border border-slate-700" onClick={prevStep}>
                <ArrowLeft size={18} /> Back
              </button>
              <button className="official-btn" onClick={nextStep} disabled={!formData.victimName || !formData.policeStationName}>
                Next: Write Description <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center justify-between border-b border-blue-500/10 pb-4 mb-2">
              <div>
                <h3 className="text-slate-200 font-bold uppercase text-sm tracking-widest">Step 5: Incident Description</h3>
                <p className="text-[10px] text-slate-500 mt-1">AUTO-GENERATION WILL START AFTER THIS STEP</p>
              </div>
              <Cpu size={20} className="text-blue-500/50" />
            </div>
            
            <div className="input-group">
              <label className="text-blue-400 font-black uppercase text-[9px] mb-2 block tracking-widest">
                Describe the crime (Transaction IDs, URLs, Handles, etc.)
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={12}
                className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-2xl p-6 text-sm leading-relaxed text-slate-100 outline-none focus:border-blue-600 focus:bg-slate-900 transition-all placeholder:text-slate-700"
                placeholder="Enter complete incident description... Detects URLs, IDs, Phones automatically."
              />
            </div>

            <div className="flex justify-between pt-4">
              <button className="official-btn bg-transparent border border-slate-700" onClick={prevStep}>
                <ArrowLeft size={18} /> Back
              </button>
              <button className="official-btn bg-blue-600 shadow-lg shadow-blue-900/40" onClick={() => onGenerate(formData)} disabled={!formData.description}>
                GENERATE FINAL LETTER <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LetterDraft;
