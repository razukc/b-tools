# Chrome Extension Testing - Quick Start Guide

## 🚀 Quick Steps to Test in Chrome

### Step 1: Open Chrome Extensions Page
```
chrome://extensions
```

### Step 2: Enable Developer Mode
Toggle the switch in the top-right corner

### Step 3: Load the Extension
1. Click "Load unpacked"
2. Navigate to: `C:\Code\playground\temp-test\manual-test-extension\dist`
3. Click "Select Folder"

### Step 4: Test the Extension

#### ✅ Check Extension Icon
- Look for the extension icon in Chrome toolbar
- Click the puzzle piece icon if you don't see it
- Pin the extension for easy access

#### ✅ Test Popup
1. Click the extension icon
2. Verify popup opens with:
   - Title: "manual-test-extension"
   - Welcome message
   - "Click Me" button
3. Click the button and verify output appears

#### ✅ Test Content Script
1. Open any webpage (e.g., google.com)
2. Press F12 to open DevTools
3. Check Console for: "Content script loaded on: [URL]"

#### ✅ Test Service Worker
1. Go back to `chrome://extensions`
2. Find your extension
3. Click "service worker" link
4. Verify console shows:
   - "Background service worker installed"
   - "Background service worker activated"
   - No errors

## 📋 Expected Results

| Component | Expected Behavior |
|-----------|-------------------|
| **Extension Load** | Loads without errors, shows in extensions list |
| **Icon** | Appears in toolbar, shows tooltip on hover |
| **Popup** | Opens on click, displays content, button works |
| **Content Script** | Logs message on every page load |
| **Service Worker** | Runs in background, no errors |
| **Permissions** | Shows storage and tabs permissions |

## ✅ Success Criteria

All of the following should work:
- [x] Extension created with b-tools CLI
- [x] Dependencies installed (npm install)
- [x] Extension built (npm run build)
- [x] Build output verified
- [ ] Extension loads in Chrome
- [ ] Icon appears in toolbar
- [ ] Popup displays correctly
- [ ] Content script injects on pages
- [ ] Service worker runs without errors

## 🐛 Troubleshooting

**Extension won't load?**
- Make sure you selected the `dist` folder
- Check for errors in Chrome's extension page

**Popup won't open?**
- Right-click icon > "Inspect popup" to see errors
- Verify popup.html exists in dist/src/popup/

**Content script not working?**
- Refresh the webpage after loading extension
- Check browser console for errors

**Service worker errors?**
- Click "service worker" link to see detailed errors
- Check that background.js was built correctly

## 📁 Extension Location

```
C:\Code\playground\temp-test\manual-test-extension\dist
```

## 🔄 Reload Extension After Changes

1. Make changes to source code
2. Run `npm run build`
3. Go to `chrome://extensions`
4. Click reload icon (↻) on your extension

## 📊 Test Results

After testing, update `MANUAL_TEST_RESULTS.md` with your findings.

---

**Ready to test?** Open Chrome and follow Step 1 above! 🎉
