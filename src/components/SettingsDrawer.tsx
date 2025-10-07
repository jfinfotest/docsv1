import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNav } from '../context/NavContext';
import { CloseIcon } from './Icons';
import { useI18n } from '../context/I18nContext';
import { usePrismTheme } from '../hooks/usePrismTheme';
import Tooltip from './Tooltip';

interface SettingsDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

declare global {
    interface Window {
        Prism: any;
    }
}

const previewCode = `function greet(name) {
  // A simple comment
  console.log(\`Hello, \${name}!\`);
}

greet('World');`;

const WindowDots = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
    </div>
);

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, setIsOpen }) => {
    const { 
        appTheme, setAppTheme, appThemes,
        font, setFont, fonts
    } = useTheme();
    const { rateLimitInfo } = useNav();
    const { t } = useI18n();
    const previewRef = useRef<HTMLElement>(null);
    
    // Load PrismJS theme styles
    const { theme, setTheme, themeBackground, resetTheme, themes } = usePrismTheme();
    
    useEffect(() => {
        if (previewRef.current && window.Prism) {
            window.Prism.highlightElement(previewRef.current);
        }
    }, []); // Highlight once on mount
    
    useEffect(() => {
        // Re-highlight when theme changes, as some themes add/remove tokens
        if (isOpen && previewRef.current && window.Prism) {
            // Clear existing highlighting first
            previewRef.current.className = 'language-js';
            previewRef.current.style.whiteSpace = 'pre';
            previewRef.current.style.background = 'transparent';
            previewRef.current.innerHTML = previewCode;
            
            // Use a small delay to ensure CSS has loaded
            const timeoutId = setTimeout(() => {
                if (previewRef.current && window.Prism) {
                    window.Prism.highlightElement(previewRef.current);
                }
            }, 100);
            
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen, theme, themeBackground]);

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsOpen(false)}
            ></div>
            <aside
                className={`fixed top-0 right-0 z-50 w-80 h-screen bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform flex flex-col
                           ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                aria-labelledby="settings-drawer-title"
            >
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-6">
                    <h2 id="settings-drawer-title" className="text-xl font-semibold text-gray-800 dark:text-white">{t('settingsTitle')}</h2>
                    <Tooltip content={t('closeSettings')} position="bottom">
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </Tooltip>
                </div>

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto px-6 pb-6">
                    <div className="space-y-6">

                        <div>
                            <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">{t('appTheme')}</label>
                            <div className="grid grid-cols-4 gap-4">
                                {appThemes.map(palette => (
                                    <div key={palette.id} className="flex flex-col items-center space-y-2">
                                        <Tooltip content={t('selectTheme')} position="bottom">
                                            <button
                                                type="button"
                                                onClick={() => setAppTheme(palette.id)}
                                                className={`w-10 h-10 rounded-full focus:outline-none focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200
                                                            ${appTheme === palette.id ? 'ring-2 ring-primary-500' : 'ring-1 ring-gray-300 dark:ring-gray-600 hover:ring-primary-400'}`}
                                                style={{ backgroundColor: palette.colors['primary-500'] }}
                                                aria-label={t('selectTheme')}
                                            />
                                        </Tooltip>
                                        <span className={`text-xs text-center ${appTheme === palette.id ? 'font-semibold text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {palette.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="font-selector" className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">{t('font')}</label>
                            <select
                                id="font-selector"
                                value={font}
                                onChange={(e) => setFont(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                            >
                                {fonts.map(f => (
                                    <option key={f.id} value={f.id} style={{ fontFamily: `'${f.id}', sans-serif` }}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <hr className="border-gray-200 dark:border-gray-700" />
                        
                        <div>
                            <label htmlFor="theme-selector" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t('codeTheme')}</label>
                            <select
                                id="theme-selector"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                            >
                                {themes.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t('preview')}</h3>
                            <div
                                className="rounded-xl overflow-hidden shadow-lg shadow-black/10 dark:shadow-black/20 transition-colors duration-200"
                                style={{ backgroundColor: themeBackground || '#272822' }}
                            >
                                <div className="flex items-center px-4 h-10 bg-black/5 dark:bg-white/5">
                                    <WindowDots />
                                </div>
                                <pre className="p-4 overflow-x-auto !m-0" style={{ background: 'transparent' }}>
                                    <code ref={previewRef} className="language-js" style={{ whiteSpace: 'pre', background: 'transparent' }}>
                                        {previewCode}
                                    </code>
                                </pre>
                            </div>
                        </div>
                        
                        <div>
                             <button
                                onClick={resetTheme}
                                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {t('resetCodeTheme')}
                            </button>
                        </div>




                    </div>
                </div>
            </aside>
        </>
    );
};

export default SettingsDrawer;