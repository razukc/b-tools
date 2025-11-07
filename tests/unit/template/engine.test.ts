import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TemplateEngine, TemplateContext } from '../../../src/core/template/engine';
import { vol } from 'memfs';
import * as path from 'path';

// Mock fs-extra to use memfs
vi.mock('fs-extra', async () => {
  const memfs = await import('memfs');
  const { fs } = memfs;
  
  return {
    default: {
      ...fs.promises,
      readdir: fs.promises.readdir,
      readFile: fs.promises.readFile,
      stat: fs.promises.stat,
    },
    readdir: fs.promises.readdir,
    readFile: fs.promises.readFile,
    stat: fs.promises.stat,
  };
});

describe('TemplateEngine', () => {
  let engine: TemplateEngine;
  let context: TemplateContext;

  beforeEach(() => {
    engine = new TemplateEngine();
    context = {
      projectName: 'test-extension',
      version: '1.0.0',
      description: 'A test extension',
      author: 'Test Author',
    };
    vol.reset();
  });

  afterEach(() => {
    vol.reset();
  });

  describe('renderFile', () => {
    it('should substitute variables with context values', () => {
      const template = 'Project: {{projectName}}, Version: {{version}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Project: test-extension, Version: 1.0.0');
    });

    it('should handle multiple occurrences of the same variable', () => {
      const template = '{{projectName}} - {{projectName}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('test-extension - test-extension');
    });

    it('should leave undefined variables unchanged', () => {
      const template = 'Name: {{projectName}}, Unknown: {{unknown}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Name: test-extension, Unknown: {{unknown}}');
    });

    it('should handle empty template', () => {
      const template = '';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('');
    });

    it('should handle template with no variables', () => {
      const template = 'This is a plain text template';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('This is a plain text template');
    });
  });

  describe('conditional rendering', () => {
    it('should include block when condition is truthy', () => {
      const template = '{{#if author}}Author: {{author}}{{/if}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Author: Test Author');
    });

    it('should exclude block when condition is falsy', () => {
      const template = '{{#if missing}}This should not appear{{/if}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('');
    });

    it('should handle multiple conditionals', () => {
      const template = '{{#if projectName}}Name: {{projectName}}{{/if}} {{#if version}}Version: {{version}}{{/if}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Name: test-extension Version: 1.0.0');
    });

    it('should handle nested content in conditionals', () => {
      const template = '{{#if author}}Author: {{author}}\nDescription: {{description}}{{/if}}';
      const result = engine.renderFile(template, context);
      
      expect(result).toBe('Author: Test Author\nDescription: A test extension');
    });
  });

  describe('render', () => {
    it('should render all files in a template directory', async () => {
      // Setup mock file system
      vol.fromJSON({
        '/template/file1.txt': 'Project: {{projectName}}',
        '/template/file2.txt': 'Version: {{version}}',
        '/template/subdir/file3.txt': 'Description: {{description}}',
      });

      const files = await engine.render('/template', context);

      expect(files).toHaveLength(3);
      expect(files[0].content).toBe('Project: test-extension');
      expect(files[1].content).toBe('Version: 1.0.0');
      expect(files[2].content).toBe('Description: A test extension');
    });

    it('should preserve directory structure in file paths', async () => {
      vol.fromJSON({
        '/template/root.txt': 'root',
        '/template/subdir/nested.txt': 'nested',
      });

      const files = await engine.render('/template', context);

      const paths = files.map(f => f.path);
      expect(paths).toContain('root.txt');
      expect(paths).toContain(path.join('subdir', 'nested.txt'));
    });

    it('should process filenames with variables', async () => {
      vol.fromJSON({
        '/template/{{projectName}}.txt': 'content',
      });

      const files = await engine.render('/template', context);

      expect(files[0].path).toBe('test-extension.txt');
    });

    it('should handle empty directory', async () => {
      vol.fromJSON({
        '/template/.keep': '',
      });

      // Remove the .keep file to make it truly empty
      vol.unlinkSync('/template/.keep');
      vol.mkdirSync('/template', { recursive: true });

      const files = await engine.render('/template', context);

      expect(files).toHaveLength(0);
    });
  });
});
