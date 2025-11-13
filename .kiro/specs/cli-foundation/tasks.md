# Implementation Plan

- [x] 1. Setup project infrastructure and TypeScript configuration
  - Initialize npm package with proper metadata (name: extn, version: 0.1.0)
  - Configure TypeScript with strict mode, ES2020 target, and proper paths
  - Setup Vitest with coverage configuration (80% threshold)
  - Configure ESLint and Prettier for code quality
  - Create directory structure: src/{cli,commands,core,utils,templates}, tests/{unit,integration,fixtures}
  - Add package.json scripts for build, test, lint, and format
  - Create .gitignore with node_modules, dist, coverage
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6_

- [x] 2. Implement core utilities and error handling
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 2.1 Create error classes and error handling system
  - Implement BToolsError base class with code and context properties
  - Create specialized error classes: ValidationError, FileSystemError, BuildError
  - Add error formatting utilities for user-friendly messages
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 2.2 Implement file system utilities with cross-platform support
  - Create FileSystemUtils class with ensureDir, copyDir, writeFile, readFile, exists, remove methods
  - Implement createTempDir for atomic operations
  - Implement moveAtomic for safe file moves
  - Use path.normalize() and path.join() for all path operations
  - Handle Windows and Unix path separators correctly
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 2.3 Create logger utility with colored output
  - Implement Logger class with info, success, warn, error, debug methods
  - Add spinner support using ora (startSpinner, stopSpinner)
  - Implement box method for formatted output
  - Use chalk for colored terminal output
  - _Requirements: 8.1, 8.2_

- [x] 2.4 Write unit tests for utilities

  - Test error class instantiation and properties
  - Test file system utilities with memfs mocking
  - Test logger output formatting
  - Test cross-platform path handling

  - _Requirements: 10.1, 10.2, 10.5_

- [x] 3. Implement manifest generation and validation





  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3.1 Create Zod schemas for Manifest V3 validation


  - Define ManifestV3 schema with all required and optional fields
  - Define ManifestConfig schema for input validation
  - Add schema for action, background, content_scripts, icons, permissions
  - Reference official Chrome manifest JSON Schema (src/schemas/chrome-manifest.schema.json) for comprehensive validation rules
  - Use JSON Schema field descriptions for enhanced error messages
  - _Requirements: 3.1, 6.1_

- [x] 3.2 Implement ManifestGenerator class


  - Create generate method that converts ManifestConfig to ManifestV3
  - Implement fromPackageJson method to extract metadata
  - Set manifest_version to 3
  - Configure action with default_popup and default_icon
  - Configure background with service_worker
  - Configure content_scripts with matches and js arrays
  - Set icons for 16, 48, 128 sizes
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 3.3 Implement ManifestValidator class


  - Create validate method for schema validation using Zod
  - Implement validateWithJsonSchema method using official Chrome manifest schema (optional additional validation)
  - Implement validateFiles method to check referenced files exist
  - Implement validateSchema method for structure validation
  - Return ValidationResult with errors array including field descriptions from JSON Schema
  - Check required fields: manifest_version, name, version, description
  - Validate version format (1-4 dot-separated integers, each 0-65535)
  - Validate icon sizes and paths (16, 48, 128, 256)
  - Validate permissions array against official permission list
  - Validate match patterns for content scripts and host permissions
  - Use getFieldDescription() from src/schemas/index.ts for enhanced error messages
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3.4 Write unit tests for manifest generation and validation


  - Test ManifestGenerator.generate with various configs
  - Test ManifestGenerator.fromPackageJson extraction
  - Test ManifestValidator.validate with valid and invalid manifests
  - Test ManifestValidator.validateFiles with mocked file system
  - Test ManifestValidator.validateWithJsonSchema (if implemented)
  - Test error cases: missing fields, invalid version, missing files
  - Test error messages include field descriptions from JSON Schema
  - Test validation against both Manifest V2 and V3 patterns
  - Test match pattern validation
  - Test permission validation
  - _Requirements: 10.1, 10.2_

