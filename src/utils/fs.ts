import fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { FileSystemError } from './errors.js';

/**
 * File system utilities with cross-platform support
 * Provides safe, atomic operations with proper error handling
 */
export class FileSystemUtils {
  /**
   * Ensure a directory exists, creating it if necessary
   * Creates parent directories as needed
   */
  async ensureDir(dirPath: string): Promise<void> {
    try {
      const normalizedPath = path.normalize(dirPath);
      await fs.ensureDir(normalizedPath);
    } catch (error) {
      throw new FileSystemError(`Failed to ensure directory exists: ${dirPath}`, {
        path: dirPath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Copy a directory recursively
   * Preserves file permissions and timestamps
   */
  async copyDir(src: string, dest: string): Promise<void> {
    try {
      const normalizedSrc = path.normalize(src);
      const normalizedDest = path.normalize(dest);

      // Check if source exists
      if (!(await this.exists(normalizedSrc))) {
        throw new FileSystemError(`Source directory does not exist: ${src}`, {
          src,
        });
      }

      await fs.copy(normalizedSrc, normalizedDest, {
        overwrite: false,
        errorOnExist: true,
      });
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }
      throw new FileSystemError(`Failed to copy directory: ${src} -> ${dest}`, {
        src,
        dest,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Write content to a file
   * Creates parent directories if they don't exist
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      const normalizedPath = path.normalize(filePath);
      const dir = path.dirname(normalizedPath);

      // Ensure parent directory exists
      await this.ensureDir(dir);

      await fs.writeFile(normalizedPath, content, 'utf-8');
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }
      throw new FileSystemError(`Failed to write file: ${filePath}`, {
        path: filePath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Read content from a file
   * Returns the file content as a string
   */
  async readFile(filePath: string): Promise<string> {
    try {
      const normalizedPath = path.normalize(filePath);

      if (!(await this.exists(normalizedPath))) {
        throw new FileSystemError(`File does not exist: ${filePath}`, {
          path: filePath,
        });
      }

      return await fs.readFile(normalizedPath, 'utf-8');
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }
      throw new FileSystemError(`Failed to read file: ${filePath}`, {
        path: filePath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if a file or directory exists
   */
  async exists(targetPath: string): Promise<boolean> {
    try {
      const normalizedPath = path.normalize(targetPath);
      await fs.access(normalizedPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove a file or directory
   * Recursively removes directories and their contents
   */
  async remove(targetPath: string): Promise<void> {
    try {
      const normalizedPath = path.normalize(targetPath);

      if (await this.exists(normalizedPath)) {
        await fs.remove(normalizedPath);
      }
    } catch (error) {
      throw new FileSystemError(`Failed to remove: ${targetPath}`, {
        path: targetPath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Create a temporary directory
   * Returns the path to the created directory
   * Used for atomic operations
   */
  async createTempDir(): Promise<string> {
    try {
      const tmpDir = os.tmpdir();
      const prefix = path.join(tmpDir, 'btools-');
      const tempPath = await fs.mkdtemp(prefix);
      return path.normalize(tempPath);
    } catch (error) {
      throw new FileSystemError('Failed to create temporary directory', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Move a file or directory atomically
   * Ensures the operation completes fully or not at all
   * Handles cross-device moves by copying then removing
   */
  async moveAtomic(src: string, dest: string): Promise<void> {
    try {
      const normalizedSrc = path.normalize(src);
      const normalizedDest = path.normalize(dest);

      // Check if source exists
      if (!(await this.exists(normalizedSrc))) {
        throw new FileSystemError(`Source does not exist: ${src}`, {
          src,
        });
      }

      // Check if destination already exists
      if (await this.exists(normalizedDest)) {
        throw new FileSystemError(`Destination already exists: ${dest}`, {
          dest,
        });
      }

      // Ensure destination parent directory exists
      const destDir = path.dirname(normalizedDest);
      await this.ensureDir(destDir);

      try {
        // Try atomic rename first (fastest, but only works on same device)
        await fs.rename(normalizedSrc, normalizedDest);
      } catch (renameError) {
        // If rename fails (likely cross-device), fall back to copy + remove
        await fs.copy(normalizedSrc, normalizedDest);
        await fs.remove(normalizedSrc);
      }
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }
      throw new FileSystemError(`Failed to move atomically: ${src} -> ${dest}`, {
        src,
        dest,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

/**
 * Default instance for convenience
 */
export const fsUtils = new FileSystemUtils();
