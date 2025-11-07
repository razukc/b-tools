/**
 * Template Registry for managing extension templates
 */

import * as path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

export interface Template {
  id: string;
  name: string;
  description: string;
  files: string; // Path to template files directory
  dependencies: string[];
  devDependencies: string[];
}

export class TemplateRegistry {
  private templates: Map<string, Template> = new Map();

  constructor() {
    this.loadTemplates();
  }

  /**
   * Load all available templates
   */
  private loadTemplates(): void {
    // Get the templates directory path
    const templatesDir = this.getTemplatesDir();

    // Load vanilla template
    const vanillaMetaPath = path.join(templatesDir, 'vanilla', 'template.json');
    const vanillaFilesPath = path.join(templatesDir, 'vanilla', 'files');

    if (fs.existsSync(vanillaMetaPath)) {
      const metadata = fs.readJsonSync(vanillaMetaPath);
      this.templates.set('vanilla', {
        ...metadata,
        files: vanillaFilesPath,
      });
    }
  }

  /**
   * Get template by id
   */
  get(id: string): Template | undefined {
    return this.templates.get(id);
  }

  /**
   * List all available templates
   */
  list(): Template[] {
    return Array.from(this.templates.values());
  }

  /**
   * Check if template exists
   */
  has(id: string): boolean {
    return this.templates.has(id);
  }

  /**
   * Get the templates directory path
   */
  private getTemplatesDir(): string {
    // Handle both CommonJS and ESM
    if (typeof __dirname !== 'undefined') {
      // CommonJS
      return path.join(__dirname, '..', '..', 'templates');
    } else {
      // ESM
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      return path.join(__dirname, '..', '..', 'templates');
    }
  }
}
