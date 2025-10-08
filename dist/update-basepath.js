#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Updating basePath configuration...');

// Función para actualizar el manifest.webmanifest con el nuevo basePath
function updateManifest(basePath) {
  const manifestPath = path.join(__dirname, 'manifest.webmanifest');
  
  if (!fs.existsSync(manifestPath)) {
    console.warn('⚠️ manifest.webmanifest not found');
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Actualizar scope y start_url con el basePath
    if (basePath && basePath !== '/') {
      manifest.scope = basePath;
      manifest.start_url = basePath;
    } else {
      manifest.scope = './';
      manifest.start_url = './';
    }
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest updated with basePath: ${basePath || './'}`);
  } catch (error) {
    console.error('❌ Error updating manifest:', error.message);
  }
}

// Función para actualizar el Service Worker con el nuevo basePath
function updateServiceWorker(basePath) {
  const swPath = path.join(__dirname, 'sw.js');
  
  if (!fs.existsSync(swPath)) {
    console.warn('⚠️ sw.js not found');
    return;
  }

  try {
    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Actualizar las rutas en el Service Worker para incluir el basePath
    if (basePath && basePath !== '/') {
      // Asegurar que el basePath termine con /
      const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
      
      // Actualizar las rutas de config.json y otras rutas críticas
      swContent = swContent.replace(
        /\/config\.json/g,
        `${normalizedBasePath}config.json`
      );
      
      // Actualizar NavigationRoute para usar el basePath correcto
      swContent = swContent.replace(
        /createHandlerBoundToURL\("index\.html"\)/g,
        `createHandlerBoundToURL("${normalizedBasePath}index.html")`
      );
    }
    
    fs.writeFileSync(swPath, swContent);
    console.log(`✅ Service Worker updated with basePath: ${basePath || './'}`);
  } catch (error) {
    console.error('❌ Error updating Service Worker:', error.message);
  }
}

// Función para normalizar basePath
function normalizeBasePath(basePath) {
  if (!basePath || basePath === '/') return '/';
  return basePath.endsWith('/') ? basePath : `${basePath}/`;
}

// Función para actualizar index.html con el basePath correcto
function updateIndexHtml(basePath) {
  const indexPath = path.join(__dirname, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.warn('⚠️ index.html not found');
    return;
  }

  try {
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    const normalizedBasePath = normalizeBasePath(basePath);
    
    // Update or add base-url meta tag
    const metaTagRegex = /<meta\s+name="base-url"\s+content="[^"]*"\s*\/?>/;
    const newMetaTag = `<meta name="base-url" content="${normalizedBasePath}">`;
    
    if (metaTagRegex.test(htmlContent)) {
      htmlContent = htmlContent.replace(metaTagRegex, newMetaTag);
    } else {
      // Insert after the first meta tag
      const firstMetaRegex = /(<meta[^>]*>)/;
      htmlContent = htmlContent.replace(firstMetaRegex, `$1\n    ${newMetaTag}`);
    }
    
    // Update all hardcoded basePath references in assets
    // Pattern to match: src="/any-basepath/assets/..." or href="/any-basepath/assets/..." or href="/any-basepath/manifest.webmanifest"
    const assetPathRegex = /((?:src|href)=")\/[^\/]*\/((?:assets\/[^"]*|manifest\.webmanifest[^"]*|registerSW\.js[^"]*))"/g;
    htmlContent = htmlContent.replace(assetPathRegex, `$1${normalizedBasePath}$2"`);
    
    // Add basepath-init.js script if not present
    const initScriptTag = '<script src="basepath-init.js" defer></script>';
    
    if (!htmlContent.includes('basepath-init.js')) {
      // Insert before closing </head> tag
      htmlContent = htmlContent.replace('</head>', `    ${initScriptTag}\n  </head>`);
    }
    
    fs.writeFileSync(indexPath, htmlContent);
    console.log(`✅ index.html updated with basePath: ${normalizedBasePath}`);
    console.log(`✅ Asset paths and auto-initialization script updated in index.html`);
  } catch (error) {
    console.error('❌ Error updating index.html:', error.message);
  }
}

