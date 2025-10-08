// PWA Version: e1f1c918 - 2025-10-08T16:57:07.701Z - Timestamp: 1759942627701

// ESTRATEGIA DE ACTUALIZACIÓN ULTRA-AGRESIVA
const FORCE_VERSION = 'e1f1c918';
const FORCE_TIMESTAMP = 1759942627701;

// Instalar inmediatamente sin esperar
self.addEventListener('install', event => {
  console.log('🚀 SW: Instalando versión ULTRA-AGRESIVA:', FORCE_VERSION);
  
  event.waitUntil(
    // Limpiar TODOS los caches antes de instalar
    caches.keys().then(cacheNames => {
      console.log('🗑️ SW: Eliminando TODOS los caches durante instalación');
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('🗑️ SW: Eliminando cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('✅ SW: Todos los caches eliminados durante instalación');
      // Forzar activación inmediata
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  console.log('⚡ SW: Activando versión ULTRA-AGRESIVA:', FORCE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Limpiar TODOS los caches nuevamente durante activación
      caches.keys().then(cacheNames => {
        console.log('🧹 SW: Limpieza FINAL de todos los caches');
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('🗑️ SW: Eliminando cache final:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Tomar control inmediato de todos los clientes
      self.clients.claim(),
      // Notificar a todos los clientes que se actualicen
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          console.log('📢 SW: Notificando actualización a cliente');
          client.postMessage({
            type: 'FORCE_UPDATE',
            version: FORCE_VERSION,
            timestamp: FORCE_TIMESTAMP
          });
        });
      })
    ]).then(() => {
      console.log('✅ SW: Activación ULTRA-AGRESIVA completada');
    })
  );
});

// Listener para mensajes de forzar actualización
self.addEventListener('message', event => {
  console.log('📨 SW: Mensaje recibido:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ SW: Forzando skip waiting');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'FORCE_CACHE_CLEAR') {
    console.log('🧹 SW: Forzando limpieza de cache por mensaje');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(name => caches.delete(name)));
      }).then(() => {
        console.log('✅ SW: Cache limpiado por mensaje');
        // Responder al cliente
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }
});

