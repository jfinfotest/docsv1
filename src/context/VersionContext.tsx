import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { configService } from '../services/configService';

interface VersionContextType {
    version: string;
    setVersion: (version: string) => void;
    versions: string[];
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const useVersion = () => {
    const context = useContext(VersionContext);
    if (!context) {
        throw new Error('useVersion must be used within a VersionProvider');
    }
    return context;
};

export const VersionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [versionConfig, setVersionConfig] = useState<any>(null);
    const [version, setVersionState] = useState<string>('');

    useEffect(() => {
        const loadConfig = async () => {
            try {
                await configService.loadConfig();
                const config = configService.getVersionConfig();
                setVersionConfig(config);
                const initialVersion = localStorage.getItem('version') || config?.defaultVersion;
                setVersionState(initialVersion);
            } catch (error) {
                console.error('Error loading version config:', error);
            }
        };
        loadConfig();
    }, []);

    useEffect(() => {
        if (version) {
            localStorage.setItem('version', version);
        }
    }, [version]);

    const setVersion = (newVersion: string) => {
        if (versionConfig?.versions.includes(newVersion)) {
            setVersionState(newVersion);
        }
    };

    const value = {
        version,
        setVersion,
        versions: versionConfig?.versions || [],
    };

    return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>;
};
