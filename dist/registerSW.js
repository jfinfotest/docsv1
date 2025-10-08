// PWA Registration - Version: 09d741a5 - 2025-10-08T18:52:31.226Z

// CACHE BUSTING ULTRA-AGRESIVO
const FORCE_UPDATE_VERSION = '09d741a5';
const FORCE_UPDATE_TIMESTAMP = 1759949551226;

// Limpiar todos los caches del navegador ANTES de registrar SW
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        console.log('🗑️ Eliminando cache del navegador:', cacheName);
        return caches.delete(cacheName);
      })
    );
  }).then(() => {
    console.log('🧹 Todos los caches del navegador eliminados');
  });
}

// Forzar limpieza de localStorage y sessionStorage
try {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('pwa') || key.includes('cache') || key.includes('version'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Guardar nueva versión
  localStorage.setItem('pwa-version', FORCE_UPDATE_VERSION);
  localStorage.setItem('pwa-timestamp', FORCE_UPDATE_TIMESTAMP.toString());
  localStorage.setItem('pwa-last-update', new Date().toISOString());
} catch (e) {
  console.warn('No se pudo limpiar localStorage:', e);
}

if ('serviceWorker' in navigator) {
  // Desregistrar TODOS los service workers existentes
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      console.log('🗑️ Desregistrando SW anterior:', registration.scope);
      registration.unregister();
    });
    
    // Esperar un momento antes de registrar el nuevo SW
    setTimeout(() => {
      registerNewServiceWorker();
    }, 1000);
  });
} else {
  registerNewServiceWorker();
}

function registerNewServiceWorker() {
  navigator.serviceWorker.register('/docsv1/sw.js?v=09d741a5&t=1759949551226&force=true', {
    scope: '/docsv1/',
    updateViaCache: 'none'
  }).then(registration => {
    console.log('🚀 SW registrado con versión ULTRA-AGRESIVA:', FORCE_UPDATE_VERSION);
    
    // Forzar activación inmediata
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    
    // Listener para nuevas versiones
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('🔄 Nueva versión de SW detectada');
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          console.log('⚡ Forzando recarga INMEDIATA...');
          // Limpiar caches antes de recargar
          if ('caches' in window) {
            caches.keys().then(cacheNames => {
              return Promise.all(cacheNames.map(name => caches.delete(name)));
            }).then(() => {
              window.location.reload(true);
            });
          } else {
            window.location.reload(true);
          }
        }
      });
    });
    
    // Verificar actualizaciones cada 10 segundos (más agresivo)
    setInterval(() => {
      registration.update();
    }, 10000);
    
    // Forzar actualización inmediata
    registration.update();
    
  }).catch(error => {
    console.error('❌ Error en registro de SW:', error);
    // Si falla, intentar recargar la página
    setTimeout(() => {
      window.location.reload(true);
    }, 2000);
  });
}

// Listener para cambios de visibilidad (cuando el usuario vuelve a la pestaña)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('👁️ Pestaña visible, verificando actualizaciones...');
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.update();
        }
      });
    }
  }
});

// Forzar recarga si la versión en localStorage es diferente
const storedVersion = localStorage.getItem('pwa-version');
if (storedVersion && storedVersion !== FORCE_UPDATE_VERSION) {
  console.log('🔄 Versión diferente detectada, forzando recarga...');
  localStorage.setItem('pwa-version', FORCE_UPDATE_VERSION);
  window.location.reload(true);
}