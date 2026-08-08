# Ticket 004: Belt Colors and Meanings View

**Type**: `wayfinder:prototype` (HITL)
**Assignee**: @Antigravity
**Status**: closed

## Question

How should the Belt Colors view be designed and styled, featuring belt rank cards, visual gradient/stripe belt badges, Korean terminology, and depth explanations of color symbolism?

## Blocking

- Blocks: None
- Blocked by: [Ticket 003: Navigation Bar and Layout Shell](file:///c:/git/tagb/wayfinder/tickets/003-navigation-bar-and-layout-shell.md)

## Resolution

- **Decision**: Used the Grid Cards layout variant for the permanent view.
- **Domain Constraint**: TAGB Taekwondo does not assign separate meanings to stripe belts (e.g. Yellow Tag, Green Tag), so the `BeltsView` filters out any belts with a `stripeHex`. It only displays the 6 full colors (White, Yellow, Green, Blue, Red, Black).
- **Implementation**: Created `views/BeltsView.js` with permanent CSS in `index.css`. The router mounts this cleanly via `app.js`.
