/**
 * Manifest V3 generator
 * Converts configuration to valid Chrome Extension Manifest V3
 */

import { ManifestV3, ManifestConfig, manifestConfigSchema } from './schema.js';

/**
 * Package.json structure for extracting metadata
 */
export interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  author?: string | { name: string; email?: string; url?: string };
  homepage?: string;
  [key: string]: unknown;
}

/**
 * Generates Chrome Extension Manifest V3 files
 */
export class ManifestGenerator {
  /**
   * Generate a complete Manifest V3 from configuration
   */
  generate(config: ManifestConfig): ManifestV3 {
    // Validate input configuration
    const validatedConfig = manifestConfigSchema.parse(config);

    // Build the manifest
    const manifest: ManifestV3 = {
      manifest_version: 3,
      name: validatedConfig.name,
      version: validatedConfig.version,
      description: validatedConfig.description || '',
    };

    // Add action (popup) configuration
    manifest.action = {
      default_popup: 'popup.html',
      default_icon: {
        '16': 'icons/icon16.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png',
      },
    };

    // Add background service worker
    manifest.background = {
      service_worker: 'background.js',
      type: 'module',
    };

    // Add content scripts
    manifest.content_scripts = [
      {
        matches: ['<all_urls>'],
        js: ['content.js'],
      },
    ];

    // Add icons
    manifest.icons = {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png',
    };

    // Add permissions if provided
    if (validatedConfig.permissions && validatedConfig.permissions.length > 0) {
      manifest.permissions = validatedConfig.permissions;
    }

    // Add host permissions if provided
    if (validatedConfig.hostPermissions && validatedConfig.hostPermissions.length > 0) {
      manifest.host_permissions = validatedConfig.hostPermissions;
    }

    // Add optional metadata
    if (validatedConfig.author) {
      manifest.author = validatedConfig.author;
    }

    if (validatedConfig.homepage_url) {
      manifest.homepage_url = validatedConfig.homepage_url;
    }

    return manifest;
  }

  /**
   * Extract manifest configuration from package.json
   */
  fromPackageJson(packageJson: PackageJson): ManifestConfig {
    const config: ManifestConfig = {
      name: packageJson.name || 'My Extension',
      version: packageJson.version || '1.0.0',
      description: packageJson.description,
    };

    // Extract author
    if (packageJson.author) {
      if (typeof packageJson.author === 'string') {
        config.author = packageJson.author;
      } else if (typeof packageJson.author === 'object' && packageJson.author.name) {
        config.author = packageJson.author.name;
      }
    }

    // Extract homepage
    if (packageJson.homepage) {
      config.homepage_url = packageJson.homepage;
    }

    return config;
  }

  /**
   * Generate manifest with package.json metadata
   */
  generateFromPackageJson(packageJson: PackageJson, overrides?: Partial<ManifestConfig>): ManifestV3 {
    const config = this.fromPackageJson(packageJson);
    const mergedConfig = { ...config, ...overrides };
    return this.generate(mergedConfig);
  }
}
