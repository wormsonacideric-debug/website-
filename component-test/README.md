# WOA expandable panel test

This isolated page demonstrates the proposed reusable panel without changing the current homepage.

## Open it

Open `expandable-panel.html` in a browser from the repository checkout. It references the existing `assets/Card.png`, `assets/TextCard.png`, and `assets/Ericsawakening.png` files.

## What it tests

- Fixed upper scene with the existing frame artwork layered over it.
- Real, selectable HTML story text and a functional link.
- A parchment section whose height follows its content.
- A second taller example to compare expansion behaviour.
- Responsive adjustments for narrow screens.

## Important review points

This is a first integration prototype, not a finished homepage component. Confirm the crop of `Card.png` aligns with the transparent opening, and confirm `TextCard.png` tiles cleanly at the parchment edges. If those assets are not suitable as layered sources, use the original frame and produce purpose-built top/footer slices from it. Do not merge into the live homepage until desktop and mobile screenshots have been reviewed.
