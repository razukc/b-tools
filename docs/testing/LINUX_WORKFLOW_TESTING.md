# Linux Workflow Testing Guide

## Overview

This document provides step-by-step instructions for testing the complete dev workflow on Linux systems. This testing validates that the template inheritance system and Browser Preview features work correctly on Linux.

## Prerequisites

- Linux system (Ubuntu 20.04+, Fedora 35+, or similar)
- Node.js 18+ installed
- Chrome/Chromium browser installed
- Git installed
- Terminal access

## Test Environment Setup

### 1. Install Chrome/Chromium

**Ubuntu/Debian:**
```bash
# Install Chromium
sudo apt update
sudo apt install chromium-browser

# Or install Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt-get install -f
```

**Fedora:**
```bash
# Install Chromium
sudo dnf install chromium

# Or install Chrome
sudo dnf install google-chrome-stable
```

**Arch Linux:**
```bash
# Install Chromium
sudo pacman -S chromium

# Or install Chrome from AUR
yay -S google-chrome
```

### 2. Verify Node.js Installation

```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

### 3. Clone and Build extn CLI

```bash
# Clone the repository
git clone <repository-url>
cd b-tools

# Install dependencies
npm install

# Build the CLI
npm run build

# Link for local testing
npm link
```

## Test Procedure

### Test 1: Project Creation

**Objective:** Verify that `extn create` generates all required files from base and vanilla templates.

```bash
# Create a test project
cd /tmp
extn create linux-test-project
cd linux-test-project
```

**Verification Checklist:**

- [ ] Project directory created successfully
- [ ] `package.json` exists with merged dependencies
- [ ] `web-ext-config.js` exists (from base template)
- [ ] `vite.config.js` exists (from vanilla template)
- [ ] `manifest.json` exists
- [ ] `.gitignore` exists with `.dev-profile/` entry
- [ ] `README.md` exists with dev workflow documentation
- [ ] `src/` directory structure created

**Verify package.json contents:**
```bash
cat package.json
```

Expected devDependencies:
- `web-ext` (from base)
- `concurrently` (from base)
- `vite` (from vanilla)
- `@crxjs/vite-plugin` (from vanilla)

Expected scripts:
- `dev` (from base)
- `build` (from vanilla)
- `preview` (from vanilla)

**Verify web-ext-config.js:**
```bash
cat web-ext-config.js
```

Should contain:
- `sourceDir: './dist'`
- `target: 'chromium'`
- `chromiumProfile: './.dev-profile/chrome'`
- `keepProfileChanges: true`

**Verify .gitignore:**
```bash
cat .gitignore
```

Should include:
- `.dev-profile/` entry
- Comment about Browser Preview feature

**Verify README.md:**
```bash
cat README.md
```

Should include:
- Development section with `npm run dev` instructions
- Configuration section for web-ext-config.js
- Troubleshooting section

### Test 2: Dependency Installation

**Objective:** Verify that all dependencies install correctly on Linux.

```bash
# Install dependencies
npm install
```

**Verification Checklist:**

- [ ] Installation completes without errors
- [ ] `node_modules/` directory created
- [ ] `web-ext` installed (check: `ls node_modules/.bin/web-ext`)
- [ ] `concurrently` installed (check: `ls node_modules/.bin/concurrently`)
- [ ] `vite` installed (check: `ls node_modules/.bin/vite`)
- [ ] `@crxjs/vite-plugin` installed (check: `ls node_modules/@crxjs/vite-plugin`)

**Verify installations:**
```bash
npx web-ext --version
npx concurrently --version
npx vite --version
```

### Test 3: Build Process

**Objective:** Verify that the build process works correctly on Linux.

```bash
# Run build
npm run build
```

**Verification Checklist:**

- [ ] Build completes without errors
- [ ] `dist/` directory created
- [ ] `dist/manifest.json` exists
- [ ] Extension files present in `dist/`
- [ ] No build warnings or errors

**Verify dist contents:**
```bash
ls -la dist/
cat dist/manifest.json
```

### Test 4: Development Server Startup

**Objective:** Verify that `npm run dev` starts both Vite and web-ext correctly.

```bash
# Start development server
npm run dev
```

**Verification Checklist:**

- [ ] Vite dev server starts successfully
- [ ] Vite displays dev server URL (e.g., `http://localhost:5173`)
- [ ] web-ext starts after Vite is ready
- [ ] Chrome/Chromium browser launches automatically
- [ ] Browser opens with extension loaded
- [ ] Browser navigates to `chrome://extensions`
- [ ] DevTools open automatically
- [ ] Extension appears in extensions list
- [ ] No startup errors in console

