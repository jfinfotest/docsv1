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
    
    // Agregar meta tags de cache busting ULTRA-AGRESIVO
    const cacheMetaTags = `
    <meta name="pwa-version" content="${versionHash}">
    <meta name="pwa-timestamp" content="${timestamp}">
    <meta name="pwa-last-update" content="${new Date().toISOString()}">
    <meta name="pwa-force-update" content="true">
    <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate, max-age=0">
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="last-modified" content="${new Date().toUTCString()}">
    <meta http-equiv="etag" content="${versionHash}-${timestamp}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
    <script>
      // CACHE BUSTING ULTRA-AGRESIVO EN EL CLIENTE
      if ('serviceWorker' in navigator) {
        // Limpiar cache del navegador inmediatamente
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        
        // Verificar versión en localStorage
        const currentVersion = '${versionHash}';
        const storedVersion = localStorage.getItem('pwa-version');
        
        if (storedVersion && storedVersion !== currentVersion) {
          console.log('🔄 Versión diferente detectada en index.html, limpiando todo...');
          localStorage.clear();
          sessionStorage.clear();
          
          // Desregistrar todos los SW
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(reg => reg.unregister());
          });
          
          // Recargar después de limpiar
          setTimeout(() => {
            window.location.reload(true);
          }, 500);
        }
        
        localStorage.setItem('pwa-version', currentVersion);
        localStorage.setItem('pwa-timestamp', '${timestamp}');
      }
      
      // Prevenir cache del navegador
      window.addEventListener('beforeunload', () => {
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
      });
    </script>`;
    
    // Limpiar meta tags existentes de PWA y cache
    htmlContent = htmlContent.replace(
      /<meta name="pwa-[^"]*"[^>]*>\s*/g,
      ''
    );
    htmlContent = htmlContent.replace(
      /<meta http-equiv="(cache-control|pragma|expires|last-modified|etag)"[^>]*>\s*/g,
      ''
    );
    htmlContent = htmlContent.replace(
      /<meta name="robots"[^>]*>\s*/g,
      ''
    );
    
    // Limpiar scripts de cache busting anteriores
    htmlContent = htmlContent.replace(
      /<script>[\s\S]*?CACHE BUSTING[\s\S]*?<\/script>\s*/g,
      ''
    );
    
    // Agregar todos los meta tags de cache busting ULTRA-AGRESIVO
     if (!htmlContent.includes('pwa-version')) {
       htmlContent = htmlContent.replace(
         /<head>/,
         `<head>${cacheMetaTags}`
       );
     }
     
     // Agregar script ultra-cache-buster antes del cierre de body
     const ultraCacheBusterScript = `
     <script src="./ultra-cache-buster.js?v=${versionHash}&t=${timestamp}" defer></script>`;
     
     // Limpiar scripts anteriores del ultra-cache-buster
     htmlContent = htmlContent.replace(
       /<script src="\.\/ultra-cache-buster\.js[^"]*"[^>]*><\/script>\s*/g,
       ''
     );
     
     // Agregar el script antes del cierre de body
     if (!htmlContent.includes('ultra-cache-buster.js')) {
       htmlContent = htmlContent.replace(
         /<\/body>/,
         `${ultraCacheBusterScript}\n  </body>`
       );
     }

    fs.writeFileSync(INDEX_FILE, htmlContent);
    console.log('✅ index.html actualizado con cache busting ULTRA-AGRESIVO y script de limpieza automática');
    console.log(`   📊 Versión: ${versionHash}`);
    console.log(`   ⏰ Timestamp: ${timestamp}`);
    console.log('   🧹 Limpieza automática de cache habilitada');
    console.log('   🔄 Detección automática de versiones habilitada');
    return true;
  } catch (error) {
    console.error('❌ Error actualizando index.html:', error.message);
    return false;
  }
}

