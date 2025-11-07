# Design Document

## Overview

The GitHub Integration feature provides comprehensive GitHub repository management and automation for b-tools, leveraging the GitHub MCP (Model Context Protocol) server for all GitHub API interactions. This design integrates seamlessly with the existing NPM publishing workflow, enabling synchronized releases across NPM and GitHub, automated issue tracking, pull request management, and repository configuration.

The architecture follows b-tools' existing patterns while introducing a new MCP client layer to communicate with the GitHub MCP server. All GitHub operations are abstracted through service classes that use the MCP server, ensuring consistent error handling, authentication, and API interaction patterns.

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
│                   GitHub Command Handlers                    │
│              src/commands/github/*.ts                        │
│  - release.ts, repo.ts, issue.ts, pr.ts                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  GitHub Service Layer                        │
│              src/core/github/services/*.ts                   │
│  - Abstracts GitHub operations                               │
│  - Handles business logic                                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  GitHub MCP Client                           │
│              src/core/github/mcp-client.ts                   │
│  - Communicates with GitHub MCP Server                       │
│  - Handles authentication                                    │
│  - Manages API calls                                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  GitHub MCP Server                           │
│              (External MCP Server)                           │
│  - Provides GitHub API access                                │
│  - Handles rate limiting                                     │
│  - Manages authentication                                    │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

1. **GitHub Command Handlers** (`src/commands/github/`)
   - CLI interface for GitHub operations
   - Option parsing and validation
   - User interaction and prompts
   - Delegates to service layer

2. **GitHub MCP Client** (`src/core/github/mcp-client.ts`)
   - Single point of communication with GitHub MCP Server
   - Authentication management
   - Request/response handling
   - Error translation from MCP to b-tools errors

3. **Release Manager Service** (`src/core/github/services/release-manager.ts`)
   - Creates and manages GitHub releases
   - Generates release notes from changelog
   - Handles pre-release tagging
   - Uploads release assets

4. **Repository Manager Service** (`src/core/github/services/repository-manager.ts`)
   - Creates and configures repositories
   - Manages repository settings
   - Sets up labels and branch protection
   - Synchronizes metadata

5. **Issue Tracker Service** (`src/core/github/services/issue-tracker.ts`)
   - Creates and manages issues
   - Handles milestones
   - Manages labels
   - Supports issue templates

6. **Pull Request Manager Service** (`src/core/github/services/pr-manager.ts`)
   - Creates pull requests
   - Manages PR reviews
   - Handles draft PRs
   - Lists and filters PRs

7. **GitHub Integration Orchestrator** (`src/core/github/orchestrator.ts`)
   - Coordinates GitHub operations with NPM publishing
   - Manages workflow dependencies
   - Handles rollback on failures

## Components and Interfaces

### 1. GitHub MCP Client Interface

```typescript
// src/core/github/mcp-client.ts

export interface GitHubMCPClientConfig {
  owner: string;
  repo: string;
  token?: string; // Optional, can use environment variable
}

export interface MCPResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class GitHubMCPClient {
  constructor(private config: GitHubMCPClientConfig);
  
  // Repository operations
  async createRepository(options: CreateRepoOptions): Promise<MCPResponse<Repository>>;
  async getRepository(): Promise<MCPResponse<Repository>>;
  async updateRepository(updates: RepositoryUpdates): Promise<MCPResponse<Repository>>;
  
  // Release operations
  async createRelease(options: CreateReleaseOptions): Promise<MCPResponse<Release>>;
  async listReleases(): Promise<MCPResponse<Release[]>>;
  async getRelease(tagName: string): Promise<MCPResponse<Release>>;
  
  // Issue operations
  async createIssue(options: CreateIssueOptions): Promise<MCPResponse<Issue>>;
  async listIssues(filters: IssueFilters): Promise<MCPResponse<Issue[]>>;
  async updateIssue(issueNumber: number, updates: IssueUpdates): Promise<MCPResponse<Issue>>;
  
  // Pull request operations
  async createPullRequest(options: CreatePROptions): Promise<MCPResponse<PullRequest>>;
  async listPullRequests(filters: PRFilters): Promise<MCPResponse<PullRequest[]>>;
  async mergePullRequest(prNumber: number, options: MergeOptions): Promise<MCPResponse<void>>;
  
  // Label operations
  async createLabel(label: LabelDefinition): Promise<MCPResponse<Label>>;
  async listLabels(): Promise<MCPResponse<Label[]>>;
  
  // Branch operations
  async createBranch(branchName: string, fromBranch?: string): Promise<MCPResponse<Branch>>;
  async listBranches(): Promise<MCPResponse<Branch[]>>;
  
  // Search operations
  async searchRepositories(query: string): Promise<MCPResponse<Repository[]>>;
  async searchIssues(query: string): Promise<MCPResponse<Issue[]>>;
  
  // Authentication
  async verifyAuthentication(): Promise<MCPResponse<User>>;
  
  private async callMCPTool<T>(toolName: string, params: unknown): Promise<MCPResponse<T>>;
  private handleMCPError(error: unknown): MCPResponse<never>;
}
```

### 2. Release Manager Interface

```typescript
// src/core/github/services/release-manager.ts

export interface ReleaseOptions {
  version: string;
  tagName: string;
  name: string;
  body: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: ReleaseAsset[];
}

export interface ReleaseAsset {
  name: string;
  path: string;
  contentType: string;
}

export interface ReleaseInfo {
  id: number;
  tagName: string;
  name: string;
  url: string;
  htmlUrl: string;
  createdAt: string;
  publishedAt: string;
}

export class ReleaseManager {
  constructor(
    private mcpClient: GitHubMCPClient,
    private changelogGenerator: ChangelogGenerator
  );
  
  async createRelease(options: ReleaseOptions): Promise<ReleaseInfo>;
  async createReleaseFromVersion(version: string, isPrerelease: boolean): Promise<ReleaseInfo>;
  async listReleases(): Promise<ReleaseInfo[]>;
  async getReleaseByTag(tagName: string): Promise<ReleaseInfo | null>;
  private async extractReleaseNotes(version: string): Promise<string>;
  private async uploadAssets(releaseId: number, assets: ReleaseAsset[]): Promise<void>;
}
```

### 3. Repository Manager Interface

```typescript
// src/core/github/services/repository-manager.ts

export interface RepositoryConfig {
  name: string;
  description: string;
  private: boolean;
  autoInit?: boolean;
  gitignoreTemplate?: string;
  licenseTemplate?: string;
}

export interface RepositoryInfo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  htmlUrl: string;
  defaultBranch: string;
}

export interface LabelDefinition {
  name: string;
  color: string;
  description: string;
}

export interface BranchProtectionRules {
  requirePullRequest: boolean;
  requiredReviewers: number;
  requireStatusChecks: boolean;
  requiredStatusChecks: string[];
  enforceAdmins: boolean;
  allowForcePushes: boolean;
  allowDeletions: boolean;
}

export class RepositoryManager {
  constructor(
    private mcpClient: GitHubMCPClient,
    private fs: FileSystemUtils
  );
  
  async createRepository(config: RepositoryConfig): Promise<RepositoryInfo>;
  async getRepository(): Promise<RepositoryInfo>;
  async updateRepository(updates: Partial<RepositoryConfig>): Promise<RepositoryInfo>;
  async syncMetadataFromPackageJson(): Promise<void>;
  async setupStandardLabels(): Promise<void>;
  async configureBranchProtection(branch: string, rules: BranchProtectionRules): Promise<void>;
  async initializeRepository(projectPath: string): Promise<void>;
  private getStandardLabels(): LabelDefinition[];
}
```

### 4. Issue Tracker Interface

```typescript
// src/core/github/services/issue-tracker.ts

export interface IssueOptions {
  title: string;
  body: string;
  labels?: string[];
  assignees?: string[];
  milestone?: number;
}

export interface IssueInfo {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: string[];
  url: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneOptions {
  title: string;
  description?: string;
  dueOn?: string;
  state?: 'open' | 'closed';
}

export interface MilestoneInfo {
  number: number;
  title: string;
  description: string;
  state: 'open' | 'closed';
  openIssues: number;
  closedIssues: number;
  dueOn?: string;
}

export class IssueTracker {
  constructor(private mcpClient: GitHubMCPClient);
  
  async createIssue(options: IssueOptions): Promise<IssueInfo>;
  async listIssues(filters?: IssueFilters): Promise<IssueInfo[]>;
  async getIssue(issueNumber: number): Promise<IssueInfo>;
  async updateIssue(issueNumber: number, updates: Partial<IssueOptions>): Promise<IssueInfo>;
  async closeIssue(issueNumber: number): Promise<IssueInfo>;
  async createMilestone(options: MilestoneOptions): Promise<MilestoneInfo>;
  async listMilestones(): Promise<MilestoneInfo[]>;
  async closeMilestone(milestoneNumber: number): Promise<MilestoneInfo>;
}
```

### 5. Pull Request Manager Interface

```typescript
// src/core/github/services/pr-manager.ts

export interface PullRequestOptions {
  title: string;
  body: string;
  head: string; // Source branch
  base: string; // Target branch
  draft?: boolean;
  labels?: string[];
  reviewers?: string[];
}

export interface PullRequestInfo {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  draft: boolean;
  head: string;
  base: string;
  url: string;
  htmlUrl: string;
  mergeable: boolean;
  merged: boolean;
  createdAt: string;
}

export class PullRequestManager {
  constructor(
    private mcpClient: GitHubMCPClient,
    private git: GitIntegration
  );
  
  async createPullRequest(options: PullRequestOptions): Promise<PullRequestInfo>;
  async listPullRequests(filters?: PRFilters): Promise<PullRequestInfo[]>;
  async getPullRequest(prNumber: number): Promise<PullRequestInfo>;
  async mergePullRequest(prNumber: number, method?: 'merge' | 'squash' | 'rebase'): Promise<void>;
  async createPullRequestFromCurrentBranch(title: string, body: string): Promise<PullRequestInfo>;
  private async validateBranchHasCommits(branch: string): Promise<boolean>;
}
```

### 6. GitHub Integration Orchestrator Interface

```typescript
// src/core/github/orchestrator.ts

export interface GitHubPublishOptions {
  version: string;
  isPrerelease: boolean;
  skipRelease?: boolean;
  releaseAssets?: ReleaseAsset[];
}

export interface GitHubPublishResult {
  releaseCreated: boolean;
  releaseUrl?: string;
  errors: string[];
}

export class GitHubIntegrationOrchestrator {
  constructor(
    private releaseManager: ReleaseManager,
    private repositoryManager: RepositoryManager,
    private logger: Logger
  );
  
  async handlePublish(options: GitHubPublishOptions): Promise<GitHubPublishResult>;
  async verifyGitHubSetup(): Promise<boolean>;
  private async ensureTagPushed(tagName: string): Promise<void>;
}
```

## Data Models

### GitHub MCP Server Tool Mapping

The GitHub MCP Client will use these MCP tools:

```typescript
// Repository tools
- mcp_github_create_repository
- mcp_github_get_file_contents
- mcp_github_create_or_update_file
- mcp_github_push_files

// Release tools
- mcp_github_create_release (via API - may need custom implementation)

// Issue tools
- mcp_github_create_issue
- mcp_github_list_issues
- mcp_github_get_issue
- mcp_github_update_issue
- mcp_github_add_issue_comment

// Pull request tools
- mcp_github_create_pull_request
- mcp_github_list_pull_requests
- mcp_github_get_pull_request
- mcp_github_merge_pull_request
- mcp_github_get_pull_request_files

// Branch tools
- mcp_github_create_branch
- mcp_github_list_commits

// Search tools
- mcp_github_search_repositories
- mcp_github_search_issues
- mcp_github_search_code

// Label tools (may need custom implementation)
- Custom label management via file updates
```

### Configuration

```typescript
// .btoolsrc.json
{
  "github": {
    "owner": "razukc",
    "repo": "b-tools",
    "autoRelease": true,
    "releaseAssets": [],
    "labels": {
      "autoSetup": true,
      "custom": []
    },
    "branchProtection": {
      "enabled": true,
      "requireReviews": true,
      "requiredReviewers": 1
    }
  }
}
```

### Environment Variables

```bash
# GitHub authentication
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx

# Optional: Override owner/repo
GITHUB_OWNER=razukc
GITHUB_REPO=b-tools
```

## Error Handling

### Error Types

```typescript
// src/utils/errors.ts (extend existing)

export class GitHubError extends BToolsError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'GITHUB_ERROR', context);
  }
}

export class GitHubAuthenticationError extends GitHubError {
  constructor(details: string) {
    super('GitHub authentication failed', { details });
  }
}

export class GitHubAPIError extends GitHubError {
  constructor(operation: string, statusCode: number, message: string) {
    super(`GitHub API error: ${operation}`, { statusCode, message });
  }
}

export class GitHubRateLimitError extends GitHubError {
  constructor(resetTime: Date) {
    super('GitHub API rate limit exceeded', { resetTime });
  }
}

export class RepositoryNotFoundError extends GitHubError {
  constructor(owner: string, repo: string) {
    super(`Repository not found: ${owner}/${repo}`, { owner, repo });
  }
}
```

### Error Recovery

1. **Authentication Failures**
   - Check for GITHUB_TOKEN environment variable
   - Provide instructions for creating Personal Access Token
   - Validate token scopes

2. **API Rate Limiting**
   - Detect rate limit errors
   - Display reset time
   - Suggest waiting or using authenticated requests

3. **Network Failures**
   - Retry with exponential backoff
   - Provide offline mode for operations that don't require GitHub
   - Cache responses when appropriate

4. **Permission Errors**
   - Check repository permissions
   - Provide clear error messages about required permissions
   - Suggest repository access solutions

## Testing Strategy

### Unit Tests (60%)

1. **GitHub MCP Client Tests**
   - Test MCP tool invocation
   - Test response parsing
   - Test error handling
   - Mock MCP server responses

2. **Service Layer Tests**
   - Test ReleaseManager operations
   - Test RepositoryManager operations
   - Test IssueTracker operations
   - Test PullRequestManager operations
   - Mock GitHubMCPClient

3. **Orchestrator Tests**
   - Test publish workflow integration
   - Test error handling
   - Test rollback scenarios
   - Mock all service dependencies

### Integration Tests (30%)

1. **End-to-End GitHub Operations**
   - Test repository creation (using test account)
   - Test release creation
   - Test issue creation
   - Test PR creation
   - Use real GitHub MCP server with test repository

2. **NPM Publish Integration**
   - Test GitHub release creation during NPM publish
   - Test metadata synchronization
   - Test error handling when GitHub operations fail

3. **Cross-Platform Testing**
   - Test on Windows, macOS, Linux
   - Test with different git configurations
   - Test with different GitHub authentication methods

### Manual Tests (10%)

1. **GitHub UI Verification**
   - Verify releases appear correctly on GitHub
   - Verify issues are created with correct formatting
   - Verify PRs are created with correct settings
   - Verify labels and milestones are set up correctly

2. **Authentication Testing**
   - Test with Personal Access Token
   - Test with different token scopes
   - Test authentication error messages

## Implementation Notes

### GitHub MCP Server Setup

Users need to configure the GitHub MCP server in their MCP settings:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### MCP Client Implementation

The GitHubMCPClient will:
1. Detect if GitHub MCP server is configured
2. Provide helpful error messages if not configured
3. Use the MCP protocol to invoke GitHub tools
4. Handle MCP-specific errors and translate to b-tools errors

### Integration with NPM Publishing

The GitHub integration will hook into the NPM publishing workflow:

```typescript
// In PublishingOrchestrator
async publishToNpm(): Promise<void> {
  // ... existing NPM publish logic ...
  
  // After successful NPM publish
  if (this.config.github?.autoRelease) {
    await this.githubOrchestrator.handlePublish({
      version: this.targetVersion,
      isPrerelease: this.isPrerelease,
      skipRelease: this.options.skipGitHubRelease
    });
  }
}
```

### Release Notes Generation

Extract release notes from CHANGELOG.md:

```typescript
async extractReleaseNotes(version: string): Promise<string> {
  const changelog = await this.fs.readFile('CHANGELOG.md');
  
  // Parse changelog and extract section for this version
  const versionRegex = new RegExp(`## \\[${version}\\].*?(?=## \\[|$)`, 's');
  const match = changelog.match(versionRegex);
  
  if (!match) {
    return `Release ${version}`;
  }
  
  return match[0];
}
```

### Repository Initialization

When creating a new project:

```typescript
// In create command
if (options.initGithub) {
  const repoManager = new RepositoryManager(mcpClient, fs);
  
  await repoManager.createRepository({
    name: projectName,
    description: `${projectName} - Chrome Extension`,
    private: false,
    autoInit: false
  });
  
  await repoManager.setupStandardLabels();
  await repoManager.configureBranchProtection('main', {
    requirePullRequest: true,
    requiredReviewers: 1,
    requireStatusChecks: false
  });
}
```

### Standard Labels

```typescript
private getStandardLabels(): LabelDefinition[] {
  return [
    { name: 'bug', color: 'd73a4a', description: 'Something isn\'t working' },
    { name: 'enhancement', color: 'a2eeef', description: 'New feature or request' },
    { name: 'documentation', color: '0075ca', description: 'Improvements or additions to documentation' },
    { name: 'question', color: 'd876e3', description: 'Further information is requested' },
    { name: 'priority: high', color: 'b60205', description: 'High priority' },
    { name: 'priority: medium', color: 'fbca04', description: 'Medium priority' },
    { name: 'priority: low', color: '0e8a16', description: 'Low priority' },
    { name: 'status: in-progress', color: 'ededed', description: 'Work in progress' },
    { name: 'status: blocked', color: 'e99695', description: 'Blocked by dependencies' },
    { name: 'status: needs-review', color: 'c5def5', description: 'Needs code review' }
  ];
}
```

### Security Considerations

1. **Token Management**
   - Never log GitHub tokens
   - Use environment variables for tokens
   - Validate token scopes before operations
   - Support token rotation

2. **Repository Access**
   - Verify repository permissions before operations
   - Handle private repository access
   - Respect organization policies

3. **Rate Limiting**
   - Track API usage
   - Implement exponential backoff
   - Cache responses when appropriate
   - Use conditional requests (ETags)

### Performance Optimization

1. **Parallel Operations**
   - Create labels in parallel
   - Upload release assets concurrently
   - Batch API calls when possible

2. **Caching**
   - Cache repository information
   - Cache label lists
   - Use conditional requests

3. **Lazy Loading**
   - Only initialize GitHub client when needed
   - Defer authentication until first API call
   - Load configuration on demand

## CI/CD Pipeline Integration

### Overview

The GitHub integration includes automated CI/CD pipeline setup using GitHub Actions. This provides continuous integration for testing, building, and publishing b-tools packages, as well as automated release workflows.

### CI/CD Manager Component

```typescript
// src/core/github/services/cicd-manager.ts

export interface CICDConfig {
  enableCI: boolean;
  enableCD: boolean;
  nodeVersions: string[];
  platforms: ('ubuntu-latest' | 'windows-latest' | 'macos-latest')[];
  testCoverage: boolean;
  autoPublish: boolean;
}

export interface WorkflowFile {
  name: string;
  path: string;
  content: string;
}

export class CICDManager {
  constructor(
    private mcpClient: GitHubMCPClient,
    private fs: FileSystemUtils
  );
  
  async setupCIWorkflow(config: CICDConfig): Promise<void>;
  async setupCDWorkflow(config: CICDConfig): Promise<void>;
  async setupReleaseWorkflow(): Promise<void>;
  async listWorkflows(): Promise<WorkflowInfo[]>;
  async triggerWorkflow(workflowName: string): Promise<void>;
  private generateCIWorkflow(config: CICDConfig): WorkflowFile;
  private generateCDWorkflow(config: CICDConfig): WorkflowFile;
  private generateReleaseWorkflow(): WorkflowFile;
}
```

### GitHub Actions Workflows

#### 1. Continuous Integration Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    name: Test on ${{ matrix.os }} with Node ${{ matrix.node }}
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
      
      - name: Upload coverage
        if: matrix.os == 'ubuntu-latest' && matrix.node == '20'
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  integration-test:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Test CLI installation
        run: |
          npm run build
          npm link
          b-tools --version
          b-tools --help
```

#### 2. Continuous Deployment Workflow

```yaml
# .github/workflows/cd.yml
name: CD

on:
  release:
    types: [published]

jobs:
  publish-npm:
    name: Publish to NPM
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
      
      - name: Publish to NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Verify publication
        run: |
          sleep 10
          npm view b-tools version
  
  publish-github:
    name: Update GitHub Release
    runs-on: ubuntu-latest
    needs: publish-npm
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Build distribution package
        run: |
          npm ci
          npm run build
          tar -czf b-tools-dist.tar.gz dist/
      
      - name: Upload release asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ github.event.release.upload_url }}
          asset_path: ./b-tools-dist.tar.gz
          asset_name: b-tools-dist.tar.gz
          asset_content_type: application/gzip
```

#### 3. Automated Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version bump type'
        required: true
        type: choice
        options:
          - patch
          - minor
          - major
          - prerelease
      preid:
        description: 'Pre-release identifier (alpha, beta, rc)'
        required: false
        type: string

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
          cache: 'npm'
      
      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build CLI
        run: npm run build
      
      - name: Run release command
        run: |
          if [ -n "${{ github.event.inputs.preid }}" ]; then
            node dist/cli/index.js publish --bump ${{ github.event.inputs.version }} --preid ${{ github.event.inputs.preid }} --yes
          else
            node dist/cli/index.js publish --bump ${{ github.event.inputs.version }} --yes
          fi
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 4. Dependency Update Workflow

```yaml
# .github/workflows/dependency-update.yml
name: Dependency Update

on:
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday
  workflow_dispatch:

jobs:
  update-dependencies:
    name: Update Dependencies
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Update dependencies
        run: |
          npm update
          npm audit fix
      
      - name: Run tests
        run: |
          npm ci
          npm test
      
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore: update dependencies'
          title: 'chore: update dependencies'
          body: |
            Automated dependency update
            
            - Updated npm dependencies
            - Ran security audit fixes
            - All tests passing
          branch: dependency-updates
          labels: dependencies, automated
```

### CI/CD Configuration Interface

```typescript
// Integration with RepositoryManager

export interface CICDSetupOptions {
  ci: {
    enabled: boolean;
    nodeVersions: string[];
    platforms: string[];
    coverage: boolean;
  };
  cd: {
    enabled: boolean;
    autoPublish: boolean;
    publishOnRelease: boolean;
  };
  workflows: {
    release: boolean;
    dependencyUpdate: boolean;
  };
  secrets: {
    npmToken: boolean;
    githubToken: boolean;
  };
}

// In RepositoryManager
async setupCICD(options: CICDSetupOptions): Promise<void> {
  const cicdManager = new CICDManager(this.mcpClient, this.fs);
  
  if (options.ci.enabled) {
    await cicdManager.setupCIWorkflow({
      enableCI: true,
      enableCD: false,
      nodeVersions: options.ci.nodeVersions,
      platforms: options.ci.platforms as any,
      testCoverage: options.ci.coverage,
      autoPublish: false
    });
  }
  
  if (options.cd.enabled) {
    await cicdManager.setupCDWorkflow({
      enableCI: false,
      enableCD: true,
      nodeVersions: ['20'],
      platforms: ['ubuntu-latest'],
      testCoverage: false,
      autoPublish: options.cd.autoPublish
    });
  }
  
  if (options.workflows.release) {
    await cicdManager.setupReleaseWorkflow();
  }
}
```

### Secrets Management

The CI/CD setup will guide users to configure required secrets:

```typescript
async validateSecrets(): Promise<ValidationResult> {
  const requiredSecrets = ['NPM_TOKEN', 'GITHUB_TOKEN'];
  const missingSecrets: string[] = [];
  
  for (const secret of requiredSecrets) {
    const exists = await this.checkSecretExists(secret);
    if (!exists) {
      missingSecrets.push(secret);
    }
  }
  
  if (missingSecrets.length > 0) {
    return {
      valid: false,
      errors: [{
        check: 'secrets',
        message: `Missing required secrets: ${missingSecrets.join(', ')}`,
        remediation: `Add secrets at: https://github.com/${this.owner}/${this.repo}/settings/secrets/actions`
      }]
    };
  }
  
  return { valid: true, errors: [] };
}
```

### Workflow Status Monitoring

```typescript
export interface WorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null;
  url: string;
  createdAt: string;
}

async getWorkflowRuns(workflowName?: string): Promise<WorkflowRun[]> {
  // Use GitHub MCP to fetch workflow runs
  const response = await this.mcpClient.callMCPTool('github_list_workflow_runs', {
    owner: this.owner,
    repo: this.repo,
    workflow_id: workflowName
  });
  
  return response.data.workflow_runs.map(run => ({
    id: run.id,
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    url: run.html_url,
    createdAt: run.created_at
  }));
}
```

### Integration with Publish Command

The publish command will trigger CI/CD workflows:

```typescript
// In PublishingOrchestrator
async publishToNpm(): Promise<void> {
  // ... existing NPM publish logic ...
  
  // After successful NPM publish
  if (this.config.github?.autoRelease) {
    await this.githubOrchestrator.handlePublish({
      version: this.targetVersion,
      isPrerelease: this.isPrerelease,
      skipRelease: this.options.skipGitHubRelease
    });
    
    // Trigger CD workflow if configured
    if (this.config.github?.cicd?.triggerOnPublish) {
      await this.cicdManager.triggerWorkflow('cd');
    }
  }
}
```

### CLI Commands for CI/CD

```typescript
// New commands for CI/CD management

// Setup CI/CD
b-tools github cicd setup --ci --cd --release-workflow

// List workflows
b-tools github cicd list

// Trigger workflow
b-tools github cicd trigger --workflow release --version patch

// Check workflow status
b-tools github cicd status

// View workflow runs
b-tools github cicd runs --workflow ci --limit 10
```
