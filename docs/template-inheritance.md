# Template Inheritance System

This document explains how the template inheritance system works in extn, allowing templates to share common features while maintaining their specific configurations.

## Overview

The template inheritance system enables templates to extend a base template, inheriting shared functionality while adding their own specific features. This architecture ensures that all templates (vanilla, React, Vue, etc.) automatically include Browser Preview features without code duplication.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Base Template                             │
│  (Shared Browser Preview Features)                           │
│  - web-ext-config.mjs                                        │
│  - dev script pattern                                        │
│  - web-ext + concurrently dependencies                       │
│  - .dev-profile/ in .gitignore                               │
│  - Dev workflow documentation                                │
└────────┬──────────────────────────────────┬────────────────┘
         │                                   │
         ▼                                   ▼
┌────────────────────────┐         ┌────────────────────────┐
│   Vanilla Template     │         │   React Template       │
│   - vite.config.js     │         │   - vite.config.js     │
│   - Vanilla deps       │         │   - React deps         │
│   - Basic structure    │         │   - React structure    │
└────────────────────────┘         └────────────────────────┘
```

## Base Template Structure

The base template contains shared features that all templates inherit:

```
src/templates/base/
├── template.json                        # Base metadata
└── files/
    ├── web-ext-config.mjs               # Browser configuration
    ├── .gitignore.partial.template      # Dev profile ignore patterns
    └── README.dev-workflow.partial.md   # Dev workflow documentation
```

### Base template.json

```json
{
  "id": "base",
  "name": "Base Template",
  "description": "Shared Browser Preview features for all templates",
  "dependencies": [],
  "devDependencies": [
    "web-ext@^8.3.0",
    "concurrently@^9.1.0"
  ],
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --source-dir=./dist --config=./web-ext-config.mjs\""
  }
}
```

## Creating a Template That Extends Base

To create a new template that inherits Browser Preview features:

### 1. Create Template Directory

```
src/templates/your-template/
├── template.json
└── files/
    ├── manifest.json.template
    ├── vite.config.js.template
    ├── package.json.template
    ├── .gitignore.template
    ├── README.md.template
    └── src/
        └── (your template files)
```

### 2. Configure template.json

Add the `extends` field to inherit from base:

```json
{
  "id": "your-template",
  "name": "Your Template Name",
  "description": "Description of your template",
  "extends": "base",
  "dependencies": [
    "your-runtime-deps@^1.0.0"
  ],
  "devDependencies": [
    "@crxjs/vite-plugin@^2.2.1",
    "vite@^7.2.2",
    "your-dev-deps@^1.0.0"
  ],
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Key points:**
- `extends: "base"` - Inherit Browser Preview features
- Don't include `web-ext` or `concurrently` - they come from base
- Don't define `dev` script - it's inherited from base
- Add your template-specific dependencies and scripts

### 3. Create Template Files

Your template files will be merged with base template files:

**package.json.template** - Will be merged with base:
```json
{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.2.1",
    "vite": "^7.2.2"
  }
}
```

**.gitignore.template** - Will be merged with base partial:
```
node_modules/
dist/
.vscode/
your-template-specific-ignores/
```

**README.md.template** - Will be merged with base partial:
```markdown
# {{projectName}}

Your template-specific documentation here.

## Getting Started

Template-specific instructions...

## Features

- Your template features
```

## File Merging Rules

### Package.json Merging

When a template extends base, `package.json` files are merged:

**Merge Strategy:**
1. **scripts**: Base scripts + template scripts (template overrides on conflict)
2. **dependencies**: Base deps + template deps (template version overrides)
3. **devDependencies**: Base devDeps + template devDeps (template version overrides)
4. **Other fields**: Template values take precedence

**Example:**

Base package.json:
```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --source-dir=./dist --config=./web-ext-config.mjs\""
  },
  "devDependencies": {
    "web-ext": "^8.3.0",
    "concurrently": "^9.1.0"
  }
}
```

Template package.json:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.2.1",
    "vite": "^7.2.2"
  }
}
```

Merged result:
```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --source-dir=./dist --config=./web-ext-config.mjs\"",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "web-ext": "^8.3.0",
    "concurrently": "^9.1.0",
    "@crxjs/vite-plugin": "^2.2.1",
    "vite": "^7.2.2"
  }
}
```

### Partial File Merging

Files with `.partial` in their name are merged with template-specific files:

**Naming Convention:**
- Base: `filename.partial.template` (e.g., `.gitignore.partial.template`)
- Template: `filename.template` (e.g., `.gitignore.template`)
- Result: `filename` (e.g., `.gitignore`)

**Merge Strategy:**
1. Template file content comes first
2. Base partial content is appended
3. A blank line separates the two sections

**Example - .gitignore merging:**

Template `.gitignore.template`:
```
node_modules/
dist/
.vscode/
```

Base `.gitignore.partial.template`:
```
# Development profile (Browser Preview)
.dev-profile/
```

Merged `.gitignore`:
```
node_modules/
dist/
.vscode/

