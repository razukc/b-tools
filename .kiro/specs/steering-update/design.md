# Design Document

## Overview

This design outlines the updates needed for the steering documents in `.kiro/steering/` to reflect the current state of the extn project as of v0.3.0. The updates will focus on adding information about the React template, template inheritance system, and Browser Preview workflow while preserving all existing valuable content and structure.

## Architecture

### Document Update Strategy

The steering documents will be updated using a **targeted modification approach**:

1. **Identify outdated sections** - Locate specific sections that reference old capabilities or missing features
2. **Add new sections** - Insert new content for features not previously documented
3. **Preserve existing content** - Keep all sections that remain accurate and valuable
4. **Maintain structure** - Preserve the existing organization and formatting of each document

### Update Scope by Document

#### product.md
- **Update**: "Key Commands" section to reflect that `dev` is now implemented (not planned)
- **Update**: "Current Status" section to reflect v0.3.0 with multiple templates
- **Add**: Mention of template inheritance system in "Core Purpose"
- **Add**: Browser Preview as a key feature
- **Preserve**: Philosophy section, core purpose structure

#### tech.md
- **Add**: New "Template Technologies" section for React and related tools
- **Add**: React 18, React DOM, @vitejs/plugin-react, @crxjs/vite-plugin
- **Add**: @testing-library/react in development dependencies
- **Update**: Note that template-specific deps are separate from CLI deps
- **Preserve**: All existing sections (Core Technologies, Build System, Code Quality, Testing Strategy, Shell Commands)

#### structure.md
- **Add**: Detailed breakdown of `src/templates/` directory structure
- **Add**: Explanation of template inheritance pattern
- **Add**: Documentation of template.json configuration files
- **Update**: Templates comment from "vanilla, etc." to "base, vanilla, react"
- **Preserve**: All existing directory organization, conventions, and file organization rules

#### context7.md
- **Add**: React to the packages list
- **Add**: @vitejs/plugin-react to the packages list
- **Add**: @testing-library/react to the packages list
- **Update**: Repositories section to include React-related repos if needed
- **Preserve**: All existing usage patterns, GitHub MCP sections, and best practices

## Components and Interfaces

### Document Structure

Each steering document follows this general structure:

```markdown
# Document Title

## Section 1
Content...

## Section 2
Content...

### Subsection 2.1
Content...
```

### Update Patterns

**Pattern 1: Section Addition**
```markdown
## Existing Section
[existing content]

## New Section
[new content]

## Next Existing Section
[existing content]
```

**Pattern 2: Content Insertion**
```markdown
## Existing Section
[existing content line 1]
[existing content line 2]
[new content line]
[existing content line 3]
```

**Pattern 3: Content Replacement**
```markdown
## Section Title
[old content] → [new content]
```

## Data Models

### product.md Updates

**Current Status Section (Replace)**
```markdown
## Current Status

MVP in active development. Phase 1 (Foundation) focuses on project scaffolding 
and basic build pipeline with vanilla JavaScript template support.
```

**New Version**
```markdown
## Current Status

Version 0.3.0 released with multiple template support. The project includes:
- Template inheritance system with base, vanilla, and react templates
- Browser Preview workflow with auto-launch Chrome and HMR
- Production-ready build pipeline with Vite
- TypeScript-first development experience

Future templates (Vue, Svelte) will inherit Browser Preview features automatically.
```

**Key Commands Section (Update)**
```markdown
## Key Commands

- `create <project-name>` - Scaffold new Chrome extension project
- `build` - Build extension for production with minification and packaging
- `dev` - Watch mode for development (planned)  ← REMOVE "(planned)"
```

**Core Purpose Section (Add Browser Preview)**
```markdown
## Core Purpose

Simplify Chrome extension development by providing:
- Project scaffolding with sensible defaults
- TypeScript-first development experience
- Production-ready build pipeline
- Manifest V3 validation and generation
- Browser Preview workflow with auto-launch and HMR  ← ADD THIS
- Template inheritance system for consistent features  ← ADD THIS
```

### tech.md Updates

**Add New Section After "Development Dependencies"**
```markdown
## Template Technologies

The following technologies are included in generated projects based on template choice:

### React Template
- **React 18.3+** - Modern React with hooks and concurrent features
- **React DOM 18.3+** - React rendering for web
- **@vitejs/plugin-react** - Vite plugin for React Fast Refresh
- **@crxjs/vite-plugin** - Chrome extension support for Vite
- **@testing-library/react** - React component testing utilities
- **@types/react** - TypeScript definitions for React
- **@types/react-dom** - TypeScript definitions for React DOM

### Vanilla Template
- **@crxjs/vite-plugin** - Chrome extension support for Vite
- **Vite** - Build tool and dev server

### Base Template (Inherited by All)
- **web-ext** - Mozilla's CLI tool for extension development
- **concurrently** - Run multiple commands concurrently for dev workflow

Note: These dependencies are added to generated projects, not to the CLI itself.
```

### structure.md Updates

**Update Templates Directory Documentation**

Current:
```markdown
├── templates/         # Project templates (vanilla, etc.)
```

New:
```markdown
├── templates/         # Project templates (base, vanilla, react)
│   ├── base/         # Base template with Browser Preview (inherited by all)
│   ├── vanilla/      # Vanilla JavaScript/TypeScript template
│   └── react/        # React 18 + TypeScript template
```

