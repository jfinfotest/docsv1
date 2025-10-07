import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnnouncementBannerConfig } from '../services/configService';
import { CloseIcon } from './Icons';
import NestedMarkdown from './NestedMarkdown';
import { useI18n } from '../context/I18nContext';

const AnnouncementBanner: React.FC = () => {
    const [config, setConfig] = useState<any>(null);
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const announcementConfig = await getAnnouncementBannerConfig();
                setConfig(announcementConfig);
            } catch (error) {
                console.error('Error loading announcement banner config:', error);
            }
        };
        loadConfig();
    }, []);

    useEffect(() => {
        if (!config || !config.enabled || !config.id) {
            setIsOpen(false);
            return;
        }
        const storageKey = `announcement-dismissed-${config.id}`;
        const isDismissed = localStorage.getItem(storageKey) === 'true';
        if (!isDismissed) {
            setIsOpen(true);
        }
    }, [config]);

    const handleDismiss = () => {
        if (config?.id) {
            const storageKey = `announcement-dismissed-${config.id}`;
            localStorage.setItem(storageKey, 'true');
            setIsOpen(false);
        }
    };

    if (!isOpen || !config) {
        return null;
    }

    const isExternal = config.link?.href.startsWith('http');

    return (
        <div className="relative z-40 bg-primary-600 text-white">
            <div className="container mx-auto px-6 py-2.5 text-sm font-medium text-center">
                <div className="inline-block">
                    <NestedMarkdown content={config.content} />
                </div>
                {config.link && (
                    isExternal ? (
                        <a href={config.link.href} target="_blank" rel="noopener noreferrer" className="ml-2 inline-block underline hover:opacity-80">
                            {config.link.text} &rarr;
                        </a>
                    ) : (
                        <Link to={config.link.href} className="ml-2 inline-block underline hover:opacity-80">
                            {config.link.text} &rarr;
                        </Link>
                    )
                )}
            </div>
            <button
                onClick={handleDismiss}
                className="absolute top-1/2 right-4 -translate-y-1/2 p-1 rounded-full text-primary-200 hover:text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={t('dismissAnnouncement')}
            >
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default AnnouncementBanner;
