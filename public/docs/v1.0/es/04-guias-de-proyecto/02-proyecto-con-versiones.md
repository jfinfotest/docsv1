---
title: "Guía: Proyecto con Versiones"
position: 2
---

# Guía: Proyecto con Versiones

Para cuando necesitas documentar múltiples versiones de tu producto.

### 1. `config.json`
Configura múltiples versiones. El selector de versión aparecerá automáticamente.
```typescript
export const I18N_CONFIG = { 
    defaultLang: 'es',
    languages: [] 
};
export const VERSION_CONFIG = {
    defaultVersion: 'v1.0',
    versions: ['v1.0', 'v0.9'],
};
```

### 2. Estructura de Carpetas
```bash
docs/
├── file-manifest.json
├── v0.9/
│   └── index.md
└── v1.0/
    └── index.md
```

### 3. `file-manifest.json`
```json
{
  "files": [
    "v0.9/index.md",
    "v1.0/index.md"
  ]
}
```
