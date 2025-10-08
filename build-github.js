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

// Actualizar file-manifest.json si existe
const manifestPath = path.join(__dirname, 'dist', 'docs', 'file-manifest.json');
if (fs.existsSync(manifestPath)) {
  console.log('📋 Updating file manifest...');
  execSync('node dist/update-file-manifest.js', { stdio: 'inherit' });
}

console.log('✅ GitHub Pages build completed successfully!');
console.log(`📦 Files are ready in the 'dist' directory`);
console.log(`🌐 Base path configured: ${githubBasePath}`);