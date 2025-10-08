#!/usr/bin/env node

/**
 * Script para forzar la actualización de la PWA con cache busting agresivo
 * Cambia los hashes de archivos para invalidar el cache del navegador
 * 
 * Uso: node public/force-pwa-update.js
 * 
 * Este script debe ejecutarse DESPUÉS del build pero ANTES de distribuir
 * la carpeta dist.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const DIST_DIR = path.join(__dirname, '..', 'dist');
const MANIFEST_FILE = path.join(DIST_DIR, 'manifest.webmanifest');
const SW_FILE = path.join(DIST_DIR, 'sw.js');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');
const REGISTER_SW_FILE = path.join(DIST_DIR, 'registerSW.js');

console.log('🔄 Iniciando actualización forzada de PWA con cache busting agresivo...');

/**
 * Genera un hash único basado en timestamp
 */
function generateVersionHash() {
  const timestamp = Date.now().toString();
  return crypto.createHash('md5').update(timestamp).digest('hex').substring(0, 8);
}

/**
 * Limpia parámetros de versión existentes de una URL
 */
function cleanVersionParams(url) {
  return url.split('?')[0].split('#')[0];
}

/**
 * Actualiza el manifest.webmanifest con cache busting agresivo
 */
function updateManifest() {
  if (!fs.existsSync(MANIFEST_FILE)) {
    console.log('⚠️  Archivo manifest.webmanifest no encontrado');
    return false;
  }

  try {
    const manifestContent = fs.readFileSync(MANIFEST_FILE, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Agregar parámetro de versión para forzar actualización
    const versionHash = generateVersionHash();
    const timestamp = Date.now();
    
    manifest.version = versionHash;
    manifest.updated = new Date().toISOString();
    manifest.start_url = `./index.html?v=${versionHash}&t=${timestamp}`;
    
    // Actualizar iconos con parámetros de versión (limpiar versiones anteriores)
    if (manifest.icons) {
      manifest.icons = manifest.icons.map(icon => ({
        ...icon,
        src: `${cleanVersionParams(icon.src)}?v=${versionHash}&t=${timestamp}`
      }));
    }

    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest actualizado con versión: ${versionHash} y timestamp: ${timestamp}`);
    return versionHash;
  } catch (error) {
    console.error('❌ Error actualizando manifest:', error.message);
    return false;
  }
}

/**
 * Actualiza el archivo index.html con cache busting agresivo
 */
function updateIndexHtml(versionHash) {
  if (!fs.existsSync(INDEX_FILE)) {
    console.log('⚠️  Archivo index.html no encontrado');
    return false;
  }

  try {
    let htmlContent = fs.readFileSync(INDEX_FILE, 'utf8');
    const timestamp = Date.now();
    
    // Actualizar referencias al manifest (limpiar versiones anteriores)
    htmlContent = htmlContent.replace(
      /href="([^"]*manifest\.webmanifest)[^"]*"/g,
      `href="$1?v=${versionHash}&t=${timestamp}"`
    );
    
    // Actualizar referencias al service worker (limpiar versiones anteriores)
    htmlContent = htmlContent.replace(
      /src="([^"]*registerSW\.js)[^"]*"/g,
      `src="$1?v=${versionHash}&t=${timestamp}"`
    );
    
    // Actualizar archivos CSS y JS principales (limpiar versiones anteriores)
    htmlContent = htmlContent.replace(
      /href="([^"]*\/assets\/index-[^"]*\.css)[^"]*"/g,
      `href="$1?v=${versionHash}&t=${timestamp}"`
    );
    
    htmlContent = htmlContent.replace(
      /src="([^"]*\/assets\/index-[^"]*\.js)[^"]*"/g,
      `src="$1?v=${versionHash}&t=${timestamp}"`
    );
    
    // Agregar meta tags de versión y cache busting
    const versionMeta = `<meta name="pwa-version" content="${versionHash}">`;
    const timestampMeta = `<meta name="pwa-timestamp" content="${timestamp}">`;
    const cacheBustingMetas = `<meta name="cache-control" content="no-cache, no-store, must-revalidate">\n    <meta name="pragma" content="no-cache">\n    <meta name="expires" content="0">`;
    
    // Reemplazar o agregar meta de versión
    htmlContent = htmlContent.replace(
      /<meta name="pwa-version"[^>]*>/g,
      versionMeta
    );
    
    if (!htmlContent.includes('pwa-version')) {
      htmlContent = htmlContent.replace(
        /<head>/,
        `<head>\n    ${versionMeta}`
      );
    }
    
    // Agregar meta de timestamp
    if (!htmlContent.includes('pwa-timestamp')) {
      htmlContent = htmlContent.replace(
        versionMeta,
        `${versionMeta}\n    ${timestampMeta}`
      );
    }
    
    // Agregar metas de cache busting
    if (!htmlContent.includes('cache-control')) {
      htmlContent = htmlContent.replace(
        timestampMeta,
        `${timestampMeta}\n    ${cacheBustingMetas}`
      );
    }

    fs.writeFileSync(INDEX_FILE, htmlContent);
    console.log('✅ index.html actualizado con cache busting agresivo');
    return true;
  } catch (error) {
    console.error('❌ Error actualizando index.html:', error.message);
    return false;
  }
}

/**
 * Actualiza el service worker con estrategia de actualización forzada
 */
function updateServiceWorker() {
  if (!fs.existsSync(SW_FILE)) {
    console.log('⚠️  Service Worker no encontrado');
    return false;
  }

  try {
    let swContent = fs.readFileSync(SW_FILE, 'utf8');
    const versionHash = generateVersionHash();
    const timestamp = Date.now();
    
    // Agregar comentario con nueva versión al inicio del SW
    const versionComment = `// PWA Version: ${versionHash} - ${new Date().toISOString()} - Timestamp: ${timestamp}\n`;
    
    // Remover comentario de versión anterior si existe
    swContent = swContent.replace(/\/\/ PWA Version:.*\n/g, '');
    
    // Agregar nuevo comentario de versión
    swContent = versionComment + swContent;
    
    // Agregar estrategia de actualización agresiva
    const updateStrategy = `\n// Estrategia de actualización forzada\nself.addEventListener('install', event => {\n  console.log('SW: Instalando versión ${versionHash}');\n  self.skipWaiting();\n});\n\nself.addEventListener('activate', event => {\n  console.log('SW: Activando versión ${versionHash}');\n  event.waitUntil(\n    caches.keys().then(cacheNames => {\n      return Promise.all(\n        cacheNames.map(cacheName => {\n          console.log('SW: Eliminando cache:', cacheName);\n          return caches.delete(cacheName);\n        })\n      );\n    }).then(() => {\n      console.log('SW: Todos los caches eliminados para versión ${versionHash}');\n      return self.clients.claim();\n    })\n  );\n});\n\nself.addEventListener('message', event => {\n  if (event.data && event.data.type === 'SKIP_WAITING') {\n    self.skipWaiting();\n  }\n});\n`;
    
    // Agregar estrategia si no está presente
    if (!swContent.includes('Estrategia de actualización forzada')) {
      swContent = swContent.replace(versionComment, versionComment + updateStrategy);
    }
    
    // Actualizar cualquier referencia a archivos con parámetros de versión (limpiar versiones anteriores)
    swContent = swContent.replace(
      /"url":"([^"]+?)(?:\?[^"]*)?"(?=,|\])/g,
      `"url":"$1?v=${versionHash}&t=${timestamp}"`
    );

    fs.writeFileSync(SW_FILE, swContent);
    console.log(`✅ Service Worker actualizado con versión: ${versionHash} y estrategia forzada`);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando Service Worker:', error.message);
    return false;
  }
}

