import { Buffer } from 'buffer';
// FIX: Cast window to `any` to attach the Buffer property for the polyfill.
// This resolves the TypeScript error "Property 'Buffer' does not exist on type 'Window'".
(window as any).Buffer = Buffer;

// Import main CSS file with all dependencies
import './styles/main.css';
import './index.css';

// Import PrismJS for syntax highlighting
import 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';

// Initialize PrismJS with custom language support
import './utils/prismInit';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { NavProvider } from './context/NavContext';
import { ThemeProvider } from './context/ThemeContext';
import { GeminiProvider } from './context/GeminiContext';
import { I18nProvider } from './context/I18nContext';
import { VersionProvider } from './context/VersionContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <I18nProvider>
          <VersionProvider>
            <GeminiProvider>
              <NavProvider>
                <App />
              </NavProvider>
            </GeminiProvider>
          </VersionProvider>
        </I18nProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
