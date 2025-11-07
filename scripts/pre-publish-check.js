#!/usr/bin/env node

/**
 * Pre-publish validation script
 * Checks if everything is ready for the first publish
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const checks = [];
let passed = 0;
let failed = 0;

function check(name, fn) {
  checks.push({ name, fn });
}

function run(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe', ...options });
  } catch (error) {
    return null;
  }
}

function fileExists(path) {
  return existsSync(join(process.cwd(), path));
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), path), 'utf8'));
  } catch {
    return null;
  }
}

// Define checks
check('package.json exists', () => fileExists('package.json'));
check('package.json is valid JSON', () => readJson('package.json') !== null);
check('LICENSE file exists', () => fileExists('LICENSE'));
check('README.md exists', () => fileExists('README.md'));
check('CHANGELOG.md exists', () => fileExists('CHANGELOG.md'));
check('.gitignore exists', () => fileExists('.gitignore'));
check('.env.example exists', () => fileExists('.env.example'));
check('.release-it.json exists', () => fileExists('.release-it.json'));

check('Git repository initialized', () => fileExists('.git'));
check('Git remote configured', () => {
  const remote = run('git remote -v');
  return remote && remote.includes('origin');
});

check('Working directory is clean', () => {
  const status = run('git status --porcelain');
  return status !== null && status.trim() === '';
});

check('On main branch', () => {
  const branch = run('git branch --show-current');
  return branch && branch.trim() === 'main';
});

check('TypeScript compiles', () => {
  const result = run('npm run build');
  return result !== null;
});

check('dist/ directory exists after build', () => fileExists('dist'));
check('dist/cli/index.js exists', () => fileExists('dist/cli/index.js'));

check('Tests pass', () => {
  const result = run('npm test -- --run');
  return result !== null;
});

check('No linting errors', () => {
  const result = run('npm run lint');
  return result !== null;
});

check('npm logged in', () => {
  const whoami = run('npm whoami');
  return whoami !== null && whoami.trim().length > 0;
});

check('.env file exists (for GitHub token)', () => fileExists('.env'));

check('.env contains GITHUB_TOKEN', () => {
  if (!fileExists('.env')) return false;
  const env = readFileSync(join(process.cwd(), '.env'), 'utf8');
  return env.includes('GITHUB_TOKEN=') && !env.includes('your_github_token_here');
});

check('package.json has required fields', () => {
  const pkg = readJson('package.json');
  if (!pkg) return false;
  return (
    pkg.name &&
    pkg.version &&
    pkg.description &&
    pkg.author &&
    pkg.license &&
    pkg.repository &&
    pkg.bin
  );
});

check('package.json files array is defined', () => {
  const pkg = readJson('package.json');
  return pkg && Array.isArray(pkg.files) && pkg.files.length > 0;
});

// Run all checks
console.log('\n🔍 Pre-Publish Validation\n');
console.log('Running checks...\n');

for (const { name, fn } of checks) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name} (error: ${error.message})`);
    failed++;
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✨ All checks passed! You\'re ready to publish.\n');
  console.log('Next steps:');
  console.log('1. Review docs/FIRST_PUBLISH_CHECKLIST.md');
  console.log('2. Run: npm run release:dry (test release)');
  console.log('3. Run: npm run release (actual release)\n');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above.\n');
  console.log('Common fixes:');
  console.log('- npm login (if not logged in)');
  console.log('- cp .env.example .env (add GitHub token)');
  console.log('- git add . && git commit -m "..." (commit changes)');
  console.log('- npm run build (build the project)');
  console.log('- npm test (fix failing tests)\n');
  process.exit(1);
}
