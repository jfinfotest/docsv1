import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEPLOY_OPTIONS = {
  static: 'Distribución estática (GitHub Pages, Netlify, Vercel)',
  server: 'Servidor Node.js independiente',
  docker: 'Contenedor Docker',
  zip: 'Archivo ZIP para distribución manual'
};

function showHelp() {
  console.log('🚀 Script de Despliegue FusionDoc\n');
  console.log('Uso: node scripts/deploy.js [opción]\n');
  console.log('Opciones disponibles:');
  Object.entries(DEPLOY_OPTIONS).forEach(([key, desc]) => {
    console.log(`  ${key.padEnd(10)} - ${desc}`);
  });
  console.log('\nEjemplo: node scripts/deploy.js static');
}

function buildProject() {
  console.log('📦 Construyendo proyecto...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completado');
  } catch (error) {
    console.error('❌ Error en el build:', error.message);
    process.exit(1);
  }
}

function deployStatic() {
  console.log('🌐 Preparando distribución estática...');
  buildProject();
  
  const distPath = path.join(__dirname, '..', 'dist');
  console.log(`📁 Archivos listos en: ${distPath}`);
  console.log('\n📋 Opciones de despliegue:');
  console.log('   • GitHub Pages: Sube el contenido de dist/ a rama gh-pages');
  console.log('   • Netlify: Arrastra la carpeta dist/ a netlify.com/drop');
  console.log('   • Vercel: Conecta tu repositorio en vercel.com');
  console.log('   • Cualquier hosting estático: Sube el contenido de dist/');
}

function deployServer() {
  console.log('🖥️  Preparando servidor independiente...');
  buildProject();
  
  const serverDir = path.join(__dirname, '..', 'server-dist');
  
  // Crear directorio del servidor
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true });
  }
  fs.mkdirSync(serverDir);
  
  // Copiar archivos necesarios
  fs.copyFileSync(
    path.join(__dirname, '..', 'server.js'),
    path.join(serverDir, 'server.js')
  );
  
  fs.copyFileSync(
    path.join(__dirname, '..', 'production-package.json'),
    path.join(serverDir, 'package.json')
  );
  
  // Copiar dist
  const distSrc = path.join(__dirname, '..', 'dist');
  const distDest = path.join(serverDir, 'dist');
  fs.cpSync(distSrc, distDest, { recursive: true });
  
  console.log(`✅ Servidor listo en: ${serverDir}`);
  console.log('\n📋 Para desplegar:');
  console.log('   1. Sube la carpeta server-dist/ a tu servidor');
  console.log('   2. Ejecuta: npm install');
  console.log('   3. Ejecuta: npm start');
  console.log('\n💡 Notas importantes:');
  console.log('   • El servidor usa localhost por defecto (puerto 3000)');
  console.log('   • Para cambiar puerto: PORT=8080 npm start');
  console.log('   • En Windows: $env:PORT=8080; npm start');
  console.log('   • Para producción, considera usar PM2 o similar');
}

function deployDocker() {
  console.log('🐳 Preparando contenedor Docker...');
  
  try {
    console.log('📦 Construyendo imagen Docker...');
    execSync('docker build -t fusiondoc .', { stdio: 'inherit' });
    
    console.log('✅ Imagen Docker creada: fusiondoc');
    console.log('\n📋 Para ejecutar:');
    console.log('   • Desarrollo: docker run -p 3000:3000 fusiondoc');
    console.log('   • Producción: docker-compose up -d');
    console.log('   • Exportar imagen: docker save fusiondoc > fusiondoc.tar');
    
  } catch (error) {
    console.error('❌ Error creando imagen Docker:', error.message);
    console.log('💡 Asegúrate de tener Docker instalado y ejecutándose');
  }
}

function deployZip() {
  console.log('📦 Creando archivo ZIP para distribución...');
  buildProject();
  
  try {
    const zipName = `fusiondoc-${new Date().toISOString().split('T')[0]}.zip`;
    
    // Crear ZIP con PowerShell (Windows)
    const distPath = path.join(__dirname, '..', 'dist');
    const zipPath = path.join(__dirname, '..', zipName);
    
    execSync(`powershell Compress-Archive -Path "${distPath}\\*" -DestinationPath "${zipPath}"`, { stdio: 'inherit' });
    
    console.log(`✅ Archivo ZIP creado: ${zipName}`);
    console.log('📋 Puedes subir este archivo a cualquier hosting estático');
    
  } catch (error) {
    console.error('❌ Error creando ZIP:', error.message);
  }
}

// Función principal
function main() {
  const option = process.argv[2];
  
  if (!option || !DEPLOY_OPTIONS[option]) {
    showHelp();
    return;
  }
  
  console.log(`🚀 Iniciando: ${DEPLOY_OPTIONS[option]}\n`);
  
  switch (option) {
    case 'static':
      deployStatic();
      break;
    case 'server':
      deployServer();
      break;
    case 'docker':
      deployDocker();
      break;
    case 'zip':
      deployZip();
      break;
  }
  
  console.log('\n🎉 ¡Despliegue completado!');
}

main();