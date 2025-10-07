import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';
import Tooltip from './Tooltip';
import { useI18n } from '../context/I18nContext';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    ariaLabel?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className, ariaLabel }) => {
    const [isCopied, setIsCopied] = useState(false);
    const { t } = useI18n();

    const defaultAriaLabel = ariaLabel || t('copyCode');

    const handleCopy = () => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Tooltip content={isCopied ? t('codeCopied') : defaultAriaLabel} position="bottom">
            <button
                onClick={handleCopy}
                className={`p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white ${className || ''}`}
                aria-label={defaultAriaLabel}
            >
                {isCopied ? <CheckIcon className="text-2xl text-green-500" /> : <CopyIcon className="text-2xl" />}
            </button>
        </Tooltip>
    );
};

export default CopyButton;
