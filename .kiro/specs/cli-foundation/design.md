# Design Document

## Overview

The extn CLI Foundation is a TypeScript-based command-line tool that scaffolds Chrome Manifest V3 extension projects with a modern build pipeline. The architecture follows a modular design with clear separation between CLI interface, core business logic, template generation, and build orchestration.

The CLI tool uses TypeScript compilation (tsc) for simplicity and standard practice. Generated extension projects use Vite for development and production builds, providing instant HMR, optimized bundling (via Rollup), and excellent developer experience. The system uses Commander.js for CLI routing and Zod for validation. All code is written in TypeScript with comprehensive test coverage using Vitest.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLI Layer                            │
│  (Commander.js - Command parsing & routing)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Command Layer                           │
│  (CreateCommand, BuildCommand - Business logic)              │
└────────┬───────────────────────────┬────────────────────────┘
         │                           │
         ▼                           ▼
┌──────────────────┐        ┌──────────────────────┐
│  Template Engine │        │   Vite Plugin        │
│  (File generation)│        │   (Extension build)  │
└────────┬─────────┘        └──────────┬───────────┘
         │                              │
         ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Core Layer                            │
│  (Manifest, Validation, FileSystem utilities)                │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
extn/
├── src/
│   ├── cli/
│   │   ├── index.ts              # CLI entry point
│   │   └── program.ts            # Commander.js setup
│   ├── commands/
│   │   ├── create.ts             # Create command implementation
│   │   └── build.ts              # Build command implementation
│   ├── core/
│   │   ├── manifest/
│   │   │   ├── generator.ts      # Manifest generation logic
│   │   │   ├── validator.ts      # Manifest validation
│   │   │   └── schema.ts         # Zod schemas for manifest
│   │   ├── template/
│   │   │   ├── engine.ts         # Template rendering engine
│   │   │   └── registry.ts       # Template definitions
│   │   ├── build/
│   │   │   ├── vite-plugin.ts    # Vite plugin for Chrome extensions
│   │   │   └── config.ts         # Vite configuration generator
│   │   └── validation/
│   │       ├── project.ts        # Project structure validation
│   │       └── syntax.ts         # JavaScript syntax validation
│   ├── schemas/
│   │   ├── chrome-manifest.schema.json  # Official Chrome manifest JSON Schema
│   │   ├── index.ts              # Schema utilities and exports
│   │   ├── example-usage.ts      # Usage examples
│   │   └── README.md             # Schema documentation
│   ├── utils/
│   │   ├── fs.ts                 # File system utilities
│   │   ├── logger.ts             # Logging utilities
│   │   ├── errors.ts             # Error handling
│   │   └── paths.ts              # Path utilities
│   └── templates/
│       └── vanilla/
│           ├── template.json     # Template metadata
│           ├── files/            # Template files
│           │   ├── src/
│           │   │   ├── popup/
│           │   │   │   ├── popup.html
│           │   │   │   ├── popup.js
│           │   │   │   └── styles.css
│           │   │   ├── background/
│           │   │   │   └── background.js
│           │   │   └── content/
│           │   │       └── content.js
│           │   ├── public/
│           │   │   └── icons/
│           │   │       ├── icon16.png
│           │   │       ├── icon48.png
│           │   │       └── icon128.png
│           │   ├── package.json.template
│           │   ├── vite.config.js.template
│           │   ├── tsconfig.json
│           │   └── .gitignore
│           └── manifest.template.json
├── tests/
│   ├── unit/
│   │   ├── manifest/
│   │   ├── template/
│   │   ├── validation/
│   │   └── utils/
│   ├── integration/
│   │   ├── create.test.ts
│   │   └── build.test.ts
│   └── fixtures/
│       └── sample-projects/
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Components and Interfaces

### 1. CLI Layer

**Purpose:** Parse command-line arguments and route to appropriate command handlers

**Key Files:**
- `src/cli/index.ts` - Entry point with shebang
- `src/cli/program.ts` - Commander.js configuration

