// Utility functions for path handling

// Get the correct base path for assets based on the current environment (synchronous version for compatibility)
export const getBasePath = (): string => {
  // First, try to read from meta tag (set by update-basepath.js)
  if (typeof window !== 'undefined') {
    const metaTag = document.querySelector('meta[name="base-url"]');
    if (metaTag) {
      const basePath = metaTag.getAttribute('content');
      if (basePath && basePath !== './') {
        return basePath;
      }
    }
  }

  // Check if there's a post-build configuration available
  if (typeof window !== 'undefined' && (window as any).APP_CONFIG) {
    const config = (window as any).APP_CONFIG;
    return config.basePath || '';
  }
  
  // Try to read from the loaded config.json (for GitHub Pages)
  if (typeof window !== 'undefined') {
    try {
      // Fallback: try to read from a global config if available
      if ((window as any).__APP_CONFIG__) {
        const config = (window as any).__APP_CONFIG__;
        return config.githubPages?.basePath || '';
      }
    } catch (error) {
      console.warn('Could not read basePath from config:', error);
    }
  }
  
  // For local development
  return '';
};

// Async version that loads from configuration
export const getBasePathAsync = async (): Promise<string> => {
  // First, try to read from meta tag (set by update-basepath.js)
  if (typeof window !== 'undefined') {
    const metaTag = document.querySelector('meta[name="base-url"]');
    if (metaTag) {
      const basePath = metaTag.getAttribute('content');
      if (basePath && basePath !== './') {
        return basePath;
      }
    }
  }

  // Check if there's a post-build configuration available
  if (typeof window !== 'undefined' && (window as any).APP_CONFIG) {
    const config = (window as any).APP_CONFIG;
    return config.basePath || '';
  }
  
  // Try to fetch the config.json directly for GitHub Pages basePath
  if (typeof window !== 'undefined') {
    try {
      // Try with current basePath first
      const currentBasePath = getBasePath();
      const configUrl = currentBasePath ? `${currentBasePath}config.json` : '/config.json';
      
      const response = await fetch(configUrl);
      if (response.ok) {
        const config = await response.json();
        return config.githubPages?.basePath || '';
      }
    } catch (error) {
      console.warn('Could not fetch config.json for basePath:', error);
    }
  }
  
  // For local development
  return '';
};