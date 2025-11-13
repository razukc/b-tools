# Documentation Audit for v0.2.1

**Date**: November 12, 2025  
**Target Release**: v0.2.1 (patch)  
**Status**: 📋 PLANNED

## Issues Identified

### 1. File Extension Inconsistency

**Issue**: Documentation references `web-ext-config.js` but actual file is `web-ext-config.mjs`

**Affected Files**:
- `README.md` - Multiple references to `.js` extension
- `docs/BROWSER_PREVIEW_TROUBLESHOOTING.md` - Configuration examples
- `docs/template-inheritance.md` - File listings
- `docs/testing/*.md` - Test documentation
- Any other guides referencing the config file

**Fix Required**: Global find/replace `web-ext-config.js` → `web-ext-config.mjs`

### 2. Directory Structure Mismatch

**Issue**: Documentation shows outdated directory structure that doesn't match generated projects

**Current Documentation Shows**:
```
project/
├── src/
├── public/
├── manifest.json
├── package.json
├── vite.config.js
├── web-ext-config.js  ❌ Wrong extension
└── tsconfig.json
```

**Actual Generated Structure**:
```
project/
├── src/
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── styles.css
│   ├── background/
│   │   └── background.js
│   └── content/
│       └── content.js
├── public/
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── manifest.json
├── package.json
├── vite.config.js
├── web-ext-config.mjs  ✅ Correct
└── tsconfig.json
```

**Fix Required**: Update all directory tree diagrams to match actual structure

### 3. Persistent Profile References (Partially Fixed)

**Status**: Main docs cleaned up, but some files still reference it

**Remaining References**:
- `docs/BROWSER_PREVIEW_TROUBLESHOOTING.md` - Intentionally kept for troubleshooting
- `docs/testing/*.md` - Historical test documentation
- `docs/reports/*.md` - Historical reports

**Decision**: Keep these as-is (historical/comprehensive documentation)

### 4. Feature Claims Accuracy

**Need to Verify**:
- [ ] All claimed features are actually implemented
- [ ] All implemented features are documented
- [ ] No outdated feature descriptions
- [ ] Configuration examples are accurate

## Scope for v0.2.1

### In Scope (Documentation Only)

1. ✅ **Remove persistent profile references** (DONE)
2. ✅ **Fix web-ext-config.js → web-ext-config.mjs** (DONE)
3. ✅ **Update directory structure diagrams** (DONE)
4. ⏳ **Verify all code examples** (TODO - needs manual testing)
5. ⏳ **Test generated project matches docs** (TODO - needs manual testing)

### Out of Scope

- Code changes
- New features
- Breaking changes
- Major refactoring

## Files Requiring Review

### High Priority (User-Facing)

1. **`README.md`**
   - [x] Fix web-ext-config.js references
   - [x] Update directory structure
   - [ ] Verify all examples (manual testing needed)
   - [ ] Check feature claims (manual testing needed)

2. **`src/templates/vanilla/files/README.md.template`**
   - [x] Fix web-ext-config.js references (already correct)
   - [x] Update directory structure (already correct)
   - [ ] Verify commands work (manual testing needed)
   - [ ] Check project structure diagram (already correct)

3. **`src/templates/base/files/README.partial.md.template`**
   - [x] Fix web-ext-config.js references (already correct)
   - [x] Verify dev workflow steps (already correct)
   - [x] Check troubleshooting accuracy (already correct)

### Medium Priority (Developer Docs)

4. **`docs/template-inheritance.md`**
   - [x] Fix file extension references
   - [x] Update examples
   - [x] Verify inheritance diagram

5. **`docs/BROWSER_PREVIEW_TROUBLESHOOTING.md`**
   - [x] Fix web-ext-config.js references
   - [x] Update configuration examples
   - [ ] Verify solutions work (manual testing needed)

6. **`CHANGELOG.md`**
   - [x] Ensure v0.2.0 entry is accurate
   - [x] Add v0.2.1 documentation fixes

### Low Priority (Historical/Internal)

7. **`docs/testing/*.md`** - Review but may keep as historical record
8. **`docs/reports/*.md`** - Historical, keep as-is
9. **`docs/RELEASE_GUIDE.md`** - Verify release process docs

## Testing Checklist for v0.2.1

Before releasing v0.2.1, verify:

### Generated Project Testing

```bash
# Create fresh project
extn create test-docs-verification

cd test-docs-verification

# Verify files exist with correct names
ls -la web-ext-config.mjs  # Should exist
ls -la web-ext-config.js   # Should NOT exist

# Verify directory structure matches docs
tree -L 3

# Verify README is accurate
cat README.md

# Test all documented commands
npm install
npm run dev     # Should launch browser
npm run build   # Should build successfully
npm run preview # Should work

# Verify web-ext-config.mjs works
cat web-ext-config.mjs
```

### Documentation Verification

```bash
# Search for incorrect references
grep -r "web-ext-config\.js" README.md src/templates/
# Should return 0 results

# Verify .mjs references
grep -r "web-ext-config\.mjs" README.md src/templates/
# Should find correct references

# Check for profile references in templates
grep -r "\.dev-profile" src/templates/
# Should return 0 results
```

## Implementation Plan

### Phase 1: Audit (Current)
- [x] Identify all documentation issues
- [x] Create tracking document
- [x] Prioritize fixes

### Phase 2: Fix (Completed)
- [x] Fix web-ext-config.js → .mjs globally
- [x] Update all directory structures
- [ ] Verify all code examples (requires manual testing)
- [ ] Test generated projects (requires manual testing)

### Phase 3: Verify (Before Release)
- [ ] Generate test project
- [ ] Follow all documentation steps
- [ ] Verify everything works as documented
- [ ] Run automated tests

### Phase 4: Release
- [ ] Update CHANGELOG for v0.2.1
- [ ] Commit all documentation fixes
- [ ] Run `npm run release:patch`
- [ ] Verify published package

## Estimated Effort

- **Audit**: 30 minutes ✅ DONE
- **Fixes**: 1-2 hours
- **Testing**: 30 minutes
- **Release**: 15 minutes

**Total**: ~2-3 hours for complete documentation overhaul

## Success Criteria

v0.2.1 documentation is successful when:

1. ✅ All file references use correct extensions (.mjs not .js)
2. ✅ Directory structures match actual generated projects
3. ✅ All code examples work when copy-pasted
4. ✅ No references to unimplemented features
5. ✅ Generated project README is accurate
6. ✅ All commands in docs execute successfully

## Notes

- This is a **documentation-only** patch release
- No code changes required (code is working correctly)
- Focus on accuracy and user experience
- Quick turnaround possible (no testing of new features needed)

## Related Documents

- `docs/reports/DOCUMENTATION_CLEANUP_SUMMARY.md` - Profile feature cleanup
- `docs/reports/RELEASE_0.2.0_SUMMARY.md` - v0.2.0 release details
- `docs/RELEASE_GUIDE.md` - How to release patches

---

**Status**: Ready for implementation in v0.2.1 patch release
