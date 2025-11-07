import { describe, it, expect } from 'vitest';
import {
  manifestV3Schema,
  manifestConfigSchema,
  type ManifestV3,
  type ManifestConfig,
} from '../../../src/core/manifest/schema.js';

describe('manifestV3Schema', () => {
  it('should validate a minimal valid manifest', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test Extension',
      version: '1.0.0',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should validate manifest with all fields', () => {
    const manifest: ManifestV3 = {
      manifest_version: 3,
      name: 'Test Extension',
      version: '1.0.0',
      description: 'A test extension',
      action: {
        default_popup: 'popup.html',
        default_icon: {
          '16': 'icon16.png',
        },
      },
      background: {
        service_worker: 'background.js',
        type: 'module',
      },
      content_scripts: [
        {
          matches: ['https://*.example.com/*'],
          js: ['content.js'],
        },
      ],
      icons: {
        '16': 'icon16.png',
        '48': 'icon48.png',
      },
      permissions: ['storage'],
      host_permissions: ['https://*.google.com/*'],
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should reject manifest with wrong manifest_version', () => {
    const manifest = {
      manifest_version: 2,
      name: 'Test Extension',
      version: '1.0.0',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should reject manifest without name', () => {
    const manifest = {
      manifest_version: 3,
      version: '1.0.0',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should reject manifest with empty name', () => {
    const manifest = {
      manifest_version: 3,
      name: '',
      version: '1.0.0',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should reject manifest with name exceeding 45 characters', () => {
    const manifest = {
      manifest_version: 3,
      name: 'A'.repeat(46),
      version: '1.0.0',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should reject manifest with description exceeding 132 characters', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      description: 'A'.repeat(133),
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should validate version with 1 part', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should validate version with 2 parts', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should validate version with 3 parts', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should validate version with 4 parts', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0.0',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should reject version with 5 parts', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0.0.0',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should reject version with non-numeric parts', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.a',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should reject version number exceeding 65535', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.70000',
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should validate match patterns', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      content_scripts: [
        {
          matches: [
            'https://*.google.com/*',
            'http://example.com/*',
            '<all_urls>',
            'file:///*',
            'ftp://ftp.example.com/*',
          ],
          js: ['content.js'],
        },
      ],
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should reject invalid match patterns', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      content_scripts: [
        {
          matches: ['invalid-pattern'],
          js: ['content.js'],
        },
      ],
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should validate valid icon sizes', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      icons: {
        '16': 'icon16.png',
        '48': 'icon48.png',
        '128': 'icon128.png',
        '256': 'icon256.png',
      },
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should reject invalid icon sizes', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      icons: {
        '32': 'icon32.png',
      },
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });

  it('should validate valid permissions', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      permissions: ['storage', 'tabs', 'activeTab', 'notifications', 'scripting'],
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should validate background service worker', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      background: {
        service_worker: 'background.js',
        type: 'module',
      },
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should validate content scripts with all options', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      content_scripts: [
        {
          matches: ['<all_urls>'],
          js: ['content.js'],
          css: ['styles.css'],
          run_at: 'document_end',
          all_frames: true,
          match_about_blank: false,
        },
      ],
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('should reject content scripts without matches', () => {
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      content_scripts: [
        {
          matches: [],
          js: ['content.js'],
        },
      ],
    };

    const result = manifestV3Schema.safeParse(manifest);

    expect(result.success).toBe(false);
  });
});

describe('manifestConfigSchema', () => {
  it('should validate minimal config', () => {
    const config: ManifestConfig = {
      name: 'Test Extension',
      version: '1.0.0',
    };

    const result = manifestConfigSchema.safeParse(config);

    expect(result.success).toBe(true);
  });

  it('should validate config with all fields', () => {
    const config: ManifestConfig = {
      name: 'Test Extension',
      version: '1.0.0',
      description: 'Test description',
      permissions: ['storage'],
      hostPermissions: ['https://*.google.com/*'],
      author: 'Test Author',
      homepage_url: 'https://example.com',
    };

    const result = manifestConfigSchema.safeParse(config);

    expect(result.success).toBe(true);
  });

  it('should reject config without name', () => {
    const config = {
      version: '1.0.0',
    };

    const result = manifestConfigSchema.safeParse(config);

    expect(result.success).toBe(false);
  });

  it('should reject config with empty name', () => {
    const config = {
      name: '',
      version: '1.0.0',
    };

    const result = manifestConfigSchema.safeParse(config);

    expect(result.success).toBe(false);
  });

  it('should reject config without version', () => {
    const config = {
      name: 'Test Extension',
    };

    const result = manifestConfigSchema.safeParse(config);

    expect(result.success).toBe(false);
  });

  it('should reject config with invalid version', () => {
    const config = {
      name: 'Test Extension',
      version: 'invalid',
    };

    const result = manifestConfigSchema.safeParse(config);

    expect(result.success).toBe(false);
  });

  it('should reject config with invalid homepage_url', () => {
    const config = {
      name: 'Test Extension',
      version: '1.0.0',
      homepage_url: 'not-a-url',
    };

    const result = manifestConfigSchema.safeParse(config);

    expect(result.success).toBe(false);
  });

  it('should validate config with valid homepage_url', () => {
    const config = {
      name: 'Test Extension',
      version: '1.0.0',
      homepage_url: 'https://example.com',
    };

    const result = manifestConfigSchema.safeParse(config);

    expect(result.success).toBe(true);
  });
});
