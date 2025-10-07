import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useGemini } from '../context/GeminiContext';
import { CloseIcon, ListIcon, RefreshIcon } from './Icons';
import NestedMarkdown from './NestedMarkdown';
import CopyButton from './CopyButton';

// --- Type Definitions ---
interface GeminiSummarizerProps {
    isOpen: boolean;
    onClose: () => void;
    pageContent: string | null;
    pageTitle: string | undefined;
}

type ViewState = 'idle' | 'generating' | 'results';

// --- Main Component ---
const GeminiSummarizer: React.FC<GeminiSummarizerProps> = ({ isOpen, onClose, pageContent, pageTitle }) => {
    const { apiKey, isKeySet } = useGemini();
    const [view, setView] = useState<ViewState>('idle');
    const [summary, setSummary] = useState<string | null>(null);
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

    const handleGenerateSummary = async (retryCount = 0) => {
        if (!ai || !pageContent) return;

        setView('generating');
        setError(null);
        
        const prompt = `Por favor, genera un resumen en puntos clave del siguiente documento:\n\nTÍTULO: "${pageTitle || 'Sin título'}"\n\nCONTENIDO:\n---\n${pageContent}\n---\n\nFormatea tu respuesta usando Markdown con viñetas para los puntos clave.`;

        try {
            const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const response = await model.generateContent(prompt);
            
            const summaryText = response.response.text().trim();

            if (!summaryText) {
                throw new Error("La IA no pudo generar un resumen.");
            }
            
            setSummary(summaryText);
            setView('results');

        } catch (e) {
            console.error("Summary generation failed:", e);
            
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
                            handleGenerateSummary(retryCount + 1);
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
        setSummary(null);
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
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Generando resumen...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Analizando el documento en busca de los puntos clave.</p>
                    </div>
                );

            case 'results':
                return (
                     <div className="p-6 overflow-y-auto">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                             <NestedMarkdown content={summary || ''} />
                        </div>
                    </div>
                );
                
            case 'idle':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <ListIcon className="text-5xl text-gray-400 dark:text-gray-500" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Generador de Resúmenes con IA</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            Crea un resumen conciso del documento actual en puntos clave para una rápida visión general.
                        </p>
                        <button onClick={() => handleGenerateSummary()} className="px-6 py-3 font-semibold rounded-lg shadow-md bg-primary-600 text-white hover:bg-primary-700 transition-transform transform hover:scale-105">
                            Generar Resumen
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
                        <ListIcon className="text-2xl text-gray-600 dark:text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">Resumen: {pageTitle || 'este documento'}</h2>
                    </div>
                     <div className="flex items-center space-x-2">
                        {view === 'results' && summary && (
                            <CopyButton textToCopy={summary} ariaLabel="Copiar resumen" />
                        )}
                        {view === 'results' && (
                            <button onClick={() => handleGenerateSummary()} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Generar de nuevo">
                                <RefreshIcon className="text-2xl" />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Cerrar resumen">
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

export default GeminiSummarizer;
