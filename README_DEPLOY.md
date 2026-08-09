# Deployment (Butler Sheet Icons Docs)

How the documentation site is built, branched and published.
Audience: developers/maintainers.

## Hosting: Cloudflare Pages

The site is built and published by **Cloudflare Pages**, project `butler-sheet-icons-docs`.
The Cloudflare GitHub App is installed on this repository and watches it for new commits.

| | |
| --- | --- |
| Production URL | <https://butler-sheet-icons.ptarmiganlabs.com> |
| Cloudflare project | `butler-sheet-icons-docs` |
| Production branch | `main` |
| Preview URL pattern | `https://<branch>.butler-sheet-icons-docs.pages.dev` |
| Per-deployment URL | `https://<commit-hash>.butler-sheet-icons-docs.pages.dev` |

**There is no manual deploy step and no deploy script.** Push a commit, Cloudflare
builds it and publishes the result. A commit on `main` is live on the production
domain within a couple of minutes.

Cloudflare reports each build back to GitHub as a **"Cloudflare Pages" check run**, and
comments the preview URL on pull requests. That check is the authoritative answer to
"did my change deploy?".

> [!IMPORTANT]
> This repo is **not** deployed via GitHub Pages, despite what older revisions of these
> docs claimed. There is no `gh-pages` branch in use, no `npm run deploy` script, and no
> deploying GitHub Actions workflow. If you find a reference to GitHub Pages anywhere in
> this repository, it is a leftover and should be removed.

## Branch model

Two long-lived branches.

| Branch | Role | Published to |
| --- | --- | --- |
| `next` | Where **all** documentation work goes | Preview URL only |
| `main` | Production — what the public site serves | Production domain, publicly visible |

### Which branch does my change go to?

**`next`. Always.** Branch off an up-to-date `next`, PR into `next`. There is no decision
to make, and no exception — `.github/` templates and workflows included.

`next` is the repository's **default branch**, so a fresh clone or worktree already starts
there, GitHub reads the pull request and issue templates from it, and Dependabot targets
it. `main` is reached only by merging `next` at release time, per the procedure below.

The site is single-version: there is exactly one copy of the docs and no per-release
archive. So content merged to `main` is presented as documentation for the current
release, whatever it actually describes — and Cloudflare publishes it within minutes.
Routing everything through `next` means documentation cannot reach the public site ahead
of the release it describes, and removes a judgment call that only ever failed in that
one direction.

The cost is that a correction to an already-live page waits for the next release merge.
If something on production genuinely cannot wait, that is a deliberate hotfix branched
off `main` — an exception, not one of two normal options.

A repository ruleset covers **both** `main` and `next`: pull requests are required, and
direct and force pushes are rejected. No approvals are required, so you can merge your own
once checks pass.

> [!WARNING]
> **If you ever change the default branch again**, check the ruleset first. It lists
> `refs/heads/main` and `refs/heads/next` explicitly, but also carries the symbolic
> `~DEFAULT_BRANCH`, which **follows** whichever branch is default. Relying on that alone
> silently unprotects the branch you just demoted — which is exactly what happened when
> `next` was made default. Keep the explicit refs.

### At release time

Order matters, because the version label on production follows the **latest GitHub
release** of Butler Sheet Icons (see "Version label" below):

1. Release Butler Sheet Icons first, so `releases/latest` points at the new version.
2. Open a pull request from `next` into `main` and merge it. A repository ruleset
   requires a pull request for `main` — direct pushes and force pushes are rejected —
   though no approvals are required, so you can merge your own.
3. Cloudflare publishes; the nav label picks up the new version on that build.

There is no manual version step. The `next` preview reads its label from
release-please, and production reads the latest release, so both correct themselves.

Merging before the BSI release ships puts new content on the site under the *old*
version number for however long the gap lasts.

If a production hotfix ever lands directly on `main`, merge `main` back into `next`
afterwards so the fix is not lost at the next release merge.

## Build

| Setting | Value |
| --- | --- |
| Build command | `npm run docs:build` |
| Output directory | `docs/.vitepress/dist` |
| Node version | from `.nvmrc` (currently 24) |

`docs:build` runs `pre:version` first — see below — then `vitepress build`.

The VitePress build **fails on dead internal links**, so a successful build proves that
every internal link on the site resolves. It does *not* validate `#anchor` fragments.

`.github/workflows/build.yml` runs the same build on pull requests and on pushes to
`main` and `next`. It does not deploy anything; it exists so a broken build is caught as
a GitHub check rather than only as a failed Cloudflare deployment.

## Version label

The version shown in the site's top nav is **cosmetic**. It gates no content.

