# Error Scenario Testing Guide

This document provides manual testing procedures for error scenarios in the Browser Preview development workflow.

## Overview

This guide covers testing error handling for:
1. Browser not found
2. Port already in use
3. Invalid manifest
4. Profile cleanup
5. Error message quality

## Prerequisites

- A generated project with Browser Preview features (created with `extn create`)
- Node.js and npm installed
- Basic understanding of Chrome extension development

## Test Environment Setup

```bash
# Create a test project
cd test-workflow-project

# Install dependencies
npm install
```

## Error Scenario Tests

### 1. Browser Not Found

**Objective**: Verify that web-ext provides helpful error messages when the browser binary is not found.

**Test Steps**:

1. **Temporarily rename browser binary** (to simulate browser not found):
   
   **Windows**:
   ```bash
   # Find Chrome installation
   where chrome
   # Typical location: C:\Program Files\Google\Chrome\Application\chrome.exe
   
   # Temporarily rename (requires admin)
   # Note: This may not be practical - see alternative below
   ```
   
   **macOS**:
   ```bash
   # Temporarily rename Chrome
   sudo mv "/Applications/Google Chrome.app" "/Applications/Google Chrome.app.bak"
   ```
   
   **Linux**:
   ```bash
   # Temporarily rename Chrome
   sudo mv /usr/bin/google-chrome /usr/bin/google-chrome.bak
   ```

2. **Alternative approach** - Modify web-ext-config.mjs to point to non-existent browser:
   
   ```javascript
   export default {
     sourceDir: './dist',
     run: {
       chromiumBinary: '/path/to/nonexistent/browser',
       startUrl: ['chrome://extensions'],
     },
   };
   ```

3. **Run dev command**:
   ```bash
   npm run dev
   ```

4. **Expected behavior**:
   - web-ext should display an error message indicating browser not found
   - Error message should include the path it tried to use
   - Process should exit gracefully (not hang)
   - Vite server should start but web-ext should fail

5. **Verify error message quality**:
   - [ ] Error clearly states browser binary not found
   - [ ] Error includes the path that was searched
   - [ ] Error suggests checking browser installation
   - [ ] Process exits with non-zero exit code

6. **Restore browser**:
   ```bash
   # macOS
   sudo mv "/Applications/Google Chrome.app.bak" "/Applications/Google Chrome.app"
   
   # Linux
   sudo mv /usr/bin/google-chrome.bak /usr/bin/google-chrome
   
   # Or restore web-ext-config.mjs to original state
   ```

**Requirements Tested**: 11.1

---

### 2. Port Already in Use

**Objective**: Verify that Vite provides helpful error messages when the default port is already in use.

**Test Steps**:

1. **Start first dev server**:
   ```bash
   npm run dev
   ```
   
   Wait for Vite to start (default port 5173).

2. **In a new terminal, try to start second dev server**:
   ```bash
   cd test-workflow-project
   npm run dev
   ```

3. **Expected behavior**:
   - Vite should detect port 5173 is in use
   - Vite should automatically try the next available port (5174, 5175, etc.)
   - Vite should display a message indicating it's using an alternative port
   - Both servers should run successfully on different ports

4. **Verify error handling**:
   - [ ] Vite detects port conflict
   - [ ] Vite suggests or uses alternative port
   - [ ] Clear message about which port is being used
   - [ ] Both dev servers can run simultaneously

5. **Alternative test - Force port conflict**:
   
   Modify `vite.config.js` to use a specific port:
   ```javascript
   export default {
     server: {
       port: 5173,
       strictPort: true, // Fail if port is in use
     },
   };
   ```
   
   Then try to start two servers - second should fail with clear error.

6. **Cleanup**:
   ```bash
   # Stop both dev servers with Ctrl+C
   # Restore vite.config.js if modified
   ```

**Requirements Tested**: 11.3

---

### 3. Invalid Manifest

