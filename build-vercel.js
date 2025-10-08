#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building for Vercel/Netlify...');

try {
  // 1. Ejecutar build estándar de Vite
  console.log('📦 Running Vite build...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Leer el config.json original
  const configPath = path.join(process.cwd(), 'dist', 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // 3. Remover la configuración de GitHub Pages para Vercel/Netlify
  if (config.githubPages) {
    console.log('🔧 Removing GitHub Pages configuration...');
    delete config.githubPages;
  }

  // 4. Escribir el config.json limpio
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Config.json updated for Vercel/Netlify');

  console.log('✅ Vercel/Netlify build completed successfully!');
  console.log('📦 Files are ready in the \'dist\' directory');
  console.log('🌐 No base path configured (perfect for Vercel/Netlify)');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}