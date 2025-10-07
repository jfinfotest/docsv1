import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useGemini } from '../context/GeminiContext';
import { CloseIcon, ClipboardListIcon, RefreshIcon } from './Icons';
import CopyButton from './CopyButton';

// --- Type Definitions ---
interface GlossaryTerm {
    term: string;
    definition: string;
}

interface GeminiGlossaryGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    pageContent: string | null;
    pageTitle: string | undefined;
}

type ViewState = 'idle' | 'generating' | 'results';

// --- Helper Functions ---
const formatGlossaryForCopy = (glossary: GlossaryTerm[]): string => {
    return glossary.map(item => `${item.term}\n${item.definition}`).join('\n\n');
};

// --- Main Component ---
const GeminiGlossaryGenerator: React.FC<GeminiGlossaryGeneratorProps> = ({ isOpen, onClose, pageContent, pageTitle }) => {
    const { apiKey, isKeySet } = useGemini();
    const [view, setView] = useState<ViewState>('idle');
    const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [ai, setAi] = useState<GoogleGenerativeAI | null>(null);

    // Effect to initialize the AI client
    useEffect(() => {
        if (isKeySet && !ai) {
            try {
                setAi(new GoogleGenerativeAI(apiKey));
            } catch(e) {
                 console.error("Failed to initialize GoogleGenerativeAI", e);
                 setError("Error al inicializar el cliente de IA. ¿Es la clave de API válida?");
            }
        }
    }, [isKeySet, apiKey, ai]);

    const handleGenerateGlossary = async (retryCount = 0) => {
        if (!ai || !pageContent) return;

        setView('generating');
        setError(null);
        
        const prompt = `Por favor, genera un glosario a partir del siguiente documento:\n\nTÍTULO: "${pageTitle || 'Sin título'}"\n\nCONTENIDO:\n---\n${pageContent}\n---\n\nResponde únicamente con un JSON válido en el siguiente formato:\n{\n  "glossary": [\n    {\n      "term": "término",\n      "definition": "definición del término"\n    }\n  ]\n}`;

        try {
            const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const response = await model.generateContent(prompt);
            
            let jsonStr = response.response.text().trim();
            
            // Clean up the response if it contains markdown code blocks
            if (jsonStr.includes('```')) {
                const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
                if (jsonMatch) {
                    jsonStr = jsonMatch[1].trim();
                } else {
                    // If no code block found, try to extract JSON between first { and last }
                    const firstBrace = jsonStr.indexOf('{');
                    const lastBrace = jsonStr.lastIndexOf('}');
                    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
                    }
                }
            }
            
            const result = JSON.parse(jsonStr) as { glossary: GlossaryTerm[] };

            if (!result.glossary || result.glossary.length === 0) {
                throw new Error("La IA no pudo generar ningún término del glosario.");
            }
            
            // Sort glossary alphabetically by term
            const sortedGlossary = result.glossary.sort((a, b) => a.term.localeCompare(b.term));

            setGlossary(sortedGlossary);
            setView('results');

        } catch (e) {
            console.error("Glossary generation failed:", e);
            
            // Handle specific error types
            let errorMessage = 'Error desconocido. Por favor, inténtalo de nuevo.';
            
            if (e instanceof Error) {
                const errorText = e.message.toLowerCase();
                
                if (errorText.includes('503') || errorText.includes('overloaded') || errorText.includes('sobrecargado')) {
                    if (retryCount < 2) {
                        // Retry with exponential backoff
                        const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s
                        errorMessage = `El modelo está sobrecargado. Reintentando en ${delay/1000} segundos... (intento ${retryCount + 1}/3)`;
                        setError(errorMessage);
                        
                        setTimeout(() => {
                            handleGenerateGlossary(retryCount + 1);
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
            setView('idle');
        }
    };
    
    const reset = () => {
        setView('idle');
        setGlossary([]);
        setError(null);
    };
    
    // Reset state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(reset, 300); // Delay reset to allow for closing animation
        }
    }, [isOpen]);


    const renderContent = () => {
        switch (view) {
            case 'generating':
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Generando glosario...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Analizando el documento en busca de términos clave.</p>
                    </div>
                );

            case 'results':
                return (
                     <div className="p-6 overflow-y-auto">
                        <dl>
                            {glossary.map((item, index) => (
                                <div key={index} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:mb-0 last:pb-0">
                                    <dt className="text-base font-semibold text-primary-700 dark:text-primary-300">{item.term}</dt>
                                    <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.definition}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                );
                
            case 'idle':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <ClipboardListIcon className="text-5xl text-gray-400 dark:text-gray-500" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Generador de Glosario</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            Escanea el documento actual para crear una lista de términos clave y sus definiciones.
                        </p>
                        <button onClick={() => handleGenerateGlossary()} className="px-6 py-3 font-semibold rounded-lg shadow-md bg-primary-600 text-white hover:bg-primary-700 transition-transform transform hover:scale-105">
                            Generar Glosario
                        </button>
                    </div>
                );
        }
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
                className="w-full max-w-5xl h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 min-w-0">
                        <ClipboardListIcon className="text-2xl text-gray-600 dark:text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">Glosario: {pageTitle || 'este documento'}</h2>
                    </div>
                     <div className="flex items-center space-x-2">
                        {view === 'results' && glossary.length > 0 && (
                           <CopyButton textToCopy={formatGlossaryForCopy(glossary)} ariaLabel="Copiar glosario" />
                        )}
                        {view === 'results' && (
                            <button onClick={() => handleGenerateGlossary()} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Generar de nuevo">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                        )}
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Cerrar glosario">
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

export default GeminiGlossaryGenerator;
