# Ticket 002: Modularize Data Structure

**Type**: `wayfinder:task` (AFK)
**Assignee**: ant-agent
**Status**: closed

## Question

How should we refactor the data layer from a single monolithic `data.js` file into modularized files under `data/` (`vocabulary.js`, `belts.js`, `patterns.js`, `syllabus.js`) while maintaining backward compatibility for existing flashcards/quiz?

## Blocking

- Blocks: [Ticket 003: Navigation Bar and Layout Shell](file:///c:/git/tagb/wayfinder/tickets/003-navigation-bar-and-layout-shell.md)
- Blocked by: [Ticket 001: Research TAGB Curriculum Data](file:///c:/git/tagb/wayfinder/tickets/001-research-tagb-curriculum-data.md)

## Resolution

Successfully modularized data layer:
1. Created `data/vocabulary.js` (109 Flashcards).
2. Created `data/belts.js` (11 Belt Ranks & Color Symbolism entries).
3. Created `data/patterns.js` (11 Pattern Meanings, SVG diagrams, and metadata).
4. Created `data/syllabus.js` (10 Kup Rank Syllabus Requirements).
5. Refactored root `data.js` to re-export all module data cleanly.
6. Verified import compatibility via Node ES Module runner.
