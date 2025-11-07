# Implementation Plan

- [ ] 1. Set up core publishing infrastructure
  - Create directory structure for publish feature in `src/core/publish/`
  - Define TypeScript interfaces and types for all publishing components
  - Set up error types specific to publishing operations
  - _Requirements: 1.1, 1.4, 10.3_

- [ ] 2. Implement Version Manager
  - [ ] 2.1 Create VersionManager class with semantic versioning logic
    - Implement getCurrentVersion() to read from package.json
    - Implement bumpVersion() for major, minor, patch, and pre-release increments
    - Implement setVersion() for explicit version setting
    - Implement validateVersion() using semver rules
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [ ] 2.2 Implement package.json and package-lock.json update logic
    - Create updatePackageJson() to modify version field
    - Create updatePackageLock() to sync lock file version
    - Ensure atomic file updates with backup/restore on failure
    - _Requirements: 2.4_

  - [ ] 2.3 Write unit tests for VersionManager
    - Test all bump types with various starting versions
    - Test pre-release version handling (alpha, beta, rc)
    - Test version validation edge cases
    - Test file update operations with mocked filesystem
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3. Implement Git Integration
  - [ ] 3.1 Create GitIntegration class with command execution
    - Implement exec() helper for running git commands
    - Implement getStatus() to parse git status output
    - Implement getCurrentBranch() to get active branch
    - Implement hasRemote() to check for remote repository
    - _Requirements: 3.4, 3.5, 6.5_

  - [ ] 3.2 Implement git history and commit operations
    - Create getLastTag() to find most recent version tag
    - Create getCommitsSince() to retrieve commits since a tag
    - Create commit() to stage and commit specific files
    - Create createTag() to create annotated version tags
    - Create push() to push commits and tags to remote
    - _Requirements: 4.1, 6.1, 6.2, 6.3_

  - [ ] 3.3 Write unit tests for GitIntegration
    - Test git command execution and output parsing
    - Test status parsing with various git states
    - Test commit and tag creation
    - Mock all git command executions
    - _Requirements: 3.4, 3.5, 4.1, 6.1, 6.2, 6.3, 6.5_

- [ ] 4. Implement Changelog Generator
  - [ ] 4.1 Create ChangelogGenerator class with commit parsing
    - Implement getCommitsSinceLastTag() using GitIntegration
    - Implement parseCommit() to extract conventional commit parts
    - Implement categorizeCommits() to group by type (feat, fix, etc.)
    - _Requirements: 4.1, 4.2, 4.7_

  - [ ] 4.2 Implement changelog formatting and file operations
    - Create formatEntry() to generate markdown for changelog entry
    - Create generate() to create complete changelog entry
    - Create update() to prepend entry to existing CHANGELOG.md
    - Handle CHANGELOG.md creation if it doesn't exist
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

  - [ ] 4.3 Write unit tests for ChangelogGenerator
    - Test commit parsing with various conventional commit formats
    - Test categorization of different commit types
    - Test changelog entry formatting
    - Test CHANGELOG.md creation and updates
    - Mock GitIntegration and filesystem operations
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 5. Implement Pre-Publish Validator
  - [ ] 5.1 Create PrePublishValidator class with validation checks
    - Implement validateTests() to run npm test
    - Implement validateBuild() to run npm run build
    - Implement validateLint() to run npm run lint
    - Implement validateGitStatus() to check for clean working directory
    - Implement validateBranch() to verify main/master branch
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 5.2 Implement package integrity validation
    - Create validatePackageIntegrity() to check dist/ contents
    - Verify TypeScript declaration files exist
    - Verify templates directory is copied
    - Verify package.json "files" field matches contents
    - Verify bin entry point exists and is executable
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 5.3 Implement npx support validation
    - Create validateNpxSupport() to test npx execution
    - Verify bin field configuration
    - Verify shebang in CLI entry point
    - Test package can be executed via npx in isolated environment
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 5.4 Implement validation result aggregation
    - Create validateAll() to run all checks and aggregate results
    - Support skip flags for individual checks
    - Provide detailed error messages with remediation steps
    - _Requirements: 3.7, 10.3_

  - [ ] 5.5 Write unit tests for PrePublishValidator
    - Test each validation check independently
    - Test validation result aggregation
    - Test skip flags functionality
    - Mock command execution and filesystem operations
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.1, 9.2, 9.3, 9.4_

- [ ] 6. Implement Package Publisher
  - [ ] 6.1 Create PackagePublisher class with NPM operations
    - Implement verifyAuthentication() to check NPM login status
    - Implement getPackageInfo() to retrieve package metadata
    - Implement publish() to execute npm publish command
    - Support dist-tag specification for pre-release versions
    - Handle NPM authentication via NPM_TOKEN or .npmrc
    - _Requirements: 1.2, 7.2, 7.3, 9.5_

  - [ ] 6.2 Write unit tests for PackagePublisher
    - Test NPM command construction
    - Test dist-tag handling for pre-releases
    - Test authentication verification
    - Mock npm command execution
    - _Requirements: 1.2, 7.2, 7.3, 9.5_

