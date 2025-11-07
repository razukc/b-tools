# Implementation Plan

- [x] 1. Set up GitHub integration infrastructure





  - Create directory structure for GitHub feature in `src/core/github/`
  - Create services subdirectory for service classes
  - Define TypeScript interfaces and types for GitHub operations
  - Set up error types specific to GitHub operations
  - _Requirements: 1.6, 9.3, 12.3_

- [ ] 2. Implement GitHub MCP Client
  - [ ] 2.1 Create GitHubMCPClient class with MCP communication
    - Implement constructor with configuration (owner, repo, token)
    - Implement callMCPTool() method for invoking MCP tools
    - Implement handleMCPError() for error translation
    - Add authentication token management
    - _Requirements: 1.6, 2.7, 3.6, 4.6, 5.6, 6.5, 8.6, 9.1, 9.6, 11.6_

  - [ ] 2.2 Implement repository operation methods
    - Create createRepository() using mcp_github_create_repository
    - Create getRepository() to fetch repository information
    - Create updateRepository() for repository settings updates
    - _Requirements: 2.1, 2.2, 2.3, 2.7, 5.1, 5.2, 5.3, 5.6_

  - [ ] 2.3 Implement release operation methods
    - Create createRelease() for GitHub releases
    - Create listReleases() to fetch all releases
    - Create getRelease() to fetch specific release by tag
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ] 2.4 Implement issue operation methods
    - Create createIssue() using mcp_github_create_issue
    - Create listIssues() using mcp_github_list_issues
    - Create getIssue() using mcp_github_get_issue
    - Create updateIssue() using mcp_github_update_issue
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 2.5 Implement pull request operation methods
    - Create createPullRequest() using mcp_github_create_pull_request
    - Create listPullRequests() using mcp_github_list_pull_requests
    - Create getPullRequest() using mcp_github_get_pull_request
    - Create mergePullRequest() using mcp_github_merge_pull_request
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ] 2.6 Implement label and branch operation methods
    - Create createLabel() for label management
    - Create listLabels() to fetch all labels
    - Create createBranch() using mcp_github_create_branch
    - Create listBranches() to fetch all branches
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ] 2.7 Implement search and authentication methods
    - Create searchRepositories() using mcp_github_search_repositories
    - Create searchIssues() using mcp_github_search_issues
    - Create verifyAuthentication() to check GitHub token
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ] 2.8 Write unit tests for GitHubMCPClient
    - Test MCP tool invocation with mocked responses
    - Test error handling and translation
    - Test authentication verification
    - Test all operation methods
    - Mock MCP server responses
    - _Requirements: 1.6, 2.7, 3.6, 4.6, 5.6, 6.5, 8.6, 9.1, 9.6, 11.6_

