# Release Checklist

Use this checklist when releasing a new version of extn.

## Pre-Release

- [ ] All changes committed and pushed to main branch
- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] CHANGELOG.md reviewed (will be auto-updated)
- [ ] Version bump type decided (patch/minor/major)

## Environment Setup

- [ ] `.env` file exists with GITHUB_TOKEN: `cat .env`
- [ ] If missing: `cp .env.example .env` and add your token
- [ ] Logged into npm: `npm login`
- [ ] On main branch: `git checkout main`
- [ ] Branch up to date: `git pull origin main`
- [ ] Working directory clean: `git status`

## Release Process

### Option 1: Interactive (Recommended)

```bash
npm run release
```

Follow the prompts to select version bump and confirm.

### Option 2: Specific Version

```bash
# Patch (0.1.0 -> 0.1.1) - Bug fixes
npm run release:patch

# Minor (0.1.0 -> 0.2.0) - New features
npm run release:minor

# Major (0.1.0 -> 1.0.0) - Breaking changes
npm run release:major
```

### Option 3: Dry Run First

```bash
# Test the release without publishing
npm run release:dry

# Then run actual release
npm run release
```

## Post-Release Verification

- [ ] GitHub release created: https://github.com/razukc/extn/releases
- [ ] npm package published: https://www.npmjs.com/package/extn
- [ ] Version tag pushed: `git tag -l`
- [ ] CHANGELOG.md updated
- [ ] Test installation: `npm install -g extn@latest`
- [ ] Test basic functionality: `extn --version`

## If Something Goes Wrong

### Failed npm Publish

```bash
# Delete local tag
git tag -d v0.1.1

# Delete remote tag
git push origin :refs/tags/v0.1.1

# Fix issue and retry
npm run release
```

### Failed GitHub Release

- Manually create release from tag on GitHub
- Or delete tag and retry release

### Wrong Version Published

- Publish a new patch version with fix
- Never unpublish from npm (breaks dependents)

## Communication

After successful release:

- [ ] Announce in relevant channels (if applicable)
- [ ] Update documentation if needed
- [ ] Close related issues/PRs

## Notes

- Always use conventional commits for automatic changelog
- Test with dry run if unsure
- Keep GITHUB_TOKEN secure and never commit it
- Releases cannot be undone, only superseded
