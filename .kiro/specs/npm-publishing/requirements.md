# Requirements Document

## Introduction

This feature provides comprehensive NPM publishing automation for the b-tools CLI, including version management, pre-publish validation, automated testing, changelog generation, and support for both global installation and npx usage. The system will handle semantic versioning, pre-release versions, build verification, and streamlined publishing workflows with maximum automation while maintaining safety checks.

## Glossary

- **Publishing System**: The automated workflow that handles version management, validation, building, and publishing to NPM
- **Version Manager**: Component responsible for semantic versioning operations (major, minor, patch, pre-release)
- **Pre-Publish Validator**: Component that runs checks before publishing (tests, build, linting, package integrity)
- **Changelog Generator**: Component that automatically generates or updates CHANGELOG.md based on git commits
- **NPM Registry**: The public NPM package registry where b-tools is published
- **Package Integrity Checker**: Component that verifies package contents match expected structure
- **Git Integration**: Component that handles git operations (tagging, committing, pushing)
- **Dry Run Mode**: Simulation mode that shows what would happen without making actual changes

## Requirements

### Requirement 1

**User Story:** As a maintainer, I want to publish new versions to NPM with a single command, so that I can release updates quickly and consistently

#### Acceptance Criteria

1. WHEN the maintainer executes the publish command, THE Publishing System SHALL validate all pre-publish checks pass before proceeding
2. WHEN all validations pass, THE Publishing System SHALL build the project and publish to NPM Registry
3. WHEN publishing completes successfully, THE Publishing System SHALL create a git tag and push changes to the remote repository
4. IF any validation fails, THEN THE Publishing System SHALL halt the process and display clear error messages
5. WHERE the maintainer specifies dry-run mode, THE Publishing System SHALL simulate the entire process without making actual changes

### Requirement 2

**User Story:** As a maintainer, I want to automatically increment version numbers using semantic versioning, so that I can follow versioning best practices without manual package.json edits

#### Acceptance Criteria

1. WHEN the maintainer specifies a version bump type, THE Version Manager SHALL increment the version number according to semantic versioning rules
2. THE Version Manager SHALL support major, minor, patch, premajor, preminor, prepatch, and prerelease version increments
3. WHEN incrementing a pre-release version, THE Version Manager SHALL append or increment the pre-release identifier (alpha, beta, rc)
4. THE Version Manager SHALL update the version in package.json and package-lock.json files
5. WHEN a version is updated, THE Version Manager SHALL validate the new version follows semantic versioning format

### Requirement 3

**User Story:** As a maintainer, I want automated pre-publish validation, so that I can ensure quality and prevent publishing broken packages

#### Acceptance Criteria

1. THE Pre-Publish Validator SHALL run all unit and integration tests before allowing publication
2. THE Pre-Publish Validator SHALL verify the TypeScript build completes without errors
3. THE Pre-Publish Validator SHALL check that ESLint passes with no errors
4. THE Pre-Publish Validator SHALL verify the git working directory is clean with no uncommitted changes
5. THE Pre-Publish Validator SHALL confirm the current branch is the main/master branch
6. THE Pre-Publish Validator SHALL verify all required files exist in the package (dist/, README.md, LICENSE)
7. IF any validation check fails, THEN THE Pre-Publish Validator SHALL provide actionable error messages with remediation steps

### Requirement 4

**User Story:** As a maintainer, I want automatic changelog generation from git commits, so that I can maintain release notes without manual documentation

#### Acceptance Criteria

1. WHEN preparing a release, THE Changelog Generator SHALL parse git commits since the last version tag
2. THE Changelog Generator SHALL categorize commits by type (feat, fix, docs, chore, refactor, test)
3. THE Changelog Generator SHALL generate a new changelog entry with the version number and date
4. THE Changelog Generator SHALL append the new entry to the existing CHANGELOG.md file
5. WHERE no CHANGELOG.md exists, THE Changelog Generator SHALL create one with proper formatting
6. THE Changelog Generator SHALL include commit messages, authors, and commit hashes in the changelog
7. THE Changelog Generator SHALL support conventional commit format for automatic categorization

