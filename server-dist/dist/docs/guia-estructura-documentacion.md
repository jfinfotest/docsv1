---
title: "Guía de Estructura de Documentación"
description: "Guía completa para organizar y estructurar documentación en FusionDoc"
date: "2024-01-15"
position: 2
version: "all"
language: "es"
---

# Guía de Estructura de Documentación

Esta guía explica cómo organizar tus archivos de documentación, configurar el frontmatter y configurar archivos estructurales para FusionDoc.

## Estructura de Carpetas

FusionDoc utiliza una estructura de carpetas jerárquica que soporta versionado e internacionalización:

```
public/docs/
├── index.md                    # Página principal de documentación raíz
├── referencia-componentes.md   # Referencia global de componentes
├── file-manifest.json          # Índice de archivos generado automáticamente
├── config.json                 # Archivo de configuración principal
├── v1.0/                       # Versión 1.0
│   ├── en/                     # Contenido en inglés
│   │   ├── index.md            # Página principal de versión
│   │   ├── 01-fundamentos/   # Carpeta de capítulo
│   │   │   ├── index.md        # Página principal de capítulo
│   │   │   ├── 01-configuración-básica.md
│   │   │   └── 02-escritura-de-contenido.md
│   │   └── 02-componentes/
│   └── es/                     # Contenido en español
│       ├── index.md
│       └── 01-fundamentos/
└── v2.0/                       # Versión 2.0
    ├── en/
    └── es/
```

### Principios Clave

1. **Carpetas de Versión**: Cada versión tiene su propia carpeta (ej., `v1.0/`, `v2.0/`)
2. **Carpetas de Idioma**: Cada idioma tiene su propia carpeta dentro de la versión (ej., `en/`, `es/`)
3. **Organización de Capítulos**: Usa carpetas numeradas para capítulos (ej., `01-fundamentos/`)
4. **Nomenclatura de Archivos**: Usa archivos numerados dentro de los capítulos (ej., `01-configuración-básica.md`)

## Configuración de Frontmatter

Cada archivo Markdown puede contener frontmatter YAML al principio del archivo para controlar sus metadatos y comportamiento:

```yaml
---
title: "Título de la Página"
position: 1
folder_position: 1
date: "2024-01-01"
author: "Juan Pérez"
hide_title: false
hidden: false
---
```

### Campos Disponibles

| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `title` | string | Sí | Título de la página mostrado en navegación y como encabezado principal |
| `position` | number | No | Posición numérica para ordenar páginas dentro de una sección (orden ascendente) |
| `folder_position` | number | No | Posición numérica para ordenar páginas índice de carpetas en la navegación principal |
| `date` | string | No | Fecha de publicación en formato YYYY-MM-DD. Las fechas futuras ocultan la página hasta que se alcancen |
| `author` | string | No | Nombre del autor mostrado debajo del título de la página |
| `hide_title` | boolean | No | Si es true, oculta el título H1 automático (útil para páginas con secciones hero) |
| `hidden` | boolean | No | Si es true, oculta la página de la navegación y resultados de búsqueda |

### Ejemplos de Frontmatter

#### Página Regular
```yaml
---
title: "Guía de Instalación"
position: 1
---
```

#### Página Índice de Carpeta
```yaml
---
title: "Sección de Tutorial"
folder_position: 1
---
```

#### Artículo de Blog con Fecha
```yaml
---
title: "Anuncio de Nuevas Características"
date: "2024-01-15"
author: "Juan Pérez"
---
```

#### Página de Borrador Oculta
```yaml
---
title: "Trabajo en Progreso"
hidden: true
---
```

#### Página con Título Oculto
```yaml
---
title: "Página de Inicio"
hide_title: true
---
```

## Archivos de Configuración

### 1. config.json

El archivo de configuración principal ubicado en `public/config.json` (no en el repositorio):

```json
{
  "app": {
    "title": "FusionDoc",
    "subtitle": "Documentación de Próxima Generación",
    "icon": "/assets/logo.png"
  },
  "docs": {
    "source": "local"
  },
  "theme": {
    "defaultTheme": "dark",
    "defaultAppTheme": "blue",
    "defaultFont": "Inter"
  },
  "header": {
    "links": [
      {
        "icon": "Twitter",
        "url": "#",
        "label": "Twitter"
      }
    ]
  },
  "i18n": {
    "defaultLang": "es",
    "languages": [
      { "code": "es", "name": "Español" },
      { "code": "en", "name": "English" }
    ]
  },
  "version": {
    "defaultVersion": "v2.0",
    "versions": ["v2.0", "v1.0"]
  }
}
```

### 2. file-manifest.json

Archivo generado automáticamente que indexa todos los archivos de documentación:

```json
{
  "files": [
    "index.md",
    "referencia-componentes.md",
    "v1.0/en/01-fundamentos/01-configuración-básica.md",
    "v1.0/en/01-fundamentos/02-escritura-de-contenido.md",
    "v2.0/en/tutorial/comenzando/01-configuración-y-setup.md"
  ]
}
```

**Nota**: Este archivo se genera automáticamente durante el proceso de construcción. No editar manualmente.

## Generación de Navegación

FusionDoc genera automáticamente la navegación basándose en:

1. **Estructura de Carpetas**: Crea navegación jerárquica
2. **Frontmatter**: Usa `position` y `folder_position` para ordenar
3. **Nombres de Archivos**: Los números en nombres de archivo determinan el orden dentro de carpetas

### Prioridad de Navegación

1. Los archivos con valores `position` más bajos aparecen primero
2. Las páginas índice de carpeta usan `folder_position` para ordenar dentro de su navegación padre
3. Los archivos sin `position` se ordenan alfabéticamente
4. Los archivos `index.md` de carpetas se convierten en encabezados de sección

### Posición vs Posición de Carpeta

- **`position`**: Controla el ordenamiento de páginas regulares dentro de una sección
- **`folder_position`**: Controla el ordenamiento de páginas índice de carpeta en la navegación principal

Por ejemplo, en una sección de tutorial:
- El índice principal del tutorial usaría `folder_position: 1`
- Las páginas individuales del tutorial usarían `position: 1`, `position: 2`, etc.

## Mejores Prácticas

### Organización de Archivos

```
✅ Bueno:
v2.0/es/tutorial/comenzando/01-configuración.md
v2.0/es/tutorial/comenzando/02-configuración.md
v2.0/es/tutorial/avanzado/01-componentes.md

❌ Evitar:
v2.0/es/tutorial/01-comenzando/configuración.md
v2.0/es/tutorial/02-avanzado/componentes.md
```

### Consistencia de Frontmatter

```yaml
✅ Consistente:
---
title: "Configuración y Configuración"
description: "Aprende cómo configurar tu proyecto"
position: 1
---

❌ Inconsistente:
---
title: configuración y configuración
Description: aprender configuración
Position: primero
cat: comenzando
---
```

### Estructura de Contenido

1. **Usa títulos claros**: Haz los títulos descriptivos y consistentes
2. **Posiciona estratégicamente**: Usa `position` para páginas y `folder_position` para índices de sección
3. **Usa folder_position**: Siempre incluye `folder_position` en archivos index.md para ordenamiento apropiado de carpetas
4. **Oculta borradores**: Usa `hidden: true` para contenido en progreso
5. **Oculta títulos cuando sea necesario**: Usa `hide_title: true` para páginas con secciones hero
6. **Manténlo simple**: Solo usa campos que realmente son procesados por la aplicación

## Archivos Especiales

### Archivos index.md

Cada carpeta debe tener un archivo `index.md` que:
- Proporcione una visión general de la sección
- Liste páginas hijas con enlaces
- Use frontmatter consistente

### Referencia de Componentes

El archivo `referencia-componentes.md` en la raíz documenta todos los componentes markdown disponibles y debe mantenerse actualizado a medida que se agregan o actualizan componentes.

## Consejos de Migración

### Agregando una Nueva Versión

1. Crea nueva carpeta de versión: `public/docs/v3.0/`
2. Copia la estructura de idioma existente
3. Actualiza `config.json` para incluir nueva versión
4. Ejecuta el proceso de construcción para actualizar `file-manifest.json`

### Agregando un Nuevo Idioma

1. Crea carpeta de idioma dentro de la versión: `public/docs/v2.0/fr/`
2. Traduce el contenido manteniendo la estructura de archivos
3. Actualiza el arreglo de idiomas en `config.json`
4. Asegúrate de que todos los archivos tengan el frontmatter `language` apropiado

### Reestructurando Contenido

1. Planifica primero la nueva estructura de carpetas
2. Actualiza todos los enlaces internos
3. Mantén URLs existentes con redirecciones si es necesario
4. Prueba la generación de navegación después de los cambios

## Solución de Problemas

### Problemas Comunes

1. **Archivos no aparecen**: Verifica que `file-manifest.json` esté actualizado
2. **Orden de navegación incorrecto**: Verifica los valores de `position` en el frontmatter
3. **Traducciones faltantes**: Asegúrate de que todas las carpetas de idioma tengan archivos coincidentes
4. **Enlaces rotos**: Usa rutas relativas y verifica la existencia de archivos

### Validación

Siempre valida:
- ✅ Sintaxis de frontmatter (formato YAML)
- ✅ Rutas de archivos en `file-manifest.json`
- ✅ Sintaxis JSON en `config.json`
- ✅ Estructura de carpetas consistente entre versiones/idiomas