// Interceptar TODAS las peticiones para forzar actualizaciones
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Para archivos críticos, siempre ir a la red
  if (url.pathname.includes('config.json') || 
      url.pathname.includes('manifest.webmanifest') || 
      url.pathname.includes('index.html') ||
      url.pathname.includes('sw.js') ||
      url.pathname.includes('registerSW.js')) {
    
    console.log('🌐 SW: Forzando red para archivo crítico:', url.pathname);
    
    event.respondWith(
      fetch(event.request.clone(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }).then(response => {
        // No cachear archivos críticos
        return response;
      }).catch(() => {
        // Si falla la red, intentar desde cache como último recurso
        return caches.match(event.request);
      })
    );
    return;
  }
});
if(!self.define){let s,e={};const i=(i,r)=>(i=new URL(i+".js",r).href,e[i]||new Promise(e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()}).then(()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s}));self.define=(r,a)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let c={};const l=s=>i(s,n),d={module:{uri:n},exports:c,require:l};e[n]=Promise.all(r.map(s=>d[s]||l(s))).then(s=>(a(...s),c))}}define(["./workbox-84318d21"],function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/_basePickBy-9650899f.js",revision:null},{url:"assets/_baseUniq-c0703b91.js",revision:null},{url:"assets/arc-a5006c1b.js",revision:null},{url:"assets/architecture-O4VJ6CD3-a6b12fce.js",revision:null},{url:"assets/architectureDiagram-VXUJARFQ-8dd70bfe.js",revision:null},{url:"assets/blockDiagram-VD42YOAC-98318bec.js",revision:null},{url:"assets/c4Diagram-YG6GDRKO-ead8f7f6.js",revision:null},{url:"assets/channel-76f868b5.js",revision:null},{url:"assets/chunk-4BX2VUAB-3d98f0e1.js",revision:null},{url:"assets/chunk-55IACEB6-c6549295.js",revision:null},{url:"assets/chunk-B4BG7PRW-16beef46.js",revision:null},{url:"assets/chunk-DI55MBZ5-fbb0d552.js",revision:null},{url:"assets/chunk-FMBD7UC4-42cf73dc.js",revision:null},{url:"assets/chunk-QN33PNHL-dd7c3489.js",revision:null},{url:"assets/chunk-QZHKN3VN-9b80d343.js",revision:null},{url:"assets/chunk-TZMSLE5B-0efb0099.js",revision:null},{url:"assets/classDiagram-2ON5EDUG-d767523f.js",revision:null},{url:"assets/classDiagram-v2-WZHVMYZB-d767523f.js",revision:null},{url:"assets/clone-d026404a.js",revision:null},{url:"assets/cose-bilkent-S5V4N54A-c939623f.js",revision:null},{url:"assets/cytoscape.esm-c32909fe.js",revision:null},{url:"assets/dagre-6UL2VRFP-c629bd04.js",revision:null},{url:"assets/defaultLocale-b5afb42d.js",revision:null},{url:"assets/diagram-PSM6KHXK-600b7468.js",revision:null},{url:"assets/diagram-QEK2KX5R-e9acfe1f.js",revision:null},{url:"assets/diagram-S2PKOQOG-e0c8593c.js",revision:null},{url:"assets/erDiagram-Q2GNP2WA-708c32c2.js",revision:null},{url:"assets/flowDiagram-NV44I4VS-1a4cd31f.js",revision:null},{url:"assets/ganttDiagram-LVOFAZNH-915ee58f.js",revision:null},{url:"assets/gitGraph-ZV4HHKMB-589c3682.js",revision:null},{url:"assets/gitGraphDiagram-NY62KEGX-1536d8fa.js",revision:null},{url:"assets/graph-c3f8434b.js",revision:null},{url:"assets/index-333d3be8.css",revision:null},{url:"assets/index-6277f727.js",revision:null},{url:"assets/info-63CPKGFF-e52f3c95.js",revision:null},{url:"assets/infoDiagram-F6ZHWCRC-c88f8a16.js",revision:null},{url:"assets/init-77b53fdd.js",revision:null},{url:"assets/journeyDiagram-XKPGCS4Q-4e570bcd.js",revision:null},{url:"assets/kanban-definition-3W4ZIXB7-014924b3.js",revision:null},{url:"assets/layout-e12e5e00.js",revision:null},{url:"assets/linear-2d61e5e6.js",revision:null},{url:"assets/mermaid-parser.core-14847f69.js",revision:null},{url:"assets/mermaid.core-cdf6c38d.js",revision:null},{url:"assets/mindmap-definition-VGOIOE7T-1c383210.js",revision:null},{url:"assets/ordinal-ba9b4969.js",revision:null},{url:"assets/packet-HUATNLJX-ebd8ed61.js",revision:null},{url:"assets/pie-WTHONI2E-14601399.js",revision:null},{url:"assets/pieDiagram-ADFJNKIX-e7c0e845.js",revision:null},{url:"assets/quadrantDiagram-AYHSOK5B-905a5b72.js",revision:null},{url:"assets/radar-NJJJXTRR-d547d8ce.js",revision:null},{url:"assets/requirementDiagram-UZGBJVZJ-d8411b52.js",revision:null},{url:"assets/sankeyDiagram-TZEHDZUN-d79b6454.js",revision:null},{url:"assets/sequenceDiagram-WL72ISMW-c00e3c87.js",revision:null},{url:"assets/stateDiagram-FKZM4ZOC-15d74b41.js",revision:null},{url:"assets/stateDiagram-v2-4FDKWEC3-be382f08.js",revision:null},{url:"assets/timeline-definition-IT6M3QCI-742747b4.js",revision:null},{url:"assets/treemap-75Q7IDZK-7adcce76.js",revision:null},{url:"assets/xychartDiagram-PRI3JC2R-c3825938.js",revision:null},{url:"build-and-update.js",revision:"63afbd95374f05ff5329897eed894cd7"},{url:"deploy-with-pwa-update.js",revision:"474cd0207b6b3afba57267fde8d8a4de"},{url:"force-pwa-update.js",revision:"1637d312f43a877802962bca53aec125"},{url:"index.html",revision:"078e1ecb9a4e9bb16439c7757bcd1da2"},{url:"prism-themes/prism-a11y-dark.css",revision:"ac2c0a7e4ae5c612d8ee83150fd03442"},{url:"prism-themes/prism-a11y-dark.min.css",revision:"68b5ff06ed7d7761da6c8dff8c5723b1"},{url:"prism-themes/prism-atom-dark.css",revision:"634c324893cafe523d44e2620a390ff4"},{url:"prism-themes/prism-atom-dark.min.css",revision:"57e6b2821a964426e55457813f195e37"},{url:"prism-themes/prism-base16-ateliersulphurpool.light.css",revision:"f792bc48350394030af63692a643db3c"},{url:"prism-themes/prism-base16-ateliersulphurpool.light.min.css",revision:"6a9de2c317a0e6c0666da5e0b903d1bf"},{url:"prism-themes/prism-cb.css",revision:"66ddd117165e4ccf879208004dd3f7cd"},{url:"prism-themes/prism-cb.min.css",revision:"d933a4b1a4a8a7862eff551220bb7f8e"},{url:"prism-themes/prism-coldark-cold.css",revision:"b5181a40f0def2f175eb322ee57da43c"},{url:"prism-themes/prism-coldark-cold.min.css",revision:"9c6fe729d47e500009d6de49e32cac2e"},{url:"prism-themes/prism-coldark-dark.css",revision:"475e3c4a556f922d31318e6883d4a54c"},{url:"prism-themes/prism-coldark-dark.min.css",revision:"d3be9f33b1404bf1ab26d947eb957888"},{url:"prism-themes/prism-coy-without-shadows.css",revision:"00a2d842e11c498e3b349b30a1a91b59"},{url:"prism-themes/prism-coy-without-shadows.min.css",revision:"3dda8a51ea532d3ef6315fd8f1116e0a"},{url:"prism-themes/prism-darcula.css",revision:"ca3a127666a5fb97488be1a71693e33b"},{url:"prism-themes/prism-darcula.min.css",revision:"521b0e3c9c98fe1660ddc5ac692476c2"},{url:"prism-themes/prism-dracula.css",revision:"4520dcfe35ffae83c7c2e6cb6081528d"},{url:"prism-themes/prism-dracula.min.css",revision:"62119f9f213b3432e0cfb6f3fc1c7c63"},{url:"prism-themes/prism-duotone-dark.css",revision:"cd973308d6589eca3ad57f4a0ee9ecd6"},{url:"prism-themes/prism-duotone-dark.min.css",revision:"b593d51c2815d06fa9abdc69cda6ebe3"},{url:"prism-themes/prism-duotone-earth.css",revision:"b55692e6570fcfb076579f30f8c8a491"},{url:"prism-themes/prism-duotone-earth.min.css",revision:"c9ffa1d13f16c24b8d9b7d9d4a34e992"},{url:"prism-themes/prism-duotone-forest.css",revision:"5fea96597ce738b71b185c27c05dab67"},{url:"prism-themes/prism-duotone-forest.min.css",revision:"635be39e662deb0b3a0fc0d7f94c5931"},{url:"prism-themes/prism-duotone-light.css",revision:"6ed848b5a4e0a3861f77ccd4120297d1"},{url:"prism-themes/prism-duotone-light.min.css",revision:"c782b9238d35c2f395782905c18ff707"},{url:"prism-themes/prism-duotone-sea.css",revision:"a05bda55e86f13877caa55b24bece593"},{url:"prism-themes/prism-duotone-sea.min.css",revision:"58fbcdd7666b9bc9e2285ba58c97ba90"},{url:"prism-themes/prism-duotone-space.css",revision:"bd8aae63981440439e9b36c668582c8f"},{url:"prism-themes/prism-duotone-space.min.css",revision:"4b0ec68edd9a9788002d5638a74b7bbd"},{url:"prism-themes/prism-ghcolors.css",revision:"d4ba39a9b548d611027221f5312a5e11"},{url:"prism-themes/prism-ghcolors.min.css",revision:"683a272a3cc9c8b5950cf69832e3253d"},{url:"prism-themes/prism-gruvbox-dark.css",revision:"feca3f8e50079f5e3e914ab9dd96d6a5"},{url:"prism-themes/prism-gruvbox-dark.min.css",revision:"d95611ea13ef11ebb19305f0832451db"},{url:"prism-themes/prism-gruvbox-light.css",revision:"2ef27af2868978cf66690f96e2d9896a"},{url:"prism-themes/prism-gruvbox-light.min.css",revision:"0f8ef8e28d048c705e57b46fdba9d572"},{url:"prism-themes/prism-holi-theme.css",revision:"0a894841662f969fb4ec5a0c71b6af2c"},{url:"prism-themes/prism-holi-theme.min.css",revision:"90c246b9e7ea83e0f17c11b9bcd61bb1"},{url:"prism-themes/prism-hopscotch.css",revision:"bd7738d4333396333f331a384ec00b6a"},{url:"prism-themes/prism-hopscotch.min.css",revision:"59037dfbb3df52786996f39d415ca81e"},{url:"prism-themes/prism-lucario.css",revision:"4122e2bfe3f31d59b06bafe9cb194210"},{url:"prism-themes/prism-lucario.min.css",revision:"9382d6c9aa57bdf1829d93965d8bfbe3"},{url:"prism-themes/prism-material-dark.css",revision:"7b360e13a79ca5ad020e2444577019ef"},{url:"prism-themes/prism-material-dark.min.css",revision:"62a4191b7f70acf32d7beb71685673b5"},{url:"prism-themes/prism-material-light.css",revision:"fe45dd78212e1c1a3d4bf742f34ce1ec"},{url:"prism-themes/prism-material-light.min.css",revision:"090d70c4318985d1455fb5a0243f32d3"},{url:"prism-themes/prism-material-oceanic.css",revision:"c500355597ec9259ee5a2ed076473493"},{url:"prism-themes/prism-material-oceanic.min.css",revision:"e5b0537da84ed544e4752045706a986b"},{url:"prism-themes/prism-night-owl.css",revision:"79474fabdecac94851c0326dfd47eaf4"},{url:"prism-themes/prism-night-owl.min.css",revision:"64f35c5d7d44848d1d75a14cefdd24b4"},{url:"prism-themes/prism-nord.css",revision:"ca2bb137531f13e43723c41a3a72ac0b"},{url:"prism-themes/prism-nord.min.css",revision:"9c41aa5ca46bf7701f359eff14592438"},{url:"prism-themes/prism-one-dark.css",revision:"33c57cab84091f43262be38f205c8650"},{url:"prism-themes/prism-one-dark.min.css",revision:"bf933cb38e644424aa698e3b781ef058"},{url:"prism-themes/prism-one-light.css",revision:"86ab1381d3be6e567bcb7301cbb5a3ea"},{url:"prism-themes/prism-one-light.min.css",revision:"9828fe9f62946f5672f1b06ee1dfa3bc"},{url:"prism-themes/prism-pojoaque.css",revision:"42970a39cebfcd502ebe5edd51e8539b"},{url:"prism-themes/prism-pojoaque.min.css",revision:"35940a4a85f181d8c0e0ea59d25abf97"},{url:"prism-themes/prism-shades-of-purple.css",revision:"3e3f4c415008165bd757e2f086704b8a"},{url:"prism-themes/prism-shades-of-purple.min.css",revision:"736da0e5d18a32b9a015adfaf7f2c497"},{url:"prism-themes/prism-solarized-dark-atom.css",revision:"e8e7d97b8a92c239a3e2bc16ad1f15a4"},{url:"prism-themes/prism-solarized-dark-atom.min.css",revision:"3366fd5a0cb809e9d6354fa3d44e18ad"},{url:"prism-themes/prism-synthwave84.css",revision:"20efa3a31f5343d20edd1d0c6c6df047"},{url:"prism-themes/prism-synthwave84.min.css",revision:"ea18f22a62f47ef8147875de1a596c03"},{url:"prism-themes/prism-vs.css",revision:"99d52ccdd1dfeca9149d408e3bafcadf"},{url:"prism-themes/prism-vs.min.css",revision:"fb5da6191fe10279995c40be6cdaed00"},{url:"prism-themes/prism-vsc-dark-plus.css",revision:"302b0fa8417827257086b13ffcf1d0e4"},{url:"prism-themes/prism-vsc-dark-plus.min.css",revision:"5a3b5eb84d61f1e968ed4013a2e00d62"},{url:"prism-themes/prism-xonokai.css",revision:"e924aaaee2ea0e2460cc9ae44edc8dba"},{url:"prism-themes/prism-xonokai.min.css",revision:"b5e9d4289646aa79dc957b89337b69b6"},{url:"prism-themes/prism-z-touch.css",revision:"c5685c159411add5c4bf3753c0acab7f"},{url:"prism-themes/prism-z-touch.min.css",revision:"b556731d1b9198102907fc00e47573c4"},{url:"registerSW.js",revision:"7ec9da61a08b1744a9d5a2e73ebce4dc"},{url:"ultra-cache-buster.js",revision:"52225b968b8cfef6f4102064678a1165"},{url:"update-file-manifest.js",revision:"44fdc9d98f100fe26ecfa384be220c32"},{url:"pwa_icons/android/android-launchericon-144-144.png",revision:"d59a5786bd48ecc9cedf14deb9365e33"},{url:"pwa_icons/android/android-launchericon-192-192.png",revision:"ca414ec1064d091c659d31f03e35d0ee"},{url:"pwa_icons/android/android-launchericon-48-48.png",revision:"bcdbf79efd559b423650d37cb06dde2e"},{url:"pwa_icons/android/android-launchericon-512-512.png",revision:"3a875412a917ce6b69f807b97c30d821"},{url:"pwa_icons/android/android-launchericon-72-72.png",revision:"b09413b3527c7efc9e4dd2e1ba77e5c5"},{url:"pwa_icons/android/android-launchericon-96-96.png",revision:"81f1aa0b56cb7a01865f71001d112e33"},{url:"pwa_icons/ios/120.png",revision:"b1d7b266d743474f69e390f9929b15a0"},{url:"pwa_icons/ios/152.png",revision:"dcf5ba69ae70dba3c1e158edec36b63b"},{url:"pwa_icons/ios/180.png",revision:"f7e4398f42fef8e261e1a78525abec62"},{url:"manifest.webmanifest",revision:"a616a3e625a278ce2bd8b47a0575f937"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute(/\/config\.json$/,new s.NetworkFirst({cacheName:"config-cache",networkTimeoutSeconds:3,plugins:[new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")});
