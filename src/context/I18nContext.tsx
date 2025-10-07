import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { configService } from '../services/configService';

type Language = { code: string; name: string };

type TranslateFunction = (key: string, ...args: any[]) => string;

interface I18nContextType {
    lang: string;
    setLang: (lang: string) => void;
    languages: Language[];
    t: TranslateFunction;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [i18nConfig, setI18nConfig] = useState<any>(null);
    const [uiText, setUiText] = useState<any>(null);
    const [lang, setLangState] = useState<string>('');

    useEffect(() => {
        const loadConfigs = async () => {
            try {
                await configService.loadConfig();
                const [i18nConf, uiTextConf] = await Promise.all([
                    configService.getI18nConfig(),
                    configService.getUITextConfig()
                ]);
                setI18nConfig(i18nConf);
                setUiText(uiTextConf);
                
                const initialLang = localStorage.getItem('lang') || i18nConf?.defaultLang;
                setLangState(initialLang);
            } catch (error) {
                console.error('Error loading i18n configs:', error);
            }
        };
        loadConfigs();
    }, []);

    useEffect(() => {
        if (lang) {
            localStorage.setItem('lang', lang);
        }
    }, [lang]);

    const setLang = (newLang: string) => {
        if (i18nConfig?.languages.some((l: any) => l.code === newLang)) {
            setLangState(newLang);
        }
    };

    const t: TranslateFunction = useCallback((key, ...args) => {
        if (!uiText || !i18nConfig) return key;
        
        const translations = uiText[lang] || uiText[i18nConfig.defaultLang];
        const translation = translations?.[key] || key;

        if (typeof translation === 'function') {
            return translation(...args);
        }

        return translation;
    }, [lang, uiText, i18nConfig]);

    const value = {
        lang,
        setLang,
        languages: i18nConfig?.languages || [],
        t,
    };

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
