# Chrome Manifest Schema Integration

## Overview

We've integrated the official Chrome Extension Manifest JSON Schema from [JSON Schema Store](https://www.schemastore.org/) into the b-tools project. This schema provides comprehensive validation rules for both Manifest V2 and V3.

## Files Added

### 1. `src/schemas/chrome-manifest.schema.json` (34KB)
The official JSON Schema for Chrome extension manifests.

**Key Features:**
- Supports both Manifest V2 and V3
- Conditional validation based on manifest version
- Rich field descriptions
- Pattern matching for complex fields
- Enum constraints and dependencies

### 2. `src/schemas/index.ts`
TypeScript utilities for working with the schema.

**Exports:**
- `chromeManifestSchema` - The full schema object
- `SCHEMA_INFO` - Metadata about the schema
- `getSchemaForVersion(version)` - Get schema for specific version
- `getFieldDescription(fieldPath)` - Extract field descriptions
- `isFieldRequired(fieldName)` - Check if field is required
- `getRequiredFields()` - Get all required fields

### 3. `src/schemas/README.md`
Documentation about the schema and its usage.

### 4. `src/schemas/example-usage.ts`
Example code showing how to use the schema.

## How This Helps b-tools

### 1. **Manifest Validation (Tasks 3.x)**
```typescript
import { chromeManifestSchema } from './schemas/index.js';
import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(chromeManifestSchema);

if (!validate(manifest)) {
  // Show validation errors with helpful descriptions
  console.error(validate.errors);
}
```

### 2. **Better Error Messages**
```typescript
import { getFieldDescription } from './schemas/index.js';

// When validation fails, show helpful descriptions
const description = getFieldDescription('manifest_version');
// "One integer specifying the version of the manifest file format your package requires."
```

### 3. **Template Generation**
Use the schema to ensure generated manifests include all required fields with correct types.

### 4. **Migration Detection (V2 → V3)**
The schema's conditional logic helps identify:
- V2-only fields: `browser_action`, `page_action`, `background.page`
- V3-only fields: `action`, `background.service_worker`, `host_permissions`
- Changed structures: `web_accessible_resources`, `content_security_policy`

### 5. **IDE Autocompletion**
The schema can be referenced in manifest.json files for IDE support:
```json
{
  "$schema": "./src/schemas/chrome-manifest.schema.json",
  "manifest_version": 3,
  ...
}
```

## Integration with Zod

While we use Zod for runtime validation, the JSON Schema serves as:
1. **Reference** - Ensure our Zod schemas match the official spec
2. **Validation** - Additional layer of validation using AJV
3. **Documentation** - Source of field descriptions and constraints

## Key Manifest Differences

### Manifest V2 (Deprecated)
```json
{
  "manifest_version": 2,
  "browser_action": { ... },
  "background": {
    "scripts": ["background.js"]
  },
  "web_accessible_resources": ["images/*"]
}
```

### Manifest V3 (Current)
```json
{
  "manifest_version": 3,
  "action": { ... },
  "background": {
    "service_worker": "background.js"
  },
  "web_accessible_resources": [{
    "resources": ["images/*"],
    "matches": ["<all_urls>"]
  }],
  "host_permissions": ["<all_urls>"]
}
```

## Updating the Schema

To get the latest version:
```bash
curl -o src/schemas/chrome-manifest.schema.json https://www.schemastore.org/chrome-manifest.json
```

## Next Steps

When implementing manifest validation (tasks 3.x):

1. **Install AJV** (if needed):
   ```bash
   npm install ajv
   ```

2. **Create validator wrapper**:
   ```typescript
   // src/manifest/json-schema-validator.ts
   import Ajv from 'ajv';
   import { chromeManifestSchema } from '../schemas/index.js';
   
   export function validateWithJsonSchema(manifest: unknown) {
     const ajv = new Ajv();
     const validate = ajv.compile(chromeManifestSchema);
     return validate(manifest);
   }
   ```

3. **Combine with Zod validation**:
   - Use Zod for type-safe parsing
   - Use JSON Schema for comprehensive validation
   - Merge error messages from both

## References

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/manifest/)
- [JSON Schema Store](https://www.schemastore.org/)
- [AJV JSON Schema Validator](https://ajv.js.org/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
