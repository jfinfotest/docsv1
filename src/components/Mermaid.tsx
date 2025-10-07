import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

interface MermaidProps {
  chart: string;
  onError?: (errorMessage: string) => void;
}

const LoadingSpinner: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="flex flex-col items-center justify-center text-gray-500 min-h-[200px]">
            <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{t('mermaidRendering')}</span>
        </div>
    );
};

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => {
    const { t } = useI18n();
    return (
        <div className="text-red-600 p-4 bg-red-100 rounded-md w-full text-center min-h-[200px] flex flex-col justify-center">
            <p className="font-bold">{t('mermaidError')}</p>
            <p className="text-sm mt-2">{message}</p>
        </div>
    );
};

// Generate a valid CSS ID
const generateValidId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `mermaid-diagram-${timestamp}-${random}`;
};

const Mermaid: React.FC<MermaidProps> = ({ chart, onError }) => {
  const { font } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    
    const renderDiagram = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setSvgContent('');
        
        // Dynamic import of Mermaid
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;
        
        // Initialize with minimal configuration (always light mode)
        await mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: font || 'Inter, system-ui, sans-serif'
        });
        
        // Generate unique ID
        const diagramId = generateValidId();
        
        // Render diagram
        const result = await mermaid.render(diagramId, chart);
        const svg = typeof result === 'string' ? result : result.svg;
        
        if (!isCancelled && svg) {
          setSvgContent(svg);
          setIsLoading(false);
        }

      } catch (err) {
        console.error('Mermaid rendering error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al renderizar el diagrama';
        
        if (!isCancelled) {
          setError(errorMessage);
          setIsLoading(false);
          if (onError) {
            onError(errorMessage);
          }
        }
      }
    };

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [chart, font, onError]);

  // Update container when SVG content changes
  useEffect(() => {
    if (containerRef.current && svgContent) {
      containerRef.current.innerHTML = svgContent;
    }
  }, [svgContent]);
  
  return (
    <div className="my-8 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-md overflow-x-auto">
      {isLoading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} />}
      {!isLoading && !error && (
        <div 
          ref={containerRef} 
          className="w-full flex justify-center items-center min-h-[200px]"
        />
      )}
    </div>
  );
};

export default Mermaid;
