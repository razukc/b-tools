# Error Scenario Quick Reference

Quick reference guide for testing and troubleshooting error scenarios in the Browser Preview development workflow.

## Quick Test Commands

```bash
# Run automated error scenario tests
bash test-temp/test-error-scenarios.sh

# Test individual scenarios
cd test-workflow-project

# Test invalid manifest
cp manifest.json manifest.json.bak
# Edit manifest.json to introduce error
npm run build
cp manifest.json.bak manifest.json

# Test profile cleanup
rm -rf .dev-profile/
npm run dev  # Profile will be recreated
```

## Common Errors and Solutions

### Error: "CRXJS does not support Manifest vundefined"

**Cause**: Missing or invalid `manifest_version` in manifest.json

**Solution**:
```json
{
  "manifest_version": 3,
  ...
}
```

---

### Error: "Expected ',' in JSON"

**Cause**: Malformed JSON syntax in manifest.json

**Solution**: Check JSON syntax, ensure all commas are present

**Tip**: Use a JSON validator or IDE with JSON support

---

### Error: "Failed to resolve [file] from [path]"

**Cause**: Referenced file doesn't exist or path is incorrect

**Solution**: 
- Verify file exists at specified path
- Check file name spelling
- Ensure file is in correct directory

---

### Error: "Browser binary not found"

**Cause**: Chrome/Chromium not installed or not in PATH

**Solution**:
- Install Chrome: https://www.google.com/chrome/
- Or specify custom path in web-ext-config.mjs:
  ```javascript
  export default {
    run: {
      chromiumBinary: '/path/to/chrome',
    },
  };
  ```

---

### Error: "Port already in use"

**Cause**: Another process is using port 5173

**Solution**: Vite automatically uses next available port

**Manual override**:
```javascript
// vite.config.js
export default {
  server: {
    port: 5174, // Use different port
  },
};
```

---

### Issue: Profile not persisting

**Cause**: Profile directory being deleted or incorrect path

**Solution**:
1. Verify `.dev-profile/` exists after running dev
2. Check web-ext-config.mjs for correct profile path
3. Ensure `.dev-profile/` is in .gitignore (not deleted by git)

---

### Issue: Extension not loading

**Possible causes**:
- Build failed (check Vite output)
- Invalid manifest (check for errors)
- Missing required files

**Solution**:
1. Check console for build errors
2. Verify manifest.json is valid
3. Run `npm run build` to test build
4. Check dist/ directory has all files

---

## Error Testing Checklist

- [ ] Invalid manifest (missing field)
- [ ] Invalid manifest (malformed JSON)
- [ ] Missing source file
- [ ] Profile cleanup and recreation
- [ ] Browser not found (manual)
- [ ] Port conflict (manual)

## Testing Resources

- **Full testing guide**: `docs/testing/ERROR_SCENARIO_TESTING.md`
- **Test results**: `docs/reports/ERROR_SCENARIO_TEST_RESULTS.md`
- **Test script**: `test-temp/test-error-scenarios.sh`

## Error Quality Metrics

All error scenarios provide:
- ✅ Clear problem identification
- ✅ Precise location information (file, line, column)
- ✅ Actionable guidance
- ✅ Proper exit codes
- ✅ Helpful suggestions

## Support

For additional help:
1. Check the troubleshooting section in README
2. Review error output carefully
3. Verify all prerequisites are installed
4. Check that manifest.json is valid
5. Ensure all source files exist
