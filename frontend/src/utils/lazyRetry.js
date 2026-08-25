import React from 'react';

/**
 * Resilient lazy loader with automatic retry mechanism.
 * Mitigates mobile network drops, transient 404s after new builds, and chunk load failures.
 */
export function lazyRetry(componentImport, retriesLeft = 2, interval = 1000) {
  return React.lazy(() =>
    new Promise((resolve, reject) => {
      componentImport()
        .then(resolve)
        .catch((error) => {
          if (retriesLeft === 0) {
            // Attempt auto-reload once per session if chunk failed to load
            try {
              const reloadKey = 'nextgen_lazy_chunk_reload';
              if (!sessionStorage.getItem(reloadKey)) {
                sessionStorage.setItem(reloadKey, 'true');
                window.location.reload();
                return;
              }
            } catch (_) {}
            reject(error);
            return;
          }
          setTimeout(() => {
            lazyRetry(componentImport, retriesLeft - 1, interval);
          }, interval);
        });
    })
  );
}

export default lazyRetry;
