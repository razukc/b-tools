# File Organization Guidelines

This document defines where different types of files should be placed in the extn project to maintain a clean and organized structure.

## Quick Reference

| File Type | Location | Example |
|-----------|----------|---------|
| Test reports | `docs/reports/` | `test-coverage-report.md` |
| Security audits | `docs/reports/` | `SECURITY_AUDIT.md` |
| Verification reports | `docs/reports/` | `dist-contents-verification-report.md` |
| Testing guides | `docs/testing/` | `CHROME_TESTING_QUICK_START.md` |
| Manual test docs | `docs/testing/` | `README_MANUAL_TESTING.md` |
| Technical docs | `docs/` | `manifest-field-reference.md` |
| Verification scripts | `scripts/verification/` | `verify-dist-structure.js` |
| Build scripts | `scripts/` | `generate-icons.js` |
| Temporary test files | `test-temp/` | (gitignored) |
| Build logs | (gitignored) | `*.log`, `*-output.txt` |

## Directory Purposes

### `docs/reports/`
**Purpose**: Store test reports, audits, verification summaries, and completion reports.

**When to use**:
- Test coverage reports
- Security audit results
- Cross-platform verification reports
- Build verification reports
- Task completion summaries
- Performance benchmarks

**Naming**: Use `UPPERCASE_WITH_UNDERSCORES.md` for reports

### `docs/testing/`
**Purpose**: Store testing guides, procedures, and behavior documentation.

**When to use**:
- Manual testing procedures
- Testing quick start guides
- Behavior documentation
- Test result documentation
- QA guidelines

**Naming**: Use `UPPERCASE_WITH_UNDERSCORES.md` for guides and results

### `docs/` (root)
**Purpose**: Store technical documentation and reference materials.

**When to use**:
- API documentation
- Architecture documentation
- Schema references
- Integration guides
- Technical specifications

**Naming**: Use `kebab-case.md` for technical docs

### `scripts/verification/`
**Purpose**: Store scripts that verify build output, structure, or integrity.

**When to use**:
- Build output verification
- File structure validation
- Compilation checks
- Integrity verification

**Naming**: Use `verify-*.js` pattern

### `scripts/` (root)
**Purpose**: Store build utilities and development scripts.

**When to use**:
- Asset generation
- Build process scripts
- Development utilities
- Setup scripts

**Naming**: Use `verb-noun.js` pattern (e.g., `generate-icons.js`)

### `test-temp/`
**Purpose**: Temporary files created during testing (gitignored).

**When to use**:
- Test fixtures that are generated
- Temporary test projects
- Test output files

**Important**: Always ensure this directory is in `.gitignore`

## Root Directory Policy

The root directory should only contain:
- **Package files**: `package.json`, `package-lock.json`
- **Config files**: `tsconfig.json`, `.eslintrc.json`, `.prettierrc.json`, `vitest.config.ts`
- **Git files**: `.gitignore`
- **Documentation**: `README.md`, `LICENSE`

**Do NOT place in root**:
- Test reports (→ `docs/reports/`)
- Testing guides (→ `docs/testing/`)
- Verification scripts (→ `scripts/verification/`)
- Build logs (→ gitignore them)
- Temporary files (→ `test-temp/` and gitignore)

## Gitignore Policy

Always gitignore:
- Build output: `dist/`, `coverage/`
- Temporary files: `test-temp/`, `*.tmp`
- Logs: `*.log`, `*-output.txt`, `*-output.json`
- Dependencies: `node_modules/`
- IDE files: `.vscode/`, `.idea/`

## Workflow for Adding Files

### Adding a Test Report
```bash
# 1. Create report in docs/reports/
docs/reports/NEW_REPORT.md

# 2. Use UPPERCASE naming
docs/reports/INTEGRATION_TEST_REPORT.md
```

### Adding a Testing Guide
```bash
# 1. Create guide in docs/testing/
docs/testing/NEW_TESTING_GUIDE.md

# 2. Use descriptive UPPERCASE naming
docs/testing/E2E_TESTING_GUIDE.md
```

### Adding a Verification Script
```bash
# 1. Create script in scripts/verification/
scripts/verification/verify-something.js

# 2. Use verify-* naming pattern
scripts/verification/verify-package-integrity.js
```

### Adding Technical Documentation
```bash
# 1. Create doc in docs/ root
docs/new-technical-doc.md

# 2. Use kebab-case naming
docs/api-reference.md
```

## Maintenance Tasks

### Regular Cleanup
- Remove obsolete reports from `docs/reports/`
- Archive old verification reports
- Clean `test-temp/` directory
- Update testing guides when procedures change

### Before Commits
- Ensure no build logs in root
- Verify temporary files are gitignored
- Check that new files are in correct directories
- Update README files if structure changes

### Before Releases
- Archive old reports
- Update all testing documentation
- Verify all scripts are documented
- Clean up any development-only files

## Examples

### ✅ Good Organization
```
docs/reports/SECURITY_AUDIT.md
docs/testing/CHROME_TESTING_QUICK_START.md
scripts/verification/verify-dist-structure.js
test-temp/temp-project/
```

### ❌ Bad Organization
```
SECURITY_AUDIT.md (should be in docs/reports/)
verify-dist-structure.js (should be in scripts/verification/)
test-project/ (should be in test-temp/ and gitignored)
build-output.log (should be gitignored)
```

## Questions?

When unsure where to place a file, ask:
1. Is it a report or summary? → `docs/reports/`
2. Is it a testing guide? → `docs/testing/`
3. Is it technical documentation? → `docs/`
4. Is it a verification script? → `scripts/verification/`
5. Is it a build utility? → `scripts/`
6. Is it temporary? → `test-temp/` and gitignore
7. Is it a log or output? → gitignore it

If still unsure, default to the most specific category that fits the file's purpose.
