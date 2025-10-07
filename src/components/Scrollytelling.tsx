import React, { useState, useEffect, useMemo, useRef } from 'react';
import matter from 'gray-matter';
import NestedMarkdown from './NestedMarkdown';
import ImageWithLightbox from './ImageWithLightbox';
import CodeBlock from './CodeBlock';
import Mermaid from './Mermaid';
import { useI18n } from '../context/I18nContext';

// --- Type Definitions ---
type Media = 
    | { type: 'image'; src: string; alt?: string }
    | { type: 'code'; lang: string; code: string }
    | { type: 'mermaid'; chart: string };

interface ScrollytellingStep {
    content: string;
    media: Media;
    date?: string; // Fecha opcional para mostrar en los indicadores
    title?: string; // Título opcional para el indicador
}

interface ScrollytellingProps {
    content: string;
}

// --- Sub-component for progress indicators ---
const ProgressIndicators: React.FC<{
    steps: ScrollytellingStep[];
    activeIndex: number;
    onStepClick: (index: number) => void;
}> = ({ steps, activeIndex, onStepClick }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center py-8">
            <div className="relative flex flex-col items-center h-full">
                {/* Barra de progreso vertical minimalista */}
                <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
                
                {steps.map((step, index) => {
                    const isActive = activeIndex === index;
                    const isCompleted = activeIndex > index;
                    const progress = steps.length > 0 ? (index / (steps.length - 1)) * 100 : 0;
                    
                    return (
                        <div
                            key={index}
                            className="relative group cursor-pointer"
                            style={{ top: `${progress}%`, position: 'absolute' }}
                            onClick={() => onStepClick(index)}
                        >
                            {/* Punto indicador */}
                            <div className={`
                                w-3 h-3 rounded-full transition-all duration-300 transform
                                ${isActive 
                                    ? 'bg-blue-500 scale-150 shadow-lg shadow-blue-500/50' 
                                    : isCompleted 
                                        ? 'bg-green-500 scale-110' 
                                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                }
                            `}></div>
                            
                            {/* Tooltip con información */}
                            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                                    {step.date && (
                                        <div className="font-medium">{step.date}</div>
                                    )}
                                    {step.title && (
                                        <div className="text-xs opacity-80">{step.title}</div>
                                    )}
                                    <div className="text-xs opacity-60">
                                        {index + 1}/{steps.length}
                                    </div>
                                    {/* Flecha del tooltip */}
                                    <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Indicador de scroll */}
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
                <div className="flex flex-col items-center space-y-1">
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

// --- Sub-component for rendering the sticky media panel ---
const StickyMediaPanel: React.FC<{ 
    activeMedia: Media | null; 
    onHeightChange: (height: number) => void;
}> = ({ activeMedia, onHeightChange }) => {
    const { t } = useI18n();
    const mediaRef = useRef<HTMLDivElement>(null);

    const renderMedia = (media: Media) => {
        switch (media.type) {
            case 'image':
                return <ImageWithLightbox src={media.src} alt={media.alt} />;
            case 'code':
                // CodeBlock expects children, not a string prop.
                // We also need to simulate the structure it expects from rehype-prism.
                return (
                    <CodeBlock 
                        className={`language-${media.lang}`}
                        node={{ children: [{ type: 'text', value: media.code }] }}
                    >
                        {media.code}
                    </CodeBlock>
                );
            case 'mermaid':
                return <Mermaid chart={media.chart} />;
            default:
                return null;
        }
    };

    // Observe height changes of the media content
    useEffect(() => {
        if (mediaRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const height = entry.contentRect.height;
                    onHeightChange(height + 96); // Add padding (24px * 4 = 96px)
                }
            });

            resizeObserver.observe(mediaRef.current);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [activeMedia, onHeightChange]);

    return (
        <div className="w-full h-full flex items-center justify-center">
             {activeMedia ? (
                <div 
                    ref={mediaRef}
                    key={JSON.stringify(activeMedia)} 
                    className="animate-fade-in w-full flex items-center justify-center"
                >
                    <div className="max-w-full overflow-auto">
                        {renderMedia(activeMedia)}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center text-gray-400">
                    <p>{t('scrollToBegin')}</p>
                </div>
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

// --- Main Component ---
const Scrollytelling: React.FC<ScrollytellingProps> = ({ content }) => {
    const { t } = useI18n();
    const steps = useMemo<ScrollytellingStep[]>(() => {
        try {
            const { data } = matter(content);
            return (data.steps as ScrollytellingStep[]) || [];
        } catch (e) {
            console.error("Error parsing scrollytelling YAML:", e);
            return [];
        }
    }, [content]);

    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [containerHeight, setContainerHeight] = useState<number>(400); // Altura mínima por defecto
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Altura mínima preestablecida
    const MIN_HEIGHT = 400; // 400px mínimo

    const handleMediaHeightChange = (mediaHeight: number) => {
        // Usar la altura del media o la altura mínima, lo que sea mayor
        const newHeight = Math.max(mediaHeight, MIN_HEIGHT);
        setContainerHeight(newHeight);
    };

    const handleStepClick = (index: number) => {
        // Scroll al paso específico
        if (stepRefs.current[index] && scrollContainerRef.current) {
            const stepElement = stepRefs.current[index];
            const container = scrollContainerRef.current;
            
            if (stepElement) {
                const containerRect = container.getBoundingClientRect();
                const stepRect = stepElement.getBoundingClientRect();
                const scrollTop = container.scrollTop;
                
                // Calcular la posición para centrar el elemento
                const targetScrollTop = scrollTop + stepRect.top - containerRect.top - (containerRect.height / 2) + (stepRect.height / 2);
                
                container.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
            }
        }
    };

    useEffect(() => {
        stepRefs.current = stepRefs.current.slice(0, steps.length);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-step-index') || '0', 10);
                        setActiveIndex(index);
                    }
                });
            },
            {
                root: scrollContainerRef.current, // Use the scroll container as root
                rootMargin: '-50% 0px -50% 0px', // Trigger when the element is in the vertical center
                threshold: 0,
            }
        );

        stepRefs.current.forEach(el => {
            if (el) observer.observe(el);
        });

        return () => {
            stepRefs.current.forEach(el => {
                if (el) observer.unobserve(el);
            });
        };
    }, [steps.length]);

    if (steps.length === 0) {
        return (
            <div className="my-6 p-4 border-l-4 rounded-r-lg bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200">
                <p className="font-bold">{t('scrollytellingError')}</p>
                <p>{t('scrollytellingErrorDetails')}</p>
            </div>
        );
    }

    const activeMedia = activeIndex >= 0 && activeIndex < steps.length ? steps[activeIndex].media : null;
    
    return (
        <div className="my-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
            {/* Scrollytelling Container with adaptive height */}
            <div 
                className="flex relative"
                style={{ height: `${containerHeight}px` }}
            >
                {/* Progress Indicators - Left Side */}
                <div className="w-16 flex-shrink-0 relative">
                    <ProgressIndicators 
                        steps={steps}
                        activeIndex={activeIndex}
                        onStepClick={handleStepClick}
                    />
                </div>
                
                {/* Content Panel: Scrolling Text Content */}
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 md:w-1/2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                >
                    <div className="p-4">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                // FIX: Ensure the ref callback function returns void by using a block statement.
                                ref={el => { stepRefs.current[index] = el; }}
                                data-step-index={index}
                                className={`min-h-[300px] flex items-center justify-center p-6 transition-opacity duration-500 ${activeIndex === index ? 'opacity-100' : 'opacity-40'}`}
                            >
                                <div className="prose dark:prose-invert max-w-none">
                                     <NestedMarkdown content={step.content} />
                                </div>
                            </div>
                        ))}
                        {/* Add some bottom padding for better scrolling experience */}
                        <div className="h-[200px]"></div>
                    </div>
                </div>

                {/* Right Panel: Sticky Media */}
                <div className="flex-1 md:w-1/2 h-full bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <div className="w-full h-full p-6">
                        <StickyMediaPanel 
                            activeMedia={activeMedia} 
                            onHeightChange={handleMediaHeightChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scrollytelling;
