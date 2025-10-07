import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNav } from '../context/NavContext';
import { SearchDocument } from '../types';
import SearchResults from './SearchResults';
import { SearchIcon } from './Icons';
import { useI18n } from '../context/I18nContext';

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchDocument[]>([]);
    const [isActive, setIsActive] = useState(false);
    const { search, loading } = useNav();
    const { t } = useI18n();
    const searchRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (debouncedQuery) {
            setResults(search(debouncedQuery));
        } else {
            setResults([]);
        }
    }, [debouncedQuery, search]);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setIsActive(false);
        }
    }, []);
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        // Close search results on route change
        setIsActive(false);
        setQuery('');
    }, [location]);

    const handleResultClick = (pathWithAnchor: string) => {
        // pathWithAnchor is in the format "folder/file.md#anchor-id"
        const [path, anchor] = pathWithAnchor.split('#');
        
        let to = `/${path.replace(/\.md$/, '')}`;
        if (anchor) {
            to += `#${anchor}`;
        }

        navigate(to);
        setIsActive(false);
        setQuery('');
    };

    return (
        <div ref={searchRef} className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-300 pointer-events-none">
                <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <input
                className="w-full py-0.5 sm:py-1.5 pl-8 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base bg-primary-600 border border-primary-500 rounded-lg text-white placeholder-primary-200 focus:outline-none focus:bg-primary-500 focus:border-white transition-colors duration-200"
                type="text"
                placeholder={t('searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsActive(true)}
                disabled={loading}
            />
            {isActive && (query.length > 0) && (
                <SearchResults
                    query={query}
                    results={results}
                    onResultClick={handleResultClick}
                    isLoading={loading}
                />
            )}
        </div>
    );
};

export default SearchBar;
