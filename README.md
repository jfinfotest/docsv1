# FusionDoc

FusionDoc es un sitio de documentación estática moderno y responsivo construido con React, TypeScript y Vite. Diseñado para ser rápido, accesible y fácil de personalizar, con integración avanzada de IA y componentes interactivos.

## Características Principales

### 🚀 **Rendimiento y Tecnología**
- **Vite + React 18**: Tiempos de carga ultrarrápidos y hot reload instantáneo
- **TypeScript**: Desarrollo type-safe con mejor experiencia de desarrollo
- **Tailwind CSS**: Diseño moderno y responsivo con utilidades CSS

### 🎨 **Interfaz y Experiencia de Usuario**
- **Modo Oscuro/Claro**: Soporte completo para temas con transiciones suaves
- **Diseño Responsivo**: Optimizado para móviles, tablets y escritorio
- **Temas Personalizables**: Múltiples esquemas de color y fuentes
- **Navegación Inteligente**: Sidebar colapsible, breadcrumbs y navegación contextual

### 🔍 **Búsqueda y Contenido**
- **Búsqueda Avanzada**: Indexación completa con Lunr.js y resultados en tiempo real
- **Markdown Enriquecido**: Soporte para GFM, matemáticas (KaTeX), diagramas (Mermaid)
- **Syntax Highlighting**: Prism.js con múltiples temas y lenguajes personalizados
- **Versionado**: Soporte para múltiples versiones de documentación

### 🤖 **Integración con IA (Google Gemini)**
- **Chat Inteligente**: Conversaciones contextuales sobre el contenido
- **Generación de Cuestionarios**: Evaluaciones automáticas basadas en el contenido
- **Generación de Podcasts**: Conversión de texto a audio con múltiples voces
- **Simplificación de Contenido**: Explicaciones adaptadas al nivel del usuario
- **Análisis de Código**: Explicación y traducción de fragmentos de código
- **Generación de Glosarios**: Términos técnicos explicados automáticamente

### 📊 **Componentes Interactivos**
- **Gráficos**: Chart.js integrado para visualizaciones de datos
- **Carruseles de Imágenes**: Galerías interactivas con lightbox
- **Acordeones y Pestañas**: Organización de contenido expandible
- **Líneas de Tiempo**: Visualización cronológica de eventos
- **Tarjetas de Estadísticas**: Métricas destacadas con animaciones
- **API Explorer**: Interfaz para probar endpoints REST
- **Scrollytelling**: Narrativas interactivas con scroll

### 🌐 **Internacionalización y Accesibilidad**
- **Multiidioma**: Soporte completo para español e inglés
- **Accesibilidad**: Cumple con estándares WCAG
- **SEO Optimizado**: Meta tags y estructura semántica

## Arquitectura del Proyecto

### Estructura de Directorios
```
docsv3/
├── src/                          # Código fuente de la aplicación
│   ├── components/              # Componentes React reutilizables
│   ├── context/                 # Contextos de React (Theme, Nav, etc.)
│   ├── hooks/                   # Custom hooks
│   ├── config/                  # Configuraciones (fuentes, temas)
│   ├── services/                # Servicios (carga de lenguajes Prism)
│   ├── utils/                   # Utilidades y helpers
│   └── styles/                  # Estilos CSS globales
├── public/                      # Archivos estáticos
│   ├── docs/                    # Documentación en Markdown
│   ├── assets/                  # Imágenes y recursos
│   └── scripts/                 # Scripts de utilidad
├── scripts/                     # Scripts de servidor y build
├── .github/workflows/           # GitHub Actions para CI/CD
└── dist/                        # Archivos de producción (generados)
```

### Tecnologías Principales

#### Frontend
- **React 18.2.0**: Biblioteca principal de UI
- **TypeScript 5.0.0**: Tipado estático
- **Vite 4.4.0**: Build tool y dev server
- **Tailwind CSS 3.4.0**: Framework CSS utility-first
- **React Router DOM 6.8.0**: Enrutamiento SPA

#### Procesamiento de Contenido
- **React Markdown 8.0.7**: Renderizado de Markdown
- **Remark GFM 3.0.1**: GitHub Flavored Markdown
- **Rehype KaTeX 7.0.0**: Renderizado de matemáticas
- **Prism.js 1.30.0**: Syntax highlighting
- **Mermaid 11.11.0**: Diagramas y gráficos

