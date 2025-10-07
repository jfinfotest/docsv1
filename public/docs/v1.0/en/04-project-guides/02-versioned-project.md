---
title: "Guide: Versioned Project"
position: 2
---

# Guide: Versioned Project

For when you need to document multiple versions of your product.

### 1. `config.json`
Configure multiple versions. The version selector will appear automatically.
```typescript
export const I18N_CONFIG = { 
    defaultLang: 'en',
    languages: [] 
};
export const VERSION_CONFIG = {
    defaultVersion: 'v1.0',
    versions: ['v1.0', 'v0.9'],
};
```

### 2. Folder Structure
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
