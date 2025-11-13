# Release Quick Start

Get up and running with releases in 3 minutes.

## First Time Setup

### 1. Create GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `b-tools-releases`
4. Select scope: `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### 2. Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your token
# Replace 'your_github_token_here' with your actual token
nano .env  # or use your preferred editor
```

Your `.env` file should look like:
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Login to npm

```bash
npm login
```

Enter your npm credentials when prompted.

## Making a Release

### Interactive Mode (Recommended)

```bash
npm run release
```

This will:
1. Ask you to select version bump (patch/minor/major)
2. Show you what will happen
3. Ask for confirmation
4. Execute the release

### Specific Version

```bash
# Bug fixes (0.1.0 → 0.1.1)
npm run release:patch

# New features (0.1.0 → 0.2.0)
npm run release:minor

# Breaking changes (0.1.0 → 1.0.0)
npm run release:major
```

### Test First (Dry Run)

```bash
npm run release:dry
```

Shows exactly what would happen without making any changes.

## What Happens During Release

1. ✅ Runs linting
2. ✅ Runs tests
3. ✅ Bumps version in package.json
4. ✅ Builds the project
5. ✅ Updates CHANGELOG.md
6. ✅ Creates git commit
7. ✅ Creates git tag
8. ✅ Pushes to GitHub
9. ✅ Creates GitHub release
10. ✅ Publishes to npm

## Troubleshooting

### "GITHUB_TOKEN not found"

```bash
# Check if .env exists
ls -la .env

# If not, create it
cp .env.example .env
# Then edit and add your token
```

### "Not logged in to npm"

```bash
npm login
```

### "Working directory not clean"

```bash
# Commit your changes first
git add .
git commit -m "feat: your changes"

# Then release
npm run release
```

### "Not on main branch"

```bash
git checkout main
git pull origin main
npm run release
```

## Tips

- Always use conventional commit messages for better changelogs
- Test with `npm run release:dry` first
- Keep your `.env` file secure (never commit it!)
- Review the changelog before confirming release

## Next Steps

For detailed information, see:
- [Full Release Guide](./RELEASING.md)
- [Setup Documentation](./RELEASE_IT_SETUP.md)
- [Release Checklist](../.github/RELEASE_CHECKLIST.md)
