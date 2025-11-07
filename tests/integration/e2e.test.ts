/**
 * End-to-end integration tests
 * Tests complete workflow: create -> install -> build -> verify
 */

import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createCommand } from '../../src/commands/create.js';

const execAsync = promisify(exec);

describe('end-to-end workflow', () => {
  // Helper to create a unique test directory for each test
  async function createTestDir(): Promise<string> {
    return await fs.mkdtemp(path.join(os.tmpdir(), 'btools-e2e-'));
  }

  // Helper to cleanup test directory
  async function cleanupTestDir(dir: string): Promise<void> {
    if (dir && (await fs.pathExists(dir))) {
      await fs.remove(dir);
    }
  }

  it('should create, install, and build a working extension', async () => {
    const testDir = await createTestDir();
    
    try {
      const projectName = 'test-extension';
      
      // Step 1: Create project
      const result = await createCommand(projectName, {
        template: 'vanilla',
        directory: testDir,
      });

      expect(result.success).toBe(true);
      
      const projectPath = path.join(testDir, projectName);
      expect(await fs.pathExists(projectPath)).toBe(true);

      // Step 2: Install dependencies
      console.log('Installing dependencies...');
      await execAsync('npm install', {
        cwd: projectPath,
        timeout: 120000, // 2 minutes timeout
      });
      
      // Verify node_modules was created
      expect(await fs.pathExists(path.join(projectPath, 'node_modules'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'node_modules/vite'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'node_modules/@crxjs/vite-plugin'))).toBe(true);

      // Step 3: Build the extension
      console.log('Building extension...');
      await execAsync('npm run build', {
        cwd: projectPath,
        timeout: 60000, // 1 minute timeout
      });

      // Step 4: Verify dist directory structure
      const distPath = path.join(projectPath, 'dist');
      expect(await fs.pathExists(distPath)).toBe(true);

      // Verify manifest.json in dist
      const distManifestPath = path.join(distPath, 'manifest.json');
      expect(await fs.pathExists(distManifestPath)).toBe(true);
      
      const distManifest = await fs.readJson(distManifestPath);
      expect(distManifest.manifest_version).toBe(3);
      expect(distManifest.name).toBe(projectName);

      // Verify built files exist
      // Note: @crxjs/vite-plugin handles the bundling, so exact output structure may vary
      // We verify that key files are present
      expect(await fs.pathExists(path.join(distPath, 'manifest.json'))).toBe(true);
      
      // Verify icons were copied
      const iconsExist = 
        (await fs.pathExists(path.join(distPath, 'public/icons/icon16.png'))) ||
        (await fs.pathExists(path.join(distPath, 'icons/icon16.png'))) ||
        (await fs.pathExists(path.join(distPath, 'icon16.png')));
      expect(iconsExist).toBe(true);

      // Verify the manifest references valid paths
      // The plugin should have processed the manifest
      expect(distManifest.action).toBeDefined();
      expect(distManifest.background).toBeDefined();
      expect(distManifest.icons).toBeDefined();

      console.log('✓ End-to-end test passed: create -> install -> build');
    } finally {
      await cleanupTestDir(testDir);
    }
  }, 180000); // 3 minutes total timeout for the entire test

  it('should generate extension that passes basic validation', async () => {
    const testDir = await createTestDir();
    
    try {
      const projectName = 'validation-test';
      
      // Create project
      await createCommand(projectName, {
        template: 'vanilla',
        directory: testDir,
      });

      const projectPath = path.join(testDir, projectName);

      // Install and build
      await execAsync('npm install', {
        cwd: projectPath,
        timeout: 120000,
      });

      await execAsync('npm run build', {
        cwd: projectPath,
        timeout: 60000,
      });

      // Validate the built extension
      const distPath = path.join(projectPath, 'dist');
      const manifest = await fs.readJson(path.join(distPath, 'manifest.json'));

      // Validate required fields
      expect(manifest.manifest_version).toBe(3);
      expect(manifest.name).toBeTruthy();
      expect(manifest.version).toBeTruthy();
      expect(manifest.description).toBeTruthy();

      // Validate version format (1-4 dot-separated integers)
      const versionRegex = /^\d+(\.\d+){0,3}$/;
      expect(versionRegex.test(manifest.version)).toBe(true);

      // Validate action configuration
      expect(manifest.action).toBeDefined();
      expect(manifest.action.default_popup).toBeTruthy();
      expect(manifest.action.default_icon).toBeDefined();

      // Validate background service worker
      expect(manifest.background).toBeDefined();
      expect(manifest.background.service_worker).toBeTruthy();

      // Validate icons
      expect(manifest.icons).toBeDefined();
      expect(manifest.icons['16']).toBeTruthy();
      expect(manifest.icons['48']).toBeTruthy();
      expect(manifest.icons['128']).toBeTruthy();

      console.log('✓ Extension passed validation checks');
    } finally {
      await cleanupTestDir(testDir);
    }
  }, 180000);

  it('should generate extension with working source files', async () => {
    const testDir = await createTestDir();
    
    try {
      const projectName = 'source-test';
      
      // Create project
      await createCommand(projectName, {
        template: 'vanilla',
        directory: testDir,
      });

      const projectPath = path.join(testDir, projectName);

      // Verify source files have valid content
      const popupHtml = await fs.readFile(
        path.join(projectPath, 'src/popup/popup.html'),
        'utf-8'
      );
      expect(popupHtml).toContain('<!DOCTYPE html>');
      expect(popupHtml).toContain('<html');
      expect(popupHtml).toContain('</html>');

      const popupJs = await fs.readFile(
        path.join(projectPath, 'src/popup/popup.js'),
        'utf-8'
      );
      expect(popupJs.length).toBeGreaterThan(0);

      const backgroundJs = await fs.readFile(
        path.join(projectPath, 'src/background/background.js'),
        'utf-8'
      );
      expect(backgroundJs.length).toBeGreaterThan(0);
      expect(backgroundJs).toContain('chrome');

      const contentJs = await fs.readFile(
        path.join(projectPath, 'src/content/content.js'),
        'utf-8'
      );
      expect(contentJs.length).toBeGreaterThan(0);

      console.log('✓ Source files are valid');
    } finally {
      await cleanupTestDir(testDir);
    }
  });
});
