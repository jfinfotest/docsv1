// PWA Registration - Version: be28953b - 2025-10-08T15:06:01.694Z
if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/docsv1/sw.js?v=be28953b&t=1759935961694', { 
      scope: '/docsv1/',
      updateViaCache: 'none'
    }).then(registration => {
      console.log('SW: Registrado con versión be28953b');
      
      // Forzar verificación de actualización
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('SW: Nueva versión disponible, forzando actualización');
            newWorker.postMessage({type: 'SKIP_WAITING'});
            window.location.reload(true);
          }
        });
      });
      
      // Verificar actualizaciones cada 30 segundos
      setInterval(() => {
        registration.update();
      }, 30000);
      
    }).catch(error => {
      console.error('SW: Falló el registro:', error);
    });
  });
}

// Forzar limpieza de cache en carga
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    const oldCaches = cacheNames.filter(name => !name.includes('be28953b'));
    return Promise.all(oldCaches.map(name => caches.delete(name)));
  });
}