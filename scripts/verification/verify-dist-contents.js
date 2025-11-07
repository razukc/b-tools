#!/usr/bin/env node

/**
 * Comprehensive verification script for dist directory contents
 * Task 9.4.4: Verify dist directory contents
 * 
 * Checks:
 * - dist/cli/index.js exists with shebang
 * - dist/index.js exists (main entry point)
 * - All .d.ts declaration files are generated
 * - Source maps (.map files) are present
 * - All necessary subdirectories exist
 */

import { existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { join, extname } from 'path';

const results = {
  passed: [],
  failed: [],
  warnings: []
};

function log(message, type = 'info') {
  const prefix = {
    pass: '✓',
    fail: '✗',
    warn: '⚠',
    info: 'ℹ'
  }[type] || '';
  
  console.log(`${prefix} ${message}`);
  
  if (type === 'pass') results.passed.push(message);
  if (type === 'fail') results.failed.push(message);
  if (type === 'warn') results.warnings.push(message);
}

function checkFileExists(path, description) {
  if (existsSync(path)) {
    log(`${description} exists`, 'pass');
    return true;
  } else {
    log(`${description} does NOT exist`, 'fail');
    return false;
  }
}

function checkShebang(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const firstLine = content.split('\n')[0];
    
    if (firstLine.startsWith('#!/usr/bin/env node')) {
      log(`${filePath} has correct shebang`, 'pass');
      return true;
    } else {
      log(`${filePath} missing or incorrect shebang (found: "${firstLine}")`, 'fail');
      return false;
    }
  } catch (error) {
    log(`Error reading ${filePath}: ${error.message}`, 'fail');
    return false;
  }
}

function findAllFiles(dir, fileList = []) {
  if (!existsSync(dir)) return fileList;
  
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkDeclarationFiles() {
  console.log('\n3. Checking TypeScript declaration files (.d.ts)...');
  
  const allFiles = findAllFiles('dist');
  // Exclude template files - they are not compiled TypeScript, just template assets
  const jsFiles = allFiles.filter(f => {
    const normalized = f.replace(/\\/g, '/');
    return f.endsWith('.js') && 
           !f.endsWith('.d.ts') &&
           !normalized.includes('templates/vanilla/files');
  });
  const dtsFiles = allFiles.filter(f => f.endsWith('.d.ts'));
  
  log(`Found ${jsFiles.length} compiled .js files (excluding templates)`, 'info');
  log(`Found ${dtsFiles.length} .d.ts files`, 'info');
  
  let missingDeclarations = 0;
  
  jsFiles.forEach(jsFile => {
    const expectedDts = jsFile.replace(/\.js$/, '.d.ts');
    if (!existsSync(expectedDts)) {
      log(`Missing declaration file: ${expectedDts}`, 'fail');
      missingDeclarations++;
    }
  });
  
  if (missingDeclarations === 0) {
    log(`All compiled .js files have corresponding .d.ts files`, 'pass');
  } else {
    log(`${missingDeclarations} compiled .js files missing .d.ts files`, 'fail');
  }
  
  return missingDeclarations === 0;
}

function checkSourceMaps() {
  console.log('\n4. Checking source maps (.map files)...');
  
  const allFiles = findAllFiles('dist');
  // Exclude template files - they are not compiled TypeScript, just template assets
  const jsFiles = allFiles.filter(f => {
    const normalized = f.replace(/\\/g, '/');
    return f.endsWith('.js') && 
           !f.endsWith('.d.ts') &&
           !normalized.includes('templates/vanilla/files');
  });
  const mapFiles = allFiles.filter(f => f.endsWith('.js.map'));
  
  log(`Found ${jsFiles.length} compiled .js files (excluding templates)`, 'info');
  log(`Found ${mapFiles.length} .js.map files`, 'info');
  
  let missingMaps = 0;
  
  jsFiles.forEach(jsFile => {
    const expectedMap = jsFile + '.map';
    if (!existsSync(expectedMap)) {
      log(`Missing source map: ${expectedMap}`, 'fail');
      missingMaps++;
    }
  });
  
  if (missingMaps === 0) {
    log(`All compiled .js files have corresponding .map files`, 'pass');
  } else {
    log(`${missingMaps} compiled .js files missing .map files`, 'fail');
  }
  
  return missingMaps === 0;
}

function checkSubdirectories() {
  console.log('\n5. Checking necessary subdirectories...');
  
  const requiredDirs = [
    'dist/cli',
    'dist/commands',
    'dist/core',
    'dist/core/manifest',
    'dist/core/template',
    'dist/utils',
    'dist/schemas',
    'dist/templates',
    'dist/templates/vanilla'
  ];
  
  let allExist = true;
  
  requiredDirs.forEach(dir => {
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      log(`${dir} exists`, 'pass');
    } else {
      log(`${dir} does NOT exist or is not a directory`, 'fail');
      allExist = false;
    }
  });
  
  return allExist;
}

// Main execution
console.log('='.repeat(70));
console.log('DIST DIRECTORY CONTENTS VERIFICATION');
console.log('Task 9.4.4: Verify dist directory contents');
console.log('='.repeat(70));

// 1. Check dist/cli/index.js exists with shebang
console.log('\n1. Checking dist/cli/index.js with shebang...');
const cliExists = checkFileExists('dist/cli/index.js', 'dist/cli/index.js');
if (cliExists) {
  checkShebang('dist/cli/index.js');
}

// 2. Check dist/index.js exists (main entry point)
console.log('\n2. Checking dist/index.js (main entry point)...');
checkFileExists('dist/index.js', 'dist/index.js (main entry point)');

// 3. Verify all .d.ts declaration files are generated
const declarationsOk = checkDeclarationFiles();

// 4. Verify source maps (.map files) are present
const sourceMapsOk = checkSourceMaps();

// 5. Check that all necessary subdirectories exist
const subdirsOk = checkSubdirectories();

// Print summary
console.log('\n' + '='.repeat(70));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(70));

console.log(`\n✓ Passed: ${results.passed.length}`);
console.log(`✗ Failed: ${results.failed.length}`);
console.log(`⚠ Warnings: ${results.warnings.length}`);

if (results.failed.length > 0) {
  console.log('\n❌ VERIFICATION FAILED\n');
  console.log('Failed checks:');
  results.failed.forEach(msg => console.log(`  ✗ ${msg}`));
  process.exit(1);
} else {
  console.log('\n✅ ALL CHECKS PASSED\n');
  console.log('Summary:');
  console.log('  ✓ dist/cli/index.js exists with correct shebang');
  console.log('  ✓ dist/index.js exists (main entry point)');
  console.log('  ✓ All .d.ts declaration files generated');
  console.log('  ✓ All source maps (.map files) present');
  console.log('  ✓ All necessary subdirectories exist');
  process.exit(0);
}
