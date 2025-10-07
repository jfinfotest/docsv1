---
title: "Setup and Configuration - FusionDoc v2.0"
description: "Complete guide to configuring your FusionDoc documentation site using config.json"
position: 1
category: "getting-started"
version: "v2.0"
language: "en"
---

# 1. Setup and Configuration

All configuration for your documentation site is centralized in the `config.json` file located in the `/public` directory. This approach allows you to easily customize every aspect without touching the application code.

## I18n & Versioning

These sections configure internationalization and documentation versioning. Both features are always enabled and will automatically show switchers when multiple languages or versions are configured.

```typescript
export const I18N_CONFIG = {
    defaultLang: 'en',
    languages: [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' },
    ],
};

export const VERSION_CONFIG = {
    defaultVersion: 'v2.0',
    versions: ['v2.0', 'v1.0'],
};
```

- The language switcher will appear automatically when multiple languages are configured.
- The version switcher will appear automatically when multiple versions are configured.
- For this to work, your files must be in a folder structure like `docs/{version}/{lang}/...`. See the [i18n and Versioning guide](./04-i18n-and-versioning.md) for details.
- **Note**: In addition to translating your content, you can translate the application's UI (buttons, labels, etc.) in the `uiText` object within `config.json`.

## General App Configuration (`APP_CONFIG`)

Here you define your site's identity.

```typescript
export const APP_CONFIG = {
    title: 'FusionDoc',
    subtitle: 'Next-Gen Documentation',
    icon: '/assets/logo.png',
};
```

- `title`: The name that appears in the main header.
- `subtitle`: An optional subtitle that appears below the main title.
- `icon`: Path to your app's logo. This can be an absolute path from the project root (e.g., `/assets/logo.svg`) or a full URL.

## Documentation Source (`DOCS_CONFIG`)

Defines where the documentation files are fetched from.

```typescript
export const DOCS_CONFIG = {
    source: 'local', // Only 'local' is supported
};
```

- `source`:
    - `'local'`: Loads files from a public `docs` folder. Requires a `file-manifest.json`. See the [Automating Updates guide](./05-automating-updates.md) to simplify this process.

## Appearance & Theme (`THEME_CONFIG` & `FONTS`)

Customize the visual appearance.

```typescript
export const THEME_CONFIG = {
    defaultTheme: 'dark', // 'light' or 'dark'
    defaultAppTheme: 'blue', // ID of one of the themes in themes.ts
    defaultFont: 'Inter', // ID of one of the fonts in FONTS
};
```

- `defaultTheme`: The default dark or light mode.
- `defaultAppTheme`: The main color palette (blue, green, etc.).
- `defaultFont`: The font for the entire site.

## UI Components

Configure specific interface elements.

### `HEADER_LINKS`
Social media links in the header.

```typescript
export const HEADER_LINKS = [
    // { icon: 'GitHub', url: '#', label: 'GitHub' }, // GitHub icon removed - add your own social links
    { icon: 'Twitter', url: '#', label: 'Twitter' },
];
```

### `SIDEBAR_BUSINESS_INFO_CONFIG`
A branding section at the bottom of the sidebar.

```typescript
export const SIDEBAR_BUSINESS_INFO_CONFIG = {
    enabled: true,
    logo: '/assets/company-logo.svg',
    title: 'Powered by Us',
    link: '#',
    footerText: '© {year} Our Company. All rights reserved.',
};
```
- `{year}` is dynamically replaced.

### `FOOTER_CONFIG`
The global fixed footer at the bottom.

```typescript
export const FOOTER_CONFIG = {
    enabled: true,
    text: '© {year} My Company. Built with love.',
};
```

### `EDIT_PAGE_BUTTON_CONFIG`
The edit page button is disabled when using local documentation source.

```typescript
export const EDIT_PAGE_BUTTON_CONFIG = {
    enabled: false,
};
```

### `ANNOUNCEMENT_BANNER_CONFIG`
A dismissible announcement banner at the top of the page.

```typescript
export const ANNOUNCEMENT_BANNER_CONFIG = {
    enabled: false,
    id: 'v2.0-release', // Unique ID for localStorage
    content: '🚀 **The new version is here!** Check out the new features.',
    link: {
        text: 'Learn More',
        href: '/tutorial/getting-started/01-setup-and-config',
    },
};
```

## Maintenance Mode (`MAINTENANCE_MODE_CONFIG`)

Replaces the entire site with a maintenance page.

```typescript
export const MAINTENANCE_MODE_CONFIG = {
    enabled: false,
    message: "We're currently performing scheduled maintenance. The site will be back online shortly.",
};
```
