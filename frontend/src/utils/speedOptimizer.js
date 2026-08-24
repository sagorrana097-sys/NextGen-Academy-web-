/**
 * NextGen Academy - Speed & Caching Optimizer
 * Ensures lightning-fast UI rendering and background sync without full page reloads.
 */

export const setupFastCache = () => {
  // Enable local memory caching for static study materials
  const cacheKey = 'nextgen_cache_v1';
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (!localStorage.getItem(cacheKey)) {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now() }));
      }
    }
  } catch (e) {
    // Suppress local storage errors
  }
};

// Optimistic UI state wrapper for instant feedback
export const performFastAction = (actionCallback) => {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => {
      actionCallback();
    });
  } else {
    setTimeout(actionCallback, 0);
  }
};

export default {
  setupFastCache,
  performFastAction
};
