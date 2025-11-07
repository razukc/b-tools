import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileSystemUtils } from '../src/utils/fs.js';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';

/**
 * Cross-platform verification tests
 * These tests verify that the CLI works correctly across different operating systems
 * 
 * Requirements tested: 7.1, 7.2, 7.3, 7.4, 7.5
 */
describe('Cross-platform verification', () => {
  let fsUtils: FileSystemUtils;
  let testDir: string;

  beforeEach(async () => {
    fsUtils = new FileSystemUtils();
    // Create a real temporary directory for cross-platform testing
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'btools-xplat-'));
  });

  afterEach(async () => {
    // Clean up test directory
    if (testDir && await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
  });

  describe('Requirement 7.1: Node.js path utilities', () => {
    it('should use path.normalize() for all path operations', async () => {
      const unnormalizedPath = path.join(testDir, 'test', '..', 'file.txt');
      const normalizedPath = path.normalize(path.join(testDir, 'file.txt'));

      await fsUtils.writeFile(unnormalizedPath, 'test content');

      // Verify the file was created at the normalized path
      expect(await fsUtils.exists(normalizedPath)).toBe(true);
      const content = await fsUtils.readFile(normalizedPath);
      expect(content).toBe('test content');
    });

    it('should use path.join() for combining paths', async () => {
      const dir = path.join(testDir, 'subdir');
      const file = path.join(dir, 'file.txt');

      await fsUtils.writeFile(file, 'content');

      expect(await fsUtils.exists(file)).toBe(true);
    });

    it('should handle path.dirname() correctly', async () => {
      const filePath = path.join(testDir, 'nested', 'deep', 'file.txt');
      const dirPath = path.dirname(filePath);

      await fsUtils.writeFile(filePath, 'content');

      // Verify parent directory was created
      expect(await fsUtils.exists(dirPath)).toBe(true);
    });
  });

  describe('Requirement 7.2: Path separator handling', () => {
    it('should handle platform-specific path separators', () => {
      const separator = path.sep;
      
      // Verify we're using the correct separator for the platform
      if (process.platform === 'win32') {
        expect(separator).toBe('\\');
      } else {
        expect(separator).toBe('/');
      }
    });

    it('should normalize mixed path separators', async () => {
      // Create a path with mixed separators
      const mixedPath = testDir + '/subdir\\file.txt';
      const normalizedPath = path.normalize(mixedPath);

      await fsUtils.writeFile(normalizedPath, 'content');

      expect(await fsUtils.exists(normalizedPath)).toBe(true);
    });

    it('should handle forward slashes on all platforms', async () => {
      const forwardSlashPath = path.join(testDir, 'dir/file.txt');
      const normalizedPath = path.normalize(forwardSlashPath);

      await fsUtils.writeFile(normalizedPath, 'content');

      expect(await fsUtils.exists(normalizedPath)).toBe(true);
    });

    it('should handle backslashes correctly', async () => {
      const backslashPath = path.join(testDir, 'dir', 'file.txt');
      
      await fsUtils.writeFile(backslashPath, 'content');

      expect(await fsUtils.exists(backslashPath)).toBe(true);
    });
  });

  describe('Requirement 7.3: Line endings', () => {
    it('should write files with platform-appropriate line endings', async () => {
      const filePath = path.join(testDir, 'lineendings.txt');
      const content = 'line1\nline2\nline3';

      await fsUtils.writeFile(filePath, content);

      // Read the file back
      const readContent = await fsUtils.readFile(filePath);
      
      // Content should be preserved (Node.js handles line endings transparently in text mode)
      expect(readContent).toBe(content);
    });

    it('should handle multi-line content correctly', async () => {
      const filePath = path.join(testDir, 'multiline.txt');
      const lines = ['first line', 'second line', 'third line'];
      const content = lines.join('\n');

      await fsUtils.writeFile(filePath, content);

      const readContent = await fsUtils.readFile(filePath);
      expect(readContent).toBe(content);
    });
  });

  describe('Requirement 7.4: Home directory resolution', () => {
    it('should resolve home directory correctly', () => {
      const homeDir = os.homedir();
      
      expect(homeDir).toBeDefined();
      expect(typeof homeDir).toBe('string');
      expect(homeDir.length).toBeGreaterThan(0);
    });

    it('should handle tilde expansion conceptually', () => {
      const homeDir = os.homedir();
      const expandedPath = path.join(homeDir, '.config', 'btools');
      
      expect(expandedPath).toContain(homeDir);
      expect(path.isAbsolute(expandedPath)).toBe(true);
    });

    it('should create temp directories in system temp location', async () => {
      const tempDir = await fsUtils.createTempDir();
      const systemTmpDir = os.tmpdir();

      expect(tempDir).toContain(path.normalize(systemTmpDir));
      expect(await fsUtils.exists(tempDir)).toBe(true);

      // Cleanup
      await fsUtils.remove(tempDir);
    });
  });

  describe('Requirement 7.5: File permissions', () => {
    it('should create files with appropriate permissions', async () => {
      const filePath = path.join(testDir, 'permissions.txt');

      await fsUtils.writeFile(filePath, 'content');

      const stats = await fs.stat(filePath);
      expect(stats.isFile()).toBe(true);
      
      // On Unix-like systems, check that file is readable and writable
      if (process.platform !== 'win32') {
        const mode = stats.mode;
        // Check owner read/write permissions (0o600)
        expect(mode & 0o400).toBeTruthy(); // Owner read
        expect(mode & 0o200).toBeTruthy(); // Owner write
      }
    });

    it('should create directories with appropriate permissions', async () => {
      const dirPath = path.join(testDir, 'permissions-dir');

      await fsUtils.ensureDir(dirPath);

      const stats = await fs.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
      
      // On Unix-like systems, check directory permissions
      if (process.platform !== 'win32') {
        const mode = stats.mode;
        // Check owner read/write/execute permissions
        expect(mode & 0o400).toBeTruthy(); // Owner read
        expect(mode & 0o200).toBeTruthy(); // Owner write
        expect(mode & 0o100).toBeTruthy(); // Owner execute
      }
    });

    it('should preserve permissions when copying directories', async () => {
      const srcDir = path.join(testDir, 'src-perms');
      const destDir = path.join(testDir, 'dest-perms');
      const filePath = path.join(srcDir, 'file.txt');

      await fsUtils.ensureDir(srcDir);
      await fsUtils.writeFile(filePath, 'content');

      await fsUtils.copyDir(srcDir, destDir);

      const srcStats = await fs.stat(filePath);
      const destStats = await fs.stat(path.join(destDir, 'file.txt'));

      expect(destStats.isFile()).toBe(true);
      // Permissions should be similar (exact comparison may vary by platform)
      expect(destStats.mode & 0o777).toBe(srcStats.mode & 0o777);
    });
  });

  describe('Platform-specific behavior', () => {
    it('should report current platform correctly', () => {
      const platform = process.platform;
      
      expect(platform).toBeDefined();
      expect(['win32', 'darwin', 'linux', 'freebsd', 'openbsd', 'sunos', 'aix']).toContain(platform);
    });

    it('should handle absolute paths correctly on current platform', async () => {
      let absolutePath: string;
      
      if (process.platform === 'win32') {
        // Windows absolute path
        absolutePath = path.join(testDir, 'absolute-test.txt');
        expect(path.isAbsolute(absolutePath)).toBe(true);
        expect(absolutePath).toMatch(/^[A-Za-z]:\\/);
      } else {
        // Unix absolute path
        absolutePath = path.join(testDir, 'absolute-test.txt');
        expect(path.isAbsolute(absolutePath)).toBe(true);
        expect(absolutePath).toMatch(/^\//);
      }

      await fsUtils.writeFile(absolutePath, 'content');
      expect(await fsUtils.exists(absolutePath)).toBe(true);
    });

    it('should handle relative paths correctly', async () => {
      const relativePath = path.join('subdir', 'file.txt');
      const absolutePath = path.join(testDir, relativePath);

      await fsUtils.writeFile(absolutePath, 'content');

      expect(path.isAbsolute(relativePath)).toBe(false);
      expect(path.isAbsolute(absolutePath)).toBe(true);
      expect(await fsUtils.exists(absolutePath)).toBe(true);
    });

    it('should handle path normalization edge cases', () => {
      // Double slashes
      const doubleslash = path.normalize('//test//path//');
      expect(doubleslash).not.toContain('//');

      // Trailing slashes
      const trailing = path.normalize(path.join(testDir, 'test', ''));
      expect(trailing).toBe(path.join(testDir, 'test'));

      // Parent directory references
      const parent = path.normalize(path.join(testDir, 'a', 'b', '..', 'c'));
      expect(parent).toBe(path.join(testDir, 'a', 'c'));
    });
  });

  describe('Atomic operations across platforms', () => {
    it('should perform atomic moves on current platform', async () => {
      const srcPath = path.join(testDir, 'atomic-src', 'file.txt');
      const destPath = path.join(testDir, 'atomic-dest', 'file.txt');

      await fsUtils.writeFile(srcPath, 'atomic content');
      await fsUtils.moveAtomic(srcPath, destPath);

      expect(await fsUtils.exists(destPath)).toBe(true);
      expect(await fsUtils.exists(srcPath)).toBe(false);
      
      const content = await fsUtils.readFile(destPath);
      expect(content).toBe('atomic content');
    });

    it('should handle cross-directory moves', async () => {
      const srcPath = path.join(testDir, 'dir1', 'file.txt');
      const destPath = path.join(testDir, 'dir2', 'file.txt');

      await fsUtils.writeFile(srcPath, 'move content');
      await fsUtils.moveAtomic(srcPath, destPath);

      expect(await fsUtils.exists(destPath)).toBe(true);
      expect(await fsUtils.exists(srcPath)).toBe(false);
    });
  });

  describe('Path delimiter handling', () => {
    it('should use correct path delimiter for platform', () => {
      const delimiter = path.delimiter;
      
      if (process.platform === 'win32') {
        expect(delimiter).toBe(';');
      } else {
        expect(delimiter).toBe(':');
      }
    });

    it('should handle PATH-like strings correctly', () => {
      const paths = ['path1', 'path2', 'path3'];
      const pathString = paths.join(path.delimiter);
      const splitPaths = pathString.split(path.delimiter);

      expect(splitPaths).toEqual(paths);
    });
  });
});
