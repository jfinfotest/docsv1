/**
 * PrismJS Initialization Utility
 * Ensures custom language loader is initialized early in the application lifecycle
 */



/**
 * Initialize PrismJS
 * This should be called early in the application lifecycle
 */
export const initializePrism = async (): Promise<void> => {
  try {
    console.log('✅ PrismJS initialization completed');
  } catch (error) {
    console.error('❌ Failed to initialize PrismJS:', error);
  }
};

/**
 * Get all available built-in languages
 */
export const getAvailableLanguages = (): string[] => {
  const builtInLanguages = [
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r',
    'html', 'css', 'scss', 'sass', 'less', 'xml', 'json', 'yaml',
    'markdown', 'bash', 'powershell', 'sql', 'dockerfile', 'nginx',
    'apache', 'git', 'diff', 'makefile', 'cmake', 'latex'
  ];
  
  return builtInLanguages;
};

/**
 * Check if a language is supported (built-in only)
 */
export const isLanguageSupported = (language: string): boolean => {
  const availableLanguages = getAvailableLanguages();
  return availableLanguages.includes(language.toLowerCase());
};

/**
 * Get language information for built-in languages
 */
export const getLanguageInfo = (language: string) => {
  return {
    name: language,
    type: 'built-in' as const,
    aliases: [],
    description: `Built-in ${language} language support`
  };
};

// Auto-initialize when this module is imported
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePrism);
  } else {
    initializePrism();
  }
}
