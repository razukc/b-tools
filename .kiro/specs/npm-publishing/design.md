# Design Document

## Overview

The NPM Publishing feature provides a comprehensive, automated workflow for publishing b-tools to the NPM registry. It integrates version management, pre-publish validation, changelog generation, git operations, and package integrity checks into a single streamlined command. The design follows the existing b-tools architecture patterns, using Commander.js for CLI integration, the existing Logger utility for output, and modular components for each responsibility.

The system is designed with safety as a priority - multiple validation gates prevent publishing broken packages, and a dry-run mode allows previewing all operations before execution. The architecture supports both manual publishing workflows and future CI/CD automation.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLI Layer (Commander)                    │
│                  src/cli/program.ts                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Publish Command Handler                    │
│                  src/commands/publish.ts                     │
│  - Parse options                                             │
│  - Orchestrate workflow                                      │
│  - Handle errors                                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Publishing Orchestrator                     │
│              src/core/publish/orchestrator.ts                │
│  - Coordinate all publishing steps                           │
│  - Manage workflow state                                     │
│  - Handle dry-run mode                                       │
└─────┬───────────┬──────────┬──────────┬──────────┬──────────┘
      │           │          │          │          │
      ▼           ▼          ▼          ▼          ▼
┌──────────┐ ┌────────┐ ┌─────────┐ ┌──────┐ ┌──────────┐
│ Version  │ │Pre-Pub │ │Changelog│ │ Git  │ │ Package  │
│ Manager  │ │Validator│ │Generator│ │Integ │ │Publisher │
└──────────┘ └────────┘ └─────────┘ └──────┘ └──────────┘
```

### Component Responsibilities

1. **Publish Command Handler** (`src/commands/publish.ts`)
   - CLI interface and option parsing
   - User interaction and confirmation prompts
   - Error handling and user-friendly messages
   - Delegates to orchestrator

2. **Publishing Orchestrator** (`src/core/publish/orchestrator.ts`)
   - Coordinates the entire publishing workflow
   - Manages execution order and dependencies
   - Handles dry-run simulation
   - Aggregates results and generates summary

3. **Version Manager** (`src/core/publish/version-manager.ts`)
   - Semantic version manipulation
   - package.json and package-lock.json updates
   - Version validation
   - Pre-release version handling

4. **Pre-Publish Validator** (`src/core/publish/validator.ts`)
   - Test execution
   - Build verification
   - Linting checks
   - Git status validation
   - Package integrity checks

5. **Changelog Generator** (`src/core/publish/changelog.ts`)
   - Git commit parsing
   - Conventional commit categorization
   - CHANGELOG.md generation and updates
   - Formatting and templating

6. **Git Integration** (`src/core/publish/git.ts`)
   - Git command execution
   - Tag creation and management
   - Commit operations
   - Remote push operations

7. **Package Publisher** (`src/core/publish/publisher.ts`)
   - NPM publish command execution
   - Dist-tag management
   - Package verification
   - NPM authentication handling

## Components and Interfaces

### 1. Publish Command Interface

```typescript
// src/commands/publish.ts

export interface PublishCommandOptions {
  // Version bump type
  bump?: 'major' | 'minor' | 'patch' | 'premajor' | 'preminor' | 'prepatch' | 'prerelease';
  
  // Explicit version (alternative to bump)
  version?: string;
  
  // Pre-release identifier
  preid?: 'alpha' | 'beta' | 'rc';
  
  // NPM dist-tag
  tag?: string;
  
  // Skip validation steps
  skipTests?: boolean;
  skipBuild?: boolean;
  skipLint?: boolean;
  
  // Git options
  noGitTag?: boolean;
  noGitPush?: boolean;
  
  // Dry run mode
  dryRun?: boolean;
  
  // Verbose output
  verbose?: boolean;
  
  // Skip confirmation prompt
  yes?: boolean;
}

