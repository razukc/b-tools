# Chrome Extension Manifest Schemas

This directory contains JSON schemas for validating Chrome extension manifest files.

## chrome-manifest.schema.json

**Source**: [JSON Schema Store](https://www.schemastore.org/chrome-manifest.json)

**Purpose**: Official JSON Schema for Chrome extension manifest files (both Manifest V2 and V3).

**Last Updated**: November 5, 2025

### Features

- Complete validation for Manifest V2 and V3
- Conditional validation based on manifest version
- Rich descriptions for all fields
- Pattern matching for complex fields (CSP, match patterns, etc.)
- Enum constraints for specific values
- Field dependencies and constraints

### Usage in extn

This schema is used for:

1. **Manifest Validation**: Validating user-provided manifest.json files
2. **Error Messages**: Providing helpful descriptions when validation fails
3. **Template Generation**: Ensuring generated manifests are valid
4. **Migration Detection**: Identifying V2-specific fields that need migration to V3
5. **IDE Support**: Enabling autocompletion in manifest.json files

### Integration

The schema is integrated with our Zod-based validation system in:
- `src/manifest/validator.ts` - Main validation logic
- `src/manifest/schemas.ts` - Zod schema definitions

### Updating the Schema

To update to the latest version:

```bash
curl -o src/schemas/chrome-manifest.schema.json https://www.schemastore.org/chrome-manifest.json
```

### Key Differences: Manifest V2 vs V3

**Manifest V2 (deprecated)**:
- `browser_action` / `page_action`
- `background.page` / `background.scripts`
- `web_accessible_resources` as array of strings

**Manifest V3 (current)**:
- `action` (replaces browser_action/page_action)
- `background.service_worker`
- `host_permissions` (separate from permissions)
- `web_accessible_resources` as array of objects with `resources` and `matches`

### References

- [Chrome Extension Manifest Documentation](https://developer.chrome.com/docs/extensions/mv3/manifest/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [JSON Schema Store](https://www.schemastore.org/)
