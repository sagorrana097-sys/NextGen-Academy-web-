import React, { useState } from 'react';
import {
  Database,
  Upload,
  BookOpen,
  Sparkles,
  Layers,
  Award,
  Flame,
  FileCheck
} from 'lucide-react';
import ManualQuestionUploadView from './questionBank/ManualQuestionUploadView';
import QuestionBankBrowserView from './questionBank/QuestionBankBrowserView';
import FinalSuggestionFamilyView from './questionBank/FinalSuggestionFamilyView';
import ChapterTopicQuestionGenerator from './ChapterTopicQuestionGenerator';

export default function QuestionBankManager() {
  const [activeSubTab, setActiveSubTab] = useState('bank'); // 'bank' | 'topic-generator' | 'upload' | 'suggestions'

  const subTabs = [
    {
      id: 'bank',
      label: 'প্রশ্ন ব্যাংক (Question Bank)',
      shortLabel: 'প্রশ্ন ব্যাংক',
      icon: Database,
      desc: 'সকল প্রশ্ন ফিল্টার, সার্চ ও ম্যানেজমেন্ট'
    },
    {
      id: 'topic-generator',
      label: '🎯 অধ্যায় ও টপিকভিত্তিক প্রশ্ন ইঞ্জিন',
      shortLabel: 'টপিক প্রশ্ন ইঞ্জিন',
      icon: Sparkles,
      desc: 'সাধারণ গণিত, উচ্চতর গণিত, পদার্থ ও রসায়নের টপিকভিত্তিক প্রশ্ন'
    },
    {
      id: 'upload',
      label: 'ম্যানুয়াল আপলোড (Manual Upload)',
      shortLabel: 'আপলোড',
      icon: Upload,
      desc: 'Word/PDF আপলোড ও স্বয়ংক্রিয় MCQ এক্সট্রাকশন'
    },
    {
      id: 'suggestions',
      label: 'ফাইনাল সাজেশন (Final Suggestion)',
      shortLabel: 'সাজেশন',
      icon: Flame,
      desc: 'মাল্টি-বোর্ড রিপিটেড প্রশ্ন ও সাজেশন ফ্যামিলি'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP-LEVEL SUBTABS NAVIGATION */}
      <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-2 shadow-lg">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. SUBTAB CONTENT ROUTING */}
      <div>
        {activeSubTab === 'bank' && (
          <QuestionBankBrowserView />
        )}

        {activeSubTab === 'topic-generator' && (
          <ChapterTopicQuestionGenerator />
        )}

        {activeSubTab === 'upload' && (
          <ManualQuestionUploadView
            onNavigateToBank={() => setActiveSubTab('bank')}
            onImportSuccess={() => {}}
          />
        )}

        {activeSubTab === 'suggestions' && (
          <FinalSuggestionFamilyView />
        )}
      </div>
    </div>
  );
}
