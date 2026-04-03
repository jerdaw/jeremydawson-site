# Site Roadmap

## Current Status

Phase: `Post-launch polish`

Implemented:

- New Astro one-page site with typed content model
- Original design system and motion layer
- GitHub Pages deployment workflow
- Static `404.html` output
- Public email, GitHub, and live project links wired into site content
- Production deployment on `jeremydawson.ca`
- Rewritten launch copy and richer social metadata

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

- `done` Replace placeholder launch copy with final positioning across hero, section framing, projects, research, contact, and footer.
- `done` Add a social preview image and richer Open Graph / Twitter metadata for sharing.

## Operational Follow-Up

- `done` Update the DNS zone for `jeremydawson.ca` so the custom domain resolves to GitHub Pages.
- `done` Confirm GitHub Pages reports `jeremydawson.ca` as the active domain and smoke-test both apex and `www`.

## Notes

- Repository URL: `https://github.com/jerdaw/jeremydawson-site`
- Current Pages URL: `https://jeremydawson.ca/`
- Intended canonical URL: `https://jeremydawson.ca/`
- LinkedIn remains intentionally absent until a verified public URL is confirmed.
- Resume download remains intentionally absent until a public-safe PDF is chosen.
- The current implementation is live and should continue to pass `npm run check` and `npm run build`.
