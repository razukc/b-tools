# Release Guide

Quick reference for releasing new versions of `extn` using `release-it`.

## Prerequisites

- ✅ All tests passing
- ✅ Clean git working directory
- ✅ On `main` branch
- ✅ `.env` file with `GITHUB_TOKEN` and `NPM_TOKEN`
- ✅ Upstream configured (`git remote -v`)

## Release Process

### 1. Prepare for Release

```bash
# Ensure everything is committed
git status

# Run tests locally
npm test

# Build to verify
npm run build
```

### 2. Dry Run (Recommended)

```bash
# See what will happen without actually releasing
npm run release:dry
```

This shows you:
- What version will be bumped to
- What will be in the CHANGELOG
- What commits will be included
- What tags will be created

### 3. Release

```bash
# For minor version (0.1.x -> 0.2.0)
npm run release:minor

# For patch version (0.2.0 -> 0.2.1)
npm run release:patch

# For major version (0.2.x -> 1.0.0)
npm run release:major

# Or let release-it prompt you
npm run release
```

### 4. What Happens Automatically

`release-it` will:

1. **Pre-checks**:
   - Run `npm run lint`
   - Run `npm run test:unit`

2. **Version Bump**:
   - Update `package.json` version
   - Update `CHANGELOG.md` with conventional commits

3. **Build**:
   - Run `npm run build`

4. **Git Operations**:
   - Create commit: `chore: release v${version}`
   - Create tag: `v${version}`
   - Push to GitHub

5. **Publish**:
   - Create GitHub release (auto-generated notes)
   - Publish to NPM

6. **Post-release**:
   - Echo success message

## Troubleshooting

### "Working directory is not clean"

```bash
# Commit or stash your changes
git add .
git commit -m "chore: prepare for release"
```

### "Not on main branch"

```bash
# Switch to main branch
git checkout main
```

### "No upstream configured"

```bash
# Set upstream
git branch --set-upstream-to=origin/main main
```

### "GitHub token not found"

```bash
# Ensure .env file exists with GITHUB_TOKEN
cat .env | grep GITHUB_TOKEN
```

### "NPM authentication failed"

```bash
# Option 1: Use NPM_TOKEN in .env
echo "NPM_TOKEN=your_token_here" >> .env

# Option 2: Login to npm
npm login
```

### Tests failing

```bash
# Fix tests first
npm test

# Then try release again
npm run release:minor
```

## Version Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.2.0): New features, backward compatible
- **PATCH** (0.2.1): Bug fixes, backward compatible

### Current Version: 0.2.0

Next versions:
- **0.2.1**: Bug fixes only
- **0.3.0**: New features (React template, etc.)
- **1.0.0**: Stable API, production ready

## Conventional Commits

`release-it` uses conventional commits to generate CHANGELOG:

```bash
# Features
git commit -m "feat: add React template support"

# Bug fixes
git commit -m "fix: resolve manifest validation error"

# Performance
git commit -m "perf: optimize template rendering"

# Documentation
git commit -m "docs: update README with new examples"

# Refactoring
git commit -m "refactor: simplify template engine"

# Tests
git commit -m "test: add integration tests for build command"

# Chores (hidden in CHANGELOG)
git commit -m "chore: update dependencies"
```

## Post-Release Checklist

After successful release:

- [ ] Verify on NPM: https://www.npmjs.com/package/extn
- [ ] Check GitHub release: https://github.com/razukc/extn/releases
- [ ] Test installation: `npm install -g extn@latest`
- [ ] Create test project: `extn create test-release`
- [ ] Verify functionality: `cd test-release && npm install && npm run dev`

## Emergency Rollback

If something goes wrong after publishing:

```bash
# Deprecate the bad version on NPM
npm deprecate extn@0.2.0 "This version has issues, use 0.2.1 instead"

# Fix the issue and release a patch
npm run release:patch
```

## Configuration Files

- `.release-it.json` - Release-it configuration
- `.env` - Environment variables (GITHUB_TOKEN, NPM_TOKEN)
- `CHANGELOG.md` - Auto-generated changelog
- `package.json` - Version and scripts

## Useful Commands

```bash
# Check current version
npm version

# View git tags
git tag -l

# View latest release
git describe --tags --abbrev=0

# View unpublished commits
git log $(git describe --tags --abbrev=0)..HEAD --oneline

# Check NPM package info
npm view extn

# Check what files will be published
npm pack --dry-run
```

## Resources

- [release-it Documentation](https://github.com/release-it/release-it)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [NPM Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
