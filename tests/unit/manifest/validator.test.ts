import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ManifestValidator } from '../../../src/core/manifest/validator.js';
import { FileSystemUtils } from '../../../src/utils/fs.js';
import type { ManifestV3 } from '../../../src/core/manifest/schema.js';

describe('ManifestValidator', () => {
  describe('validate', () => {
    it('should validate a valid Manifest V3', () => {
      const validator = new ManifestValidator();
      const manifest: ManifestV3 = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        description: 'A test extension',
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate manifest with all optional fields', () => {
      const validator = new ManifestValidator();
      const manifest: ManifestV3 = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        description: 'A test extension',
        action: {
          default_popup: 'popup.html',
          default_icon: {
            '16': 'icons/icon16.png',
            '48': 'icons/icon48.png',
          },
        },
        background: {
          service_worker: 'background.js',
        },
        content_scripts: [
          {
            matches: ['https://*.example.com/*'],
            js: ['content.js'],
          },
        ],
        icons: {
          '16': 'icons/icon16.png',
          '48': 'icons/icon48.png',
          '128': 'icons/icon128.png',
        },
        permissions: ['storage', 'tabs'],
        host_permissions: ['https://*.google.com/*'],
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when manifest_version is missing', () => {
      const validator = new ManifestValidator();
      const manifest = {
        name: 'Test Extension',
        version: '1.0.0',
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.field.includes('manifest_version'))).toBe(true);
    });

    it('should fail validation when name is missing', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        version: '1.0.0',
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'name')).toBe(true);
    });

    it('should fail validation when version is missing', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'version')).toBe(true);
    });

    it('should fail validation for invalid version format', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: 'invalid',
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'version')).toBe(true);
    });

    it('should fail validation for version with too many parts', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0.0.0',
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'version')).toBe(true);
    });

    it('should fail validation for version number out of range', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.70000',
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'version')).toBe(true);
    });

    it('should validate version with 1-4 parts', () => {
      const validator = new ManifestValidator();

      const versions = ['1', '1.0', '1.0.0', '1.0.0.0'];

      for (const version of versions) {
        const manifest = {
          manifest_version: 3,
          name: 'Test Extension',
          version,
        };

        const result = validator.validate(manifest);
        expect(result.valid).toBe(true);
      }
    });

    it('should fail validation for name exceeding 45 characters', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'This is a very long extension name that exceeds the limit',
        version: '1.0.0',
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'name')).toBe(true);
    });

    it('should fail validation for description exceeding 132 characters', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test',
        version: '1.0.0',
        description: 'A'.repeat(133),
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'description')).toBe(true);
    });

    it('should fail validation for invalid icon sizes', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        icons: {
          '32': 'icon32.png', // Invalid size
        },
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
    });

    it('should validate valid icon sizes', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        icons: {
          '16': 'icon16.png',
          '48': 'icon48.png',
          '128': 'icon128.png',
          '256': 'icon256.png',
        },
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(true);
    });

    it('should fail validation for invalid match pattern', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        content_scripts: [
          {
            matches: ['invalid-pattern'],
            js: ['content.js'],
          },
        ],
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
    });

    it('should validate valid match patterns', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        content_scripts: [
          {
            matches: [
              'https://*.google.com/*',
              'http://example.com/*',
              '<all_urls>',
              'file:///*',
            ],
            js: ['content.js'],
          },
        ],
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(true);
    });

    it('should validate valid permissions', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        permissions: ['storage', 'tabs', 'activeTab', 'notifications'],
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(true);
    });

    it('should include field descriptions in errors', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        version: '1.0.0',
      };

      const result = validator.validate(manifest);

      expect(result.valid).toBe(false);
      const nameError = result.errors.find((e) => e.field === 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.severity).toBe('error');
    });
  });

  describe('validateFiles', () => {
    let mockFs: FileSystemUtils;

    beforeEach(() => {
      mockFs = {
        exists: vi.fn(),
      } as any;
    });

    it('should validate that all referenced files exist', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        action: {
          default_popup: 'popup.html',
          default_icon: {
            '16': 'icons/icon16.png',
          },
        },
        background: {
          service_worker: 'background.js',
        },
        icons: {
          '16': 'icons/icon16.png',
        },
      };

      vi.mocked(mockFs.exists).mockResolvedValue(true);

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when popup file is missing', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        action: {
          default_popup: 'popup.html',
        },
      };

      vi.mocked(mockFs.exists).mockResolvedValue(false);

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'action.default_popup')).toBe(true);
      expect(result.errors.some((e) => e.message.includes('popup.html'))).toBe(true);
    });

    it('should fail validation when background service worker is missing', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        background: {
          service_worker: 'background.js',
        },
      };

      vi.mocked(mockFs.exists).mockResolvedValue(false);

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'background.service_worker')).toBe(true);
    });

    it('should fail validation when content script files are missing', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        content_scripts: [
          {
            matches: ['<all_urls>'],
            js: ['content.js', 'utils.js'],
          },
        ],
      };

      vi.mocked(mockFs.exists).mockResolvedValue(false);

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail validation when icon files are missing', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        icons: {
          '16': 'icons/icon16.png',
          '48': 'icons/icon48.png',
        },
      };

      vi.mocked(mockFs.exists).mockResolvedValue(false);

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should validate action icon as string', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        action: {
          default_icon: 'icon.png',
        },
      };

      vi.mocked(mockFs.exists).mockResolvedValue(true);

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(true);
    });

    it('should validate content script CSS files', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        content_scripts: [
          {
            matches: ['<all_urls>'],
            js: ['content.js'],
            css: ['styles.css'],
          },
        ],
      };

      vi.mocked(mockFs.exists).mockResolvedValue(false);

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('styles.css'))).toBe(true);
    });

    it('should validate options page', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        options_page: 'options.html',
      };

      vi.mocked(mockFs.exists).mockResolvedValue(false);

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'options_page')).toBe(true);
    });

    it('should validate options UI page', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        options_ui: {
          page: 'options.html',
        },
      };

      vi.mocked(mockFs.exists).mockResolvedValue(false);

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'options_ui.page')).toBe(true);
    });

    it('should skip glob patterns in web accessible resources', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        web_accessible_resources: [
          {
            resources: ['images/*.png', 'specific.js'],
            matches: ['<all_urls>'],
          },
        ],
      };

      vi.mocked(mockFs.exists).mockImplementation(async (path: string) => {
        return !path.includes('specific.js');
      });

      const result = await validator.validateFiles(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('specific.js'))).toBe(true);
      expect(result.errors.some((e) => e.message.includes('*.png'))).toBe(false);
    });
  });

  describe('validateSchema', () => {
    it('should be an alias for validate', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
      };

      const result1 = validator.validate(manifest);
      const result2 = validator.validateSchema(manifest);

      expect(result1.valid).toBe(result2.valid);
      expect(result1.errors).toEqual(result2.errors);
    });
  });

  describe('validateWithJsonSchema', () => {
    it('should delegate to validate method', () => {
      const validator = new ManifestValidator();
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
      };

      const result = validator.validateWithJsonSchema(manifest);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateComplete', () => {
    let mockFs: FileSystemUtils;

    beforeEach(() => {
      mockFs = {
        exists: vi.fn(),
      } as unknown;
    });

    it('should validate both schema and files', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        action: {
          default_popup: 'popup.html',
        },
      };

      vi.mocked(mockFs.exists).mockResolvedValue(true);

      const result = await validator.validateComplete(manifest, '/project');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return schema errors without checking files', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        version: '1.0.0',
      };

      const result = await validator.validateComplete(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'name')).toBe(true);
    });

    it('should return file errors when schema is valid', async () => {
      const validator = new ManifestValidator(mockFs);
      const manifest = {
        manifest_version: 3,
        name: 'Test Extension',
        version: '1.0.0',
        action: {
          default_popup: 'popup.html',
        },
      };

      vi.mocked(mockFs.exists).mockResolvedValue(false);

      const result = await validator.validateComplete(manifest, '/project');

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'action.default_popup')).toBe(true);
    });
  });
});
