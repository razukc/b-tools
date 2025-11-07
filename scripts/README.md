# Scripts

This directory contains utility scripts for build processes, verification, and development tasks.

## Directory Structure

### `/verification`
Scripts for verifying build output, compiled files, and project structure.

**Contents:**
- `verify-dist-structure.js` - Validates dist/ directory structure
- `verify-dist-contents.js` - Verifies dist/ file contents
- `verify-compiled-files.js` - Checks compiled file integrity

### Root Scripts

- `generate-icons.js` - Icon generation utility

## Usage

### Verification Scripts

Run verification scripts after building to ensure output integrity:

```bash
# Verify dist structure
node scripts/verification/verify-dist-structure.js

# Verify dist contents
node scripts/verification/verify-dist-contents.js

# Verify compiled files
node scripts/verification/verify-compiled-files.js
```

### Build Utilities

```bash
# Generate icons
node scripts/generate-icons.js
```

## Adding New Scripts

### Verification Scripts
Place in `scripts/verification/` if the script validates or checks build output, file structure, or code integrity.

```bash
scripts/verification/verify-something.js
```

### Build Scripts
Place in `scripts/` root if the script is part of the build process or generates assets.

```bash
scripts/generate-something.js
```

### Development Scripts
Place in `scripts/` root for development utilities that don't fit other categories.

```bash
scripts/dev-utility.js
```

## Conventions

- Use Node.js for scripts (ES modules preferred)
- Include clear error messages and exit codes
- Add usage instructions in script comments
- Make scripts executable: `chmod +x script.js`
- Use descriptive names: `verb-noun.js` (e.g., `verify-structure.js`)
