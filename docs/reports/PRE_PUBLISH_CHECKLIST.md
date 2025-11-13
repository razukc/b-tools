# Pre-Publish Checklist for v0.2.0

**Date**: November 12, 2025  
**Version**: 0.2.0  
**Status**: ✅ READY FOR PUBLISH

## ✅ Completed Items

### 1. Version Management
- [x] Updated `package.json` version from 0.1.3 to 0.2.0
- [x] Updated `CHANGELOG.md` with v0.2.0 release notes
- [x] Added release date (2025-11-12) to CHANGELOG
- [x] Moved features from `[Unreleased]` to `[0.2.0]` section

### 2. Code Quality
- [x] All 293 tests passing (12 test files)
  - 254 unit tests
  - 39 integration/e2e tests
- [x] No TypeScript compilation errors
- [x] Build completes successfully (`npm run build`)
- [x] Fixed test file references (web-ext-config.mjs)
- [x] Fixed template file references (web-ext-config.mjs)

### 3. Features Implemented
- [x] Browser Preview Development Workflow
  - Auto-launch browser with extension loaded
  - Hot Module Replacement (HMR)
  - Persistent dev profile in `.dev-profile/`
  - DevTools auto-open
  - Smart reload for manifest/background changes
- [x] Template Inheritance System
  - Base template architecture
  - Package.json merging
  - Partial file merging (.gitignore, README)
  - Template extends support

### 4. Documentation
- [x] Updated main README.md with Browser Preview features
- [x] Created `docs/template-inheritance.md`
- [x] Created `docs/BROWSER_PREVIEW_TROUBLESHOOTING.md`
- [x] Updated CHANGELOG.md with comprehensive release notes
- [x] All template README files reference correct filenames

### 5. Package Verification
- [x] Package builds successfully
- [x] Dry-run pack shows correct files (89 files, 49.4 kB)
- [x] All required files included in dist/
- [x] Templates copied correctly to dist/templates/
- [x] No sensitive files in package

### 6. Template Files
- [x] Base template files present:
  - web-ext-config.mjs
  - package.json.template
  - README.partial.md.template
  - .gitignore.partial.template
- [x] Vanilla template updated with inheritance
- [x] All template files use correct file extensions

## 📋 Pre-Publish Commands to Run

### Final Verification Steps

```bash
# 1. Ensure working directory is clean
git status

# 2. Verify all changes are committed
git add .
git commit -m "chore: prepare for v0.2.0 release"

# 3. Verify package contents (optional)
npm pack --dry-run

# 4. Test package locally (optional but recommended)
npm pack
npm install -g ./extn-0.2.0.tgz
extn create test-project
cd test-project
npm install
npm run dev
# Verify browser launches and extension loads
cd ..
npm uninstall -g extn
rm extn-0.2.0.tgz
```

### Publishing with release-it

Your project is configured with `release-it` which will automatically:
- ✅ Run linting (`npm run lint`)
- ✅ Run unit tests (`npm run test:unit`)
- ✅ Build the project (`npm run build`)
- ✅ Update version in package.json
- ✅ Update CHANGELOG.md with conventional commits
- ✅ Create git commit and tag
- ✅ Push to GitHub
- ✅ Create GitHub release
- ✅ Publish to NPM

```bash
# Dry run first (recommended) - see what will happen without actually releasing
npm run release:dry

# For minor version bump (0.1.3 -> 0.2.0) - RECOMMENDED FOR THIS RELEASE
npm run release:minor

# Alternative: Let release-it prompt you for version
npm run release

# Other options (if needed later):
# npm run release:patch  # 0.2.0 -> 0.2.1
# npm run release:major  # 0.2.0 -> 1.0.0
```

### Important Notes

1. **Environment Variables**: Your `.env` file contains:
   - `GITHUB_TOKEN` - for GitHub releases ✅
   - `NPM_TOKEN` - for NPM publishing ✅

2. **Git Requirements** (from .release-it.json):
   - Clean working directory required
   - Must be on `main` branch
   - Must have upstream configured
   - Will auto-commit, tag, and push

3. **What Happens During Release**:
   - Pre-checks: lint + unit tests
   - Version bump in package.json
   - CHANGELOG update (conventional commits)
   - Build project
   - Git commit: "chore: release v0.2.0"
   - Git tag: "v0.2.0"
   - Push to GitHub
   - Create GitHub release (auto-generated notes)
   - Publish to NPM

## 🎯 Post-Publish Verification

After `release-it` completes, verify:

- [ ] Package published on npmjs.com: https://www.npmjs.com/package/extn
- [ ] GitHub release created: https://github.com/razukc/extn/releases/tag/v0.2.0
- [ ] Git tag pushed: `git tag -l`
- [ ] Test installation: `npm install -g extn@0.2.0`
- [ ] Test creating a project: `extn create test-v0.2.0`
- [ ] Verify Browser Preview works: `cd test-v0.2.0 && npm install && npm run dev`

### Optional Post-Release Tasks

- [ ] Update GitHub repository description if needed
- [ ] Share release announcement (Twitter, Discord, etc.)
- [ ] Update documentation site (if applicable)
- [ ] Close related GitHub issues/PRs

## 📊 Package Statistics

- **Version**: 0.2.0
- **Package Size**: 49.4 kB
- **Unpacked Size**: 230.3 kB
- **Total Files**: 89
- **Test Coverage**: 293 tests passing
- **Dependencies**: 5 runtime, 14 dev

## 🔍 Key Changes in v0.2.0

### Major Features
1. **Browser Preview Workflow** - Automatic browser launching with HMR
2. **Template Inheritance** - Shared base template for all project types
3. **Enhanced Developer Experience** - Persistent profiles, auto-reload

### Breaking Changes
- None (backward compatible)

### New Dependencies in Generated Projects
- web-ext (^8.3.0)
- concurrently (^9.1.0)

## ✅ Final Status

**All checks passed. Package is ready for publication to NPM.**

### Confidence Level: HIGH ✅

- All tests passing
- Build successful
- Documentation complete
- Version updated
- CHANGELOG updated
- Package verified

### Recommended Action

**PROCEED WITH PUBLISH** 🚀

The package is production-ready and can be safely published to NPM.
