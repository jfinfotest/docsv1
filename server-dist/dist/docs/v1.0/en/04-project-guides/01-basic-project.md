---
title: "Guide: Basic Project"
position: 1
---

# Guide: Basic Project

Ideal for simple documentation that needs neither versions nor languages.

### 1. `config.json`
For basic projects, simply don't configure multiple languages or versions.
```typescript
export const I18N_CONFIG = { 
    defaultLang: 'en',
    languages: [] 
};
export const VERSION_CONFIG = { 
    versions: [] 
};
```

### 2. Folder Structure
```bash
docs/
├── file-manifest.json
├── index.md
└── guide.md
```

### 3. `file-manifest.json`
```json
{
  "files": [
    "index.md",
    "guide.md"
  ]
}
```