### Requirement 5

**User Story:** As a maintainer, I want package integrity verification, so that I can ensure the published package contains all necessary files and no extraneous files

#### Acceptance Criteria

1. THE Package Integrity Checker SHALL verify the dist/ directory contains compiled JavaScript files
2. THE Package Integrity Checker SHALL confirm TypeScript declaration files (.d.ts) are present
3. THE Package Integrity Checker SHALL validate that templates directory is copied to dist/templates
4. THE Package Integrity Checker SHALL check that package.json "files" field matches actual package contents
5. THE Package Integrity Checker SHALL verify no development files (tests, source TypeScript) are included in the package
6. THE Package Integrity Checker SHALL confirm the bin entry point exists and is executable

### Requirement 6

**User Story:** As a maintainer, I want automated git operations during publishing, so that releases are properly tagged and tracked in version control

#### Acceptance Criteria

1. WHEN a version is published, THE Git Integration SHALL create a git tag with the version number (e.g., v1.2.3)
2. THE Git Integration SHALL commit version changes to package.json and CHANGELOG.md with a standardized message
3. THE Git Integration SHALL push the commit and tag to the remote repository
4. WHERE the maintainer specifies no-git-push option, THE Git Integration SHALL create local commits and tags without pushing
5. THE Git Integration SHALL verify the remote repository is accessible before attempting to push

### Requirement 7

**User Story:** As a maintainer, I want support for pre-release versions, so that I can publish beta, alpha, or release candidate versions for testing

#### Acceptance Criteria

1. THE Version Manager SHALL support creating pre-release versions with identifiers (alpha, beta, rc)
2. WHEN publishing a pre-release version, THE Publishing System SHALL use the --tag flag to publish under a dist-tag (e.g., beta, next)
3. THE Publishing System SHALL prevent pre-release versions from being tagged as "latest" on NPM Registry
4. THE Version Manager SHALL support incrementing pre-release versions (e.g., 1.0.0-beta.1 to 1.0.0-beta.2)
5. THE Publishing System SHALL clearly indicate in output when publishing a pre-release version

### Requirement 8

**User Story:** As a maintainer, I want a dry-run mode for publishing, so that I can preview changes before actually publishing to NPM

#### Acceptance Criteria

1. WHERE the maintainer enables dry-run mode, THE Publishing System SHALL execute all validation steps without making changes
2. THE Publishing System SHALL display what version would be published
3. THE Publishing System SHALL show what files would be included in the package
4. THE Publishing System SHALL display what git operations would be performed
5. THE Publishing System SHALL indicate which NPM commands would be executed
6. THE Publishing System SHALL complete the dry-run without modifying any files or publishing to NPM Registry

### Requirement 9

**User Story:** As a user, I want to use b-tools via npx without global installation, so that I can try the tool or use it in CI/CD without installation overhead

#### Acceptance Criteria

1. THE Publishing System SHALL ensure the package.json bin field is correctly configured for npx usage
2. WHEN a user runs npx b-tools, THE Publishing System SHALL ensure the CLI executes correctly
3. THE Publishing System SHALL verify the package includes all necessary dependencies for standalone execution
4. THE Pre-Publish Validator SHALL test npx execution as part of validation checks
5. THE Publishing System SHALL ensure the published package size is optimized for quick npx downloads

### Requirement 10

**User Story:** As a maintainer, I want comprehensive logging during the publish process, so that I can understand what's happening and troubleshoot issues

#### Acceptance Criteria

1. THE Publishing System SHALL display clear progress indicators for each step (validation, build, publish)
2. THE Publishing System SHALL log all executed commands with their output
3. WHEN an error occurs, THE Publishing System SHALL display the error with context and suggested fixes
4. THE Publishing System SHALL provide a summary at the end showing what was accomplished
5. WHERE verbose mode is enabled, THE Publishing System SHALL display detailed debug information
6. THE Publishing System SHALL use color-coded output to distinguish success, warnings, and errors