// Función para actualizar registerSW.js
function updateRegisterSW(basePath) {
  const registerSWPath = path.join(__dirname, 'registerSW.js');
  
  if (!fs.existsSync(registerSWPath)) {
    console.warn('⚠️ registerSW.js not found');
    return;
  }

  try {
    let swContent = fs.readFileSync(registerSWPath, 'utf8');
    const normalizedBasePath = normalizeBasePath(basePath);
    
    // Update hardcoded paths in registerSW.js
    swContent = swContent.replace(/\/[^\/]*\/sw\.js/g, `${normalizedBasePath}sw.js`);
    
    fs.writeFileSync(registerSWPath, swContent);
    console.log(`✅ registerSW.js updated with basePath: ${normalizedBasePath}`);
  } catch (error) {
    console.error('❌ Error updating registerSW.js:', error.message);
  }
}

// Función para crear basepath-init.js
function createBasepathInit(basePath) {
  const normalizedBasePath = normalizeBasePath(basePath);
  
  const autoInitContent = `// Auto-initialization script for dynamic basePath detection
// This script runs automatically when the page loads

(function() {
  'use strict';
  
  function getBasePath() {
    // Priority 1: Check meta tag
    const metaTag = document.querySelector('meta[name="base-url"]');
    if (metaTag && metaTag.content) {
      return metaTag.content;
    }
    
    // Priority 2: Check window.APP_CONFIG
    if (window.APP_CONFIG && window.APP_CONFIG.basePath) {
      return window.APP_CONFIG.basePath;
    }
    
    // Priority 3: Try to load config.json from possible basePath
    const currentPath = window.location.pathname;
    const possibleBasePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    
    // For GitHub Pages, try to detect from URL structure
    if (window.location.hostname.includes('github.io')) {
      const pathParts = currentPath.split('/').filter(part => part);
      if (pathParts.length > 0) {
        return '/' + pathParts[0] + '/';
      }
    }
    
    return possibleBasePath || '/';
  }
  
  function updateBasePath() {
    const detectedBasePath = getBasePath();
    
    // Update window.APP_CONFIG
    if (!window.APP_CONFIG) {
      window.APP_CONFIG = {};
    }
    window.APP_CONFIG.basePath = detectedBasePath;
    
    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('basepath-updated', {
      detail: { basePath: detectedBasePath }
    }));
    
    console.log('🔧 BasePath auto-detected:', detectedBasePath);
  }
  
  // Initialize immediately
  updateBasePath();
  
  // Check for changes periodically (for dynamic updates)
  setInterval(updateBasePath, 5000);
  
})();`;

  const autoInitPath = path.join(__dirname, 'basepath-init.js');
  fs.writeFileSync(autoInitPath, autoInitContent);
  console.log('✅ Auto-init script created: basepath-init.js');
}

// Función principal
function main() {
  try {
    // Leer config.json
    const configPath = path.join(__dirname, 'config.json');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ config.json not found');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const basePath = config.githubPages?.basePath || '';
    const normalizedBasePath = normalizeBasePath(basePath);

    console.log(`📁 Raw basePath from config: ${basePath || '(root)'}`);
    console.log(`📁 Normalized basePath: ${normalizedBasePath}`);

    // Actualizar todos los archivos
    updateManifest(basePath);
    updateServiceWorker(basePath);
    updateIndexHtml(basePath);
    updateRegisterSW(basePath);
    createBasepathInit(basePath);

    console.log('✅ BasePath configuration updated successfully!');
    console.log(`🚀 All files updated with basePath: ${normalizedBasePath}`);
    console.log('💡 Auto-initialization script created for dynamic updates');
    
  } catch (error) {
    console.error('❌ Error updating basePath configuration:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  main();
}

export { updateManifest, updateServiceWorker, updateIndexHtml, updateRegisterSW, createBasepathInit };