**Interface:**
```typescript
// src/cli/program.ts
import { Command } from 'commander';

export function createProgram(): Command {
  const program = new Command();
  
  program
    .name('extn')
    .description('CLI for building Chrome extensions')
    .version('0.1.0');
  
  program
    .command('create <project-name>')
    .description('Create a new Chrome extension project')
    .option('-t, --template <name>', 'Template to use', 'vanilla')
    .option('-d, --directory <path>', 'Target directory')
    .action(createCommand);
  
  return program;
}
```

### 2. Command Layer

**Purpose:** Implement business logic for each CLI command

#### CreateCommand

**Responsibilities:**
- Validate project name
- Check target directory
- Orchestrate template generation
- Handle errors and cleanup

**Interface:**
```typescript
// src/commands/create.ts
export interface CreateCommandOptions {
  template: string;
  directory?: string;
}

export interface CreateCommandResult {
  success: boolean;
  projectPath: string;
  message: string;
}

export async function createCommand(
  projectName: string,
  options: CreateCommandOptions
): Promise<CreateCommandResult>;
```

**Flow:**
1. Validate project name (alphanumeric, hyphens, underscores only)
2. Resolve target directory (options.directory || `./${projectName}`)
3. Check if directory exists, prompt if needed
4. Create temporary directory
5. Generate project files from template
6. Validate generated structure
7. Move from temp to target (atomic operation)
8. Run npm install
9. Display success message with next steps

#### BuildCommand

**Responsibilities:**
- Validate project structure
- Execute Vite build (which uses Rollup internally)
- Validate output
- Report build status

**Interface:**
```typescript
// src/commands/build.ts
export interface BuildCommandOptions {
  mode: 'development' | 'production';
  watch: boolean;
}

export interface BuildCommandResult {
  success: boolean;
  outputPath: string;
  duration: number;
  errors: string[];
}

export async function buildCommand(
  options: BuildCommandOptions
): Promise<BuildCommandResult>;
```

**Note:** The build command will be run inside generated projects, which use Vite. The CLI doesn't need to implement the actual build logic - it's handled by Vite in the generated project.

### 3. Core Layer

#### Manifest Generator

**Purpose:** Generate valid Manifest V3 JSON from template and metadata

**Interface:**
```typescript
// src/core/manifest/generator.ts
export interface ManifestConfig {
  name: string;
  version: string;
  description: string;
  permissions?: string[];
  hostPermissions?: string[];
}

export interface ManifestV3 {
  manifest_version: 3;
  name: string;
  version: string;
  description: string;
  action?: {
    default_popup: string;
    default_icon: Record<string, string>;
  };
  background?: {
    service_worker: string;
    type?: string;
  };
  content_scripts?: Array<{
    matches: string[];
    js: string[];
    css?: string[];
  }>;
  icons?: Record<string, string>;
  permissions?: string[];
  host_permissions?: string[];
}

export class ManifestGenerator {
  generate(config: ManifestConfig): ManifestV3;
  fromPackageJson(packageJson: any): ManifestConfig;
}
```

**Implementation Details:**
- Read package.json for name, version, description
- Merge with template defaults
- Apply Chrome MV3 structure
- Validate against Zod schema

#### Manifest Validator

**Purpose:** Validate manifest structure and referenced files

**Interface:**
```typescript
// src/core/manifest/validator.ts
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  description?: string; // From JSON Schema
}

export class ManifestValidator {
  validate(manifest: ManifestV3): ValidationResult;
  validateFiles(manifest: ManifestV3, projectRoot: string): ValidationResult;
  validateSchema(manifest: unknown): ValidationResult;
  validateWithJsonSchema(manifest: unknown): ValidationResult;
}
```

**Validation Strategy:**
1. **Primary validation** - Zod schemas for type-safe parsing and runtime validation
2. **Secondary validation** - Official Chrome manifest JSON Schema for comprehensive validation
3. **File validation** - Check that referenced files exist
4. **Enhanced error messages** - Use JSON Schema descriptions for user-friendly errors

**Validation Rules:**
1. Schema validation (Zod + JSON Schema)
2. Required fields present (manifest_version, name, version)
3. Version format valid (1-4 dot-separated integers, each 0-65535)
4. Referenced files exist (popup, background, content scripts, icons)
5. Icon sizes correct (16, 48, 128, 256)
6. Permissions valid (from official permission list)
7. Match patterns valid (for content scripts and host permissions)
8. Manifest V3 specific rules (service_worker, action, host_permissions)

