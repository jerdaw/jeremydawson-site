# Site Roadmap

## Current Status

Phase: `Launch preparation`

Implemented:

- New Astro one-page site with typed content model
- Original design system and motion layer
- GitHub Pages deployment workflow
- Static `404.html` output
- Public email, GitHub, and live project links wired into site content

## Immediate Launch Tasks

Status key:

- `done`
- `pending`
- `optional`

### P0

- `done` Publish this `site/` directory as its own GitHub repository.
- `done` Enable GitHub Pages in that repository and set the source to `GitHub Actions`.
- `done` Confirm the Pages deployment URL and smoke-test the live site after first deploy.

### P1

- `pending` Add a verified public LinkedIn URL to `src/data/profile.ts` and expose it in the contact section.
- `optional` Add `public/resume.pdf` and a corresponding contact link if a downloadable resume should be public.

### P2

- `optional` Replace current project-summary copy with final launch copy once the live URLs and positioning are fully settled.
- `optional` Add custom domain support if the site should move off the default GitHub Pages URL.
- `optional` Add social preview image and richer Open Graph metadata for sharing.

## Notes

- Live URL: `https://jerdaw.github.io/`
- LinkedIn remains intentionally absent until a verified public URL is confirmed.
- Resume download remains intentionally absent until a public-safe PDF is chosen.
- The current implementation is otherwise in a shippable state and passes `npm run check` and `npm run build`.
