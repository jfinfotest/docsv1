import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración para GitHub Pages
const GITHUB_PAGES_CONFIG = {
  // Cambia esto por el nombre de tu repositorio
  repositoryName: 'docsv13',
  // Cambia esto por tu usuario de GitHub
  githubUsername: 'jhonf'
};

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const configPath = path.join(distDir, 'config.json');

console.log('🚀 Configurando para GitHub Pages...');

try {
  // Verificar que existe el directorio dist
  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: Ejecuta "npm run build" primero.');
    process.exit(1);
  }

  // Actualizar base path en config.json
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Asegurar que existe la estructura githubPages
    if (!config.githubPages) {
      config.githubPages = {};
    }
    
    // Actualizar el basePath para GitHub Pages
    config.githubPages.basePath = `/${GITHUB_PAGES_CONFIG.repositoryName}/`;
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ config.json actualizado con basePath: /${GITHUB_PAGES_CONFIG.repositoryName}/`);
  }

  // Crear archivo .nojekyll para GitHub Pages
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  console.log('✅ Archivo .nojekyll creado');

  // Crear CNAME si es necesario (para dominio personalizado)
  // fs.writeFileSync(path.join(distDir, 'CNAME'), 'tu-dominio.com');

  console.log('\n🎉 ¡Configuración para GitHub Pages completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Sube el contenido de la carpeta dist/ a la rama gh-pages');
  console.log('   2. O configura GitHub Actions para deploy automático');
  console.log(`   3. Tu sitio estará disponible en: https://${GITHUB_PAGES_CONFIG.githubUsername}.github.io/${GITHUB_PAGES_CONFIG.repositoryName}/`);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}