/**
 * Actualiza o crea registerSW.js con estrategia de actualización forzada
 */
function updateRegisterSW(versionHash) {
  const timestamp = Date.now();
  const newContent = `// PWA Registration - Version: ${versionHash} - ${new Date().toISOString()}\nif('serviceWorker' in navigator) {\n  window.addEventListener('load', () => {\n    navigator.serviceWorker.register('/docsv1/sw.js?v=${versionHash}&t=${timestamp}', { \n      scope: '/docsv1/',\n      updateViaCache: 'none'\n    }).then(registration => {\n      console.log('SW: Registrado con versión ${versionHash}');\n      \n      // Forzar verificación de actualización\n      registration.addEventListener('updatefound', () => {\n        const newWorker = registration.installing;\n        newWorker.addEventListener('statechange', () => {\n          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {\n            console.log('SW: Nueva versión disponible, forzando actualización');\n            newWorker.postMessage({type: 'SKIP_WAITING'});\n            window.location.reload(true);\n          }\n        });\n      });\n      \n      // Verificar actualizaciones cada 30 segundos\n      setInterval(() => {\n        registration.update();\n      }, 30000);\n      \n    }).catch(error => {\n      console.error('SW: Falló el registro:', error);\n    });\n  });\n}\n\n// Forzar limpieza de cache en carga\nif ('caches' in window) {\n  caches.keys().then(cacheNames => {\n    const oldCaches = cacheNames.filter(name => !name.includes('${versionHash}'));\n    return Promise.all(oldCaches.map(name => caches.delete(name)));\n  });\n}`;
  
  try {
    fs.writeFileSync(REGISTER_SW_FILE, newContent);
    console.log(`✅ registerSW.js actualizado con estrategia forzada`);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando registerSW.js:', error.message);
    return false;
  }
}

/**
 * Actualiza archivos CSS y JS principales con headers de versión
 */
