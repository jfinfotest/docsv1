#!/usr/bin/env node

/**
 * Script automatizado para build y actualización de PWA
 * Combina el proceso de build con la actualización forzada de PWA
 * Ideal para despliegues en GitHub Pages
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando proceso automatizado de build y actualización de PWA...\n');

try {
  // 1. Ejecutar build para GitHub Pages
  console.log('📦 Paso 1: Ejecutando build para GitHub Pages...');
  execSync('npm run build:github', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Build completado exitosamente\n');

  // 2. Ejecutar actualización de PWA desde dist
  console.log('🔄 Paso 2: Ejecutando actualización forzada de PWA...');
  const distPath = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distPath)) {
    throw new Error('Carpeta dist no encontrada. El build falló.');
  }

  execSync('npm run force-pwa-update', { 
    stdio: 'inherit',
    cwd: distPath
  });
  console.log('✅ PWA actualizada exitosamente\n');

  // 3. Mostrar resumen
  console.log('🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Resumen de acciones realizadas:');
  console.log('   ✓ Build para GitHub Pages ejecutado');
  console.log('   ✓ Configuración de GitHub Pages aplicada');
  console.log('   ✓ Scripts de actualización copiados a dist');
  console.log('   ✓ PWA actualizada con cache busting agresivo');
  console.log('   ✓ Service Worker forzado a actualizar');
  console.log('   ✓ Todos los caches invalidados');
  console.log('   ✓ Script de invalidación de cache creado');
  console.log('');
  console.log('🌐 La carpeta dist está lista para desplegar en GitHub Pages');
  console.log('🔄 Los usuarios recibirán la actualización inmediatamente');
  console.log('');
  console.log('💡 Próximos pasos:');
  console.log('   1. Commitea y pushea los cambios a GitHub');
  console.log('   2. GitHub Pages se actualizará automáticamente');
  console.log('   3. Los usuarios verán la nueva versión sin cache');

} catch (error) {
  console.error('\n❌ ERROR en el proceso de build y actualización:');
  console.error(error.message);
  console.error('\n🔧 Posibles soluciones:');
  console.error('   1. Verifica que todas las dependencias estén instaladas');
  console.error('   2. Asegúrate de que no hay errores en el código');
  console.error('   3. Revisa que los archivos de configuración sean válidos');
  process.exit(1);
}