#### IA y Servicios
- **Google Generative AI 0.2.1**: Integración con Gemini
- **Lunr 2.3.9**: Motor de búsqueda cliente
- **Chart.js 4.4.3**: Gráficos interactivos

#### Optimización
- **Terser 5.44.0**: Minificación de JavaScript

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js 18+**: Requerido para el entorno de desarrollo
- **npm**: Gestor de paquetes (incluido con Node.js)
- **Git**: Para clonar el repositorio

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/docsv7.git
cd docsv7

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración Básica

Toda la configuración de tu sitio se realiza a través del archivo `config.json` ubicado en el directorio `/public`. Este archivo no está en el repositorio por defecto, pero puedes crearlo basándote en la plantilla proporcionada.

1. **Crear archivo de configuración** en `public/config.json`:
```json
{
  "app": {
    "title": "Tu Documentación",
    "subtitle": "Subtítulo de tu sitio",
    "icon": "/assets/logo.png",
    "favicon": "favicon.ico"
  },
  "theme": {
    "defaultMode": "light",
    "allowUserToggle": true,
    "font": "Inter",
    "codeTheme": "vs-dark"
  },
  "i18n": {
    "defaultLanguage": "es",
    "languages": [
      { "code": "en", "name": "English" },
      { "code": "es", "name": "Español" }
    ]
  },
  "version": {
    "versions": ["v2.0", "v1.0"]
  }
}
```

2. **Estructura de configuración completa**:
   - `app`: Identidad del sitio (título, subtítulo, icono)
   - `theme`: Apariencia visual (modo, fuente, tema de código)
   - `header`: Enlaces y configuración del encabezado
   - `footer`: Texto y enlaces del pie de página
   - `i18n`: Configuración de idiomas
   - `version`: Gestión de versiones de documentación
  - `uiText`: Traducciones de la interfaz de usuario
  - `maintenanceMode`: Modo de mantenimiento

### Configuración Detallada

Para una configuración completa, puedes ver el archivo `config.json` en la raíz del proyecto (aunque no se rastrea en git, sirve como plantilla). Los campos principales incluyen:

```json
{
  "app": {
    "title": "Tu Documentación",
    "subtitle": "Subtítulo descriptivo",
    "icon": "/assets/logo.svg",
    "favicon": "favicon.ico"
  },
  "theme": {
    "defaultMode": "light",
    "allowUserToggle": true,
    "font": "Inter",
    "codeTheme": "vs-dark"
  },
  "header": {
    "title": "Documentación",
    "background": {
      "enabled": false,
      "image": "/assets/header-bg.jpg",
      "opacity": 0.8,
      "overlay": true,
      "overlayColor": "#000000"
    },
    "links": [
      {
        "icon": "GitHub",
        "label": "GitHub",
        "url": "https://github.com/tu-usuario"
      }
    ]
  },
  "secondaryNav": {
    "enabled": true,
    "background": {
      "enabled": false,
      "image": "/assets/nav-bg.jpg",
      "opacity": 0.7
    }
  },
  "footer": {
    "enabled": true,
    "text": "© 2024 Tu Proyecto. Todos los derechos reservados.",
    "links": []
  },
  "editPageButton": {
    "enabled": false,
    "baseUrl": "https://github.com/tu-usuario/tu-repo/edit/main"
  },
  "announcementBanner": {
    "enabled": false,
    "id": "announcement-1",
    "content": "¡Nueva versión disponible!",
    "link": {
      "href": "/novedades",
      "text": "Ver más"
    }
  },
  "sidebarBusinessInfo": {
    "enabled": false,
    "logo": "/assets/business-logo.png",
    "title": "Tu Empresa",
    "link": "https://tu-empresa.com",
    "footerText": "© Tu Empresa"
  },
  "i18n": {
    "defaultLanguage": "es",
    "languages": [
      { "code": "en", "name": "English" },
      { "code": "es", "name": "Español" }
    ]
  },
  "version": {
    "versions": ["v2.0", "v1.0"]
  },
  "maintenanceMode": {
    "enabled": false,
    "message": "Estamos realizando tareas de mantenimiento. Volveremos pronto."
  },
  "uiText": {
    "en": {
      "searchPlaceholder": "Search docs...",
      "onThisPage": "On this page",
      "editThisPage": "Edit this page",
      "previousPage": "Previous",
      "nextPage": "Next"
    },
    "es": {
      "searchPlaceholder": "Buscar documentos...",
      "onThisPage": "En esta página",
      "editThisPage": "Editar esta página",
      "previousPage": "Anterior",
      "nextPage": "Siguiente"
    }
  }
}
```

  3. **Añadir contenido** en la carpeta `public/docs/`:

