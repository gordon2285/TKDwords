# Wayfinder Map: TAGB Taekwondo Reference & Training Hub

## Destination

Expand the site into a multi-section TAGB Taekwondo Reference & Training Hub with dedicated navigation views for:
1. Flashcards & Quiz (Vocabulary & Terminology)
2. Belt Colors & Meanings (Visual belt representations, Korean names, rank hierarchy, and color symbolism)
3. Pattern Meanings & Details (Tul history, move count, diagram line, starting stance, and key techniques)
4. Kup Grade Syllabus Guide (Grade-by-grade theory and grading requirement breakdowns from 10th Kup to 1st Kup)

## Notes

- Domain: TAGB (Taekwondo Association of Great Britain) curriculum and terminology.
- Tech stack: ES Modules, Vanilla JS, HTML5, Vanilla CSS, Google Fonts (Inter).
- Skills to consult: `/domain-modeling`, `/codebase-design`, `/research`, `/prototype`, `/tdd`.
- Architectural preference: Modular data files under `data/` (`vocabulary.js`, `belts.js`, `patterns.js`, `syllabus.js`).

## Decisions so far

- [Ticket 001: Research TAGB Curriculum Data](file:///c:/git/tagb/wayfinder/tickets/001-research-tagb-curriculum-data.md) — Gathered comprehensive TAGB belt color symbolism, pattern move counts, historical meanings, diagram shapes, and syllabus grade requirements.
- [Ticket 002: Modularize Data Structure](file:///c:/git/tagb/wayfinder/tickets/002-modularize-data-structure.md) — Created `data/` subfolder with `vocabulary.js`, `belts.js`, `patterns.js`, and `syllabus.js` while maintaining backward compatibility in `data.js`.
- [Ticket 003: Navigation Bar and Layout Shell](file:///c:/git/tagb/wayfinder/tickets/003-navigation-bar-and-layout-shell.md) — Extracted a Publish/Subscribe `Router` and class-based view lifecycle (`FlashcardsView`, `QuizView`) to establish a clean Top Navigation shell.
- UI Theme Update — Adopted the **Dojang Crimson** color scheme (charcoal and crimson red) replacing the default indigo, aligning with traditional martial arts aesthetics.
- [Ticket 004: Belt Colors and Meanings View](file:///c:/git/tagb/wayfinder/tickets/004-belt-colors-and-meanings-view.md) — Built the Belt Colors view using a Grid Card layout, excluding stripe belts since TAGB only assigns distinct color symbolism to full colors.
- [Ticket 005: Pattern Meanings and Details View](file:///c:/git/tagb/wayfinder/tickets/005-pattern-meanings-and-details-view.md) — Adopted the Compact Accordion variant.

## Open Frontier Tickets

1. [Ticket 006: Kup Grade Syllabus View](file:///c:/git/tagb/wayfinder/tickets/006-kup-grade-syllabus-view.md) (`wayfinder:prototype`, unblocked)

## Not yet specified

- Interactive quiz mode extensions (e.g. pattern meaning quiz questions, belt color quiz questions).
- Bookmarking / favorites feature for rapid revision before grading.
- Audio pronunciation clips or phonetic guide for Korean terminology.

## Out of scope

- Multi-user authentication, user accounts, or backend cloud databases (client-side web application only).
- Video playback streaming server hosting.