/**
 * Actualiza el service worker con estrategia de actualización ULTRA-AGRESIVA
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
    
    // Agregar estrategia de actualización ULTRA-AGRESIVA
    const updateStrategy = `\n// ESTRATEGIA DE ACTUALIZACIÓN ULTRA-AGRESIVA\nconst FORCE_VERSION = '${versionHash}';\nconst FORCE_TIMESTAMP = ${timestamp};\n\n// Instalar inmediatamente sin esperar\nself.addEventListener('install', event => {\n  console.log('🚀 SW: Instalando versión ULTRA-AGRESIVA:', FORCE_VERSION);\n  \n  event.waitUntil(\n    // Limpiar TODOS los caches antes de instalar\n    caches.keys().then(cacheNames => {\n      console.log('🗑️ SW: Eliminando TODOS los caches durante instalación');\n      return Promise.all(\n        cacheNames.map(cacheName => {\n          console.log('🗑️ SW: Eliminando cache:', cacheName);\n          return caches.delete(cacheName);\n        })\n      );\n    }).then(() => {\n      console.log('✅ SW: Todos los caches eliminados durante instalación');\n      // Forzar activación inmediata\n      return self.skipWaiting();\n    })\n  );\n});\n\nself.addEventListener('activate', event => {\n  console.log('⚡ SW: Activando versión ULTRA-AGRESIVA:', FORCE_VERSION);\n  \n  event.waitUntil(\n    Promise.all([\n      // Limpiar TODOS los caches nuevamente durante activación\n      caches.keys().then(cacheNames => {\n        console.log('🧹 SW: Limpieza FINAL de todos los caches');\n        return Promise.all(\n          cacheNames.map(cacheName => {\n            console.log('🗑️ SW: Eliminando cache final:', cacheName);\n            return caches.delete(cacheName);\n          })\n        );\n      }),\n      // Tomar control inmediato de todos los clientes\n      self.clients.claim(),\n      // Notificar a todos los clientes que se actualicen\n      self.clients.matchAll().then(clients => {\n        clients.forEach(client => {\n          console.log('📢 SW: Notificando actualización a cliente');\n          client.postMessage({\n            type: 'FORCE_UPDATE',\n            version: FORCE_VERSION,\n            timestamp: FORCE_TIMESTAMP\n          });\n        });\n      })\n    ]).then(() => {\n      console.log('✅ SW: Activación ULTRA-AGRESIVA completada');\n    })\n  );\n});\n\n// Listener para mensajes de forzar actualización\nself.addEventListener('message', event => {\n  console.log('📨 SW: Mensaje recibido:', event.data);\n  \n  if (event.data && event.data.type === 'SKIP_WAITING') {\n    console.log('⏭️ SW: Forzando skip waiting');\n    self.skipWaiting();\n  }\n  \n  if (event.data && event.data.type === 'FORCE_CACHE_CLEAR') {\n    console.log('🧹 SW: Forzando limpieza de cache por mensaje');\n    event.waitUntil(\n      caches.keys().then(cacheNames => {\n        return Promise.all(cacheNames.map(name => caches.delete(name)));\n      }).then(() => {\n        console.log('✅ SW: Cache limpiado por mensaje');\n        // Responder al cliente\n        event.ports[0]?.postMessage({ success: true });\n      })\n    );\n  }\n});\n\n// Interceptar TODAS las peticiones para forzar actualizaciones\nself.addEventListener('fetch', event => {\n  const url = new URL(event.request.url);\n  \n  // Para archivos críticos, siempre ir a la red\n  if (url.pathname.includes('config.json') || \n      url.pathname.includes('manifest.webmanifest') || \n      url.pathname.includes('index.html') ||\n      url.pathname.includes('sw.js') ||\n      url.pathname.includes('registerSW.js')) {\n    \n    console.log('🌐 SW: Forzando red para archivo crítico:', url.pathname);\n    \n    event.respondWith(\n      fetch(event.request.clone(), {\n        cache: 'no-store',\n        headers: {\n          'Cache-Control': 'no-cache, no-store, must-revalidate',\n          'Pragma': 'no-cache',\n          'Expires': '0'\n        }\n      }).then(response => {\n        // No cachear archivos críticos\n        return response;\n      }).catch(() => {\n        // Si falla la red, intentar desde cache como último recurso\n        return caches.match(event.request);\n      })\n    );\n    return;\n  }\n});\n`;
    
    // Agregar estrategia si no está presente
    if (!swContent.includes('ESTRATEGIA DE ACTUALIZACIÓN ULTRA-AGRESIVA')) {
      swContent = swContent.replace(versionComment, versionComment + updateStrategy);
    }
    
    // Actualizar cualquier referencia a archivos con parámetros de versión (limpiar versiones anteriores)
    swContent = swContent.replace(
      /"url":"([^"]+?)(?:\?[^"]*)?"(?=,|\])/g,
      `"url":"$1?v=${versionHash}&t=${timestamp}"`
    );

    fs.writeFileSync(SW_FILE, swContent);
    console.log(`✅ Service Worker actualizado con versión: ${versionHash} y estrategia ULTRA-AGRESIVA`);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando Service Worker:', error.message);
    return false;
  }
}

/**
 * Actualiza o crea registerSW.js con estrategia de actualización ULTRA-AGRESIVA
 */