**Expected Console Output:**
```
> concurrently "vite" "web-ext run --source-dir=./dist --config=./web-ext-config.js"

[0] VITE v5.x.x ready in xxx ms
[0] ➜ Local: http://localhost:5173/
[1] Running web extension from ./dist
[1] Installed extension at chrome://extensions
```

**Browser Verification:**
- [ ] Chrome/Chromium window opens
- [ ] Extension loaded in browser
- [ ] Extension icon visible (if applicable)
- [ ] DevTools panel open
- [ ] No console errors

### Test 5: Profile Persistence

**Objective:** Verify that the browser profile persists between sessions.

**Step 1: Initial Session**
```bash
# With dev server running from Test 4
# In the browser:
# 1. Make some changes (e.g., pin the extension)
# 2. Note the extension ID
# 3. Check DevTools console for any messages
```

**Step 2: Stop and Restart**
```bash
# Stop the dev server (Ctrl+C)
# Wait for clean shutdown

# Verify profile directory exists
ls -la .dev-profile/chrome/

# Restart dev server
npm run dev
```

**Verification Checklist:**

- [ ] `.dev-profile/chrome/` directory exists after first run
- [ ] Profile directory contains browser data
- [ ] After restart, browser opens with same profile
- [ ] Extension settings/state preserved
- [ ] Extension ID remains the same
- [ ] No "first run" prompts on restart

**Verify profile contents:**
```bash
du -sh .dev-profile/chrome/
ls -la .dev-profile/chrome/
```

### Test 6: Hot Module Replacement (HMR)

**Objective:** Verify that file changes trigger automatic reloads.

**With dev server running:**

**Test 6.1: Popup HTML Changes**
```bash
# In another terminal, edit popup HTML
echo '<h1>HMR Test</h1>' >> src/popup/popup.html
```

**Verification:**
- [ ] Vite detects file change
- [ ] Console shows HMR update
- [ ] Extension updates without full reload
- [ ] Changes visible in popup (open extension popup)

**Test 6.2: Background Script Changes**
```bash
# Edit background script
echo 'console.log("HMR test");' >> src/background/background.js
```

**Verification:**
- [ ] Vite detects file change
- [ ] Extension performs full reload
- [ ] Console shows reload message
- [ ] New console.log appears in background console

**Test 6.3: Manifest Changes**
```bash
# Edit manifest (change version)
sed -i 's/"version": "1.0.0"/"version": "1.0.1"/' src/manifest.json
```

**Verification:**
- [ ] Vite detects file change
- [ ] Extension performs full reload
- [ ] New version visible in chrome://extensions
- [ ] Extension continues to work

### Test 7: Shutdown Process

**Objective:** Verify clean shutdown of dev server.

```bash
# Press Ctrl+C in the terminal running npm run dev
```

**Verification Checklist:**

- [ ] Vite server shuts down gracefully
- [ ] web-ext process terminates
- [ ] Browser window closes (or extension unloads)
- [ ] No orphaned processes (check: `ps aux | grep -E 'vite|web-ext|chrome'`)
- [ ] Terminal returns to prompt
- [ ] Shutdown completes within 3 seconds

### Test 8: Error Scenarios

**Test 8.1: Browser Not Found**
```bash
# Temporarily rename Chrome binary
sudo mv /usr/bin/chromium-browser /usr/bin/chromium-browser.bak

# Try to start dev server
npm run dev

# Restore Chrome binary
sudo mv /usr/bin/chromium-browser.bak /usr/bin/chromium-browser
```

**Expected:** web-ext displays error about missing browser

**Test 8.2: Port Already in Use**
```bash
# Start a server on port 5173
python3 -m http.server 5173 &
SERVER_PID=$!

# Try to start dev server
npm run dev

# Kill the blocking server
kill $SERVER_PID
```