- [ ] 3. Implement Release Manager Service
  - [ ] 3.1 Create ReleaseManager class with release operations
    - Implement createRelease() to create GitHub releases
    - Implement createReleaseFromVersion() to auto-generate from version
    - Implement listReleases() to fetch all releases
    - Implement getReleaseByTag() to fetch specific release
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 3.2 Implement release notes extraction
    - Create extractReleaseNotes() to parse CHANGELOG.md
    - Parse changelog sections by version
    - Format release notes for GitHub
    - Handle missing changelog gracefully
    - _Requirements: 1.2, 1.3_

  - [ ] 3.3 Implement release asset upload
    - Create uploadAssets() to upload files to releases
    - Support multiple asset types
    - Handle upload errors and retries
    - _Requirements: 1.5_

  - [ ] 3.4 Write unit tests for ReleaseManager
    - Test release creation with various options
    - Test release notes extraction from changelog
    - Test pre-release marking
    - Test asset upload
    - Mock GitHubMCPClient and ChangelogGenerator
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 4. Implement Repository Manager Service
  - [ ] 4.1 Create RepositoryManager class with repository operations
    - Implement createRepository() to create new repositories
    - Implement getRepository() to fetch repository info
    - Implement updateRepository() to update settings
    - Implement initializeRepository() to set up new repos
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 4.2 Implement metadata synchronization
    - Create syncMetadataFromPackageJson() to sync description, topics, homepage
    - Read package.json and extract metadata
    - Update GitHub repository settings via MCP client
    - Support dry-run mode
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 4.3 Implement label management
    - Create setupStandardLabels() to create default labels
    - Define getStandardLabels() with bug, enhancement, priority, status labels
    - Check for existing labels to avoid duplicates
    - Support custom label creation
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 4.4 Implement branch protection configuration
    - Create configureBranchProtection() to set protection rules
    - Support pull request requirements
    - Support status check requirements
    - Support force push prevention
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ] 4.5 Write unit tests for RepositoryManager
    - Test repository creation and configuration
    - Test metadata synchronization
    - Test label setup
    - Test branch protection
    - Mock GitHubMCPClient and FileSystemUtils
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 5. Implement Issue Tracker Service
  - [ ] 5.1 Create IssueTracker class with issue operations
    - Implement createIssue() to create GitHub issues
    - Implement listIssues() to fetch issues with filters
    - Implement getIssue() to fetch specific issue
    - Implement updateIssue() to update issue properties
    - Implement closeIssue() to close issues
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 5.2 Implement milestone management
    - Create createMilestone() to create milestones
    - Create listMilestones() to fetch all milestones
    - Create closeMilestone() to close milestones
    - Support associating issues with milestones
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 5.3 Implement issue templates and validation
    - Support issue templates for bug reports and feature requests
    - Validate issue content before creation
    - Auto-add labels based on issue type
    - _Requirements: 3.2, 3.3_

  - [ ] 5.4 Write unit tests for IssueTracker
    - Test issue creation with various options
    - Test issue listing and filtering
    - Test milestone management
    - Test issue templates
    - Mock GitHubMCPClient
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.1, 6.2, 6.3, 6.4_