**JSON Schema Integration:**
- Located at `src/schemas/chrome-manifest.schema.json`
- Source: https://www.schemastore.org/chrome-manifest.json
- Provides comprehensive validation for both Manifest V2 and V3
- Used to extract field descriptions for error messages
- Can be used with AJV for additional validation layer

#### Template Engine

**Purpose:** Render template files with variable substitution

**Interface:**
```typescript
// src/core/template/engine.ts
export interface TemplateContext {
  projectName: string;
  version: string;
  description: string;
  author?: string;
}

export interface TemplateFile {
  path: string;
  content: string;
  encoding: 'utf-8' | 'binary';
}

export class TemplateEngine {
  render(templatePath: string, context: TemplateContext): TemplateFile[];
  renderFile(content: string, context: TemplateContext): string;
}
```

**Template Syntax:**
- Use `{{variableName}}` for substitution
- Support conditional blocks: `{{#if condition}}...{{/if}}`
- Keep it simple - no complex logic in templates

#### Vite Plugin for Chrome Extensions

**Purpose:** Generate Vite configuration and plugin for Chrome extension projects

**Interface:**
```typescript
// src/core/build/vite-plugin.ts
export interface VitePluginOptions {
  manifest: string;
  outDir?: string;
}

export interface ViteConfigTemplate {
  content: string;
  dependencies: string[];
}

export function generateViteConfig(options: VitePluginOptions): ViteConfigTemplate;
```

**Generated Vite Configuration:**
```typescript
// Template for vite.config.js in generated projects
import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    crx({ manifest })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.html',
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

**Key Features:**
- Uses `@crxjs/vite-plugin` for Chrome extension support
- Automatic manifest handling
- HMR for popup and options pages
- Content script hot reload
- Background service worker updates
- Path aliases (@/ for src/)
- Production builds use Rollup (via Vite)

### 4. Utilities Layer

#### File System Utilities

**Purpose:** Cross-platform file operations with error handling

**Interface:**
```typescript
// src/utils/fs.ts
export class FileSystemUtils {
  async ensureDir(path: string): Promise<void>;
  async copyDir(src: string, dest: string): Promise<void>;
  async writeFile(path: string, content: string): Promise<void>;
  async readFile(path: string): Promise<string>;
  async exists(path: string): Promise<boolean>;
  async remove(path: string): Promise<void>;
  async createTempDir(): Promise<string>;
  async moveAtomic(src: string, dest: string): Promise<void>;
}
```

**Implementation Notes:**
- Use `fs-extra` for enhanced file operations
- All paths normalized with `path.normalize()`
- Atomic operations: write to temp, then move
- Proper cleanup on errors

#### Logger

**Purpose:** Consistent terminal output with colors and spinners

**Interface:**
```typescript
// src/utils/logger.ts
export class Logger {
  info(message: string): void;
  success(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
  
  startSpinner(message: string): void;
  stopSpinner(success: boolean, message: string): void;
  
  box(title: string, content: string[]): void;
}
```

**Output Examples:**
```
✓ Project created successfully!
✗ Failed to generate manifest
⚠ Warning: Missing icon file
ℹ Building extension...
```

#### Error Handling

**Purpose:** Structured error types with context

**Interface:**
```typescript
// src/utils/errors.ts
export class BToolsError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'BToolsError';
  }
}

export class ValidationError extends BToolsError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', context);
  }
}

export class FileSystemError extends BToolsError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'FS_ERROR', context);
  }
}

export class BuildError extends BToolsError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'BUILD_ERROR', context);
  }
}
```

## Data Models

### Project Structure

```typescript
// src/core/types.ts
export interface Project {
  name: string;
  version: string;
  description: string;
  root: string;
  manifest: ManifestV3;
  packageJson: PackageJson;
}

export interface PackageJson {
  name: string;
  version: string;
  description: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}
```

### Template Definition

```typescript
export interface Template {
  id: string;
  name: string;
  description: string;
  files: TemplateFile[];
  dependencies: string[];
  devDependencies: string[];
}

