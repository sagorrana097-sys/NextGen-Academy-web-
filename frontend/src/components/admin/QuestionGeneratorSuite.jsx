import React, { useState, useEffect } from 'react';
import {
  Database,
  Layers,
  CheckCircle2,
  FileText,
  Award,
  Sparkles,
  BookMarked
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SmartUploadReaderHub from './SmartUploadReaderHub';
import AIQuestionMakerHub from './AIQuestionMakerHub';
import OMRImportModule from './OMRImportModule';
import ChapterTopicQuestionGenerator from './ChapterTopicQuestionGenerator';

export default function QuestionGeneratorSuite({ initialTab = 'mcq-vault' }) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab || 'mcq-vault');

  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'upload-reader' || initialTab === 'smart-upload-reader') {
        setActiveTab('mcq-vault');
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [initialTab]);

  return (
    <div className="space-y-6">
      {/* 5 Distinct Modular Tabs Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Part 1: MCQ Vault */}
          <button
            type="button"
            onClick={() => setActiveTab('mcq-vault')}
            className={'px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ' + (
              activeTab === 'mcq-vault'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>🔘 MCQ ভাণ্ডার</span>
          </button>

          {/* Part 2: CQ Vault */}
          <button
            type="button"
            onClick={() => setActiveTab('cq-vault')}
            className={'px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ' + (
              activeTab === 'cq-vault'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>📑 CQ সৃজনশীল ভাণ্ডার</span>
          </button>

          {/* Part 3: SQ Vault */}
          <button
            type="button"
            onClick={() => setActiveTab('sq-vault')}
            className={'px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ' + (
              activeTab === 'sq-vault'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>📝 SQ সংক্ষিপ্ত ভাণ্ডার</span>
          </button>

          {/* Part 4: Chapter & Topic Generator */}
          <button
            type="button"
            onClick={() => setActiveTab('topic-generator')}
            className={'px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ' + (
              activeTab === 'topic-generator'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>🎯 অধ্যায় ও টপিক জেনারেটর</span>
          </button>

          {/* Part 5: Question Paper Builder */}
          <button
            type="button"
            onClick={() => setActiveTab('question-builder')}
            className={'px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ' + (
              activeTab === 'question-builder' || activeTab === 'question-maker' || activeTab === 'ai-question-maker'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📋 প্রশ্নপত্র বিল্ডার ও প্রিন্টার</span>
          </button>

          {/* Part 6: OMR Evaluation */}
          <button
            type="button"
            onClick={() => setActiveTab('omr-evaluation')}
            className={'px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ' + (
              activeTab === 'omr-evaluation' || activeTab === 'omr'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Award className="w-3.5 h-3.5" />
            <span>📊 OMR মূল্যায়ন</span>
          </button>
        </div>

        <div className="px-3 py-1 bg-slate-100 rounded-xl text-[11px] font-bold text-slate-500 hidden xl:flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>NextGen Manual Suite</span>
        </div>
      </div>

      {/* Render Respective Vault or Builder */}
      {activeTab === 'mcq-vault' && (
        <SmartUploadReaderHub
          key="mcq-vault"
          initialVaultTab="MCQ"
          onNavigateToMaker={() => setActiveTab('question-builder')}
          onNavigateToOMR={() => setActiveTab('omr-evaluation')}
        />
      )}

      {activeTab === 'cq-vault' && (
        <SmartUploadReaderHub
          key="cq-vault"
          initialVaultTab="CQ"
          onNavigateToMaker={() => setActiveTab('question-builder')}
          onNavigateToOMR={() => setActiveTab('omr-evaluation')}
        />
      )}

      {activeTab === 'sq-vault' && (
        <SmartUploadReaderHub
          key="sq-vault"
          initialVaultTab="SQ"
          onNavigateToMaker={() => setActiveTab('question-builder')}
          onNavigateToOMR={() => setActiveTab('omr-evaluation')}
        />
      )}

      {activeTab === 'topic-generator' && (
        <ChapterTopicQuestionGenerator />
      )}

      {(activeTab === 'question-builder' || activeTab === 'question-maker' || activeTab === 'ai-question-maker') && (
        <AIQuestionMakerHub
          onNavigateToUpload={() => setActiveTab('mcq-vault')}
          onNavigateToOMR={() => setActiveTab('omr-evaluation')}
        />
      )}

      {(activeTab === 'omr-evaluation' || activeTab === 'omr') && (
        <OMRImportModule
          onNavigateToUpload={() => setActiveTab('mcq-vault')}
          onNavigateToMaker={() => setActiveTab('question-builder')}
        />
      )}
    </div>
  );
}
