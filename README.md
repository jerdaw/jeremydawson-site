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

The Astro config is set up for static output and GitHub Pages-friendly base handling.

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

### Remaining manual items

The remaining launch tasks are tracked in `ROADMAP.md`.
