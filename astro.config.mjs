// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const githubRepository = process.env.GITHUB_REPOSITORY ?? "";
const [repositoryOwner, repositoryName] = githubRepository.split("/");
const repoName = process.env.REPO_NAME ?? repositoryName ?? "";
const isUserSiteRepo =
  Boolean(repositoryOwner) &&
  repoName.toLowerCase() === `${repositoryOwner.toLowerCase()}.github.io`;
const site = process.env.SITE_URL ?? "https://example.com";
const base =
  process.env.BASE_PATH ??
  (isGithubActions ? (isUserSiteRepo || !repoName ? "/" : `/${repoName}`) : "/");

export default defineConfig({
  site,
  base,
  output: "static",
});
