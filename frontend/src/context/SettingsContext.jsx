import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

export const defaultSiteSettings = {
  academyName: 'NextGen Academy',
  academyNameBn: 'নেক্সটজেন একাডেমি',
  academyNameEn: 'NextGen Academy',
  founderName: 'মো: আলমগীর হোসেন (সাগর)',
  contactNumber: '০১৭৯২৮১৮০০৫',
  contactPhone: '01792818005',
  altPhone: '+880 1792818005',
  hotline: '01792818005',
  contactEmail: 'info@nextgen.edu.bd',
  supportEmail: 'info@nextgen.edu.bd',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  addressBn: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  addressEn: 'West Joydebpur, Bus Stand, Gazipur',
  tagline: 'LEARN · GROW · SUCCEED',
  taglineBn: 'শিক্ষা · সমৃদ্ধি · সাফল্য',
  taglineEn: 'LEARN · GROW · SUCCEED',
  logoUrl: '/logo.png',
  sealUrl: '/logo.png',
  eiin: 'NGA-GAZIPUR-2026',
  website: 'https://nextgen.edu.bd',
  currencySymbol: '৳',
  academic: {
    classes: ['৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি', '১১শ শ্রেণি', '১২শ শ্রেণি'],
    sections: ['পদ্মা', 'মেঘনা', 'যমুনা'],
    groups: ['বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা'],
    subjects: ['সাধারণ গণিত', 'উচ্চতর গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'বাংলা', 'ইংরেজি']
  },
  payment: {
    bkashCharge: 1.5,
    nagadCharge: 1.25,
    monthlyTuitionDefault: 1500,
    admissionFeeDefault: 3000,
    examFeeDefault: 500
  },
  noticeText: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ প্লে থেকে ১২শ শ্রেণি পর্যন্ত সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। হেল্পলাইন: ০১৭৯২৮১৮০০৫',
  noticeTextBn: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ প্লে থেকে ১২শ শ্রেণি পর্যন্ত সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। হেল্পলাইন: ০১৭৯২৮১৮০০৫',
  noticeTextEn: 'Admission Open for Academic Session 2026 from Play to Class 12. Hotline: +880 1792818005',
  showNotice: true,
  admissionActive: true,
  admissionSessionYear: '২০২৬',
  admissionHelpline: '01792818005',
  maxApplicationsPerBatch: 60,
  socialLinks: {
    facebook: 'https://facebook.com/NextGenAcademyBD',
    youtube: 'https://youtube.com/@NextGenAcademyBD',
    linkedin: 'https://linkedin.com/company/nextgen-academy-bd',
    twitter: 'https://twitter.com/NextGenAcademy'
  }
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await settingsAPI.getSettings();
      if (res.success && res.data) {
        setSettings({
          ...defaultSiteSettings,
          ...res.data,
          academic: {
            ...defaultSiteSettings.academic,
            ...(res.data.academic || {})
          },
          payment: {
            ...defaultSiteSettings.payment,
            ...(res.data.payment || {})
          },
          socialLinks: {
            ...defaultSiteSettings.socialLinks,
            ...(res.data.socialLinks || {})
          }
        });
      }
    } catch (err) {
      console.warn('Failed to load site settings from server, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const res = await settingsAPI.updateSettings(newSettings);
      if (res.success && res.data) {
        const merged = {
          ...defaultSiteSettings,
          ...res.data,
          academic: {
            ...defaultSiteSettings.academic,
            ...(res.data.academic || {})
          },
          payment: {
            ...defaultSiteSettings.payment,
            ...(res.data.payment || {})
          },
          socialLinks: {
            ...defaultSiteSettings.socialLinks,
            ...(res.data.socialLinks || {})
          }
        };
        setSettings(merged);
        return { success: true, message: res.message || 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!', data: merged };
      }
      throw new Error(res.error?.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে');
    } catch (err) {
      console.error('Update settings context error:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings: fetchSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      settings: defaultSiteSettings,
      loading: false,
      updateSettings: async () => ({ success: false }),
      refreshSettings: () => {}
    };
  }
  return context;
};

export default SettingsContext;
