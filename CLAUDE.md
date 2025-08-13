# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension called "ふきだしくんエクスポート" (Fukidashi-kun Export) that extracts sticky note data from web pages and exports it to CSV format via clipboard.

## Architecture

- **manifest.json**: Chrome Extension Manifest V3 configuration
- **background.js**: Service worker containing the main export functionality
- **images/**: Extension icons (16x16, 48x48, 128x128 px)

The extension uses a single-click action that injects a content script to:
1. Find sticky note elements using CSS selectors (`g.sticky`)
2. Extract content, author name, vote count, and background color
3. Format data as CSV with proper escaping
4. Copy to clipboard with fallback support

## Key Components

### Data Extraction Selectors
- Sticky notes: `g.sticky`
- Content: `p.content`
- Author name: `.name dd`
- Vote count: `.voted dd`

### CSV Format
```
"内容","投稿者","いいね数","背景色"
```

### Error Handling
- Shows notifications for missing elements, export failures, and clipboard errors
- Fallback clipboard copying using `document.execCommand('copy')`
- Console logging for debugging

## Development Notes

This is a pure Chrome extension with no build process - files are loaded directly. Testing requires loading the extension in Chrome's developer mode and testing on pages with the expected sticky note DOM structure.