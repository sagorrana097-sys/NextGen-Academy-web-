import React, { useState, useEffect } from 'react';
import {
  Upload,
  Bot,
  Award,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SmartUploadReaderHub from './SmartUploadReaderHub';
import AIQuestionMakerHub from './AIQuestionMakerHub';
import OMRImportModule from './OMRImportModule';

export default function QuestionGeneratorSuite({ initialTab = 'upload-reader' }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab || 'upload-reader');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="space-y-6">
      {/* 3-Part Modular Tabs Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Part 1: Smart Upload & AI Reader */}
          <button
            type="button"
            onClick={() => setActiveTab('upload-reader')}
            className={'px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ' + (
              activeTab === 'upload-reader' || activeTab === 'smart-upload-reader'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Upload className="w-4 h-4" />
            <span>📤 পার্ট ১: স্মার্ট আপলোড ও এআই রিডার হাব</span>
          </button>

          {/* Part 2: AI Question Maker */}
          <button
            type="button"
            onClick={() => setActiveTab('question-maker')}
            className={'px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ' + (
              activeTab === 'question-maker' || activeTab === 'ai-question-maker'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Bot className="w-4 h-4" />
            <span>🤖 পার্ট ২: এআই প্রশ্ন জেনারেটর ও মেকার হাব</span>
          </button>

          {/* Part 3: OMR Evaluation */}
          <button
            type="button"
            onClick={() => setActiveTab('omr-evaluation')}
            className={'px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ' + (
              activeTab === 'omr-evaluation' || activeTab === 'omr'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Award className="w-4 h-4" />
            <span>📋 পার্ট ৩: OMR ফলাফল ও শিট মূল্যায়ন হাব</span>
          </button>
        </div>

        <div className="px-3 py-1 bg-slate-100 rounded-xl text-[11px] font-bold text-slate-500 hidden lg:flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>NextGen 3-Part Modular Suite</span>
        </div>
      </div>

      {/* Render Respective Modular Part */}
      {(activeTab === 'upload-reader' || activeTab === 'smart-upload-reader' || activeTab === 'question-bank') && (
        <SmartUploadReaderHub
          onNavigateToMaker={() => setActiveTab('question-maker')}
          onNavigateToOMR={() => setActiveTab('omr-evaluation')}
        />
      )}

      {(activeTab === 'question-maker' || activeTab === 'ai-question-maker') && (
        <AIQuestionMakerHub
          onNavigateToUpload={() => setActiveTab('upload-reader')}
          onNavigateToOMR={() => setActiveTab('omr-evaluation')}
        />
      )}

      {(activeTab === 'omr-evaluation' || activeTab === 'omr') && (
        <OMRImportModule
          onNavigateToUpload={() => setActiveTab('upload-reader')}
          onNavigateToMaker={() => setActiveTab('question-maker')}
        />
      )}
    </div>
  );
}
