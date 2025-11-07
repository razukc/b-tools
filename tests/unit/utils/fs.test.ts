import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { vol } from 'memfs';
import { FileSystemUtils } from '../../../src/utils/fs.js';
import { FileSystemError } from '../../../src/utils/errors.js';
import * as path from 'path';

// Mock os module to return a path that exists in memfs
vi.mock('os', () => ({
  default: {
    tmpdir: () => '/tmp',
  },
  tmpdir: () => '/tmp',
}));

// Mock fs-extra to use memfs
vi.mock('fs-extra', async () => {
  const memfs = await import('memfs');
  const { fs } = memfs;
  
  // Create fs-extra compatible API using memfs
  return {
    default: {
      ...fs.promises,
      ensureDir: async (dirPath: string) => {
        await fs.promises.mkdir(dirPath, { recursive: true });
      },
      copy: async (src: string, dest: string, options?: { overwrite?: boolean; errorOnExist?: boolean }) => {
        const copyRecursive = async (srcPath: string, destPath: string) => {
          const stats = await fs.promises.stat(srcPath);
          if (stats.isDirectory()) {
            await fs.promises.mkdir(destPath, { recursive: true });
            const entries = await fs.promises.readdir(srcPath);
            for (const entry of entries) {
              await copyRecursive(
                path.join(srcPath, entry as string),
                path.join(destPath, entry as string)
              );
            }
          } else {
            const content = await fs.promises.readFile(srcPath);
            await fs.promises.writeFile(destPath, content);
          }
        };
        await copyRecursive(src, dest);
      },
      writeFile: fs.promises.writeFile,
      readFile: fs.promises.readFile,
      access: fs.promises.access,
      remove: async (targetPath: string) => {
        try {
          const stats = await fs.promises.stat(targetPath);
          if (stats.isDirectory()) {
            await fs.promises.rmdir(targetPath, { recursive: true });
          } else {
            await fs.promises.unlink(targetPath);
          }
        } catch (error) {
          // Ignore if doesn't exist
        }
      },
      mkdtemp: fs.promises.mkdtemp,
      rename: fs.promises.rename,
    },
    ensureDir: async (dirPath: string) => {
      await fs.promises.mkdir(dirPath, { recursive: true });
    },
    copy: async (src: string, dest: string, options?: { overwrite?: boolean; errorOnExist?: boolean }) => {
      const copyRecursive = async (srcPath: string, destPath: string) => {
        const stats = await fs.promises.stat(srcPath);
        if (stats.isDirectory()) {
          await fs.promises.mkdir(destPath, { recursive: true });
          const entries = await fs.promises.readdir(srcPath);
          for (const entry of entries) {
            await copyRecursive(
              path.join(srcPath, entry as string),
              path.join(destPath, entry as string)
            );
          }
        } else {
          const content = await fs.promises.readFile(srcPath);
          await fs.promises.writeFile(destPath, content);
        }
      };
      await copyRecursive(src, dest);
    },
    writeFile: fs.promises.writeFile,
    readFile: fs.promises.readFile,
    access: fs.promises.access,
    remove: async (targetPath: string) => {
      try {
        const stats = await fs.promises.stat(targetPath);
        if (stats.isDirectory()) {
          await fs.promises.rmdir(targetPath, { recursive: true });
        } else {
          await fs.promises.unlink(targetPath);
        }
      } catch (error) {
        // Ignore if doesn't exist
      }
    },
    mkdtemp: fs.promises.mkdtemp,
    rename: fs.promises.rename,
  };
});

