// Utility functions for path handling

// Cache for basePath to avoid repeated calculations
let cachedBasePath: string | null = null;
let basePathListeners: ((basePath: string) => void)[] = [];

// Listen for basePath updates from the auto-initialization script
if (typeof window !== 'undefined') {
  window.addEventListener('basepath-updated', (event: any) => {
    const newBasePath = event.detail?.basePath;
    if (newBasePath && newBasePath !== cachedBasePath) {
      cachedBasePath = newBasePath;
      // Notify all listeners about the basePath change
      basePathListeners.forEach(listener => listener(newBasePath));
    }
  });
}

// Subscribe to basePath changes
export const onBasePathChange = (callback: (basePath: string) => void): (() => void) => {
  basePathListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = basePathListeners.indexOf(callback);
    if (index > -1) {
      basePathListeners.splice(index, 1);
    }
  };
};

// Get the correct base path for assets based on the current environment (synchronous version for compatibility)
export const getBasePath = (): string => {
  // Return cached value if available
  if (cachedBasePath !== null) {
    return cachedBasePath;
  }

  // Priority 1: Check meta tag (set by update-basepath.js)
  if (typeof window !== 'undefined') {
    const metaTag = document.querySelector('meta[name="base-url"]');
    if (metaTag) {
      const basePath = metaTag.getAttribute('content');
      if (basePath && basePath !== './') {
        cachedBasePath = basePath;
        return basePath;
      }
    }
  }

  // Priority 2: Check APP_CONFIG (set by basepath-init.js)
  if (typeof window !== 'undefined' && (window as any).APP_CONFIG) {
    const config = (window as any).APP_CONFIG;
    const basePath = config.basePath || '';
    cachedBasePath = basePath;
    return basePath;
  }
  
  // Priority 3: Try to detect from URL structure (for GitHub Pages)
  if (typeof window !== 'undefined') {
    try {
      // For GitHub Pages, try to detect from URL structure
      if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/').filter(part => part);
        if (pathParts.length > 0) {
          const detectedBasePath = '/' + pathParts[0] + '/';
          cachedBasePath = detectedBasePath;
          return detectedBasePath;
        }
      }
      
      // Fallback: try to read from a global config if available
      if ((window as any).__APP_CONFIG__) {
        const config = (window as any).__APP_CONFIG__;
        const basePath = config.githubPages?.basePath || '';
        cachedBasePath = basePath;
        return basePath;
      }
    } catch (error) {
      console.warn('Could not detect basePath:', error);
    }
  }
  
  // For local development
  cachedBasePath = '';
  return '';
};

// Async version that loads from configuration
export const getBasePathAsync = async (): Promise<string> => {
  // Return cached value if available
  if (cachedBasePath !== null) {
    return cachedBasePath;
  }

  // Try synchronous detection first
  const syncBasePath = getBasePath();
  if (syncBasePath) {
    return syncBasePath;
  }
  
  // Try to fetch the config.json directly for GitHub Pages basePath
  if (typeof window !== 'undefined') {
    try {
      // Try multiple possible config.json locations
      const possibleUrls = [
        '/config.json',
        './config.json'
      ];
      
      // If we can detect a possible basePath from URL, try that too
      if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/').filter(part => part);
        if (pathParts.length > 0) {
          possibleUrls.unshift(`/${pathParts[0]}/config.json`);
        }
      }
      
      for (const configUrl of possibleUrls) {
        try {
          const response = await fetch(configUrl);
          if (response.ok) {
            const config = await response.json();
            const basePath = config.githubPages?.basePath || '';
            if (basePath) {
              cachedBasePath = basePath;
              
              // Update APP_CONFIG if available
              if ((window as any).APP_CONFIG) {
                (window as any).APP_CONFIG.basePath = basePath;
              } else {
                (window as any).APP_CONFIG = { basePath };
              }
              
              return basePath;
            }
          }
        } catch (error) {
          // Continue to next URL
          continue;
        }
      }
    } catch (error) {
      console.warn('Could not fetch config.json for basePath:', error);
    }
  }
  
  // For local development
  cachedBasePath = '';
  return '';
};

// Utility function to build full paths with basePath
export const buildPath = (relativePath: string): string => {
  const basePath = getBasePath();
  const cleanRelativePath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return basePath ? `${basePath}${cleanRelativePath}` : `/${cleanRelativePath}`;
};

// Utility function to clear the cache (useful for testing or manual updates)
export const clearBasePathCache = (): void => {
  cachedBasePath = null;
};