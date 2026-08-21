import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { teacherAPI } from '../../services/api';
import {
  Users,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  BookOpen,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function GuardianTeacherCards({ studentClass = 'Class 10', teachers: initialTeachers }) {
  const { lang, t } = useLanguage();
  const [teachers, setTeachers] = useState(initialTeachers || []);
  const [loading, setLoading] = useState(!initialTeachers);

  useEffect(() => {
    if (!initialTeachers) {
      fetchTeachers();
    }
  }, [initialTeachers]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        setTeachers(res.data);
      }
    } catch (err) {
      console.error('Failed to load teachers for guardian cards:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>অভিভাবক ও শিক্ষক প্রত্যক্ষ যোগাযোগ</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            শ্রেণি শিক্ষক ও বিষয়ভিত্তিক শিক্ষক ডিরেক্টরি ({studentClass})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            শিক্ষার্থীর পড়াশোনা ও অগ্রগতি বিষয়ে সরাসরি কথা বলুন
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
          <p className="text-xs font-bold">শিক্ষকদের তালিকা লোড হচ্ছে...</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">কোনো শিক্ষক পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-400">বর্তমানে কোনো শিক্ষক তালিকাভুক্ত নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md overflow-hidden">
                    {teacher.avatar ? (
                      <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                    ) : (
                      teacher.name?.charAt(0) || 'শ'
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">{teacher.name}</h4>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">{teacher.designation || 'শিক্ষক'}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate"><strong>বিষয়:</strong> {teacher.specialization || teacher.subject || 'সাধারণ'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate"><strong>পরামর্শ সময়:</strong> {teacher.officeHours || 'সকাল ১০:০০ - বিকাল ৩:০০'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                {teacher.phone ? (
                  <>
                    <a
                      href={`tel:${teacher.phone}`}
                      className="flex-1 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>সরাসরি কল</span>
                    </a>

                    <a
                      href={`https://wa.me/${teacher.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm transition-all active:scale-95"
                      title="WhatsApp বার্তা পাঠান"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>চ্যাট</span>
                    </a>
                  </>
                ) : (
                  <div className="text-[11px] text-slate-400 text-center w-full py-1">ফোন নম্বর সংরক্ষিত নেই</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
