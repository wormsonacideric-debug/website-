# WOA scene publishing workflow

Status: specification only; not deployed.

## Canonical structure
- The story has 17 chapters.
- Chapter 1 currently has seven published scenes.
- The live website is the public reference for approved scene content.
- The story GPT and image GPT submit approved content independently, using one stable scene key such as `chapter-01-scene-08`.

## Lifecycle
1. Accept text and artwork independently.
2. Match both submissions to the same scene record and existing Trello card.
3. Wait until required content is present and approved.
4. Create or update a staging branch from `main`; never write directly to `main`.
5. Open a pull request and provide a rendered preview URL.
6. Require explicit human approval before merging.
7. Merge to `main`, wait for production deployment, and verify the public scene URL.
8. Update Trello with the live URL, PR/commit, asset paths and continuity notes.
9. Prepare X copy for `@wormsonacid` and `@ericonacid`; do not post automatically. Record exact post URLs after publication.

## Preview and deployment dependency
The repository is a static site with `index.html`, `story/scene-01.html` through `story/scene-07.html`, and a root `CNAME` containing `wormsonacid.com`. The default branch is `main`. No `.github` directory was found on `main`. GitHub Pages does not automatically provide a separate rendered preview for every pull request, so a preview host must be confirmed or provisioned before this workflow is enabled. Never point preview hosting at the production domain.

## Trello
Reuse existing scene cards; do not create duplicates. Each scene record should track text and artwork approval, repository paths, branch/PR, preview review, merge approval, deployment verification, live URL, continuity, X draft/status and actual post URLs.

## Safety
Keep the production branch protected. Never merge without explicit approval, overwrite approved content without a deliberate revision instruction, or publish to X automatically. Configure external Actions separately in both custom GPTs; one conversation's connected tools are not inherited by another.