**Estructura de carpetas:**
```
public/docs/
├── v2.0/                    # Versión actual
│   ├── getting-started.md   # Página de inicio
│   ├── api/                 # Sección API
│   │   ├── introduction.md
│   │   └── endpoints.md
│   └── guides/              # Guías
│       └── tutorial.md
└── file-manifest.json      # Generado automáticamente
```

**Sistema file-manifest.json:**
Este archivo se genera automáticamente y contiene la lista completa de archivos de documentación. Se actualiza ejecutando:
- `npm run update-manifest` (manual)
- Durante el proceso de build automáticamente

**Formato actual del manifiesto:**
```json
{
  "files": [
    "index.md",
    "components-reference.md",
    "v1.0/en/01-fundamentals/01-basic-configuration.md",
    "v1.0/en/01-fundamentals/02-writing-content.md",
    "v2.0/en/tutorial/getting-started/01-setup-and-config.md"
  ]
}
```
**Frontmatter soportado:**
Los archivos Markdown pueden incluir estos campos en el frontmatter (encabezado YAML):

```yaml
---
title: "Título de la página"           # Título que aparece en la navegación
author: "Nombre del autor"            # (opcional) Autor del contenido
date: "2024-01-15"                    # (opcional) Fecha de publicación
position: 1                           # (opcional) Orden dentro de la carpeta
folder_position: 2                    # (opcional) Orden de la carpeta en navegación
hide_title: true                      # (opcional) Oculta el título principal
hidden: true                          # (opcional) Oculta la página de navegación
version: "v2.0"                       # (opcional) Versión específica
language: "es"                        # (opcional) Idioma específico
---
```

**Campos NO procesados:**
- `description`: No se utiliza en la aplicación
- `category`: No se procesa (reemplazado por `folder_position`)

**Ejemplo completo:**
```yaml
---
title: "Guía de inicio rápido"
author: "Equipo de Documentación"
date: "2024-01-15"
position: 1
folder_position: 1
hide_title: false
hidden: false
---
```

### Sistema de Navegación

La aplicación genera automáticamente la navegación basándose en:

1. **Estructura de carpetas**: Las carpetas se ordenan según `folder_position`
2. **Archivos dentro de carpetas**: Los archivos se ordenan según `position`
3. **Archivos index**: Los archivos `index.md` se muestran como páginas principales
4. **Archivos ocultos**: Los archivos con `hidden: true` no aparecen en la navegación

**Ejemplo de estructura:**
```
public/docs/
├── v2.0/
│   ├── index.md                    # Página principal
│   ├── getting-started.md        # Ordenado por position
│   ├── advanced/
│   │   ├── index.md               # Página principal de la sección
│   │   ├── configuration.md       # Ordenado por position
│   │   └── troubleshooting.md
│   └── api/
│       ├── index.md
│       └── endpoints.md
```

### Soporte Multiidioma

La aplicación detecta automáticamente los idiomas disponibles basándose en la estructura de carpetas:

```
public/docs/
├── v2.0/
│   ├── en/          # Contenido en inglés
│   │   ├── index.md
│   │   └── guides/
│   └── es/          # Contenido en español
│       ├── index.md
│       └── guides/
```

**Cómo funciona:**
- Los idiomas se detectan automáticamente desde las carpetas (`en`, `es`, etc.)
- El selector de idioma aparece cuando hay más de un idioma disponible
- Los archivos sin especificar idioma heredan el idioma de la carpeta padre
- Se puede especificar el idioma en el frontmatter con `language: "es"`

