# Changelog

All notable changes to this project will be documented in this file.

## [0.4.0](https://github.com/razukc/extn/compare/v0.3.0...v0.4.0) (2025-11-14)

### Features

* add Vue 3 template with TypeScript support ([fbbdfdd](https://github.com/razukc/extn/commit/fbbdfdd281aa845e7c73c95f6faad5593bafe072))
* upgrade React template to React 19 and latest dependencies ([029b8f8](https://github.com/razukc/extn/commit/029b8f8c1d755a5d399ee5d3947d2bc879ed0678))

### Documentation

* add React 19 upgrade specification and compatibility notes ([467e077](https://github.com/razukc/extn/commit/467e0775e4b43c2ff8695faff005dbbbe9839945))
* add steering-update spec ([4b9f425](https://github.com/razukc/extn/commit/4b9f425f2099c44282c8249be805339e0523ab69))
* add Vue template documentation ([42d38ca](https://github.com/razukc/extn/commit/42d38ca0f8e880bb5314fb2653c93fc6fc1d6101))
* add Vue template spec with requirements, design, and tasks ([e9c3af8](https://github.com/razukc/extn/commit/e9c3af838525bda23560ac9ab65fa8f9b6bc6643))
* update steering rules for Vue template support ([4b7e633](https://github.com/razukc/extn/commit/4b7e633f2a71c40d23c5ca8cf81ba6c476a5bdbb))

### Tests

* add comprehensive tests for Vue template ([8e1dd83](https://github.com/razukc/extn/commit/8e1dd830b3f032cc5fdcd8aa36dad3082afee298))
* update tests for React 19 dependency versions ([315a16a](https://github.com/razukc/extn/commit/315a16ad4c4648fbb7fd1b3d82f458e59247dd0c))

## [0.3.0](https://github.com/razukc/extn/compare/v0.2.2...v0.3.0) (2025-11-13)

### Features

* add React template with TypeScript support ([497c943](https://github.com/razukc/extn/commit/497c9434e43da0ef7d8bcb3a58005611528e7036))

## [0.2.2](https://github.com/razukc/extn/compare/v0.2.1...v0.2.2) (2025-11-13)

### Cleanup

* remove unused specs and references to 'b-tools'

## [0.2.1](https://github.com/razukc/extn/compare/v0.2.0...v0.2.1) (2025-11-13)

### Documentation

* add documentation files to repository ([0cf4c8b](https://github.com/razukc/extn/commit/0cf4c8bb3cdcef7a2e4746a58513e0b789403170))
* create comprehensive documentation audit for v0.2.1 ([9f6d6f4](https://github.com/razukc/extn/commit/9f6d6f4977daf38fa762532c58ef9320f38d0cb0))
* fix web-ext-config file extension references ([717716b](https://github.com/razukc/extn/commit/717716b51354fec1edd3429370305c231eaba0c5))
* remove references to persistent profile feature ([4ae6330](https://github.com/razukc/extn/commit/4ae6330356cf2c40e17d0dbcd81576cb17533323))

## [0.2.0](https://github.com/razukc/extn/compare/v0.1.3...v0.2.0) (2025-11-12)

### Features

* add Browser Preview workflow and template inheritance system ([a387dc1](https://github.com/razukc/extn/commit/a387dc161cb7572a0defe2707fe65f715f1843fb))

## [Unreleased]

### Documentation

- Removed references to persistent profile feature (`.dev-profile/`) which was not implemented
- Simplified Browser Preview documentation to focus on actual features
- Updated template files to remove profile-related content

### Planned for v0.2.1

- Fix `web-ext-config.js` → `web-ext-config.mjs` references throughout documentation
- Update directory structure diagrams to match actual generated projects
- Comprehensive documentation review and accuracy verification
- See `docs/reports/DOCUMENTATION_AUDIT_v0.2.1.md` for details

### Documentation

- Updated main README with Browser Preview workflow
- Added template inheritance architecture documentation (`docs/template-inheritance.md`)
- Added comprehensive troubleshooting guide (`docs/BROWSER_PREVIEW_TROUBLESHOOTING.md`)
- Enhanced troubleshooting section with browser-specific issues
- Added configuration examples for `web-ext-config.mjs`

## [0.1.3](https://github.com/razukc/extn/compare/v0.1.2...v0.1.3) (2025-11-10)

## [0.1.2](https://github.com/razukc/extn/compare/v0.1.1...v0.1.2) (2025-11-10)

### Bug Fixes

* add type="module" to popup.html script tag to resolve Vite bundling warning ([66bc8fb](https://github.com/razukc/extn/commit/66bc8fba8e6ff5be3b1f3d8d0dbdc44edb9c428e))

## 0.1.1 (2025-11-10)

## 0.1.1 (2025-11-10)

## [0.1.0] - 2024-01-01

### Features

- Initial release of extn
- Project scaffolding with `create` command
- Basic build pipeline with `build` command
- Manifest V3 validation
- TypeScript-first development experience
- Vanilla JavaScript template support
