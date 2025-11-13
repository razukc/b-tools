# Documentation

This directory contains all project documentation organized by category.

## Directory Structure

### `/reports`
Test reports, security audits, verification summaries, and completion reports generated during development and testing.

**Contents:**
- `SECURITY_AUDIT.md` - Security vulnerability assessment and dependency audit
- `test-coverage-report.md` - Code coverage analysis
- `CROSS_PLATFORM_TEST_SUMMARY.md` - Cross-platform compatibility test results
- `CROSS_PLATFORM_VERIFICATION_REPORT.md` - Platform verification details
- `DEV_WORKFLOW_TEST_REPORT.md` - Development workflow validation
- `dist-contents-verification-report.md` - Build output verification
- `compiled-files-verification-report.md` - Compilation verification
- `TASK_10.1_COMPLETION_SUMMARY.md` - Task completion documentation

### `/testing`
Testing guides, manual test procedures, and behavior documentation for developers and QA.

**Contents:**
- `CHROME_TESTING_QUICK_START.md` - Quick guide for testing Chrome extensions
- `EXTENSION_BEHAVIOR_GUIDE.md` - Expected behavior documentation
- `MANUAL_TEST_RESULTS.md` - Manual testing results and observations
- `README_MANUAL_TESTING.md` - Manual testing procedures

### Root Documentation Files

- `chrome-manifest-schema-integration.md` - Chrome manifest schema integration details
- `manifest-field-reference.md` - Manifest field reference documentation
- `spec-updates-chrome-schema.md` - Schema update specifications

## Usage Guidelines

### Adding New Documentation

**Test Reports and Audits:**
```bash
# Place in docs/reports/
docs/reports/new-audit-report.md
```

**Testing Guides:**
```bash
# Place in docs/testing/
docs/testing/new-testing-guide.md
```

**Technical Documentation:**
```bash
# Place in docs/ root
docs/new-technical-doc.md
```

### Naming Conventions

- Use `UPPERCASE_WITH_UNDERSCORES.md` for reports and summaries
- Use `kebab-case.md` for technical documentation
- Use descriptive names that indicate content purpose
- Include date in filename if time-sensitive (e.g., `audit-2025-11-07.md`)

### Maintenance

- Archive old reports when superseded by newer versions
- Keep testing guides up-to-date with current procedures
- Review and update technical docs with each major release
- Remove obsolete documentation to avoid confusion