**Add New Section After "Module Organization"**
```markdown
### Template Organization

The template system uses an inheritance pattern:

- **base/** - Contains Browser Preview features inherited by all templates
  - `files/` - Shared files (web-ext-config.mjs, partial README, etc.)
  - `template.json` - Base configuration with dev workflow dependencies
  
- **vanilla/** - Extends base template
  - `files/` - Vanilla-specific files (basic popup, content script, etc.)
  - `template.json` - Extends base, adds vanilla-specific configuration
  
- **react/** - Extends base template
  - `files/` - React-specific files (React components, tsconfig, etc.)
  - `template.json` - Extends base, adds React dependencies and scripts

**Template Configuration Files:**
- `template.json` - Defines dependencies, scripts, and base template to extend
- `*.template.json` - Template files with variable substitution ({{projectName}}, etc.)
- `*.template.js` - JavaScript template files with variable substitution

**Template Inheritance:**
1. Base template provides Browser Preview workflow to all templates
2. Specific templates (vanilla, react) extend base with framework-specific features
3. Files are merged intelligently (package.json, .gitignore, README.md)
4. Future templates (vue, svelte) will automatically inherit Browser Preview
```

### context7.md Updates

**Update Packages Section**

Current:
```markdown
### Packages to Use Context7 For

- **WXT** - Web Extension Toolkit framework
- **web-ext** - Mozilla's web extension CLI tool
- **extension-workshop** - Firefox extension workshop tool
- **@crxjs/vite-plugin** - Vite plugin for Chrome extensions
- **Vite** - Build tool and dev server
- **Any other third-party packages** when you need current documentation
```

New:
```markdown
### Packages to Use Context7 For

- **WXT** - Web Extension Toolkit framework
- **web-ext** - Mozilla's web extension CLI tool
- **extension-workshop** - Firefox extension workshop tool
- **@crxjs/vite-plugin** - Vite plugin for Chrome extensions
- **Vite** - Build tool and dev server
- **React** - React library for UI components  ← ADD
- **@vitejs/plugin-react** - Vite plugin for React support  ← ADD
- **@testing-library/react** - React testing utilities  ← ADD
- **Any other third-party packages** when you need current documentation
```

**Update Repositories Section**

Current:
```markdown
### Repositories to Reference

- **wxt-dev/wxt** - WXT framework for web extensions
- **mozilla/web-ext** - Mozilla's web extension CLI tool
- **crxjs/chrome-extension-tools** - Vite plugin for Chrome extensions
- **vitejs/vite** - Vite build tool
```

New:
```markdown
### Repositories to Reference

- **wxt-dev/wxt** - WXT framework for web extensions
- **mozilla/web-ext** - Mozilla's web extension CLI tool
- **crxjs/chrome-extension-tools** - Vite plugin for Chrome extensions
- **vitejs/vite** - Vite build tool
- **facebook/react** - React library  ← ADD
- **vitejs/vite-plugin-react** - Official React plugin for Vite  ← ADD
- **testing-library/react-testing-library** - React testing utilities  ← ADD
```

## Error Handling

### Validation Strategy

Before making changes:
1. **Verify file exists** - Check that the steering document exists before attempting to modify
2. **Backup content** - Read the entire file content before making changes
3. **Validate structure** - Ensure the document structure matches expectations
4. **Preserve formatting** - Maintain existing markdown formatting and indentation

### Rollback Strategy

If an update introduces errors:
1. **Review changes** - Compare old and new content
2. **Identify issues** - Determine what went wrong
3. **Revert if needed** - Restore original content if changes are incorrect
4. **Iterate** - Make corrections and try again

## Testing Strategy

### Manual Verification

After each document update:
1. **Read the updated document** - Verify content is accurate and complete
2. **Check formatting** - Ensure markdown is properly formatted
3. **Verify completeness** - Confirm all required updates were made
4. **Check preservation** - Ensure existing valuable content was not lost

### Content Validation

For each updated section:
1. **Accuracy** - Information reflects current project state (v0.3.0)
2. **Completeness** - All new features are documented
3. **Consistency** - Terminology matches across all documents
4. **Clarity** - Content is clear and easy to understand

### Integration Testing

After all updates:
1. **Cross-reference** - Verify consistency across all steering documents
2. **Check links** - Ensure any internal references are correct
3. **Verify examples** - Confirm code examples and commands are accurate
4. **Test with AI** - Verify that AI assistance uses updated information correctly

## Implementation Notes

### Update Order

1. **product.md** - Update first as it provides high-level overview
2. **tech.md** - Update second to document technical stack
3. **structure.md** - Update third to document architecture
4. **context7.md** - Update last to add external documentation references

### Preservation Priority

High priority to preserve:
- Code quality standards
- Testing strategies
- File organization rules
- Shell command guidelines
- Existing conventions and patterns

Low priority to preserve:
- Outdated status information
- Incomplete feature lists
- References to planned features that are now implemented

### Style Guidelines

- Use consistent markdown formatting
- Maintain existing heading levels
- Preserve bullet point styles
- Keep code block formatting
- Use consistent terminology (e.g., "Browser Preview" not "browser preview")
