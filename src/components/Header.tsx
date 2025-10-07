import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { MenuIcon, MoonIcon, SunIcon, SettingsIcon, TwitterIcon, DiscordIcon, GitHubIcon, TranslateIcon, VersionsIcon, ChevronDownIcon, InfoCircleIcon, SearchIcon, CloseIcon } from './Icons';
import { configService } from '../services/configService';
import AppIcon from './AppIcon';
import SearchBar from './SearchBar';
import Tooltip from './Tooltip';
import { useI18n } from '../context/I18nContext';
import { useVersion } from '../context/VersionContext';
import AccessibleDropdown from './AccessibleDropdown';


interface HeaderProps {
    onMenuClick: () => void;
    onSettingsClick: () => void;
    onAboutClick: () => void;
    showMenuButton?: boolean;
}

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    Twitter: TwitterIcon,
    Discord: DiscordIcon,
    GitHub: GitHubIcon,
};

// Dropdown accesible movido a componente independiente


const Header: React.FC<HeaderProps> = ({ onMenuClick, onSettingsClick, onAboutClick, showMenuButton = true }) => {
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const { t, lang, setLang, languages } = useI18n();
    const { version, setVersion, versions } = useVersion();
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [configs, setConfigs] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadConfigs = async () => {
            try {
                // Primero cargar toda la configuración
                await configService.loadConfig();
                // Luego obtener las configuraciones específicas
                const appConfig = configService.getAppConfig();
                const headerConfig = configService.getHeaderConfig();
                const i18nConfig = configService.getI18nConfig();
                const versionConfig = configService.getVersionConfig();
                setConfigs({
                    app: appConfig,
                    header: headerConfig,
                    headerLinks: headerConfig?.links || [],
                    i18n: i18nConfig,
                    version: versionConfig
                });
            } catch (error) {
                console.error('Error loading header configs:', error);
            }
        };
        loadConfigs();
    }, []);

    if (!configs || !configs.app) {
        return <div>Loading...</div>;
    }

    const validLinks = configs.headerLinks.filter((link: any) => iconMap[link.icon] && link.url);

    // Generar estilos de fondo dinámicos
    const getHeaderStyles = () => {
        const headerBg = configs.header?.background;
        if (!headerBg?.enabled || !headerBg.image) {
            return {};
        }

        const styles: React.CSSProperties = {
            backgroundImage: `url(${headerBg.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };

        if (headerBg.overlay) {
            styles.position = 'relative';
        }

        return styles;
    };

    const getOverlayStyles = () => {
        const headerBg = configs.header?.background;
        if (!headerBg?.enabled || !headerBg.overlay) {
            return {};
        }

        return {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: headerBg.overlayColor,
            opacity: headerBg.opacity,
            pointerEvents: 'none' as const,
        };
    };

    const headerBg = configs.header?.background;
    const hasBackground = headerBg?.enabled && headerBg.image;
    const baseClasses = "relative flex-shrink-0 z-60 border-b border-primary-600 w-full";
    const bgClasses = hasBackground ? "" : "bg-primary-700";

    return (
        <header 
            className={`${baseClasses} ${bgClasses}`}
            style={getHeaderStyles()}
        >
            {hasBackground && headerBg?.overlay && (
                <div style={getOverlayStyles()} />
            )}
            {/* Main header bar */}
            <div className="relative z-10 flex items-center justify-between px-6 tablet:px-6 laptop:px-8 h-16 tablet:h-16 laptop:h-16">
                {/* Left section - Menu button and logo */}
                <div className="flex items-center min-w-0 flex-shrink-0">
                    {showMenuButton && (
                        <Tooltip content={t('openNavigationMenu')} position="bottom">
                            <button 
                                onClick={onMenuClick} 
                                className="text-primary-200 hover:text-white focus:outline-none laptop:hidden mr-3 p-1.5"
                                aria-label="Toggle menu"
                            >
                                <MenuIcon className="w-6 h-6 tablet:w-6 tablet:h-6" />
                            </button>
                        </Tooltip>
                    )}
                    
                    {/* Desktop logo and title */}
                    <div className="hidden laptop:flex items-center space-x-2.5 text-white">
                        <AppIcon className="h-8 w-8 desktop:h-10 desktop:w-10 text-3xl desktop:text-4xl flex-shrink-0" />
                        <div className="min-w-0">
                            <span className="block text-lg desktop:text-xl font-semibold leading-tight truncate">{configs.app.title}</span>
                            {configs.app.subtitle && (
                                <span className="block text-xs desktop:text-xs text-primary-200/80 leading-tight truncate">{configs.app.subtitle}</span>
                            )}
                        </div>
                    </div>
                    
                    {/* Tablet logo with title */}
                    <div className="hidden tablet:flex laptop:hidden items-center space-x-1.5 text-white">
                        <AppIcon className="h-8 w-8 text-3xl flex-shrink-0" />
                        <div className="min-w-0">
                            <span className="block text-base font-semibold leading-tight truncate">{configs.app.title}</span>
                        </div>
                    </div>
                    
                    {/* Mobile logo - only icon */}
                    <div className="tablet:hidden flex items-center text-white">
                        <AppIcon className="h-8 w-8 xs:h-9 xs:w-9 text-3xl xs:text-4xl" />
                    </div>
                </div>

                {/* Center section - Mobile title (only on very small screens) */}
                <div className="flex-1 flex justify-center tablet:hidden px-3 min-w-0">
                    <div className="text-center text-white max-w-full">
                        <span className="block text-sm xs:text-base font-semibold leading-tight truncate">{configs.app.title}</span>
                        {configs.app.subtitle && (
                            <span className="hidden xs:block text-xs text-primary-200/80 leading-tight truncate">{configs.app.subtitle}</span>
                        )}
                    </div>
                </div>
            
                {/* Right section - Search, dropdowns and action buttons */}
                <div className="flex items-center min-w-0 flex-shrink-0">
                    {/* Desktop search bar */}
                    <div className="hidden desktop:block max-w-xs mr-4">
                        <SearchBar />
                    </div>
                    
                    {/* External links - desktop only */}
                    {validLinks.length > 0 && (
                        <>
                            <div className="hidden desktop:flex items-center space-x-0.5 mr-2.5">
                                {validLinks.map((link) => {
                                    const IconComponent = iconMap[link.icon];
                                    return (
                                        <Tooltip key={link.icon} content={`${link.label}`} position="bottom">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-9 h-9 rounded-full text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none transition-colors duration-200"
                                                aria-label={link.label}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                            </a>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                            <div className="hidden desktop:block w-px h-6 bg-primary-500/50 mr-3"></div>
                        </>
                    )}
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-0.5">
                        {/* Dark mode toggle */}
                        <Tooltip content={isDarkMode ? t('switchToLightMode') : t('switchToDarkMode')} position="bottom">
                            <button
                                onClick={() => toggleDarkMode()}
                                className="hidden desktop:flex items-center justify-center w-7 h-7 tablet:w-8 tablet:h-8 laptop:w-9 laptop:h-9 rounded-full text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none transition-colors duration-200"
                                aria-label={t('toggleDarkMode')}
                            >
                                {isDarkMode ? (
                                    <SunIcon className="w-4 h-4 tablet:w-5 tablet:h-5 laptop:w-6 laptop:h-6" />
                                ) : (
                                    <MoonIcon className="w-4 h-4 tablet:w-5 tablet:h-5 laptop:w-6 laptop:h-6" />
                                )}
                            </button>
                        </Tooltip>
                        
                        {/* Settings button */}
                        <Tooltip content={t('openSettings')} position="bottom">
                            <button
                                onClick={onSettingsClick}
                                className="hidden desktop:flex items-center justify-center w-7 h-7 tablet:w-8 tablet:h-8 laptop:w-9 laptop:h-9 rounded-full text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none transition-colors duration-200"
                                aria-label={t('openSettings')}
                            >
                                <SettingsIcon className="w-4 h-4 tablet:w-5 tablet:h-5 laptop:w-6 laptop:h-6" />
                            </button>
                        </Tooltip>
                        
                        {/* About button */}
                        <Tooltip content={t('openAbout')} position="bottom">
                            <button
                                onClick={onAboutClick}
                                className="hidden desktop:flex items-center justify-center w-7 h-7 tablet:w-8 tablet:h-8 laptop:w-9 laptop:h-9 rounded-full text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none transition-colors duration-200"
                                aria-label={t('openAbout')}
                            >
                                <InfoCircleIcon className="w-4 h-4 tablet:w-5 tablet:h-5 laptop:w-6 laptop:h-6" />
                            </button>
                        </Tooltip>
                        

                        
                        {/* Mobile menu toggle - positioned at the end */}
                        <Tooltip content={showMobileMenu ? t('hideMenu') : t('showMenu')} position="bottom">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="desktop:hidden flex items-center justify-center w-7 h-7 tablet:w-8 tablet:h-8 rounded-full text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none transition-colors duration-200"
                                aria-label={showMobileMenu ? t('hideMenu') : t('showMenu')}
                            >
                                <MenuIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />
                            </button>
                        </Tooltip>
                    </div>

                    {/* Divider before language and version dropdowns */}
                    {(languages.length > 1) || (versions.length > 1) && <div className="hidden laptop:block w-px h-6 bg-primary-500/50 ml-3 mr-3"></div>}

                    {/* Language and version dropdowns - positioned at the far right */}
                    <div className="hidden laptop:flex items-center space-x-1.5">
                        {languages.length > 1 && (
                            <AccessibleDropdown
                                Icon={TranslateIcon}
                                options={languages.map(l => ({ value: l.code, label: l.name }))}
                                value={lang}
                                onChange={(newLang) => {
                                    setLang(newLang);
                                    navigate('/');
                                }}
                                ariaLabel={t('language')}
                            />
                        )}
                        {versions.length > 1 && (
                            <AccessibleDropdown
                                Icon={VersionsIcon}
                                options={versions.map(v => ({ value: v, label: v }))}
                                value={version}
                                onChange={(newVersion) => {
                                    setVersion(newVersion);
                                    navigate('/');
                                }}
                                ariaLabel={t('version')}
                            />
                        )}
                    </div>
                </div>
            </div>
            
            {/* Mobile/Tablet search overlay */}
            {showMobileSearch && (
                <div className="absolute inset-0 bg-primary-700 z-50 h-16 tablet:h-16 laptop:h-16">
                    <div className="h-full flex items-center px-6 tablet:px-6">
                        <div className="flex-1 mr-3">
                            <SearchBar />
                        </div>
                        <Tooltip content={t('closeSearch')} position="bottom">
                            <button
                                onClick={() => setShowMobileSearch(false)}
                                className="text-primary-200 hover:text-white focus:outline-none w-8 h-8 tablet:w-9 tablet:h-9 flex items-center justify-center rounded transition-colors"
                                aria-label={t('closeSearch')}
                            >
                                <CloseIcon className="w-5 h-5 tablet:w-6 tablet:h-6" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            )}
            
            {/* Mobile/Tablet navigation menu for dropdowns */}
            {showMobileMenu && (validLinks.length > 0 || (languages.length > 1) || (versions.length > 1)) && (
                <div className="desktop:hidden border-t border-primary-600 bg-primary-700 relative z-10">
                        <div className="px-3 tablet:px-4 py-2 tablet:py-3">
                        {/* External links */}
                        {validLinks.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {validLinks.map((link) => {
                                    const IconComponent = iconMap[link.icon];
                                    return (
                                        <a
                                            key={link.icon}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 transition-colors text-sm tablet:text-base"
                                            aria-label={link.label}
                                        >
                                            <IconComponent className="w-4 h-4 tablet:w-5 tablet:h-5" />
                                            <span>{link.label}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                        
                        {/* Action buttons for mobile/tablet */}
                        <div className="desktop:hidden">
                            {(validLinks.length > 0 || (languages.length > 1) || (versions.length > 1)) && <div className="w-full border-t border-primary-600 mb-3"></div>}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                {/* Search button */}
                                <button
                                    onClick={() => {
                                        setShowMobileSearch(!showMobileSearch);
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 transition-colors text-sm tablet:text-base"
                                    aria-label={t('search')}
                                >
                                    <SearchIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />
                                    <span>{t('search')}</span>
                                </button>
                                
                                {/* Dark mode toggle */}
                                <button
                                    onClick={() => toggleDarkMode()}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 transition-colors text-sm tablet:text-base"
                                    aria-label={t('toggleDarkMode')}
                                >
                                    {isDarkMode ? (
                                        <SunIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />
                                    ) : (
                                        <MoonIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />
                                    )}
                                    <span>{isDarkMode ? t('lightMode') : t('darkMode')}</span>
                                </button>
                                
                                {/* Settings button */}
                                <button
                                    onClick={() => {
                                        onSettingsClick();
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 transition-colors text-sm tablet:text-base"
                                    aria-label={t('openSettings')}
                                >
                                    <SettingsIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />
                                    <span>{t('settings')}</span>
                                </button>
                                
                                {/* About button */}
                                <button
                                    onClick={() => {
                                        onAboutClick();
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 transition-colors text-sm tablet:text-base"
                                    aria-label={t('openAbout')}
                                >
                                    <InfoCircleIcon className="w-4 h-4 tablet:w-5 tablet:h-5" />
                                    <span>{t('about')}</span>
                                </button>
                                

                            </div>
                        </div>
                        
                        {/* Language and version dropdowns for mobile/tablet */}
                        {(languages.length > 1) || (versions.length > 1) && (
                            <div className="laptop:hidden flex flex-wrap gap-2 w-full">
                                {languages.length > 1 && (
                                    <div className="flex-1 min-w-0">
                                        <AccessibleDropdown
                                            Icon={TranslateIcon}
                                            options={languages.map(l => ({ value: l.code, label: l.name }))}
                                            value={lang}
                                            onChange={(newLang) => {
                                                setLang(newLang);
                                                navigate('/');
                                            }}
                                            ariaLabel={t('language')}
                                        />
                                    </div>
                                )}
                                {versions.length > 1 && (
                                    <div className="flex-1 min-w-0">
                                        <AccessibleDropdown
                                            Icon={VersionsIcon}
                                            options={versions.map(v => ({ value: v, label: v }))}
                                            value={version}
                                            onChange={(newVersion) => {
                                                setVersion(newVersion);
                                                navigate('/');
                                            }}
                                            ariaLabel={t('version')}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                </div>
            )}
        </header>
    );
};

export default Header;