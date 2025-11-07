# Requirements Document

## Introduction

This document defines the requirements for the b-tools CLI Foundation (Phase 1), which provides developers with a command-line tool to scaffold and build Chrome Manifest V3 extensions using modern tooling. The CLI will generate a vanilla JavaScript project structure with a valid manifest and build pipeline, enabling developers to create production-ready Chrome extensions without manual configuration.

## Glossary

- **CLI**: The b-tools command-line interface executable
- **Project**: A Chrome extension project created by the CLI
- **Template**: A predefined project structure with boilerplate files
- **Manifest**: The manifest.json file required by Chrome extensions (Manifest V3 format)
- **Build Pipeline**: The Rollup-based bundling system that processes source files
- **Entry Point**: A JavaScript file that serves as a starting point for bundling (popup, background, content script)
- **Target Directory**: The file system location where a new project will be created
- **Package Metadata**: Information from package.json (name, version, description)
- **Extension Bundle**: The compiled output in /dist directory ready for Chrome installation

## Requirements

### Requirement 1

**User Story:** As a developer, I want to install the b-tools CLI globally or use it via npx, so that I can access the tool from any directory

#### Acceptance Criteria

1. WHEN a developer runs `npm install -g b-tools`, THE CLI SHALL be available globally as the `b-tools` command
2. WHEN a developer runs `npx b-tools`, THE CLI SHALL execute without requiring global installation
3. THE CLI SHALL display version information when invoked with `--version` flag
4. THE CLI SHALL display help information when invoked with `--help` flag
5. THE CLI SHALL exit with status code 0 for successful operations and non-zero for failures

### Requirement 2

**User Story:** As a developer, I want to create a new Chrome extension project with a single command, so that I can start development quickly without manual setup

#### Acceptance Criteria

1. WHEN a developer runs `b-tools create <project-name>`, THE CLI SHALL generate a complete project structure in a new directory
2. THE CLI SHALL validate that the project name contains only alphanumeric characters, hyphens, and underscores
3. IF the target directory already exists, THEN THE CLI SHALL prompt the developer for confirmation before proceeding
4. THE CLI SHALL create all project files atomically in a temporary location and move them to the target directory upon success
5. IF project creation fails at any step, THEN THE CLI SHALL clean up all created files and display a clear error message
6. WHEN project creation completes successfully, THE CLI SHALL display next steps to the developer

### Requirement 3

**User Story:** As a developer, I want the generated project to include a valid Manifest V3 structure, so that Chrome will accept my extension without manual manifest configuration

#### Acceptance Criteria

1. THE CLI SHALL generate a manifest.json file that conforms to Chrome Manifest V3 schema
2. THE CLI SHALL populate manifest fields (name, version, description) from the project name and package.json metadata
3. THE CLI SHALL include required manifest fields: manifest_version, name, version, and description
4. THE CLI SHALL configure manifest action for popup with correct HTML path
5. THE CLI SHALL configure background service worker with correct script path
6. THE CLI SHALL configure content scripts with correct JavaScript path and match patterns
7. THE CLI SHALL set appropriate permissions array in the manifest

### Requirement 4

**User Story:** As a developer, I want the generated project to include all necessary source files, so that I have a working starting point for my extension

#### Acceptance Criteria

1. THE CLI SHALL create a src directory containing popup, background, and content subdirectories
2. THE CLI SHALL generate a popup.html file with basic HTML structure and script reference
3. THE CLI SHALL generate a popup.js file with example popup functionality
4. THE CLI SHALL generate a background.js file with example service worker code
5. THE CLI SHALL generate a content.js file with example content script code
6. THE CLI SHALL generate a styles.css file with basic styling
7. THE CLI SHALL create a public directory containing placeholder icon files (16x16, 48x48, 128x128)
8. THE CLI SHALL generate a package.json file with appropriate dependencies and scripts

### Requirement 5

**User Story:** As a developer, I want the generated project to include a build system, so that I can bundle my extension for Chrome installation

