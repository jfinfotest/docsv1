import React, { useState, useEffect } from 'react';
import { getAppConfig } from '../services/configService';
import { BookIcon } from './Icons';

// Add props to allow custom classes
interface AppIconProps {
    className?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ className = 'h-8 w-8' }) => { // Default size to not break existing usage
    const [iconSrc, setIconSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState<boolean>(false);
    const [appConfig, setAppConfig] = useState<any>(null);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const config = await getAppConfig();
                setAppConfig(config);
            } catch (error) {
                console.error('Error loading app config:', error);
                setHasError(true);
            }
        };
        loadConfig();
    }, []);

    useEffect(() => {
        if (!appConfig) return;

        const loadIconFromLocal = () => {
             if (!appConfig.icon) {
                setHasError(true);
                return;
            }
            const iconPath = appConfig.icon;
            // Handle both absolute and relative paths correctly for production builds
            let localIconPath: string;
            if (iconPath.startsWith('/')) {
                // Convert absolute path to relative for production builds
                localIconPath = `.${iconPath}`;
            } else {
                // Construct path for relative icons
                localIconPath = `/docs/${iconPath}`;
            }
            setIconSrc(localIconPath);
            setHasError(false);
        };

        loadIconFromLocal();
    }, [appConfig]);

    if (hasError || !iconSrc) {
        return <BookIcon className={className} />;
    }

    return (
        <img 
            src={iconSrc} 
            alt="App Logo" 
            className={`${className} object-contain`}
            onError={() => setHasError(true)}
        />
    );
};

export default AppIcon;