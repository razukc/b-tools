import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateRegistry } from '../../../src/core/template/registry';

describe('TemplateRegistry', () => {
  let registry: TemplateRegistry;

  beforeEach(() => {
    registry = new TemplateRegistry();
  });

  describe('get', () => {
    it('should return vanilla template', () => {
      const template = registry.get('vanilla');

      expect(template).toBeDefined();
      expect(template?.id).toBe('vanilla');
      expect(template?.name).toBe('Vanilla JavaScript');
    });

    it('should return undefined for non-existent template', () => {
      const template = registry.get('non-existent');

      expect(template).toBeUndefined();
    });
  });

  describe('list', () => {
    it('should return array of all templates', () => {
      const templates = registry.list();

      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should include vanilla template in list', () => {
      const templates = registry.list();
      const vanillaTemplate = templates.find(t => t.id === 'vanilla');

      expect(vanillaTemplate).toBeDefined();
      expect(vanillaTemplate?.name).toBe('Vanilla JavaScript');
    });
  });

  describe('has', () => {
    it('should return true for existing template', () => {
      expect(registry.has('vanilla')).toBe(true);
    });

    it('should return false for non-existent template', () => {
      expect(registry.has('non-existent')).toBe(false);
    });
  });

  describe('template metadata', () => {
    it('should have correct structure for vanilla template', () => {
      const template = registry.get('vanilla');

      expect(template).toMatchObject({
        id: 'vanilla',
        name: expect.any(String),
        description: expect.any(String),
        files: expect.any(String),
        dependencies: expect.any(Array),
        devDependencies: expect.any(Array),
      });
    });

    it('should have files path for vanilla template', () => {
      const template = registry.get('vanilla');

      expect(template?.files).toBeDefined();
      expect(typeof template?.files).toBe('string');
    });
  });
});
