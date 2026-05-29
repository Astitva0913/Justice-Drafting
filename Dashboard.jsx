import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Globe, 
  ShoppingBag, 
  CreditCard, 
  Mail, 
  Gamepad2, 
  MoreHorizontal, 
  ChevronRight,
  ExternalLink,
  Lock,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';

const categories = [
  {
    id: 'social',
    name: 'Social Media',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-blue-600 to-indigo-600',
    apps: ['Instagram', 'Facebook', 'WhatsApp', 'Telegram', 'Snapchat', 'X (Twitter)', 'LinkedIn', 'YouTube', 'Discord', 'Threads']
  },
  {
    id: 'shopping',
    name: 'Online Shopping',
    icon: <ShoppingBag className="w-6 h-6" />,
    color: 'from-orange-500 to-red-600',
    apps: ['Amazon', 'Flipkart', 'Myntra', 'Meesho', 'Ajio', 'OLX', 'Quikr', 'Alibaba']
  },
  {
    id: 'banking',
    name: 'Banking & Payments',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-700',
    apps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'PayPal', 'SBI', 'HDFC', 'ICICI', 'Axis Bank']
  },
  {
    id: 'cloud',
    name: 'Email & Cloud',
    icon: <Mail className="w-6 h-6" />,
    color: 'from-sky-500 to-blue-700',
    apps: ['Google', 'Gmail', 'Outlook', 'Yahoo', 'Microsoft', 'iCloud', 'Dropbox', 'OneDrive']
  },
  {
    id: 'gaming',
    name: 'Gaming & Entertainment',
    icon: <Gamepad2 className="w-6 h-6" />,
    color: 'from-purple-600 to-pink-600',
    apps: ['PUBG', 'Free Fire', 'Steam', 'Epic Games', 'Netflix', 'Spotify']
  },
  {
    id: 'others',
    name: 'Others',
    icon: <MoreHorizontal className="w-6 h-6" />,
    color: 'from-slate-600 to-slate-800',
    apps: ['Custom Platform', 'Unknown Website', 'Crypto Wallet', 'Fake Loan App', 'Fraud Website']
  }
];

const Dashboard = ({ onSelectPlatform }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    apps: cat.apps.filter(app => app.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.apps.length > 0);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }}>
      </div>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Header Section */}
      <header className="relative z-10 pt-12 pb-8 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative bg-blue-600 p-4 rounded-2xl shadow-2xl shadow-blue-900/50 border border-blue-400/30">
              <Shield size={48} className="text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-400">
              JusticeDraft
            </h1>
            <p className="text-blue-400/80 font-mono text-sm md:text-base tracking-[0.2em] uppercase">
              Official Investigation Request Portal // LEA-ACCESS-v2.0
            </p>
          </div>

          <div className="w-full max-w-2xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl flex items-center px-4 py-1">
              <Search className="text-slate-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Search Platform or Company (e.g. Instagram, SBI)..."
                className="w-full bg-transparent py-4 text-slate-100 outline-none placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md border border-slate-700 text-[10px] text-slate-400 font-mono">
                <span className="animate-pulse">●</span> SECURE_LINE
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats / Status Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'ACTIVE CASES', value: '1,284', icon: <Activity size={14}/> },
            { label: 'PLATFORMS', value: '45+', icon: <Globe size={14}/> },
            { label: 'AUTH LEVEL', value: 'ADMIN', icon: <Lock size={14}/> },
            { label: 'UPTIME', value: '99.9%', icon: <Zap size={14}/> },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-3 flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">{stat.icon}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
              <span className="font-mono text-sm text-blue-400">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Category Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <div 
              key={category.id}
              className={`group relative rounded-3xl transition-all duration-500 ${
                expandedCategory === category.id ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${category.color} rounded-3xl opacity-0 group-hover:opacity-20 transition duration-500 blur-xl`}></div>
              
              <div className="relative h-full bg-slate-900/60 backdrop-blur-2xl border border-slate-800 group-hover:border-slate-700/50 rounded-3xl overflow-hidden flex flex-col">
                {/* Card Header */}
                <div className={`h-2 bg-gradient-to-r ${category.color} opacity-80`}></div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg shadow-black/40 text-white`}>
                      {category.icon}
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-black text-white">{category.apps.length}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Platforms</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Access investigation request templates for major {category.name.toLowerCase()} providers.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {category.apps.slice(0, 5).map(app => (
                      <span key={app} className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs text-slate-300 font-medium">
                        {app}
                      </span>
                    ))}
                    {category.apps.length > 5 && (
                      <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400 font-bold">
                        +{category.apps.length - 5} MORE
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 ${
                      expandedCategory === category.id 
                        ? 'bg-slate-100 text-slate-900' 
                        : 'bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                    }`}
                  >
                    {expandedCategory === category.id ? 'Close Selection' : 'Open Category'}
                    <ChevronRight size={18} className={`transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Expanded Platform List */}
                {expandedCategory === category.id && (
                  <div className="p-8 border-t border-slate-800 bg-slate-950/40 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {category.apps.map(app => (
                        <button 
                          key={app}
                          onClick={() => onSelectPlatform && onSelectPlatform(app)}
                          className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-xl transition-all group/app"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover/app:text-blue-400 group-hover/app:bg-blue-400/10 transition-colors">
                            <ExternalLink size={14} />
                          </div>
                          <span className="text-sm font-semibold text-slate-300 group-hover/app:text-white">{app}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 right-0 p-12 opacity-5 pointer-events-none">
        <Cpu size={400} />
      </div>
    </div>
  );
};

export default Dashboard;
