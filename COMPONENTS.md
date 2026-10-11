# WORMS ON ACID — Reusable Website Components

**Canonical component source branch:** `prototype/story-card-reusable-panel`  
**Website integration target:** `site-v2` (separate work; not yet reconciled with these components)  
**Live-site rule:** prototypes only. Do not deploy or merge to the live site without explicit approval.

## Component register

| Component | Current prototype | Stylesheet | Trello record |
|---|---|---|---|
| Character card | [single-card-preview-v30.html](component-test/single-card-preview-v30.html) | [single-card-preview-v30.css](component-test/single-card-preview-v30.css) | [Reusable character card](https://trello.com/c/Eb73pKnJ/11-reusable-character-card-component-canonical-baseline) |
| Story card | [single-card-nine-slice-v32.html](component-test/single-card-nine-slice-v32.html) | [single-card-nine-slice-v32-typography.css](component-test/single-card-nine-slice-v32-typography.css) | [Reusable story card](https://trello.com/c/HP2GVZAW/12-reusable-story-card-component-nine-slice-parchment) |
| Game card — Early Birds | [single-card-game-early-birds-v33.html](component-test/single-card-game-early-birds-v33.html) | [single-card-game-early-birds-v33.css](component-test/single-card-game-early-birds-v33.css) | [Reusable Early Birds game card](https://trello.com/c/GIrMaTGA/13-reusable-game-card-component-early-birds) |
| List card — feature-list example | [single-card-game-features-v1.html](component-test/single-card-game-features-v1.html) | [single-card-game-features-v1.css](component-test/single-card-game-features-v1.css) | Trello card to be created/linked |

## Shared design rules

- Use the actual transparent parchment asset as a CSS nine-slice background; do not approximate it with gradients or clip-paths.
- Preserve the parchment's pinned corners and distressed edges as the content area grows.
- Reuse orientation modifiers where provided: square, slight left tilt, and slight right tilt.
- Use canonical WOA character artwork as supplied. Never regenerate or reconstruct canonical artwork.
- Approved type treatment is Kalam for card names/headings and body copy, with the approved subtle text treatment and responsive sizing. Keep each component's actual tested stylesheet as the implementation reference.
- The Early Birds title is baked into its supplied artwork. Do not add a duplicate title heading or replace the artwork with a different scene.
- The list card is a generic heading-plus-list panel. “Game features” is one example, not the component's category.
- Keep component prototypes distinct from integration. Verify mobile and desktop behaviour before integrating into `site-v2`; do not change the live site without explicit approval.

## Current status (2026-10-11)

All four standalone HTML/CSS prototypes are present on this branch. The components have not yet been fully integrated and verified in `site-v2`. Asset transfer and final integration validation remain separate tasks.
