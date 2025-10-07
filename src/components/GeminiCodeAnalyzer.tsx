import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useGemini } from '../context/GeminiContext';
import { CloseIcon, CodeBracketIcon, RefreshIcon, TranslateIcon } from './Icons';
import NestedMarkdown from './NestedMarkdown';
import CodeBlock from './CodeBlock';
import CopyButton from './CopyButton';


// --- Type Definitions ---
interface CodeBlockInfo {
    lang: string;
    code: string;
}

interface GeminiCodeAnalyzerProps {
    isOpen: boolean;
    onClose: () => void;
    pageContent: string | null;
    pageTitle: string | undefined;
}

type ViewState = 'selecting' | 'loading' | 'result';
type Action = 'explain' | 'translate';

const TARGET_LANGUAGES = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'java', name: 'Java' },
    { id: 'csharp', name: 'C#' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
    { id: 'php', name: 'PHP' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'swift', name: 'Swift' },
];

// --- Helper Functions ---

const loadedLanguages = new Set(['javascript', 'js', 'css', 'html', 'markup', 'svg', 'xml', 'clike']);
const getLanguageAliasMap = (): { [key: string]: string } => {
    const builtInAliases = {
        py: 'python',
        sh: 'bash',
        shell: 'bash',
        js: 'javascript',
        ts: 'typescript',
        html: 'markup',
        xml: 'markup',
        svg: 'markup',
        md: 'markdown',
        yml: 'yaml',
    };
    
    return builtInAliases;
};
const languageLoadPromises: { [key: string]: Promise<void> } = {};

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


const highlightCode = (code: string, lang: string): string => {
    const langAliasMap = getLanguageAliasMap();
    const canonicalLang = langAliasMap[lang] || lang;
    if (typeof window !== 'undefined' && window.Prism && window.Prism.languages[canonicalLang]) {
        return window.Prism.highlight(code, window.Prism.languages[canonicalLang], canonicalLang);
    }
    // Basic escaping for unsupported languages
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};


// Helper function to parse content from a `tabs` block.
const parseTabContentForAnalyzer = (content: string): CodeBlockInfo[] => {
    const tabs: CodeBlockInfo[] = [];
    // The separator regex from TabbedCodeBlock.tsx
    const separator = /---\[tab\s+title="([^"]+)"\s+lang="([^"]+)"\]---\r?\n/g;
    
    const parts = content.split(separator);
    
    // Start from index 1, parts are [ignored, title, lang, code, title, lang, code, ...]
    for (let i = 1; i < parts.length; i += 3) {
        tabs.push({
            lang: parts[i + 1],
            code: parts[i + 2].trim(),
        });
    }
    return tabs;
};

const extractCodeBlocks = (markdown: string | null): CodeBlockInfo[] => {
    if (!markdown) return [];
    const blocks: CodeBlockInfo[] = [];
    // FIX: More robust regex to handle CRLF line endings and optional final newline within the block.
    const regex = /```([\w-]+)\s*\r?\n([\s\S]*?)\s*```/g;
    
    const customComponentsToIgnore = ['mermaid', 'cta', 'admonition', 'accordion', 'timeline', 'cards', 'steps', 'video', 'gallery', 'api-explorer', 'quiz'];
    
    let match;
    while ((match = regex.exec(markdown)) !== null) {
        const lang = match[1].toLowerCase();
        const codeContent = match[2].trim();

        if (lang === 'tabs') {
            // If it's a tabs block, parse its content to find the inner code blocks.
            const innerBlocks = parseTabContentForAnalyzer(codeContent);
            blocks.push(...innerBlocks);
        } else if (!customComponentsToIgnore.includes(lang)) {
            // It's a standard code block, add it.
            blocks.push({
                lang: lang,
                code: codeContent,
            });
        }
        // Other custom components are ignored, as they don't contain raw code in this format.
    }
    return blocks;
};

