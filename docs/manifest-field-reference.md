# Chrome Extension Manifest Field Reference

Quick reference for the most commonly used manifest fields in V2 and V3.

## Required Fields (Both V2 and V3)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `manifest_version` | number | Manifest format version (2 or 3) | `3` |
| `name` | string | Extension name (max 45 chars) | `"My Extension"` |
| `version` | string | Version string (1-4 dot-separated integers) | `"1.0.0"` |

## Common Optional Fields

| Field | Type | Description | Max Length |
|-------|------|-------------|------------|
| `description` | string | Extension description | 132 chars |
| `icons` | object | Extension icons (16, 48, 128, 256) | - |
| `default_locale` | string | Default locale subdirectory | - |
| `short_name` | string | Short name for limited space | 12 chars |
| `homepage_url` | string | Extension homepage URL | - |

## Action/Browser Action

### Manifest V2
```json
{
  "browser_action": {
    "default_title": "Tooltip text",
    "default_popup": "popup.html",
    "default_icon": {
      "19": "icon19.png",
      "38": "icon38.png"
    }
  }
}
```

### Manifest V3
```json
{
  "action": {
    "default_title": "Tooltip text",
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "24": "icon24.png",
      "32": "icon32.png"
    }
  }
}
```

## Background Scripts

### Manifest V2
```json
{
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  }
}
```

### Manifest V3
```json
{
  "background": {
    "service_worker": "background.js",
    "type": "module"
  }
}
```

## Permissions

### Manifest V2
```json
{
  "permissions": [
    "storage",
    "tabs",
    "https://*.example.com/*"
  ]
}
```

### Manifest V3
```json
{
  "permissions": [
    "storage",
    "tabs"
  ],
  "host_permissions": [
    "https://*.example.com/*"
  ]
}
```

## Content Scripts

```json
{
  "content_scripts": [{
    "matches": ["https://*.example.com/*"],
    "js": ["content.js"],
    "css": ["content.css"],
    "run_at": "document_idle",
    "all_frames": false
  }]
}
```

### Run At Options
- `document_start` - Before any DOM is constructed
- `document_end` - After DOM is complete, before images/subframes load
- `document_idle` - After `document_end` (default)

## Web Accessible Resources

### Manifest V2
```json
{
  "web_accessible_resources": [
    "images/*",
    "styles/*.css"
  ]
}
```

### Manifest V3
```json
{
  "web_accessible_resources": [{
    "resources": ["images/*", "styles/*.css"],
    "matches": ["https://*.example.com/*"],
    "extension_ids": ["extension-id-here"]
  }]
}
```

## Content Security Policy

### Manifest V2
```json
{
  "content_security_policy": "script-src 'self'; object-src 'self'"
}
```

### Manifest V3
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'",
    "sandbox": "sandbox allow-scripts allow-forms"
  }
}
```

## Commands (Keyboard Shortcuts)

```json
{
  "commands": {
    "toggle-feature": {
      "suggested_key": {
        "default": "Ctrl+Shift+Y",
        "mac": "Command+Shift+Y"
      },
      "description": "Toggle the feature"
    },
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+U"
      }
    }
  }
}
```

## Options Page

### Manifest V2
```json
{
  "options_page": "options.html"
}
```

### Manifest V3 (Recommended)
```json
{
  "options_ui": {
    "page": "options.html",
    "open_in_tab": false
  }
}
```

## Common Permissions

### API Permissions
- `activeTab` - Access to active tab when user invokes extension
- `alarms` - Schedule code to run periodically
- `bookmarks` - Read/modify bookmarks
- `contextMenus` - Add items to context menu
- `cookies` - Access cookies
- `downloads` - Programmatically download files
- `history` - Access browsing history
- `notifications` - Display notifications
- `storage` - Store/retrieve data
- `tabs` - Access tab information
- `webNavigation` - Receive notifications about navigation
- `webRequest` - Observe/analyze/block traffic

### Host Permissions (V3)
- `<all_urls>` - All URLs
- `https://*/*` - All HTTPS URLs
- `https://*.example.com/*` - Specific domain
- `https://example.com/*` - Exact domain

## Match Patterns

Format: `<scheme>://<host><path>`

Examples:
- `https://*/*` - All HTTPS URLs
- `https://example.com/*` - All pages on example.com
- `https://*.example.com/*` - All subdomains of example.com
- `<all_urls>` - All URLs (http, https, file, ftp)
- `file:///*` - Local files

## Version String Format

Valid formats:
- `1` - Single integer
- `1.0` - Two integers
- `1.0.0` - Three integers
- `1.0.0.0` - Four integers

Each integer: 0-65535

Examples:
- ✅ `1.0.0`
- ✅ `2.5.1`
- ✅ `1.0.0.1234`
- ❌ `1.0.0.0.0` (too many parts)
- ❌ `1.0.a` (not a number)
- ❌ `1.0.100000` (too large)

## Migration Checklist (V2 → V3)

- [ ] Change `manifest_version` from 2 to 3
- [ ] Replace `browser_action`/`page_action` with `action`
- [ ] Update `background` to use `service_worker`
- [ ] Move host permissions from `permissions` to `host_permissions`
- [ ] Update `web_accessible_resources` to object format
- [ ] Update `content_security_policy` to object format
- [ ] Remove `persistent: false` from background (not needed)
- [ ] Update icon sizes in action (16, 24, 32 instead of 19, 38)
- [ ] Test all functionality with service worker limitations

## References

- [Official Manifest Documentation](https://developer.chrome.com/docs/extensions/mv3/manifest/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [Permissions Reference](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)
- [Match Patterns](https://developer.chrome.com/docs/extensions/mv3/match_patterns/)
