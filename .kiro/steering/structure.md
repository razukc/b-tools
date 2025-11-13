# Project Structure

## Directory Organization

```
extn/
├── src/                    # Source code (TypeScript)
│   ├── cli/               # CLI program setup and configuration
│   ├── commands/          # Command implementations (create, build)
│   ├── core/              # Core business logic
│   │   ├── build/        # Build pipeline logic
│   │   ├── manifest/     # Manifest generation and validation
│   │   ├── template/     # Template engine and registry
│   │   └── validation/   # Schema validation
│   ├── schemas/           # JSON schemas (Chrome manifest)
│   ├── templates/         # Project templates (vanilla, etc.)
│   └── utils/             # Shared utilities (fs, logger, errors)
├── tests/                 # Test files
│   ├── fixtures/         # Test fixtures and mock data
│   ├── integration/      # Integration tests
│   └── unit/             # Unit tests (mirrors src/ structure)
├── scripts/               # Build and utility scripts
│   └── verification/     # Verification and validation scripts
├── docs/                  # Documentation
│   ├── reports/          # Test reports, audits, and summaries
│   └── testing/          # Testing guides and manual test docs
├── project-plans/         # Project planning and milestones
├── dist/                  # Compiled output (gitignored)
├── coverage/              # Test coverage reports (gitignored)
├── test-temp/             # Temporary test files (gitignored)
└── node_modules/          # Dependencies (gitignored)
```

## Key Conventions

### File Naming
- Source files: `kebab-case.ts`
- Test files: `*.test.ts` (mirrors source structure)
- Templates: `*.template.json` or `*.template.js`

### Module Organization
- **cli/** - Entry point and program configuration
- **commands/** - One file per CLI command
- **core/** - Domain logic organized by feature area
- **utils/** - Pure utility functions, no business logic
- **schemas/** - JSON schemas and type definitions
- **scripts/** - Build scripts, verification scripts, and utilities
- **docs/reports/** - Test reports, security audits, verification summaries
- **docs/testing/** - Testing guides, manual test procedures, behavior guides

### Import Patterns
- Use `.js` extensions in imports (ES modules requirement)
- Barrel exports in `index.ts` for public APIs
- Relative imports within feature directories

### Test Organization
- Unit tests mirror `src/` structure in `tests/unit/`
- Integration tests in `tests/integration/`
- Fixtures in `tests/fixtures/`
- Use descriptive test names: `describe('feature') { it('should...') }`

## Entry Points

- **CLI**: `dist/cli/index.js` (bin entry point)
- **Library**: `dist/index.js` (main entry point)
- **Source**: `src/index.ts` (exports public API)

## Build Output

- Compiled JS in `dist/` matching `src/` structure
- Declaration files (`.d.ts`) for TypeScript consumers
- Source maps for debugging
- Excludes tests and fixtures

## File Organization Rules

### Reports and Documentation
- **Test reports** → `docs/reports/` (e.g., test-coverage-report.md, SECURITY_AUDIT.md)
- **Testing guides** → `docs/testing/` (e.g., CHROME_TESTING_QUICK_START.md)
- **Technical docs** → `docs/` root (e.g., manifest-field-reference.md)
- **Project plans** → `project-plans/` (e.g., milestones, roadmaps)

### Scripts and Utilities
- **Verification scripts** → `scripts/verification/` (e.g., verify-dist-structure.js)
- **Build utilities** → `scripts/` root (e.g., generate-icons.js)
- **One-off scripts** → `scripts/` root or appropriate subdirectory

### Temporary and Generated Files
- **Test artifacts** → `test-temp/` (gitignored, cleaned regularly)
- **Coverage reports** → `coverage/` (gitignored)
- **Build logs** → Should be gitignored (*.log, *-output.txt, *-output.json)
- **Compiled output** → `dist/` (gitignored)

### Root Directory
Keep root directory clean - only essential config files:
- Package files: `package.json`, `package-lock.json`
- TypeScript: `tsconfig.json`
- Linting: `.eslintrc.json`, `.prettierrc.json`
- Git: `.gitignore`
- Documentation: `README.md`, `LICENSE`
- Test config: `vitest.config.ts`

### When Adding New Files
1. **Reports/summaries** → `docs/reports/`
2. **Testing documentation** → `docs/testing/`
3. **Verification scripts** → `scripts/verification/`
4. **Temporary test files** → `test-temp/` (ensure gitignored)
5. **Build artifacts** → Ensure gitignored
6. **Config files** → Root only if necessary for tooling
