import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        // Excluir config.json del precaching para permitir actualizaciones dinámicas
        globIgnores: ['**/config.json'],
        // Configurar estrategia de runtime caching para config.json
        runtimeCaching: [
          {
            urlPattern: /\/config\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'config-cache',
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'FusionDoc',
        short_name: 'FusionDoc',
        description: 'A modern, responsive static documentation site.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa_icons/android/android-launchericon-48-48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'pwa_icons/android/android-launchericon-72-72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'pwa_icons/android/android-launchericon-96-96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'pwa_icons/android/android-launchericon-144-144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'pwa_icons/android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa_icons/android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa_icons/ios/180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple-touch-icon'
          },
          {
            src: 'pwa_icons/ios/152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'apple-touch-icon'
          },
          {
            src: 'pwa_icons/ios/120.png',
            sizes: '120x120',
            type: 'image/png',
            purpose: 'apple-touch-icon'
          }
        ]
      }
    })
  ],
  // Generar rutas relativas en el build
  base: './',
  server: {
    port: 5173,
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    // Optimizaciones para producción
    minify: 'terser',
    sourcemap: false, // No generar source maps para ocultar código
    rollupOptions: {
      output: {
        // Ofuscar nombres de archivos
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Separar dependencias grandes en chunks
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          markdown: ['react-markdown', 'remark-gfm', 'rehype-katex'],
          charts: ['chart.js', 'mermaid']
        }
      }
    },
    // Configuraciones de seguridad
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.log en producción
        drop_debugger: true
      },
      mangle: true, // Ofuscar nombres de variables
      format: {
        comments: false // Eliminar comentarios
      }
    }
  }
});