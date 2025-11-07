/**
 * Manifest V3 validator
 * Validates Chrome Extension manifests against schema and file system
 */

import { z } from 'zod';
import * as path from 'path';
import { manifestV3Schema } from './schema.js';
import { getFieldDescription } from '../../schemas/index.js';
import { FileSystemUtils } from '../../utils/fs.js';

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  description?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates Chrome Extension Manifest V3
 */
export class ManifestValidator {
  private fs: FileSystemUtils;

  constructor(fs?: FileSystemUtils) {
    this.fs = fs || new FileSystemUtils();
  }

  /**
   * Validate manifest structure using Zod schema
   */
  validate(manifest: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    try {
      // Validate with Zod schema
      manifestV3Schema.parse(manifest);
      
      return {
        valid: true,
        errors: [],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to ValidationErrors with field descriptions
        for (const issue of error.errors) {
          const fieldPath = issue.path.join('.');
          const description = getFieldDescription(fieldPath);
          
          errors.push({
            field: fieldPath || 'manifest',
            message: issue.message,
            severity: 'error',
            description,
          });
        }
      } else {
        errors.push({
          field: 'manifest',
          message: error instanceof Error ? error.message : 'Unknown validation error',
          severity: 'error',
        });
      }

      return {
        valid: false,
        errors,
      };
    }
  }

  /**
   * Validate that referenced files exist in the project
   */
  async validateFiles(manifest: unknown, projectRoot: string): Promise<ValidationResult> {
    // Type guard to ensure manifest is an object
    if (!manifest || typeof manifest !== 'object') {
      return {
        valid: false,
        errors: [
          {
            field: 'manifest',
            message: 'Manifest must be an object',
            severity: 'error',
          },
        ],
      };
    }

    const manifestObj = manifest as Record<string, unknown>;
    const errors: ValidationError[] = [];

    // Helper to check file existence
    const checkFile = async (filePath: string, field: string) => {
      const fullPath = path.join(projectRoot, filePath);
      const exists = await this.fs.exists(fullPath);
      
      if (!exists) {
        const description = getFieldDescription(field);
        errors.push({
          field,
          message: `Referenced file does not exist: ${filePath}`,
          severity: 'error',
          description,
        });
      }
    };

    // Check action popup
    const action = manifestObj.action as Record<string, unknown> | undefined;
    if (action?.default_popup && typeof action.default_popup === 'string') {
      await checkFile(action.default_popup, 'action.default_popup');
    }

    // Check action icons
    if (action?.default_icon) {
      if (typeof action.default_icon === 'string') {
        await checkFile(action.default_icon, 'action.default_icon');
      } else if (typeof action.default_icon === 'object' && action.default_icon !== null) {
        for (const [size, iconPath] of Object.entries(action.default_icon)) {
          if (typeof iconPath === 'string') {
            await checkFile(iconPath, `action.default_icon.${size}`);
          }
        }
      }
    }

    // Check background service worker
    const background = manifestObj.background as Record<string, unknown> | undefined;
    if (background?.service_worker && typeof background.service_worker === 'string') {
      await checkFile(background.service_worker, 'background.service_worker');
    }

    // Check content scripts
    const contentScripts = manifestObj.content_scripts as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(contentScripts)) {
      for (let i = 0; i < contentScripts.length; i++) {
        const script = contentScripts[i];
        
        if (Array.isArray(script.js)) {
          for (let j = 0; j < script.js.length; j++) {
            if (typeof script.js[j] === 'string') {
              await checkFile(script.js[j], `content_scripts[${i}].js[${j}]`);
            }
          }
        }
        
        if (Array.isArray(script.css)) {
          for (let j = 0; j < script.css.length; j++) {
            if (typeof script.css[j] === 'string') {
              await checkFile(script.css[j], `content_scripts[${i}].css[${j}]`);
            }
          }
        }
      }
    }

    // Check manifest icons
    const icons = manifestObj.icons as Record<string, unknown> | undefined;
    if (icons && typeof icons === 'object') {
      for (const [size, iconPath] of Object.entries(icons)) {
        if (typeof iconPath === 'string') {
          await checkFile(iconPath, `icons.${size}`);
        }
      }
    }

    // Check options page
    if (manifestObj.options_page && typeof manifestObj.options_page === 'string') {
      await checkFile(manifestObj.options_page, 'options_page');
    }

    // Check options UI page
    const optionsUi = manifestObj.options_ui as Record<string, unknown> | undefined;
    if (optionsUi?.page && typeof optionsUi.page === 'string') {
      await checkFile(optionsUi.page, 'options_ui.page');
    }

    // Check web accessible resources
    const webAccessibleResources = manifestObj.web_accessible_resources as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(webAccessibleResources)) {
      for (let i = 0; i < webAccessibleResources.length; i++) {
        const resources = webAccessibleResources[i].resources;
        if (Array.isArray(resources)) {
          for (let j = 0; j < resources.length; j++) {
            const resource = resources[j];
            // Skip glob patterns
            if (typeof resource === 'string' && !resource.includes('*')) {
              await checkFile(resource, `web_accessible_resources[${i}].resources[${j}]`);
            }
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate manifest schema structure (alias for validate)
   */
  validateSchema(manifest: unknown): ValidationResult {
    return this.validate(manifest);
  }

  /**
   * Optional: Validate using official Chrome manifest JSON Schema
   * This provides additional validation using the JSON Schema from schemastore.org
   * Requires AJV library to be installed
   */
  validateWithJsonSchema(manifest: unknown): ValidationResult {
    // This is an optional additional validation layer
    // For Phase 1, we rely on Zod validation
    // This method can be implemented later if needed with AJV
    
    // For now, delegate to Zod validation
    return this.validate(manifest);
  }

  /**
   * Comprehensive validation: schema + files
   */
  async validateComplete(manifest: unknown, projectRoot: string): Promise<ValidationResult> {
    // First validate schema
    const schemaResult = this.validate(manifest);
    
    if (!schemaResult.valid) {
      return schemaResult;
    }

    // Then validate files
    const filesResult = await this.validateFiles(manifest, projectRoot);
    
    return {
      valid: filesResult.valid,
      errors: [...schemaResult.errors, ...filesResult.errors],
    };
  }
}
