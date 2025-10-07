import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useGemini } from '../context/GeminiContext';
import { CloseIcon, AcademicCapIcon, ChevronDownIcon, RefreshIcon, CheckIcon } from './Icons';
import NestedMarkdown from './NestedMarkdown';
import CopyButton from './CopyButton';
import { useI18n } from '../context/I18nContext';

// --- Type Definitions ---
interface QuizQuestion {
    question: string;
    ideal_answer: string;
}

interface EvaluationResult {
    score: number;
    feedback: string;
}

interface GeminiQuizGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    pageContent: string | null;
    pageTitle: string | undefined;
}

type ViewState = 'idle' | 'generating' | 'answering' | 'evaluating' | 'results';

// --- Helper Functions ---
const formatResultsForCopy = (
    questions: QuizQuestion[],
    userAnswers: { [key: number]: string },
    evaluationResults: EvaluationResult[],
    pageTitle: string | undefined,
    t: (key: string, ...args: any[]) => string
): string => {
    const totalScore = evaluationResults.reduce((sum, result) => sum + result.score, 0);
    const maxScore = questions.length * 5;

    let report = `${t('quizResults')} para: ${pageTitle || t('thisDocument')}\n`;
    report += `Puntuación Total: ${totalScore} / ${maxScore}\n`;
    report += `------------------------------------\n\n`;

    questions.forEach((q, index) => {
        const result = evaluationResults[index];
        const userAnswer = userAnswers[index] || t('noAnswerProvided');
        report += `Pregunta ${index + 1}: ${q.question}\n`;
        report += `${t('yourAnswer')} ${userAnswer}\n`;
        report += `${t('idealAnswer')} ${q.ideal_answer}\n`;
        report += `Puntuación: ${result.score}/5\n`;
        report += `${t('aiFeedback')} ${result.feedback}\n\n`;
    });

    return report;
};


