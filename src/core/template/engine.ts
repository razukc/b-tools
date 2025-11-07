/**
 * Template Engine for rendering template files with variable substitution
 */

export interface TemplateContext {
  projectName: string;
  version: string;
  description: string;
  author?: string;
  [key: string]: string | undefined;
}

export interface TemplateFile {
  path: string;
  content: string;
  encoding: 'utf-8' | 'binary';
}

export class TemplateEngine {
  /**
   * Render a single file with variable substitution
   * Supports {{variable}} syntax and {{#if condition}}...{{/if}} conditionals
   */
  renderFile(content: string, context: TemplateContext): string {
    let result = content;

    // Process conditionals first: {{#if variable}}...{{/if}}
    result = this.processConditionals(result, context);

    // Process variable substitution: {{variable}}
    result = this.processVariables(result, context);

    return result;
  }

  /**
   * Render all files in a template directory
   */
  async render(
    templatePath: string,
    context: TemplateContext
  ): Promise<TemplateFile[]> {
    const fsModule = await import('fs-extra');
    const fs = fsModule.default;
    const pathModule = await import('path');
    const path = pathModule.default;
    const files: TemplateFile[] = [];

    const processDirectory = async (dirPath: string, relativePath = '') => {
      const entries = await fs.readdir(dirPath);

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const relPath = path.join(relativePath, entry);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          await processDirectory(fullPath, relPath);
        } else if (stats.isFile()) {
          const content = await fs.readFile(fullPath, 'utf-8');
          const renderedContent = this.renderFile(content, context);
          
          // Process filename for variable substitution
          const renderedPath = this.renderFile(relPath, context);

          files.push({
            path: renderedPath,
            content: renderedContent,
            encoding: 'utf-8',
          });
        }
      }
    };

    await processDirectory(templatePath);
    return files;
  }

  /**
   * Process conditional blocks: {{#if variable}}...{{/if}}
   */
  private processConditionals(content: string, context: TemplateContext): string {
    const conditionalRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

    return content.replace(conditionalRegex, (match, variable, block) => {
      const value = context[variable];
      // Include block if variable exists and is truthy
      return value ? block : '';
    });
  }

  /**
   * Process variable substitution: {{variable}}
   */
  private processVariables(content: string, context: TemplateContext): string {
    const variableRegex = /\{\{(\w+)\}\}/g;

    return content.replace(variableRegex, (match, variable) => {
      const value = context[variable];
      return value !== undefined ? value : match;
    });
  }
}
