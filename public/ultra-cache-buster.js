// ULTRA CACHE BUSTER - Script para forzar actualizaciones inmediatas de PWA
// Este script se ejecuta automáticamente para garantizar que los cambios se reflejen inmediatamente

(function() {
  'use strict';
  
  console.log('🚀 ULTRA CACHE BUSTER iniciado');
  
  // Configuración: solo verificar una vez al cargar
  const MAX_CACHE_AGE = 0; // Sin cache
  
  // Función para detectar el basePath dinámicamente
  function getBasePath() {
    // Primero, intentar leer desde meta tag (establecido por update-basepath.js)
    const metaTag = document.querySelector('meta[name="base-url"]');
    if (metaTag) {
      const basePath = metaTag.getAttribute('content');
      if (basePath && basePath !== './') {
        return basePath.endsWith('/') ? basePath : `${basePath}/`;
      }
    }
    
    // Fallback: intentar detectar desde la URL actual
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment);
    
    // Si estamos en GitHub Pages, el primer segmento suele ser el basePath
    if (pathSegments.length > 0 && window.location.hostname.includes('github.io')) {
      return `/${pathSegments[0]}/`;
    }
    
    // Para desarrollo local
    return '/';
  }
  
  // Obtener el basePath una vez al inicio
  const BASE_PATH = getBasePath();
  console.log(`📁 ULTRA CACHE BUSTER usando basePath: ${BASE_PATH}`);
  
  // Función segura para codificar Base64 con soporte Unicode
  function safeBase64Encode(str) {
    try {
      // Convertir a UTF-8 bytes y luego a Base64
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
      }));
    } catch (error) {
      // Fallback: usar un hash simple si btoa falla
      console.warn('⚠️ Error en codificación Base64, usando hash simple:', error);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a 32bit integer
      }
      return Math.abs(hash).toString(16);
    }
  }
  
  // Función para limpiar TODO el cache del navegador
  async function nukeAllCaches() {
    try {
      console.log('💥 Eliminando TODOS los caches...');
      
      // Limpiar Service Worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log(`🗑️ Eliminando cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
      }
      
      // Limpiar localStorage y sessionStorage
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('🧹 localStorage y sessionStorage limpiados');
      } catch (e) {
        console.warn('⚠️ No se pudo limpiar storage:', e);
      }
      
      // Limpiar IndexedDB
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases();
          await Promise.all(
            databases.map(db => {
              console.log(`🗑️ Eliminando IndexedDB: ${db.name}`);
              return new Promise((resolve, reject) => {
                const deleteReq = indexedDB.deleteDatabase(db.name);
                deleteReq.onsuccess = () => resolve();
                deleteReq.onerror = () => reject(deleteReq.error);
              });
            })
          );
        } catch (e) {
          console.warn('⚠️ No se pudo limpiar IndexedDB:', e);
        }
      }
      
      console.log('✅ Todos los caches eliminados exitosamente');
    } catch (error) {
      console.error('❌ Error limpiando caches:', error);
    }
  }
  
  // Función para desregistrar todos los Service Workers
  async function unregisterAllServiceWorkers() {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => {
            console.log('🔄 Desregistrando Service Worker...');
            return registration.unregister();
          })
        );
        console.log('✅ Todos los Service Workers desregistrados');
      }
    } catch (error) {
      console.error('❌ Error desregistrando Service Workers:', error);
    }
  }
  
  // Función para forzar recarga de recursos críticos
  async function forceReloadCriticalResources() {
    const criticalFiles = [
      `${BASE_PATH}config.json`,
      `${BASE_PATH}manifest.webmanifest`,
      `${BASE_PATH}sw.js`,
      `${BASE_PATH}registerSW.js`
    ];
    
    for (const file of criticalFiles) {
      try {
        const timestamp = Date.now();
        const url = `${file}?v=${timestamp}&force=true&nocache=${Math.random()}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store'
        });
        
        if (response.ok) {
          console.log(`✅ Recurso crítico recargado: ${file}`);
        } else {
          console.warn(`⚠️ No se pudo recargar: ${file}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error recargando ${file}:`, error);
      }
    }
  }
  
  // Función para verificar si hay una nueva versión
  async function checkForUpdates() {
    try {
      const timestamp = Date.now();
      const configUrl = `${BASE_PATH}config.json?v=${timestamp}&force=true&nocache=${Math.random()}`;
      
      const response = await fetch(configUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const config = await response.json();
        const currentConfigHash = safeBase64Encode(JSON.stringify(config)).slice(0, 8);
        const storedConfigHash = localStorage.getItem('config-hash');
        
        if (storedConfigHash && storedConfigHash !== currentConfigHash) {
          console.log('🔄 Nueva versión de config.json detectada!');
          console.log(`   Anterior: ${storedConfigHash}`);
          console.log(`   Nueva: ${currentConfigHash}`);
          
          // Forzar actualización completa
          await nukeAllCaches();
          await unregisterAllServiceWorkers();
          await forceReloadCriticalResources();
          
          localStorage.setItem('config-hash', currentConfigHash);
          localStorage.setItem('last-update', timestamp.toString());
          
          console.log('🔄 Forzando recarga de página...');
          setTimeout(() => {
            window.location.reload(true);
          }, 1000);
          
          return true;
        } else {
          localStorage.setItem('config-hash', currentConfigHash);
        }
      }
    } catch (error) {
      console.warn('⚠️ Error verificando actualizaciones:', error);
    }
    
    return false;
  }
  
  // Función principal de inicialización
  async function initialize() {
    console.log('🔧 Inicializando ULTRA CACHE BUSTER...');
    
    // Verificación única al cargar la página
    console.log('🔍 Verificando actualizaciones al cargar...');
    await checkForUpdates();
    
    // Interceptar navegación para limpiar cache
    window.addEventListener('beforeunload', async () => {
      console.log('🧹 Limpiando cache antes de salir...');
      await nukeAllCaches();
    });
    
    console.log('✅ ULTRA CACHE BUSTER inicializado correctamente');
    console.log('   🔄 Verificación única al cargar la página completada');
  }
  
  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();