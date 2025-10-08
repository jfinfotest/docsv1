// Auto-initialization script for dynamic basePath detection
// This script runs automatically when the page loads

(function() {
  'use strict';
  
  function getBasePath() {
    // Priority 1: Check meta tag
    const metaTag = document.querySelector('meta[name="base-url"]');
    if (metaTag && metaTag.content) {
      return metaTag.content;
    }
    
    // Priority 2: Check window.APP_CONFIG
    if (window.APP_CONFIG && window.APP_CONFIG.basePath) {
      return window.APP_CONFIG.basePath;
    }
    
    // Priority 3: Try to load config.json from possible basePath
    const currentPath = window.location.pathname;
    const possibleBasePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    
    // For GitHub Pages, try to detect from URL structure
    if (window.location.hostname.includes('github.io')) {
      const pathParts = currentPath.split('/').filter(part => part);
      if (pathParts.length > 0) {
        return '/' + pathParts[0] + '/';
      }
    }
    
    return possibleBasePath || '/';
  }
  
  function updateBasePath() {
    const detectedBasePath = getBasePath();
    
    // Update window.APP_CONFIG
    if (!window.APP_CONFIG) {
      window.APP_CONFIG = {};
    }
    window.APP_CONFIG.basePath = detectedBasePath;
    
    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('basepath-updated', {
      detail: { basePath: detectedBasePath }
    }));
    
    console.log('🔧 BasePath auto-detected:', detectedBasePath);
  }
  
  // Initialize immediately
  updateBasePath();
  
  // Check for changes periodically (for dynamic updates)
  setInterval(updateBasePath, 5000);
  
})();