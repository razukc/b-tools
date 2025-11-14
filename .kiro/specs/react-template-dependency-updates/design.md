# Design Document

## Overview

This design outlines the approach for updating the React template's dependency versions to their latest stable releases. The update focuses on React 19, updated build tools, testing libraries, and TypeScript definitions. The design ensures backward compatibility with the template system while providing users with modern, well-tested dependency versions.

## Architecture

### Template Configuration System

The React template uses a JSON configuration file (`src/templates/react/template.json`) that defines:
- Template metadata (id, name, description)
- Base template inheritance (`extends: "base"`)
- Runtime dependencies (react, react-dom)
- Development dependencies (build tools, type definitions, testing libraries)
- NPM scripts for build, dev, and test workflows

The template system merges these configurations during project generation, combining base template features with React-specific dependencies.

### Dependency Update Strategy

**Major Version Updates:**
- React 18.3.x → 19.2.x (major version bump)
- @vitejs/plugin-react 4.x → 5.x (major version bump)
- vitest 1.x → 4.x (major version bump)
- @testing-library/react 14.x → 16.x (major version bump)

**Minor/Patch Updates:**
- @types/chrome 0.0.270 → 0.1.28
- jsdom 23.x → 27.x

### Version Range Strategy

Use caret ranges (`^`) for all dependencies to allow:
- Patch updates (bug fixes)
- Minor updates (backward-compatible features)
- Block major updates (breaking changes)

Example: `^19.2.0` allows 19.2.x and 19.3.x but not 20.0.0

## Components and Interfaces

### Template Configuration File

**Location:** `src/templates/react/template.json`

**Structure:**
```json
{
  "id": "react",
  "name": "React",
  "description": "Chrome extension with React 19 and TypeScript",
  "extends": "base",
  "dependencies": [
    "react@^19.2.0",
    "react-dom@^19.2.0"
  ],
  "devDependencies": [
    "@crxjs/vite-plugin@^2.2.1",
    "@types/chrome@^0.1.28",
    "@types/react@^19.2.0",
    "@types/react-dom@^19.2.0",
    "@vitejs/plugin-react@^5.1.0",
    "typescript@^5.6.0",
    "vite@^7.2.2"
  ],
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

### Testing Dependencies

Testing dependencies are added during project generation through the template file system. These need to be updated in the template files that reference them.

**Files to Update:**
- `src/templates/react/files/package.json.template` (if it exists and contains testing deps)
- Any template files that specify vitest, @vitest/ui, jsdom, or @testing-library/react versions

### React 19 Compatibility Considerations

**Breaking Changes in React 19:**
1. New JSX Transform is now required (already supported by @vitejs/plugin-react@5.x)
2. Automatic batching improvements (no code changes needed)
3. Stricter TypeScript types (may require type updates in template files)

**Migration Path:**
- Update @vitejs/plugin-react to 5.1.x (supports React 19)
- Update TypeScript definitions to match React 19 types
- Verify template component files work with new types

## Data Models

### Dependency Version Mapping

| Package | Current | Updated | Breaking Changes |
|---------|---------|---------|------------------|
| react | ^18.3.0 | ^19.2.0 | JSX transform, stricter types |
| react-dom | ^18.3.0 | ^19.2.0 | Matches React version |
| @types/react | ^18.3.0 | ^19.2.0 | Type signature changes |
| @types/react-dom | ^18.3.0 | ^19.2.0 | Type signature changes |
| @vitejs/plugin-react | ^4.3.0 | ^5.1.0 | React 19 support |
| @testing-library/react | ^14.0.0 | ^16.3.0 | Updated testing APIs |
| vitest | ^1.0.0 | ^4.0.0 | Configuration changes |
| @vitest/ui | ^1.0.0 | ^4.0.0 | Matches vitest version |
| jsdom | ^23.0.0 | ^27.2.0 | DOM API updates |
| @types/chrome | ^0.0.270 | ^0.1.28 | API definition updates |

## Error Handling

### Potential Issues and Mitigations

**1. Peer Dependency Conflicts**
- **Issue:** React 19 may have stricter peer dependency requirements
- **Detection:** Run `npm install` on generated project
- **Mitigation:** Ensure all React-related packages are updated together

**2. Type Errors in Template Files**
- **Issue:** React 19 has stricter TypeScript types
- **Detection:** Run `npm run type-check` on generated project
- **Mitigation:** Update template component files to satisfy new types

**3. Test Failures**
- **Issue:** @testing-library/react@16.x may have API changes
- **Detection:** Run `npm test` on generated project
- **Mitigation:** Update test files in template to use current APIs

**4. Build Failures**
- **Issue:** @vitejs/plugin-react@5.x may have configuration changes
- **Detection:** Run `npm run build` on generated project
- **Mitigation:** Update vite.config.ts template if needed

## Testing Strategy

### Verification Approach

**1. Template Update Verification**
- Update `src/templates/react/template.json` with new versions
- Verify JSON syntax is valid
- Confirm all version ranges use caret notation

**2. Project Generation Testing**
- Generate a new test project: `node dist/cli/index.js create test-react-updated`
- Verify package.json contains updated versions
- Check for any generation errors

**3. Dependency Installation Testing**
- Run `npm install` in generated project
- Verify no peer dependency warnings or errors
- Confirm all packages install successfully

**4. Build Pipeline Testing**
- Run `npm run build` in generated project
- Verify successful compilation
- Check dist output is valid

**5. Type Checking Testing**
- Run `npm run type-check` in generated project
- Verify no TypeScript errors
- Confirm template files type-check correctly

**6. Test Execution Testing**
- Run `npm test` in generated project
- Verify tests execute successfully
- Confirm testing libraries work correctly

**7. Development Server Testing**
- Run `npm run dev` in generated project
- Verify dev server starts without errors
- Confirm HMR works with React 19

### Test Scenarios

**Scenario 1: Fresh Project Generation**
```bash
# Generate new project
node dist/cli/index.js create test-react-v19

# Install and verify
cd test-react-v19
npm install
npm run build
npm test
npm run type-check
```

**Scenario 2: Verify Updated Versions**
```bash
# Check installed versions match template
npm list react react-dom @vitejs/plugin-react
npm list @testing-library/react vitest jsdom
```

**Scenario 3: Component Rendering**
- Verify popup component renders correctly
- Verify content script works with React 19
- Test component updates and state management

### Success Criteria

- ✅ Template file updates without syntax errors
- ✅ Project generates successfully
- ✅ All dependencies install without conflicts
- ✅ Build completes successfully
- ✅ Type checking passes
- ✅ Tests execute successfully
- ✅ Dev server starts and HMR works
- ✅ Generated extension loads in Chrome

## Implementation Notes

### Files to Modify

1. **Primary Update:**
   - `src/templates/react/template.json` - Update all dependency versions

2. **Potential Updates (if they exist):**
   - `src/templates/react/files/package.json.template` - Update testing dependencies if hardcoded
   - `src/templates/react/files/vite.config.ts.template` - Verify React plugin configuration
   - `src/templates/react/files/vitest.config.ts.template` - Update vitest configuration if needed

3. **Template Component Files:**
   - Review all `.tsx` files in `src/templates/react/files/` for React 19 compatibility
   - Update type annotations if needed for stricter types

### Rollback Plan

If issues are discovered after update:
1. Revert `template.json` to previous versions
2. Rebuild CLI: `npm run build`
3. Document specific compatibility issues
4. Create targeted fixes for breaking changes

### Future Considerations

- Monitor React 19 adoption and stability
- Watch for @vitejs/plugin-react updates
- Consider adding React 19 migration guide to documentation
- Plan for React 20 when released
