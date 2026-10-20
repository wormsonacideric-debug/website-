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
4. Create or update a staging branch from the latest `main`; never write directly to `main`.
5. Open a pull request and provide a rendered preview URL.
6. Require explicit human approval before merging.
7. Merge to `main`, wait for production deployment, and verify the public scene URL.
8. Update Trello with the live URL, PR/commit, asset paths and continuity notes.
9. Prepare X copy for `@wormsonacid` and `@ericonacid`; do not post automatically. Record exact post URLs after publication.

## GitHub-only preview plan
The production repository is `wormsonacideric-debug/website-`, with `main` as the default branch and a root `CNAME` for `wormsonacid.com`. No `.github/workflows` directory was found on `main`. A pull request alone does not provide a separate rendered GitHub Pages preview.

Use a separate GitHub Pages preview site/repository so preview deployment cannot replace production. One-time setup required:
- Create a separate repository, e.g. `website-preview`.
- Enable GitHub Pages for that repository, using its publishing workflow.
- Add a GitHub Actions workflow in the production repository to publish the proposed branch's site files to the preview repository/site, using a narrowly scoped secret.
- Keep preview URLs on the GitHub Pages project URL; never use the production custom domain.
- Only enable automated preview publishing after the target repository and credentials are explicitly configured and tested.

The current GitHub connector can work with existing repositories and branches but does not expose repository creation or Pages settings here, so those one-time settings cannot safely be completed from this connection. Until then, preview hosting is a blocker: do not claim a rendered preview exists and do not merge based on a source diff alone.

## Trello
Reuse existing scene cards; do not create duplicates. Each scene record should track text and artwork approval, repository paths, branch/PR, preview review, merge approval, deployment verification, live URL, continuity, X draft/status and actual post URLs.

## Safety
Keep production untouched until explicit approval. Never merge without explicit approval, overwrite approved content without a deliberate revision instruction, or publish to X automatically. Configure external Actions separately in both custom GPTs; one conversation's connected tools are not inherited by another.
