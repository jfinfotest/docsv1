import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useGemini } from '../context/GeminiContext';
import { CloseIcon, GeminiIcon, EyeIcon, EyeOffIcon, CheckIcon } from './Icons';
import { useI18n } from '../context/I18nContext';
import Tooltip from './Tooltip';

interface GeminiApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({ isOpen, onClose }) => {
    const { apiKey, setApiKey, isKeySet, clearApiKey } = useGemini();
    const { t } = useI18n();
    const [keyInput, setKeyInput] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

    useEffect(() => {
        if (isOpen) {
            setKeyInput(apiKey);
            setSaveStatus('idle');
        }
    }, [isOpen, apiKey]);

    const handleSaveKey = () => {
        setApiKey(keyInput);
        setSaveStatus('saved');
        setTimeout(() => {
            setSaveStatus('idle');
            onClose();
        }, 1500);
    };

    const handleClearKey = () => {
        clearApiKey();
        setKeyInput('');
        setSaveStatus('idle');
    };



    const handleClose = () => {
        setKeyInput(apiKey);
        setSaveStatus('idle');
        onClose();
    };

    if (!isOpen) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <GeminiIcon className="text-2xl text-primary-600 dark:text-primary-400" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {t('geminiApiKey')}
                        </h2>
                    </div>
                    <button 
                        onClick={handleClose} 
                        className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label={t('close')}
                    >
                        <CloseIcon className="text-xl" />
                    </button>
                </header>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="mb-2">{t('geminiApiKeyDescription')}</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                            {t('keySessionWarning')}
                        </p>
                        <p className="text-xs">{t('keyStored')}</p>
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="gemini-api-key-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('apiKey')}
                        </label>
                        <div className="relative">
                            <input
                                id="gemini-api-key-modal"
                                type={showKey ? 'text' : 'password'}
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                placeholder={t('pasteApiKey')}
                                className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                            <Tooltip content={showKey ? t('hideApiKey') : t('showApiKey')} position="left">
                                <button
                                    type="button"
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    aria-label={showKey ? t('hideKey') : t('showKey')}
                                >
                                    {showKey ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </Tooltip>
                        </div>
                    </div>



                    {/* Botón para limpiar clave */}
                    {isKeySet && (
                        <div className="pt-2">
                            <button
                                onClick={handleClearKey}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
                            >
                                {t('clearApiKey')}
                            </button>
                        </div>
                    )}

                    {/* Status indicator */}
                    <div className="text-xs">
                        {isKeySet ? (
                            <span className="text-green-600 dark:text-green-400 flex items-center">
                                <CheckIcon className="w-4 h-4 mr-1" />
                                {t('apiKeyActive')}
                            </span>
                        ) : (
                            <span className="text-yellow-600 dark:text-yellow-400">
                                {t('apiKeyNotSet')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSaveKey}
                        disabled={!keyInput.trim()}
                        className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                            saveStatus === 'saved' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        }`}
                    >
                        {saveStatus === 'saved' ? (
                            <span className="flex items-center">
                                <CheckIcon className="w-4 h-4 mr-1" />
                                {t('keySaved')}
                            </span>
                        ) : (
                            t('saveKey')
                        )}
                    </button>
                </div>
            </div>
        </div>,
        modalRoot
    );
};

export default GeminiApiKeyModal;