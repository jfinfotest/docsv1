import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react';

const GEMINI_API_KEY_STORAGE_KEY = 'gemini-api-key';

interface ApiKeyData {
    key: string;
}

interface GeminiContextType {
    apiKey: string;
    setApiKey: (key: string) => void;
    isKeySet: boolean;
    clearApiKey: () => void;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const useGemini = () => {
    const context = useContext(GeminiContext);
    if (!context) {
        throw new Error('useGemini must be used within a GeminiProvider');
    }
    return context;
};

// Función para obtener la clave API del sessionStorage
const getApiKey = (): string => {
    try {
        const storedData = sessionStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
        if (!storedData) return '';

        const apiKeyData: ApiKeyData = JSON.parse(storedData);
        return apiKeyData.key;
    } catch (error) {
        // Si hay error al parsear, eliminar el dato corrupto
        sessionStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
        return '';
    }
};

export const GeminiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, _setApiKey] = useState<string>(() => {
        // La clave de API se obtiene del sessionStorage
        return getApiKey();
    });

    // Limpiar la clave cuando se cierra la pestaña o navegador
    useEffect(() => {
        const handleBeforeUnload = () => {
            // La clave se elimina automáticamente al cerrar la sesión
            // sessionStorage se limpia automáticamente al cerrar la pestaña/navegador
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const setApiKey = (key: string) => {
        const apiKeyData: ApiKeyData = {
            key
        };
        
        sessionStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, JSON.stringify(apiKeyData));
        _setApiKey(key);
    };

    const clearApiKey = () => {
        sessionStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
        _setApiKey('');
    };

    const isKeySet = useMemo(() => !!apiKey, [apiKey]);

    const value: GeminiContextType = {
        apiKey,
        setApiKey,
        isKeySet,
        clearApiKey,
    };

    return (
        <GeminiContext.Provider value={value}>
            {children}
        </GeminiContext.Provider>
    );
};