function updateAssets(versionHash) {
  const assetsDir = path.join(DIST_DIR, 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.log('⚠️  Directorio assets no encontrado');
    return false;
  }

  try {
    const files = fs.readdirSync(assetsDir);
    const timestamp = Date.now();
    let updatedCount = 0;
    
    files.forEach(file => {
      if (file.match(/^index-[a-f0-9]+\.(js|css)$/)) {
        const filePath = path.join(assetsDir, file);
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          const versionComment = file.endsWith('.js') 
            ? `// PWA Update: ${versionHash} - ${new Date().toISOString()} - Timestamp: ${timestamp}\n// Cache-Control: no-cache, no-store, must-revalidate\n`
            : `/* PWA Update: ${versionHash} - ${new Date().toISOString()} - Timestamp: ${timestamp} */\n/* Cache-Control: no-cache, no-store, must-revalidate */\n`;
          
          // Remover comentarios de versión anteriores
          content = content.replace(/^\/\/ PWA Update:.*$/gm, '');
          content = content.replace(/^\/\* PWA Update:.*\*\/$/gm, '');
          content = content.replace(/^\/\/ Cache-Control:.*$/gm, '');
          content = content.replace(/^\/\* Cache-Control:.*\*\/$/gm, '');
          
          // Limpiar líneas vacías extra
          content = content.replace(/^\n+/, '');
          
          // Agregar nuevo comentario de versión al inicio
          content = versionComment + content;
          fs.writeFileSync(filePath, content);
          updatedCount++;
        } catch (error) {
          console.error(`❌ Error actualizando ${file}:`, error.message);
        }
      }
    });

    console.log(`✅ ${updatedCount} archivos de assets actualizados con headers de versión`);
    return updatedCount;
  } catch (error) {
    console.error('❌ Error actualizando assets:', error.message);
    return false;
  }
}

/**
 * Crea script de invalidación de cache
 */
function createCacheInvalidationScript(versionHash) {
  const scriptPath = path.join(DIST_DIR, 'invalidate-cache.js');
  const content = `// Script de Invalidación de Cache - Versión: ${versionHash}\n// Este script fuerza la invalidación de cache para actualizaciones de PWA\n\n(function() {\n  'use strict';\n  \n  const version = '${versionHash}';\n  const timestamp = ${Date.now()};\n  \n  console.log('Invalidación de Cache: Iniciando para versión', version);\n  \n  // Limpiar todos los caches\n  if ('caches' in window) {\n    caches.keys().then(cacheNames => {\n      return Promise.all(\n        cacheNames.map(cacheName => {\n          console.log('Eliminando cache:', cacheName);\n          return caches.delete(cacheName);\n        })\n      );\n    }).then(() => {\n      console.log('Todos los caches eliminados para versión', version);\n    });\n  }\n  \n  // Forzar recarga si el service worker se actualiza\n  if ('serviceWorker' in navigator) {\n    navigator.serviceWorker.ready.then(registration => {\n      registration.update();\n    });\n  }\n  \n  // Establecer versión en localStorage para seguimiento\n  localStorage.setItem('pwa-version', version);\n  localStorage.setItem('pwa-timestamp', timestamp.toString());\n  \n  console.log('Invalidación de Cache: Completada para versión', version);\n})();`;
  
  try {
    fs.writeFileSync(scriptPath, content);
    console.log('✅ Script de invalidación de cache creado');
    return true;
  } catch (error) {
    console.error('❌ Error creando script de invalidación:', error.message);
    return false;
  }
}

/**
 * Función principal
 */
function main() {
  // Verificar que existe el directorio dist
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Directorio dist no encontrado. Ejecuta el build primero.');
    process.exit(1);
  }

  console.log(`📁 Trabajando en: ${DIST_DIR}`);
  
  let success = true;
  
  // 1. Actualizar manifest
  const versionHash = updateManifest();
  if (!versionHash) success = false;
  
  // 2. Actualizar index.html
  if (versionHash && !updateIndexHtml(versionHash)) success = false;
  
  // 3. Actualizar service worker
  if (!updateServiceWorker()) success = false;
  
  // 4. Actualizar registerSW.js
  if (versionHash && !updateRegisterSW(versionHash)) success = false;
  
  // 5. Actualizar assets
  const assetsUpdated = updateAssets(versionHash);
  if (assetsUpdated === false) success = false;
  
  // 6. Crear script de invalidación de cache
  if (versionHash && !createCacheInvalidationScript(versionHash)) success = false;
  
  if (success) {
    console.log('\n🎉 ¡PWA actualizada exitosamente con cache busting AGRESIVO!');
    console.log(`📊 Actualizado ${assetsUpdated} archivos de assets`);
    console.log('\n🚀 Características mejoradas:');
    console.log('   ✓ Cache busting agresivo con timestamps');
    console.log('   ✓ Actualizaciones forzadas del service worker');
    console.log('   ✓ Limpieza automática de cache');
    console.log('   ✓ Seguimiento mejorado de versiones');
    console.log('   ✓ Script de invalidación de cache creado');
    console.log('\n📦 La carpeta dist está lista para distribuir');
    console.log('🔄 Los usuarios recibirán la actualización FORZADA inmediatamente');
    console.log('\n💡 Tip: Este script ahora incluye invalidación agresiva de cache');
  } else {
    console.log('\n⚠️  Actualización completada con algunos errores');
    console.log('📦 Revisa los mensajes anteriores para más detalles');
    process.exit(1);
  }
}

// Ejecutar script
main();