# 🚀 Guía de Distribución - FusionDoc

Esta guía te ayudará a distribuir tu aplicación FusionDoc sin exponer el código fuente.

## 🔒 Seguridad del Código

Tu aplicación está configurada con las siguientes medidas de seguridad:

- ✅ **Minificación y ofuscación** del código JavaScript
- ✅ **Sin source maps** en producción
- ✅ **Eliminación de console.log** y debuggers
- ✅ **Nombres de archivos hasheados** para cache busting
- ✅ **Separación de chunks** para optimización
- ✅ **Headers de seguridad** configurados

## 📦 Opciones de Distribución

### 1. 🌐 Distribución Estática (Recomendado)

**Ideal para:** Sitios de documentación, portfolios, landing pages

```bash
# Construir y preparar para distribución estática
npm run deploy:static
```

**Plataformas compatibles:**
- **GitHub Pages**: Gratuito, ideal para proyectos open source
- **Netlify**: Gratuito con dominio personalizado
- **Vercel**: Gratuito con excelente rendimiento
- **AWS S3 + CloudFront**: Escalable y profesional
- **Firebase Hosting**: Integración con Google Cloud

**Ventajas:**
- ✅ Máxima seguridad (solo archivos estáticos)
- ✅ Excelente rendimiento
- ✅ Bajo costo o gratuito
- ✅ CDN automático
- ✅ SSL incluido

### 2. 🖥️ Servidor Independiente

**Ideal para:** Control total, configuraciones personalizadas

```bash
# Preparar servidor independiente
npm run deploy:server
```

**Cómo usar:**
1. Sube la carpeta `server-dist/` a tu servidor
2. Instala dependencias: `npm install`
3. Inicia el servidor: `npm start`

**Configuración de puertos:**
```bash
# Puerto por defecto (3000)
npm start

# Puerto personalizado (Linux/Mac)
PORT=8080 npm start

# Puerto personalizado (Windows)
$env:PORT=8080; npm start
```

**Ventajas:**
- ✅ Control total del servidor
- ✅ Configuraciones personalizadas
- ✅ Logs y monitoreo
- ✅ Escalabilidad horizontal
- ✅ Servidor optimizado para localhost (sin problemas de permisos)

### 3. 🐳 Contenedor Docker

**Ideal para:** Despliegues en la nube, microservicios

```bash
# Crear imagen Docker
npm run deploy:docker

# Ejecutar con Docker Compose
docker-compose up -d
```

**Ventajas:**
- ✅ Entorno aislado y reproducible
- ✅ Fácil escalabilidad
- ✅ Compatible con Kubernetes
- ✅ Rollbacks sencillos

### 4. 📦 Archivo ZIP

**Ideal para:** Distribución manual, clientes específicos

```bash
# Crear archivo ZIP
npm run deploy:zip
```

## 🛡️ Configuraciones de Seguridad

### Headers de Seguridad Incluidos

```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: [configurado]
```

### Optimizaciones de Cache

- **Assets estáticos**: Cache de 1 año
- **HTML**: Sin cache para actualizaciones inmediatas
- **Service Worker**: Sin cache para funcionalidad PWA

## 🚀 Despliegue Paso a Paso

### GitHub Pages

```bash
# 1. Configurar para GitHub Pages
npm run deploy:github-pages

# 2. Subir a rama gh-pages
git checkout -b gh-pages
git add dist/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### Netlify

1. Ejecuta: `npm run deploy:static`
2. Arrastra la carpeta `dist/` a [netlify.com/drop](https://netlify.com/drop)
3. ¡Listo! Tu sitio estará disponible en minutos

### Vercel

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Vercel detectará automáticamente la configuración
3. El despliegue será automático en cada push

### Servidor VPS/Cloud

```bash
# En tu servidor
git clone tu-repositorio
cd tu-repositorio
npm install
npm run deploy:server

# Copiar archivos del servidor
cp -r server-dist/* /var/www/tu-sitio/
cd /var/www/tu-sitio/
npm install
npm start
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea un archivo `.env.production`:

```env
NODE_ENV=production
PORT=3000
# Otras variables específicas
```

### SSL/HTTPS

Para HTTPS, configura tu servidor web (Nginx/Apache) o usa servicios como:
- Let's Encrypt (gratuito)
- Cloudflare (gratuito)
- AWS Certificate Manager

### Monitoreo

Considera usar:
- **PM2** para gestión de procesos Node.js
- **Docker Health Checks** para contenedores
- **Uptime monitoring** (UptimeRobot, Pingdom)

## 📊 Rendimiento

Tu aplicación está optimizada con:

- ✅ **Code splitting** automático
- ✅ **Tree shaking** para eliminar código no usado
- ✅ **Compresión gzip/brotli**
- ✅ **Lazy loading** de componentes
- ✅ **PWA** con cache offline

## 🆘 Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de rutas en producción
- Verifica que `base: './'` esté en `vite.config.ts`
- Asegúrate de que el servidor maneje rutas SPA

### Problemas de cache
- Usa `Ctrl+F5` para forzar recarga
- Verifica headers de cache en DevTools

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los logs del servidor
2. Verifica la configuración de red
3. Consulta la documentación de tu plataforma de hosting

---

**¡Tu aplicación está lista para distribución segura! 🎉**