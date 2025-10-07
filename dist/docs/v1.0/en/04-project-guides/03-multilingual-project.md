---
title: "Guide: Multilingual Project"
position: 3
---

# Guide: Multilingual Project

For documentation that needs to be available in multiple languages.

### 1. `config.json`
Configure multiple languages. The language selector will appear automatically.
```typescript
export const I18N_CONFIG = {
    defaultLang: 'en',
    languages: [{ code: 'es', name: 'Español' }, { code: 'en', name: 'English' }],
};
export const VERSION_CONFIG = { versions: [] };
```

### 2. Folder Structure
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
