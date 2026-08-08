# Ticket 003: Navigation Bar and Layout Shell

**Type**: `wayfinder:prototype` (HITL)
**Assignee**: ant-agent
**Status**: closed

## Question

How should the main navigation header, responsive tab switching, and overall page container layout be updated to support seamless switching between all 5 main views (Flashcards, Quiz, Belt Colors, Patterns, Syllabus)?

## Blocking

- Blocks: [Ticket 004: Belt Colors View](file:///c:/git/tagb/wayfinder/tickets/004-belt-colors-and-meanings-view.md), [Ticket 005: Pattern Meanings View](file:///c:/git/tagb/wayfinder/tickets/005-pattern-meanings-and-details-view.md), [Ticket 006: Kup Grade Syllabus View](file:///c:/git/tagb/wayfinder/tickets/006-kup-grade-syllabus-view.md)
- Blocked by: [Ticket 002: Modularize Data Structure](file:///c:/git/tagb/wayfinder/tickets/002-modularize-data-structure.md)

## Resolution

Successfully implemented the navigation shell and deepened the architecture:
1. Created `core/Router.js` using a Publish/Subscribe pattern to manage global UI state.
2. Extracted monolithic `app.js` logic into `views/FlashcardsView.js` and `views/QuizView.js` implementing a clean `mount/update/unmount` lifecycle.
3. Updated `index.html` to establish the top-level tab navigation bar (`data-view` attributes) and an empty `<main id="app-content">` injection container.
4. Rewrote `app.js` as the controller to instantiate the Router, register views, bind navigation clicks, and mount/unmount views cleanly.