#### Acceptance Criteria

1. THE CLI SHALL generate a rollup.config.js file configured for multiple entry points
2. THE CLI SHALL configure Rollup to bundle popup.js, background.js, and content.js as separate outputs
3. THE CLI SHALL configure Rollup to copy static assets (HTML, CSS, icons, manifest) to the dist directory
4. THE CLI SHALL configure Rollup to preserve the directory structure required by Chrome extensions
5. WHEN a developer runs `npm run build` in the generated project, THE Build Pipeline SHALL produce a valid extension in the dist directory
6. THE Build Pipeline SHALL complete within 10 seconds for the initial vanilla template
7. THE Build Pipeline SHALL display clear error messages if bundling fails

### Requirement 6

**User Story:** As a developer, I want the CLI to validate my project structure, so that I can identify issues before attempting to load the extension in Chrome

#### Acceptance Criteria

1. WHEN the Build Pipeline executes, THE CLI SHALL validate that all required manifest fields are present
2. WHEN the Build Pipeline executes, THE CLI SHALL validate that all referenced files in the manifest exist
3. WHEN the Build Pipeline executes, THE CLI SHALL validate that entry point files contain valid JavaScript syntax
4. IF validation fails, THEN THE CLI SHALL display specific error messages indicating which validation rule failed
5. IF validation fails, THEN THE CLI SHALL exit with a non-zero status code without producing output

### Requirement 7

**User Story:** As a developer, I want the CLI to work consistently across operating systems, so that I can develop on Windows, macOS, or Linux

#### Acceptance Criteria

1. THE CLI SHALL use Node.js path utilities for all file system path operations
2. THE CLI SHALL handle Windows-style and Unix-style path separators correctly
3. THE CLI SHALL create files with appropriate line endings for the host operating system
4. THE CLI SHALL resolve user home directory paths correctly on all platforms
5. THE CLI SHALL handle file permissions appropriately for the host operating system

### Requirement 8

**User Story:** As a developer, I want comprehensive error messages when something goes wrong, so that I can quickly identify and fix issues

#### Acceptance Criteria

1. WHEN an error occurs, THE CLI SHALL display a human-readable error message describing the problem
2. WHEN an error occurs, THE CLI SHALL include contextual information (file paths, command arguments) in the error message
3. WHEN a validation error occurs, THE CLI SHALL indicate which validation rule failed and how to fix it
4. WHEN a file system error occurs, THE CLI SHALL indicate whether it is a permissions issue, missing directory, or other cause
5. THE CLI SHALL not display raw stack traces to end users unless a debug flag is enabled

### Requirement 9

**User Story:** As a developer, I want the generated extension to load successfully in Chrome, so that I can verify the scaffolding works correctly

#### Acceptance Criteria

1. WHEN a developer builds the generated project, THE Extension Bundle SHALL load in Chrome without errors
2. WHEN the extension is loaded, THE Manifest SHALL pass Chrome's internal validation
3. WHEN a developer clicks the extension icon, THE CLI SHALL have configured the popup to display correctly
4. WHEN a developer navigates to a webpage, THE CLI SHALL have configured the content script to inject correctly
5. THE Extension Bundle SHALL include all required files in the correct directory structure

### Requirement 10

**User Story:** As a developer, I want the CLI codebase to have comprehensive test coverage, so that I can trust the tool's reliability

#### Acceptance Criteria

1. THE CLI SHALL have unit tests covering manifest generation logic with at least 90 percent code coverage
2. THE CLI SHALL have unit tests covering validation logic with at least 90 percent code coverage
3. THE CLI SHALL have integration tests covering the create command end-to-end with at least 70 percent code coverage
4. THE CLI SHALL have integration tests covering the build process with at least 70 percent code coverage
5. WHEN tests execute, THE CLI SHALL use mocked file system operations to avoid creating real files
6. THE CLI SHALL have a test suite that completes within 30 seconds
7. THE CLI SHALL have all tests passing before any release
