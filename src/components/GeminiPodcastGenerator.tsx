import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useGemini } from '../context/GeminiContext';
import { CloseIcon, AudioWaveformIcon, RefreshIcon, DownloadIcon } from './Icons';
import { useI18n } from '../context/I18nContext';
import CopyButton from './CopyButton';

// --- Type Definitions ---
interface GeminiPodcastGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    pageContent: string | null;
    pageTitle: string | undefined;
}

type ViewState = 'idle' | 'generatingScript' | 'generatingAudio' | 'results';
type PodcastStyle = 'monologue' | 'dialogue';

interface PodcastSpeaker {
  name: string;
  voice: string;
}

// --- Constants ---
const GEMINI_TTS_VOICES = [
  "Kore", "Puck", "Charon", "Fenrir", "Leda", "Callirrhoe", "Aoede", "Enceladus", "Iapetus", "Algieba", "Algenib", "Rasalgethi", "Laomedeia", "Achernar", "Alnilam", "Schedar", "Gacrux", "Pulcherrima", "Achird", "Zubenelgenubi", "Vindemiatrix", "Sadachbia", "Sadaltager", "Sulafat", "Orus", "Autonoe", "Umbriel", "Erinome", "Despina"
];

// --- Helper Functions ---
function pcmToWav(pcmData: Uint8Array, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Blob {
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  view.setUint32(0, 0x52494646, false); // 'RIFF'
  view.setUint32(4, 36 + pcmData.length, true);
  view.setUint32(8, 0x57415645, false); // 'WAVE'
  view.setUint32(12, 0x666d7420, false); // 'fmt '
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  view.setUint32(36, 0x64617461, false); // 'data'
  view.setUint32(40, pcmData.length, true);
  return new Blob([wavHeader, new Uint8Array(pcmData)], { type: 'audio/wav' });
}

// Parse script into speaker segments for dialogue mode
function parseScriptBySpeakers(script: string, speakers: PodcastSpeaker[]): Array<{speaker: PodcastSpeaker, text: string}> {
  const lines = script.split('\n').filter(line => line.trim());
  const segments: Array<{speaker: PodcastSpeaker, text: string}> = [];
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const speakerName = line.substring(0, colonIndex).trim().toUpperCase();
      const text = line.substring(colonIndex + 1).trim();
      
      if (text) {
        // Try to match speaker by name, or use alternating speakers for dialogue
        let speaker = speakers.find(s => s.name.toUpperCase() === speakerName);
        
        if (!speaker) {
          // If no exact match, alternate between speakers based on common dialogue patterns
          if (speakerName.includes('NARRADOR') || speakerName.includes('HOST') || speakerName.includes('PRESENTADOR')) {
            speaker = speakers[0];
          } else if (speakerName.includes('EXPERTO') || speakerName.includes('INVITADO') || speakerName.includes('GUEST')) {
            speaker = speakers[1] || speakers[0];
          } else {
            // Default alternating pattern
            speaker = segments.length % 2 === 0 ? speakers[0] : (speakers[1] || speakers[0]);
          }
        }
        
        segments.push({ speaker, text });
      }
    }
  }
  
  return segments;
}

// Generate audio for a single text segment with specific voice
async function generateAudioSegment(text: string, voice: string, apiKey: string): Promise<Uint8Array> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: text
        }]
      }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice
            }
          }
        }
      }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }
  
  const audioResult = await response.json();
  const audioData = audioResult.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  
  if (!audioData) {
    throw new Error('No audio data received from API');
  }
  
  return Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
}

// Generate audio for dialogue mode with multiple speakers
async function generateDialogueAudio(script: string, speakers: PodcastSpeaker[], apiKey: string): Promise<Uint8Array> {
  const speakerVoiceConfigs = speakers.slice(0, 2).map((speaker) => ({
    speaker: speaker.name,
    voiceConfig: {
      prebuiltVoiceConfig: {
        voiceName: speaker.voice
      }
    }
  }));
  
  console.log('Dialogue audio configuration:');
  console.log('Script preview:', script.substring(0, 200) + '...');
  console.log('Speaker voice configs:', speakerVoiceConfigs);
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: script
        }]
      }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: speakerVoiceConfigs
          }
        }
      }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }
  
  const audioResult = await response.json();
  const audioData = audioResult.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  
  if (!audioData) {
    throw new Error('No audio data received from API');
  }
  
  return Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
}

// Combine multiple audio segments into one
function combineAudioSegments(segments: Uint8Array[]): Uint8Array {
  const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0);
  const combined = new Uint8Array(totalLength);
  
  let offset = 0;
  for (const segment of segments) {
    combined.set(segment, offset);
    offset += segment.length;
  }
  
  return combined;
}


