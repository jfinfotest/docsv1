// --- TYPE DEFINITIONS ---
export interface AppConfig {
  title: string;
  subtitle: string;
  icon: string;
}

// Removed: DocsConfig interface - documents are always loaded from public/docs

export interface ThemeConfig {
  defaultTheme: 'light' | 'dark';
  defaultAppTheme: string;
  defaultFont: string;
}

export interface HeaderLink {
  icon: string;
  label: string;
  url: string;
}

export interface HeaderBackgroundConfig {
  enabled: boolean;
  image: string;
  opacity: number;
  overlay: boolean;
  overlayColor: string;
}

export interface HeaderConfig {
  links: HeaderLink[];
  background: HeaderBackgroundConfig;
}

export interface SecondaryNavBackgroundConfig {
  enabled: boolean;
  image: string;
  opacity: number;
  overlay: boolean;
  overlayColor: string;
}

export interface SecondaryNavConfig {
  background: SecondaryNavBackgroundConfig;
}

export interface FooterConfig {
  enabled: boolean;
  text: string;
}

export interface EditPageButtonConfig {
  enabled: boolean;
}

export interface AnnouncementBannerConfig {
  enabled: boolean;
  id: string;
  content: string;
  link: {
    href: string;
    text: string;
  };
}

export interface SidebarBusinessInfoConfig {
  enabled: boolean;
  logo: string;
  title: string;
  link: string;
  footerText: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface I18nConfig {
  enabled: boolean;
  defaultLang: string;
  languages: Language[];
}

export interface VersionConfig {
  enabled: boolean;
  defaultVersion: string;
  versions: string[];
}

export interface UITextConfig {
  [languageCode: string]: UITextTranslations;
}

export interface MaintenanceModeConfig {
  enabled: boolean;
  message: string;
}

export interface UITextTranslations {
  [key: string]: string | ((...params: any[]) => string);
}

export interface GitHubPagesConfig {
  basePath: string;
}

export interface Config {
  app: AppConfig;
  theme: ThemeConfig;
  header: HeaderConfig;
  secondaryNav: SecondaryNavConfig;
  footer: FooterConfig;
  editPageButton: EditPageButtonConfig;
  announcementBanner: AnnouncementBannerConfig;
  sidebarBusinessInfo: SidebarBusinessInfoConfig;
  i18n: I18nConfig;
  version: VersionConfig;
  maintenanceMode: MaintenanceModeConfig;
  uiText: UITextConfig;
  githubPages?: GitHubPagesConfig;
}

// --- CONFIG SERVICE ---
class ConfigService {
  private config: Config | null = null;
  private loading: Promise<Config> | null = null;

  /**
   * Load configuration from config.json
   */
  async loadConfig(): Promise<Config> {
    if (this.config) {
      return this.config;
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = this.fetchConfig();
    this.config = await this.loading;
    this.loading = null;
    
    return this.config;
  }

  private async fetchConfig(): Promise<Config> {
    try {
      const base = getBasePath();
      const url = base ? `${base}/config.json` : 'config.json';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }
      const config = await response.json();
      
      // Process dynamic values like {year}
      this.processDynamicValues(config);
      
      // Make config globally available for path utilities
      if (typeof window !== 'undefined') {
        (window as any).__APP_CONFIG__ = config;
      }
      
      return config;
    } catch (error) {
      console.error('Error loading config.json:', error);
      throw error;
    }
  }

  /**
   * Process dynamic values in configuration
   */
  private processDynamicValues(config: any): void {
    const currentYear = new Date().getFullYear().toString();
    
    // Replace {year} placeholders
    const replaceYear = (obj: any): void => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].replace(/{year}/g, currentYear);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          replaceYear(obj[key]);
        }
      }
    };
    
    replaceYear(config);
  }

  /**
   * Get current configuration (must be loaded first)
   */
  getConfig(): Config | null {
    return this.config;
  }

  /**
   * Get app configuration
   */
  getAppConfig(): AppConfig | null {
    return this.config?.app || null;
  }





  /**
   * Get theme configuration
   */
  getThemeConfig(): ThemeConfig | null {
    return this.config?.theme || null;
  }

  /**
   * Get header links
   */
  getHeaderLinks(): HeaderLink[] {
    return this.config?.header?.links || [];
  }

  /**
   * Get header configuration
   */
  getHeaderConfig(): HeaderConfig | null {
    return this.config?.header || null;
  }

  /**
   * Get secondary navigation configuration
   */
  getSecondaryNavConfig(): SecondaryNavConfig | null {
    return this.config?.secondaryNav || null;
  }

  /**
   * Get footer configuration
   */
  getFooterConfig(): FooterConfig | null {
    return this.config?.footer || null;
  }

  /**
   * Get edit page button configuration
   */
  getEditPageButtonConfig(): EditPageButtonConfig | null {
    return this.config?.editPageButton || null;
  }

  /**
   * Get announcement banner configuration
   */
  getAnnouncementBannerConfig(): AnnouncementBannerConfig | null {
    return this.config?.announcementBanner || null;
  }

  /**
   * Get sidebar business info configuration
   */
  getSidebarBusinessInfoConfig(): SidebarBusinessInfoConfig | null {
    return this.config?.sidebarBusinessInfo || null;
  }

  /**
   * Get i18n configuration
   */
  getI18nConfig(): I18nConfig | null {
    return this.config?.i18n || null;
  }

  /**
   * Get version configuration
   */
  getVersionConfig(): VersionConfig | null {
    return this.config?.version || null;
  }

  /**
   * Get maintenance mode configuration
   */
  getMaintenanceModeConfig(): MaintenanceModeConfig | null {
    return this.config?.maintenanceMode || null;
  }

  /**
   * Get UI text configuration
   */
  getUITextConfig(): UITextConfig | null {
    return this.config?.uiText || null;
  }

  /**
   * Get GitHub Pages configuration
   */
  getGitHubPagesConfig(): GitHubPagesConfig | null {
    return this.config?.githubPages || null;
  }

  /**
   * Get the base path for GitHub Pages deployment
   */
  getBasePath(): string {
    return this.config?.githubPages?.basePath || '';
  }

  /**
   * Utility functions
   */
  getDocsPath(): string {
    return '/docs';
  }
}

// Create singleton instance
export const configService = new ConfigService();

// Export individual getters for backward compatibility
export const getAppConfig = () => configService.getAppConfig();

export const getThemeConfig = () => configService.getThemeConfig();
export const getHeaderLinks = () => configService.getHeaderLinks();
export const getHeaderConfig = () => configService.getHeaderConfig();
export const getSecondaryNavConfig = () => configService.getSecondaryNavConfig();
export const getFooterConfig = () => configService.getFooterConfig();
export const getEditPageButtonConfig = () => configService.getEditPageButtonConfig();
export const getAnnouncementBannerConfig = () => configService.getAnnouncementBannerConfig();
export const getSidebarBusinessInfoConfig = () => configService.getSidebarBusinessInfoConfig();
export const getI18nConfig = () => configService.getI18nConfig();
export const getVersionConfig = () => configService.getVersionConfig();
export const getMaintenanceModeConfig = () => configService.getMaintenanceModeConfig();
export const getUITextConfig = () => configService.getUITextConfig();
export const getGitHubPagesConfig = () => configService.getGitHubPagesConfig();
export const getConfigBasePath = () => configService.getBasePath();

// Utility functions
export const getDocsPath = () => configService.getDocsPath();
import { getBasePath } from '../utils/pathUtils';