4. **Configurar IA (Opcional)** - Obtener API key de Google Gemini:
   - Visitar [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Generar una API key
   - Configurarla en la interfaz de configuración de la aplicación

### Primer Uso

1. **Desarrollo local**:
```bash
npm run dev
# Acceder a: http://localhost:5173
```

2. **Construcción para producción**:
```bash
npm run build
# El build se genera en la carpeta dist/
```

3. **Servidor de producción**:
```bash
cd dist
npm install
npm start
# Acceder a: http://localhost:3000
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev             # Servidor de desarrollo (puerto 5173)

# Construcción
npm run build           # Build para producción
npm run build:only      # Build sin tareas adicionales

# Preview
npm run preview         # Preview del build con Vite

# Utilidades
npm run update-manifest # Actualiza manualmente el manifest de archivos
```

#### Descripción Detallada de Scripts

**Scripts de Desarrollo:**
- `dev`: Inicia el servidor de desarrollo de Vite en puerto 5173

**Scripts de Build:**
- `build`: Genera build para producción
- `build:only`: Genera build sin tareas adicionales

**Scripts de Preview:**
- `preview`: Preview del build usando Vite

**Scripts de Utilidad:**
- `update-manifest`: Actualiza manualmente el manifiesto de archivos

**Servidor de Producción:**
Después de ejecutar `npm run build`, se crea una carpeta `dist/` con un servidor de producción independiente:

```bash
cd dist
npm install    # Instalar dependencias del servidor
npm start      # Iniciar servidor en modo producción (puerto 3000)
npm run dev    # Iniciar servidor en modo desarrollo con auto-recarga
```

**Flujos de Trabajo Recomendados:**

```bash
# Para desarrollo local
npm run dev

# Para construir y probar producción
npm run build
cd dist && npm install && npm start

# Para preview rápido con Vite
npm run build
npm run preview
```

## 🎨 Personalización

### Configuración de Temas
Personaliza los temas en `src/themes.ts`:

```typescript
export const THEMES = [
    {
        id: 'blue',
        name: 'Blue Ocean',
        colors: {
            primary: '#3B82F6',
            secondary: '#1E40AF',
            accent: '#60A5FA'
        }
    },
    // Añadir más temas...
];
```

### Configuración de Fuentes
Modifica las fuentes disponibles en `src/config/fonts.ts`:

```typescript
export const FONTS = [
    { id: 'Inter', name: 'Inter', class: 'font-inter' },
    { id: 'Roboto', name: 'Roboto', class: 'font-roboto' },
    // Añadir más fuentes...
];
```

### Componentes Personalizados

**Componentes integrados disponibles:**

1. **Admonitions**: Cajas de notas, advertencias, tips
   ```markdown
   :::note Título
   Contenido de la nota
   :::
   
   :::warning
   Contenido de advertencia
   :::
   
   :::tip
   Contenido del tip
   :::
   ```

2. **Cards**: Tarjetas informativas
   ```markdown
   :::card Título de la tarjeta
   Contenido de la tarjeta
   :::
   ```

3. **Accordion**: Contenido colapsable
   ```markdown
   :::accordion Título del acordeón
   Contenido colapsable
   :::
   ```

4. **Tabs**: Pestañas de contenido
   ```markdown
   :::tabs
   :::tab Pestaña 1
   Contenido de la pestaña 1
   :::
   :::tab Pestaña 2
   Contenido de la pestaña 2
   :::
   :::
   ```

5. **Timeline**: Líneas de tiempo
   ```markdown
   :::timeline
   :::event 2024
   Evento del 2024
   :::
   :::event 2025
   Evento del 2025
   :::
   :::
   ```

6. **Charts**: Gráficos interactivos (Chart.js)
   ```markdown
   :::chart
   {
     "type": "bar",
     "data": {
       "labels": ["Ene", "Feb", "Mar"],
       "datasets": [{
         "label": "Ventas",
         "data": [12, 19, 3]
       }]
     }
   }
   :::
   ```

7. **Image Gallery**: Galerías de imágenes
   ```markdown
   :::gallery
   ![Imagen 1](/assets/img1.jpg)
   ![Imagen 2](/assets/img2.jpg)
   :::
   ```

8. **API Explorer**: Prueba de endpoints
   ```markdown
   :::api-explorer
   {
     "endpoint": "/api/users",
     "method": "GET"
   }
   :::
   ```

**Para crear componentes personalizados:**
1. Crear componente en `src/components/`
2. Registrarlo en el procesador de Markdown
3. Usar en archivos `.md` con sintaxis especial



## 🚀 Despliegue

### GitHub Pages (Automático)
1. **Configurar repositorio**:
   - Crear repositorio en GitHub
   - Actualizar `deploy.config.js` con el nombre del repositorio

2. **Habilitar GitHub Pages**:
   - Ir a Settings → Pages
   - Seleccionar "GitHub Actions" como fuente

3. **Despliegue automático**:
   - Push a `main` activa el workflow
   - La aplicación se despliega automáticamente

### Netlify
```bash
# Construir para producción
npm run build

# Subir carpeta dist/ a Netlify
# O conectar repositorio para despliegue automático
```

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Servidor Propio
```bash
# Construir aplicación
npm run build

# Servir archivos estáticos desde dist/
# Usar nginx, Apache, o cualquier servidor web
```

## 🔧 Desarrollo Avanzado

### Estructura de Contextos
- **ThemeContext**: Gestión de temas y modo oscuro/claro
- **NavContext**: Navegación y estructura de documentos
- **I18nContext**: Internacionalización
- **VersionContext**: Gestión de versiones
- **GeminiContext**: Integración con IA

### Hooks Personalizados
- **useDarkMode**: Gestión del modo oscuro
- **useFont**: Gestión de fuentes
- **usePrismTheme**: Temas de syntax highlighting

### Servicios
- **searchService**: Motor de búsqueda con Lunr.js

### Sistema de Búsqueda

La aplicación incluye un sistema de búsqueda completo que indexa todo el contenido de la documentación:

**Características:**
- **Búsqueda en tiempo real**: Resultados mientras escribes
- **Indexación completa**: Busca en títulos, contenido y metadatos
- **Resaltado de términos**: Muestra fragmentos relevantes
- **Búsqueda fuzzy**: Encuentra resultados similares
- **Filtros por versión**: Busca solo en la versión actual

**Cómo funciona:**
1. Se ejecuta automáticamente al cargar la aplicación
2. Indexa todos los archivos Markdown procesados
3. Actualiza el índice cuando cambia el contenido
4. Utiliza Lunr.js para búsqueda cliente rápida

**Uso:**
- Acceder mediante el icono de búsqueda en la barra superior
- Atajo de teclado: `Ctrl/Cmd + K`
- Navegar resultados con flechas del teclado
- Presionar Enter para ir al resultado seleccionado

### Optimizaciones de Rendimiento
- **Code Splitting**: Componentes cargados bajo demanda
- **Lazy Loading**: Imágenes y componentes pesados
- **Bundle Analysis**: Optimización de tamaño

## 🧪 Testing y Calidad

### Scripts de Calidad
```bash
# Linting (si está configurado)
npm run lint

# Type checking
npx tsc --noEmit

# Análisis de bundle
npm run build && npx vite-bundle-analyzer
```

### Mejores Prácticas
- **TypeScript**: Tipado estricto en toda la aplicación
- **Error Boundaries**: Manejo de errores en componentes
- **Accessibility**: Cumplimiento de estándares WCAG
- **Performance**: Optimización de Core Web Vitals

## 🎯 Características Destacadas

### Sistema de Componentes
- **Admonitions**: Notas, advertencias, tips
- **Cards**: Tarjetas informativas
- **Accordion**: Contenido colapsable
- **Timeline**: Líneas de tiempo interactivas
- **Charts**: Gráficos y visualizaciones
- **Image Gallery**: Galerías con lightbox

### Herramientas IA (Gemini)
- **Chat**: Asistente conversacional
- **Summarizer**: Resúmenes automáticos
- **Quiz Generator**: Generación de cuestionarios
- **Code Analyzer**: Análisis de código
- **Simplifier**: Simplificación de contenido

## 🔧 Desarrollo

### Agregar Nuevo Contenido
1. Crear archivos Markdown en `public/docs/` siguiendo la estructura de versiones/idiomas:
   - `public/docs/v2.0/es/tu-archivo.md`
   - `public/docs/v2.0/en/your-file.md`
   - `public/docs/index.md` (página principal)
2. Añadir frontmatter válido al archivo:
   ```yaml
   ---
   title: "Título de tu página"
   position: 1
   ---
   ```
3. Ejecutar `npm run update-manifest` para actualizar el manifiesto de archivos
4. El contenido aparecerá automáticamente en la navegación

### Personalizar Componentes
- Los componentes están en `src/components/`
- Usar TypeScript para type safety
- Seguir las convenciones de Tailwind CSS

### Temas y Estilos
- Configurar temas en `src/themes.ts`
- Personalizar Prism themes en `src/config/prism-themes.ts`
- Estilos globales en `src/styles/main.css`

## 🤝 Contribución

### Proceso de Contribución
1. **Fork** el proyecto
2. **Crear rama** para tu feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Desarrollar** siguiendo las convenciones del proyecto
4. **Commit** con mensajes descriptivos:
   ```bash
   git commit -m "feat: añadir componente de gráficos interactivos"
   ```
5. **Push** a tu fork:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
6. **Crear Pull Request** con descripción detallada

### Convenciones de Código
- **Componentes**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useMyHook.ts`)
- **Utilidades**: camelCase (`myUtility.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`MY_CONSTANT`)

