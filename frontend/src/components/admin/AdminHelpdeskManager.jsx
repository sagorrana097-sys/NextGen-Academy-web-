import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Send,
  X,
  RefreshCw,
  BookOpen,
  Building,
  Laptop,
  CreditCard
} from 'lucide-react';
import { helpdeskAPI } from '../../services/api';

const CATEGORY_NAMES = {
  ACADEMIC: 'একাডেমিক ও পাঠদান',
  MANAGEMENT: 'ম্যানেজমেন্ট ও প্রশাসন',
  TECHNICAL: 'টেকনিক্যাল সমস্যা',
  FEES: 'ফি ও পেমেন্ট',
  OTHER: 'অন্যান্য পরামর্শ'
};

export default function AdminHelpdeskManager() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Ticket for Details / Response Modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('PENDING');
  const [editResponse, setEditResponse] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await helpdeskAPI.getAdminTickets({
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter,
        search: searchQuery
      });
      if (res?.success) {
        setTickets(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, categoryFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleOpenEdit = (ticket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status || 'PENDING');
    setEditResponse(ticket.adminResponse || '');
    setIsEditModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedTicket) return;
    setUpdating(true);
    try {
      const res = await helpdeskAPI.updateTicketStatus(selectedTicket.id, {
        status: editStatus,
        adminResponse: editResponse.trim() || null
      });
      if (res?.success) {
        setActionSuccess('টিকিটের স্ট্যাটাস ও সমাধান নোট সফলভাবে সংরক্ষিত হয়েছে।');
        setIsEditModalOpen(false);
        fetchTickets();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      alert('আপডেট ব্যর্থ হয়েছে: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই টিকিটটি মুছে ফেলতে চান?')) return;
    try {
      const res = await helpdeskAPI.deleteTicket(id);
      if (res?.success) {
        setActionSuccess('টিকিটটি সফলভাবে মুছে ফেলা হয়েছে।');
        fetchTickets();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      alert('মুছে ফেলা সম্ভব হয়নি: ' + err.message);
    }
  };

  // Metrics computation
  const totalCount = tickets.length;
  const pendingCount = tickets.filter((t) => t.status === 'PENDING').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length;

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black">অতি জরুরি</span>;
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black">জরুরি</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold">সাধারণ</span>;
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'RESOLVED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> সমাধান হয়েছে</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5 animate-pulse" /> কাজ চলছে</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> অপেক্ষমাণ</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/70 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              হেল্পডেস্ক ও অভিযোগ কন্ট্রোল (Admin Helpdesk Panel)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              শিক্ষার্থী ও অভিভাবকদের মতামত, অভিযোগ পর্যালোচনা ও সমাধান প্রদান করুন
            </p>
          </div>
        </div>

        <button
          onClick={fetchTickets}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> রিফ্রেশ তালিকা
        </button>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 flex items-center justify-between text-emerald-300 text-xs font-bold shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs font-bold text-slate-400">মোট অভিযোগ / মতামত</p>
          <p className="text-2xl font-black text-white mt-1 font-mono">{totalCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40 shadow-md">
          <p className="text-xs font-bold text-amber-400">অপেক্ষমাণ (Pending)</p>
          <p className="text-2xl font-black text-amber-300 mt-1 font-mono">{pendingCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-sky-950/20 border border-sky-900/40 shadow-md">
          <p className="text-xs font-bold text-sky-400">কাজ চলছে (In Progress)</p>
          <p className="text-2xl font-black text-sky-300 mt-1 font-mono">{inProgressCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 shadow-md">
          <p className="text-xs font-bold text-emerald-400">সমাধান হয়েছে (Resolved)</p>
          <p className="text-2xl font-black text-emerald-300 mt-1 font-mono">{resolvedCount}</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'সকল স্ট্যাটাস' },
              { id: 'PENDING', label: 'অপেক্ষমাণ' },
              { id: 'IN_PROGRESS', label: 'কাজ চলছে' },
              { id: 'RESOLVED', label: 'সমাধান হয়েছে' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  statusFilter === st.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="টিকেট নং, বিষয় বা বার্তা দিয়ে সার্চ..."
              className="w-full bg-slate-950 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2 text-xs border border-slate-800 focus:border-amber-500 outline-none"
            />
          </form>
        </div>

        {/* Secondary Category & Priority Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">বিভাগ:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-800 outline-none"
            >
              <option value="ALL">সকল বিভাগ</option>
              <option value="ACADEMIC">একাডেমিক ও পাঠদান</option>
              <option value="MANAGEMENT">ম্যানেজমেন্ট ও প্রশাসন</option>
              <option value="TECHNICAL">টেকনিক্যাল সমস্যা</option>
              <option value="FEES">ফি ও পেমেন্ট</option>
              <option value="OTHER">অন্যান্য পরামর্শ</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">জরুরিতা:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-800 outline-none"
            >
              <option value="ALL">সকল মাত্রা</option>
              <option value="NORMAL">সাধারণ</option>
              <option value="URGENT">জরুরি</option>
              <option value="HIGH">অতি জরুরি</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400 animate-pulse">টিকিট তালিকা লোড হচ্ছে...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">কোনো অভিযোগ বা টিকিট পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl hover:border-slate-700 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-amber-400 font-mono text-xs font-black">
                        {ticket.ticketNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold">
                        {CATEGORY_NAMES[ticket.category] || ticket.category}
                      </span>
                      {getPriorityBadge(ticket.priority)}
                      {ticket.isAnonymous ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1">
                          <EyeOff className="w-3.5 h-3.5" /> নাম গোপন রাখা হয়েছে
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-500" /> {ticket.userName} ({ticket.userRole})
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-white mt-1">{ticket.subject}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(ticket.status)}
                    <span className="text-xs text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-wrap font-medium">
                  {ticket.message}
                </div>

                {/* Contact phone if available */}
                {!ticket.isAnonymous && ticket.userPhone && (
                  <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> যোগাযোগের ফোন: {ticket.userPhone}
                  </p>
                )}

                {/* Admin Resolution Display */}
                {ticket.adminResponse && (
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 space-y-1">
                    <p className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> কর্তৃপক্ষের সমাধান / উত্তর:
                    </p>
                    <p className="whitespace-pre-wrap text-emerald-200 pl-4">{ticket.adminResponse}</p>
                    {ticket.resolvedBy && (
                      <p className="text-[10px] text-slate-400 pl-4 mt-1">
                        সমাধান করেছেন: {ticket.resolvedBy} (
                        {new Date(ticket.resolvedAt || ticket.updatedAt).toLocaleDateString('bn-BD')}
                        )
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleOpenEdit(ticket)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Edit className="w-3.5 h-3.5" /> স্ট্যাটাস ও সমাধান নোট দিন
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-all"
                    title="টিকিট মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* UPDATE STATUS & RESPONSE MODAL */}
      {/* ========================================================= */}
      {isEditModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">টিকিট স্ট্যাটাস ও সমাধান আপডেট</h3>
                <p className="text-xs text-amber-400 font-mono mt-0.5">{selectedTicket.ticketNumber}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">স্ট্যাটাস পরিবর্তন করুন</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-950 text-white rounded-xl px-3 py-2.5 text-xs font-bold border border-slate-800 focus:border-amber-500 outline-none"
                >
                  <option value="PENDING">🟡 অপেক্ষমাণ (Pending)</option>
                  <option value="IN_PROGRESS">🔵 কাজ চলছে (In Progress)</option>
                  <option value="RESOLVED">🟢 সমাধান হয়েছে (Resolved)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  কর্তৃপক্ষের উত্তর / সমাধান নোট (শিক্ষার্থী বা অভিভাবক দেখতে পাবেন)
                </label>
                <textarea
                  rows={4}
                  value={editResponse}
                  onChange={(e) => setEditResponse(e.target.value)}
                  placeholder="যেমন: বিষয়টি পর্যালোচনা করে ব্যবস্থা নেওয়া হয়েছে..."
                  className="w-full bg-slate-950 text-white placeholder:text-slate-600 rounded-xl p-3 text-xs border border-slate-800 focus:border-amber-500 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={updating}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                {updating ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
