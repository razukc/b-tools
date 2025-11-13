# Extension Behavior Guide

## What This Extension Does

This test extension demonstrates all core Chrome extension features:

### 1. Popup Interface
**Location**: Click extension icon in toolbar

**Features**:
- Displays extension name and welcome message
- Has a "Click Me" button
- Shows output when button is clicked
- Communicates with background service worker
- Reads from Chrome storage

**Expected Behavior**:
- Button click shows: "Button clicked! Extension is working."
- Sends message to background script
- Background increments a counter in storage
- Console logs the current count

### 2. Background Service Worker
**Location**: Runs in background (check chrome://extensions > service worker)

**Features**:
- Initializes when extension is installed
- Sets up Chrome storage with initial count of 0
- Listens for messages from popup and content scripts
- Tracks button clicks and increments counter
- Monitors tab updates

**Expected Console Output**:
```
Extension installed: install
Storage initialized
Message received: {action: 'buttonClicked'}
Tab updated: https://example.com
```

### 3. Content Script
**Location**: Injected into every webpage

**Features**:
- Logs when it loads on a page
- Shows a visual indicator "Extension Active" for 3 seconds
- Sends message to background when page loads
- Listens for messages from popup/background

**Expected Behavior**:
- Console log: "Content script loaded on: [URL]"
- Purple badge appears top-right for 3 seconds
- Sends pageLoaded message to background
- Console log: "Background response: [response]"

### 4. Chrome Storage
**Location**: Persistent storage managed by Chrome

**Features**:
- Stores a click counter
- Initialized to 0 on install
- Incremented each time popup button is clicked
- Accessible from popup and background

### 5. Permissions
**Declared Permissions**:
- `storage` - For chrome.storage.local API
- `tabs` - For monitoring tab updates

**Content Script Permissions**:
- Runs on `<all_urls>` (all websites)

## Testing Each Feature

### Test 1: Popup Functionality
1. Click extension icon
2. Click "Click Me" button
3. **Expected**: Output shows "Button clicked! Extension is working."
4. Open popup DevTools (right-click icon > Inspect popup)
5. **Expected**: Console shows "Current count: 0" (or higher)
6. **Expected**: Console shows "Response from background: {success: true, count: 1}"

### Test 2: Background Service Worker
1. Go to chrome://extensions
2. Click "service worker" link
3. **Expected**: Console shows "Extension installed: install"
4. **Expected**: Console shows "Storage initialized"
5. Click popup button
6. **Expected**: Console shows "Message received: {action: 'buttonClicked'}"
7. Navigate to a new page
8. **Expected**: Console shows "Tab updated: [URL]"

### Test 3: Content Script Injection
1. Navigate to any webpage (e.g., google.com)
2. **Expected**: Purple badge "Extension Active" appears top-right
3. **Expected**: Badge disappears after 3 seconds
4. Open page DevTools (F12)
5. **Expected**: Console shows "Content script loaded on: [URL]"
6. **Expected**: Console shows "Background response: {success: false, message: 'Unknown action'}"
   - (This is expected because background doesn't handle 'pageLoaded' action)

### Test 4: Storage Persistence
1. Click popup button 3 times
2. Close popup
3. Reopen popup
4. Check popup DevTools console
5. **Expected**: "Current count: 3" (or number of times clicked)

### Test 5: Cross-Component Communication
1. Open popup DevTools
2. Open background service worker DevTools
3. Open a webpage and its DevTools
4. Click popup button
5. **Expected**: Message flow visible in all three consoles:
   - Popup: Sends message
   - Background: Receives message, increments counter
   - Content: (Not involved in this flow)

## Visual Indicators

### Extension Icon
- Should appear in Chrome toolbar
- Default icon (16x16, 48x48, or 128x128 depending on display)
- Tooltip shows "manual-test-extension"

### Popup Window
- Width: ~300px (default)
- Height: Auto-sized to content
- Styled with CSS (purple theme)
- Clean, modern appearance

### Content Script Badge
- Position: Fixed, top-right (10px from edges)
- Color: Purple background (#667eea), white text
- Size: Auto-sized to text
- Duration: 3 seconds
- Z-index: 10000 (appears above most content)

## Console Messages Reference

### Popup Console
```javascript
Current count: 0
Response from background: {success: true, count: 1}
```

### Background Console
```javascript
Extension installed: install
Storage initialized
Message received: {action: 'buttonClicked'}
Message received: {action: 'pageLoaded', url: 'https://...'}
Tab updated: https://example.com
```

### Content Script Console (on webpage)
```javascript
Content script loaded on: https://example.com
Background response: {success: false, message: 'Unknown action'}
```

## Common Observations

### Normal Behavior
- Content script badge appears on every page load
- Background logs tab updates frequently
- Popup button always works
- Counter persists across popup opens/closes

### Expected "Errors" (Not Actually Errors)
- Content script gets `{success: false, message: 'Unknown action'}` response
  - This is expected because background doesn't handle 'pageLoaded' action
  - It's just demonstrating message passing
- Build warning about `<script src="popup.js">` without type="module"
  - This is a Vite warning but doesn't affect functionality
  - The extension still works correctly

## Requirements Mapping

| Requirement | Feature | Test Method |
|-------------|---------|-------------|
| 9.1 | Extension loads without errors | Load in chrome://extensions |
| 9.2 | Manifest passes validation | Chrome accepts the extension |
| 9.3 | Popup displays correctly | Click icon, verify UI |
| 9.4 | Content script injects | Check console on any page |
| 9.5 | All files present | Verify dist/ structure |

## Success Criteria Checklist

- [ ] Extension loads in Chrome without errors
- [ ] Extension icon appears in toolbar
- [ ] Popup opens when icon is clicked
- [ ] Popup displays title and welcome message
- [ ] "Click Me" button works and shows output
- [ ] Content script logs message on page load
- [ ] Content script shows purple badge for 3 seconds
- [ ] Background service worker starts without errors
- [ ] Background logs installation message
- [ ] Background receives messages from popup
- [ ] Background increments counter in storage
- [ ] Background logs tab updates
- [ ] Storage persists across popup sessions
- [ ] All three components can communicate
- [ ] No critical errors in any console

## Troubleshooting Guide

### Issue: Content script badge doesn't appear
**Possible causes**:
- Page loaded before extension was installed
- Page has CSP that blocks inline styles
- Badge was removed too quickly (check timing)

**Solution**: Refresh the page after loading extension

### Issue: Background doesn't receive messages
**Possible causes**:
- Service worker is inactive
- Message format is incorrect

**Solution**: Click "service worker" link to activate it

### Issue: Storage count doesn't increment
**Possible causes**:
- Background message handler not working
- Storage API permissions issue

**Solution**: Check background console for errors

### Issue: Popup button doesn't work
**Possible causes**:
- JavaScript error in popup.js
- DOM not loaded before script runs

**Solution**: Check popup DevTools console for errors

---

**This guide helps you understand what to expect when testing the extension manually in Chrome.**
