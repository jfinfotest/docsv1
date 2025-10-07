import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from './Icons';

interface DropdownOption {
  value: string;
  label: string;
}

interface AccessibleDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  Icon: React.FC<{ className?: string }>;
  ariaLabel: string;
  className?: string;
}

const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({
  options,
  value,
  onChange,
  Icon,
  ariaLabel,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    Math.max(0, options.findIndex((o) => o.value === value))
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
      item?.focus();
    }
  }, [isOpen, activeIndex]);

  const handleKeyDownButton = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      const next = e.key === 'ArrowDown' ? Math.min(options.length - 1, activeIndex + 1) : Math.max(0, activeIndex - 1);
      setActiveIndex(next);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((o) => !o);
    }
  };

  const handleKeyDownItem = (e: React.KeyboardEvent<HTMLButtonElement>, index: number, val: string) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = e.key === 'ArrowDown' ? Math.min(options.length - 1, index + 1) : Math.max(0, index - 1);
      setActiveIndex(next);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      onChange(val);
      setIsOpen(false);
      buttonRef.current?.focus();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className={`relative ${className || ''}`} ref={rootRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={handleKeyDownButton}
        className="flex items-center justify-start space-x-1 tablet:space-x-1.5 px-1.5 tablet:px-2.5 py-0.5 tablet:py-1.5 text-xs tablet:text-xs bg-primary-600 hover:bg-primary-500 border border-primary-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white transition-colors duration-200 w-full"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <Icon className="w-4 h-4 tablet:w-5 tablet:h-5 text-primary-200 flex-shrink-0" />
        <span className="text-left truncate">{selectedOption.label}</span>
        <ChevronDownIcon className={`w-3 h-3 tablet:w-4 tablet:h-4 text-primary-200 transition-transform duration-200 flex-shrink-0 ml-auto ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-3 w-full min-w-32 tablet:w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[9999] animate-fade-in-down">
          <ul
            ref={listRef}
            role="listbox"
            aria-label={ariaLabel}
            className="py-2 max-h-60 overflow-auto"
          >
            {options.map((option, index) => (
              <li key={option.value} className={index === 0 ? 'mt-1' : ''}>
                <button
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    buttonRef.current?.focus();
                  }}
                  onKeyDown={(e) => handleKeyDownItem(e, index, option.value)}
                  tabIndex={index === activeIndex ? 0 : -1}
                  className={`flex items-center justify-start w-full text-left px-4 tablet:px-5 py-3 tablet:py-3.5 text-sm tablet:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset hover:scale-[1.01] cursor-pointer min-h-[44px] tablet:min-h-[48px] ${
                    option.value === value
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/40 hover:text-primary-800 dark:hover:text-primary-200 hover:font-medium focus:bg-primary-50 dark:focus:bg-primary-900/30 focus:text-primary-800 dark:focus:text-primary-200'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fade-in-down 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default AccessibleDropdown;