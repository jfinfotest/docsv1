import React, { createContext, useContext, ReactNode, useState, useLayoutEffect, useEffect } from 'react';
import { usePrismTheme, UsePrismThemeResult } from '../hooks/usePrismTheme';
import { useFont, UseFontResult } from '../hooks/useFont';
import { THEMES, hexToRgb, ThemePalette } from '../themes';
import { FONTS } from '../config/fonts';
import { getThemeConfig } from '../services/configService';

// Combine prism theme, app theme, and font into one context type
interface AppThemeContextType extends UsePrismThemeResult, UseFontResult {
    appTheme: string;
    setAppTheme: (themeId: string) => void;
    appThemes: ThemePalette[];
}

const defaultState: AppThemeContextType = {
    theme: '',
    setTheme: () => {},
    themeBackground: null,
    resetTheme: () => {},
    themes: [],
    appTheme: THEMES[0]?.id || 'default',
    setAppTheme: () => {},
    appThemes: THEMES,
    font: FONTS[0]?.id || 'Inter',
    setFont: () => {},
    fonts: FONTS,
};

const ThemeContext = createContext<AppThemeContextType>(defaultState);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const prismThemeState = usePrismTheme();
    const fontState = useFont();
    const [appTheme, _setAppTheme] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('app-theme');
            if (savedTheme) return savedTheme;
        }
        // Default to first theme until config loads
        return THEMES[0]?.id || 'default';
    });

    // Load theme config and set default app theme if no saved preference
    useEffect(() => {
        const loadThemeConfig = async () => {
            if (typeof window !== 'undefined') {
                const savedTheme = localStorage.getItem('app-theme');
                if (!savedTheme) {
                    try {
                        const themeConfig = await getThemeConfig();
                        if (themeConfig?.defaultAppTheme) {
                            _setAppTheme(themeConfig.defaultAppTheme);
                        }
                    } catch (error) {
                        console.error('Error loading theme config:', error);
                    }
                }
            }
        };
        loadThemeConfig();
    }, []);

    const setAppTheme = (themeId: string) => {
        if (THEMES.find(t => t.id === themeId)) {
            localStorage.setItem('app-theme', themeId);
            _setAppTheme(themeId);
        }
    };

    useLayoutEffect(() => {
        const currentTheme = THEMES.find(t => t.id === appTheme) || THEMES[0];
        if (currentTheme) {
            const root = document.documentElement;
            Object.entries(currentTheme.colors).forEach(([key, value]) => {
                const rgbValue = hexToRgb(value);
                if (rgbValue) {
                    root.style.setProperty(`--color-${key}`, rgbValue);
                }
            });
        }
    }, [appTheme]);

    const value: AppThemeContextType = {
        ...prismThemeState,
        ...fontState,
        appTheme,
        setAppTheme,
        appThemes: THEMES
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
