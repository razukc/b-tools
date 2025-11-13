# Browser Preview Troubleshooting Guide

This guide helps you resolve common issues with the Browser Preview development workflow (`npm run dev`).

## Quick Diagnostics

Before diving into specific issues, run these quick checks:

```bash
# 1. Verify dependencies are installed
npm list web-ext concurrently vite @crxjs/vite-plugin

# 2. Check if browser is installed
which google-chrome     # Linux
which chromium          # Linux alternative
# Windows: Check C:\Program Files\Google\Chrome\Application\chrome.exe
# macOS: Check /Applications/Google Chrome.app

# 3. Verify build works
npm run build

# 4. Check for port conflicts
lsof -i :5173          # Linux/macOS
netstat -ano | findstr :5173  # Windows
```

## Common Issues

### Browser Doesn't Launch

#### Issue: `npm run dev` builds successfully but browser doesn't open

**Symptoms:**
- Vite dev server starts successfully
- Extension builds to `dist/`
- No browser window appears
- Terminal shows web-ext errors

**Solutions:**

**1. Browser Not Installed**

Install Chrome/Chromium:

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install google-chrome-stable

# Or Chromium
sudo apt install chromium-browser

# Fedora
sudo dnf install google-chrome-stable

# Arch
sudo pacman -S google-chrome
```

**macOS:**
```bash
# Using Homebrew
brew install --cask google-chrome
```

**Windows:**
- Download from [google.com/chrome](https://www.google.com/chrome/)
- Install to default location

**2. Browser Not in PATH (Linux)**

Add Chrome to PATH:
```bash
# Find Chrome installation
which google-chrome
which chromium

# If not found, add to PATH in ~/.bashrc or ~/.zshrc
export PATH="/usr/bin:$PATH"

# Or create symlink
sudo ln -s /usr/bin/google-chrome /usr/local/bin/chrome
```

**3. Custom Browser Location**

Specify browser path in `web-ext-config.mjs`:

```javascript
export default {
  sourceDir: './dist',
  target: 'chromium',
  chromiumBinary: '/path/to/your/chrome',  // Add this line
  chromiumProfile: './.dev-profile/chrome',
  keepProfileChanges: true,
  startUrl: ['chrome://extensions'],
  args: ['--auto-open-devtools-for-tabs'],
  ignoreFiles: [
    'web-ext-config.mjs',
    'vite.config.js',
    'package.json',
    'package-lock.json',
    'node_modules',
    'src'
  ],
  verbose: false
};
```

**Common browser paths:**
- **Linux**: `/usr/bin/google-chrome`, `/usr/bin/chromium`
- **macOS**: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- **Windows**: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`

**4. Permission Issues (Linux)**

Fix Chrome permissions:
```bash
# Check Chrome permissions
ls -la $(which google-chrome)

# Make executable if needed
sudo chmod +x /usr/bin/google-chrome
```

**5. WSL (Windows Subsystem for Linux)**

WSL requires special configuration:

```javascript
// web-ext-config.mjs
export default {
  sourceDir: './dist',
  target: 'chromium',
  chromiumBinary: '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
  chromiumProfile: './.dev-profile/chrome',
  keepProfileChanges: true,
  startUrl: ['chrome://extensions'],
  args: ['--auto-open-devtools-for-tabs'],
  ignoreFiles: [
    'web-ext-config.mjs',
    'vite.config.js',
    'package.json',
    'package-lock.json',
    'node_modules',
    'src'
  ],
  verbose: false
};
```

### Extension Doesn't Reload on Changes

#### Issue: File changes don't trigger extension reload

**Symptoms:**
- Vite dev server is running
- File changes are detected by Vite
- Extension doesn't update in browser
- No HMR notifications in console

**Solutions:**

**1. Check HMR Connection**

Open browser DevTools (F12) and check console for:
```
[vite] connected.
[vite] hot updated: /src/popup/popup.js
```

If missing, check:
- Vite dev server is running (check terminal)
- No firewall blocking localhost:5173
- Browser can access http://localhost:5173

**2. Manifest Changes Require Full Reload**

Manifest and background service worker changes need full extension reload:

1. Go to `chrome://extensions`
2. Click the reload icon on your extension
3. Or restart `npm run dev`

**3. Content Script Changes**

Content scripts may need page refresh:
1. Reload the web page where content script runs
2. Or restart `npm run dev` for full reload

**4. Check File Watching**

Verify Vite is watching files:
```bash
# Check Vite output in terminal
# Should see: "watching for file changes..."

# If not, check file system limits (Linux)
cat /proc/sys/fs/inotify/max_user_watches

# Increase if needed
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**5. Clear Extension Cache**

Sometimes extension cache causes issues:
1. Go to `chrome://extensions`
2. Remove your extension
3. Delete `.dev-profile/` directory
4. Restart `npm run dev`

### Build Errors