- [ ] 6. Implement Pull Request Manager Service
  - [ ] 6.1 Create PullRequestManager class with PR operations
    - Implement createPullRequest() to create PRs
    - Implement listPullRequests() to fetch PRs with filters
    - Implement getPullRequest() to fetch specific PR
    - Implement mergePullRequest() to merge PRs
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 6.2 Implement PR creation from current branch
    - Create createPullRequestFromCurrentBranch() helper
    - Validate branch has commits to merge
    - Auto-detect target branch
    - Support draft PRs
    - _Requirements: 4.1, 4.3, 4.4_

  - [ ] 6.3 Write unit tests for PullRequestManager
    - Test PR creation with various options
    - Test PR listing and filtering
    - Test PR merging
    - Test branch validation
    - Mock GitHubMCPClient and GitIntegration
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7. Implement CI/CD Manager Service
  - [ ] 7.1 Create CICDManager class with workflow operations
    - Implement setupCIWorkflow() to create CI workflow file
    - Implement setupCDWorkflow() to create CD workflow file
    - Implement setupReleaseWorkflow() to create release workflow
    - Implement listWorkflows() to fetch all workflows
    - Implement triggerWorkflow() to manually trigger workflows
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 14.1, 14.2, 15.1, 15.5_

  - [ ] 7.2 Implement workflow file generation
    - Create generateCIWorkflow() to generate CI YAML content
    - Create generateCDWorkflow() to generate CD YAML content
    - Create generateReleaseWorkflow() to generate release YAML content
    - Support multi-platform testing configuration
    - Support multiple Node.js versions
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ] 7.3 Implement workflow status monitoring
    - Create getWorkflowRuns() to fetch workflow run history
    - Parse workflow status and conclusion
    - Display workflow progress
    - _Requirements: 15.2, 15.3, 15.4_

  - [ ] 7.4 Implement secrets validation
    - Create validateSecrets() to check for required secrets
    - Check for NPM_TOKEN and GITHUB_TOKEN
    - Provide instructions for adding missing secrets
    - Display GitHub settings URL
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [ ] 7.5 Write unit tests for CICDManager
    - Test workflow file generation
    - Test workflow setup operations
    - Test workflow status monitoring
    - Test secrets validation
    - Mock GitHubMCPClient and FileSystemUtils
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 15.1, 15.2, 15.3, 15.4, 15.5, 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 8. Implement GitHub Integration Orchestrator
  - [ ] 8.1 Create GitHubIntegrationOrchestrator class
    - Implement handlePublish() to coordinate GitHub operations during NPM publish
    - Implement verifyGitHubSetup() to check GitHub configuration
    - Coordinate ReleaseManager and RepositoryManager
    - Handle errors and rollback
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 8.2 Implement publish workflow integration
    - Ensure git tags are pushed before creating releases
    - Extract changelog content for release notes
    - Mark pre-release versions appropriately
    - Support skipping GitHub release creation
    - Handle GitHub API rate limits
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 8.3 Write unit tests for GitHubIntegrationOrchestrator
    - Test publish workflow coordination
    - Test error handling and rollback
    - Test rate limit handling
    - Mock all service dependencies
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 9. Implement GitHub CLI Commands
  - [ ] 9.1 Create github release command
    - Add `github release create` command to CLI
    - Support version, tag, name, body options
    - Support pre-release flag
    - Support asset uploads
    - Integrate with ReleaseManager
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 9.2 Create github repo command
    - Add `github repo create` command to CLI
    - Add `github repo sync` command for metadata sync
    - Add `github repo setup-labels` command
    - Add `github repo setup-protection` command
    - Integrate with RepositoryManager
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 9.3 Create github issue command
    - Add `github issue create` command to CLI
    - Add `github issue list` command with filters
    - Add `github issue close` command
    - Support issue templates
    - Integrate with IssueTracker
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 9.4 Create github pr command
    - Add `github pr create` command to CLI
    - Add `github pr list` command with filters
    - Add `github pr merge` command
    - Support draft PRs
    - Integrate with PullRequestManager
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 9.5 Create github cicd command
    - Add `github cicd setup` command to CLI
    - Add `github cicd list` command for workflows
    - Add `github cicd trigger` command
    - Add `github cicd status` command
    - Add `github cicd runs` command for run history
    - Integrate with CICDManager
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 14.1, 14.2, 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 9.6 Create github search command
    - Add `github search repos` command
    - Add `github search issues` command
    - Support pagination
    - Display results in readable format
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 9.7 Implement logging and progress indicators
    - Use existing Logger utility for consistent output
    - Add spinners for long-running GitHub operations
    - Display progress for each operation
    - Show color-coded success/warning/error messages
    - Support verbose mode for detailed API responses
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ] 9.8 Write unit tests for GitHub commands
    - Test all command option parsing
    - Test command integration with services
    - Test error handling and user messages
    - Mock all service dependencies
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 11.1, 12.1, 13.1, 14.1, 15.1_

- [ ] 10. Integrate with NPM Publishing Workflow
  - [ ] 10.1 Update PublishingOrchestrator to include GitHub operations
    - Add GitHub release creation step after NPM publish
    - Integrate GitHubIntegrationOrchestrator
    - Support --skip-github-release flag
    - Handle GitHub errors without failing NPM publish
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 10.2 Update publish command options
    - Add --skip-github-release option
    - Add --github-prerelease option
    - Add --github-assets option for release assets
    - Update command help text
    - _Requirements: 10.1, 10.5_

  - [ ] 10.3 Write integration tests for publish workflow
    - Test NPM publish with GitHub release creation
    - Test publish with --skip-github-release flag
    - Test pre-release handling
    - Test error scenarios
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 11. Implement Configuration Support
  - [ ] 11.1 Add GitHub configuration to .btoolsrc.json
    - Define GitHub configuration schema
    - Support owner, repo, autoRelease settings
    - Support CI/CD configuration
    - Support label and branch protection settings
    - _Requirements: 2.1, 5.1, 7.1, 10.1, 13.1_

  - [ ] 11.2 Implement configuration loading and validation
    - Load GitHub config from .btoolsrc.json
    - Validate configuration values
    - Merge with command-line options
    - Support environment variable overrides
    - _Requirements: 9.4, 9.5_

  - [ ] 11.3 Write unit tests for configuration
    - Test config loading and parsing
    - Test option merging priority
    - Test validation
    - Mock filesystem operations
    - _Requirements: 2.1, 5.1, 7.1, 9.4, 9.5, 10.1, 13.1_

