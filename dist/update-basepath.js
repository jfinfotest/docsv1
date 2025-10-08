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

// Función para actualizar index.html con el basePath correcto
function updateIndexHtml(basePath) {
  const indexPath = path.join(__dirname, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.warn('⚠️ index.html not found');
    return;
  }

  try {
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // Actualizar las rutas de assets si es necesario
    if (basePath && basePath !== '/') {
      // Asegurar que el basePath termine con /
      const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
      
      // Actualizar meta tags que puedan necesitar el basePath
      htmlContent = htmlContent.replace(
        /<meta name="base-url" content="[^"]*">/g,
        `<meta name="base-url" content="${normalizedBasePath}">`
      );
      
      // Si no existe el meta tag, agregarlo después del primer meta tag
      if (!htmlContent.includes('<meta name="base-url"')) {
        htmlContent = htmlContent.replace(
          /<meta([^>]*)>/,
          `<meta$1>
    <meta name="base-url" content="${normalizedBasePath}">`
        );
      }
    }
    
    fs.writeFileSync(indexPath, htmlContent);
    console.log(`✅ index.html updated with basePath: ${basePath || './'}`);
  } catch (error) {
    console.error('❌ Error updating index.html:', error.message);
  }
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

    console.log(`📁 Using basePath: ${basePath || '(root)'}`);

    // Actualizar todos los archivos
    updateManifest(basePath);
    updateServiceWorker(basePath);
    updateIndexHtml(basePath);

    console.log('✅ BasePath configuration updated successfully!');
    console.log('💡 Remember to run force-pwa-update.js to apply PWA changes');
    
  } catch (error) {
    console.error('❌ Error updating basePath configuration:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { updateManifest, updateServiceWorker, updateIndexHtml };