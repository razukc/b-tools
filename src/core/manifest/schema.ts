/**
 * Zod schemas for Chrome Extension Manifest V3 validation
 */

import { z } from 'zod';

/**
 * Version string validation (1-4 dot-separated integers, each 0-65535)
 * Examples: "1.0", "1.0.0", "1.0.0.0"
 */
const versionSchema = z
  .string()
  .regex(
    /^(\d+)(\.\d+){0,3}$/,
    'Version must be 1-4 dot-separated integers'
  )
  .refine(
    (version) => {
      const parts = version.split('.');
      return (
        parts.length >= 1 &&
        parts.length <= 4 &&
        parts.every((part) => {
          const num = parseInt(part, 10);
          return num >= 0 && num <= 65535;
        })
      );
    },
    {
      message: 'Each version number must be between 0 and 65535',
    }
  );

/**
 * Match pattern validation for content scripts and host permissions
 * Format: <scheme>://<host><path>
 * Examples: "https://*.google.com/*", "http://example.com/path/*", "<all_urls>"
 */
const matchPatternSchema = z
  .string()
  .refine(
    (pattern) => {
      // Special case for <all_urls>
      if (pattern === '<all_urls>') {
        return true;
      }
      // file:/// pattern (special case with empty host)
      if (/^file:\/\/\/.*$/.test(pattern)) {
        return true;
      }
      // Standard match pattern format
      return /^(\*|https?|file|ftp):\/\/(\*|(?:\*\.)?[^/*]+|\[[\da-fA-F:]+\])(\/.*)?$/.test(pattern);
    },
    {
      message: 'Invalid match pattern format',
    }
  );

/**
 * Icon configuration schema
 */
const iconSchema = z.record(z.string(), z.string()).refine(
  (icons) => {
    const validSizes = ['16', '48', '128', '256'];
    return Object.keys(icons).every((size) => validSizes.includes(size));
  },
  {
    message: 'Icon sizes must be 16, 48, 128, or 256',
  }
);

/**
 * Action (browser action) schema for Manifest V3
 */
const actionSchema = z.object({
  default_popup: z.string().optional(),
  default_icon: z.union([z.string(), iconSchema]).optional(),
  default_title: z.string().optional(),
});

/**
 * Background service worker schema for Manifest V3
 */
const backgroundSchema = z.object({
  service_worker: z.string(),
  type: z.enum(['module', 'classic']).optional(),
});

/**
 * Content script schema
 */
const contentScriptSchema = z.object({
  matches: z.array(matchPatternSchema).min(1, 'At least one match pattern required'),
  js: z.array(z.string()).optional(),
  css: z.array(z.string()).optional(),
  run_at: z.enum(['document_start', 'document_end', 'document_idle']).optional(),
  all_frames: z.boolean().optional(),
  match_about_blank: z.boolean().optional(),
});

/**
 * Web accessible resources schema for Manifest V3
 */
const webAccessibleResourcesSchema = z.object({
  resources: z.array(z.string()),
  matches: z.array(matchPatternSchema),
  use_dynamic_url: z.boolean().optional(),
});

/**
 * Official Chrome extension permissions list
 */
const CHROME_PERMISSIONS = [
  'activeTab',
  'alarms',
  'background',
  'bookmarks',
  'browsingData',
  'certificateProvider',
  'clipboardRead',
  'clipboardWrite',
  'contentSettings',
  'contextMenus',
  'cookies',
  'debugger',
  'declarativeContent',
  'declarativeNetRequest',
  'declarativeNetRequestFeedback',
  'declarativeNetRequestWithHostAccess',
  'declarativeWebRequest',
  'desktopCapture',
  'documentScan',
  'downloads',
  'downloads.open',
  'downloads.ui',
  'enterprise.deviceAttributes',
  'enterprise.hardwarePlatform',
  'enterprise.networkingAttributes',
  'enterprise.platformKeys',
  'experimental',
  'fileBrowserHandler',
  'fileSystemProvider',
  'fontSettings',
  'gcm',
  'geolocation',
  'history',
  'identity',
  'identity.email',
  'idle',
  'loginState',
  'management',
  'nativeMessaging',
  'notifications',
  'offscreen',
  'pageCapture',
  'platformKeys',
  'power',
  'printerProvider',
  'printing',
  'printingMetrics',
  'privacy',
  'processes',
  'proxy',
  'scripting',
  'search',
  'sessions',
  'sidePanel',
  'storage',
  'system.cpu',
  'system.display',
  'system.memory',
  'system.storage',
  'tabCapture',
  'tabGroups',
  'tabs',
  'topSites',
  'tts',
  'ttsEngine',
  'unlimitedStorage',
  'vpnProvider',
  'wallpaper',
  'webAuthenticationProxy',
  'webNavigation',
  'webRequest',
  'webRequestBlocking',
] as const;

/**
 * Permission validation schema
 */
const permissionSchema = z.string().refine(
  (permission) => {
    // Allow official permissions or match patterns
    return (
      (CHROME_PERMISSIONS as readonly string[]).includes(permission) ||
      /^(\*|https?|file|ftp):\/\//.test(permission)
    );
  },
  {
    message: 'Invalid permission or host permission',
  }
);

/**
 * Complete Manifest V3 schema
 */
export const manifestV3Schema = z.object({
  manifest_version: z.literal(3),
  name: z.string().min(1, 'Name is required').max(45, 'Name must be 45 characters or less'),
  version: versionSchema,
  description: z.string().max(132, 'Description must be 132 characters or less').optional(),
  
  // Optional fields
  action: actionSchema.optional(),
  background: backgroundSchema.optional(),
  content_scripts: z.array(contentScriptSchema).optional(),
  icons: iconSchema.optional(),
  permissions: z.array(permissionSchema).optional(),
  host_permissions: z.array(matchPatternSchema).optional(),
  web_accessible_resources: z.array(webAccessibleResourcesSchema).optional(),
  
  // Additional common fields
  author: z.string().optional(),
  homepage_url: z.string().url().optional(),
  short_name: z.string().max(12, 'Short name must be 12 characters or less').optional(),
  minimum_chrome_version: z.string().optional(),
  
  // Options page
  options_page: z.string().optional(),
  options_ui: z
    .object({
      page: z.string(),
      open_in_tab: z.boolean().optional(),
    })
    .optional(),
  
  // Content security policy
  content_security_policy: z
    .object({
      extension_pages: z.string().optional(),
      sandbox: z.string().optional(),
    })
    .optional(),
  
  // Commands
  commands: z
    .record(
      z.string(),
      z.object({
        suggested_key: z
          .object({
            default: z.string().optional(),
            mac: z.string().optional(),
            windows: z.string().optional(),
            chromeos: z.string().optional(),
            linux: z.string().optional(),
          })
          .optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  
  // Omnibox
  omnibox: z
    .object({
      keyword: z.string(),
    })
    .optional(),
  
  // Side panel
  side_panel: z
    .object({
      default_path: z.string(),
    })
    .optional(),
});

/**
 * Input configuration schema for manifest generation
 */
export const manifestConfigSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  version: versionSchema,
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  hostPermissions: z.array(z.string()).optional(),
  author: z.string().optional(),
  homepage_url: z.string().url().optional(),
});

/**
 * Type exports
 */
export type ManifestV3 = z.infer<typeof manifestV3Schema>;
export type ManifestConfig = z.infer<typeof manifestConfigSchema>;
export type ContentScript = z.infer<typeof contentScriptSchema>;
export type Action = z.infer<typeof actionSchema>;
export type Background = z.infer<typeof backgroundSchema>;
