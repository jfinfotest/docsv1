import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useNav } from '../context/NavContext';
import { configService } from '../services/configService';

const SecondaryNav: React.FC = () => {
    const { secondaryNavLinks, loading } = useNav();
    const [configs, setConfigs] = useState<any>({
        secondaryNav: { background: { enabled: false } }
    });

    useEffect(() => {
        const loadConfigs = async () => {
            try {
                await configService.loadConfig();
                const secondaryNavConfig = configService.getConfig().secondaryNav || { background: { enabled: false } };
                setConfigs({ secondaryNav: secondaryNavConfig });
            } catch (error) {
                console.error('Error loading secondary nav config:', error);
            }
        };
        loadConfigs();
    }, []);

    // Generar estilos de fondo dinámicos
    const getSecondaryNavStyles = () => {
        const secondaryNavBg = configs.secondaryNav?.background;
        if (!secondaryNavBg?.enabled || !secondaryNavBg.image) {
            return {};
        }

        const styles: React.CSSProperties = {
            backgroundImage: `url(${secondaryNavBg.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        };

        if (secondaryNavBg.overlay) {
            styles.position = 'relative';
        }

        return styles;
    };

    const getSecondaryNavOverlayStyles = () => {
        const secondaryNavBg = configs.secondaryNav?.background;
        if (!secondaryNavBg?.enabled || !secondaryNavBg.overlay) {
            return {};
        }

        return {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: secondaryNavBg.overlayColor,
            opacity: secondaryNavBg.opacity,
            pointerEvents: 'none' as const,
        };
    };

    const secondaryNavBg = configs.secondaryNav?.background;
    const hasBackground = secondaryNavBg?.enabled && secondaryNavBg.image;
    const baseClasses = "flex-shrink-0 border-b border-gray-200 dark:border-gray-700 shadow-sm";
    const bgClasses = hasBackground ? "" : "bg-white dark:bg-gray-800";

    if (loading && secondaryNavLinks.length === 0) {
        return (
            <div 
                className={`${baseClasses} ${bgClasses}`}
                style={getSecondaryNavStyles()}
            >
                {hasBackground && secondaryNavBg?.overlay && (
                    <div style={getSecondaryNavOverlayStyles()} />
                )}
                <nav className="container mx-auto px-5 relative z-10">
                <div className="relative flex items-center space-x-5 overflow-x-auto whitespace-nowrap py-3 tablet:py-2 no-scrollbar animate-pulse">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 py-1"></div>
                        ))}
                    </div>
                </nav>
            </div>
        );
    }

    if (!loading && secondaryNavLinks.length === 0) {
        return null;
    }

    return (
        <div 
            className={`${baseClasses} ${bgClasses}`}
            style={getSecondaryNavStyles()}
        >
            {hasBackground && secondaryNavBg?.overlay && (
                <div style={getSecondaryNavOverlayStyles()} />
            )}
            <nav className="container mx-auto px-5 relative z-10">
                {/* On smaller screens, this will be horizontally scrollable */}
                <div className="relative flex items-center space-x-6 tablet:space-x-5 overflow-x-auto whitespace-nowrap py-3 tablet:py-2 no-scrollbar">
                    {secondaryNavLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            // The `end` prop is crucial for the root path ('/') to not stay active on other routes.
                            end={link.path === '/'} 
                            className={({ isActive }) =>
                                `block text-sm tablet:text-xs font-medium transition-colors duration-200 py-1 tablet:py-0.5 ${
                                    isActive
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default SecondaryNav;
