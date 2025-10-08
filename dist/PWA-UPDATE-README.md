# 🔄 Scripts de Actualización PWA

Este directorio contiene scripts para forzar la actualización de la PWA y solucionar problemas de cache en el navegador.

## 📁 Archivos Incluidos

- `force-pwa-update.js` - Script principal para forzar actualización de PWA
- `build-and-update.js` - Script combinado (build + actualización)
- `PWA-UPDATE-README.md` - Esta documentación

## 🚀 Uso

### Opción 1: Solo Actualización (si ya tienes el build)
```bash
node public/force-pwa-update.js
```

### Opción 2: Build Completo + Actualización (Recomendado)
```bash
node public/build-and-update.js
```

## 🎯 ¿Qué hace el script?

El script `force-pwa-update.js` realiza las siguientes acciones:

1. **Actualiza el manifest.webmanifest**
   - Agrega un hash de versión único
   - Modifica la `start_url` con parámetro de versión
   - Actualiza las rutas de iconos con parámetros de versión

2. **Modifica el index.html**
   - Actualiza referencias al manifest y service worker
   - Agrega meta tag con versión de PWA

3. **Actualiza el Service Worker**
   - Agrega comentario con nueva versión y timestamp
   - Modifica URLs de archivos con parámetros de versión

4. **Actualiza archivos CSS/JS principales**
   - Agrega timestamps a archivos principales
   - Fuerza regeneración de cache

## ✅ Beneficios

- ✅ **Actualización inmediata**: Los usuarios ven cambios al instante
- ✅ **Soluciona cache persistente**: Elimina problemas de archivos cacheados
- ✅ **Compatible con distribución**: Solo necesitas distribuir la carpeta `dist`
- ✅ **No rompe funcionalidad**: Mantiene toda la funcionalidad de la PWA
- ✅ **Automático**: No requiere intervención manual

## 🔧 Flujo de Trabajo Recomendado

1. **Desarrollo normal**: Haz tus cambios en el código
2. **Build y actualización**: Ejecuta `node public/build-and-update.js`
3. **Distribución**: Copia solo la carpeta `dist` a tu servidor
4. **Resultado**: Los usuarios verán la actualización automáticamente

## 📋 Ejemplo de Salida

```
🚀 Iniciando build completo con actualización de PWA...

📦 Paso 1: Ejecutando build para GitHub Pages...
🚀 Building for GitHub Pages...
📁 Using GitHub Pages basePath: /docsv13/
🧹 Cleaning dist directory...
🔨 Building application...
⚙️ Updating config.json for GitHub Pages...
📋 Updating file manifest...
✅ GitHub Pages build completed successfully!

🔄 Paso 2: Forzando actualización de PWA...
🔄 Iniciando actualización forzada de PWA...
📁 Trabajando en: C:\...\dist
✅ Manifest actualizado con versión: a1b2c3d4
✅ index.html actualizado con nuevas referencias
✅ Service Worker actualizado con versión: e5f6g7h8
✅ 3 archivos de assets actualizados

🎉 ¡PWA actualizada exitosamente!
📦 La carpeta dist está lista para distribuir
🔄 Los usuarios verán la actualización inmediatamente
```

## ⚠️ Notas Importantes

- **Ejecutar después del build**: Siempre ejecuta estos scripts DESPUÉS del build
- **Solo carpeta dist**: Solo necesitas distribuir la carpeta `dist`, no el proyecto completo
- **Compatibilidad**: Compatible con GitHub Pages y cualquier hosting estático
- **Frecuencia**: Ejecuta cada vez que quieras forzar una actualización

## 🐛 Solución de Problemas

### Error: "Directorio dist no encontrado"
- **Solución**: Ejecuta primero `npm run build` o `npm run build:github`

### Error: "Archivo no encontrado"
- **Solución**: Verifica que el build se completó correctamente

### La PWA no se actualiza
- **Solución**: Verifica que el service worker esté registrado correctamente
- **Tip**: Abre DevTools > Application > Service Workers para verificar

## 📞 Soporte

Si encuentras problemas, verifica:
1. Que el build se completó sin errores
2. Que tienes permisos de escritura en la carpeta dist
3. Que el service worker está funcionando correctamente