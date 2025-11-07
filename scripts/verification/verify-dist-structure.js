#!/usr/bin/env node

/**
 * Verification script for dist directory structure
 * Task 9.4.3.5: Verify dist directory structure
 */

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const EXPECTED_STRUCTURE = {
  'dist': {
    type: 'directory',
    required: true,
    children: {
      'cli': { type: 'directory', required: true },
      'commands': { type: 'directory', required: true },
      'core': { type: 'directory', required: true },
      'utils': { type: 'directory', required: true },
      'schemas': { type: 'directory', required: true },
      'templates': { type: 'directory', required: true },
      'index.js': { type: 'file', required: true },
      'index.d.ts': { type: 'file', required: true },
      'index.js.map': { type: 'file', required: true },
      'index.d.ts.map': { type: 'file', required: true }
    }
  }
};

const EXPECTED_SUBDIRS = ['cli', 'commands', 'core', 'utils', 'schemas', 'templates'];

const results = {
  passed: [],
  failed: [],
  warnings: []
};

function checkExists(path, name) {
  if (existsSync(path)) {
    results.passed.push(`✓ ${name} exists`);
    return true;
  } else {
    results.failed.push(`✗ ${name} does not exist`);
    return false;
  }
}

function checkDirectory(path, name) {
  if (!existsSync(path)) {
    results.failed.push(`✗ ${name} does not exist`);
    return false;
  }
  
  const stats = statSync(path);
  if (stats.isDirectory()) {
    results.passed.push(`✓ ${name} is a directory`);
    return true;
  } else {
    results.failed.push(`✗ ${name} exists but is not a directory`);
    return false;
  }
}

function checkFile(path, name) {
  if (!existsSync(path)) {
    results.failed.push(`✗ ${name} does not exist`);
    return false;
  }
  
  const stats = statSync(path);
  if (stats.isFile()) {
    results.passed.push(`✓ ${name} is a file`);
    return true;
  } else {
    results.failed.push(`✗ ${name} exists but is not a file`);
    return false;
  }
}

function checkUnexpectedFiles(dirPath, expectedItems) {
  const actualItems = readdirSync(dirPath);
  const unexpected = actualItems.filter(item => !expectedItems.includes(item));
  
  if (unexpected.length > 0) {
    unexpected.forEach(item => {
      results.warnings.push(`⚠ Unexpected item in ${dirPath}: ${item}`);
    });
  }
  
  return unexpected.length === 0;
}

console.log('='.repeat(60));
console.log('Verifying dist directory structure');
console.log('Task 9.4.3.5: Verify dist directory structure');
console.log('='.repeat(60));
console.log();

// 1. Check dist directory exists and is populated
console.log('1. Checking dist directory exists...');
if (!checkDirectory('dist', 'dist directory')) {
  console.log('\n❌ FAILED: dist directory does not exist');
  process.exit(1);
}
console.log();

// 2. Verify all expected subdirectories are present
console.log('2. Checking expected subdirectories...');
EXPECTED_SUBDIRS.forEach(subdir => {
  checkDirectory(join('dist', subdir), `dist/${subdir}`);
});
console.log();

// 3. Check main entry point files
console.log('3. Checking main entry point files...');
checkFile('dist/index.js', 'dist/index.js');
checkFile('dist/index.d.ts', 'dist/index.d.ts');
checkFile('dist/index.js.map', 'dist/index.js.map');
checkFile('dist/index.d.ts.map', 'dist/index.d.ts.map');
console.log();

// 4. Check CLI entry point
console.log('4. Checking CLI entry point...');
checkFile('dist/cli/index.js', 'dist/cli/index.js');
checkFile('dist/cli/index.d.ts', 'dist/cli/index.d.ts');
console.log();

// 5. Check for unexpected files in dist root
console.log('5. Checking for unexpected files in dist root...');
const expectedRootItems = [
  ...EXPECTED_SUBDIRS,
  'index.js',
  'index.d.ts',
  'index.js.map',
  'index.d.ts.map'
];
checkUnexpectedFiles('dist', expectedRootItems);
console.log();

// 6. Verify core subdirectories
console.log('6. Checking core subdirectories...');
checkDirectory('dist/core/manifest', 'dist/core/manifest');
checkDirectory('dist/core/template', 'dist/core/template');
console.log();

// 7. Verify schemas contains JSON schema
console.log('7. Checking schemas directory...');
checkFile('dist/schemas/chrome-manifest.schema.json', 'dist/schemas/chrome-manifest.schema.json');
checkFile('dist/schemas/index.js', 'dist/schemas/index.js');
console.log();

// 8. Verify templates directory
console.log('8. Checking templates directory...');
checkDirectory('dist/templates/vanilla', 'dist/templates/vanilla');
checkFile('dist/templates/vanilla/template.json', 'dist/templates/vanilla/template.json');
console.log();

// Print summary
console.log('='.repeat(60));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(60));
console.log();

if (results.passed.length > 0) {
  console.log(`✓ Passed checks: ${results.passed.length}`);
  results.passed.forEach(msg => console.log(`  ${msg}`));
  console.log();
}

if (results.warnings.length > 0) {
  console.log(`⚠ Warnings: ${results.warnings.length}`);
  results.warnings.forEach(msg => console.log(`  ${msg}`));
  console.log();
}

if (results.failed.length > 0) {
  console.log(`✗ Failed checks: ${results.failed.length}`);
  results.failed.forEach(msg => console.log(`  ${msg}`));
  console.log();
  console.log('❌ VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL CHECKS PASSED');
  console.log();
  console.log('Summary:');
  console.log(`  - dist directory exists and is populated`);
  console.log(`  - All expected subdirectories present: ${EXPECTED_SUBDIRS.join(', ')}`);
  console.log(`  - Main entry points exist (index.js, index.d.ts)`);
  console.log(`  - CLI entry point exists (cli/index.js)`);
  console.log(`  - Core subdirectories present (manifest, template)`);
  console.log(`  - Schemas directory contains chrome-manifest.schema.json`);
  console.log(`  - Templates directory contains vanilla template`);
  if (results.warnings.length === 0) {
    console.log(`  - No unexpected files or directories found`);
  }
  process.exit(0);
}
