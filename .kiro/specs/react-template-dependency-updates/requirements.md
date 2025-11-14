# Requirements Document

## Introduction

This document outlines the requirements for updating the React template dependencies to their latest stable versions. The React template currently uses outdated versions of several key packages including React 18.3.x (latest: 19.2.0), testing libraries, and build tools. This update will ensure users get the latest features, performance improvements, and security patches when scaffolding new React-based Chrome extensions.

## Glossary

- **React Template**: The template configuration file at `src/templates/react/template.json` that defines dependencies for React-based Chrome extension projects
- **Template System**: The CLI's template engine that generates new projects based on template configurations
- **Package Version Range**: The semantic version specification (e.g., `^18.3.0`) that defines which package versions are acceptable
- **Generated Project**: A Chrome extension project created by running the CLI's create command with the React template

## Requirements

### Requirement 1

**User Story:** As a developer using the CLI, I want the React template to use the latest stable React 19 version, so that my new projects benefit from the newest React features and performance improvements

#### Acceptance Criteria

1. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include react@^19.2.0 in dependencies
2. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include react-dom@^19.2.0 in dependencies
3. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include @types/react@^19.2.0 in devDependencies
4. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include @types/react-dom@^19.2.0 in devDependencies

### Requirement 2

**User Story:** As a developer using the CLI, I want the React template to use the latest Vite React plugin version, so that my build tooling is up-to-date and compatible with React 19

#### Acceptance Criteria

1. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include @vitejs/plugin-react@^5.1.0 in devDependencies
2. WHEN the Generated Project builds with the updated plugin, THE Generated Project SHALL compile successfully without errors

### Requirement 3

**User Story:** As a developer using the CLI, I want the React template to use the latest testing library versions, so that my tests can leverage modern testing capabilities

#### Acceptance Criteria

1. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include @testing-library/react@^16.3.0 in devDependencies
2. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include vitest@^4.0.0 in devDependencies
3. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include @vitest/ui@^4.0.0 in devDependencies
4. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include jsdom@^27.2.0 in devDependencies

### Requirement 4

**User Story:** As a developer using the CLI, I want the React template to use the latest Chrome types, so that I have accurate TypeScript definitions for Chrome extension APIs

#### Acceptance Criteria

1. WHEN the Template System generates a new project with the React template, THE Generated Project SHALL include @types/chrome@^0.1.28 in devDependencies
2. WHEN the Generated Project type-checks with the updated types, THE Generated Project SHALL complete type-checking without errors

### Requirement 5

**User Story:** As a developer using the CLI, I want the updated React template to generate projects that build and run successfully, so that I can start developing immediately without compatibility issues

#### Acceptance Criteria

1. WHEN a new project is generated with the updated React template, THE Generated Project SHALL install all dependencies without peer dependency conflicts
2. WHEN the Generated Project runs the build command, THE Generated Project SHALL compile successfully and produce valid output
3. WHEN the Generated Project runs the test command, THE Generated Project SHALL execute tests successfully
4. WHEN the Generated Project runs the dev command, THE Generated Project SHALL start the development server without errors