export interface TemplateRegistry {
  vanilla: Template;
  // Future: react, vue, svelte
}
```

## Error Handling

### Error Categories

1. **User Input Errors** (exit code 1)
   - Invalid project name
   - Directory already exists
   - Invalid options

2. **File System Errors** (exit code 2)
   - Permission denied
   - Disk full
   - Path not found

3. **Validation Errors** (exit code 3)
   - Invalid manifest
   - Missing required files
   - Syntax errors

4. **Build Errors** (exit code 4)
   - Vite build failed
   - Plugin errors
   - Output validation failed

### Error Recovery Strategy

```typescript
// Atomic operations with cleanup
async function createProjectSafely(name: string, options: CreateCommandOptions) {
  const tempDir = await fs.createTempDir();
  
  try {
    // Generate files in temp directory
    await generateProject(tempDir, name, options);
    
    // Validate before committing
    await validateProject(tempDir);
    
    // Atomic move to target
    await fs.moveAtomic(tempDir, targetDir);
    
    return { success: true };
  } catch (error) {
    // Cleanup temp directory
    await fs.remove(tempDir);
    
    // Re-throw with context
    throw new BToolsError(
      'Failed to create project',
      'CREATE_FAILED',
      { name, error: error.message }
    );
  }
}
```

## Testing Strategy

### Test Structure

```
tests/
├── unit/                          # Fast, isolated tests
│   ├── manifest/
│   │   ├── generator.test.ts      # Manifest generation logic
│   │   └── validator.test.ts      # Validation rules
│   ├── template/
│   │   └── engine.test.ts         # Template rendering
│   └── utils/
│       ├── fs.test.ts             # File system utilities
│       └── paths.test.ts          # Path handling
├── integration/                   # End-to-end command tests
│   ├── create.test.ts             # Full create workflow
│   └── build.test.ts              # Full build workflow
└── fixtures/                      # Test data
    ├── manifests/
    ├── templates/
    └── projects/
```

### Testing Approach

#### Unit Tests (90% coverage target)

**Manifest Generator:**
```typescript
describe('ManifestGenerator', () => {
  it('should generate valid MV3 manifest from config', () => {
    const generator = new ManifestGenerator();
    const config = {
      name: 'Test Extension',
      version: '1.0.0',
      description: 'Test description',
    };
    
    const manifest = generator.generate(config);
    
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBe('Test Extension');
    expect(manifest.version).toBe('1.0.0');
  });
  
  it('should extract config from package.json', () => {
    const generator = new ManifestGenerator();
    const packageJson = {
      name: 'my-extension',
      version: '2.0.0',
      description: 'My extension',
    };
    
    const config = generator.fromPackageJson(packageJson);
    
    expect(config.name).toBe('my-extension');
    expect(config.version).toBe('2.0.0');
  });
});
```

**Manifest Validator:**
```typescript
describe('ManifestValidator', () => {
  it('should validate required fields', () => {
    const validator = new ManifestValidator();
    const manifest = { manifest_version: 3 }; // Missing required fields
    
    const result = validator.validate(manifest);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'name' })
    );
  });
  
  it('should validate file references', async () => {
    const validator = new ManifestValidator();
    const manifest = {
      manifest_version: 3,
      name: 'Test',
      version: '1.0.0',
      description: 'Test',
      action: { default_popup: 'popup.html' },
    };
    
    // Mock file system
    mockFs({ 'popup.html': '<html></html>' });
    
    const result = await validator.validateFiles(manifest, '/project');
    
    expect(result.valid).toBe(true);
  });
});
```

#### Integration Tests (70% coverage target)

**Create Command:**
```typescript
describe('create command', () => {
  let testDir: string;
  
  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'btools-test-'));
  });
  
  afterEach(async () => {
    await fs.remove(testDir);
  });
  
  it('should create a complete project structure', async () => {
    const projectName = 'test-extension';
    const result = await createCommand(projectName, {
      template: 'vanilla',
      directory: testDir,
    });
    
    expect(result.success).toBe(true);
    
    const projectPath = path.join(testDir, projectName);
    
    // Verify structure
    expect(await fs.exists(path.join(projectPath, 'package.json'))).toBe(true);
    expect(await fs.exists(path.join(projectPath, 'manifest.json'))).toBe(true);
    expect(await fs.exists(path.join(projectPath, 'src/popup/popup.js'))).toBe(true);
    expect(await fs.exists(path.join(projectPath, 'src/background/background.js'))).toBe(true);
    expect(await fs.exists(path.join(projectPath, 'src/content/content.js'))).toBe(true);
  });
  
  it('should fail gracefully if directory exists', async () => {
    const projectName = 'test-extension';
    const projectPath = path.join(testDir, projectName);
    
    // Create directory first
    await fs.ensureDir(projectPath);
    
    await expect(
      createCommand(projectName, { template: 'vanilla', directory: testDir })
    ).rejects.toThrow('Directory already exists');
    
    // Verify no partial files created
    const files = await fs.readdir(projectPath);
    expect(files.length).toBe(0);
  });
});
```

**Build Command:**
```typescript
describe('build command', () => {
  it('should build a valid extension bundle', async () => {
    // Setup: Create a test project
    const projectPath = await createTestProject();
    
    process.chdir(projectPath);
    
    const result = await buildCommand({ mode: 'development', watch: false });
    
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    // Verify output
    const distPath = path.join(projectPath, 'dist');
    expect(await fs.exists(path.join(distPath, 'popup.js'))).toBe(true);
    expect(await fs.exists(path.join(distPath, 'background.js'))).toBe(true);
    expect(await fs.exists(path.join(distPath, 'content.js'))).toBe(true);
    expect(await fs.exists(path.join(distPath, 'manifest.json'))).toBe(true);
    
    // Verify manifest is valid
    const manifest = await fs.readJson(path.join(distPath, 'manifest.json'));
    expect(manifest.manifest_version).toBe(3);
  });
});
```

### Mocking Strategy

**File System Mocking:**
```typescript
import { vol } from 'memfs';
import { fs } from 'memfs';