describe('FileSystemUtils', () => {
  let fsUtils: FileSystemUtils;

  beforeEach(() => {
    fsUtils = new FileSystemUtils();
    vol.reset();
    // Ensure /tmp directory exists for createTempDir tests
    vol.mkdirSync('/tmp', { recursive: true });
  });

  afterEach(() => {
    vol.reset();
  });

  describe('ensureDir', () => {
    it('should create a directory if it does not exist', async () => {
      const dirPath = '/test/dir';

      await fsUtils.ensureDir(dirPath);

      const stats = vol.statSync(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    it('should not throw if directory already exists', async () => {
      const dirPath = '/test/dir';
      vol.mkdirSync(dirPath, { recursive: true });

      await expect(fsUtils.ensureDir(dirPath)).resolves.not.toThrow();
    });

    it('should create parent directories', async () => {
      const dirPath = '/test/nested/deep/dir';

      await fsUtils.ensureDir(dirPath);

      const stats = vol.statSync(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    it('should normalize paths', async () => {
      const dirPath = '/test//dir/../dir';

      await fsUtils.ensureDir(dirPath);

      const normalizedPath = path.normalize(dirPath);
      const stats = vol.statSync(normalizedPath);
      expect(stats.isDirectory()).toBe(true);
    });
  });

  describe('copyDir', () => {
    it('should copy a directory recursively', async () => {
      const src = '/source';
      const dest = '/destination';

      vol.mkdirSync(src, { recursive: true });
      vol.writeFileSync(`${src}/file1.txt`, 'content1');
      vol.mkdirSync(`${src}/subdir`, { recursive: true });
      vol.writeFileSync(`${src}/subdir/file2.txt`, 'content2');

      await fsUtils.copyDir(src, dest);

      expect(vol.existsSync(`${dest}/file1.txt`)).toBe(true);
      expect(vol.existsSync(`${dest}/subdir/file2.txt`)).toBe(true);
      expect(vol.readFileSync(`${dest}/file1.txt`, 'utf-8')).toBe('content1');
      expect(vol.readFileSync(`${dest}/subdir/file2.txt`, 'utf-8')).toBe('content2');
    });

    it('should throw FileSystemError if source does not exist', async () => {
      const src = '/nonexistent';
      const dest = '/destination';

      await expect(fsUtils.copyDir(src, dest)).rejects.toThrow(FileSystemError);
      await expect(fsUtils.copyDir(src, dest)).rejects.toThrow('Source directory does not exist');
    });

    it('should normalize paths', async () => {
      const src = '/source//dir';
      const dest = '/dest//dir';

      vol.mkdirSync(path.normalize(src), { recursive: true });
      vol.writeFileSync(path.join(path.normalize(src), 'file.txt'), 'content');

      await fsUtils.copyDir(src, dest);

      const normalizedDest = path.normalize(dest);
      expect(vol.existsSync(path.join(normalizedDest, 'file.txt'))).toBe(true);
    });
  });

  describe('writeFile', () => {
    it('should write content to a file', async () => {
      const filePath = '/test/file.txt';
      const content = 'test content';

      await fsUtils.writeFile(filePath, content);

      expect(vol.existsSync(filePath)).toBe(true);
      expect(vol.readFileSync(filePath, 'utf-8')).toBe(content);
    });

    it('should create parent directories if they do not exist', async () => {
      const filePath = '/test/nested/deep/file.txt';
      const content = 'test content';

      await fsUtils.writeFile(filePath, content);

      expect(vol.existsSync(filePath)).toBe(true);
      expect(vol.readFileSync(filePath, 'utf-8')).toBe(content);
    });

    it('should normalize paths', async () => {
      const filePath = '/test//dir/../file.txt';
      const content = 'test content';

      await fsUtils.writeFile(filePath, content);

      const normalizedPath = path.normalize(filePath);
      expect(vol.existsSync(normalizedPath)).toBe(true);
    });
  });

  describe('readFile', () => {
    it('should read content from a file', async () => {
      const filePath = '/test/file.txt';
      const content = 'test content';

      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(filePath, content);

      const result = await fsUtils.readFile(filePath);

      expect(result).toBe(content);
    });

    it('should throw FileSystemError if file does not exist', async () => {
      const filePath = '/nonexistent/file.txt';

      await expect(fsUtils.readFile(filePath)).rejects.toThrow(FileSystemError);
      await expect(fsUtils.readFile(filePath)).rejects.toThrow('File does not exist');
    });

    it('should normalize paths', async () => {
      const filePath = '/test//file.txt';
      const content = 'test content';

      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(path.normalize(filePath), content);

      const result = await fsUtils.readFile(filePath);

      expect(result).toBe(content);
    });
  });

  describe('exists', () => {
    it('should return true if file exists', async () => {
      const filePath = '/test/file.txt';

      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(filePath, 'content');

      const result = await fsUtils.exists(filePath);

      expect(result).toBe(true);
    });

    it('should return true if directory exists', async () => {
      const dirPath = '/test/dir';

      vol.mkdirSync(dirPath, { recursive: true });

      const result = await fsUtils.exists(dirPath);

      expect(result).toBe(true);
    });

    it('should return false if path does not exist', async () => {
      const result = await fsUtils.exists('/nonexistent');

      expect(result).toBe(false);
    });

    it('should normalize paths', async () => {
      const filePath = '/test//file.txt';

      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(path.normalize(filePath), 'content');

      const result = await fsUtils.exists(filePath);

      expect(result).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove a file', async () => {
      const filePath = '/test/file.txt';

      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(filePath, 'content');

      await fsUtils.remove(filePath);

      expect(vol.existsSync(filePath)).toBe(false);
    });

    it('should remove a directory recursively', async () => {
      const dirPath = '/test/dir';

      vol.mkdirSync(dirPath, { recursive: true });
      vol.writeFileSync(`${dirPath}/file.txt`, 'content');

      await fsUtils.remove(dirPath);

      expect(vol.existsSync(dirPath)).toBe(false);
    });

    it('should not throw if path does not exist', async () => {
      await expect(fsUtils.remove('/nonexistent')).resolves.not.toThrow();
    });

    it('should normalize paths', async () => {
      const filePath = '/test//file.txt';

      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(path.normalize(filePath), 'content');

      await fsUtils.remove(filePath);

      expect(vol.existsSync(path.normalize(filePath))).toBe(false);
    });
  });

  describe('createTempDir', () => {
    it('should create a temporary directory', async () => {
      const tempDir = await fsUtils.createTempDir();

      expect(tempDir).toBeDefined();
      expect(typeof tempDir).toBe('string');
      expect(tempDir).toContain('btools-');
      expect(vol.existsSync(tempDir)).toBe(true);
    });

    it('should create unique directories on multiple calls', async () => {
      const tempDir1 = await fsUtils.createTempDir();
      const tempDir2 = await fsUtils.createTempDir();

      expect(tempDir1).not.toBe(tempDir2);
      expect(vol.existsSync(tempDir1)).toBe(true);
      expect(vol.existsSync(tempDir2)).toBe(true);
    });
  });

  describe('moveAtomic', () => {
    it('should move a file atomically', async () => {
      const src = '/source/file.txt';
      const dest = '/destination/file.txt';

      vol.mkdirSync('/source', { recursive: true });
      vol.writeFileSync(src, 'content');

      await fsUtils.moveAtomic(src, dest);

      expect(vol.existsSync(dest)).toBe(true);
      expect(vol.existsSync(src)).toBe(false);
      expect(vol.readFileSync(dest, 'utf-8')).toBe('content');
    });

    it('should move a directory atomically', async () => {
      const src = '/source/dir';
      const dest = '/destination/dir';

      vol.mkdirSync(src, { recursive: true });
      vol.writeFileSync(`${src}/file.txt`, 'content');

      await fsUtils.moveAtomic(src, dest);

      expect(vol.existsSync(dest)).toBe(true);
      expect(vol.existsSync(src)).toBe(false);
      expect(vol.existsSync(`${dest}/file.txt`)).toBe(true);
    });

    it('should throw FileSystemError if source does not exist', async () => {
      const src = '/nonexistent';
      const dest = '/destination';

      await expect(fsUtils.moveAtomic(src, dest)).rejects.toThrow(FileSystemError);
      await expect(fsUtils.moveAtomic(src, dest)).rejects.toThrow('Source does not exist');
    });

    it('should throw FileSystemError if destination already exists', async () => {
      const src = '/source/file.txt';
      const dest = '/destination/file.txt';

      vol.mkdirSync('/source', { recursive: true });
      vol.mkdirSync('/destination', { recursive: true });
      vol.writeFileSync(src, 'content');
      vol.writeFileSync(dest, 'existing');

      await expect(fsUtils.moveAtomic(src, dest)).rejects.toThrow(FileSystemError);
      await expect(fsUtils.moveAtomic(src, dest)).rejects.toThrow('Destination already exists');
    });

    it('should create destination parent directory if it does not exist', async () => {
      const src = '/source/file.txt';
      const dest = '/destination/nested/file.txt';

      vol.mkdirSync('/source', { recursive: true });
      vol.writeFileSync(src, 'content');

      await fsUtils.moveAtomic(src, dest);

      expect(vol.existsSync(dest)).toBe(true);
      expect(vol.readFileSync(dest, 'utf-8')).toBe('content');
    });

    it('should normalize paths', async () => {
      const src = '/source//file.txt';
      const dest = '/dest//file.txt';

      vol.mkdirSync('/source', { recursive: true });
      vol.writeFileSync(path.normalize(src), 'content');

      await fsUtils.moveAtomic(src, dest);

      const normalizedDest = path.normalize(dest);
      expect(vol.existsSync(normalizedDest)).toBe(true);
    });
  });

  describe('cross-platform path handling', () => {
    it('should handle Windows-style paths', async () => {
      const windowsPath = 'C:\\test\\file.txt';
      const normalizedPath = path.normalize(windowsPath);

      await fsUtils.writeFile(normalizedPath, 'content');

      expect(await fsUtils.exists(normalizedPath)).toBe(true);
    });

    it('should handle Unix-style paths', async () => {
      const unixPath = '/test/file.txt';

      await fsUtils.writeFile(unixPath, 'content');

      expect(await fsUtils.exists(unixPath)).toBe(true);
    });

    it('should handle mixed path separators', async () => {
      const mixedPath = '/test\\dir/file.txt';
      const normalizedPath = path.normalize(mixedPath);

      await fsUtils.writeFile(normalizedPath, 'content');

      expect(await fsUtils.exists(normalizedPath)).toBe(true);
    });

    it('should handle relative paths with ..', async () => {
      const relativePath = '/test/dir/../file.txt';
      const normalizedPath = path.normalize(relativePath);

      await fsUtils.writeFile(normalizedPath, 'content');

      expect(await fsUtils.exists(normalizedPath)).toBe(true);
      expect(normalizedPath).toBe(path.normalize('/test/file.txt'));
    });
  });
});
