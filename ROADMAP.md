# Site Roadmap

## Current Status

Phase: `Post-launch polish — visual motion layer active`

## What's Live

- Astro one-page site with typed content model (`src/data/profile.ts`)
- New "Watermelon-inspired" design system (dark teal, coral, warm cream; Montserrat + Open Sans)
- GitHub Pages deployment with custom domain `jeremydawson.ca`
- Full scroll-driven SVG timeline path animation:
  - Per-section bezier path with gradient color shifts (coral → teal → steel blue)
  - Ghost echo paths, stroke widening (2.5→12px), leading-edge dot, section transition nodes
  - About section: rainbow portal split (6 parallel lines through a glowing gateway)
  - Projects section: 5-path fan-out converging at the prism face
  - Research section: DSOTM-style glass prism with spectral ray dispersion
  - Contact section: rays converge at section boundary, terminus orb at page end
  - Full `prefers-reduced-motion` fallback
- Section text layered above SVG lines (z-index sandwich: bg → SVG → content)
- Fan paths paced to main line arc-length (not raw scroll position)
- Public email revealed on request (not in HTML source)
- Social preview image and Open Graph / Twitter metadata

## Remaining Tasks

Status key: `pending` · `optional`

### P1

- `pending` Add a verified public LinkedIn URL to `src/data/profile.ts` and expose it in the contact section.
- `optional` Add `public/resume.pdf` and a corresponding contact link if a downloadable resume should be public.

### Polish / Visual

- `optional` Per-section timeline timing fine-tuning as content evolves.
- `optional` Additional project or research entries as work becomes public.

## Notes

- Repository: `https://github.com/jerdaw/jeremydawson-site`
- Live URL: `https://jeremydawson.ca/`
- LinkedIn intentionally absent until a verified public URL is confirmed.
- Resume download intentionally absent until a public-safe PDF is ready.
- CI runs `npm run check` + `npm run build` on every push to `main`.