**Expected:** Vite suggests alternative port or displays error

**Test 8.3: Invalid Manifest**
```bash
# Corrupt manifest.json
echo "invalid json" > src/manifest.json

# Try to build
npm run build
```

**Expected:** Build fails with validation error

**Test 8.4: Profile Cleanup**
```bash
# Remove profile directory while dev server is stopped
rm -rf .dev-profile/

# Start dev server
npm run dev
```

**Expected:** New profile created automatically

## Test Results Documentation

### Test Summary Template

```markdown
## Linux Testing Results

**Date:** YYYY-MM-DD
**Tester:** [Name]
**System:** [Linux Distribution and Version]
**Node.js:** [Version]
**Browser:** [Chrome/Chromium Version]

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| Project Creation | ✅/❌ | |
| Dependency Installation | ✅/❌ | |
| Build Process | ✅/❌ | |
| Dev Server Startup | ✅/❌ | |
| Profile Persistence | ✅/❌ | |
| HMR - Popup Changes | ✅/❌ | |
| HMR - Background Changes | ✅/❌ | |
| HMR - Manifest Changes | ✅/❌ | |
| Shutdown Process | ✅/❌ | |
| Error: Browser Not Found | ✅/❌ | |
| Error: Port In Use | ✅/❌ | |
| Error: Invalid Manifest | ✅/❌ | |
| Error: Profile Cleanup | ✅/❌ | |

### Issues Found

[List any issues, bugs, or unexpected behavior]

### Performance Notes

- Startup time: [seconds]
- HMR update time: [milliseconds]
- Shutdown time: [seconds]

### Additional Observations

[Any other relevant observations]
```

## Common Linux-Specific Issues

### Issue: Browser Binary Not Found

**Symptoms:** web-ext cannot find Chrome/Chromium

**Solutions:**
```bash
# Find Chrome/Chromium binary
which chromium-browser
which google-chrome
which chromium

# Update web-ext-config.js with explicit path
# Edit web-ext-config.js and add:
# chromiumBinary: '/usr/bin/chromium-browser'
```

### Issue: Permission Denied on Profile Directory

**Symptoms:** Cannot create or write to `.dev-profile/`

**Solutions:**
```bash
# Check permissions
ls -la .dev-profile/

# Fix permissions
chmod -R u+w .dev-profile/

# Or remove and recreate
rm -rf .dev-profile/
```

### Issue: Display Server Issues (Headless Systems)

**Symptoms:** Browser fails to launch on headless Linux

**Solutions:**
```bash
# Install Xvfb for virtual display
sudo apt install xvfb

# Run with virtual display
xvfb-run npm run dev
```

### Issue: SELinux Blocking Browser Launch

**Symptoms:** Browser fails to launch on Fedora/RHEL with SELinux

**Solutions:**
```bash
# Check SELinux status
getenforce

# Temporarily set to permissive (for testing only)
sudo setenforce 0

# Or add SELinux policy (consult SELinux documentation)
```

## Cleanup After Testing

```bash
# Stop any running dev servers
# Press Ctrl+C

# Remove test project
cd /tmp
rm -rf linux-test-project

# Unlink CLI (if linked)
cd /path/to/b-tools
npm unlink
```

## Reporting Results

After completing all tests, create a report in `docs/reports/LINUX_TESTING_RESULTS.md` with:

1. Test summary (pass/fail for each test)
2. System information (Linux distro, versions)
3. Any issues encountered
4. Performance observations
5. Screenshots (if applicable)
6. Recommendations

## Requirements Coverage

This testing procedure validates the following requirements:

- **1.1** - Dev Command starts Vite and launches browser
- **1.2** - Profile Manager creates and persists profile
- **1.3** - Auto-reload works for file changes
- **1.4** - Browser launches with extension loaded
- **3.1, 3.2, 3.3, 3.4, 3.5** - Template inheritance and file generation

## Next Steps

After successful Linux testing:

1. Mark task 6.4 as complete in tasks.md
2. Document any Linux-specific issues in troubleshooting guide
3. Update README with Linux-specific notes if needed
4. Proceed to task 6.5 (error scenarios testing)