# Development profile (Browser Preview)
.dev-profile/
```

**Example - README merging:**

Template `README.md.template`:
```markdown
# {{projectName}}

A Chrome extension built with {{templateName}}.

## Features

- Feature 1
- Feature 2
```

Base `README.dev-workflow.partial.md`:
```markdown
## Development

Start the development server with hot module replacement:

\`\`\`bash
npm run dev
\`\`\`

This will automatically launch Chrome with your extension loaded.
```

Merged `README.md`:
```markdown
# {{projectName}}

A Chrome extension built with {{templateName}}.

## Features

- Feature 1
- Feature 2

## Development

Start the development server with hot module replacement:

\`\`\`bash
npm run dev
\`\`\`

This will automatically launch Chrome with your extension loaded.
```

### File Override Rules

When both base and template have the same file (non-partial):

1. **Non-partial files**: Template file completely overrides base file
2. **Partial files**: Files are merged (see above)
3. **package.json**: Special merging logic (see above)

This ensures template-specific customizations always take precedence while preserving shared functionality.

## Template Resolution Flow

When a user creates a project:

```
User runs: extn create my-extension --template vanilla
  ↓
Registry loads vanilla template
  ↓
Registry detects vanilla extends "base"
  ↓
Registry loads base template
  ↓
Registry merges metadata (deps, scripts)
  ↓
Engine renders files from base template
  ↓
Engine renders files from vanilla template
  ↓
Engine merges package.json (base + vanilla)
  ↓
Engine merges partial files (.gitignore, README)
  ↓
Project created with combined files
```

## Implementation Details

### Template Interface

```typescript
export interface Template {
  id: string;
  name: string;
  description: string;
  files: string;
  dependencies: string[];
  devDependencies: string[];
  scripts?: Record<string, string>;  // npm scripts
  extends?: string;                   // base template id
}
```

### Registry Methods

```typescript
// Load template with base inheritance
async getWithBase(templateId: string): Promise<Template> {
  const template = await this.get(templateId);
  
  if (template.extends) {
    const baseTemplate = await this.get(template.extends);
    return this.mergeTemplates(baseTemplate, template);
  }
  
  return template;
}

// Merge base and specific template metadata
private mergeTemplates(base: Template, specific: Template): Template {
  return {
    ...specific,
    scripts: { ...base.scripts, ...specific.scripts },
    dependencies: [...base.dependencies, ...specific.dependencies],
    devDependencies: [...base.devDependencies, ...specific.devDependencies],
  };
}
```

### Engine Methods

```typescript
// Merge package.json from base and template
mergePackageJson(basePackage: any, templatePackage: any): any {
  return {
    ...basePackage,
    ...templatePackage,
    scripts: {
      ...basePackage.scripts,
      ...templatePackage.scripts,
    },
    dependencies: this.mergeDependencies(
      basePackage.dependencies,
      templatePackage.dependencies
    ),
    devDependencies: this.mergeDependencies(
      basePackage.devDependencies,
      templatePackage.devDependencies
    ),
  };
}

// Merge partial files (append base partial to template file)
mergePartialFiles(templateContent: string, partialContent: string): string {
  return `${templateContent}\n\n${partialContent}`;
}
```

## Benefits

### For Template Creators

- **No Duplication**: Browser Preview features defined once in base
- **Focus on Framework**: Only implement framework-specific features
- **Automatic Updates**: Base improvements apply to all templates
- **Clear Separation**: Framework code separate from dev workflow

### For Users

- **Consistent Experience**: Same dev workflow across all templates
- **Automatic Features**: New templates get Browser Preview automatically
- **Predictable Behavior**: `npm run dev` works the same everywhere
- **Easy Customization**: Override base features when needed

### For Maintainers

- **Single Source of Truth**: Browser Preview maintained in one place
- **Easy Testing**: Test base features once, applies to all templates
- **Simple Updates**: Update base to improve all templates
- **Extensible**: Easy to add new shared features

## Examples

### Example 1: Vanilla Template (Current)

