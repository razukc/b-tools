#!/usr/bin/env node

/**
 * Verification script for compiled JavaScript files
 * Task 9.4.3.6: Verify compiled JavaScript files
 * 
 * Checks:
 * 1. All .ts files have corresponding .js files in dist
 * 2. Main entry points exist (dist/index.js, dist/cli/index.js)
 * 3. Spot-check compiled files for proper ES2020 syntax
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errors = [];
const warnings = [];
const info = [];

/**
 * Recursively find all .ts files in a directory
 */
function findTypeScriptFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...findTypeScriptFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      // Get relative path from base directory
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Check if a .js file exists for a given .ts file
 */
function checkCompiledFile(tsFile) {
  const srcPath = path.join(__dirname, 'src', tsFile);
  const jsFile = tsFile.replace(/\.ts$/, '.js');
  const distPath = path.join(__dirname, 'dist', jsFile);

  if (!fs.existsSync(distPath)) {
    errors.push(`Missing compiled file: ${jsFile} (source: ${tsFile})`);
    return false;
  }

  info.push(`✓ Found compiled file: ${jsFile}`);
  return true;
}

/**
 * Check main entry points
 */
function checkEntryPoints() {
  console.log('\n=== Checking Main Entry Points ===\n');

  const entryPoints = [
    { path: 'dist/index.js', description: 'Main library entry point' },
    { path: 'dist/cli/index.js', description: 'CLI entry point' }
  ];

  for (const entry of entryPoints) {
    const fullPath = path.join(__dirname, entry.path);
    
    if (fs.existsSync(fullPath)) {
      console.log(`✓ ${entry.description}: ${entry.path}`);
      
      // Check if CLI entry has shebang
      if (entry.path === 'dist/cli/index.js') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.startsWith('#!/usr/bin/env node')) {
          console.log('  ✓ Has shebang for CLI execution');
        } else {
          warnings.push('CLI entry point missing shebang');
        }
      }
    } else {
      errors.push(`Missing entry point: ${entry.path} (${entry.description})`);
    }
  }
}

/**
 * Spot-check compiled files for ES2020 syntax
 */
function spotCheckES2020Syntax() {
  console.log('\n=== Spot-Checking ES2020 Syntax ===\n');

  const filesToCheck = [
    'dist/index.js',
    'dist/cli/program.js',
    'dist/commands/create.js',
    'dist/core/manifest/generator.js',
    'dist/utils/fs.js'
  ];

  for (const file of filesToCheck) {
    const fullPath = path.join(__dirname, file);
    
    if (!fs.existsSync(fullPath)) {
      warnings.push(`Cannot spot-check ${file}: file not found`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    
    console.log(`Checking ${file}:`);

    // Check for ES2020 features
    const checks = {
      'ES modules (import/export)': /^(import|export)\s/m.test(content),
      'Optional chaining (?.))': /\?\./m.test(content),
      'Nullish coalescing (??)': /\?\?/m.test(content),
      'No var declarations': !/\bvar\s+\w+\s*=/m.test(content),
      'Uses const/let': /\b(const|let)\s+\w+\s*=/m.test(content),
      'Arrow functions': /=>\s*[{(]/m.test(content),
      'Template literals': /`[^`]*\$\{[^}]+\}/m.test(content)
    };

    let hasES2020Features = false;
    for (const [feature, found] of Object.entries(checks)) {
      if (found) {
        console.log(`  ✓ ${feature}`);
        hasES2020Features = true;
      }
    }

    if (!hasES2020Features) {
      warnings.push(`${file} may not be using ES2020 features`);
    }

    // Check for problematic patterns
    if (content.includes('require(')) {
      warnings.push(`${file} contains require() - should use ES modules`);
    }

    console.log('');
  }
}

/**
 * Main verification function
 */
function main() {
  console.log('=== Verifying Compiled JavaScript Files ===\n');
  console.log('Task 9.4.3.6: Verify compiled JavaScript files\n');

  // Check 1: Main entry points
  checkEntryPoints();

  // Check 2: All .ts files have corresponding .js files
  console.log('\n=== Checking TypeScript to JavaScript Compilation ===\n');
  
  const srcDir = path.join(__dirname, 'src');
  const tsFiles = findTypeScriptFiles(srcDir);
  
  console.log(`Found ${tsFiles.length} TypeScript files in src/\n`);

  let compiledCount = 0;
  for (const tsFile of tsFiles) {
    if (checkCompiledFile(tsFile)) {
      compiledCount++;
    }
  }

  console.log(`\n${compiledCount}/${tsFiles.length} TypeScript files have compiled JavaScript files`);

  // Check 3: Spot-check ES2020 syntax
  spotCheckES2020Syntax();

  // Summary
  console.log('\n=== Verification Summary ===\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✓ All checks passed!');
    console.log(`  - ${compiledCount} TypeScript files compiled successfully`);
    console.log('  - Main entry points exist');
    console.log('  - ES2020 syntax verified in spot-checked files');
    return 0;
  }

  if (errors.length > 0) {
    console.log(`✗ ${errors.length} error(s) found:\n`);
    errors.forEach(err => console.log(`  - ${err}`));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠ ${warnings.length} warning(s):\n`);
    warnings.forEach(warn => console.log(`  - ${warn}`));
  }

  return errors.length > 0 ? 1 : 0;
}

// Run verification
const exitCode = main();
process.exit(exitCode);
