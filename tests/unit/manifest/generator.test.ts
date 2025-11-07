import { describe, it, expect } from 'vitest';
import { ManifestGenerator } from '../../../src/core/manifest/generator.js';
import type { ManifestConfig, ManifestV3 } from '../../../src/core/manifest/schema.js';

describe('ManifestGenerator', () => {
  describe('generate', () => {
    it('should generate a valid Manifest V3 from minimal config', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '1.0.0',
        description: 'A test extension',
      };

      const manifest = generator.generate(config);

      expect(manifest.manifest_version).toBe(3);
      expect(manifest.name).toBe('Test Extension');
      expect(manifest.version).toBe('1.0.0');
      expect(manifest.description).toBe('A test extension');
    });

    it('should include action configuration with popup and icons', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '1.0.0',
      };

      const manifest = generator.generate(config);

      expect(manifest.action).toBeDefined();
      expect(manifest.action?.default_popup).toBe('popup.html');
      expect(manifest.action?.default_icon).toEqual({
        '16': 'icons/icon16.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png',
      });
    });

    it('should include background service worker configuration', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '1.0.0',
      };

      const manifest = generator.generate(config);

      expect(manifest.background).toBeDefined();
      expect(manifest.background?.service_worker).toBe('background.js');
      expect(manifest.background?.type).toBe('module');
    });

    it('should include content scripts configuration', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '1.0.0',
      };

      const manifest = generator.generate(config);

      expect(manifest.content_scripts).toBeDefined();
      expect(manifest.content_scripts).toHaveLength(1);
      expect(manifest.content_scripts?.[0].matches).toEqual(['<all_urls>']);
      expect(manifest.content_scripts?.[0].js).toEqual(['content.js']);
    });

    it('should include icons configuration', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '1.0.0',
      };

      const manifest = generator.generate(config);

      expect(manifest.icons).toEqual({
        '16': 'icons/icon16.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png',
      });
    });

    it('should include permissions when provided', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '1.0.0',
        permissions: ['storage', 'tabs'],
      };

      const manifest = generator.generate(config);

      expect(manifest.permissions).toEqual(['storage', 'tabs']);
    });

    it('should include host permissions when provided', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '1.0.0',
        hostPermissions: ['https://*.google.com/*', 'https://*.github.com/*'],
      };

      const manifest = generator.generate(config);

      expect(manifest.host_permissions).toEqual([
        'https://*.google.com/*',
        'https://*.github.com/*',
      ]);
    });

    it('should include author when provided', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '1.0.0',
        author: 'John Doe',
      };

      const manifest = generator.generate(config);

      expect(manifest.author).toBe('John Doe');
    });

    it('should include homepage_url when provided', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '1.0.0',
        homepage_url: 'https://example.com',
      };

      const manifest = generator.generate(config);

      expect(manifest.homepage_url).toBe('https://example.com');
    });

    it('should handle version with multiple parts', () => {
      const generator = new ManifestGenerator();
      const config: ManifestConfig = {
        name: 'Test Extension',
        version: '2.5.3.1',
      };

      const manifest = generator.generate(config);

      expect(manifest.version).toBe('2.5.3.1');
    });

    it('should throw error for invalid config', () => {
      const generator = new ManifestGenerator();
      const invalidConfig = {
        name: '',
        version: '1.0.0',
      } as ManifestConfig;

      expect(() => generator.generate(invalidConfig)).toThrow();
    });
  });

  describe('fromPackageJson', () => {
    it('should extract name, version, and description from package.json', () => {
      const generator = new ManifestGenerator();
      const packageJson = {
        name: 'my-extension',
        version: '2.0.0',
        description: 'My awesome extension',
      };

      const config = generator.fromPackageJson(packageJson);

      expect(config.name).toBe('my-extension');
      expect(config.version).toBe('2.0.0');
      expect(config.description).toBe('My awesome extension');
    });

    it('should extract author from string format', () => {
      const generator = new ManifestGenerator();
      const packageJson = {
        name: 'my-extension',
        version: '1.0.0',
        author: 'Jane Smith',
      };

      const config = generator.fromPackageJson(packageJson);

      expect(config.author).toBe('Jane Smith');
    });

    it('should extract author from object format', () => {
      const generator = new ManifestGenerator();
      const packageJson = {
        name: 'my-extension',
        version: '1.0.0',
        author: {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      };

      const config = generator.fromPackageJson(packageJson);

      expect(config.author).toBe('Jane Smith');
    });

    it('should extract homepage from package.json', () => {
      const generator = new ManifestGenerator();
      const packageJson = {
        name: 'my-extension',
        version: '1.0.0',
        homepage: 'https://example.com',
      };

      const config = generator.fromPackageJson(packageJson);

      expect(config.homepage_url).toBe('https://example.com');
    });

    it('should use defaults when fields are missing', () => {
      const generator = new ManifestGenerator();
      const packageJson = {};

      const config = generator.fromPackageJson(packageJson);

      expect(config.name).toBe('My Extension');
      expect(config.version).toBe('1.0.0');
      expect(config.description).toBeUndefined();
      expect(config.author).toBeUndefined();
    });

    it('should handle package.json with extra fields', () => {
      const generator = new ManifestGenerator();
      const packageJson = {
        name: 'my-extension',
        version: '1.0.0',
        description: 'Test',
        scripts: { build: 'vite build' },
        dependencies: { react: '^18.0.0' },
      };

      const config = generator.fromPackageJson(packageJson);

      expect(config.name).toBe('my-extension');
      expect(config.version).toBe('1.0.0');
      expect(config.description).toBe('Test');
    });
  });

  describe('generateFromPackageJson', () => {
    it('should generate manifest from package.json', () => {
      const generator = new ManifestGenerator();
      const packageJson = {
        name: 'my-extension',
        version: '1.5.0',
        description: 'Test extension',
        author: 'Test Author',
      };

      const manifest = generator.generateFromPackageJson(packageJson);

      expect(manifest.manifest_version).toBe(3);
      expect(manifest.name).toBe('my-extension');
      expect(manifest.version).toBe('1.5.0');
      expect(manifest.description).toBe('Test extension');
      expect(manifest.author).toBe('Test Author');
    });

    it('should apply overrides to package.json config', () => {
      const generator = new ManifestGenerator();
      const packageJson = {
        name: 'my-extension',
        version: '1.0.0',
      };

      const manifest = generator.generateFromPackageJson(packageJson, {
        description: 'Overridden description',
        permissions: ['storage'],
      });

      expect(manifest.name).toBe('my-extension');
      expect(manifest.description).toBe('Overridden description');
      expect(manifest.permissions).toEqual(['storage']);
    });

    it('should override package.json values with explicit config', () => {
      const generator = new ManifestGenerator();
      const packageJson = {
        name: 'my-extension',
        version: '1.0.0',
        description: 'Original description',
      };

      const manifest = generator.generateFromPackageJson(packageJson, {
        name: 'New Extension Name',
        version: '2.0.0',
      });

      expect(manifest.name).toBe('New Extension Name');
      expect(manifest.version).toBe('2.0.0');
      expect(manifest.description).toBe('Original description');
    });
  });
});