```json
{
  "id": "vanilla",
  "name": "Vanilla JavaScript",
  "description": "Basic Chrome extension with vanilla JavaScript",
  "extends": "base",
  "devDependencies": [
    "@crxjs/vite-plugin@^2.2.1",
    "vite@^7.2.2"
  ],
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Inherits from base:**
- `web-ext` and `concurrently` dependencies
- `dev` script with browser auto-launch
- `web-ext-config.mjs` file
- Dev workflow documentation

**Adds:**
- Vite and @crxjs/vite-plugin
- Build and preview scripts
- Vanilla-specific file structure

### Example 2: React Template (Future)

```json
{
  "id": "react",
  "name": "React",
  "description": "Chrome extension with React and TypeScript",
  "extends": "base",
  "dependencies": [
    "react@^18.2.0",
    "react-dom@^18.2.0"
  ],
  "devDependencies": [
    "@crxjs/vite-plugin@^2.2.1",
    "@types/react@^18.2.0",
    "@types/react-dom@^18.2.0",
    "@vitejs/plugin-react@^4.0.0",
    "typescript@^5.0.0",
    "vite@^7.2.2"
  ],
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

**Inherits from base:**
- Browser Preview features (same as vanilla)
- `dev` script with auto-launch
- Profile persistence

**Adds:**
- React and React DOM
- TypeScript support
- React-specific Vite plugin
- Type checking script

### Example 3: Vue Template (Future)

```json
{
  "id": "vue",
  "name": "Vue",
  "description": "Chrome extension with Vue 3 and TypeScript",
  "extends": "base",
  "dependencies": [
    "vue@^3.3.0"
  ],
  "devDependencies": [
    "@crxjs/vite-plugin@^2.2.1",
    "@vitejs/plugin-vue@^4.0.0",
    "typescript@^5.0.0",
    "vite@^7.2.2",
    "vue-tsc@^1.8.0"
  ],
  "scripts": {
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit"
  }
}
```

**Inherits from base:**
- Browser Preview features (same as vanilla and React)
- Consistent dev workflow

**Adds:**
- Vue 3 framework
- Vue-specific Vite plugin
- Vue TypeScript compiler

## Best Practices

### When Creating Templates

1. **Always extend base** unless you have a specific reason not to
2. **Don't duplicate base features** - let inheritance handle it
3. **Focus on framework-specific code** - build config, dependencies, structure
4. **Document template-specific features** in your README
5. **Test with base features** to ensure compatibility

### When Modifying Base

1. **Keep it framework-agnostic** - base should work with any framework
2. **Test with all templates** - changes affect everything
3. **Document breaking changes** - templates may need updates
4. **Version carefully** - base changes impact all users

### When Customizing Projects

Users can customize generated projects by:

1. **Editing web-ext-config.mjs** - Change browser, profile, launch options
2. **Modifying package.json scripts** - Add custom dev scripts
3. **Updating vite.config.js** - Framework-specific build config
4. **Deleting .dev-profile/** - Reset browser profile

## Troubleshooting

### Template doesn't inherit base features

**Problem:** Generated project missing Browser Preview features

**Solution:**
- Check `template.json` has `"extends": "base"`
- Verify base template exists in `src/templates/base/`
- Check template registry loads base correctly

### Package.json merge conflicts

**Problem:** Dependencies or scripts not merging correctly

**Solution:**
- Check template doesn't override base dependencies
- Verify merge logic in `TemplateEngine.mergePackageJson()`
- Test with minimal template to isolate issue

### Partial files not merging

**Problem:** `.gitignore` or `README` missing base content

**Solution:**
- Check base partial files exist (`.partial.template` suffix)
- Verify template has corresponding non-partial file
- Check merge logic in `TemplateEngine.mergePartialFiles()`

## Future Enhancements

### Multi-Level Inheritance

Support inheritance chains:
```
base → framework-base → specific-template
```

Example:
```
base (Browser Preview)
  ↓
react-base (React + TypeScript)
  ↓
react-tailwind (+ Tailwind CSS)
```

### Conditional Inheritance

Allow templates to conditionally include base features:
```json
{
  "extends": "base",
  "includeFeatures": ["browser-preview", "typescript"]
}
```

### Template Composition

Mix multiple base templates:
```json
{
  "extends": ["base", "typescript-base", "testing-base"]
}
```

## Resources

- [Template Engine Source](../../src/core/template/engine.ts)
- [Template Registry Source](../../src/core/template/registry.ts)
- [Base Template](../../src/templates/base/)
- [Vanilla Template Example](../../src/templates/vanilla/)
