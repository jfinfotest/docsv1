import React, { useState, useEffect } from 'react';
import { getAppConfig, getSidebarBusinessInfoConfig } from '../services/configService';

// Add props to allow custom classes
interface SidebarLogoProps {
    className?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ className = 'h-8 w-8' }) => {
    const [iconSrc, setIconSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState<boolean>(false);
    const [configs, setConfigs] = useState<{
        app: any;
        sidebarBusinessInfo: any;
    } | null>(null);

    useEffect(() => {
        const loadConfigs = async () => {
            try {
                const [appConfig, sidebarBusinessInfoConfig] = await Promise.all([
                    getAppConfig(),
                    getSidebarBusinessInfoConfig()
                ]);
                setConfigs({
                    app: appConfig,
                    sidebarBusinessInfo: sidebarBusinessInfoConfig
                });
            } catch (error) {
                console.error('Error loading configurations:', error);
                setHasError(true);
            }
        };
        loadConfigs();
    }, []);

    useEffect(() => {
        if (!configs) return;



        const loadIconFromLocal = () => {
            if (!configs.sidebarBusinessInfo.logo) {
                setHasError(true);
                return;
            }
            const logoPath = configs.sidebarBusinessInfo.logo;
            // If the path is already absolute, use it directly. Otherwise, construct it.
            const localIconPath = logoPath.startsWith('/') ? logoPath : `/docs/${logoPath}`;
            setIconSrc(localIconPath);
            setHasError(false);
        };

        loadIconFromLocal();
    }, [configs]);

    if (hasError || !iconSrc) {
        return null;
    }

    return (
        <img 
            src={iconSrc} 
            alt="Sidebar Logo" 
            className={`${className} object-contain`}
            onError={() => setHasError(true)}
        />
    );
};

export default SidebarLogo;