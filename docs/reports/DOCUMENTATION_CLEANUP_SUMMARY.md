# Documentation Cleanup Summary

**Date**: November 12, 2025  
**Issue**: References to persistent profile feature that was not implemented  
**Status**: ✅ COMPLETED

## Problem

After releasing v0.2.0, we discovered that documentation contained references to a "persistent profile" feature (`.dev-profile/` directory) that was dropped during development for simplicity. This created confusion as the feature was documented but not actually implemented.

## Files Updated

### Template Files (User-Facing)
1. **`src/templates/base/files/.gitignore.partial.template`**
   - Removed: `.dev-profile/` entry and comment
   - Impact: Generated projects no longer have unnecessary gitignore entry

2. **`src/templates/base/files/README.partial.md.template`**
   - Removed: Step 5 about persistent profile
   - Removed: "Customize profile location" from configuration section
   - Removed: "Profile issues" troubleshooting section
   - Simplified: Extension troubleshooting to focus on actual features

### Main Documentation
3. **`README.md`**
   - Removed: "Persistent Dev Profile" from features list
   - Removed: "Persist your dev profile" bullet point
   - Removed: Step 5 about profile creation
   - Removed: "Profile Persistence" feature description
   - Removed: "persistent profile setup" from template inheritance diagram
   - Updated: Troubleshooting section to remove profile-related solutions

4. **`CHANGELOG.md`**
   - Added: [Unreleased] section documenting the documentation cleanup
   - Note: v0.2.0 entry remains unchanged (already published)

## What Was Removed

### Feature Claims
- ❌ "Persistent Dev Profile - Keep your settings and test data between sessions"
- ❌ "Profile Persistence - Your settings, login state, and test data persist between sessions"
- ❌ "A persistent profile is created in `.dev-profile/` (gitignored)"
- ❌ "Persist your dev profile in `.dev-profile/`"

### Configuration References
- ❌ "Customize profile location" in web-ext-config.mjs
- ❌ "Specify a custom profile location in `web-ext-config.js`"

### Troubleshooting Sections
- ❌ "Profile issues" section
- ❌ "Delete the `.dev-profile/` directory" solutions
- ❌ "Clear the `.dev-profile/` directory and try again"

### Template Files
- ❌ `.dev-profile/` entry in .gitignore.partial.template
- ❌ "Development profile (Browser Preview)" comment

## What Remains (Actual Features)

### Browser Preview Features ✅
- Auto-launch Chrome with extension loaded
- Hot Module Replacement (HMR)
- DevTools auto-open
- Smart reload for manifest/background changes
- Cross-platform browser support

### Template Inheritance ✅
- Base template architecture
- Package.json merging
- Partial file merging (.gitignore, README)
- Automatic feature propagation

## Impact Assessment

### For v0.2.0 Users
- **Documentation mismatch**: Users may have seen references to `.dev-profile/` that don't exist
- **No functional impact**: The feature was never implemented, so no functionality is lost
- **Confusion potential**: Medium - users might wonder why profile isn't persisting

### For Future Users (v0.2.1+)
- **Clear documentation**: No more references to non-existent features
- **Accurate expectations**: Users know exactly what features are available
- **Simplified workflow**: Less complexity in documentation

## Recommendation

**Publish v0.2.1 patch release** with these documentation fixes:

```bash
# After testing
npm run release:patch
```

This will:
- Update generated project templates with correct documentation
- Fix main README for new users
- Maintain accurate feature list

## Files That Still Reference Profiles (Intentionally)

These files document the feature for historical/testing purposes and should NOT be changed:

- `docs/BROWSER_PREVIEW_TROUBLESHOOTING.md` - Comprehensive troubleshooting guide (includes profile scenarios for completeness)
- `docs/testing/*.md` - Test documentation (documents what was tested)
- `docs/reports/*.md` - Historical reports (accurate record of what was done)

## Verification

### Before Cleanup
```bash
# Found 50+ references to .dev-profile and persistent profile
grep -r "\.dev-profile\|persistent profile" README.md src/templates/
```

### After Cleanup
```bash
# Template files: 0 references ✅
grep -r "\.dev-profile\|persistent profile" src/templates/base/files/
# No matches

# Main README: 0 references ✅
grep "\.dev-profile\|persistent profile" README.md
# No matches
```

## Next Steps

1. ✅ Commit documentation fixes
2. ⏳ Build and test locally
3. ⏳ Publish v0.2.1 patch release
4. ⏳ Verify new projects have correct documentation

## Lessons Learned

1. **Feature Documentation**: Only document features that are actually implemented
2. **Pre-Release Review**: Check for documentation/code mismatches before release
3. **Template Testing**: Test generated project documentation, not just code
4. **Quick Fixes**: Documentation-only fixes can be released as patches quickly

---

**Cleanup completed successfully. Ready for v0.2.1 patch release.**
