# release-it Setup Summary

This document summarizes the release-it setup for extn.

## What Was Installed

- **release-it**: Main release automation tool
- **@release-it/conventional-changelog**: Plugin for automatic changelog generation from conventional commits

## Configuration Files

### `.env` (Not Committed)

Environment variables file for sensitive tokens:

```bash
GITHUB_TOKEN=your_github_token_here
```

- **Location**: Project root
- **Purpose**: Store GitHub personal access token securely
- **Security**: Added to `.gitignore` to prevent accidental commits
- **Setup**: Copy `.env.example` and add your token

### `.env.example` (Committed)

Template file showing required environment variables without actual values. Safe to commit to version control.

### `.release-it.json`

Main configuration file that controls:

- **Git operations**: 
  - Commits with custom message format
  - Annotated tags with release notes
  - Push to origin remote
  - Requires clean working directory and main branch
  
- **GitHub releases**: 
  - Automatic release creation with auto-generated notes
  - Uses `GITHUB_TOKEN` from environment (via .env)
  - Release naming: "Release v{version}"
  
- **npm publishing**: 
  - Automatic package publishing
  - Publishes from project root
  - Includes validation checks
  
- **Hooks**: 
  - `before:init`: Runs lint and tests
  - `after:bump`: Builds the project
  - `after:release`: Success message
  
- **Changelog**: 
  - Conventional commits-based generation
  - Updates CHANGELOG.md automatically
  - Categorizes commits by type (feat, fix, etc.)

### `CHANGELOG.md`

Changelog file that will be automatically updated with each release based on conventional commit messages.

## npm Scripts Added

All scripts use `dotenv-cli` to automatically load environment variables from `.env`:

```json
{
  "release": "dotenv -e .env -- release-it",              // Interactive release
  "release:minor": "dotenv -e .env -- release-it minor",  // Minor version bump
  "release:major": "dotenv -e .env -- release-it major",  // Major version bump
  "release:patch": "dotenv -e .env -- release-it patch",  // Patch version bump
  "release:dry": "dotenv -e .env -- release-it --dry-run" // Test without publishing
}
```

The `dotenv -e .env --` prefix ensures your `GITHUB_TOKEN` is loaded before release-it runs.

## How It Works

1. **Pre-release checks**: Runs lint and tests (`before:init` hook)
2. **Version bump**: Updates package.json version
3. **Build**: Compiles TypeScript after version bump (`after:bump` hook)
4. **Changelog**: Generates/updates CHANGELOG.md from conventional commits
5. **Git commit**: Creates commit with version bump and updated files
6. **Git tag**: Creates annotated version tag (e.g., v0.1.1)
7. **Git push**: Pushes commit and tag to GitHub origin
8. **GitHub release**: Creates release with auto-generated notes from commits
9. **npm publish**: Publishes package to npm registry
10. **Success message**: Displays release confirmation (`after:release` hook)

## Prerequisites for Releasing

1. **GitHub Token**: Create a `.env` file with your token
   ```bash
   cp .env.example .env
   # Edit .env and add: GITHUB_TOKEN=your_github_token_here
   ```

2. **npm Authentication**:
   ```bash
   npm login
   ```

3. **Clean working directory**: All changes committed

4. **On main branch**: Must be on main branch and up to date

## Usage Examples

```bash
# Interactive release (recommended)
npm run release

# Specific version bump
npm run release:patch  # 0.1.0 -> 0.1.1
npm run release:minor  # 0.1.0 -> 0.2.0
npm run release:major  # 0.1.0 -> 1.0.0

# Test the release process
npm run release:dry
```

## Conventional Commits

For automatic changelog generation, use these commit prefixes:

- `feat:` - New features (appears in changelog)
- `fix:` - Bug fixes (appears in changelog)
- `perf:` - Performance improvements (appears in changelog)
- `docs:` - Documentation (appears in changelog)
- `style:` - Code style (appears in changelog)
- `refactor:` - Code refactoring (appears in changelog)
- `test:` - Tests (appears in changelog)
- `build:` - Build system (appears in changelog)
- `ci:` - CI/CD (appears in changelog)
- `chore:` - Maintenance (hidden from changelog)

## Configuration Improvements

Based on release-it best practices, the configuration includes:

### Security
- ✅ GitHub token stored in `.env` file (not in shell environment)
- ✅ `.env` file gitignored to prevent accidental commits
- ✅ `.env.example` provided as template
- ✅ `dotenv-cli` automatically loads environment variables

### Git Operations
- ✅ Annotated tags with release notes
- ✅ Clean working directory requirement
- ✅ Branch protection (main branch only)
- ✅ Upstream requirement check
- ✅ Custom commit message format

### GitHub Integration
- ✅ Auto-generated release notes from commits
- ✅ Explicit token reference configuration
- ✅ Release naming convention
- ✅ Support for assets (if needed in future)

### Workflow Hooks
- ✅ Pre-release validation (lint + tests)
- ✅ Post-bump build step
- ✅ Post-release success message
- ✅ All hooks use template variables

### Changelog
- ✅ Conventional commits preset
- ✅ Categorized commit types
- ✅ Hidden chore commits
- ✅ Automatic CHANGELOG.md updates

## Benefits

✅ **Automated workflow**: One command handles everything
✅ **Consistent releases**: Same process every time
✅ **Automatic changelog**: Generated from commit messages
✅ **GitHub integration**: Creates releases automatically
✅ **npm integration**: Publishes automatically
✅ **Safety checks**: Runs tests and lint before releasing
✅ **Dry run support**: Test before actual release

## Comparison to Custom Implementation

Instead of building custom GitHub and npm publishing features into extn (which would add bloat to the open-source package), release-it provides:

- Battle-tested release automation
- Active maintenance and community support
- Extensive plugin ecosystem
- No code to maintain in extn
- Works for any npm package, not just extn

## Documentation

- Full release guide: [docs/RELEASING.md](./RELEASING.md)
- release-it docs: https://github.com/release-it/release-it
- Conventional commits: https://www.conventionalcommits.org/
