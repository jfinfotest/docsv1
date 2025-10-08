#!/usr/bin/env node

/**
 * Script para forzar la actualización de la PWA
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

console.log('🔄 Iniciando actualización forzada de PWA...');

/**
 * Genera un hash único basado en timestamp
 */
function generateVersionHash() {
  const timestamp = Date.now().toString();
  return crypto.createHash('md5').update(timestamp).digest('hex').substring(0, 8);
}

/**
 * Actualiza el manifest.webmanifest con un nuevo parámetro de versión
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
    manifest.version = versionHash;
    manifest.start_url = `./index.html?v=${versionHash}`;
    
    // Actualizar iconos con parámetros de versión
    if (manifest.icons) {
      manifest.icons = manifest.icons.map(icon => ({
        ...icon,
        src: `${icon.src}?v=${versionHash}`
      }));
    }

    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest actualizado con versión: ${versionHash}`);
    return versionHash;
  } catch (error) {
    console.error('❌ Error actualizando manifest:', error.message);
    return false;
  }
}

/**
 * Actualiza el archivo index.html con parámetros de versión
 */
function updateIndexHtml(versionHash) {
  if (!fs.existsSync(INDEX_FILE)) {
    console.log('⚠️  Archivo index.html no encontrado');
    return false;
  }

  try {
    let htmlContent = fs.readFileSync(INDEX_FILE, 'utf8');
    
    // Actualizar referencias al manifest
    htmlContent = htmlContent.replace(
      /href="([^"]*manifest\.webmanifest[^"]*)"/g,
      `href="$1?v=${versionHash}"`
    );
    
    // Actualizar referencias al service worker
    htmlContent = htmlContent.replace(
      /src="([^"]*registerSW\.js[^"]*)"/g,
      `src="$1?v=${versionHash}"`
    );
    
    // Agregar meta tag de versión
    const versionMeta = `<meta name="pwa-version" content="${versionHash}">`;
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

    fs.writeFileSync(INDEX_FILE, htmlContent);
    console.log('✅ index.html actualizado con nuevas referencias');
    return true;
  } catch (error) {
    console.error('❌ Error actualizando index.html:', error.message);
    return false;
  }
}

/**
 * Actualiza el service worker para forzar nueva versión
 */
function updateServiceWorker() {
  if (!fs.existsSync(SW_FILE)) {
    console.log('⚠️  Service Worker no encontrado');
    return false;
  }

  try {
    let swContent = fs.readFileSync(SW_FILE, 'utf8');
    const versionHash = generateVersionHash();
    
    // Agregar comentario con nueva versión al inicio del SW
    const versionComment = `// PWA Version: ${versionHash} - ${new Date().toISOString()}\n`;
    
    // Remover comentario de versión anterior si existe
    swContent = swContent.replace(/\/\/ PWA Version:.*\n/g, '');
    
    // Agregar nuevo comentario de versión
    swContent = versionComment + swContent;
    
    // Actualizar cualquier referencia a archivos con parámetros de versión
    swContent = swContent.replace(
      /"url":"([^"]+)"/g,
      `"url":"$1?v=${versionHash}"`
    );

    fs.writeFileSync(SW_FILE, swContent);
    console.log(`✅ Service Worker actualizado con versión: ${versionHash}`);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando Service Worker:', error.message);
    return false;
  }
}

/**
 * Actualiza archivos CSS y JS principales con timestamps
 */
function updateAssets() {
  const assetsDir = path.join(DIST_DIR, 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.log('⚠️  Directorio assets no encontrado');
    return false;
  }

  try {
    const files = fs.readdirSync(assetsDir);
    const cssFiles = files.filter(file => file.endsWith('.css'));
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    let updatedCount = 0;
    
    // Actualizar archivos CSS principales
    cssFiles.forEach(file => {
      const filePath = path.join(assetsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const timestamp = `/* Updated: ${new Date().toISOString()} */\n`;
      fs.writeFileSync(filePath, timestamp + content);
      updatedCount++;
    });
    
    // Actualizar algunos archivos JS principales (no todos para evitar romper funcionalidad)
    const mainJsFiles = jsFiles.filter(file => 
      file.includes('index-') || file.includes('main-')
    );
    
    mainJsFiles.forEach(file => {
      const filePath = path.join(assetsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const timestamp = `/* Updated: ${new Date().toISOString()} */\n`;
      fs.writeFileSync(filePath, timestamp + content);
      updatedCount++;
    });

    console.log(`✅ ${updatedCount} archivos de assets actualizados`);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando assets:', error.message);
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
  
  // 4. Actualizar assets
  if (!updateAssets()) success = false;
  
  if (success) {
    console.log('\n🎉 ¡PWA actualizada exitosamente!');
    console.log('📦 La carpeta dist está lista para distribuir');
    console.log('🔄 Los usuarios verán la actualización inmediatamente');
    console.log('\n💡 Tip: Ejecuta este script cada vez que quieras forzar una actualización');
  } else {
    console.log('\n⚠️  Actualización completada con algunos errores');
    console.log('📦 Revisa los mensajes anteriores para más detalles');
  }
}

// Ejecutar script
main();