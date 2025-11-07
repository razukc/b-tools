# First-Time Publishing Checklist

This checklist will guide you through publishing b-tools to npm for the first time.

## Pre-Publishing Information Needed

Before we start, I need the following information from you:

### 1. npm Account
- [ ] Do you have an npm account? (https://www.npmjs.com/signup)
- [ ] What is your npm username? _______________
- [ ] Is the package name `b-tools` available on npm? (Check: https://www.npmjs.com/package/b-tools)

### 2. GitHub Token
- [ ] Do you have a GitHub personal access token?
- [ ] If yes, does it have `repo` scope?
- [ ] If no, we'll create one together

### 3. Repository Status
- [ ] Is the GitHub repository `razukc/b-tools` created?
- [ ] Is it public or private? _______________
- [ ] Do you want the first release to be public?

### 4. Package Information Review
Current settings in `package.json`:
- **Name**: `b-tools`
- **Version**: `0.1.0`
- **Author**: `razukc`
- **License**: `MIT`
- **Repository**: `https://github.com/razukc/b-tools.git`

Are these correct? [ ] Yes [ ] No (specify changes needed)

---

## Phase 1: Pre-Flight Checks

### A. Code Quality
- [ ] All tests passing: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] Build succeeds: `npm run build`
- [ ] TypeScript compiles without errors

### B. Package Configuration
- [ ] `package.json` has correct name
- [ ] `package.json` has correct author
- [ ] `package.json` has correct repository URL
- [ ] `package.json` has correct license
- [ ] `package.json` has appropriate keywords
- [ ] `package.json` files array includes only necessary files
- [ ] `package.json` bin entry points to correct file

### C. Documentation
- [ ] README.md is complete and accurate
- [ ] LICENSE file exists and is correct
- [ ] CHANGELOG.md exists (even if minimal)
- [ ] All documentation links work
- [ ] Installation instructions are clear
- [ ] Usage examples are provided

### D. Repository Setup
- [ ] Git repository initialized
- [ ] All files committed
- [ ] Working directory is clean
- [ ] On `main` branch
- [ ] Remote `origin` points to correct GitHub repo
- [ ] GitHub repository exists and is accessible

---

## Phase 2: Environment Setup

### A. npm Authentication
```bash
# Login to npm
npm login

# Verify login
npm whoami
```
- [ ] Logged in successfully
- [ ] Username matches expected: _______________

### B. GitHub Token Setup
```bash
# Copy example file
cp .env.example .env

# Edit .env and add your token
# GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- [ ] `.env` file created
- [ ] GitHub token added to `.env`
- [ ] Token has `repo` scope
- [ ] `.env` is in `.gitignore` (verify: `git status` should not show .env)

### C. Verify Environment
```bash
# Check .env exists and has token
cat .env | grep GITHUB_TOKEN

# Should show: GITHUB_TOKEN=ghp_...
```
- [ ] Environment variables configured correctly

---

## Phase 3: Pre-Publish Validation

### A. Test Build Output
```bash
# Build the project
npm run build

# Check dist directory
ls -la dist/

# Verify CLI works
node dist/cli/index.js --version
```
- [ ] Build completes successfully
- [ ] `dist/` directory contains expected files
- [ ] CLI executable works
- [ ] Version number displays correctly

### B. Test Package Contents
```bash
# See what will be published
npm pack --dry-run

# This shows exactly what files will be included
```
- [ ] Only necessary files are included
- [ ] No sensitive files (`.env`, `node_modules`, etc.)
- [ ] `dist/` directory is included
- [ ] `README.md` is included
- [ ] `LICENSE` is included

### C. Test Installation Locally
```bash
# Create a test package
npm pack

# This creates b-tools-0.1.0.tgz
# Install it globally to test
npm install -g ./b-tools-0.1.0.tgz

# Test the CLI
b-tools --version
b-tools --help

# Uninstall after testing
npm uninstall -g b-tools

# Clean up
rm b-tools-0.1.0.tgz
```
- [ ] Package installs successfully
- [ ] CLI is available globally
- [ ] All commands work
- [ ] No errors or warnings

---

## Phase 4: Git Preparation

### A. Initial Commit
```bash
# Check status
git status

# Add all files (except .env which is gitignored)
git add .

# Create initial commit
git commit -m "feat: initial release of b-tools

- Project scaffolding with create command
- Vite-powered build system
- Manifest V3 validation
- TypeScript support
- Vanilla JavaScript template"

# Verify commit
git log --oneline
```
- [ ] All files committed (except `.env`)
- [ ] Commit message follows conventional commits
- [ ] Working directory is clean

### B. Push to GitHub
```bash
# Push to GitHub
git push -u origin main

# Verify on GitHub
# Visit: https://github.com/razukc/b-tools
```
- [ ] Code pushed to GitHub successfully
- [ ] Repository is visible on GitHub
- [ ] All files are present
- [ ] `.env` is NOT visible (gitignored)

---

## Phase 5: Dry Run Release

### A. Test Release Process
```bash
# Run dry run (no actual publishing)
npm run release:dry
```

**What to check:**
- [ ] No errors during dry run
- [ ] Version bump is correct (0.1.0 → 0.1.0 or as expected)
- [ ] Changelog generation works
- [ ] Git operations look correct
- [ ] GitHub release would be created
- [ ] npm publish would succeed

### B. Review Dry Run Output
Look for:
- [ ] ✓ All pre-release checks pass (lint, tests)
- [ ] ✓ Build completes successfully
- [ ] ✓ Changelog is generated
- [ ] ✓ Git commit message is correct
- [ ] ✓ Git tag name is correct (v0.1.0)
- [ ] ✓ GitHub release notes look good
- [ ] ✓ npm package would be published

---

## Phase 6: First Release! 🚀

### A. Final Checks
- [ ] All previous phases completed
- [ ] No uncommitted changes: `git status`
- [ ] On main branch: `git branch`
- [ ] Latest code pushed: `git pull origin main`
- [ ] Tests passing: `npm test`
- [ ] Build working: `npm run build`

### B. Execute Release
```bash
# Run the release (for real this time!)
npm run release
```

**During the release, you'll be prompted:**
1. Select version bump (for first release, keep 0.1.0 or bump to 1.0.0)
2. Confirm the release

**What happens:**
1. ✓ Runs lint and tests
2. ✓ Bumps version (if needed)
3. ✓ Builds the project
4. ✓ Updates CHANGELOG.md
5. ✓ Creates git commit
6. ✓ Creates git tag (v0.1.0)
7. ✓ Pushes to GitHub
8. ✓ Creates GitHub release
9. ✓ Publishes to npm

### C. Monitor Release
Watch for:
- [ ] No errors during release
- [ ] Git push succeeds
- [ ] GitHub release created
- [ ] npm publish succeeds
- [ ] Success message displayed

---

## Phase 7: Post-Release Verification

### A. Verify npm Package
```bash
# Check package on npm
npm view b-tools

# Should show version 0.1.0 (or your version)
```

Visit: https://www.npmjs.com/package/b-tools
- [ ] Package is visible on npm
- [ ] Version is correct
- [ ] README displays correctly
- [ ] All metadata is correct

### B. Verify GitHub Release
Visit: https://github.com/razukc/b-tools/releases
- [ ] Release v0.1.0 exists
- [ ] Release notes are generated
- [ ] Tag is created
- [ ] Release is published (not draft)

### C. Test Installation from npm
```bash
# Install from npm (in a different directory)
cd /tmp
npm install -g b-tools

# Test it works
b-tools --version
b-tools --help
b-tools create test-extension

# Clean up
cd test-extension
npm install
npm run build

# Verify extension works
ls -la dist/

# Uninstall
npm uninstall -g b-tools
```
- [ ] Installs successfully from npm
- [ ] CLI works correctly
- [ ] Can create projects
- [ ] Projects build successfully

---

## Phase 8: Announcement (Optional)

### A. Update Repository
- [ ] Add npm badge to README
- [ ] Add version badge to README
- [ ] Update any "coming soon" references

### B. Share the News
- [ ] Tweet about the release (if applicable)
- [ ] Post in relevant communities
- [ ] Update personal website/portfolio
- [ ] Notify interested users

---

## Troubleshooting

### "Package name already taken"
```bash
# Check if name is available
npm view b-tools

# If taken, you'll need to:
# 1. Choose a different name, or
# 2. Use a scoped package: @razukc/b-tools
```

### "Not logged in to npm"
```bash
npm login
# Enter credentials when prompted
```

### "GITHUB_TOKEN not found"
```bash
# Check .env file
cat .env

# Should show: GITHUB_TOKEN=ghp_...
# If not, add it
```

### "Working directory not clean"
```bash
# Check what's uncommitted
git status

# Commit changes
git add .
git commit -m "chore: prepare for release"
```

### "Not on main branch"
```bash
git checkout main
git pull origin main
```

### "Tests failing"
```bash
# Run tests to see errors
npm test

# Fix errors, then try again
```

### "Build failing"
```bash
# Run build to see errors
npm run build

# Fix errors, then try again
```

---

## Success Criteria

You've successfully published when:
- ✅ Package is visible on npm: https://www.npmjs.com/package/b-tools
- ✅ GitHub release exists: https://github.com/razukc/b-tools/releases/tag/v0.1.0
- ✅ Can install globally: `npm install -g b-tools`
- ✅ CLI works: `b-tools --version`
- ✅ Can create projects: `b-tools create test`

---

## Next Steps After First Publish

1. **Monitor for issues**: Watch GitHub issues and npm downloads
2. **Gather feedback**: Ask early users for feedback
3. **Plan next release**: Start working on new features
4. **Update documentation**: Based on user feedback
5. **Celebrate!** 🎉 You've published your first npm package!

---

## Quick Reference

```bash
# Pre-flight
npm test && npm run lint && npm run build

# Setup
npm login
cp .env.example .env  # Add GitHub token

# Commit
git add .
git commit -m "feat: initial release"
git push -u origin main

# Test
npm run release:dry

# Release
npm run release

# Verify
npm view b-tools
```

---

## Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review [RELEASING.md](./RELEASING.md)
3. Check [RELEASE_QUICK_START.md](./RELEASE_QUICK_START.md)
4. Ask for help in the discussion

Good luck with your first publish! 🚀
