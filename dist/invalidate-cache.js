// Script de Invalidación de Cache - Versión: 314f1912
// Este script fuerza la invalidación de cache para actualizaciones de PWA

(function() {
  'use strict';
  
  const version = '314f1912';
  const timestamp = 1759943326691;
  
  console.log('Invalidación de Cache: Iniciando para versión', version);
  
  // Limpiar todos los caches
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Eliminando cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('Todos los caches eliminados para versión', version);
    });
  }
  
  // Forzar recarga si el service worker se actualiza
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
    });
  }
  
  // Establecer versión en localStorage para seguimiento
  localStorage.setItem('pwa-version', version);
  localStorage.setItem('pwa-timestamp', timestamp.toString());
  
  console.log('Invalidación de Cache: Completada para versión', version);
})();