export interface PublishCommandResult {
  success: boolean;
  version: string;
  published: boolean;
  gitTagged: boolean;
  gitPushed: boolean;
  message: string;
}

export async function publishCommand(
  options: PublishCommandOptions
): Promise<PublishCommandResult>;
```

### 2. Publishing Orchestrator Interface

```typescript
// src/core/publish/orchestrator.ts

export interface PublishWorkflowConfig {
  options: PublishCommandOptions;
  currentVersion: string;
  targetVersion: string;
  isDryRun: boolean;
}

export interface PublishWorkflowResult {
  success: boolean;
  steps: PublishStepResult[];
  summary: PublishSummary;
}

export interface PublishStepResult {
  step: string;
  success: boolean;
  message: string;
  duration: number;
  skipped?: boolean;
}

export interface PublishSummary {
  version: string;
  published: boolean;
  gitTagged: boolean;
  gitPushed: boolean;
  changelogUpdated: boolean;
  totalDuration: number;
}

export class PublishingOrchestrator {
  async execute(config: PublishWorkflowConfig): Promise<PublishWorkflowResult>;
  private async runStep(step: PublishStep): Promise<PublishStepResult>;
  private async validatePrerequisites(): Promise<void>;
  private async updateVersion(): Promise<void>;
  private async runValidation(): Promise<void>;
  private async generateChangelog(): Promise<void>;
  private async commitChanges(): Promise<void>;
  private async publishToNpm(): Promise<void>;
  private async createGitTag(): Promise<void>;
  private async pushToRemote(): Promise<void>;
}
```

### 3. Version Manager Interface

```typescript
// src/core/publish/version-manager.ts

export interface VersionInfo {
  current: string;
  next: string;
  isPrerelease: boolean;
  preid?: string;
}

export class VersionManager {
  constructor(private fs: FileSystemUtils);
  
  async getCurrentVersion(): Promise<string>;
  async bumpVersion(type: string, preid?: string): Promise<VersionInfo>;
  async setVersion(version: string): Promise<VersionInfo>;
  validateVersion(version: string): boolean;
  parseVersion(version: string): { major: number; minor: number; patch: number; prerelease?: string };
  async updatePackageJson(version: string): Promise<void>;
  async updatePackageLock(version: string): Promise<void>;
}
```

### 4. Pre-Publish Validator Interface

```typescript
// src/core/publish/validator.ts

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  check: string;
  message: string;
  remediation?: string;
}

export interface ValidationWarning {
  check: string;
  message: string;
}

export class PrePublishValidator {
  constructor(
    private fs: FileSystemUtils,
    private git: GitIntegration
  );
  
  async validateAll(options: ValidationOptions): Promise<ValidationResult>;
  async validateTests(): Promise<ValidationResult>;
  async validateBuild(): Promise<ValidationResult>;
  async validateLint(): Promise<ValidationResult>;
  async validateGitStatus(): Promise<ValidationResult>;
  async validateBranch(): Promise<ValidationResult>;
  async validatePackageIntegrity(): Promise<ValidationResult>;
  async validateNpxSupport(): Promise<ValidationResult>;
}
```

### 5. Changelog Generator Interface

```typescript
// src/core/publish/changelog.ts

export interface ChangelogEntry {
  version: string;
  date: string;
  sections: ChangelogSection[];
}

export interface ChangelogSection {
  type: 'feat' | 'fix' | 'docs' | 'chore' | 'refactor' | 'test' | 'other';
  title: string;
  commits: ChangelogCommit[];
}

export interface ChangelogCommit {
  hash: string;
  message: string;
  author: string;
  breaking: boolean;
}

export class ChangelogGenerator {
  constructor(private git: GitIntegration, private fs: FileSystemUtils);
  