## 🔧 Solución de Problemas

### Problemas Comunes

**1. La navegación no muestra mi nuevo archivo:**
- Ejecutar `npm run update-manifest` para regenerar el manifiesto
- Verificar que el archivo tenga frontmatter válido
- Comprobar que no tenga `hidden: true`
- Asegurarse de que el archivo esté en la carpeta correcta (`public/docs/`)

**2. Los cambios no se reflejan en desarrollo:**
- Reiniciar el servidor de desarrollo
- Verificar que el archivo esté en la carpeta correcta
- Comprobar la sintaxis del Markdown

**3. La búsqueda no encuentra resultados:**
- Recargar la página para reindexar
- Verificar que el contenido esté en archivos Markdown procesados
- Comprobar que el archivo no esté excluido del manifiesto

**4. Problemas con componentes interactivos:**
- Verificar la sintaxis de los componentes personalizados
- Comprobar que los datos JSON estén bien formateados
- Revisar la consola del navegador para errores

**5. La IA no funciona:**
- Verificar que se haya configurado la API key de Gemini
- Comprobar la conexión a internet
- Revisar los límites de uso de la API

**Errores de Frontmatter:**
- Solo se procesan los campos documentados (`title`, `author`, `date`, `position`, `folder_position`, `hide_title`, `hidden`, `version`, `language`)
- Los campos `description` y `category` NO se procesan
- Usar comillas para valores con espacios
- Mantener la indentación correcta en YAML

