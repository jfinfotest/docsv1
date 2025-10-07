---
title: "Guía Completa de Configuración"
position: 1
---

# Guía Completa de Configuración

FusionDoc utiliza un archivo centralizado `config.json` ubicado en el directorio `/public` para gestionar todas las configuraciones de la aplicación. Esta guía cubre todas las opciones de configuración disponibles.

## Configuración de la Aplicación (`app`)

Define la identidad básica y la marca de tu sitio.

```json
{
  "app": {
    "title": "FusionDocJFa",
    "subtitle": "Next-Gen Documentation - CI External Modules Test",
    "icon": "/assets/logo.png"
  }
}
```

### Propiedades:
- **`title`** (string): El título principal mostrado en el encabezado y la pestaña del navegador
- **`subtitle`** (string): Subtítulo opcional mostrado debajo del título principal
- **`icon`** (string): Ruta al logo de tu sitio (relativa a `/public` o URL absoluta)

## Fuente de Documentación (`docs`)

Configura de dónde proviene el contenido de tu documentación.

```json
{
  "docs": {
    "source": "local"
  }
}
```

### Propiedades:
- **`source`** (string): Tipo de fuente para la documentación
  - `"local"`: Los archivos de documentación se almacenan localmente en `/public/docs`

**Nota**: Actualmente, solo se admite la fuente de documentación local.

## Configuración del Tema (`theme`)

Controla la apariencia visual y la configuración predeterminada del tema.

```json
{
  "theme": {
    "defaultTheme": "dark",
    "defaultAppTheme": "blue",
    "defaultFont": "Inter"
  }
}
```

### Propiedades:
- **`defaultTheme`** (string): Esquema de colores predeterminado
  - `"light"`: Modo claro
  - `"dark"`: Modo oscuro
- **`defaultAppTheme`** (string): Tema de color principal
  - Opciones disponibles: `"blue"`, `"green"`, `"purple"`, `"red"`, `"orange"`, `"pink"`
- **`defaultFont`** (string): Familia de fuente predeterminada
  - Opciones disponibles: `"Inter"`, `"Roboto"`, `"Source Sans Pro"`, `"Open Sans"`

## Configuración del Encabezado (`header`)

Personaliza la navegación y apariencia del encabezado.

```json
{
  "header": {
    "links": [
      // {
      //   "icon": "GitHub",
      //   "label": "GitHub",
      //   "url": "https://github.com/"
      // },
      {
        "icon": "Twitter",
        "label": "Twitter",
        "url": "https://twitter.com/"
      }
    ],
    "background": {
      "enabled": false,
      "image": "",
      "opacity": 1,
      "overlay": true,
      "overlayColor": "rgba(0, 0, 0, 0.1)"
    }
  }
}
```

### Propiedades:
- **`links`** (array): Enlaces de navegación en el encabezado
  - **`icon`** (string): Nombre del icono (GitHub, Twitter, Discord, etc.)
  - **`label`** (string): Texto del enlace
  - **`url`** (string): Destino del enlace
- **`background`** (object): Personalización del fondo del encabezado
  - **`enabled`** (boolean): Habilitar fondo personalizado
  - **`image`** (string): URL de la imagen de fondo
  - **`opacity`** (number): Opacidad del fondo (0-1)
  - **`overlay`** (boolean): Habilitar superposición
  - **`overlayColor`** (string): Color de la superposición (valor de color CSS)

## Navegación Secundaria (`secondaryNav`)

Configura la apariencia de la barra de navegación secundaria.

```json
{
  "secondaryNav": {
    "background": {
      "enabled": false,
      "image": "",
      "opacity": 0.9,
      "overlay": true,
      "overlayColor": "rgba(0, 0, 0, 0.3)"
    }
  }
}
```

### Propiedades:
- **`background`** (object): Misma estructura que la configuración del fondo del encabezado

## Configuración del Pie de Página (`footer`)

Controla la visualización y contenido del pie de página.

```json
{
  "footer": {
    "enabled": true,
    "text": "Copyright © {year} FusionDoc. Todos los derechos reservados."
  }
}
```

### Propiedades:
- **`enabled`** (boolean): Mostrar/ocultar el pie de página
- **`text`** (string): Texto del pie de página (usa el marcador `{year}` para el año actual)

## Botón de Editar Página (`editPageButton`)

Habilita o deshabilita el botón "Editar esta página".

```json
{
  "editPageButton": {
    "enabled": true
  }
}
```

### Propiedades:
- **`enabled`** (boolean): Mostrar/ocultar botones de editar página

## Banner de Anuncios (`announcementBanner`)

Muestra anuncios descartables en la parte superior de tu sitio.

```json
{
  "announcementBanner": {
    "enabled": false,
    "id": "v1-release",
    "content": "🎉 ¡Acabamos de lanzar nuestra nueva función! Échale un vistazo.",
    "link": {
      "href": "/features/new-feature",
      "text": "Saber más"
    }
  }
}
```