  async generate(version: string): Promise<ChangelogEntry>;
  async update(entry: ChangelogEntry): Promise<void>;
  private async getCommitsSinceLastTag(): Promise<GitCommit[]>;
  private parseCommit(commit: GitCommit): ChangelogCommit;
  private categorizeCommits(commits: ChangelogCommit[]): ChangelogSection[];
  private formatEntry(entry: ChangelogEntry): string;
}
```

### 6. Git Integration Interface

```typescript
// src/core/publish/git.ts

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export interface GitStatus {
  clean: boolean;
  branch: string;
  ahead: number;
  behind: number;
  staged: string[];
  unstaged: string[];
  untracked: string[];
}

export class GitIntegration {
  async getStatus(): Promise<GitStatus>;
  async getCurrentBranch(): Promise<string>;
  async getCommitsSince(tag: string): Promise<GitCommit[]>;
  async getLastTag(): Promise<string | null>;
  async createTag(version: string, message: string): Promise<void>;
  async commit(message: string, files: string[]): Promise<void>;
  async push(includeTags: boolean): Promise<void>;
  async hasRemote(): Promise<boolean>;
  private async exec(command: string): Promise<string>;
}
```

### 7. Package Publisher Interface

```typescript
// src/core/publish/publisher.ts

export interface PublishOptions {
  tag?: string;
  access?: 'public' | 'restricted';
  dryRun?: boolean;
}

export interface PublishResult {
  success: boolean;
  version: string;
  tag: string;
  packageUrl: string;
}

export class PackagePublisher {
  async publish(options: PublishOptions): Promise<PublishResult>;
  async verifyAuthentication(): Promise<boolean>;
  async getPackageInfo(): Promise<PackageInfo>;
  private async exec(command: string): Promise<string>;
}
```

## Data Models

### Package.json Structure

```typescript
interface PackageJson {
  name: string;
  version: string;
  description: string;
  main: string;
  bin: Record<string, string>;
  type: 'module';
  files: string[];
  scripts: Record<string, string>;
  keywords: string[];
  author: string;
  repository: {
    type: string;
    url: string;
  };
  bugs: {
    url: string;
  };
  homepage: string;
  license: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}
```

### CHANGELOG.md Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-01-15

### Features
- Add new publish command for automated NPM publishing (abc1234)
- Support pre-release versions with dist-tags (def5678)

### Bug Fixes
- Fix manifest validation for optional permissions (ghi9012)

### Documentation
- Update README with publish command usage (jkl3456)

## [1.1.0] - 2024-01-01
...
```

## Error Handling

### Error Types

```typescript
// src/utils/errors.ts (extend existing)

export class PublishError extends BToolsError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'PUBLISH_ERROR', context);
  }
}

export class ValidationFailedError extends PublishError {
  constructor(checks: ValidationError[]) {
    super('Pre-publish validation failed', { checks });
  }
}

export class GitOperationError extends PublishError {
  constructor(operation: string, details: string) {
    super(`Git operation failed: ${operation}`, { details });
  }
}

export class NpmPublishError extends PublishError {
  constructor(details: string) {
    super('NPM publish failed', { details });
  }
}
```

### Error Recovery

1. **Validation Failures**
   - Display all validation errors with remediation steps
   - Allow user to fix issues and retry
   - Provide --skip flags for non-critical checks

2. **Git Operation Failures**
   - Rollback version changes if git operations fail
   - Provide manual recovery instructions
   - Support --no-git-push for local-only operations

3. **NPM Publish Failures**
   - Keep git tags and commits for retry
   - Display NPM error messages clearly
   - Suggest authentication or permission fixes

4. **Partial Failures**
   - Track which steps completed successfully
   - Allow resuming from failed step
   - Provide cleanup commands if needed

## Testing Strategy

### Unit Tests (70%)

1. **Version Manager Tests**
   - Test all bump types (major, minor, patch, pre-release)
   - Test version validation
   - Test package.json and package-lock.json updates
   - Test edge cases (invalid versions, missing files)

