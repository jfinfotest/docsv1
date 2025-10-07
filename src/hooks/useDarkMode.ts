import { useState, useLayoutEffect, useEffect } from 'react';
import { getThemeConfig } from '../services/configService';

type DarkModeResult = [boolean, () => void];

export function useDarkMode(): DarkModeResult {
    const [isDarkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('theme');
            if (savedMode) {
                return savedMode === 'dark';
            }
        }
        // Default to light mode until config loads
        return false;
    });

    // Load theme config and set default if no saved preference
    useEffect(() => {
        const loadThemeConfig = async () => {
            if (typeof window !== 'undefined') {
                const savedMode = localStorage.getItem('theme');
                if (!savedMode) {
                    try {
                        const themeConfig = await getThemeConfig();
                        setDarkMode(themeConfig?.defaultTheme === 'dark');
                    } catch (error) {
                        console.error('Error loading theme config:', error);
                    }
                }
            }
        };
        loadThemeConfig();
    }, []);

    // Apply the theme class to the document and save to localStorage on change.
    useLayoutEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!isDarkMode);
    };

    return [isDarkMode, toggleDarkMode];
}