// --- Main Component ---
const GeminiPodcastGenerator: React.FC<GeminiPodcastGeneratorProps> = ({ isOpen, onClose, pageContent, pageTitle }) => {
    const { apiKey, isKeySet } = useGemini();
    const { t } = useI18n();
    
    const [view, setView] = useState<ViewState>('idle');
    const [script, setScript] = useState<string | null>(null);
    const [style, setStyle] = useState<PodcastStyle>('dialogue');
    const [speakers, setSpeakers] = useState<PodcastSpeaker[]>([
        { name: 'NARRADOR', voice: 'Kore' },
        { name: 'EXPERTO', voice: 'Puck' }
    ]);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ai, setAi] = useState<GoogleGenerativeAI | null>(null);

    useEffect(() => {
        if (isKeySet && !ai) {
            try {
                setAi(new GoogleGenerativeAI(apiKey));
            } catch(e) {
                 console.error("Failed to initialize GoogleGenerativeAI", e);
                 setError(t('geminiInitError'));
            }
        }
    }, [isKeySet, apiKey, ai, t]);

    useEffect(() => {
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);
    
    const handleSpeakerChange = (index: number, field: keyof PodcastSpeaker, value: string) => {
        setSpeakers(prev => {
            const newSpeakers = [...prev];
            newSpeakers[index] = { ...newSpeakers[index], [field]: value };
            return newSpeakers;
        });
    };

    const handleGenerate = async (retryCount = 0) => {
        if (!ai || !pageContent) return;

        const currentSpeakers = style === 'monologue' ? [speakers[0]] : speakers;
        if (currentSpeakers.some(s => !s.name.trim())) {
            setError(t('speakerNameError'));
            return;
        }

        setView('generatingScript');
        setError(null);
        setScript(null);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);

        const speakerNamesForPrompt = style === 'dialogue'
            ? `un diálogo conversacional entre ${speakers[0].name.trim()} y ${speakers[1].name.trim()}.`
            : `un monólogo narrado por ${speakers[0].name.trim()}.`;
        
        const scriptPrompt = `Crea un guion de podcast atractivo a partir del siguiente documento.
- Estilo: ${speakerNamesForPrompt}
- Formato: Cada línea DEBE empezar con el nombre del locutor EXACTAMENTE como se especifica seguido de dos puntos. Para diálogo usa: "${speakers[0].name.trim().toUpperCase()}: Texto..." y "${speakers[1] ? speakers[1].name.trim().toUpperCase() : speakers[0].name.trim().toUpperCase()}: Texto...". No incluyas ninguna otra anotación, solo el texto hablado.
- Tono: Educativo pero conversacional y fácil de seguir.
- Idioma: Español.
- Fuente: Basa el guion *únicamente* en el contenido del documento proporcionado.

TÍTULO: "${pageTitle || 'Sin título'}"
DOCUMENTO:\n---\n${pageContent}\n---`;
        
        try {
            const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const scriptResponse = await model.generateContent(scriptPrompt);
            const generatedScript = scriptResponse.response.text().trim();
            if (!generatedScript) throw new Error("La IA no pudo generar un guion.");
            setScript(generatedScript);

            // Generate audio using Gemini TTS
            setView('generatingAudio');
            
            // Generate audio using Gemini TTS API
            try {
                console.log('Starting audio generation...');
                
                if (style === 'dialogue') {
                    // For dialogue mode, try to generate audio with multiple speakers
                    console.log('Generating dialogue audio with multiple voices...');
                    try {
                        const audioBuffer = await generateDialogueAudio(generatedScript, currentSpeakers, ai.apiKey);
                        const wavBlob = pcmToWav(audioBuffer);
                        const url = URL.createObjectURL(wavBlob);
                        setAudioUrl(url);
                        console.log('Dialogue audio generated successfully');
                    } catch (dialogueError) {
                        console.warn('Dialogue mode failed, falling back to monologue mode:', dialogueError);
                        // Fallback to monologue mode
                        const audioBuffer = await generateAudioSegment(generatedScript, currentSpeakers[0].voice, ai.apiKey);
                        const wavBlob = pcmToWav(audioBuffer);
                        const url = URL.createObjectURL(wavBlob);
                        setAudioUrl(url);
                        console.log('Fallback monologue audio generated successfully');
                    }
                } else {
                    // For monologue mode, use single voice
                    console.log('Generating monologue audio...');
                    const audioBuffer = await generateAudioSegment(generatedScript, currentSpeakers[0].voice, ai.apiKey);
                    const wavBlob = pcmToWav(audioBuffer);
                    const url = URL.createObjectURL(wavBlob);
                    setAudioUrl(url);
                    console.log('Monologue audio generated successfully');
                }
                
            } catch (audioError) {
                console.error('Audio generation failed:', audioError);
                const errorMessage = audioError instanceof Error ? audioError.message : 'Error desconocido';
                
                // Check if it's a rate limit error (429)
                if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
                    console.warn('Rate limit exceeded, showing script without audio');
                    // Don't set error, just continue without audio - this will show only the script
                } else {
                    setError(`Error generando audio: ${errorMessage}`);
                }
                // If audio generation fails, still show the script
                console.log('Fallback: showing script only due to audio generation error');
            }
            
            setView('results');

        } catch (e) {
            console.error("Podcast generation failed:", e);
            
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
                            handleGenerate(retryCount + 1);
                        }, delay);
                        return;
                    } else {
                        errorMessage = '🚫 El servicio de IA está temporalmente sobrecargado. Por favor, inténtalo de nuevo en unos minutos.';
                    }
                } else if (errorText.includes('403') || errorText.includes('api key') || errorText.includes('permission')) {
                    errorMessage = '🔑 Error de autenticación. Verifica que tu clave de API de Gemini sea válida y tenga los permisos necesarios.';
                } else if (errorText.includes('quota') || errorText.includes('limit') || errorText.includes('429') || errorText.includes('resource_exhausted')) {
                    // For rate limit errors, don't show error - just continue without audio
                    console.warn('Rate limit exceeded in main error handler, showing script without audio');
                    setView('results');
                    return; // Exit early, don't set error
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
        setScript(null);
        setError(null);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
    };
    
    useEffect(() => { if (!isOpen) setTimeout(reset, 300); }, [isOpen]);

    const renderContent = () => {
        switch (view) {
            case 'generatingScript':
            case 'generatingAudio':
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            {view === 'generatingScript' ? t('generatingScript') : t('generatingAudio')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('thisMayTakeAMoment')}</p>
                    </div>
                );
            case 'results':
                return (
                    <div className="p-6 flex flex-col flex-grow min-h-0">
                        {audioUrl ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                        🎧 {t('podcastReady')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {t('listenToYourPodcast')}
                                    </p>
                                </div>
                                <div className="w-full max-w-md">
                                    <audio controls src={audioUrl} className="w-full rounded-lg shadow-lg">
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                        📝 {t('podcastGenerated')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {t('audioNotAvailable')}
                                    </p>
                                </div>
                            </div>
                         )}
                     </div>
                );
            case 'idle':
            default:
                return (
                    <div className="p-6 overflow-y-auto space-y-8">
                        <section>
                            <label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">{t('podcastStyle')}</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setStyle('monologue')} className={`p-4 border-2 rounded-lg text-left transition-colors ${style === 'monologue' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'}`}>
                                    <div className="font-bold text-gray-800 dark:text-gray-200">{t('monologue')}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('monologueDesc')}</div>
                                </button>
                                <button onClick={() => setStyle('dialogue')} className={`p-4 border-2 rounded-lg text-left transition-colors ${style === 'dialogue' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'}`}>
                                    <div className="font-bold text-gray-800 dark:text-gray-200">{t('dialogue')}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dialogueDesc')}</div>
                                </button>
                            </div>
                        </section>
                        <section>
                            <label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">{t('podcastVoices')}</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{style === 'monologue' ? t('monologueSpeakerName') : t('dialogueSpeaker1Name')}</label>
                                    <input type="text" value={speakers[0].name} onChange={e => handleSpeakerChange(0, 'name', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500" placeholder={t('monologueSpeakerName')}/>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('voice')}</label>
                                    <select value={speakers[0].voice} onChange={e => handleSpeakerChange(0, 'voice', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500">
                                        {GEMINI_TTS_VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                {style === 'dialogue' && (
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('dialogueSpeaker2Name')}</label>
                                        <input type="text" value={speakers[1].name} onChange={e => handleSpeakerChange(1, 'name', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500" placeholder={t('dialogueSpeaker2Name')}/>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('voice')}</label>
                                        <select value={speakers[1].voice} onChange={e => handleSpeakerChange(1, 'voice', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500">
                                            {GEMINI_TTS_VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </section>
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
            onClick={onClose} role="dialog" aria-modal="true"
        >
            <div
                className="w-full max-w-5xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 min-w-0">
                        <AudioWaveformIcon className="text-2xl text-gray-600 dark:text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{t('podcastFor', pageTitle || t('thisDocument'))}</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        {view === 'results' && audioUrl && (
                            <a href={audioUrl} download={`${pageTitle || 'podcast'}.wav`} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label={t('downloadAudio')}>
                                <DownloadIcon className="text-2xl" />
                            </a>
                        )}
                        {view === 'results' && script && <CopyButton textToCopy={script} ariaLabel={t('copyScript')} />}
                        {view !== 'idle' && <button onClick={reset} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label={t('startOver')}><RefreshIcon className="text-2xl" /></button>}
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label={t('closePodcast')}><CloseIcon className="text-2xl" /></button>
                    </div>
                </header>
                <main className="flex-grow flex flex-col min-h-0">
                   {error && <div className="m-4 text-red-500 text-sm p-3 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}
                   {!isKeySet && view === 'idle' && <p className="m-4 text-center text-xs text-yellow-600 dark:text-yellow-400">{t('noApiKey')}</p>}
                   {renderContent()}
                </main>
                 {view === 'idle' && (
                    <footer className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            onClick={() => handleGenerate()} 
                            disabled={!isKeySet || (style === 'monologue' ? !speakers[0].name.trim() : speakers.some(s => !s.name.trim()))}
                            className="w-full px-6 py-3 font-semibold rounded-lg shadow-md bg-primary-600 text-white hover:bg-primary-700 transition-transform transform hover:scale-105 disabled:bg-primary-400 disabled:cursor-not-allowed"
                        >
                            {t('generatePodcast')}
                        </button>
                    </footer>
                )}
            </div>
        </div>,
        modalRoot
    );
};

export default GeminiPodcastGenerator;
