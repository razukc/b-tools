# Product Overview

extn is a TypeScript-based CLI for building Chrome extensions with modern tooling. It provides scaffolding, build pipelines, and development workflows for Manifest V3 Chrome extensions.

## Core Purpose

Simplify Chrome extension development by providing:
- Project scaffolding with sensible defaults
- TypeScript-first development experience
- Production-ready build pipeline
- Manifest V3 validation and generation
- Browser Preview workflow with auto-launch and HMR
- Template inheritance system for consistent features

## Key Commands

- `create <project-name>` - Scaffold new Chrome extension project
- `build` - Build extension for production with minification and packaging
- `dev` - Watch mode for development

## Philosophy

- **Minimal, Working, Production-Grade** - Focus on essential features with professional standards
- **TypeScript-first** - Type safety from day one
- **Convention over configuration** - Sensible defaults, minimal config files
- **Explicit over magic** - Clear, predictable behavior

## Current Status

Version 0.3.0 released with multiple template support. The project includes:
- Template inheritance system with base, vanilla, and react templates
- Browser Preview workflow with auto-launch Chrome and HMR
- Production-ready build pipeline with Vite
- TypeScript-first development experience

Future templates (Vue, Svelte) will inherit Browser Preview features automatically.