jest.mock('fs-extra', () => require('memfs'));

beforeEach(() => {
  vol.reset();
});
```

**CLI Output Mocking:**
```typescript
import { jest } from '@jest/globals';

const mockLogger = {
  info: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
};

jest.mock('../src/utils/logger', () => ({
  Logger: jest.fn(() => mockLogger),
}));
```

### Test Execution

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration"
  }
}
```

**Coverage Thresholds:**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/templates/**'],
    },
  },
});
```

## Build and Development Workflow

### Development Setup

```bash
# Clone and install
git clone https://github.com/browser-tools/extn.git
cd extn
npm install

# Build TypeScript
npm run build

# Link for local testing
npm link

# Run tests
npm test

# Watch mode for development
npm run dev
```

### Package Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "prepublishOnly": "npm run build && npm test"
  }
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## Chrome Manifest JSON Schema Integration

### Overview

The project integrates the official Chrome Extension Manifest JSON Schema from [JSON Schema Store](https://www.schemastore.org/chrome-manifest.json). This schema provides comprehensive validation rules for both Manifest V2 and V3.

### Location

- **Schema file**: `src/schemas/chrome-manifest.schema.json` (34KB)
- **Utilities**: `src/schemas/index.ts`
- **Documentation**: `src/schemas/README.md` and `docs/chrome-manifest-schema-integration.md`
- **Field reference**: `docs/manifest-field-reference.md`

### Benefits

1. **Comprehensive Validation**: Official validation rules covering all manifest fields
2. **Field Descriptions**: Rich descriptions for better error messages
3. **Version Support**: Handles both Manifest V2 and V3 with conditional logic
4. **Pattern Matching**: Validates complex fields (CSP, match patterns, version strings)
5. **Reference Documentation**: Serves as authoritative source for manifest structure

### Integration Strategy

**Primary Validation (Zod)**:
- Type-safe parsing and runtime validation
- Used for core validation logic
- Provides TypeScript types

**Secondary Validation (JSON Schema)**:
- Optional additional validation layer using AJV
- Comprehensive field validation
- Source of field descriptions for error messages

**Usage Example**:
```typescript
import { getFieldDescription } from './schemas/index.js';
import { ManifestValidator } from './core/manifest/validator.js';

// Validate with Zod
const result = validator.validate(manifest);

// Enhance error messages with JSON Schema descriptions
if (!result.valid) {
  result.errors.forEach(error => {
    error.description = getFieldDescription(error.field);
  });
}
```

### Key Manifest V3 Validation Rules

From the JSON Schema:
- **Required fields**: `manifest_version`, `name`, `version`
- **Version format**: 1-4 dot-separated integers (0-65535 each)
- **Icon sizes**: 16, 48, 128, 256 pixels
- **Permissions**: Validated against official permission list
- **Match patterns**: `<scheme>://<host><path>` format
- **Service worker**: Required for background in V3
- **Host permissions**: Separate from permissions in V3
- **Web accessible resources**: Object format with `resources` and `matches` in V3

### Updating the Schema

To get the latest version:
```bash
curl -o src/schemas/chrome-manifest.schema.json https://www.schemastore.org/chrome-manifest.json
```

## Dependencies

### Production Dependencies

```json
{
  "dependencies": {
    "commander": "^11.0.0",
    "chalk": "^5.3.0",
    "ora": "^7.0.1",
    "fs-extra": "^11.1.1",
    "zod": "^3.22.4"
  }
}
```

**Note:** Vite and related build tools are NOT dependencies of the CLI. They are added to generated extension projects' `package.json` as devDependencies.

### Development Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.2.0",
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "memfs": "^4.6.0",
    "@types/node": "^20.0.0",
    "@types/fs-extra": "^11.0.0",
    "eslint": "^8.50.0",
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "prettier": "^3.0.0"
  }
}
```

## Security Considerations

1. **Input Validation**
   - Sanitize project names to prevent path traversal
   - Validate all user inputs before file operations
   - Reject suspicious patterns in project names

2. **File System Safety**
   - Never write outside project directory
   - Use atomic operations to prevent partial writes
   - Proper cleanup of temporary files

3. **Dependency Security**
   - Pin dependency versions
   - Regular security audits with `npm audit`
   - Minimal dependency footprint

4. **Template Security**
   - Templates embedded in package (no remote fetching)
   - No code execution in templates
   - Static analysis of generated code

## Performance Considerations

1. **Build Performance (Generated Extensions)**
   - Vite dev server: instant cold start
   - HMR updates: < 100ms
   - Production builds: < 10 seconds for vanilla template
   - Vite uses Rollup for optimized production bundles

2. **CLI Responsiveness**
   - Immediate feedback for user actions
   - Spinners for long operations
   - Progress indicators for multi-step processes
   - Project scaffolding: < 5 seconds

3. **File Operations**
   - Batch file writes when possible
   - Stream large files
   - Efficient directory traversal
   - Atomic operations for safety

## Future Extensibility

### Plugin System (Post-MVP)

```typescript
export interface BToolsPlugin {
  name: string;
  version: string;
  hooks: {
    beforeCreate?: (context: CreateContext) => Promise<void>;
    afterCreate?: (context: CreateContext) => Promise<void>;
    beforeBuild?: (context: BuildContext) => Promise<void>;
    afterBuild?: (context: BuildContext) => Promise<void>;
  };
}
```

### Template Registry (Post-MVP)

```typescript
export interface TemplateSource {
  type: 'embedded' | 'npm' | 'git';
  location: string;
}

export class TemplateRegistry {
  register(template: Template, source: TemplateSource): void;
  resolve(templateId: string): Template;
  list(): Template[];
}
```

## Deployment

### NPM Publishing

```bash
# Version bump
npm version patch|minor|major

# Publish
npm publish

# Tag
git push --tags
```

### Package Configuration

```json
{
  "name": "extn",
  "version": "0.1.0",
  "description": "CLI for building Chrome extensions",
  "main": "dist/index.js",
  "bin": {
    "extn": "dist/cli/index.js"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "chrome-extension",
    "cli",
    "build-tool",
    "manifest-v3",
    "developer-tools"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/browser-tools/extn.git"
  },
  "license": "MIT"
}
```
