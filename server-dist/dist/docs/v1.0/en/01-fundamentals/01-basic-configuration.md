---
title: "Complete Configuration Guide - FusionDoc v1.0"
description: "Comprehensive guide to all configuration options in FusionDoc v1.0"
position: 1
category: "fundamentals"
version: "v1.0"
language: "en"
---

# Complete Configuration Guide

FusionDoc uses a centralized `config.json` file located in the `/public` directory to manage all application settings. This guide covers every configuration option available.

## Application Configuration (`app`)

Define your site's basic identity and branding.

```json
{
  "app": {
    "title": "FusionDocJFa",
    "subtitle": "Next-Gen Documentation - CI External Modules Test",
    "icon": "/assets/logo.png"
  }
}
```

### Properties:
- **`title`** (string): The main title displayed in the header and browser tab
- **`subtitle`** (string): Optional subtitle shown below the main title
- **`icon`** (string): Path to your site's logo (relative to `/public` or absolute URL)

## Documentation Source (`docs`)

Configure where your documentation content is sourced from.

```json
{
  "docs": {
    "source": "local"
  }
}
```

### Properties:
- **`source`** (string): Source type for documentation
  - `"local"`: Documentation files are stored locally in `/public/docs`

**Note**: Currently, only local documentation source is supported.

## Theme Configuration (`theme`)

Control the visual appearance and default theme settings.

```json
{
  "theme": {
    "defaultTheme": "dark",
    "defaultAppTheme": "blue",
    "defaultFont": "Inter"
  }
}
```

### Properties:
- **`defaultTheme`** (string): Default color scheme
  - `"light"`: Light mode
  - `"dark"`: Dark mode
- **`defaultAppTheme`** (string): Primary color theme
  - Available options: `"blue"`, `"green"`, `"purple"`, `"red"`, `"orange"`, `"pink"`
- **`defaultFont`** (string): Default font family
  - Available options: `"Inter"`, `"Roboto"`, `"Source Sans Pro"`, `"Open Sans"`

## Header Configuration (`header`)

Customize the header navigation and appearance.

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

### Properties:
- **`links`** (array): Navigation links in the header
  - **`icon`** (string): Icon name (GitHub, Twitter, Discord, etc.)
  - **`label`** (string): Link text
  - **`url`** (string): Link destination
- **`background`** (object): Header background customization
  - **`enabled`** (boolean): Enable custom background
  - **`image`** (string): Background image URL
  - **`opacity`** (number): Background opacity (0-1)
  - **`overlay`** (boolean): Enable overlay
  - **`overlayColor`** (string): Overlay color (CSS color value)

## Secondary Navigation (`secondaryNav`)

Configure the secondary navigation bar appearance.

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

### Properties:
- **`background`** (object): Same structure as header background configuration

## Footer Configuration (`footer`)

Control the footer display and content.

```json
{
  "footer": {
    "enabled": true,
    "text": "Copyright © {year} FusionDoc. All rights reserved."
  }
}
```

### Properties:
- **`enabled`** (boolean): Show/hide the footer
- **`text`** (string): Footer text (use `{year}` placeholder for current year)

## Edit Page Button (`editPageButton`)

Enable or disable the "Edit this page" button.

```json
{
  "editPageButton": {
    "enabled": true
  }
}
```

### Properties:
- **`enabled`** (boolean): Show/hide edit page buttons

## Announcement Banner (`announcementBanner`)

Display dismissible announcements at the top of your site.

```json
{
  "announcementBanner": {
    "enabled": false,
    "id": "v1-release",
    "content": "🎉 We've just launched our new feature! Check it out.",
    "link": {
      "href": "/features/new-feature",
      "text": "Learn more"
    }
  }
}
```

### Properties:
- **`enabled`** (boolean): Show/hide the announcement banner
- **`id`** (string): Unique identifier for the announcement (for dismissal tracking)
- **`content`** (string): Announcement text (supports markdown)
- **`link`** (object): Optional call-to-action link
  - **`href`** (string): Link destination
  - **`text`** (string): Link text

## Sidebar Business Info (`sidebarBusinessInfo`)

Add branding information to the sidebar.

```json
{
  "sidebarBusinessInfo": {
    "enabled": true,
    "logo": "/assets/company-logo.svg",
    "title": "Powered by FusionDoc",
    "link": "https://your-company-website.com",
    "footerText": "© {year} Your Company Inc."
  }
}
```

### Properties:
- **`enabled`** (boolean): Show/hide business info in sidebar
- **`logo`** (string): Path to company/brand logo
- **`title`** (string): Business/brand title
- **`link`** (string): Link to company/brand website
- **`footerText`** (string): Footer text (use `{year}` placeholder)

## Internationalization (`i18n`)

Configure multi-language support.

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

### Properties:
- **`enabled`** (boolean): Enable/disable internationalization
- **`defaultLang`** (string): Default language code
- **`languages`** (array): Available languages
  - **`code`** (string): Language code (ISO 639-1)
  - **`name`** (string): Language display name

## Version Management (`version`)

Configure documentation versioning.

```json
{
  "version": {
    "enabled": true,
    "defaultVersion": "v2.0",
    "versions": ["v2.0", "v1.0"]
  }
}
```

### Properties:
- **`enabled`** (boolean): Enable/disable version switching
- **`defaultVersion`** (string): Default version to display
- **`versions`** (array): Available versions (ordered by preference)

## Maintenance Mode (`maintenanceMode`)

Configure maintenance mode for your site.

```json
{
  "maintenanceMode": {
    "enabled": false,
    "message": "We're currently performing scheduled maintenance. We'll be back online shortly. Thanks for your patience!"
  }
}
```

### Properties:
- **`enabled`** (boolean): Enable/disable maintenance mode
- **`message`** (string): Message to display during maintenance

## UI Text Customization (`uiText`)

Customize all user interface text for different languages. The configuration includes extensive text customization for both English (`en`) and Spanish (`es`) locales.

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

### Key Text Categories:
- **Navigation**: Search, pagination, menu items
- **Settings**: Theme, font, API key management
- **AI Features**: Chat, quiz generation, code analysis, podcasts
- **Error Messages**: Various error states and messages
- **Interactive Elements**: Buttons, tooltips, modals
- **Content Components**: Carousel, charts, timelines, etc.

## Best Practices

### 1. Environment-Specific Configurations
Consider using different `config.json` files for development, staging, and production environments.

### 2. Asset Paths
Use relative paths starting with `/` for assets in the `/public` directory, or absolute URLs for external resources.

### 3. Language Codes
Use standard ISO 639-1 language codes for consistency and compatibility.

### 4. Version Naming
Use semantic versioning (e.g., "v1.0", "v2.0") for clear version identification.

### 5. Maintenance Mode
Test maintenance mode in a staging environment before enabling in production.

### 6. GitHub Integration
Documentation now only loads from local sources.
