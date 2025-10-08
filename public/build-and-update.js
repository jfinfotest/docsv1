#!/usr/bin/env node

/**
 * Script combinado: Build + Actualización de PWA
 * 
 * Este script ejecuta el build completo y luego fuerza la actualización
 * de la PWA cambiando los hashes de archivos.
 * 
 * Uso: node public/build-and-update.js
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando build completo con actualización de PWA...\n');

try {
  // 1. Ejecutar build para GitHub Pages
  console.log('📦 Paso 1: Ejecutando build para GitHub Pages...');
  execSync('node build-github.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n✅ Build completado exitosamente\n');
  
  // 2. Ejecutar actualización de PWA
  console.log('🔄 Paso 2: Forzando actualización de PWA...');
  execSync('node public/force-pwa-update.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n🎉 ¡Proceso completado exitosamente!');
  console.log('📁 La carpeta dist está lista para distribuir');
  console.log('🌐 La PWA se actualizará automáticamente en los navegadores');
  
} catch (error) {
  console.error('\n❌ Error durante el proceso:', error.message);
  process.exit(1);
}