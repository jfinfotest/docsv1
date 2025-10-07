---
title: "Guía: Proyecto Multilingüe"
position: 3
---

# Guía: Proyecto Multilingüe

Para documentación que necesita estar disponible en múltiples idiomas.

### 1. `config.json`
Configura múltiples idiomas. El selector de idioma aparecerá automáticamente.
```typescript
export const I18N_CONFIG = {
    defaultLang: 'en',
    languages: [{ code: 'es', name: 'Español' }, { code: 'en', name: 'English' }],
};
export const VERSION_CONFIG = { versions: [] };
```

### 2. Estructura de Carpetas
```bash
docs/
├── file-manifest.json
├── es/
│   └── index.md
└── en/
    └── index.md
```

### 3. `file-manifest.json`
```json
{
  "files": [
    "es/index.md",
    "en/index.md"
  ]
}
```
