import React, { useState, useEffect, useRef } from 'react';
import LetterPreview from './LetterPreview';
import { 
  Download, 
  Copy, 
  RefreshCcw, 
  FileCheck, 
  Edit3, 
  Eye, 
  Printer, 
  Save, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Layout,
  Type,
  User,
  Shield,
  Building,
  FileText,
  AlertCircle,
  Lock,
  ShoppingBag,
  Zap,
  Mail,
  Phone,
  MapPin,
  Cpu,
  History,
  Check
} from 'lucide-react';

const LetterEditor = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [logoUrl, setLogoUrl] = useState('/mp_cyber_police_logo.png');
  const [letterContent, setLetterContent] = useState({
    subject: '',
    header: {
      psName: 'Cyber & Hi-Tech Crime Police Station, Bhopal (M.P)',
      department: 'State Cyber Police, Depot Squre, Bhadhbhada Road,',
      address: 'Bhopal, Pin Code 462003 (M.P.) India',
      phone: '+91-755-2779510',
      email: 'tc.cybercell@mppolice.gov.in',
      email2: 'insp-cybercell@mppolice.gov.in'
    },
    referenceLine: '(Under Section 94 BNSS)',
    recipient: {
      company: '',
      address: ''
    },
    mandatoryPara: "Cyber Crime Police Station is a Law Enforcement Agency Home Department of Madhya Pradesh, State of India similar to federal investigation of America.",
    bodySegments: [],
    requests: [],
    legalSections: [],
    officer: {
      name: '',
      rank: 'SHO',
      badge: 'MP-POLICE'
    },
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    refNo: `CYB/MP/${new Date().getFullYear()}/${(Math.random() * 1000).toFixed(0)}`,
    bankDetails: { accountNo: '................', name: '................' }
  });

  // Legal Content Mapping
  const PROCEDURAL_MAPPING = {
    'Section 94 BNSS': 'Section 94 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, empowers courts or police officers in charge to issue a summons or written order to any person to produce a document or thing necessary for an investigation, inquiry, or trial.',
    'Section 97 BNSS': 'Section 97 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, relates to the search of a place suspected to contain stolen property, forged documents, etc., and provides the legal basis for demanding evidence from relevant entities.',
    'Section 102 BNSS': 'Section 102 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, provides the power of police officers to seize certain property, especially those suspected to have been stolen or found under circumstances which create suspicion of the commission of any offence.',
    'Section 165 BNSS': 'Section 165 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, pertains to the power of a police officer to conduct a search during an investigation when there are reasonable grounds to believe that something necessary for the investigation may be found.',
  };

  const PUNITIVE_MAPPING = {
    'Section 66 IT Act': 'Section 66 of the IT Act deals with computer-related offences, providing punishment for any person who dishonestly or fraudulently does any act referred to in section 43.',
    'Section 66C IT Act': 'Section 66C of the IT Act provides punishment for identity theft, specifically the fraudulent use of electronic signatures, passwords, or unique identification features of another person.',
    'Section 66D IT Act': 'Section 66D of the IT Act provides punishment for cheating by personation by using computer resources.',
    'Section 66E IT Act': 'Section 66E of the IT Act deals with the violation of privacy by capturing, publishing or transmitting the image of a private area of any person without consent.',
    'Section 67 IT Act': 'Section 67 of the IT Act provides punishment for publishing or transmitting obscene material in electronic form.',
    'Section 67A IT Act': 'Section 67A of the IT Act provides punishment for publishing or transmitting material containing sexually explicit acts in electronic form.',
    'Section 67B IT Act': 'Section 67B of the IT Act provides punishment for publishing or transmitting material depicting children in sexually explicit acts in electronic form.',
    'Section 43 IT Act': 'Section 43 of the IT Act provides for compensation and penalties for damage to computer systems, unauthorized access, and data theft.',
    'Section 72 IT Act': 'Section 72 of the IT Act provides punishment for breach of confidentiality and privacy by any person who has secured access to any electronic record, book, register, correspondence, or other material.',
    'Section 318(4) BNS': 'Section 318(4) of the Bharatiya Nyaya Sanhita (BNS), 2023, provides punishment for cheating and dishonestly inducing delivery of property — equivalent to the erstwhile Section 420 IPC — with imprisonment up to 7 years and fine.',
    'Section 318(2) BNS': 'Section 318(2) of the Bharatiya Nyaya Sanhita (BNS), 2023, provides punishment for cheating by personation — equivalent to the erstwhile Section 419 IPC — with imprisonment up to 5 years and fine.',
    'Section 61(2) BNS': 'Section 61(2) of the Bharatiya Nyaya Sanhita (BNS), 2023, provides punishment for criminal conspiracy to commit an offence — equivalent to the erstwhile Section 120B IPC.',
    'Section 74 BNS': 'Section 74 of the Bharatiya Nyaya Sanhita (BNS), 2023, relates to assault or use of criminal force against a woman with intent to outrage her modesty — equivalent to the erstwhile Section 354 IPC — applicable in cases of digital harassment.',
    'Section 78 BNS': 'Section 78 of the Bharatiya Nyaya Sanhita (BNS), 2023, specifically defines and punishes the offence of stalking, including monitoring the use by a woman of the internet, email or any other form of electronic communication — equivalent to the erstwhile Section 354D IPC.',
    'Section 111 BNS': 'Section 111 of the Bharatiya Nyaya Sanhita (BNS), 2023, deals with organised crime and criminal conspiracy involving digital means, applicable in cases of coordinated cyber fraud and hacking operations.',
    'POCSO Act 2012': 'The Protection of Children from Sexual Offences (POCSO) Act, 2012, provides a robust legal framework for the protection of children from offences of sexual assault, sexual harassment, and pornography.',
  };

  const templates = [
    { id: 'standard', name: 'Standard Cyber Crime Notice' },
    { id: 'emergency', name: 'Emergency Data Preservation' },
    { id: 'banking', name: 'Banking Fraud Notice' },
    { id: 'social', name: 'Social Media Account Request' }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(data?.template || 'standard');

  const updateContentBasedOnTemplate = (templateId, baseData, pBody, iReqs, rLine) => {
    let mandatoryPara = "Cyber Crime Police Station is a Law Enforcement Agency Home Department of Madhya Pradesh, State of India similar to federal investigation of America.";
    let bodySegments = pBody;
    let initialRequests = iReqs;
    let refLine = rLine;

    if (templateId === 'banking') {
      refLine = rLine; // use the dynamically built refLine from selected sections
      mandatoryPara = `State <span style="text-decoration: underline; text-decoration-style: dashed;">Cybercell</span> Bhopal is investigating <span class="font-bold" style="text-decoration: underline;">complaint No</span> <span class="font-bold">${baseData.firNumber || baseData.complaintNumber || '_______'}</span>. Hence kindly provide us the following information as per Section 94 BNSS.`;
      bodySegments = [];
      initialRequests = [
        "<span class=\"font-bold\">Detail Account statement from Account <span style=\"text-decoration: underline;\">Opening to</span> till date.</span>",
        "<span class=\"font-bold\" style=\"text-decoration: underline;\">CoustmerApplication Forms</span> <span class=\"font-bold\">(CAF / KYC) (Original) with Photo and Attached <span style=\"text-decoration: underline;\">documents .</span></span>",
        "<span class=\"font-bold\">Also provide Bankers Evidence Act Section 2A <span style=\"text-decoration: underline;\">Certificate.</span></span>",
        "<span class=\"font-bold\">Debit Freeze of account immediately as per 102crpc also hold FD and RD of <span style=\"text-decoration: underline;\">above mentioned</span> account.</span>",
        "All Document should be <span style=\"text-decoration: underline;\">Certified by</span> Branch Manager <span style=\"text-decoration: underline;\">Along</span> with <span style=\"text-decoration: underline;\">Name And</span> Contact No Branch Manager."
      ];
    }

    return { mandatoryPara, bodySegments, initialRequests, refLine };
  };

  useEffect(() => {
    if (data) {
      const { professionalBody, entities } = professionalizeDescription(data.description, data);
      
      const initialRequests = generateRequests(data, entities);

      // Generate Reference Line based on selected sections
      const proceduralSections = data.legalSections?.filter(s => PROCEDURAL_MAPPING[s] || s.includes('BNSS')) || [];
      const punitiveSelected = data.legalSections?.filter(s => PUNITIVE_MAPPING[s]) || [];
      const allSelected = data.legalSections || [];

      let refLine;
      if (allSelected.length > 0) {
        refLine = `(Under ${allSelected.join(' / ')})`;
      } else {
        refLine = '(Under Section 94 BNSS)';
      }

      const updatedVals = updateContentBasedOnTemplate(selectedTemplate, data, professionalBody, initialRequests, refLine);

      setLetterContent(prev => ({
        ...prev,
        subject: `Formal Investigation Request regarding ${(data.incidentType || 'INCIDENT').replace('_', ' ').toUpperCase()} // Ref: ${data.firNumber || 'PENDING'}`,
        header: {
          psName: data.policeStationName || 'Cyber & Hi-Tech Crime Police Station, Bhopal (M.P)',
          department: data.policeDepartment || 'State Cyber Police, Depot Chouraha, Bhadbhada Road,',
          address: `${data.officeAddress || 'Bhopal'}, Pin Code ${data.pinCode || '462003'} (M.P.) India`,
          phone: data.contactNumber || '+91-755-2779510',
          email: data.email1 || 'tc.cybercell@mppolice.gov.in',
          email2: data.email2 || 'insp-cybercell@mppolice.gov.in'
        },
        referenceLine: updatedVals.refLine,
        mandatoryPara: updatedVals.mandatoryPara,
        recipient: {
          company: selectedTemplate === 'banking' 
            ? `Nodal Officer\n${getCompanyName(data.company)}` 
            : getCompanyName(data.company),
          address: getCompanyAddress(data.company)
        },
        bodySegments: updatedVals.bodySegments,
        requests: updatedVals.initialRequests,
        legalSections: data.legalSections || [],
        officer: {
          name: data.officerName 
            ? data.officerName 
            : (selectedTemplate === 'banking' 
                ? `Manish Singh <span style="text-decoration: underline; text-decoration-style: dashed;">Bhadoriya</span>` 
                : 'Manish Singh Bhadoriya'),
          rank: data.officerRank || 'Inspector',
          badge: 'MP-POLICE'
        },
        bankDetails: { accountNo: data.accountHandle || '................', name: data.suspectName || '................' }
      }));
    }
  }, [data, selectedTemplate]);

  const professionalizeDescription = (description, rawData) => {
    // Detect entities
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const phoneRegex = /(\+?\d{10,12})/g;
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    
    const urls = description.match(urlRegex) || [];
    const phones = description.match(phoneRegex) || [];
    const emails = description.match(emailRegex) || [];
    
    const entities = { urls, phones, emails };

    const segments = [];
    
    // 1. Dynamic Legal Authority Segments (BNSS/CrPC)
    const selectedProcedural = rawData.legalSections?.filter(s => PROCEDURAL_MAPPING[s]) || [];
    
    if (selectedProcedural.length > 0) {
      selectedProcedural.forEach(section => {
        segments.push(PROCEDURAL_MAPPING[section]);
      });
    } else {
      // Fallback if none selected
      segments.push(`Section 94 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, empowers courts or police officers in charge to issue a summons or written order to any person to produce a document or thing necessary for an investigation, inquiry, or trial.`);
    }

    // 2. Incident Specific Segment
    let incidentNarrative = `Cyber Crime Police Station is inquiring/investigating Complaint/Crime No. ${rawData.firNumber || 'PENDING'} according to which complainant ${rawData.victimName || 'User'} reported an offence of ${(rawData.incidentType || 'Cyber Crime').replace('_', ' ')}. `;
    
    if (rawData.incidentType === 'account_hack') {
      incidentNarrative += `The investigation indicates that unauthorized access was gained to the digital profile with the intention to tarnish the reputation and misuse personal data.`;
    } else if (rawData.incidentType === 'financial_fraud' || rawData.incidentType === 'job_fraud') {
      incidentNarrative += `The suspect(s) involved have allegedly committed cheating and personation to cause financial loss to the victim.`;
    } else if (rawData.incidentType === 'sextortion' || rawData.incidentType === 'cyber_stalking') {
      incidentNarrative += `The reported activity involves electronic harassment and the misuse of private/morphed media to intimidate the complainant.`;
    } else {
      incidentNarrative += `The nature of the offence involves digital impersonation and unauthorized data access, requiring immediate intervention for evidence preservation.`;
    }
    
    segments.push(incidentNarrative);

    // 3. Dynamic Punitive Segments
    const selectedPunitive = rawData.legalSections?.filter(s => PUNITIVE_MAPPING[s]) || [];
    if (selectedPunitive.length > 0) {
      const descriptions = selectedPunitive.map(s => PUNITIVE_MAPPING[s]).join(' ');
      segments.push(`These acts are punishable under the following provisions: ${descriptions}`);
    } else {
      const acts = rawData.legalSections && rawData.legalSections.length > 0 ? rawData.legalSections.join(', ') : 'IT Act and BNS 2023';
      segments.push(`The acts of the suspect(s) are punishable under ${acts}. Specifically, the law mandates that whoever, fraudulently or dishonestly makes use of electronic signatures, passwords, or any other unique identification features of another person shall be punished with imprisonment and fine as per the prescribed legal statutes of India.`);
    }

    // 4. Evidence/Platform Specific Segment
    segments.push(`In view of the gravity of the offence and the digital evidence trail, it is imperative to secure all registration details, access logs, and device identifiers associated with the suspected activity described as follows: "${description.substring(0, 200)}..."`);

    return { professionalBody: segments, entities };
  };

  const generateRequests = (data, entities) => {
    const base = [
      "Provide complete registration details including Name, Address, and Mobile Number associated with the account.",
      "Share the IP logs (Login/Logout history) for the last 6 months along with device identifiers (IMEI, MAC, Browser Agent).",
      "Immediately preserve all data and logs related to the suspected account/transaction for a period of 90 days as per legal mandate."
    ];

    if (data.incidentType === 'online_fraud') {
      base.push("Share transaction beneficiary details and the destination account/wallet mapping.");
    }

    if (entities.urls.length > 0) {
      base.push(`Specifically provide details for the hosted URL(s): ${entities.urls.slice(0, 2).join(', ')}`);
    }

    return base;
  };

  const getCompanyName = (id) => {
    const cleanId = id?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const names = {
      instagram: 'Instagram (Meta Platforms, Inc.)',
      facebook: 'Facebook (Meta Platforms, Inc.)',
      whatsapp: 'WhatsApp LLC (Meta Platforms, Inc.)',
      telegram: 'Telegram FZ-LLC',
      snapchat: 'Snapchat Inc. (Snap Inc.)',
      xtwitter: 'X Corp. (formerly Twitter Inc.)',
      x: 'X Corp. (formerly Twitter Inc.)',
      twitter: 'X Corp. (formerly Twitter Inc.)',
      linkedin: 'LinkedIn Corporation',
      youtube: 'YouTube LLC (Google LLC)',
      discord: 'Discord Inc.',
      threads: 'Threads (Meta Platforms, Inc.)',
      amazon: 'Amazon Seller Services Private Limited',
      flipkart: 'Flipkart Internet Private Limited',
      myntra: 'Myntra Designs Private Limited',
      meesho: 'Fashnear Technologies Private Limited (Meesho)',
      ajio: 'Reliance Retail Limited (AJIO)',
      olx: 'OLX India Private Limited',
      quikr: 'Quikr India Private Limited',
      alibaba: 'Alibaba Group Holding Limited',
      googlepay: 'Google India Digital Services Private Limited',
      phonepe: 'PhonePe Private Limited',
      paytm: 'One97 Communications Limited (Paytm)',
      bhim: 'National Payments Corporation of India (NPCI)',
      paypal: 'PayPal India Private Limited',
      sbi: 'State Bank of India',
      hdfc: 'HDFC Bank Limited',
      icici: 'ICICI Bank Limited',
      axisbank: 'Axis Bank Limited',
      axis: 'Axis Bank Limited',
      google: 'Google LLC',
      gmail: 'Google LLC (Gmail)',
      outlook: 'Microsoft Corporation (Outlook)',
      yahoo: 'Yahoo! Inc.',
      microsoft: 'Microsoft Corporation',
      icloud: 'Apple Inc. (iCloud)',
      dropbox: 'Dropbox Inc.',
      onedrive: 'Microsoft Corporation (OneDrive)',
      pubg: 'Krafton Inc. (PUBG Division)',
      freefire: 'Garena Online Private Limited (Free Fire)',
      steam: 'Valve Corporation (Steam)',
      epicgames: 'Epic Games, Inc.',
      netflix: 'Netflix Entertainment Services India LLP',
      spotify: 'Spotify India Private Limited'
    };
    return names[cleanId] || id.toUpperCase();
  };

  const getCompanyAddress = (id) => {
    const cleanId = id?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const addresses = {
      instagram: 'Legal Department, Meta Platforms, Inc.\n1601 Willow Road, Menlo Park, CA 94025, USA\nvia Meta India Legal Cell, Gurugram, Haryana',
      facebook: 'Legal Department, Meta Platforms, Inc.\n1601 Willow Road, Menlo Park, CA 94025, USA\nvia Meta India Legal Cell, Gurugram, Haryana',
      whatsapp: 'Legal Department, WhatsApp LLC\n1601 Willow Road, Menlo Park, CA 94025, USA\nvia Meta India Legal Cell, Gurugram, Haryana',
      telegram: 'Legal & Compliance Division, Telegram FZ-LLC\nOffice 1001, Shatha Tower, Al Sufouh, Dubai, UAE',
      snapchat: 'Legal Department, Snap Inc.\n3000 31st Street, Santa Monica, CA 90405, USA',
      xtwitter: 'Legal & Safety Operations, X Corp.\n1355 Market Street, Suite 900, San Francisco, CA 94103, USA',
      x: 'Legal & Safety Operations, X Corp.\n1355 Market Street, Suite 900, San Francisco, CA 94103, USA',
      twitter: 'Legal & Safety Operations, X Corp.\n1355 Market Street, Suite 900, San Francisco, CA 94103, USA',
      linkedin: 'Legal Department, LinkedIn Corporation\n1000 W Maude Ave, Sunnyvale, CA 94085, USA\nvia LinkedIn India, Outer Ring Road, Bengaluru',
      youtube: 'Legal Department, YouTube LLC\n901 Cherry Ave, San Bruno, CA 94066, USA\nvia Google India, Giga Space, Pune',
      discord: 'Legal Department, Discord Inc.\n444 De Haro Street, Suite 200, San Francisco, CA 94107, USA',
      threads: 'Legal Department, Meta Platforms, Inc.\n1601 Willow Road, Menlo Park, CA 94025, USA\nvia Meta India Legal Cell, Gurugram, Haryana',
      amazon: 'Legal Department, Amazon Seller Services Pvt. Ltd.\n8th Floor, Brigade Gateway, 26/1 Dr. Rajkumar Road, Bangalore 560055, India',
      flipkart: 'Legal Cell, Flipkart Internet Private Limited\nBuildings Alyssa, Begonia & Clove Embassy Tech Village, Outer Ring Road, Bengaluru 560103, India',
      myntra: 'Legal & Compliance Dept, Myntra Designs Private Limited\nBuildings Alyssa, Begonia & Clove Embassy Tech Village, Bengaluru 560103, India',
      meesho: 'Legal Division, Fashnear Technologies Private Limited (Meesho)\n3rd Floor, Outer Ring Road, Bengaluru 560102, India',
      ajio: 'Legal Department, Reliance Retail Limited (AJIO Division)\n3rd Floor, Court House, Lokmanya Tilak Marg, Dhobi Talao, Mumbai 400002, India',
      olx: 'Legal Division, OLX India Private Limited\nGround Floor, Tower A, Global Business Park, M.G. Road, Gurugram 122002, India',
      quikr: 'Legal Department, Quikr India Private Limited\nNo. 104, 1st Main, Sector 6, HSR Layout, Bengaluru 560102, India',
      alibaba: 'Legal & Compliance Department, Alibaba Group Holding Ltd.\nHangzhou, Zhejiang Province, China',
      googlepay: 'GPay Compliance Team, Google India Digital Services Private Limited\n5th Floor, Tower C, DLF Cyber Greens, DLF Cyber City, Gurugram 122002, India',
      phonepe: 'Legal & Compliance Cell, PhonePe Private Limited\nOffice-2, Floor 4,5,6,7, Wing A, Block A, Salarpuria Softzone, Bengaluru 560103, India',
      paytm: 'Legal & Compliance Cell, One97 Communications Limited\nSkymark One, Sector 98, Noida 201301, Uttar Pradesh, India',
      bhim: 'Legal & Compliance Department, National Payments Corporation of India\n1001A, 10th Floor, B Wing, The Capital, Bandra Kurla Complex, Mumbai 400051, India',
      paypal: 'Legal Department, PayPal India Private Limited\n5th Floor, Futura IT Park, Sholinganallur, Chennai 600119, India',
      sbi: 'Nodal Officer, State Bank of India\nCorporate Centre, State Bank Bhavan, Madame Cama Road, Nariman Point, Mumbai 400021, India',
      hdfc: 'Nodal Officer, HDFC Bank Limited\nLegal & Compliance Dept, Empire Plaza, LBS Marg, Vikhroli West, Mumbai 400083, India',
      icici: 'Nodal Officer, ICICI Bank Limited\nICICI Bank Towers, Bandra Kurla Complex, Mumbai 400051, India',
      axisbank: 'Nodal Officer, Axis Bank Limited\nLegal & Compliance Dept, Axis House, Wadia International Centre, Worli, Mumbai 400025, India',
      axis: 'Nodal Officer, Axis Bank Limited\nLegal & Compliance Dept, Axis House, Wadia International Centre, Worli, Mumbai 400025, India',
      google: 'Legal Department, Google LLC\n1600 Amphitheatre Parkway, Mountain View, CA 94043, USA\nvia Google India Pvt. Ltd., Gurugram, India',
      gmail: 'Legal Department, Google LLC\n1600 Amphitheatre Parkway, Mountain View, CA 94043, USA\nvia Google India Pvt. Ltd., Gurugram, India',
      outlook: 'Legal Department, Microsoft Corporation\nOne Microsoft Way, Redmond, WA 98052, USA\nvia Microsoft India Private Limited, Gachibowli, Hyderabad',
      yahoo: 'Legal Department, Yahoo! Inc.\n701 First Avenue, Sunnyvale, CA 94089, USA',
      microsoft: 'Legal Department, Microsoft Corporation\nOne Microsoft Way, Redmond, WA 98052, USA\nvia Microsoft India Private Limited, Gachibowli, Hyderabad',
      icloud: 'Legal Department, Apple Inc.\nOne Apple Park Way, Cupertino, CA 95014, USA\nvia Apple India Private Limited, Bengaluru',
      dropbox: 'Legal Department, Dropbox Inc.\n1800 Owens Street, San Francisco, CA 94158, USA',
      onedrive: 'Legal Department, Microsoft Corporation\nOne Microsoft Way, Redmond, WA 98052, USA\nvia Microsoft India Private Limited, Gachibowli, Hyderabad',
      pubg: 'Legal Department, Krafton Inc.\n28-2, Yeoksam-ro 25-gil, Gangnam-gu, Seoul, Republic of Korea',
      freefire: 'Legal Division, Garena Online Private Limited\n1 Fusionopolis Place, #17-10 Galaxis, Singapore 138522',
      steam: 'Legal Department, Valve Corporation\n10400 NE 4th St, Bellevue, WA 98004, USA',
      epicgames: 'Legal & Compliance Dept, Epic Games, Inc.\n620 Crossroads Blvd, Cary, NC 27518, USA',
      netflix: 'Legal & Compliance Cell, Netflix Entertainment Services India LLP\nLevel 14, Tower A, The Capital, Bandra Kurla Complex, Mumbai 400051, India',
      spotify: 'Legal Department, Spotify India Private Limited\nRegus, 1st Floor, Trade Centre, Bandra Kurla Complex, Mumbai 400051, India'
    };
    return addresses[cleanId] || 'Legal & Compliance Department';
  };

  const handleFieldChange = (section, field, value) => {
    if (field) {
      setLetterContent(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setLetterContent(prev => ({ ...prev, [section]: value }));
    }
  };

  const handleInlineChange = (section, index, field, e, useHtml = false) => {
    const value = useHtml ? e.currentTarget.innerHTML : e.currentTarget.innerText;
    if (section === 'bodySegments') {
      const newSegments = [...letterContent.bodySegments];
      newSegments[index] = value;
      setLetterContent(prev => ({ ...prev, bodySegments: newSegments }));
    } else if (field) {
      setLetterContent(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setLetterContent(prev => ({ ...prev, [section]: value }));
    }
  };

  const updateRequest = (index, value) => {
    const newRequests = [...letterContent.requests];
    newRequests[index] = value;
    setLetterContent(prev => ({ ...prev, requests: newRequests }));
  };

  const addRequest = () => {
    setLetterContent(prev => ({ ...prev, requests: [...prev.requests, "New request item..."] }));
  };

  const removeRequest = (index) => {
    setLetterContent(prev => ({ ...prev, requests: letterContent.requests.filter((_, i) => i !== index) }));
  };

  const updateSection = (index, value) => {
    const newSections = [...letterContent.legalSections];
    newSections[index] = value;
    setLetterContent(prev => ({ ...prev, legalSections: newSections }));
  };

  const addSection = () => {
    setLetterContent(prev => ({ ...prev, legalSections: [...prev.legalSections, "New Section"] }));
  };

  const removeSection = (index) => {
    setLetterContent(prev => ({ ...prev, legalSections: letterContent.legalSections.filter((_, i) => i !== index) }));
  };

  const copyToClipboard = () => {
    const text = document.getElementById('letter-content').innerText;
    navigator.clipboard.writeText(text);
    alert('Letter content copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-[92vh] bg-[#020617] print:bg-white print:shadow-none print:h-auto print:block text-slate-100 rounded-3xl border border-slate-800 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
      {/* Premium Toolbar */}
      <div className="flex items-center justify-between px-8 py-5 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 no-print relative z-20">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-slate-800 p-3 rounded-xl border border-blue-500/30">
              <Cpu size={24} className="text-blue-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              JusticeDraft Intelligence
              <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">v4.5</span>
            </h2>
            <div className="flex items-center gap-2 mt-0.5 opacity-60">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]">LEGAL_ENGINE_ONLINE</span>
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Toggles */}
          <div className="bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800 flex shadow-inner">
            <button 
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${activeTab === 'edit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Edit3 size={14} /> EDITOR
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Eye size={14} /> PREVIEW
            </button>
            <button 
              onClick={() => setActiveTab('simple')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${activeTab === 'simple' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <FileCheck size={14} /> SIMPLE
            </button>
          </div>

          <div className="h-8 w-px bg-slate-800 mx-2"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsInlineEditing(!isInlineEditing)}
              className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all border ${isInlineEditing ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-900/40' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
            >
              <div className={`absolute -inset-2 bg-amber-500/20 blur-xl rounded-full opacity-0 ${isInlineEditing ? 'opacity-100' : ''} transition-opacity`}></div>
              <Layout size={16} /> 
              {isInlineEditing ? 'LOCK INLINE' : 'INLINE EDIT'}
            </button>
            
            <button onClick={copyToClipboard} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-blue-400 transition-all">
              <Copy size={18} />
            </button>
            
            <button
              disabled={saveStatus === 'saving'}
              onClick={async () => {
                setSaveStatus('saving');
                setSaveMessage('');
                try {
                  // Save to device as JSON file
                  const saveData = {
                    ...letterContent,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString()
                  };
                  const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `JusticeDraft_${saveData.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);

                  // Also try saving to backend DB
                  try {
                    await fetch('/api/save-complaint', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(saveData)
                    });
                  } catch {}

                  setSaveStatus('success');
                  setSaveMessage('Downloaded!');
                } catch (e) {
                  setSaveStatus('error');
                  setSaveMessage('Save failed');
                } finally {
                  setTimeout(() => { setSaveStatus('idle'); setSaveMessage(''); }, 3000);
                }
              }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black text-white shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed ${
                saveStatus === 'success' ? 'bg-emerald-500 shadow-emerald-900/50' :
                saveStatus === 'error'   ? 'bg-red-600 shadow-red-900/50' :
                saveStatus === 'saving'  ? 'bg-green-700 shadow-green-900/50' :
                'bg-green-600 hover:bg-green-500 shadow-green-900/50'
              }`}
            >
              {saveStatus === 'saving'  && <><Save size={18} className="animate-pulse" /> SAVING...</>}
              {saveStatus === 'success' && <><Check size={18} /> {saveMessage || 'SAVED!'}</>}
              {saveStatus === 'error'   && <><AlertCircle size={18} /> {saveMessage || 'FAILED'}</>}
              {saveStatus === 'idle'    && <><Save size={18} /> SAVE TO DB</>}
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black text-white shadow-2xl shadow-blue-900/50 transition-all hover:-translate-y-0.5 active:translate-y-0">
              <Printer size={18} />
              PRINT / EXPORT
            </button>
            
            <button onClick={onReset} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'simple' && (
        <div className="flex-1 overflow-y-auto p-10 bg-[#020617]">
          <LetterPreview data={data} onReset={onReset} />
        </div>
      )}

      <div className={`flex flex-1 overflow-hidden ${activeTab === 'simple' ? 'hidden' : ''}`}>
        {/* Editor Panel (Left) */}
        <div className={`flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#020617] no-print ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="max-w-3xl mx-auto space-y-12 pb-32">
            
            {/* Header: Template & Metadata */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-500">
                  <FileText size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Active Template</h3>
                </div>
                <select 
                  className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-blue-600 appearance-none cursor-pointer"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-500">
                  <History size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Reference No.</h3>
                </div>
                <input 
                  className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl px-5 py-4 text-sm font-mono font-bold outline-none focus:border-blue-600"
                  value={letterContent.refNo}
                  onChange={(e) => handleFieldChange('refNo', null, e.target.value)}
                />
              </div>
            </div>

            {/* Police Station & Authority Editor */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-3">
                <Shield size={18} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Police Station & Authority</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Police Station Name</label>
                  <input 
                    placeholder="Police Station Name"
                    className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-slate-900 transition-all"
                    value={letterContent.header.psName}
                    onChange={(e) => handleFieldChange('header', 'psName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Department / Division</label>
                  <input 
                    placeholder="e.g. State Cyber Police, Depot Square"
                    className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition-all"
                    value={letterContent.header.department}
                    onChange={(e) => handleFieldChange('header', 'department', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Station Address</label>
                  <textarea 
                    rows={2}
                    placeholder="Station Physical Address"
                    className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition-all resize-none"
                    value={letterContent.header.address}
                    onChange={(e) => handleFieldChange('header', 'address', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Contact Phone</label>
                  <input 
                    placeholder="Contact Number"
                    className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition-all"
                    value={letterContent.header.phone}
                    onChange={(e) => handleFieldChange('header', 'phone', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Primary Email</label>
                  <input 
                    placeholder="Email Address"
                    className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition-all"
                    value={letterContent.header.email}
                    onChange={(e) => handleFieldChange('header', 'email', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Logo Editor */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-3">
                <FileText size={18} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Letter Logo</h3>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 rounded-xl border-2 border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain" onError={(e) => { e.target.style.display='none'; }} />
                  ) : (
                    <span className="text-[9px] text-slate-600 font-bold uppercase text-center px-1">No Logo</span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Image URL or Local Path</label>
                  <input
                    placeholder="https://... or /logo.png"
                    className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition-all"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-[10px] text-blue-400 font-black uppercase cursor-pointer hover:bg-blue-600/20 transition-all">
                      <FileText size={12} /> Upload from Device
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => setLogoUrl(ev.target.result);
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                    <button
                      onClick={() => setLogoUrl('/mp_cyber_police_logo.png')}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-400 font-black uppercase hover:text-white transition-all"
                    >
                      Reset Default
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Recipient Editor */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-3">
                <Building size={18} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Recipient & Legal Cell</h3>
              </div>
              <div className="space-y-4">
                <input 
                  placeholder="Company Name"
                  className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-slate-900 transition-all"
                  value={letterContent.recipient.company}
                  onChange={(e) => handleFieldChange('recipient', 'company', e.target.value)}
                />
                <textarea 
                  rows={3}
                  placeholder="Office Address"
                  className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition-all resize-none"
                  value={letterContent.recipient.address}
                  onChange={(e) => handleFieldChange('recipient', 'address', e.target.value)}
                />
              </div>
            </section>

            {/* Body Editor (Smart Blocks) */}
            {selectedTemplate === 'banking' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-3">
                  <CreditCard size={18} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Bank Account Details</h3>
                </div>
                <div className="space-y-4">
                  <input 
                    placeholder="Account Number"
                    className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-slate-900 transition-all"
                    value={letterContent.bankDetails?.accountNo || ''}
                    onChange={(e) => handleFieldChange('bankDetails', 'accountNo', e.target.value)}
                  />
                  <input 
                    placeholder="Account Holder Name"
                    className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-slate-900 transition-all"
                    value={letterContent.bankDetails?.name || ''}
                    onChange={(e) => handleFieldChange('bankDetails', 'name', e.target.value)}
                  />
                </div>
              </section>
            )}

            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Type size={18} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Investigation Body</h3>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                  <Cpu size={12} /> SMART_DRAFT_ACTIVE
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 font-black uppercase ml-1">Official Subject Line</label>
                  <textarea 
                    rows={2}
                    className="w-full bg-slate-900/30 border-2 border-slate-800/50 rounded-xl px-5 py-3.5 text-sm font-black outline-none focus:border-blue-500 transition-all resize-none"
                    value={letterContent.subject}
                    onChange={(e) => handleFieldChange('subject', null, e.target.value)}
                  />
                </div>

                <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-6 relative group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Lock size={12} className="opacity-50" /> Global Mandatory Citation
                    </span>
                    <Check size={12} className="text-blue-500" />
                  </div>
                  <p className="text-sm italic text-blue-100/80 leading-relaxed font-serif pr-4">
                    "{letterContent.mandatoryPara}"
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] text-slate-600 font-black uppercase ml-1">Structured Paragraphs</label>
                  {letterContent.bodySegments.map((segment, idx) => (
                    <div key={idx} className="relative group">
                      <textarea 
                        rows={4}
                        className="w-full bg-slate-900/20 border-2 border-slate-800/30 rounded-2xl px-6 py-4 text-sm leading-relaxed outline-none focus:border-blue-500 focus:bg-slate-900 transition-all"
                        value={segment}
                        onChange={(e) => {
                          const newSegments = [...letterContent.bodySegments];
                          newSegments[idx] = e.target.value;
                          setLetterContent(prev => ({ ...prev, bodySegments: newSegments }));
                        }}
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700">
                          <Edit3 size={12} className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Requests Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <AlertCircle size={18} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Legal Requests</h3>
                </div>
                <button onClick={addRequest} className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter hover:bg-blue-500 transition-all flex items-center gap-1">
                  <Plus size={14} /> Add Request
                </button>
              </div>
              <div className="space-y-3">
                {letterContent.requests.map((req, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="mt-3 text-[10px] font-black text-slate-700 w-4">{idx + 1}.</div>
                    <textarea 
                      rows={2}
                      className="flex-1 bg-slate-900/30 border-2 border-slate-800/50 rounded-2xl px-5 py-3 text-xs leading-relaxed outline-none focus:border-blue-500 transition-all resize-none"
                      value={req}
                      onChange={(e) => updateRequest(idx, e.target.value)}
                    />
                    <button onClick={() => removeRequest(idx)} className="mt-3 p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* Preview Panel (Right) */}
        <div className={`flex-1 bg-slate-950 overflow-y-auto p-16 flex justify-center custom-scrollbar border-l border-slate-800/50 print:block print:bg-white print:p-0 ${activeTab === 'edit' ? 'hidden lg:flex' : 'flex'}`}>
          <div id="letter-content" className="letter-paper origin-top bg-white text-black p-[1in] shadow-[0_40px_100px_rgba(0,0,0,0.6)] min-h-[11.69in] w-[8.27in] relative font-sans print:shadow-none print:m-0">
            
            {selectedTemplate === 'banking' ? (
              <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                {/* Header Section */}
                <div className="text-center mb-5">
                  <div className="flex justify-center mb-2.5">
                    <img src={logoUrl} alt="Police Logo" className="w-20 h-20" />
                  </div>
                  <h1 className="text-[18px] font-bold m-1 outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleInlineChange('header', null, 'psName', e)}>
                    {letterContent.header.psName}
                  </h1>
                  <p className="text-[16px] m-0.5 outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleInlineChange('header', null, 'department', e)}>
                    {letterContent.header.department}
                  </p>
                  <p className="text-[16px] m-0.5 outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleInlineChange('header', null, 'address', e)}>
                    {letterContent.header.address}
                  </p>
                  <p className="text-[16px] m-0.5">
                    Phone No.<span className="font-bold outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleInlineChange('header', null, 'phone', e)}>{letterContent.header.phone}</span> email–<span className="font-bold outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleInlineChange('header', null, 'email', e)}>{letterContent.header.email}</span>
                  </p>
                </div>

                <div className="border-t border-black my-4"></div>

                {/* Reference */}
                <div className="text-center font-bold text-[16px] mb-8 outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleInlineChange('referenceLine', null, null, e, true)} dangerouslySetInnerHTML={{ __html: letterContent.referenceLine }} />

                {/* Recipient */}
                <div className="text-[16px] mb-8 leading-tight">
                  To,<br/>
                  <div className="pl-8 space-y-0.5">
                    <div 
                      contentEditable={isInlineEditing} 
                      onBlur={(e) => handleInlineChange('recipient', null, 'company', e, true)} 
                      className="outline-none font-bold whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: letterContent.recipient.company }} 
                    />
                    <div 
                      contentEditable={isInlineEditing} 
                      onBlur={(e) => handleInlineChange('recipient', null, 'address', e, true)} 
                      className="outline-none whitespace-pre-line text-[15px] font-normal"
                      dangerouslySetInnerHTML={{ __html: letterContent.recipient.address || '' }} 
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="text-[16px] text-justify mb-5 outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleInlineChange('mandatoryPara', null, null, e, true)}>
                  <span className="pl-8" dangerouslySetInnerHTML={{ __html: letterContent.mandatoryPara }} />
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '15%', border: '1px solid black', padding: '8px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>S.No.</th>
                      <th style={{ width: '45%', border: '1px solid black', padding: '8px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Account No.</th>
                      <th style={{ width: '40%', border: '1px solid black', padding: '8px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontSize: '16px' }}>01.</td>
                      <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontSize: '16px' }} className="outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleFieldChange('bankDetails', 'accountNo', e.currentTarget.innerText)}>{letterContent.bankDetails?.accountNo}</td>
                      <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontSize: '16px' }} className="outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleFieldChange('bankDetails', 'name', e.currentTarget.innerText)}>{letterContent.bankDetails?.name}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Requests */}
                <div className="text-[16px] mb-10">
                  <p className="m-1 mt-0 mb-2">So immediately provide following detail for the given account transactions.</p>
                  {letterContent.requests.map((req, i) => (
                    <div key={i} className="flex" style={{ margin: '4px 0' }}>
                      <span className="mr-1">{i + 1}.</span>
                      <span className="outline-none" contentEditable={isInlineEditing} onBlur={(e) => updateRequest(i, e.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: req }} />
                    </div>
                  ))}
                </div>

                {/* Action Prompt */}
                <div className="text-[16px] font-bold text-center mb-12 outline-none" contentEditable={isInlineEditing}>
                  An Early <span style={{textDecoration: 'underline'}}>And</span> Prompt Action Is Requested
                </div>

                {/* Signature */}
                <div className="text-right text-[16px]">
                  <p className="m-0.5 outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleInlineChange('officer', null, 'rank', e)}>{letterContent.officer.rank || 'Inspector'}</p>
                  <p className="m-0.5 outline-none" contentEditable={isInlineEditing} onBlur={(e) => handleInlineChange('officer', null, 'name', e, true)} dangerouslySetInnerHTML={{ __html: letterContent.officer.name || 'Manish Singh <span style="text-decoration: underline; text-decoration-style: dashed;">Bhadoriya</span>' }} />
                  <p className="m-0.5">Cyber & Hi-Tech Crime</p>
                </div>
                
                <div className="mt-5 text-[16px]">
                  <p className="m-0">Police Station Bhopal</p>
                </div>
              </div>
            ) : (
            <>
            {/* Header Section - Centered exactly like sample */}
            <div className="text-center mb-1 relative">
              <div className="flex justify-center mb-4">
                <img src={logoUrl} alt="Police Logo" className="h-28 object-contain" />
              </div>
              
              <div 
                contentEditable={isInlineEditing}
                onBlur={(e) => handleInlineChange('header', null, 'psName', e)}
                className={`text-xl font-bold text-black uppercase tracking-tight leading-tight outline-none ${isInlineEditing ? 'bg-blue-50 border border-blue-200 rounded p-1' : ''}`}
              >
                {letterContent.header.psName}
              </div>
              
              <div 
                contentEditable={isInlineEditing}
                onBlur={(e) => handleInlineChange('header', null, 'department', e)}
                className={`text-lg font-medium text-black outline-none ${isInlineEditing ? 'bg-blue-50 border border-blue-200 rounded p-1' : ''}`}
              >
                {letterContent.header.department}
              </div>

              <div 
                contentEditable={isInlineEditing}
                onBlur={(e) => handleInlineChange('header', null, 'address', e)}
                className={`text-lg font-medium text-black outline-none ${isInlineEditing ? 'bg-blue-50 border border-blue-200 rounded p-1' : ''}`}
              >
                {letterContent.header.address}
              </div>

              <div className="text-lg font-medium text-black flex flex-col items-center">
                <div className="flex gap-1">
                  <span>Phone No.</span>
                  <span 
                    contentEditable={isInlineEditing}
                    onBlur={(e) => handleInlineChange('header', null, 'phone', e)}
                    className={`font-bold outline-none ${isInlineEditing ? 'bg-blue-50 border border-blue-200 rounded px-1' : ''}`}
                  >
                    {letterContent.header.phone}
                  </span>
                  <span className="ml-2">email—</span>
                  <span 
                    contentEditable={isInlineEditing}
                    onBlur={(e) => handleInlineChange('header', null, 'email', e)}
                    className={`font-bold outline-none ${isInlineEditing ? 'bg-blue-50 border border-blue-200 rounded px-1' : ''}`}
                  >
                    {letterContent.header.email}
                  </span>
                </div>
                <div 
                  contentEditable={isInlineEditing}
                  onBlur={(e) => handleInlineChange('header', null, 'email2', e)}
                  className={`font-bold outline-none text-right w-full pr-12 ${isInlineEditing ? 'bg-blue-50 border border-blue-200 rounded px-1' : ''}`}
                  style={{ marginRight: '0.5in' }}
                >
                  {letterContent.header.email2}
                </div>
              </div>
              
              {/* Horizontal Line Divider */}
              <div className="w-full h-[2px] bg-black mt-4 mb-4"></div>
            </div>

            {/* Reference Line - Editable */}
            <div className="text-center mb-6">
              <div 
                contentEditable={isInlineEditing}
                onBlur={(e) => handleInlineChange('referenceLine', null, null, e)}
                className={`text-[14px] font-bold underline outline-none ${isInlineEditing ? 'bg-blue-50 p-1 rounded' : ''}`}
              >
                {letterContent.referenceLine}
              </div>
            </div>

            {/* Recipient Section */}
            <div className="text-[14px] mb-8 leading-tight">
              <div className="font-medium mb-1">To ,</div>
              <div className="pl-12 space-y-0.5">
                <div 
                  contentEditable={isInlineEditing}
                  onBlur={(e) => handleInlineChange('recipient', null, 'company', e)}
                  className={`font-medium outline-none ${isInlineEditing ? 'bg-blue-50 rounded px-1' : ''}`}
                >
                  {letterContent.recipient.company}
                </div>
                <div 
                  contentEditable={isInlineEditing}
                  onBlur={(e) => handleInlineChange('recipient', null, 'address', e)}
                  className={`whitespace-pre-line font-medium outline-none ${isInlineEditing ? 'bg-blue-50 rounded px-1' : ''}`}
                >
                  {letterContent.recipient.address}
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div className="text-[14px] text-justify space-y-5 leading-snug">
              
              {/* GLOBAL MANDATORY BLOCK */}
              <p 
                className={`font-medium indent-12 outline-none ${isInlineEditing ? 'bg-blue-50 p-1 rounded' : ''}`}
                contentEditable={isInlineEditing}
                onBlur={(e) => handleInlineChange('mandatoryPara', null, null, e)}
              >
                {letterContent.mandatoryPara}
              </p>

              {/* Dynamic Legal & Investigation Narrative */}
              {letterContent.bodySegments.map((segment, idx) => (
                <p 
                  key={idx}
                  contentEditable={isInlineEditing}
                  onBlur={(e) => handleInlineChange('bodySegments', idx, null, e)}
                  className={`font-medium indent-12 outline-none ${isInlineEditing ? 'bg-blue-50 p-1 rounded' : ''}`}
                >
                  {segment}
                </p>
              ))}

              {/* URL/Profile Block - Only if relevant */}
              {(data.accountHandle || data.suspectName) && (
                <div className="space-y-1">
                  <p className="font-medium">Hence kindly <span className="font-bold">Block/Deactivate</span> the following profile and also provide Registration, Access details and IP login logs.</p>
                  {data.suspectName && (
                    <div className="font-medium flex gap-1">
                      Profile Id :— <span 
                        contentEditable={isInlineEditing}
                        onBlur={(e) => handleInlineChange('suspectName', null, null, e)}
                        className={`font-bold outline-none break-all ${isInlineEditing ? 'bg-blue-50 rounded px-1' : ''}`}
                      >“{data.suspectName}”</span>
                    </div>
                  )}
                  {data.accountHandle && (
                    <div className="font-medium flex gap-1">
                      URL :— <span 
                        contentEditable={isInlineEditing}
                        onBlur={(e) => handleInlineChange('accountHandle', null, null, e)}
                        className={`font-bold outline-none overflow-hidden break-all flex-1 ${isInlineEditing ? 'bg-blue-50 rounded px-1' : ''}`}
                      >{data.accountHandle}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Required Information */}
              <div className="space-y-2">
                <p className="font-medium">Required Information:</p>
                <div className="space-y-1">
                  {letterContent.requests.map((req, i) => (
                    <div key={i} className="flex gap-2 font-medium">
                      <span>{i + 1}.</span>
                      <span 
                        contentEditable={isInlineEditing}
                        onBlur={(e) => updateRequest(i, e.currentTarget.innerText)}
                        className={`outline-none flex-1 ${isInlineEditing ? 'bg-blue-50 rounded px-1' : ''}`}
                      >{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="font-medium mt-6">Looking forward to receive relevant information at the earliest.</p>
            </div>

            {/* Signature Area - Aligned Right */}
            <div className="mt-20 flex justify-end">
              <div className="text-right text-[15px] leading-tight">
                <div 
                  contentEditable={isInlineEditing}
                  onBlur={(e) => handleInlineChange('officer', null, 'rank', e)}
                  className="outline-none font-medium"
                >
                  {letterContent.officer.rank || 'Inspector'}
                </div>
                <div 
                  contentEditable={isInlineEditing}
                  onBlur={(e) => handleInlineChange('officer', null, 'name', e)}
                  className="outline-none font-medium"
                >
                  {letterContent.officer.name || 'Manish Singh Bhadoriya'}
                </div>
                <div className="outline-none font-medium">
                  Cyber & Hi-Tech Crime
                </div>
                <div className="outline-none font-medium">
                  Police Station Bhopal
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; border: 2px solid #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }

        .letter-paper {
          box-sizing: border-box;
          background-image: 
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 30px 30px;
        }

        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .no-print { display: none !important; }
          
          #letter-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 20mm 25mm !important;
            box-shadow: none !important;
            transform: none !important;
            background-image: none !important;
            border: none !important;
            page-break-after: always;
          }

          /* Ensure images load and colors print */
          img {
            max-width: 100% !important;
            -webkit-print-color-adjust: exact;
          }
          
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}} />
    </div>
  );
};

export default LetterEditor;
