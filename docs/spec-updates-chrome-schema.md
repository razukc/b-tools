# Spec Updates: Chrome Manifest Schema Integration

## Date
November 5, 2025

## Summary
Updated the CLI Foundation spec to reflect the integration of the official Chrome Extension Manifest JSON Schema from JSON Schema Store.

## Changes Made

### 1. Design Document Updates

#### Added New Section: "Chrome Manifest JSON Schema Integration"
- **Location**: Before "Dependencies" section
- **Content**: 
  - Overview of the schema integration
  - File locations and documentation
  - Benefits of using the official schema
  - Integration strategy (Zod + JSON Schema)
  - Key Manifest V3 validation rules
  - Update instructions

#### Updated Directory Structure
- Added `src/schemas/` directory with:
  - `chrome-manifest.schema.json` - Official schema (34KB)
  - `index.ts` - Schema utilities
  - `example-usage.ts` - Usage examples
  - `README.md` - Schema documentation

#### Enhanced Manifest Validator Interface
- Added `description` field to `ValidationError` interface
- Added `validateWithJsonSchema()` method to `ManifestValidator` class
- Expanded validation rules documentation
- Added JSON Schema integration notes

### 2. Tasks Document Updates

#### Task 3.1: Create Zod schemas
**Added**:
- Reference official Chrome manifest JSON Schema for validation rules
- Use JSON Schema field descriptions for enhanced error messages

#### Task 3.3: Implement ManifestValidator
**Added**:
- Implement `validateWithJsonSchema()` method (optional)
- Enhanced error messages with field descriptions from JSON Schema
- More specific validation rules:
  - Version format: 1-4 dot-separated integers (0-65535 each)
  - Icon sizes: 16, 48, 128, 256
  - Validate against official permission list
  - Validate match patterns
- Use `getFieldDescription()` from `src/schemas/index.ts`

#### Task 3.4: Write unit tests
**Added**:
- Test `validateWithJsonSchema()` if implemented
- Test error messages include field descriptions
- Test validation against both Manifest V2 and V3 patterns
- Test match pattern validation
- Test permission validation

## Rationale

### Why Update the Specs?

1. **Accuracy**: The official JSON Schema provides authoritative validation rules that should be reflected in our implementation
2. **Completeness**: The schema covers edge cases and validation rules we might have missed
3. **Maintainability**: Referencing the official schema ensures our validation stays aligned with Chrome's requirements
4. **Better UX**: Field descriptions from the schema enable more helpful error messages

### Integration Approach

**Two-Layer Validation**:
1. **Zod (Primary)**: Type-safe parsing, runtime validation, TypeScript types
2. **JSON Schema (Secondary)**: Comprehensive validation, field descriptions, reference documentation

This approach gives us:
- Type safety from Zod
- Comprehensive validation from JSON Schema
- Best of both worlds

### No Breaking Changes

The updates are **additive only**:
- Existing Zod validation approach remains primary
- JSON Schema validation is optional/supplementary
- Enhanced error messages are backwards compatible
- No changes to public APIs or interfaces

## Implementation Impact

### Tasks Affected
- **Task 3.1**: Add JSON Schema reference when creating Zod schemas
- **Task 3.3**: Optionally implement JSON Schema validation, use field descriptions
- **Task 3.4**: Add tests for enhanced validation and error messages

### Estimated Effort
- **Minimal**: ~1-2 hours additional work
- Most work is already done (schema downloaded, utilities created)
- Implementation just needs to reference the schema for descriptions
- Optional to implement full JSON Schema validation with AJV

### Benefits vs. Cost
- **High benefit**: Better validation, better error messages, authoritative reference
- **Low cost**: Schema already integrated, minimal code changes needed
- **Future-proof**: Easy to update schema as Chrome evolves

## Files Created

As part of this integration, the following files were created:

1. `src/schemas/chrome-manifest.schema.json` - Official schema (34KB)
2. `src/schemas/index.ts` - Schema utilities and exports
3. `src/schemas/example-usage.ts` - Usage examples
4. `src/schemas/README.md` - Schema documentation
5. `docs/chrome-manifest-schema-integration.md` - Integration guide
6. `docs/manifest-field-reference.md` - Quick reference for manifest fields
7. `docs/spec-updates-chrome-schema.md` - This document

## Next Steps

When implementing tasks 3.x:

1. **Reference the schema** when creating Zod schemas to ensure completeness
2. **Use `getFieldDescription()`** to enhance error messages
3. **Optionally implement** JSON Schema validation with AJV for additional validation layer
4. **Test thoroughly** to ensure validation catches all edge cases

## Questions?

If you have questions about these spec updates:
- Review `docs/chrome-manifest-schema-integration.md` for detailed integration guide
- Review `docs/manifest-field-reference.md` for manifest field reference
- Check `src/schemas/example-usage.ts` for code examples