## 📚 Recursos y Documentación

### Enlaces Útiles
- **[React Documentation](https://reactjs.org/docs/)**: Documentación oficial de React
- **[Vite Guide](https://vitejs.dev/guide/)**: Guía de Vite
- **[Tailwind CSS](https://tailwindcss.com/docs)**: Documentación de Tailwind
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**: Manual de TypeScript
- **[Google Gemini API](https://ai.google.dev/)**: Documentación de la API de Gemini

### Comunidad
- **GitHub Issues**: Reportar bugs y solicitar features
- **Discussions**: Preguntas y discusiones generales
- **Wiki**: Documentación adicional y tutoriales

## 📄 Licencia

Este proyecto está bajo la **Licencia ISC**. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

### Tecnologías Principales
- **[React](https://reactjs.org/)**: Biblioteca de UI
- **[Vite](https://vitejs.dev/)**: Build tool y dev server
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS

### Librerías Especializadas
- **[Mermaid](https://mermaid-js.github.io/)**: Diagramas y gráficos
- **[Prism.js](https://prismjs.com/)**: Syntax highlighting
- **[KaTeX](https://katex.org/)**: Renderizado de matemáticas
- **[Chart.js](https://www.chartjs.org/)**: Gráficos interactivos
- **[Lunr.js](https://lunrjs.com/)**: Motor de búsqueda cliente

### Servicios de IA
- **[Google Gemini](https://ai.google.dev/)**: Integración de IA generativa

### Integración con IA (Google Gemini)

La aplicación incluye integración completa con Google Gemini para funciones avanzadas:

**Funciones disponibles:**

1. **Chat Inteligente**: Conversaciones contextuales sobre el contenido
   - Acceso desde el panel lateral derecho
   - Respuestas basadas en el contenido actual
   - Historial de conversaciones

2. **Generación de Cuestionarios**: Evaluaciones automáticas
   - Genera preguntas basadas en el contenido actual
   - Múltiple choice y preguntas abiertas
   - Retroalimentación instantánea

3. **Generación de Podcasts**: Conversión de texto a audio
   - Voz natural con múltiples voces disponibles
   - Ajuste de velocidad y tono
   - Descarga de audio generado

4. **Simplificación de Contenido**: Explicaciones adaptadas
   - Adapta el contenido al nivel del usuario
   - Explicaciones paso a paso
   - Ejemplos adicionales

5. **Análisis de Código**: Explicación de fragmentos
   - Análisis de código en cualquier lenguaje
   - Explicaciones detalladas
   - Ejemplos de uso

6. **Generación de Glosarios**: Términos técnicos
   - Identifica términos técnicos automáticamente
   - Proporciona definiciones claras
   - Enlaces a recursos adicionales

**Configuración:**
- Requiere API key de Google Gemini (obtenible desde [Google AI Studio](https://makersuite.google.com/app/apikey))
- Se configura desde la interfaz de configuración de la aplicación
- Sin API key, las funciones de IA no están disponibles

---

**FusionDoc** - Creando documentación del futuro, hoy. 🚀