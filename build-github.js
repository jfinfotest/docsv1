#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Building for GitHub Pages...');

// Leer el config.json
const configPath = path.join(__dirname, 'public', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Obtener el basePath de GitHub Pages
const githubBasePath = config.githubPages?.basePath || '/docsv13/';

console.log(`📁 Using GitHub Pages basePath: ${githubBasePath}`);

// Limpiar directorio dist si existe
if (fs.existsSync('dist')) {
  console.log('🧹 Cleaning dist directory...');
  fs.rmSync('dist', { recursive: true, force: true });
}

// Ejecutar build con el basePath de GitHub
console.log('🔨 Building application...');
process.env.VITE_BASE_PATH = githubBasePath;
execSync('vite build --base=' + githubBasePath, { stdio: 'inherit' });

// Actualizar config.json en dist para GitHub Pages
const distConfigPath = path.join(__dirname, 'dist', 'config.json');
if (fs.existsSync(distConfigPath)) {
  console.log('⚙️ Updating config.json for GitHub Pages...');
  const distConfig = JSON.parse(fs.readFileSync(distConfigPath, 'utf8'));
  
  // Asegurar que el basePath esté configurado para GitHub Pages
  if (!distConfig.githubPages) {
    distConfig.githubPages = {};
  }
  distConfig.githubPages.basePath = githubBasePath;
  
  fs.writeFileSync(distConfigPath, JSON.stringify(distConfig, null, 2));
}

// Crear package.json en dist con scripts para actualización
console.log('📦 Creating package.json in dist...');
const distPackageJson = {
  "name": "fusiondoc-dist",
  "version": "1.0.0",
  "description": "Distribution package for FusionDoc with update scripts",
  "scripts": {
    "update-manifest": "node update-file-manifest.js",
    "force-pwa-update": "node force-pwa-update.js",
    "update-basepath": "node update-basepath.js",
    "update-all": "npm run update-manifest && npm run update-basepath && npm run force-pwa-update"
  },
  "type": "module"
};

const distPackageJsonPath = path.join(__dirname, 'dist', 'package.json');
fs.writeFileSync(distPackageJsonPath, JSON.stringify(distPackageJson, null, 2));

// Copiar scripts necesarios a dist (incluyendo ultra-cache-buster y update-basepath)
console.log('📋 Copying update scripts to dist...');
const scriptsTooCopy = [
  'update-file-manifest.js',
  'force-pwa-update.js',
  'ultra-cache-buster.js',
  'build-and-update.js',
  'deploy-with-pwa-update.js',
  'update-basepath.js'
];

scriptsTooCopy.forEach(script => {
  const sourcePath = path.join(__dirname, 'public', script);
  const destPath = path.join(__dirname, 'dist', script);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`  ✓ Copied ${script}`);
  } else {
    console.log(`  ⚠️ Warning: ${script} not found in public directory`);
  }
});

// Actualizar file-manifest.json si existe
const manifestPath = path.join(__dirname, 'dist', 'docs', 'file-manifest.json');
if (fs.existsSync(manifestPath)) {
  console.log('📋 Updating file manifest...');
  execSync('node dist/update-file-manifest.js', { stdio: 'inherit' });
}

// Ejecutar automáticamente la actualización del basePath
console.log('🔧 Applying basePath configuration...');
try {
  execSync('node dist/update-basepath.js', { stdio: 'inherit' });
  console.log('✅ BasePath configuration applied successfully!');
} catch (error) {
  console.error('❌ Error applying basePath configuration:', error.message);
  console.log('⚠️ Build will continue but basePath configuration may not be optimal');
}

// Ejecutar automáticamente la actualización PWA ultra-agresiva
console.log('🚀 Applying ultra-aggressive PWA cache busting...');
try {
  execSync('node dist/force-pwa-update.js', { stdio: 'inherit' });
  console.log('✅ Ultra-aggressive PWA cache busting applied successfully!');
} catch (error) {
  console.error('❌ Error applying PWA cache busting:', error.message);
  console.log('⚠️ Build completed but PWA cache busting failed');
}

console.log('✅ GitHub Pages build completed successfully!');
console.log(`📦 Files are ready in the 'dist' directory`);
console.log(`🌐 Base path configured: ${githubBasePath}`);
console.log('📋 Package.json created in dist with update scripts');
console.log('🚀 Ultra-aggressive cache busting automatically applied');
console.log('🔄 Available scripts in dist:');
console.log('  - npm run update-manifest');
console.log('  - npm run update-basepath');
console.log('  - npm run force-pwa-update');
console.log('  - npm run update-all');
console.log('');
console.log('💡 Features automatically included:');
console.log('  ✓ Ultra-aggressive cache busting');
console.log('  ✓ Automatic PWA version management');
console.log('  ✓ Service Worker forced updates');
console.log('  ✓ Complete browser cache invalidation');
console.log('  ✓ Real-time config.json change detection');
console.log('  ✓ Dynamic basePath configuration');
console.log('  ✓ GitHub Pages basePath auto-update');