#### Issue: Vite build fails with errors

**Symptoms:**
- `npm run dev` fails immediately
- Terminal shows build errors
- No `dist/` directory created

**Solutions:**

**1. Syntax Errors**

Check terminal for file and line number:
```
Error: Unexpected token (5:10)
  at src/popup/popup.js:5:10
```

Fix the syntax error in the indicated file.

**2. Missing Dependencies**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**3. Invalid Manifest**

Check `manifest.json` for errors:
```bash
# Validate JSON syntax
cat manifest.json | jq .

# If jq not installed
npm install -g jsonlint
jsonlint manifest.json
```

Common manifest issues:
- Missing required fields (`name`, `version`, `manifest_version`)
- Invalid version format (must be `X.Y.Z`)
- Invalid permissions
- Incorrect file paths

**4. TypeScript Errors**

If using TypeScript:
```bash
# Check for type errors
npx tsc --noEmit

# Fix or ignore specific errors
// @ts-ignore
```

**5. Vite Configuration Issues**

Check `vite.config.js` for errors:
```javascript
import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [crx({ manifest })],
});
```

### Port Already in Use

#### Issue: Vite can't start because port 5173 is in use

**Symptoms:**
```
Error: Port 5173 is already in use
```

**Solutions:**

**1. Kill Process Using Port**

**Linux/macOS:**
```bash
# Find process
lsof -i :5173

# Kill process
kill -9 <PID>

# Or kill all node processes
pkill -f node
```

**Windows:**
```cmd
# Find process
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F

# Or kill all node processes
taskkill /IM node.exe /F
```

**2. Use Different Port**

Edit `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 5174,  // Change port
  },
  plugins: [crx({ manifest })],
});
```

**3. Let Vite Choose Port**

Vite will automatically try next available port if you don't specify one.

### Dev Profile Issues

#### Issue: Extension state is lost or profile is corrupted

**Symptoms:**
- Extension settings reset on restart
- Login state not persisting
- Browser crashes or hangs
- Profile errors in terminal

**Solutions:**

**1. Reset Dev Profile**

Delete and recreate profile:
```bash
# Stop dev server (Ctrl+C)

# Delete profile
rm -rf .dev-profile/

# Restart dev server
npm run dev
```

**2. Profile Location Issues**

Check profile path in `web-ext-config.mjs`:
```javascript
export default {
  chromiumProfile: './.dev-profile/chrome',  // Relative to project root
  keepProfileChanges: true,
  // ...
};
```

**3. Profile Size Issues**

Large profiles can cause problems:
```bash
# Check profile size
du -sh .dev-profile/

# If > 500MB, consider resetting
rm -rf .dev-profile/
```

**4. Custom Profile Location**

Use custom profile location:
```javascript
export default {
  chromiumProfile: '/path/to/custom/profile',
  keepProfileChanges: true,
  // ...
};
```

**5. Disable Profile Persistence**

For testing without profile:
```javascript
export default {
  // chromiumProfile: './.dev-profile/chrome',  // Comment out
  keepProfileChanges: false,  // Disable persistence
  // ...
};
```

### Permission Errors

#### Issue: Cannot create files or directories

**Symptoms:**
```
Error: EACCES: permission denied
Error: EPERM: operation not permitted
```

**Solutions:**

**1. Check Directory Permissions**

```bash
# Check permissions
ls -la

# Fix permissions
chmod -R u+w .

# Fix ownership (if needed)
sudo chown -R $USER:$USER .
```

**2. Run Without Sudo**

Never run `npm run dev` with sudo. If you need sudo, fix permissions instead.

**3. Windows Antivirus**

Windows Defender or antivirus may block file operations:
- Add project directory to exclusions
- Temporarily disable real-time protection for testing

**4. WSL Permissions**

In WSL, avoid working in `/mnt/c/`:
```bash
# Work in WSL home directory
cd ~
mkdir projects
cd projects
```

### Multiple Browser Instances

#### Issue: Multiple browser windows open or processes remain

**Symptoms:**
- Multiple Chrome windows open
- Browser processes remain after stopping dev server
- Port conflicts on restart

**Solutions:**

**1. Clean Shutdown**

Always stop dev server with Ctrl+C, not by closing terminal.

**2. Kill Remaining Processes**

**Linux/macOS:**
```bash
# Kill all Chrome processes
pkill -f chrome

# Or specific to dev profile
pkill -f "\.dev-profile"
```

**Windows:**
```cmd
# Kill Chrome processes
taskkill /IM chrome.exe /F
```

**3. Prevent Multiple Instances**

Edit `web-ext-config.mjs`:
```javascript
export default {
  args: [
    '--auto-open-devtools-for-tabs',
    '--no-first-run',
    '--no-default-browser-check',
  ],
  // ...
};
```

### Extension Not Loading

#### Issue: Browser opens but extension doesn't appear