### Propiedades:
- **`enabled`** (boolean): Mostrar/ocultar el banner de anuncios
- **`id`** (string): Identificador único para el anuncio (para seguimiento de descarte)
- **`content`** (string): Texto del anuncio (soporta markdown)
- **`link`** (object): Enlace opcional de llamada a la acción
  - **`href`** (string): Destino del enlace
  - **`text`** (string): Texto del enlace

## Información Comercial en la Barra Lateral (`sidebarBusinessInfo`)

Agrega información de marca a la barra lateral.

```json
{
  "sidebarBusinessInfo": {
    "enabled": true,
    "logo": "/assets/company-logo.svg",
    "title": "Desarrollado por FusionDoc",
    "link": "https://tu-sitio-web-de-empresa.com",
    "footerText": "© {year} Tu Empresa Inc."
  }
}
```

### Propiedades:
- **`enabled`** (boolean): Mostrar/ocultar información comercial en la barra lateral
- **`logo`** (string): Ruta al logo de la empresa/marca
- **`title`** (string): Título de la empresa/marca
- **`link`** (string): Enlace al sitio web de la empresa/marca
- **`footerText`** (string): Texto del pie de página (usa el marcador `{year}`)

## Internacionalización (`i18n`)

Configura el soporte multiidioma.

```json
{
  "i18n": {
    "enabled": true,
    "defaultLang": "es",
    "languages": [
      {
        "code": "en",
        "name": "English"
      },
      {
        "code": "es",
        "name": "Español"
      }
    ]
  }
}
```

### Propiedades:
- **`enabled`** (boolean): Habilitar/deshabilitar internacionalización
- **`defaultLang`** (string): Código de idioma predeterminado
- **`languages`** (array): Idiomas disponibles
  - **`code`** (string): Código de idioma (ISO 639-1)
  - **`name`** (string): Nombre de visualización del idioma

## Gestión de Versiones (`version`)

Configura el versionado de la documentación.

```json
{
  "version": {
    "enabled": true,
    "defaultVersion": "v2.0",
    "versions": ["v2.0", "v1.0"]
  }
}
```

### Propiedades:
- **`enabled`** (boolean): Habilitar/deshabilitar cambio de versiones
- **`defaultVersion`** (string): Versión predeterminada a mostrar
- **`versions`** (array): Versiones disponibles (ordenadas por preferencia)

## Modo de Mantenimiento (`maintenanceMode`)

Configura el modo de mantenimiento para tu sitio.

```json
{
  "maintenanceMode": {
    "enabled": false,
    "message": "Actualmente estamos realizando mantenimiento programado. Estaremos de vuelta en línea en breve. ¡Gracias por tu paciencia!"
  }
}
```

### Propiedades:
- **`enabled`** (boolean): Habilitar/deshabilitar modo de mantenimiento
- **`message`** (string): Mensaje a mostrar durante el mantenimiento

## Personalización de Texto de la Interfaz (`uiText`)

Personaliza todo el texto de la interfaz de usuario para diferentes idiomas. La configuración incluye personalización extensa de texto para las configuraciones regionales en inglés (`en`) y español (`es`).

```json
{
  "uiText": {
    "en": {
      "searchPlaceholder": "Search docs...",
      "onThisPage": "On this page",
      "editThisPage": "Edit this page"
    },
    "es": {
      "searchPlaceholder": "Buscar documentos...",
      "onThisPage": "En esta página",
      "editThisPage": "Editar esta página"
    }
  }
}
```

### Categorías Principales de Texto:
- **Navegación**: Búsqueda, paginación, elementos de menú
- **Configuraciones**: Tema, fuente, gestión de claves API
- **Funciones de IA**: Chat, generación de cuestionarios, análisis de código, podcasts
- **Mensajes de Error**: Varios estados de error y mensajes
- **Elementos Interactivos**: Botones, tooltips, modales
- **Componentes de Contenido**: Carrusel, gráficos, líneas de tiempo, etc.

## Mejores Prácticas

### 1. Configuraciones Específicas del Entorno
Considera usar diferentes archivos `config.json` para entornos de desarrollo, staging y producción.

### 2. Rutas de Recursos
Usa rutas relativas que comiencen con `/` para recursos en el directorio `/public`, o URLs absolutas para recursos externos.

### 3. Códigos de Idioma
Usa códigos de idioma estándar ISO 639-1 para consistencia y compatibilidad.

### 4. Nomenclatura de Versiones
Usa versionado semántico (ej., "v1.0", "v2.0") para identificación clara de versiones.

### 5. Modo de Mantenimiento
Prueba el modo de mantenimiento en un entorno de staging antes de habilitarlo en producción.

### 6. Integración con GitHub
La documentación ahora solo se carga desde fuentes locales.
