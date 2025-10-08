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
    "update-manifest": `node "${path.join(__dirname, 'public', 'update-file-manifest.js')}"`,
    "force-pwa-update": `node "${path.join(__dirname, 'public', 'force-pwa-update.js')}"`,
    "update-all": "npm run update-manifest && npm run force-pwa-update"
  },
  "type": "module"
};

const distPackageJsonPath = path.join(__dirname, 'dist', 'package.json');
fs.writeFileSync(distPackageJsonPath, JSON.stringify(distPackageJson, null, 2));

// Copiar scripts necesarios a dist
console.log('📋 Copying update scripts to dist...');
const scriptsTooCopy = [
  'update-file-manifest.js',
  'force-pwa-update.js'
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

console.log('✅ GitHub Pages build completed successfully!');
console.log(`📦 Files are ready in the 'dist' directory`);
console.log(`🌐 Base path configured: ${githubBasePath}`);
console.log('📋 Package.json created in dist with update scripts');
console.log('🔄 Available scripts in dist:');
console.log('  - npm run update-manifest');
console.log('  - npm run force-pwa-update');
console.log('  - npm run update-all');