**Objective**: Verify that @crxjs/vite-plugin and web-ext provide helpful error messages for invalid manifest files.

**Test Steps**:

#### 3a. Missing Required Field

1. **Backup manifest**:
   ```bash
   cp manifest.json manifest.json.bak
   ```

2. **Remove required field** (e.g., manifest_version):
   ```json
   {
     "name": "test-workflow-project",
     "version": "1.0.0",
     "description": "test-workflow-project - Chrome Extension"
   }
   ```

3. **Run dev command**:
   ```bash
   npm run dev
   ```

4. **Expected behavior**:
   - @crxjs/vite-plugin should detect invalid manifest during build
   - Error message should indicate which field is missing
   - Error should reference manifest.json file
   - Build should fail before browser launches

5. **Verify error message**:
   - [ ] Error clearly states manifest is invalid
   - [ ] Error identifies missing field (manifest_version)
   - [ ] Error includes file location
   - [ ] Build fails gracefully

#### 3b. Invalid Field Value

1. **Use invalid manifest_version**:
   ```json
   {
     "manifest_version": 99,
     "name": "test-workflow-project",
     "version": "1.0.0"
   }
   ```

2. **Run dev command**:
   ```bash
   npm run dev
   ```

3. **Expected behavior**:
   - Validation error for unsupported manifest version
   - Clear error message about invalid value

#### 3c. Malformed JSON

1. **Introduce JSON syntax error**:
   ```json
   {
     "manifest_version": 3,
     "name": "test-workflow-project",
     "version": "1.0.0",
     // Missing comma here
     "description": "test-workflow-project - Chrome Extension"
   }
   ```

2. **Run dev command**:
   ```bash
   npm run dev
   ```

3. **Expected behavior**:
   - JSON parse error
   - Error indicates line/column of syntax error
   - Clear message about malformed JSON

4. **Restore manifest**:
   ```bash
   cp manifest.json.bak manifest.json
   rm manifest.json.bak
   ```

**Requirements Tested**: 11.4

---

### 4. Build Failures

**Objective**: Verify that Vite provides helpful error messages for build failures.

**Test Steps**:

#### 4a. Missing Source File

1. **Temporarily rename a source file**:
   ```bash
   mv src/popup/popup.js src/popup/popup.js.bak
   ```

2. **Run dev command**:
   ```bash
   npm run dev
   ```

3. **Expected behavior**:
   - Vite should fail to build
   - Error message should indicate missing file
   - Error should include file path
   - Process should exit or wait for file to be restored

4. **Restore file**:
   ```bash
   mv src/popup/popup.js.bak src/popup/popup.js
   ```

#### 4b. Syntax Error in Source

1. **Introduce syntax error in popup.js**:
   ```javascript
   // Add invalid syntax
   const invalid syntax here
   ```

2. **Run dev command**:
   ```bash
   npm run dev
   ```

3. **Expected behavior**:
   - Vite should detect syntax error during build
   - Error message should show file and line number
   - Error should display the problematic code
   - Dev server should wait for fix (in watch mode)

4. **Fix syntax error** and verify hot reload works.

**Requirements Tested**: 11.2

---

### 5. Profile Cleanup

**Objective**: Verify that profile cleanup works correctly and profile can be recreated.

**Test Steps**:

1. **Start dev server to create profile**:
   ```bash
   npm run dev
   ```
   
   Wait for browser to launch and profile to be created in `.dev-profile/`.

2. **Stop dev server**:
   ```bash
   # Press Ctrl+C
   ```

3. **Verify profile exists**:
   ```bash
   ls -la .dev-profile/
   # Should show chrome/ directory with profile data
   ```

4. **Delete profile directory**:
   ```bash
   rm -rf .dev-profile/
   ```

5. **Restart dev server**:
   ```bash
   npm run dev
   ```

6. **Expected behavior**:
   - web-ext should recreate `.dev-profile/` directory
   - Browser should launch successfully
   - New profile should be created
   - Extension should load correctly
   - No errors related to missing profile

