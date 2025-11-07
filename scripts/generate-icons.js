#!/usr/bin/env node

/**
 * Generate minimal placeholder PNG icons for the vanilla template
 * Creates simple colored square icons without external dependencies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal PNG data for colored squares (base64 encoded)
// These are actual valid PNG files - simple colored squares

// 16x16 blue square
const icon16Base64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVR42mNgYGD4z4AEjAxQgGkAyQYwMTAwMDIyMjAwMDAwMDAwMDAwMDAwMDAwMAAABvwA/3+K/ZAAAAAASUVORK5CYII=';

// 48x48 blue square
const icon48Base64 = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAARUlEQVR42u3QMQEAAAjDMMC/5+ECjiYKenbZCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQPBWYKfyAf/7hPBrAAAAAElFTkSuQmCC';

// 128x128 blue square
const icon128Base64 = 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAxUlEQVR42u3QMQEAAAjDMMC/5+ECjiYKenbZCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoHgrcBOlQH/+4TwawAAAABJRU5ErkJggg==';

const iconsDir = path.join(__dirname, '..', 'src', 'templates', 'vanilla', 'files', 'public', 'icons');

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Write icon files
fs.writeFileSync(path.join(iconsDir, 'icon16.png'), Buffer.from(icon16Base64, 'base64'));
fs.writeFileSync(path.join(iconsDir, 'icon48.png'), Buffer.from(icon48Base64, 'base64'));
fs.writeFileSync(path.join(iconsDir, 'icon128.png'), Buffer.from(icon128Base64, 'base64'));

console.log('✓ Generated placeholder icons:');
console.log('  - icon16.png (16x16)');
console.log('  - icon48.png (48x48)');
console.log('  - icon128.png (128x128)');
