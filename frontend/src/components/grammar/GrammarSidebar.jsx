import React, { useState } from 'react';
import {
  BookOpen, Search, ChevronDown, ChevronRight, CheckCircle2,
  Bookmark, Sparkles, Layers, Award, Clock, X, Menu
} from 'lucide-react';

export default function GrammarSidebar({
  chapters = [],
  activeChapterId,
  activeTopicSlug,
  onSelectChapter,
  onSelectTopic,
  completedTopicIds = [],
  bookmarkedTopicIds = [],
  isOpenMobile,
  onCloseMobile,
  searchQuery,
  onSearchChange
}) {
  const [expandedChapterIds, setExpandedChapterIds] = useState({ [activeChapterId || 1]: true });

  const toggleChapterExpand = (chapterId, e) => {
    e?.stopPropagation();
    setExpandedChapterIds(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const filteredChapters = chapters.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.titleEn && c.titleEn.toLowerCase().includes(q)) ||
      (c.titleBn && c.titleBn.toLowerCase().includes(q)) ||
      (c.descriptionBn && c.descriptionBn.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-20 inset-y-0 left-0 z-50 lg:z-10 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col h-full lg:h-[calc(100vh-6rem)] transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } lg:rounded-3xl lg:border lg:shadow-xs`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                অধ্যায়সমূহ (Chapters)
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                ২৩টি চ্যাপ্টার • ১০০+ টপিক
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Box in Sidebar */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="অধ্যায় বা টপিক খুঁজুন..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
        </div>

        {/* Chapters & Topics List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {filteredChapters.map((chapter) => {
            const isChapterActive = activeChapterId === chapter.id;
            const isExpanded = expandedChapterIds[chapter.id];
            const topics = chapter.topics || [];

            return (
              <div
                key={chapter.id}
                className={`rounded-2xl transition-all overflow-hidden border ${
                  isChapterActive
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800/60'
                    : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Chapter Row */}
                <div
                  onClick={() => onSelectChapter(chapter)}
                  className="p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 ${
                        isChapterActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {chapter.chapterNo}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-black truncate ${
                          isChapterActive
                            ? 'text-indigo-700 dark:text-indigo-300'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {chapter.titleBn}
                      </p>
                      <p className="text-[10px] text-slate-400 font-english truncate">
                        {chapter.titleEn}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleChapterExpand(chapter.id, e)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Topics Sub-list */}
                {isExpanded && topics.length > 0 && (
                  <div className="pl-9 pr-2 pb-2 pt-0.5 space-y-0.5 border-t border-slate-100 dark:border-slate-800/60">
                    {topics.map((topic) => {
                      const isTopicActive = activeTopicSlug === topic.slug || activeTopicSlug === String(topic.id);
                      const isCompleted = completedTopicIds.includes(topic.id);
                      const isBookmarked = bookmarkedTopicIds.includes(topic.id);

                      return (
                        <div
                          key={topic.id || topic.slug}
                          onClick={() => {
                            onSelectTopic(topic, chapter);
                            if (onCloseMobile) onCloseMobile();
                          }}
                          className={`p-2 rounded-xl text-xs flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                            isTopicActive
                              ? 'bg-indigo-600 text-white font-bold shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate leading-snug">
                            {topic.titleBn}
                          </span>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isCompleted && (
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isTopicActive ? 'text-emerald-300' : 'text-emerald-500'}`} />
                            )}
                            {isBookmarked && (
                              <Bookmark className={`w-3 h-3 fill-current ${isTopicActive ? 'text-amber-300' : 'text-amber-500'}`} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