- [ ] 7. Implement Publishing Orchestrator
  - [ ] 7.1 Create PublishingOrchestrator class with workflow coordination
    - Implement execute() to run complete publishing workflow
    - Implement runStep() to execute individual steps with timing
    - Coordinate all components (VersionManager, Validator, etc.)
    - Track step results and generate summary
    - _Requirements: 1.1, 1.2, 1.3, 10.1, 10.4_

  - [ ] 7.2 Implement dry-run mode
    - Add dry-run flag support throughout workflow
    - Simulate file changes without writing
    - Log git and npm commands without executing
    - Display comprehensive preview of all operations
    - _Requirements: 1.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ] 7.3 Implement workflow error handling and rollback
    - Handle validation failures with clear error messages
    - Implement rollback for version changes on git failures
    - Track completed steps for recovery
    - Provide manual recovery instructions on failures
    - _Requirements: 1.4, 3.7, 10.3_

  - [ ] 7.4 Write unit tests for PublishingOrchestrator
    - Test workflow execution order
    - Test dry-run mode simulation
    - Test error handling and rollback
    - Test step result aggregation
    - Mock all component dependencies
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 10.1, 10.3, 10.4_

- [ ] 8. Implement Publish Command Handler
  - [ ] 8.1 Create publish command in Commander.js
    - Add publish command to CLI program in `src/cli/program.ts`
    - Define all command options (bump, version, preid, tag, skip flags, etc.)
    - Implement option parsing and validation
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 7.1, 7.4, 8.1_

  - [ ] 8.2 Implement publishCommand handler function
    - Create publishCommand() in `src/commands/publish.ts`
    - Integrate with PublishingOrchestrator
    - Add user confirmation prompt before publishing
    - Support --yes flag to skip confirmation
    - Handle errors and display user-friendly messages
    - _Requirements: 1.1, 1.4, 10.2, 10.3_

  - [ ] 8.3 Implement logging and progress indicators
    - Use existing Logger utility for consistent output
    - Add spinners for long-running operations
    - Display progress for each workflow step
    - Show color-coded success/warning/error messages
    - Display comprehensive summary at completion
    - _Requirements: 10.1, 10.2, 10.4, 10.5, 10.6_

  - [ ] 8.4 Write unit tests for publish command
    - Test option parsing and validation
    - Test command handler integration with orchestrator
    - Test error handling and user messages
    - Mock PublishingOrchestrator
    - _Requirements: 1.1, 1.4, 10.2, 10.3_

- [ ] 9. Add configuration support
  - [ ] 9.1 Implement configuration file loading
    - Create config loader for .btoolsrc.json
    - Support publish-specific configuration options
    - Merge command-line options with config file
    - Support package.json "publishConfig" section
    - _Requirements: 1.1_

  - [ ] 9.2 Write unit tests for configuration
    - Test config file loading and parsing
    - Test option merging priority
    - Test default values
    - Mock filesystem operations
    - _Requirements: 1.1_

- [ ] 10. Integration testing and validation
  - [ ] 10.1 Create integration test for complete publish workflow
    - Set up test git repository with commits
    - Test complete workflow in dry-run mode
    - Verify version updates
    - Verify changelog generation
    - Verify git operations (commits, tags)
    - Test with different version bump types
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 4.1, 4.2, 6.1, 6.2_

  - [ ] 10.2 Create integration test for pre-release workflow
    - Test pre-release version creation (alpha, beta, rc)
    - Test pre-release version incrementing
    - Verify dist-tag handling
    - Test upgrading from pre-release to stable
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 10.3 Create integration test for error scenarios
    - Test validation failures (failing tests, dirty git)
    - Test git operation failures
    - Test rollback mechanisms
    - Verify error messages and remediation steps
    - _Requirements: 1.4, 3.7, 10.3_

  - [ ] 10.4 Perform cross-platform testing
    - Test on Windows with cmd and PowerShell
    - Test on macOS with bash
    - Test on Linux with bash
    - Verify git command compatibility
    - Verify npm command compatibility
    - _Requirements: 1.1, 1.2, 6.1, 6.2, 6.3_

- [ ] 11. Documentation and examples
  - [ ] 11.1 Update README.md with publish command documentation
    - Add publish command to Commands section
    - Document all options and flags
    - Provide usage examples for common scenarios
    - Add troubleshooting section for publish issues
    - _Requirements: 1.1, 2.1, 7.1, 8.1_

  - [ ] 11.2 Create PUBLISHING.md guide for maintainers
    - Document complete publishing workflow
    - Provide step-by-step instructions
    - Document pre-release publishing process
    - Include CI/CD integration examples
    - Document rollback procedures
    - _Requirements: 1.1, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 11.3 Add JSDoc comments to all public APIs
    - Document all classes and methods
    - Add usage examples in comments
    - Document error conditions
    - _Requirements: 10.1, 10.2_

- [ ] 12. Final validation and polish
  - [ ] 12.1 Run full test suite and verify coverage
    - Ensure all tests pass
    - Verify 80%+ test coverage
    - Fix any failing tests
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 12.2 Perform manual testing of publish workflow
    - Test actual NPM publishing to test account
    - Verify package installation via npm install
    - Test npx execution without installation
    - Verify package contents and structure
    - Test on multiple platforms
    - _Requirements: 1.2, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 12.3 Update package.json scripts
    - Add publish-related scripts if needed
    - Update prepublishOnly script to use new validator
    - Ensure all scripts work cross-platform
    - _Requirements: 1.1, 3.1, 3.2, 3.3_
