import React, { useEffect, useState } from 'react';
import { getFooterConfig } from '../services/configService';

const Footer: React.FC = () => {
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const footerConfig = await getFooterConfig();
                setConfig(footerConfig);
            } catch (error) {
                console.error('Error loading footer config:', error);
            }
        };
        loadConfig();
    }, []);

    if (!config || !config.enabled) {
        return null;
    }

    const currentYear = new Date().getFullYear();
    const footerText = config.text.replace('{year}', currentYear.toString());

    return (
        <footer className="fixed bottom-0 w-full z-30 bg-white dark:bg-gray-900 py-1.5 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-[2000px] mx-auto px-6">
                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {footerText}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
