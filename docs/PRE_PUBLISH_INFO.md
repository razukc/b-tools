# Pre-Publish Information Gathering

Please provide the following information before we proceed with the first publish.

## 1. npm Account Information

**Do you have an npm account?**
- [x] Yes
- [ ] No (create one at https://www.npmjs.com/signup)

**Your npm username:**
```
razukc
```

**Is the package name `extn` available?**
Check: https://www.npmjs.com/package/extn
- [x] Available (404 error = available)
- [ ] Taken (need to choose different name)

If taken, alternative names:
```
Option 1: @razukc/extn (scoped package)
Option 2: _______________
```

---

## 2. GitHub Token

**Do you have a GitHub personal access token?**
- [x] Yes, and it has `repo` scope
- [ ] Yes, but need to check scopes
- [ ] No, need to create one

**If you need to create a token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `extn-releases`
4. Select scope: `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)

**Your token (keep this secure!):**
```
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
```

---

## 3. Repository Information

**GitHub repository status:**
- [x] Repository `razukc/extn` exists
- [x] Repository is public
- [ ] Repository is private
- [ ] Repository doesn't exist yet (need to create)

**Repository URL:**
```
https://github.com/razukc/extn
```

Is this correct?
- [x] Yes
- [ ] No, correct URL: _______________

---

## 4. Package Metadata Review

Current settings in `package.json`:

| Field | Current Value | Correct? | New Value (if incorrect) |
|-------|---------------|----------|--------------------------|
| name | `extn` | [x] Yes [ ] No | |
| version | `0.1.0` | [x] Yes [ ] No | |
| description | `CLI for building Chrome extensions` | [x] Yes [ ] No | |
| author | `razukc` | [x] Yes [ ] No | |
| license | `MIT` | [x] Yes [ ] No | |
| repository | `https://github.com/razukc/extn.git` | [x] Yes [ ] No | |

---

## 5. First Release Version

**What version should the first release be?**
- [x] `0.1.0` (current, beta/preview release)
- [ ] `1.0.0` (stable, production-ready release)
- [ ] Other: _______________

**Reasoning:**
- Use `0.x.x` for beta/preview releases (API may change)
- Use `1.0.0` for stable, production-ready releases (API is stable)

---

## 6. Release Timing

**When do you want to publish?**
- [x] Right now (after completing checklist)
- [ ] After specific changes: _______________
- [ ] Specific date: _______________

---

## 7. Current Status Check

**Code status:**
- [x] All features implemented
- [x] All tests passing
- [x] Documentation complete
- [x] Ready for users

**Git status:**
- [x] All changes committed
- [x] Working directory clean
- [x] On main branch
- [x] Pushed to GitHub

**Build status:**
- [x] Project builds successfully
- [x] CLI works locally
- [x] No TypeScript errors
- [x] No linting errors

---

## 8. Post-Publish Plans

**After publishing, will you:**
- [x] Announce on social media
- [x] Share in communities (which ones?): X.com
- [x] Update personal website/portfolio
- [x] Write a blog post
- [x] Just make it available

---

## Summary

Once you've filled out this information, we can proceed with:

1. **Immediate actions needed:**
   - [x] Create npm account (if needed)
   - [x] Create GitHub token (if needed)
   - [x] Create GitHub repository (if needed)
   - [x] Update package.json (if needed)
   - [x] Commit any pending changes

2. **Ready to proceed when:**
   - [x] All information above is complete
   - [x] All immediate actions are done
   - [x] You're ready to publish

---

## Next Steps

After completing this form:
1. Share the information with me
2. I'll help you complete any immediate actions
3. We'll work through the [First Publish Checklist](./FIRST_PUBLISH_CHECKLIST.md)
4. Execute the first release! 🚀

---

## Questions?

If you're unsure about any of these items, let me know and I can provide guidance:
- Package naming conventions
- Version numbering strategy
- GitHub token scopes
- npm account setup
- Anything else!
