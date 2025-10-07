import React, { useState } from 'react';
import { GeminiIcon, MessageIcon, AcademicCapIcon, CloseIcon, ClipboardListIcon, LightbulbIdeaIcon, CodeBracketIcon, ListIcon, AudioWaveformIcon } from './Icons';
import { useI18n } from '../context/I18nContext';
import Tooltip from './Tooltip';

interface FloatingActionBarProps {
    onChatClick: () => void;
    onQuizClick: () => void;
    onGlossaryClick: () => void;
    onSummarizerClick: () => void;
    onSimplifierClick: () => void;
    onCodeAnalyzerClick: () => void;
    onPodcastClick: () => void;
}

const FloatingActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; tooltip: string; yTranslate: string; }> = ({ onClick, children, tooltip, yTranslate }) => {
    return (
        <div className={`transition-transform duration-300 ease-in-out ${yTranslate}`}>
            <Tooltip content={tooltip} position="left">
                <button
                    onClick={onClick}
                    className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    aria-label={tooltip}
                >
                    {children}
                </button>
            </Tooltip>
        </div>
    );
};


const FloatingActionBar: React.FC<FloatingActionBarProps> = ({ onChatClick, onQuizClick, onGlossaryClick, onSummarizerClick, onSimplifierClick, onCodeAnalyzerClick, onPodcastClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useI18n();

    // Reordered for better UX: Chat > Content Transformation > Knowledge/Tools
    return (
        <div className="fixed bottom-6 right-6 lg:right-8 xl:right-12 2xl:right-[calc((100vw-1536px)/2+3rem)] z-40 flex flex-col items-center space-y-4 group">
             {isOpen && (
                <>
                    <FloatingActionButton onClick={onChatClick} tooltip={t('chatWithAi')} yTranslate="translate-y-0">
                        <MessageIcon className="text-2xl" />
                    </FloatingActionButton>
                    <FloatingActionButton onClick={onSummarizerClick} tooltip={t('generateSummary')} yTranslate="translate-y-0">
                        <ListIcon className="text-2xl" />
                    </FloatingActionButton>
                    <FloatingActionButton onClick={onSimplifierClick} tooltip={t('simplifyConcept')} yTranslate="translate-y-0">
                        <LightbulbIdeaIcon className="text-2xl" />
                    </FloatingActionButton>
                    <FloatingActionButton onClick={onPodcastClick} tooltip={t('generateAiPodcast')} yTranslate="translate-y-0">
                        <AudioWaveformIcon className="text-2xl" />
                    </FloatingActionButton>
                    <FloatingActionButton onClick={onGlossaryClick} tooltip={t('generateGlossary')} yTranslate="translate-y-0">
                        <ClipboardListIcon className="text-2xl" />
                    </FloatingActionButton>
                    <FloatingActionButton onClick={onQuizClick} tooltip={t('generateAiQuiz')} yTranslate="translate-y-0">
                        <AcademicCapIcon className="text-2xl" />
                    </FloatingActionButton>
                    <FloatingActionButton onClick={onCodeAnalyzerClick} tooltip={t('analyzeCode')} yTranslate="translate-y-0">
                        <CodeBracketIcon className="text-2xl" />
                    </FloatingActionButton>
                </>
            )}
            <Tooltip content={isOpen ? t('closeAiActions') : t('openAiActions')} position="left">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-300"
                    aria-label={isOpen ? t('closeAiActions') : t('openAiActions')}
                >
                    <div className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                        {isOpen ? <CloseIcon className="text-2xl" /> : <GeminiIcon className="text-2xl" />}
                    </div>
                </button>
            </Tooltip>
        </div>
    );
};

export default FloatingActionBar;
