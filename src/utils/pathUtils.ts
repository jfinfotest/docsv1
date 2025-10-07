// Utility functions for path handling

// Get the correct base path for assets based on the current environment (synchronous version for compatibility)
export const getBasePath = (): string => {
  // Check if there's a post-build configuration available
  if (typeof window !== 'undefined' && (window as any).APP_CONFIG) {
    const config = (window as any).APP_CONFIG;
    return config.basePath || '';
  }
  
  // For local development
  return '';
};

// Async version that loads from configuration
export const getBasePathAsync = async (): Promise<string> => {
  // Check if there's a post-build configuration available
  if (typeof window !== 'undefined' && (window as any).APP_CONFIG) {
    const config = (window as any).APP_CONFIG;
    return config.basePath || '';
  }
  
  // For local development
  return '';
};