// --- Main Component ---
const GeminiQuizGenerator: React.FC<GeminiQuizGeneratorProps> = ({ isOpen, onClose, pageContent, pageTitle }) => {
    const { apiKey, isKeySet } = useGemini();
    const { t } = useI18n();
    const [view, setView] = useState<ViewState>('idle');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

    const handleGenerateQuiz = async (retryCount = 0) => {
        if (!ai || !pageContent) return;

        setView('generating');
        setError(null);
        
        const prompt = `Por favor, genera 5 preguntas de cuestionario abiertas con sus respuestas ideales, basándote en el siguiente documento:\n\nTÍTULO: "${pageTitle || 'Sin título'}"\n\nCONTENIDO:\n---\n${pageContent}\n---\n\nResponde únicamente con un JSON válido en el siguiente formato:\n{\n  "questions": [\n    {\n      "question": "pregunta aquí",\n      "ideal_answer": "respuesta ideal aquí"\n    }\n  ]\n}`;

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
            
            const result = JSON.parse(jsonStr) as { questions: QuizQuestion[] };

            if (!result.questions || result.questions.length === 0) {
                throw new Error("La IA no pudo generar ninguna pregunta.");
            }

            setQuestions(result.questions);
            setView('answering');

        } catch (e) {
            console.error("Quiz generation failed:", e);
            
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
                            handleGenerateQuiz(retryCount + 1);
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
    
    const handleEvaluateAnswers = async (retryCount = 0) => {
        if (!ai) {
            setError('❌ Cliente de IA no inicializado. Verifica tu clave de API.');
            return;
        }

        console.log('Starting evaluation process...', { questionsCount: questions.length, userAnswersCount: Object.keys(userAnswers).length });
        setView('evaluating');
        setError(null);

        try {
            const evaluationPromises = questions.map(async (q, i) => {
                const userAnswer = userAnswers[i] || "No se proporcionó respuesta.";
                const prompt = `Eres un profesor justo y servicial. Evalúa la respuesta del usuario a una pregunta del cuestionario. La respuesta del usuario debe compararse con la respuesta ideal proporcionada, que se deriva de un documento fuente. Proporciona una puntuación de 0 (completamente incorrecto) a 5 (perfecto). Además, proporciona comentarios constructivos y concisos que expliquen la puntuación. Céntrate en si la respuesta del usuario captura los puntos clave de la respuesta ideal.

Pregunta: "${q.question}"
Respuesta Ideal del Documento: "${q.ideal_answer}"
Respuesta del Usuario: "${userAnswer}"

Responde únicamente con un JSON válido en el siguiente formato:
{
  "score": 4,
  "feedback": "comentarios aquí"
}`;

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
                
                try {
                    const result = JSON.parse(jsonStr);
                    // Validate the result structure
                    if (typeof result.score !== 'number' || typeof result.feedback !== 'string') {
                        throw new Error('Formato de respuesta inválido');
                    }
                    // Ensure score is within valid range
                    result.score = Math.max(0, Math.min(5, result.score));
                    return result;
                } catch (parseError) {
                    console.error('JSON parsing error for question', i, ':', parseError, 'Raw response:', jsonStr);
                    // Return a fallback result
                    return {
                        score: 0,
                        feedback: 'Error al procesar la evaluación de esta pregunta.'
                    };
                }
            });

            const results = await Promise.all(evaluationPromises);
            console.log('Evaluation completed successfully:', results);
            setEvaluationResults(results);
            setView('results');

        } catch (e) {
            console.error("Evaluation failed:", e);
            
            // Handle specific error types
            let errorMessage = 'Error desconocido. Por favor, inténtalo de nuevo.';
            
            if (e instanceof Error) {
                const errorText = e.message.toLowerCase();
                
                if (errorText.includes('503') || errorText.includes('overloaded') || errorText.includes('sobrecargado')) {
                    if (retryCount < 2) {
                        // Retry with exponential backoff
                        const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s
                        errorMessage = `El modelo está sobrecargado. Reintentando evaluación en ${delay/1000} segundos... (intento ${retryCount + 1}/3)`;
                        setError(errorMessage);
                        
                        setTimeout(() => {
                            handleEvaluateAnswers(retryCount + 1);
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
            setView('answering');
        }
    };
    
    const resetQuiz = () => {
        setView('idle');
        setQuestions([]);
        setUserAnswers({});
        setEvaluationResults([]);
        setCurrentQuestionIndex(0);
        setError(null);
    };

    const handleAnswerChange = (text: string) => {
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: text }));
    };

    const currentQuestion = questions[currentQuestionIndex];
    const totalScore = evaluationResults.reduce((sum, result) => sum + result.score, 0);
    const maxScore = questions.length * 5;
    const averageScore = questions.length > 0 ? (totalScore / questions.length).toFixed(1) : 0;


    const renderContent = () => {
        switch (view) {
            case 'generating':
            case 'evaluating':
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                           {view === 'generating' ? t('generatingQuiz') : 'Calificando tus respuestas...'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('thisMayTakeAMoment')}</p>
                    </div>
                );

            case 'answering':
                return (
                    <div className="p-6 flex-grow flex flex-col">
                        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">
                            {t('questionOf', currentQuestionIndex + 1, questions.length)}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{currentQuestion.question}</h3>
                        
                        <textarea
                            value={userAnswers[currentQuestionIndex] || ''}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            placeholder="Escribe tu respuesta aquí..."
                            className="w-full flex-grow p-3 text-base resize-none border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        />

                        <div className="mt-6 flex justify-between items-center">
                            <button onClick={() => setCurrentQuestionIndex(i => i - 1)} disabled={currentQuestionIndex === 0} className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                {t('previousPage')}
                            </button>
                            {currentQuestionIndex === questions.length - 1 ? (
                                <button onClick={() => handleEvaluateAnswers()} className="px-6 py-2.5 font-semibold rounded-lg shadow-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                                    {t('submitForGrading')}
                                </button>
                            ) : (
                                <button onClick={() => setCurrentQuestionIndex(i => i + 1)} className="px-6 py-2.5 font-semibold rounded-lg shadow-sm bg-primary-600 text-white hover:bg-primary-700">
                                    {t('nextPage')}
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'results':
                return (
                     <div className="p-6 overflow-y-auto">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('quizResults')}</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                {t('youScored', totalScore, maxScore)} {t('scoreAverage', averageScore)}
                            </p>
                        </div>
                        <div className="space-y-4">
                           {questions.map((q, index) => (
                               <ResultItem 
                                   key={index}
                                   question={q}
                                   userAnswer={userAnswers[index]}
                                   result={evaluationResults[index]}
                                   index={index}
                                   t={t}
                               />
                           ))}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button onClick={resetQuiz} className="inline-flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500">
                                <RefreshIcon className="text-2xl" />
                                <span className="ml-2">{t('tryAgain')}</span>
                            </button>
                        </div>
                    </div>
                );
                
            case 'idle':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <AcademicCapIcon className="text-5xl text-gray-400 dark:text-gray-500" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">{t('testYourKnowledge')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            {t('quizDescription')}
                        </p>
                        <button onClick={() => handleGenerateQuiz()} className="px-6 py-3 font-semibold rounded-lg shadow-md bg-primary-600 text-white hover:bg-primary-700 transition-transform transform hover:scale-105">
                            {t('generateQuiz')}
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
                className="w-full max-w-6xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 min-w-0">
                        <AcademicCapIcon className="text-2xl" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{t('quizFor', pageTitle || t('thisDocument'))}</h2>
                    </div>
                     <div className="flex items-center space-x-2">
                        {view === 'results' && (
                            <CopyButton 
                                textToCopy={formatResultsForCopy(questions, userAnswers, evaluationResults, pageTitle, t)}
                                ariaLabel={t('copyResults')}
                            />
                        )}
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label={t('closeQuiz')}>
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


// --- Result Item Sub-component ---
interface ResultItemProps {
    index: number;
    question: QuizQuestion;
    userAnswer: string;
    result: EvaluationResult;
    t: (key: string, ...args: any[]) => string;
}
const ResultItem: React.FC<ResultItemProps> = ({ index, question, userAnswer, result, t }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const scoreColor = result.score >= 4 ? 'text-green-500' : result.score >= 2 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="flex-1 font-semibold text-gray-800 dark:text-gray-200">{index + 1}. {question.question}</span>
                <div className="flex items-center ml-4">
                    <span className={`font-bold text-lg ${scoreColor}`}>{result.score}/5</span>
                    <ChevronDownIcon isRotated={isExpanded} className="text-2xl" />
                </div>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="space-y-4 text-sm">
                        <div>
                            <h5 className="font-semibold mb-1 text-gray-700 dark:text-gray-300">{t('yourAnswer')}</h5>
                            <p className="p-2 rounded-md bg-white dark:bg-gray-800 italic text-gray-600 dark:text-gray-400">{userAnswer || t('noAnswerProvided')}</p>
                        </div>
                         <div>
                            <h5 className="font-semibold mb-1 text-gray-700 dark:text-gray-300">{t('aiFeedback')}</h5>
                            <div className="p-2 rounded-md bg-white dark:bg-gray-800"><NestedMarkdown content={result.feedback} /></div>
                        </div>
                         <div>
                            <h5 className="font-semibold mb-1 text-gray-700 dark:text-gray-300">{t('idealAnswer')}</h5>
                            <p className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">{question.ideal_answer}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default GeminiQuizGenerator;