// --- Main Component ---
const GeminiCodeAnalyzer: React.FC<GeminiCodeAnalyzerProps> = ({ isOpen, onClose, pageContent, pageTitle }) => {
    const { apiKey, isKeySet } = useGemini();
    const [view, setView] = useState<ViewState>('selecting');
    const [action, setAction] = useState<Action>('explain');
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
    const [targetLang, setTargetLang] = useState('python');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ai, setAi] = useState<GoogleGenerativeAI | null>(null);
    const [renderKey, setRenderKey] = useState(0);

    const codeBlocks = useMemo(() => extractCodeBlocks(pageContent), [pageContent]);

    useEffect(() => {
        if (isKeySet && !ai) {
            try {
                setAi(new GoogleGenerativeAI(apiKey));
            } catch (e) {
                console.error("Failed to initialize GoogleGenerativeAI", e);
                setError("Error al inicializar el cliente de IA. ¿Es la clave de API válida?");
            }
        }
    }, [isKeySet, apiKey, ai]);
    
    useEffect(() => {
        if (view !== 'result' || selectedBlockIndex === null) return;

        const originalBlock = codeBlocks[selectedBlockIndex];
        const languagesToLoad: string[] = [originalBlock.lang];
        if (action === 'translate') {
            languagesToLoad.push(targetLang);
        }
    
        const uniqueLangs = [...new Set(languagesToLoad.filter(Boolean))];
        const langAliasMap = getLanguageAliasMap();
        const promises = uniqueLangs.map(lang => {
            const canonicalLang = langAliasMap[lang] || lang;
            if (loadedLanguages.has(canonicalLang) || (window.Prism && window.Prism.languages[canonicalLang])) {
                return Promise.resolve();
            }
            return loadPrismLanguage(lang);
        });
    
        Promise.all(promises).finally(() => {
            setRenderKey(key => key + 1);
        });
    }, [view, selectedBlockIndex, action, targetLang, codeBlocks]);

    const { originalHighlightedHtml, resultHighlightedHtml } = useMemo(() => {
        if (view !== 'result' || selectedBlockIndex === null) {
            return { originalHighlightedHtml: '', resultHighlightedHtml: '' };
        }
        
        const originalBlock = codeBlocks[selectedBlockIndex];
        const originalHtml = highlightCode(originalBlock.code, originalBlock.lang);
        
        let resultHtml = '';
        if (action === 'translate' && result) {
            resultHtml = highlightCode(result, targetLang);
        }
        
        return { originalHighlightedHtml: originalHtml, resultHighlightedHtml: resultHtml };
    }, [view, selectedBlockIndex, codeBlocks, result, targetLang, action, renderKey]);


    const handleAnalyze = async (retryCount = 0) => {
        if (!ai || selectedBlockIndex === null) return;

        setView('loading');
        setError(null);
        setResult(null);

        const block = codeBlocks[selectedBlockIndex];
        let systemInstruction = '';
        let prompt = '';

        if (action === 'explain') {
            systemInstruction = `Eres un programador senior experto y un excelente comunicador. Tu tarea es explicar fragmentos de código de manera clara y concisa en español.`;
            prompt = `Analiza el siguiente fragmento de código en \`${block.lang}\` y explica qué hace. Desglosa la lógica, el propósito de las funciones o clases clave y cómo encaja en un contexto más amplio si es evidente. Formatea tu respuesta usando Markdown.\n\n\`\`\`${block.lang}\n${block.code}\n\`\`\``;
        } else { // translate
            systemInstruction = `Eres un traductor de código experto que se especializa en convertir fragmentos de código de un lenguaje a otro, manteniendo la funcionalidad y el estilo idiomático. Añade comentarios al código traducido para explicar las diferencias clave de sintaxis o enfoque. La explicación y los comentarios deben estar en español. No incluyas el código en un bloque markdown, solo devuelve el código traducido.`;
            prompt = `Traduce el siguiente fragmento de código de \`${block.lang}\` a \`${targetLang}\`.\n\n\`\`\`${block.lang}\n${block.code}\n\`\`\``;
        }

        try {
            const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const response = await model.generateContent(prompt);
            
            let responseText = response.response.text();

            if (action === 'translate') {
                const langIdentifier = `\`\`\`${targetLang}`;
                if (responseText.startsWith(langIdentifier)) {
                    responseText = responseText.substring(langIdentifier.length);
                }
                if (responseText.endsWith('```')) {
                     responseText = responseText.substring(0, responseText.length - 3);
                }
                responseText = responseText.trim();
            }

            setResult(responseText);
            setView('result');

        } catch (e) {
            console.error("Code analysis failed:", e);
            
            // Handle specific error types
            let errorMessage = 'Error desconocido. Por favor, inténtalo de nuevo.';
            
            if (e instanceof Error) {
                const errorText = e.message.toLowerCase();
                
                if (errorText.includes('503') || errorText.includes('overloaded') || errorText.includes('sobrecargado')) {
                    if (retryCount < 2) {
                        // Retry with exponential backoff
                        const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s
                        errorMessage = `El modelo está sobrecargado. Reintentando análisis en ${delay/1000} segundos... (intento ${retryCount + 1}/3)`;
                        setError(errorMessage);
                        
                        setTimeout(() => {
                            handleAnalyze(retryCount + 1);
                        }, delay);
                        return;
                    } else {
                        errorMessage = '🚫 El servicio de IA está temporalmente sobrecargado. Por favor, inténtalo de nuevo en unos minutos.';
                    }
                } else if (errorText.includes('403') || errorText.includes('api key') || errorText.includes('permission')) {
                    errorMessage = '🔑 Error de autenticación. Verifica que tu clave de API de Gemini sea válida y tenga los permisos necesarios.';
                } else if (errorText.includes('quota') || errorText.includes('limit')) {
                    errorMessage = '📊 Has alcanzado el límite de uso de la API. Inténtalo más tarde o verifica tu cuota.';
                } else if (errorText.includes('network') || errorText.includes('fetch')) {
                    errorMessage = '🌐 Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.';
                } else {
                    errorMessage = `❌ ${e.message}`;
                }
            }
            
            setError(errorMessage);
            setView('selecting');
        }
    };

    const reset = () => {
        setView('selecting');
        setSelectedBlockIndex(null);
        setAction('explain');
        setResult(null);
        setError(null);
    };

    useEffect(() => {
        if (!isOpen) {
            setTimeout(reset, 300);
        }
    }, [isOpen]);

    const renderContent = () => {
        if (view === 'loading') {
            return (
                 <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Analizando código...</p>
                </div>
            );
        }

        if (view === 'result') {
            const originalBlock = codeBlocks[selectedBlockIndex!];
            return (
                <div className="p-6 overflow-y-auto">
                    <button onClick={reset} className="inline-flex items-center mb-4 px-3 py-1.5 text-sm font-semibold rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                        &larr; Volver a la selección
                    </button>
                    
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Código Original ({originalBlock.lang})</h4>
                            <CodeBlock
                                node={null}
                                className={`language-${originalBlock.lang}`}
                                htmlContent={originalHighlightedHtml}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {action === 'explain' ? 'Explicación de la IA' : `Traducción a ${targetLang}`}
                                </h4>
                                {result && <CopyButton textToCopy={result} />}
                            </div>
                            {action === 'explain' ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                    <NestedMarkdown content={result || ''} />
                                </div>
                            ) : (
                                <CodeBlock
                                    node={null}
                                    className={`language-${targetLang}`}
                                    htmlContent={resultHighlightedHtml}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        if (codeBlocks.length === 0) {
             return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <CodeBracketIcon className="text-5xl text-gray-400 dark:text-gray-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">No se encontraron bloques de código</h3>
                    <p className="text-gray-600 dark:text-gray-400">Esta página no contiene ningún fragmento de código para analizar.</p>
                </div>
            );
        }

        return (
            <div className="p-6 overflow-y-auto">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Selecciona un bloque de código</h3>
                 <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900/50">
                     {codeBlocks.map((block, index) => (
                         <button 
                            key={index} 
                            onClick={() => setSelectedBlockIndex(index)}
                            className={`w-full text-left p-3 border-2 rounded-lg transition-colors bg-white dark:bg-gray-800 ${selectedBlockIndex === index ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50' : 'border-gray-300 dark:border-gray-700 hover:border-primary-400'}`}
                         >
                             <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{block.lang}</div>
                             <pre className="mt-2 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
                                <code>{block.code}</code>
                            </pre>
                         </button>
                     ))}
                 </div>
                 
                 {selectedBlockIndex !== null && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Elige una acción</h3>
                        <div className="flex space-x-4">
                             <button onClick={() => setAction('explain')} className={`flex-1 p-3 rounded-lg text-center font-semibold transition-colors flex items-center justify-center ${action === 'explain' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                Explicar Código
                            </button>
                            <button onClick={() => setAction('translate')} className={`flex-1 p-3 rounded-lg text-center font-semibold transition-colors flex items-center justify-center ${action === 'translate' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                <TranslateIcon className="text-2xl mr-2" />
                                Traducir Código
                            </button>
                        </div>

                        {action === 'translate' && (
                            <div className="mt-4">
                                <label htmlFor="target-lang" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Traducir a:</label>
                                <select 
                                    id="target-lang" 
                                    value={targetLang} 
                                    onChange={(e) => setTargetLang(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                                >
                                    {TARGET_LANGUAGES.map(lang => (
                                        <option key={lang.id} value={lang.id}>{lang.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        <div className="mt-6">
                            <button onClick={() => handleAnalyze()} className="w-full flex items-center justify-center px-4 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                                Analizar
                            </button>
                        </div>
                    </div>
                 )}
            </div>
        );
    };
    
    if (!isOpen) return null;
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;
    
    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-6xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 min-w-0">
                        <CodeBracketIcon className="text-2xl text-gray-600 dark:text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">Analizador de Código con IA</h2>
                    </div>
                     <div className="flex items-center space-x-2">
                        <button onClick={reset} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Reiniciar">
                            <RefreshIcon className="text-2xl" />
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Cerrar analizador">
                            <CloseIcon className="text-2xl" />
                        </button>
                    </div>
                </header>
                <main className="flex-grow flex flex-col min-h-0">
                   {error && <div className="m-4 text-red-500 text-sm p-3 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}
                   {renderContent()}
                </main>
            </div>
        </div>,
        modalRoot
    );
};

export default GeminiCodeAnalyzer;
