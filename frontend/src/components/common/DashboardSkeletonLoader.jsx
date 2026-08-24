import React from 'react';

/**
 * Modern Pulse Skeleton Loader for Dashboards & Pages
 * Prevents layout shift and replaces harsh spinning loaders with realistic UI wireframe shimmers.
 */
export default function DashboardSkeletonLoader({
  cardsCount = 4,
  showHero = true,
  showSideCards = true,
  type = 'dashboard'
}) {
  return (
    <div className="space-y-6 animate-pulse select-none p-1">
      {/* Top Hero Banner Skeleton */}
      {showHero && (
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-3 w-full max-w-lg">
            <div className="h-3 w-28 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-8 w-64 bg-slate-300 dark:bg-slate-700 rounded-2xl"></div>
            <div className="h-4 w-80 bg-slate-300/70 dark:bg-slate-700/70 rounded-xl"></div>
          </div>
          <div className="hidden sm:flex gap-3">
            <div className="h-10 w-28 bg-slate-300 dark:bg-slate-700 rounded-2xl"></div>
            <div className="h-10 w-32 bg-slate-300 dark:bg-slate-700 rounded-2xl"></div>
          </div>
        </div>
      )}

      {/* KPI Stats Grid Skeleton */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cardsCount} gap-4 sm:gap-5`}>
        {Array.from({ length: cardsCount }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
            </div>
            <div className="h-7 w-28 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-2.5 w-36 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Main Content 2-Column Split Wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Section (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="h-5 w-44 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-16 w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
              <div className="h-16 w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
              <div className="h-16 w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Right / Sidebar Section (1 col) */}
        {showSideCards && (
          <div className="space-y-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              <div className="space-y-3">
                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
