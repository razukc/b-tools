# Release Guide

This document describes how to release new versions of b-tools using `release-it`.

## Prerequisites

1. **GitHub Token**: Create a `.env` file in the project root with your GitHub personal access token
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your token
   GITHUB_TOKEN=your_github_token_here
   ```
   
   Create a token at: https://github.com/settings/tokens
   Required scopes: `repo`
   
   **Important**: Never commit the `.env` file (it's in `.gitignore`)

2. **npm Authentication**: Ensure you're logged in to npm
   ```bash
   npm login
   ```

3. **Clean Working Directory**: Commit or stash all changes before releasing

4. **Main Branch**: Ensure you're on the `main` branch and it's up to date
   ```bash
   git checkout main
   git pull origin main
   ```

## Release Process

### Interactive Release (Recommended)

Run the release command and follow the prompts:

```bash
npm run release
```

This will:
1. Run linting and tests
2. Prompt you to select the version bump (patch, minor, major)
3. Update version in package.json
4. Build the project
5. Generate/update CHANGELOG.md based on conventional commits
6. Create a git commit and tag
7. Push to GitHub
8. Create a GitHub release
9. Publish to npm

### Specific Version Bump

You can specify the version bump type directly:

```bash
# Patch release (0.1.0 -> 0.1.1)
npm run release:patch

# Minor release (0.1.0 -> 0.2.0)
npm run release:minor

# Major release (0.1.0 -> 1.0.0)
npm run release:major
```

### Dry Run

Test the release process without actually publishing:

```bash
npm run release:dry
```

This shows you what would happen without making any changes.

## Conventional Commits

For automatic changelog generation, use conventional commit messages:

- `feat: add new feature` - New features (minor version bump)
- `fix: resolve bug` - Bug fixes (patch version bump)
- `perf: improve performance` - Performance improvements
- `docs: update documentation` - Documentation changes
- `style: format code` - Code style changes
- `refactor: restructure code` - Code refactoring
- `test: add tests` - Test additions/changes
- `build: update build system` - Build system changes
- `ci: update CI configuration` - CI/CD changes
- `chore: maintenance tasks` - Maintenance tasks (hidden in changelog)

### Breaking Changes

For breaking changes (major version bump), add `BREAKING CHANGE:` in the commit body:

```bash
git commit -m "feat: redesign API

BREAKING CHANGE: The API has been completely redesigned.
Old methods are no longer supported."
```

## Release Workflow

1. **Develop features** on feature branches
2. **Merge to main** with conventional commit messages
3. **Run release** when ready to publish
4. **Verify** the GitHub release and npm package

## Troubleshooting

### Authentication Issues

If you get authentication errors:

```bash
# For GitHub - check your .env file
cat .env  # Should show GITHUB_TOKEN=...

# If missing, create it
cp .env.example .env
# Then edit .env and add your token

# For npm
npm login
```

### Dirty Working Directory

If release fails due to uncommitted changes:

```bash
git status
git add .
git commit -m "chore: prepare for release"
```

### Failed npm Publish

If npm publish fails but git tags were created:

```bash
# Delete the local tag
git tag -d v0.1.1

# Delete the remote tag
git push origin :refs/tags/v0.1.1

# Fix the issue and try again
npm run release
```

## Configuration

The release configuration is in `.release-it.json`. Key settings:

- **git.requireBranch**: Only allow releases from `main` branch
- **git.requireCleanWorkingDir**: Require clean working directory
- **hooks.before:init**: Run lint and tests before release
- **hooks.after:bump**: Build project after version bump
- **github.release**: Create GitHub releases automatically
- **npm.publish**: Publish to npm automatically

## Manual Release (Not Recommended)

If you need to release manually:

```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Build
npm run build

# 3. Update changelog manually
# Edit CHANGELOG.md

# 4. Commit and tag
git add .
git commit -m "chore: release v0.1.1"
git tag v0.1.1

# 5. Push
git push origin main --tags

# 6. Create GitHub release manually
# Go to GitHub and create release from tag

# 7. Publish to npm
npm publish
```

## Best Practices

1. **Test thoroughly** before releasing
2. **Use semantic versioning** correctly
3. **Write clear commit messages** for better changelogs
4. **Review the dry run** before actual release
5. **Verify the release** on GitHub and npm after publishing
6. **Announce releases** to users if significant changes

## Resources

- [release-it documentation](https://github.com/release-it/release-it)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
