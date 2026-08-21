import React from 'react';

export function SkeletonCard({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl skeleton-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 rounded-lg skeleton-pulse w-3/4" />
              <div className="h-3 rounded-lg skeleton-pulse w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded-lg skeleton-pulse w-full" />
            <div className="h-3 rounded-lg skeleton-pulse w-5/6" />
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <div className="h-4 rounded-lg skeleton-pulse w-1/4" />
            <div className="h-4 rounded-lg skeleton-pulse w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div className="flex justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="h-5 rounded-lg skeleton-pulse w-48" />
        <div className="h-5 rounded-lg skeleton-pulse w-24" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center space-x-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-4 rounded-lg skeleton-pulse flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonKPI({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="h-3 rounded-lg skeleton-pulse w-20" />
            <div className="w-8 h-8 rounded-xl skeleton-pulse" />
          </div>
          <div className="h-7 rounded-lg skeleton-pulse w-24" />
          <div className="h-2.5 rounded-lg skeleton-pulse w-32" />
        </div>
      ))}
    </div>
  );
}
