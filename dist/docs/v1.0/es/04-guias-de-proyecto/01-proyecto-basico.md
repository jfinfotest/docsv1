---
title: "Guía: Proyecto Básico"
position: 1
---

# Guía: Proyecto Básico

Ideal para documentación simple que no necesita versiones ni idiomas.

### 1. `config.json`
Para proyectos básicos, simplemente no configures múltiples idiomas o versiones.
```typescript
export const I18N_CONFIG = { 
    defaultLang: 'es',
    languages: [] 
};
export const VERSION_CONFIG = { 
    versions: [] 
};
```

### 2. Estructura de Carpetas
```bash
docs/
├── file-manifest.json
├── index.md
└── guia.md
```

### 3. `file-manifest.json`
```json
{
  "files": [
    "index.md",
    "guia.md"
  ]
}
```
