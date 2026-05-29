import React, { useState, useEffect } from 'react';
import { Shield, User, Phone, Mail, Calendar, Trash2, Search, Users, Activity, Lock, RefreshCcw } from 'lucide-react';

const LOGINS_KEY = 'jd_login_log';

const getLoginLog = () => { try { return JSON.parse(localStorage.getItem(LOGINS_KEY) || '[]'); } catch { return []; } };

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loginLog] = useState(getLoginLog);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const deleteUser = async (username) => {
    try {
      const response = await fetch(`/api/users/${username}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        const updated = users.filter(u => u.username !== username);
        setUsers(updated);
        setConfirmDelete(null);
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const loginCountFor = (username) =>
    loginLog.filter(l => l.username === username).length;

  const lastLoginFor = (username) => {
    const logs = loginLog.filter(l => l.username === username);
    if (!logs.length) return 'Never';
    const last = logs[logs.length - 1];
    return new Date(last.at).toLocaleString('en-IN');
  };

  const refresh = () => fetchUsers();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-red-500/20 blur-xl rounded-full" />
            <div className="relative bg-red-600/20 border border-red-500/40 p-3 rounded-2xl">
              <Shield size={28} className="text-red-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Admin Panel</h1>
            <p className="text-[11px] text-slate-500 font-mono uppercase tracking-widest">SYSTEM ACCESS // RESTRICTED</p>
          </div>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-black text-slate-400 hover:text-white transition-all">
          <RefreshCcw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: users.length, icon: <Users size={16} />, color: 'text-blue-400' },
          { label: 'Total Logins', value: loginLog.length, icon: <Activity size={16} />, color: 'text-emerald-400' },
          { label: 'Active Today', value: loginLog.filter(l => new Date(l.at).toDateString() === new Date().toDateString()).length, icon: <User size={16} />, color: 'text-amber-400' },
          { label: 'Registered Today', value: users.filter(u => new Date(u.createdAt).toDateString() === new Date().toDateString()).length, icon: <Calendar size={16} />, color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
            <span className={s.color}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, username, email or phone..."
          className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
        />
      </div>

      {/* Users Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-black uppercase tracking-widest text-sm">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u, i) => (
            <div key={u.username} className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm shrink-0">
                    {u.fullName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white">{u.fullName}</span>
                      <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full text-slate-400 font-mono">@{u.username}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500"><Mail size={10} /> {u.email}</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500"><Phone size={10} /> {u.phone}</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500"><Calendar size={10} /> Joined {new Date(u.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] text-slate-600 uppercase font-black">Logins</p>
                    <p className="text-lg font-black text-emerald-400">{loginCountFor(u.username)}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] text-slate-600 uppercase font-black">Last Login</p>
                    <p className="text-[11px] text-slate-400 font-mono">{lastLoginFor(u.username)}</p>
                  </div>
                  {confirmDelete === u.username ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-red-400 font-black">Confirm?</span>
                      <button onClick={() => deleteUser(u.username)} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-[11px] font-black text-white transition-all">Yes</button>
                      <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-[11px] font-black text-slate-300 transition-all">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(u.username)} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Password row — visible only to admin */}
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2">
                <Lock size={10} className="text-slate-600" />
                <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Password:</span>
                <span className="text-[11px] text-slate-500 font-mono">{u.password}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Login Log */}
      {loginLog.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <Activity size={14} /> Recent Login Activity
          </h2>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 font-black uppercase tracking-widest">Username</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 font-black uppercase tracking-widest">Full Name</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 font-black uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody>
                {[...loginLog].reverse().slice(0, 20).map((l, i) => (
                  <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-blue-400">@{l.username}</td>
                    <td className="px-4 py-2.5 text-slate-300">{l.fullName}</td>
                    <td className="px-4 py-2.5 text-slate-500">{new Date(l.at).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