function updateRegisterSW(versionHash) {
  const timestamp = Date.now();
  const newContent = `// PWA Registration - Version: ${versionHash} - ${new Date().toISOString()}\n\n// CACHE BUSTING ULTRA-AGRESIVO\nconst FORCE_UPDATE_VERSION = '${versionHash}';\nconst FORCE_UPDATE_TIMESTAMP = ${timestamp};\n\n// Limpiar todos los caches del navegador ANTES de registrar SW\nif ('caches' in window) {\n  caches.keys().then(cacheNames => {\n    return Promise.all(\n      cacheNames.map(cacheName => {\n        console.log('🗑️ Eliminando cache del navegador:', cacheName);\n        return caches.delete(cacheName);\n      })\n    );\n  }).then(() => {\n    console.log('🧹 Todos los caches del navegador eliminados');\n  });\n}\n\n// Forzar limpieza de localStorage y sessionStorage\ntry {\n  const keysToRemove = [];\n  for (let i = 0; i < localStorage.length; i++) {\n    const key = localStorage.key(i);\n    if (key && (key.includes('pwa') || key.includes('cache') || key.includes('version'))) {\n      keysToRemove.push(key);\n    }\n  }\n  keysToRemove.forEach(key => localStorage.removeItem(key));\n  \n  // Guardar nueva versión\n  localStorage.setItem('pwa-version', FORCE_UPDATE_VERSION);\n  localStorage.setItem('pwa-timestamp', FORCE_UPDATE_TIMESTAMP.toString());\n  localStorage.setItem('pwa-last-update', new Date().toISOString());\n} catch (e) {\n  console.warn('No se pudo limpiar localStorage:', e);\n}\n\nif ('serviceWorker' in navigator) {\n  // Desregistrar TODOS los service workers existentes\n  navigator.serviceWorker.getRegistrations().then(registrations => {\n    registrations.forEach(registration => {\n      console.log('🗑️ Desregistrando SW anterior:', registration.scope);\n      registration.unregister();\n    });\n    \n    // Esperar un momento antes de registrar el nuevo SW\n    setTimeout(() => {\n      registerNewServiceWorker();\n    }, 1000);\n  });\n} else {\n  registerNewServiceWorker();\n}\n\nfunction registerNewServiceWorker() {\n  navigator.serviceWorker.register('/docsv1/sw.js?v=${versionHash}&t=${timestamp}&force=true', {\n    scope: '/docsv1/',\n    updateViaCache: 'none'\n  }).then(registration => {\n    console.log('🚀 SW registrado con versión ULTRA-AGRESIVA:', FORCE_UPDATE_VERSION);\n    \n    // Forzar activación inmediata\n    if (registration.waiting) {\n      registration.waiting.postMessage({ type: 'SKIP_WAITING' });\n    }\n    \n    // Listener para nuevas versiones\n    registration.addEventListener('updatefound', () => {\n      const newWorker = registration.installing;\n      console.log('🔄 Nueva versión de SW detectada');\n      \n      newWorker.addEventListener('statechange', () => {\n        if (newWorker.state === 'installed') {\n          console.log('⚡ Forzando recarga INMEDIATA...');\n          // Limpiar caches antes de recargar\n          if ('caches' in window) {\n            caches.keys().then(cacheNames => {\n              return Promise.all(cacheNames.map(name => caches.delete(name)));\n            }).then(() => {\n              window.location.reload(true);\n            });\n          } else {\n            window.location.reload(true);\n          }\n        }\n      });\n    });\n    \n    // Verificar actualizaciones cada 10 segundos (más agresivo)\n    setInterval(() => {\n      registration.update();\n    }, 10000);\n    \n    // Forzar actualización inmediata\n    registration.update();\n    \n  }).catch(error => {\n    console.error('❌ Error en registro de SW:', error);\n    // Si falla, intentar recargar la página\n    setTimeout(() => {\n      window.location.reload(true);\n    }, 2000);\n  });\n}\n\n// Listener para cambios de visibilidad (cuando el usuario vuelve a la pestaña)\ndocument.addEventListener('visibilitychange', () => {\n  if (!document.hidden) {\n    console.log('👁️ Pestaña visible, verificando actualizaciones...');\n    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {\n      navigator.serviceWorker.getRegistration().then(registration => {\n        if (registration) {\n          registration.update();\n        }\n      });\n    }\n  }\n});\n\n// Forzar recarga si la versión en localStorage es diferente\nconst storedVersion = localStorage.getItem('pwa-version');\nif (storedVersion && storedVersion !== FORCE_UPDATE_VERSION) {\n  console.log('🔄 Versión diferente detectada, forzando recarga...');\n  localStorage.setItem('pwa-version', FORCE_UPDATE_VERSION);\n  window.location.reload(true);\n}`;
  
  try {
    fs.writeFileSync(REGISTER_SW_FILE, newContent);
    console.log(`✅ registerSW.js actualizado con estrategia ULTRA-AGRESIVA`);
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
  
  // 7. Copiar ultra-cache-buster.js al directorio dist
  try {
    const sourcePath = path.join(__dirname, 'ultra-cache-buster.js');
    const destPath = path.join(DIST_DIR, 'ultra-cache-buster.js');
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log('✅ ultra-cache-buster.js copiado al directorio dist');
    } else {
      console.warn('⚠️ ultra-cache-buster.js no encontrado en el directorio public');
    }
  } catch (error) {
    console.error('❌ Error copiando ultra-cache-buster.js:', error.message);
    success = false;
  }
  
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