`scripts/fetch-bsi-version.mjs` runs before every dev/build and writes
`docs/.vitepress/version.js`. That file is git-ignored and regenerated on each build.
`docs/.vitepress/config.js` imports it and uses the string as a nav dropdown label.

Which version it picks depends on what is being built, because `main` and `next`
document different releases:

| Build | Source | Why |
| --- | --- | --- |
| Production (`main`) | Latest GitHub release, tag normalised (`butler-sheet-icons-v4.0.0` → `v4.0.0`) | Production documents the release that has shipped |
| Preview (any other branch) | The version in `.release-please-manifest.json` on release-please's release branch | `next` documents a release that is not out yet, so the latest release would label it with the *previous* version |
| Local (`npm run docs:dev`) | Latest GitHub release | `CF_PAGES_BRANCH` is unset outside Cloudflare |

**Do not try to set the upcoming version by hand.** It is not knowable in advance and
not stable once guessed: release-please recomputes the bump as commits land and retitles
the same pull request. A release tracking 3.12.0 became 4.0.0 that way when two breaking
changes arrived, after several pages had already been written against 3.12.0. Reading it
per build is what makes the label self-correcting.

Every lookup degrades rather than failing the build: pending version → latest release →
the previously generated `version.js` → `v0.0.0`.

Environment variables that affect this:

| Variable | Where | Effect |
| --- | --- | --- |
| `GITHUB_TOKEN` (or `GH_TOKEN`) | Cloudflare project, CI, local | Authenticates the API calls. **Recommended in Cloudflare.** Build IPs are shared, so the 60 req/hour anonymous limit is reachable; because `version.js` is git-ignored, a fresh build container has no previous file to fall back on and the nav silently renders `v0.0.0`. |
| `CF_PAGES_BRANCH` | Set by Cloudflare Pages | Read, not set by us. Decides production vs preview behaviour above. |
| `BSI_DOCS_VERSION` | Anywhere | **Escape hatch, normally unset.** Overrides everything and never falls back. Only useful to pin a label the automation cannot work out. A stale value here silently defeats the automation. |

## Settings that live in Cloudflare, not in this repo

These cannot be changed by editing files here. Check them in the Cloudflare dashboard
under Workers & Pages → `butler-sheet-icons-docs`:

- **Production branch** — must be `main`.
- **Preview deployments** — must include `next` (the default is all non-production branches). If set to "None", `next` gets no preview URL and the branch model has no staging site.
- **Environment variables** — `GITHUB_TOKEN` on production and preview. `BSI_DOCS_VERSION` should be **unset** on both; it is an escape hatch, and a leftover value silently overrides the automatic version label.
- **Custom domain** — `butler-sheet-icons.ptarmiganlabs.com` is attached here. It is *not* controlled by a `CNAME` file in the repo; that is a GitHub Pages mechanism and was removed.
- **Access policy on preview URLs** — preview deployments are publicly reachable by default. They are unlinked and not indexed, but guessable. If unreleased documentation must not be readable by anyone who finds the URL, put Cloudflare Access in front of preview deployments.

## Local development

```bash
npm install
npm run docs:dev
```

Serves at `http://localhost:5173` with hot reload. The version file is generated at
startup, not on every edit.

Build and preview the production output:

```bash
npm run docs:build && npm run docs:preview
```

Export `GITHUB_TOKEN` locally to avoid anonymous API rate limits on the version lookup.

## Troubleshooting

| Symptom | Cause / action |
| --- | --- |
| Nav shows `v0.0.0` | Version lookup failed and no cached file existed. Set `GITHUB_TOKEN` in the Cloudflare project. |
| Nav shows the wrong version on a `next` preview | Check the build log for the `[bsi-docs]` lines. They name the branch, whether it was treated as a preview, and which release PR was read. A stale `BSI_DOCS_VERSION` overriding everything is the most likely cause. |
| Change not live on production | Check the "Cloudflare Pages" check run on the commit. Confirm the commit is on `main`, not `next`. |
| Build fails on a dead link | VitePress names the offending file and link. Internal links are absolute and extensionless: `/guide/concepts/browser-management`. |
| Anchor link goes nowhere | Anchors are not build-validated. Several pages use a non-breaking hyphen `‑` (U+2011) in headings, which survives into the generated id. Normalise headings to ASCII hyphens. |
| Preview URL 404s for a branch | Preview deployments may be disabled for non-production branches in the Cloudflare project settings. |

## Maintenance

1. Keep devDependencies current (Renovate/Dependabot handle this).
2. If the upstream release tag naming changes, verify `scripts/fetch-bsi-version.mjs` still normalises it correctly.
3. Keep `.nvmrc` and `engines.node` in `package.json` in agreement.