**Symptoms:**
- Browser launches successfully
- `chrome://extensions` shows no extension
- No errors in terminal

**Solutions:**

**1. Check dist/ Directory**

```bash
# Verify dist exists and has content
ls -la dist/

# Should contain:
# - manifest.json
# - src/ directory with extension files
# - assets/
```

**2. Verify Manifest**

```bash
# Check manifest exists
cat dist/manifest.json

# Verify required fields
jq '.name, .version, .manifest_version' dist/manifest.json
```

**3. Check web-ext Configuration**

Verify `sourceDir` in `web-ext-config.mjs`:
```javascript
export default {
  sourceDir: './dist',  // Must point to build output
  // ...
};
```

**4. Manual Load Test**

Try loading manually:
1. Run `npm run build`
2. Go to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `dist/` folder

If manual load fails, check manifest validation errors.

**5. Check Browser Console**

Open DevTools (F12) and check for errors:
- Extension load errors
- Manifest validation errors
- Permission errors

## Configuration Examples

### Minimal Configuration

```javascript
// web-ext-config.mjs
export default {
  sourceDir: './dist',
  target: 'chromium',
  chromiumProfile: './.dev-profile/chrome',
  keepProfileChanges: true,
};
```

### Development Configuration

```javascript
// web-ext-config.mjs
export default {
  sourceDir: './dist',
  target: 'chromium',
  chromiumProfile: './.dev-profile/chrome',
  keepProfileChanges: true,
  startUrl: ['chrome://extensions', 'https://example.com'],
  args: [
    '--auto-open-devtools-for-tabs',
    '--disable-extensions-except=' + process.cwd() + '/dist',
    '--load-extension=' + process.cwd() + '/dist',
  ],
  ignoreFiles: [
    'web-ext-config.mjs',
    'vite.config.js',
    'package.json',
    'package-lock.json',
    'node_modules',
    'src',
    '*.log',
    '*.md',
  ],
  verbose: true,  // Enable for debugging
};
```

### Multi-Browser Configuration

```javascript
// web-ext-config.mjs
const target = process.env.BROWSER || 'chromium';

export default {
  sourceDir: './dist',
  target,
  chromiumProfile: './.dev-profile/chrome',
  firefoxProfile: './.dev-profile/firefox',
  keepProfileChanges: true,
  startUrl: target === 'firefox' 
    ? ['about:debugging#/runtime/this-firefox']
    : ['chrome://extensions'],
  args: ['--auto-open-devtools-for-tabs'],
};
```

Usage:
```bash
# Chrome (default)
npm run dev

# Firefox
BROWSER=firefox npm run dev

# Edge
BROWSER=edge npm run dev
```

### Custom Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"web-ext run --source-dir=./dist --config=./web-ext-config.mjs\"",
    "dev:firefox": "concurrently \"vite\" \"web-ext run --source-dir=./dist --target=firefox\"",
    "dev:edge": "concurrently \"vite\" \"web-ext run --source-dir=./dist --target=edge\"",
    "dev:verbose": "concurrently \"vite\" \"web-ext run --source-dir=./dist --config=./web-ext-config.mjs --verbose\"",
    "dev:clean": "rm -rf .dev-profile && npm run dev"
  }
}
```

## Advanced Debugging

### Enable Verbose Logging

```javascript
// web-ext-config.mjs
export default {
  verbose: true,  // Enable verbose logging
  // ...
};
```

Or via command line:
```bash
# Edit package.json dev script
"dev": "concurrently \"vite\" \"web-ext run --source-dir=./dist --config=./web-ext-config.mjs --verbose\""
```

### Check web-ext Version

```bash
# Check installed version
npm list web-ext

# Update to latest
npm install --save-dev web-ext@latest
```

### Test web-ext Directly

```bash
# Build first
npm run build

# Run web-ext directly
npx web-ext run --source-dir=./dist --target=chromium --verbose
```

### Check Vite Configuration

```bash
# Test Vite build
npx vite build

# Test Vite dev server
npx vite

# Check Vite version
npm list vite
```

### Inspect Extension in Browser

1. Go to `chrome://extensions`
2. Find your extension
3. Click "Inspect views: background page" or "service worker"
4. Check console for errors
5. Check Network tab for failed requests

## Getting Help

If you're still stuck:

1. **Check the logs**: Look for error messages in terminal and browser console
2. **Search issues**: Check [GitHub issues](https://github.com/razukc/extn/issues)
3. **Create minimal reproduction**: Test with fresh project
4. **Report bug**: Open issue with:
   - Operating system and version
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Browser version
   - Full error message
   - Steps to reproduce

## Resources

- [web-ext Documentation](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)
- [Vite Documentation](https://vitejs.dev/)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Template Inheritance Guide](./template-inheritance.md)
- [extn GitHub Repository](https://github.com/razukc/extn)
