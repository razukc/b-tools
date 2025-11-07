# Release Configuration Refactoring Summary

This document summarizes the improvements made to the release-it configuration based on official documentation and best practices.

## Changes Made

### 1. Environment Variable Management

**Before:**
- Required manual `export GITHUB_TOKEN="..."` in shell
- Token had to be set in shell profile or before each release
- Risk of token exposure in shell history

**After:**
- ✅ Token stored in `.env` file
- ✅ Automatically loaded via `dotenv-cli`
- ✅ `.env` gitignored for security
- ✅ `.env.example` provided as template
- ✅ No shell configuration needed

### 2. Configuration Enhancements

**Added to `.release-it.json`:**

```json
{
  "$schema": "https://unpkg.com/release-it@19/schema/release-it.json",
  "git": {
    "tagAnnotation": "Release v${version}",  // Added: Annotated tags
    "requireCommits": false,                   // Added: Allow releases without commits
    "addUntrackedFiles": false,               // Added: Explicit untracked file handling
    "pushRepo": "origin"                      // Added: Explicit remote name
  },
  "github": {
    "tokenRef": "GITHUB_TOKEN",               // Added: Explicit token reference
    "assets": null                            // Added: Placeholder for future assets
  },
  "npm": {
    "ignoreVersion": false                    // Added: Version validation
  },
  "hooks": {
    "after:release": "echo Successfully..."   // Added: Success message
  }
}
```

### 3. Package Scripts Update

**Before:**
```json
"release": "release-it"
```

**After:**
```json
"release": "dotenv -e .env -- release-it"
```

All release scripts now use `dotenv-cli` to load environment variables.

### 4. Documentation Improvements

**New Files:**
- `docs/RELEASE_QUICK_START.md` - 3-minute setup guide
- `.env.example` - Environment variable template
- `docs/RELEASE_REFACTORING_SUMMARY.md` - This file

**Updated Files:**
- `docs/RELEASING.md` - Updated for .env usage
- `docs/RELEASE_IT_SETUP.md` - Added configuration details
- `.github/RELEASE_CHECKLIST.md` - Updated prerequisites

### 5. Security Improvements

- ✅ `.env` added to `.gitignore`
- ✅ `.env.local` added to `.gitignore`
- ✅ Token never exposed in shell history
- ✅ Token never committed to repository
- ✅ Clear separation of example vs actual credentials

## Benefits

### Developer Experience
- **Simpler setup**: Copy `.env.example`, add token, done
- **No shell configuration**: Works immediately after setup
- **Cross-platform**: Same process on Windows, Mac, Linux
- **IDE integration**: Many IDEs auto-load .env files

### Security
- **No shell history exposure**: Token not in command history
- **No accidental commits**: .env is gitignored
- **Easy rotation**: Just update .env file
- **Team-friendly**: Each developer has their own .env

### Maintainability
- **Schema validation**: JSON schema for IDE autocomplete
- **Explicit configuration**: All options clearly defined
- **Better defaults**: Following release-it best practices
- **Future-proof**: Easy to add new options

## Migration Guide

If you were using the old setup:

### 1. Remove Shell Export

Remove from `~/.bashrc`, `~/.zshrc`, or `~/.profile`:
```bash
# Remove this line:
export GITHUB_TOKEN="..."
```

### 2. Create .env File

```bash
cp .env.example .env
# Edit .env and add your token
```

### 3. Test

```bash
npm run release:dry
```

## Configuration Reference

### Environment Variables (.env)

```bash
# Required for GitHub releases
GITHUB_TOKEN=your_github_token_here

# Optional - can use npm login instead
# NPM_TOKEN=your_npm_token_here
```

### Release Scripts

```bash
npm run release          # Interactive release
npm run release:patch    # Patch version (0.1.0 → 0.1.1)
npm run release:minor    # Minor version (0.1.0 → 0.2.0)
npm run release:major    # Major version (0.1.0 → 1.0.0)
npm run release:dry      # Test without publishing
```

### Git Configuration

- **Commit message**: `chore: release v${version}`
- **Tag name**: `v${version}`
- **Tag annotation**: `Release v${version}`
- **Required branch**: `main`
- **Requires**: Clean working directory, upstream remote

### GitHub Configuration

- **Release name**: `Release v${version}`
- **Release notes**: Auto-generated from commits
- **Token**: Loaded from `GITHUB_TOKEN` environment variable
- **Draft**: `false` (published immediately)
- **Pre-release**: `false` (stable release)

### Hooks

1. **before:init**: `npm run lint && npm test -- --run`
2. **after:bump**: `npm run build`
3. **after:release**: Success message

## Best Practices Applied

Based on release-it documentation:

1. ✅ Use `.env` file for tokens (not shell exports)
2. ✅ Use `dotenv-cli` for automatic loading
3. ✅ Include JSON schema for IDE support
4. ✅ Use annotated tags (not lightweight)
5. ✅ Explicit configuration over defaults
6. ✅ Require clean working directory
7. ✅ Require specific branch (main)
8. ✅ Use conventional commits for changelog
9. ✅ Run tests before release
10. ✅ Build after version bump

## Resources

- [release-it Documentation](https://github.com/release-it/release-it)
- [Environment Variables Guide](https://github.com/release-it/release-it/blob/main/docs/environment-variables.md)
- [Configuration Guide](https://github.com/release-it/release-it/blob/main/docs/configuration.md)
- [GitHub Releases Guide](https://github.com/release-it/release-it/blob/main/docs/github-releases.md)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Troubleshooting

### "GITHUB_TOKEN not found"
```bash
# Check .env exists
cat .env

# If not, create it
cp .env.example .env
# Edit and add your token
```

### "dotenv: command not found"
```bash
# Reinstall dependencies
npm install
```

### Token not loading
```bash
# Verify .env format (no quotes needed)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Not this:
# GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
```

## Next Steps

1. Review [RELEASE_QUICK_START.md](./RELEASE_QUICK_START.md) for setup
2. Read [RELEASING.md](./RELEASING.md) for detailed guide
3. Check [RELEASE_CHECKLIST.md](../.github/RELEASE_CHECKLIST.md) before releasing
4. Test with `npm run release:dry` first