7. **Verify profile recreation**:
   - [ ] `.dev-profile/` directory is recreated
   - [ ] Browser launches without errors
   - [ ] Extension loads successfully
   - [ ] Profile persists after stopping and restarting

8. **Test profile persistence**:
   - Make some changes in browser (e.g., pin extension, change settings)
   - Stop dev server (Ctrl+C)
   - Restart dev server
   - Verify changes persist

**Requirements Tested**: 11.5

---

### 6. Graceful Shutdown

**Objective**: Verify that stopping the dev server cleans up processes correctly.

**Test Steps**:

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Verify processes are running**:
   ```bash
   # In another terminal
   ps aux | grep vite
   ps aux | grep web-ext
   ps aux | grep chrome
   ```

3. **Stop dev server**:
   ```bash
   # Press Ctrl+C in the dev server terminal
   ```

4. **Verify cleanup**:
   ```bash
   # Check that processes are stopped
   ps aux | grep vite    # Should not show vite process
   ps aux | grep web-ext # Should not show web-ext process
   
   # Browser may remain open (expected behavior)
   ```

5. **Expected behavior**:
   - Ctrl+C stops both Vite and web-ext processes
   - No orphaned processes remain
   - Profile is saved before shutdown
   - Shutdown completes within 3 seconds

6. **Verify error handling**:
   - [ ] Ctrl+C stops all processes
   - [ ] No orphaned processes
   - [ ] Profile state is saved
   - [ ] Clean shutdown within 3 seconds

**Requirements Tested**: 11.5

---

## Error Message Quality Checklist

For each error scenario, verify that error messages are:

- [ ] **Clear**: Easy to understand what went wrong
- [ ] **Specific**: Identifies the exact problem
- [ ] **Actionable**: Suggests how to fix the issue
- [ ] **Contextual**: Includes relevant file paths, line numbers, etc.
- [ ] **Consistent**: Uses similar format across different errors

## Common Issues and Solutions

### Issue: Browser launches but extension doesn't load

**Possible causes**:
- Build failed but browser still launched
- Invalid manifest
- Missing required files

**Solution**:
- Check Vite build output for errors
- Verify manifest.json is valid
- Ensure all source files exist

### Issue: Port conflict not detected

**Possible causes**:
- Vite is configured to use different port
- Port is available but another service is interfering

**Solution**:
- Check vite.config.js for port configuration
- Use `netstat` or `lsof` to check port usage

### Issue: Profile not persisting

**Possible causes**:
- Profile directory is gitignored (correct)
- Profile directory is being deleted
- Incorrect profile path in web-ext-config.mjs

**Solution**:
- Verify `.dev-profile/` exists after running dev
- Check web-ext-config.mjs for correct profile path
- Ensure profile directory is not being cleaned up

## Test Results Template

Use this template to document test results:

```markdown
## Error Scenario Test Results

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Platform**: [Windows/macOS/Linux]
**Node Version**: [version]

### Test Results

| Scenario | Status | Notes |
|----------|--------|-------|
| Browser not found | ✅/❌ | |
| Port in use | ✅/❌ | |
| Invalid manifest | ✅/❌ | |
| Build failure | ✅/❌ | |
| Profile cleanup | ✅/❌ | |
| Graceful shutdown | ✅/❌ | |

### Issues Found

1. [Issue description]
   - **Severity**: High/Medium/Low
   - **Steps to reproduce**: ...
   - **Expected**: ...
   - **Actual**: ...

### Recommendations

- [Recommendation 1]
- [Recommendation 2]
```

## Conclusion

These error scenarios ensure that the Browser Preview development workflow provides helpful feedback when things go wrong. All error messages should guide developers toward solutions rather than leaving them confused.

For automated testing of these scenarios, consider:
- Mocking browser binary paths
- Using test fixtures with invalid manifests
- Simulating port conflicts in test environment
- Automating profile cleanup tests
