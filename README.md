# Jeremy Dawson Personal Site

Static Astro portfolio scaffold for an original one-page professional site.

Current launch checklist: `ROADMAP.md`

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Content Editing

All main site content lives in `src/data/profile.ts`.

Before launch, add a public-facing `resume.pdf` to `public/` only if you want a downloadable resume linked from the site.

## Deployment

The Astro config is set up for static output and GitHub Pages deployment with `jeremydawson.ca` as the intended canonical URL.

- Local development defaults to `/`
- GitHub Actions derives the correct base path from the actual GitHub repository
- You can override with `SITE_URL` and `BASE_PATH`

### GitHub Pages

This repo includes a Pages workflow at `.github/workflows/deploy.yml`.

To use it:

1. Use this `site/` directory itself as the Git repository root for deployment.
2. In GitHub, enable Pages and set the source to `GitHub Actions`.
3. Keep the default branch as `main`, or update the workflow trigger if you use a different branch.

The build will automatically use `/` for a user or organization Pages repo such as `username.github.io`, and `/<repo-name>` for a project Pages repo.

### Custom Domain

This repo is configured for `jeremydawson.ca` via `public/CNAME`.

GitHub Pages will not serve that domain until DNS is pointed correctly. For an apex domain, configure the DNS zone with the standard GitHub Pages records:

- `A` records for `185.199.108.153`
- `A` records for `185.199.109.153`
- `A` records for `185.199.110.153`
- `A` records for `185.199.111.153`
- `AAAA` records for `2606:50c0:8000::153`
- `AAAA` records for `2606:50c0:8001::153`
- `AAAA` records for `2606:50c0:8002::153`
- `AAAA` records for `2606:50c0:8003::153`
- `CNAME` record for `www` pointing to `jerdaw.github.io`

### Remaining manual items

The remaining launch tasks are tracked in `ROADMAP.md`.