- [ ] 12. Integration Testing
  - [ ] 12.1 Create integration test for repository operations
    - Test repository creation with test account
    - Test label setup
    - Test branch protection configuration
    - Test metadata synchronization
    - Use real GitHub MCP server with test repository
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 12.2 Create integration test for release workflow
    - Test release creation
    - Test release notes extraction
    - Test pre-release marking
    - Test asset uploads
    - Use real GitHub MCP server with test repository
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 12.3 Create integration test for issue and PR workflows
    - Test issue creation with labels and milestones
    - Test PR creation and merging
    - Test milestone management
    - Use real GitHub MCP server with test repository
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4_

  - [ ] 12.4 Create integration test for CI/CD setup
    - Test workflow file creation
    - Test workflow triggering
    - Test workflow status monitoring
    - Test secrets validation
    - Use real GitHub MCP server with test repository
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 15.1, 15.2, 15.3, 15.4, 15.5, 16.1, 16.2, 16.3, 16.4, 16.5_

  - [ ] 12.5 Create integration test for complete publish workflow
    - Test NPM publish with GitHub release creation
    - Test changelog extraction
    - Test git tag synchronization
    - Test error handling
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 12.6 Perform cross-platform testing
    - Test on Windows with cmd and PowerShell
    - Test on macOS with bash
    - Test on Linux with bash
    - Verify GitHub MCP server compatibility
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 13.1_

- [ ] 13. Documentation
  - [ ] 13.1 Update README.md with GitHub integration documentation
    - Add GitHub commands to Commands section
    - Document GitHub MCP server setup
    - Provide usage examples for all GitHub commands
    - Add troubleshooting section for GitHub issues
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 11.1, 13.1, 14.1_

  - [ ] 13.2 Create GITHUB_INTEGRATION.md guide
    - Document complete GitHub integration setup
    - Provide step-by-step instructions for MCP server configuration
    - Document authentication setup
    - Include CI/CD setup guide
    - Document all available commands
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 9.1, 9.2, 9.3, 9.4, 9.5, 13.1, 14.1_

  - [ ] 13.3 Create CI/CD setup guide
    - Document GitHub Actions workflow setup
    - Provide examples for different configurations
    - Document secrets management
    - Include troubleshooting for CI/CD issues
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 16.1, 16.2, 16.3_

  - [ ] 13.4 Add JSDoc comments to all public APIs
    - Document all classes and methods
    - Add usage examples in comments
    - Document error conditions
    - Document MCP tool usage
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 14. Final Validation and Polish
  - [ ] 14.1 Run full test suite and verify coverage
    - Ensure all tests pass
    - Verify 80%+ test coverage
    - Fix any failing tests
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 13.1_

  - [ ] 14.2 Perform manual testing with real GitHub account
    - Test repository creation
    - Test release creation
    - Test issue and PR creation
    - Test CI/CD setup
    - Test complete publish workflow
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 10.1, 13.1, 14.1_

  - [ ] 14.3 Verify GitHub MCP server integration
    - Test with latest GitHub MCP server version
    - Verify all MCP tools work correctly
    - Test authentication methods
    - Test error handling
    - _Requirements: 1.6, 2.7, 3.6, 4.6, 9.6, 11.6_

  - [ ] 14.4 Update package.json dependencies
    - Add any new dependencies for GitHub integration
    - Update devDependencies if needed
    - Verify all dependencies are compatible
    - _Requirements: 1.1_
