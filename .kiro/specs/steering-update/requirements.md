# Requirements Document

## Introduction

The extn project has evolved significantly since the steering documents were created. Version 0.3.0 introduced a React template with TypeScript support, building on the v0.2.0 Browser Preview workflow and template inheritance system. The steering documents need to be updated to accurately reflect the current capabilities, tech stack, and architecture of the project.

## Glossary

- **Steering Documents**: Markdown files in `.kiro/steering/` that provide context and guidance for AI-assisted development
- **Template System**: The architecture that allows multiple project templates (vanilla, react) to inherit common features from a base template
- **Browser Preview**: The development workflow that auto-launches Chrome with the extension loaded and provides HMR
- **React Template**: A project template that generates React 18 + TypeScript Chrome extensions with testing setup

## Requirements

### Requirement 1: Update Product Overview

**User Story:** As a developer using AI assistance, I want the product.md steering document to accurately describe extn's current capabilities, so that AI suggestions align with what the tool actually does.

#### Acceptance Criteria

1. WHEN the product.md file is read, THE Steering_Document SHALL describe multiple template options (vanilla and react)
2. THE Steering_Document SHALL mention the template inheritance system as a core architectural feature
3. THE Steering_Document SHALL reference Browser Preview as a key development workflow feature
4. THE Steering_Document SHALL reflect the current version status (v0.3.0 with React template released)
5. THE Steering_Document SHALL maintain the existing philosophy and core purpose sections

### Requirement 2: Update Technology Stack Documentation

**User Story:** As a developer using AI assistance, I want the tech.md steering document to include all current technologies and tools, so that AI suggestions use the correct dependencies and patterns.

#### Acceptance Criteria

1. WHEN the tech.md file is read, THE Steering_Document SHALL list React 18 and React DOM in the technologies section
2. THE Steering_Document SHALL list @vitejs/plugin-react and @crxjs/vite-plugin in the build system section
3. THE Steering_Document SHALL list @testing-library/react in the development dependencies section
4. THE Steering_Document SHALL document template-specific dependencies separately from core CLI dependencies
5. THE Steering_Document SHALL maintain the existing code quality standards and testing strategy sections

### Requirement 3: Update Structure Documentation

**User Story:** As a developer using AI assistance, I want the structure.md steering document to reflect the template system architecture, so that AI understands how templates are organized and extended.

#### Acceptance Criteria

1. WHEN the structure.md file is read, THE Steering_Document SHALL document the src/templates/ directory structure with base, vanilla, and react subdirectories
2. THE Steering_Document SHALL explain the template inheritance pattern where templates extend the base template
3. THE Steering_Document SHALL document the template.json configuration file purpose
4. THE Steering_Document SHALL maintain the existing conventions for file naming and module organization
5. THE Steering_Document SHALL keep the existing import patterns and test organization sections

### Requirement 4: Update External Documentation Integration

**User Story:** As a developer using AI assistance, I want the context7.md steering document to include React-specific packages, so that AI can fetch current documentation for React development.

#### Acceptance Criteria

1. WHEN the context7.md file is read, THE Steering_Document SHALL list React in the packages to use Context7 for
2. THE Steering_Document SHALL list @vitejs/plugin-react in the packages section
3. THE Steering_Document SHALL list @crxjs/vite-plugin in the packages section
4. THE Steering_Document SHALL maintain the existing usage patterns and GitHub MCP server sections
5. THE Steering_Document SHALL keep the existing best practice guidance

### Requirement 5: Preserve Existing Content

**User Story:** As a developer using AI assistance, I want steering document updates to preserve valuable existing content, so that no useful guidance is lost during the update.

#### Acceptance Criteria

1. WHEN steering documents are updated, THE Update_Process SHALL preserve all existing sections that remain accurate
2. THE Update_Process SHALL preserve all existing code quality standards and conventions
3. THE Update_Process SHALL preserve all existing command examples and workflows
4. THE Update_Process SHALL only modify sections that are outdated or incomplete
5. THE Update_Process SHALL maintain the existing formatting and structure of each document
