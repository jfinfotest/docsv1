import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../context/ThemeContext';
import { usePrismTheme } from '../hooks/usePrismTheme';
import { CopyIcon, CheckIcon, ExpandIcon, LineNumbersIcon, CloseIcon } from './Icons';
import { useI18n } from '../context/I18nContext';
import Tooltip from './Tooltip';


// Helper to extract language from className
const getLanguage = (className: string = ''): string => {
    const match = /language-(\w+)/.exec(className || '');
    return match ? match[1] : 'text';
};

// Language alias mapping for PrismJS (includes built-in aliases)
const getLanguageAliasMap = (): Record<string, string> => {
    const builtInAliases = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'rb': 'ruby',
        'sh': 'bash',
        'yml': 'yaml',
        'md': 'markdown',
        'dockerfile': 'docker'
    };
    
    return builtInAliases;
};

// Track loaded languages and loading promises
const loadedLanguages = new Set<string>();
const languageLoadPromises: Record<string, Promise<void>> = {};

// Function to dynamically load PrismJS language components
const loadPrismLanguage = async (lang: string): Promise<void> => {
    const langAliasMap = getLanguageAliasMap();
    const canonicalLang = langAliasMap[lang] || lang;
    
    if (!canonicalLang) return Promise.resolve();
    
    // Check if canonical language is already loaded or is loading
    if (loadedLanguages.has(canonicalLang)) return Promise.resolve();
    if (languageLoadPromises[canonicalLang]) return languageLoadPromises[canonicalLang];

    // Check if Prism has it already (e.g. core languages)
    if (typeof window !== 'undefined' && window.Prism && window.Prism.languages[canonicalLang]) {
        loadedLanguages.add(canonicalLang);
        return Promise.resolve();
    }
    
    // Load from CDN for built-in languages
    
    // Fallback to CDN for built-in languages
    const promise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${canonicalLang}.min.js`;
        script.async = true;
        script.onload = () => {
            loadedLanguages.add(canonicalLang);
            if (lang !== canonicalLang) loadedLanguages.add(lang);
            delete languageLoadPromises[canonicalLang];
            resolve();
        };
        script.onerror = () => {
            console.error(`Failed to load Prism language: ${canonicalLang}`);
            delete languageLoadPromises[canonicalLang];
            reject(new Error(`Failed to load Prism language: ${canonicalLang}`));
        };
        document.head.appendChild(script);
    });
    
    languageLoadPromises[canonicalLang] = promise;
    return promise;
};

// Function to highlight code using PrismJS
const highlightCode = (code: string, lang: string): string => {
    const langAliasMap = getLanguageAliasMap();
    const canonicalLang = langAliasMap[lang] || lang;
    if (typeof window !== 'undefined' && window.Prism && window.Prism.languages[canonicalLang]) {
        return window.Prism.highlight(code, window.Prism.languages[canonicalLang], canonicalLang);
    }
    // Basic escaping for unsupported languages
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

interface CodeContentProps {
    showLineNumbers: boolean;
    children: React.ReactNode;
    className?: string;
    themeBackground: string | null;
    fontSize: number;
    htmlContent?: string;
}


// Sub-component for the actual code rendering
const CodeContent = React.forwardRef<HTMLPreElement, CodeContentProps>(
    ({ showLineNumbers, children, className, themeBackground, fontSize, htmlContent, ...props }, ref) => {
        const [lineCount, setLineCount] = useState(0);
        const codeRef = useRef<HTMLElement>(null);
        const lineNumbersRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (codeRef.current) {
                const text = codeRef.current.textContent || '';
                const lines = text.split('\n');
                setLineCount(text.endsWith('\n') ? lines.length - 1 : lines.length);
            }
        }, [children, htmlContent]);

        // Apply PrismJS highlighting when component mounts or content changes
        useEffect(() => {
            if (codeRef.current && !htmlContent) {
                const language = getLanguage(className);
                const codeText = codeRef.current.textContent || '';
                
                // First load the language if needed, then highlight
                loadPrismLanguage(language)
                    .then(() => {
                        if (codeRef.current) {
                            const highlightedCode = highlightCode(codeText, language);
                            codeRef.current.innerHTML = highlightedCode;
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to load language for highlighting:', error);
                        // Fallback to plain text if language loading fails
                        if (codeRef.current) {
                            codeRef.current.textContent = codeText;
                        }
                    });
            }
        }, [children, className, htmlContent]);

        // Sincroniza el line-height del código con los números de línea para una alineación perfecta.
        useEffect(() => {
            if (showLineNumbers && codeRef.current && lineNumbersRef.current) {
                const codeStyle = window.getComputedStyle(codeRef.current);
                lineNumbersRef.current.style.lineHeight = codeStyle.lineHeight;
            }
        }, [showLineNumbers, fontSize, children, htmlContent, themeBackground]);

        const smoothTransition = { transition: 'font-size 0.1s ease-out, line-height 0.1s ease-out' };

        return (
            <div className="flex items-start">
                {showLineNumbers && (
                    <div
                        ref={lineNumbersRef}
                        aria-hidden="true"
                        className="flex-shrink-0 select-none text-right pr-4 pl-4 py-3 sticky left-0 z-10"
                        style={{ backgroundColor: themeBackground || 'transparent', fontSize: `${fontSize}px`, ...smoothTransition }}
                    >
                        {Array.from({ length: lineCount }, (_, i) => (
                            <div key={i}>{i + 1}</div>
                        ))}
                    </div>
                )}
                <pre
                    ref={ref}
                    className={`${className || ''} !m-0 !p-0 flex-grow bg-transparent`}
                    {...props}
                >
                    <code
                        ref={codeRef}
                        className={`${className || ''} block py-3 bg-transparent ${showLineNumbers ? 'pr-4' : 'px-4'}`}
                        style={{ fontSize: `${fontSize}px`, ...smoothTransition }}
                        {...(htmlContent ? { dangerouslySetInnerHTML: { __html: htmlContent } } : {})}
                    >
                        {htmlContent ? null : children}
                    </code>
                </pre>
            </div>
        );
    }
);

// Modal for fullscreen view
const FullScreenModal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" 
            onClick={onClose}
        >
            <div className="w-full h-full max-w-full max-h-full relative rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        modalRoot
    );
};

const WindowDots = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
    </div>
);


const CodeBlock: React.FC<any> = ({ node, className, children, htmlContent, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showLineNumbers, setShowLineNumbers] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fontSize, setFontSize] = useState(14); // Default font size in pixels
    const { themeBackground } = usePrismTheme();
    const { t } = useI18n();
    
    const preRef = useRef<HTMLPreElement>(null);
    const language = getLanguage(className);

    const handleCopy = () => {
        if (preRef.current?.textContent) {
            navigator.clipboard.writeText(preRef.current.textContent);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };
    
    const toggleLineNumbers = () => setShowLineNumbers(!showLineNumbers);
    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    const handleWheel = (event: React.WheelEvent) => {
        if (event.shiftKey) {
            event.preventDefault();
            setFontSize(currentSize => {
                const newSize = currentSize - event.deltaY * 0.1;
                // Clamp font size between min and max values
                return Math.max(8, Math.min(32, newSize));
            });
        }
    };
    
    // Reusable UI component for the code block content and toolbar
    const CodeBlockUI = ({ isFullscreenView = false }: { isFullscreenView?: boolean; }) => {
        const buttonBaseClass = "p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
        const activeClass = 'bg-blue-100/10 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300';
        
        return (
            <div 
                className={`flex flex-col ${isFullscreenView ? 'h-full' : 'rounded-xl shadow-lg shadow-black/10 dark:shadow-black/20 overflow-hidden'}`}
                style={{ backgroundColor: themeBackground || '#272822' }}
            >
                {/* Custom Title Bar */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 h-12 bg-black/5 dark:bg-white/5">
                    <div className="flex items-center space-x-4">
                        <WindowDots />
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 select-none">{language}</span>
                        <span className="text-xs font-medium text-gray-500/70 dark:text-gray-400/70 select-none hidden sm:inline">
                            {t('shiftScrollToZoom')}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Tooltip content={isCopied ? t('codeCopied') : t('copyCode')} position="bottom">
                            <button onClick={handleCopy} className={buttonBaseClass} aria-label={t('copyCode')}>
                                {isCopied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                            </button>
                        </Tooltip>
                        <Tooltip content={showLineNumbers ? t('hideLineNumbers') : t('showLineNumbers')} position="bottom">
                <button onClick={toggleLineNumbers} className={`${buttonBaseClass} ${showLineNumbers ? activeClass : ''}`} aria-label={t('toggleLineNumbers')}>
                                <LineNumbersIcon className="w-5 h-5" />
                            </button>
                        </Tooltip>
                        <Tooltip content={isFullscreenView ? t('exitFullscreen') : t('enterFullscreen')} position="bottom">
                <button onClick={toggleFullscreen} className={buttonBaseClass} aria-label={isFullscreenView ? t('exitFullscreen') : t('enterFullscreen')}>
                                {isFullscreenView ? <CloseIcon className="w-5 h-5" /> : <ExpandIcon className="w-5 h-5" />}
                            </button>
                        </Tooltip>
                    </div>
                </div>
                {/* Code Content */}
                <div
                    className={`${isFullscreenView ? 'flex-grow' : 'max-h-[70vh]'} overflow-auto`}
                    onWheel={handleWheel}
                >
                    <CodeContent
                        ref={preRef}
                        className={className}
                        showLineNumbers={showLineNumbers}
                        themeBackground={themeBackground}
                        fontSize={fontSize}
                        htmlContent={htmlContent}
                        {...props}
                    >
                        {children}
                    </CodeContent>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="relative text-sm my-4">
                 <CodeBlockUI isFullscreenView={false} />
            </div>
            
            <FullScreenModal isOpen={isFullscreen} onClose={toggleFullscreen}>
                <CodeBlockUI isFullscreenView={true} />
            </FullScreenModal>
        </>
    );
};

export default CodeBlock;