2. **Validator Tests**
   - Test each validation check independently
   - Test validation result aggregation
   - Test skip flags
   - Mock external commands (npm test, npm run build)

3. **Changelog Generator Tests**
   - Test commit parsing and categorization
   - Test conventional commit format handling
   - Test CHANGELOG.md creation and updates
   - Test formatting and templating

4. **Git Integration Tests**
   - Test git command execution
   - Test status parsing
   - Test commit and tag creation
   - Mock git commands

5. **Package Publisher Tests**
   - Test NPM command construction
   - Test dist-tag handling
   - Test authentication verification
   - Mock npm publish

### Integration Tests (25%)

1. **End-to-End Publish Workflow**
   - Test complete publish flow in test repository
   - Verify version updates
   - Verify changelog generation
   - Verify git operations
   - Use dry-run mode to avoid actual publishing

2. **Error Handling Integration**
   - Test validation failure scenarios
   - Test git operation failures
   - Test rollback mechanisms

3. **Cross-Platform Testing**
   - Test on Windows, macOS, Linux
   - Test git command compatibility
   - Test npm command compatibility

### Manual Tests (5%)

1. **Actual NPM Publishing**
   - Test publishing to NPM test account
   - Verify package installation
   - Test npx execution
   - Verify package contents

2. **Pre-release Publishing**
   - Test beta/alpha publishing
   - Verify dist-tags
   - Test upgrading from pre-release to stable

## Implementation Notes

### Workflow Execution Order

1. **Pre-flight Checks**
   - Verify git repository exists
   - Verify NPM authentication
   - Verify current branch is main/master
   - Verify working directory is clean

2. **Version Update**
   - Calculate new version
   - Update package.json
   - Update package-lock.json
   - Display version change for confirmation

3. **Validation**
   - Run tests (unless --skip-tests)
   - Run build (unless --skip-build)
   - Run lint (unless --skip-lint)
   - Verify package integrity
   - Verify npx support

4. **Changelog Generation**
   - Get commits since last tag
   - Parse and categorize commits
   - Generate changelog entry
   - Update CHANGELOG.md

5. **Git Operations**
   - Commit version and changelog changes
   - Create git tag
   - Push to remote (unless --no-git-push)

6. **NPM Publishing**
   - Build package
   - Publish to NPM
   - Verify publication

7. **Summary**
   - Display what was accomplished
   - Show package URL
   - Show installation command

### Dry-Run Implementation

In dry-run mode:
- All validation steps execute normally
- File changes are simulated (show diffs)
- Git commands are logged but not executed
- NPM publish is logged but not executed
- Summary shows what would happen

### Configuration

Support configuration via:
1. Command-line flags (highest priority)
2. package.json "publishConfig" section
3. .btoolsrc.json file
4. Sensible defaults

Example .btoolsrc.json:
```json
{
  "publish": {
    "skipTests": false,
    "skipLint": false,
    "gitPush": true,
    "changelog": true,
    "conventionalCommits": true
  }
}
```

### NPX Support Verification

Ensure npx compatibility:
1. Verify bin field in package.json
2. Verify shebang in CLI entry point
3. Test npx execution in validation
4. Verify all dependencies are included
5. Optimize package size

### Security Considerations

1. **NPM Authentication**
   - Use NPM_TOKEN environment variable
   - Support .npmrc authentication
   - Never log authentication tokens

2. **Git Credentials**
   - Use existing git credentials
   - Support SSH and HTTPS
   - Never prompt for passwords in CI

3. **Validation**
   - Verify package contents before publishing
   - Check for sensitive files
   - Validate manifest integrity

### Performance Optimization

1. **Parallel Validation**
   - Run independent validation checks in parallel
   - Tests, build, and lint can run concurrently

2. **Incremental Operations**
   - Only rebuild if source changed
   - Cache validation results

3. **Fast Feedback**
   - Run quick checks first (git status, branch)
   - Run slow checks last (tests, build)
