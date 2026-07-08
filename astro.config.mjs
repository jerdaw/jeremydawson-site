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
const site = process.env.SITE_URL ?? "https://jerdaw.github.io";
const base = normalizeBasePath(
  process.env.BASE_PATH ??
  (isGithubActions ? (isUserSiteRepo || !repoName ? "/" : `/${repoName}`) : "/"),
);

/**
 * @param {string} path
 */
function normalizeBasePath(path) {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}/`;
}

export default defineConfig({
  site,
  base,
  output: "static",
});