- [x] 4. Implement template engine and vanilla template





  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 4.1 Create TemplateEngine class with variable substitution


  - Implement render method that processes template directory
  - Implement renderFile method with {{variable}} substitution
  - Support basic conditionals: {{#if condition}}...{{/if}}
  - Return array of TemplateFile objects with path and content
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_



- [x] 4.2 Create vanilla template files
  - Create src/popup/popup.html with basic HTML structure and script tag
  - Create src/popup/popup.js with example popup functionality (e.g., button click handler)
  - Create src/popup/styles.css with basic styling
  - Create src/background/background.js with service worker example (e.g., chrome.runtime.onInstalled)
  - Create src/content/content.js with content script example (e.g., console.log on page load)
  - Create public/icons/ directory structure
  - Create package.json.template with {{projectName}}, {{version}}, {{description}} variables and Vite dependencies
  - Create vite.config.js.template using @crxjs/vite-plugin for Chrome extension support
  - Create tsconfig.json for TypeScript support
  - Create .gitignore with node_modules, dist, .DS_Store
  - Create manifest.template.json with variable placeholders
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 4.2.1 Create placeholder icon files for vanilla template




  - Create icon16.png (16x16 placeholder)
  - Create icon48.png (48x48 placeholder)
  - Create icon128.png (128x128 placeholder)
  - Icons should be simple colored squares or basic Chrome extension icons
  - _Requirements: 4.7_

- [x] 4.3 Create TemplateRegistry to manage templates
  - Define Template interface with id, name, description, files, dependencies
  - Implement registry with vanilla template
  - Add method to retrieve template by id
  - _Requirements: 4.1, 4.8_

- [x] 4.4 Write unit tests for template engine
  - Test TemplateEngine.renderFile with variable substitution
  - Test conditional rendering
  - Test TemplateEngine.render with full template directory
  - Test TemplateRegistry.get method
  - _Requirements: 10.1, 10.2_

- [x] 5. Implement Vite configuration generator
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 5.1 Create Vite configuration template
  - Create vite.config.js.template using @crxjs/vite-plugin for Chrome extension support
  - Configure manifest path and output directory
  - Set up path aliases (@/ for src/)
  - Configure build options for extension entry points
  - Include proper TypeScript and module resolution settings
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5.2 Create template package.json
  - Create package.json.template with vite, @crxjs/vite-plugin as devDependencies
  - Add scripts: "dev": "vite", "build": "vite build", "preview": "vite preview"
  - Include project metadata (name, version, description) template variables
  - Set type: "module" for ESM support
  - _Requirements: 5.5, 5.6, 5.7_

- [x] 6. Implement CLI program and create command




  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 6.1 Create CLI entry point and Commander.js setup


  - Create src/cli/index.ts with shebang (#!/usr/bin/env node)
  - Implement createProgram function using Commander
  - Set program name to 'extn', description, and version 0.1.0
  - Add --version and --help flags
  - Configure proper exit codes (0 for success, non-zero for errors)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 6.2 Implement create command handler


  - Add 'create <project-name>' command to program
  - Add options: --template (default: vanilla), --directory
  - Implement createCommand function in src/commands/create.ts
  - Validate project name (alphanumeric, hyphens, underscores only)
  - Resolve target directory (options.directory || ./<project-name>)
  - Check if directory exists and prompt for confirmation if needed
  - Create temporary directory for atomic operations
  - Generate project files using TemplateEngine
  - Generate manifest.json using ManifestGenerator
  - Validate generated structure using ManifestValidator
  - Move from temp to target directory atomically
  - Display success message with next steps (cd <project-name>, npm install, npm run build)
  - Handle errors and cleanup temp directory on failure
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_


- [x] 6.3 Implement build command handler (optional for Phase 1)

  - Note: Build command will be handled by Vite in generated projects via npm scripts
  - Users run "npm run build" in their extension project, not "extn build"
  - CLI only needs to generate proper vite.config.js and package.json scripts
  - If implementing CLI build wrapper: delegate to "npm run build" in project directory
  - _Requirements: 5.5, 5.6, 5.7, 6.1, 6.2, 6.3, 6.4, 6.5_





- [x] 6.4 Write integration tests for CLI commands
  - Test 'create' command end-to-end with real file system in temp directory
  - Verify complete project structure is created
  - Verify package.json has vite and @crxjs/vite-plugin as devDependencies
  - Verify vite.config.js is generated correctly
  - Verify manifest.json and all source files exist
  - Test error handling when directory already exists
  - Test cleanup on failure (no partial files left)
  - Optionally test that "npm run build" works in generated project (requires npm install)
  - _Requirements: 10.3, 10.4, 10.5, 10.6_

- [x] 8. Create package.json and build configuration
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.6, 10.7_

- [x] 8.1 Configure package.json for npm publishing
  - Set name to 'extn', version to 0.1.0
  - Add description: "CLI for building Chrome extensions"
  - Set main to dist/index.js
  - Add bin entry: "extn": "dist/cli/index.js"
  - Add files array: ["dist", "README.md", "LICENSE"]
  - Add keywords: chrome-extension, cli, build-tool, manifest-v3, developer-tools
  - Add repository URL
  - Set license to MIT
  - Add all production dependencies: commander, chalk, ora, fs-extra, zod
  - Add all dev dependencies: typescript, vitest, coverage, memfs, types, eslint, prettier
  - Add scripts: build, dev, test, test:watch, test:coverage, test:unit, test:integration, lint, format, prepublishOnly
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 8.2 Configure TypeScript for production build
  - Set target to ES2020, module to ES2020
  - Set outDir to ./dist, rootDir to ./src
  - Enable strict mode and all strict checks
  - Enable esModuleInterop, resolveJsonModule
  - Generate declaration files and source maps
  - Include src/**/* and exclude node_modules, dist, tests
  - _Requirements: 10.7_

- [x] 8.3 Configure Vitest with coverage thresholds
  - Set coverage provider to v8
  - Set coverage reporters: text, json, html
  - Set thresholds: lines 80%, functions 80%, branches 75%, statements 80%
  - Include src/**/*.ts, exclude tests and templates
  - Configure test timeout to 30 seconds
  - _Requirements: 10.6, 10.7_

- [x] 9. End-to-end validation and documentation
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 9.1 Create end-to-end test scenario
  - Run 'extn create test-extension' in temp directory
  - Run 'npm install' in generated project (installs Vite and @crxjs/vite-plugin)
  - Run 'npm run build' in generated project (uses Vite build)
  - Verify dist directory is created with proper structure
  - Manually load extension in Chrome and verify it works
  - Verify popup displays when clicking extension icon
  - Verify content script injects on web pages
  - Verify background service worker runs without errors
  - Optionally test 'npm run dev' starts Vite dev server
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 9.2 Write README with quickstart guide
  - Add project description and features
  - Add installation instructions (npm install -g extn or npx)
  - Add quickstart: create, install, build steps
  - Add command reference for create and build
  - Add troubleshooting section
  - Add link to Chrome extension documentation
  - Add license and contribution guidelines
  - _Requirements: 1.3, 1.4, 2.6_

- [x] 9.3 Verify test coverage meets requirements
  - Run npm run test:coverage
  - Verify overall coverage >= 80%
  - Verify core logic (manifest, validation) >= 90%
  - Verify CLI commands >= 70%
  - Fix any gaps in test coverage
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6, 10.7_

- [x] 9.4 Prepare for npm publishing
  - _Requirements: 1.1, 1.2_

- [x] 9.4.1 Verify package.json metadata
  - Check repository URL is set correctly
  - Verify keywords array includes relevant terms
  - Verify description is clear and accurate
  - Verify author, license, and homepage fields
  - Verify files array includes all necessary paths
  - _Requirements: 1.1, 1.2_

- [x] 9.4.2 Test bin entry locally with npm link
  - Run npm link in project root to create global symlink
  - Test extn command is available globally
  - Run extn --version and verify output
  - Run extn --help and verify command list
  - Run extn create test-project and verify it works
  - Clean up with npm unlink
  - _Requirements: 1.1, 1.2_

- [x] 9.4.3 Run prepublishOnly script
  - _Requirements: 1.1, 1.2_

- [x] 9.4.3.1 Clean previous build artifacts
  - Remove existing dist directory if present
  - Verify clean slate before build
  - _Requirements: 1.1, 1.2_

- [x] 9.4.3.2 Execute prepublishOnly script
  - Run npm run prepublishOnly command. The output for integratation tests will be too large, so, run those tests individually.
  - Monitor console output for any warnings or errors
  - Capture exit code to verify success
  - _Requirements: 1.1, 1.2_

- [x] 9.4.3.3 Verify TypeScript compilation
  - Check that build completes without TypeScript errors
  - Verify no type errors in console output
  - Confirm compilation time is reasonable
  - _Requirements: 1.1, 1.2_

- [x] 9.4.3.4 Verify test suite execution
  - Confirm all unit tests pass
  - Confirm all integration tests pass
  - Verify no test failures or timeouts
  - Check test summary shows expected test count
  - _Requirements: 1.1, 1.2_

- [x] 9.4.3.5 Verify dist directory structure
  - Check dist directory exists and is populated
  - Verify all expected subdirectories are present (cli, commands, core, utils, schemas, templates)
  - Confirm no unexpected files or directories
  - _Requirements: 1.1, 1.2_

- [x] 9.4.3.6 Verify compiled JavaScript files
  - Check that all .ts files have corresponding .js files in dist
  - Verify main entry points exist (dist/index.js, dist/cli/index.js)
  - Spot-check a few compiled files for proper ES2020 syntax
  - _Requirements: 1.1, 1.2_

- [x] 9.4.4 Verify dist directory contents
  - Check dist/cli/index.js exists with shebang
  - Check dist/index.js exists (main entry point)
  - Verify all .d.ts declaration files are generated
  - Verify source maps (.map files) are present
  - Check that all necessary subdirectories exist (commands, core, utils, etc.)
  - _Requirements: 1.1, 1.2_

- [x] 9.4.5 Test installation from local tarball
  - Run npm pack to create tarball
  - Install globally from tarball: npm install -g ./extn-0.1.0.tgz
  - Test extn command works after global install
  - Create a test project using installed version
  - Verify generated project works correctly
  - Uninstall with npm uninstall -g extn
  - Clean up tarball file
  - _Requirements: 1.1, 1.2_

- [x] 10. Manual verification and final testing
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10.1 Manual Chrome extension testing
  - Create a test extension using extn create
  - Install dependencies with npm install
  - Build the extension with npm run build
  - Load the extension in Chrome (chrome://extensions, enable Developer mode, Load unpacked)
  - Verify extension icon appears in Chrome toolbar
  - Click extension icon and verify popup displays correctly
  - Navigate to a webpage and verify content script injects (check console)
  - Open Chrome DevTools > Service Workers and verify background worker runs without errors
  - Test that all extension functionality works as expected
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10.2 Test development workflow
  - Create a test extension
  - Run npm run dev to start Vite dev server
  - Make changes to popup.js and verify HMR works
  - Make changes to popup.html and verify changes reflect
  - Verify dev server provides good error messages
  - _Requirements: 5.5, 5.6, 5.7_

- [x] 10.3 Cross-platform verification (optional)
  - Test on Windows (if not primary development OS)
  - Test on macOS (if not primary development OS)
  - Test on Linux (if not primary development OS)
  - Verify path handling works correctly on all platforms
  - Verify file permissions are set correctly
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [-] 11. Final polish and quality assurance



  - _Requirements: 1.3, 1.4, 2.6, 10.1, 10.2, 10.3, 10.4, 10.6, 10.7_

- [x] 11.1 Review and update documentation


  - Review README.md for completeness and accuracy
  - Ensure all commands are documented with examples
  - Add troubleshooting section with common issues
  - Add contributing guidelines if planning to accept contributions
  - Verify all links work correctly
  - _Requirements: 1.3, 1.4, 2.6_

- [x] 11.2 Final test coverage verification





  - Run npm run test:coverage and review report
  - Verify overall coverage meets 80% threshold
  - Verify core logic (manifest, validation) meets 90% threshold
  - Verify CLI commands meet 70% threshold
  - Document any intentional coverage gaps
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6, 10.7_

- [x] 11.3 Security audit and dependency check





  - Run npm audit to check for vulnerabilities
  - Review and update dependencies if needed
  - Verify no unnecessary dependencies are included
  - Check that production dependencies are minimal
  - Document any known security considerations
  - _Requirements: 1.1, 1.2_
