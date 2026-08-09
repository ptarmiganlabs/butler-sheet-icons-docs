# Butler Sheet Icons documentation site

VitePress site for [Butler Sheet Icons](https://github.com/ptarmiganlabs/butler-sheet-icons) (BSI),
published at <https://butler-sheet-icons.ptarmiganlabs.com>.

## Branch rule

**All work goes to `next`.** It is the repository's default branch, so a fresh clone or worktree
already starts there. Branch off an up-to-date `next`, PR into `next`. There are no exceptions —
`.github/` templates and workflows included.

`main` is production — it is what the public site serves, and Cloudflare Pages publishes it
automatically within minutes of a merge. It is reached only by merging `next` at BSI release time,
which is a separate maintenance step documented in [README_DEPLOY.md](./README_DEPLOY.md).

Writing to `main` directly is a deliberate production hotfix, not a normal option. Do not choose
it without being asked to.

**Check your starting point before your first edit**, not before your first commit — editing a tree
that predates `next` produces content that duplicates or contradicts what is already there:

```bash
git fetch origin && git merge-base --is-ancestor origin/next HEAD || git rebase origin/next
```

A repository ruleset covers both `main` and `next`: pull requests are required, and direct and
force pushes are rejected. No approvals are required, so you can merge your own once checks pass.

## Where new documentation comes from

Most new content originates in the **BSI repo**, not here. Behaviour changes are staged there as
drafts:

| | |
| --- | --- |
| Staging folder | `docs/to-doc-site/` in `ptarmiganlabs/butler-sheet-icons` |
| Local clone | `/Users/goran/code/butler-sheet-icons` |
| Pending | Unprefixed `.md` files directly in that folder |
| Already processed | `done/` subfolder, files prefixed `done_` — ignore these |

**`docs/to-doc-site/README.md` in that repo is the authoritative workflow.** Read it before
processing anything. It covers reviewing drafts, verifying claims against the BSI source, version
gating, site structure, the build check, the `done_` move, and the report format. Those rules are
deliberately not repeated here — two copies would drift.

### Approval is per file

Processing drafts is **not** a bulk pass. Inventory every pending draft, present a table with a
publish/skip recommendation and target page(s) for each, then stop and wait.

No file is written, moved, or committed until that specific file has been approved. Approving one
file says nothing about the others — a general "yes" is not approval of the whole table.

### Reporting

After publishing, report per doc site page — which pages were created or edited on `next`, what
changed in each, and which draft it came from — not only per draft. That is what makes the change
reviewable without diffing the branch.

## Site conventions

- **Internal links are absolute and extensionless**: `/guide/concepts/browser-management`. Not
  relative, no `.md`. The build fails on dead links, so getting this wrong breaks CI.
- **Callouts**: `::: tip` / `::: warning` / `::: danger`, closed with `:::`.
- **Per-shell examples** use `::: code-group` with ` ```powershell [PowerShell] ` and
  ` ```bash [Bash] ` fences. Always give both.
- **Images** live in `docs/public/images/` and are referenced as `/images/file.png`.
- **A new page needs a sidebar entry** in `docs/.vitepress/config.js`. Without one it is reachable
  only by search.
- Write for **Qlik Sense administrators**, not Node.js developers.

## Testing the site locally

You can run the site and look at it yourself. Do this whenever a change is visual, structural, or
worth seeing rendered — do not ask the user to check something you can check.

```bash
npm run docs:dev
```

The server runs until stopped, so start it in the background. Then open the URL printed at the end
of its output in a browser and navigate the site as a reader would.

**Read the port from that output — do not assume 5173.** VitePress falls back to 5174, 5175 and so
on whenever the port is already taken, which happens often:

```
  ➜  Local:   http://localhost:5174/
```

Two things about the dev server that will otherwise waste your time:

- **`curl` cannot see page content.** The dev server returns an empty SPA shell and renders
  everything client-side, so `curl … | grep 'my new heading'` finds nothing even when the page is
  perfectly fine. Use a real browser. If you want HTML you can grep, run `npm run docs:build` and
  read `docs/.vitepress/dist/` instead.
- **`Failed to resolve dependency: debug, present in 'optimizeDeps.include'` is expected noise.**
  It appears on most starts and the server works regardless. Do not chase it.

Stop the server when you are done.

## Always give the user the Cloudflare preview URL

Every branch pushed to GitHub is built by Cloudflare Pages and published to its own URL. **Include
that URL whenever you report work on a branch.** It is how the user reviews rendered output without
checking anything out, and it works from any device.

Read it from the Cloudflare Pages check run rather than constructing it:

```bash
sha=$(gh pr view <PR> --repo ptarmiganlabs/butler-sheet-icons-docs --json headRefOid --jq '.headRefOid')
gh api repos/ptarmiganlabs/butler-sheet-icons-docs/commits/$sha/check-runs \
  --jq '.check_runs[]|select(.name|test("Cloudflare"))|.output.summary'
```

That output contains two URLs. Give the **branch alias** — it follows the branch as you push more
commits. The other is pinned to a single commit (an 8-hex-character prefix); use it only when you
deliberately want a link that will not move.

**Do not assume the alias is the branch name.** Cloudflare lowercases it, replaces every
non-alphanumeric character with `-`, and **truncates to 28 characters**:

| Branch | Alias |
| --- | --- |
| `next` | `next.butler-sheet-icons-docs.pages.dev` |
| `docs/exit-code-reflects-failures` | `docs-exit-code-reflects-fail.butler-sheet-icons-docs.pages.dev` |
| `docs/local-testing-instructions` | `docs-local-testing-instructi.butler-sheet-icons-docs.pages.dev` |

Branch names over 28 characters are cut mid-word, so a guessed URL 404s. Read it from the check run.

Two things to mention alongside the link when they apply:

- The build takes a minute or two after a push, so a URL given immediately may 404 briefly.
- A branch with no rendered changes — one that only touches `CLAUDE.md`, workflows or other
  repository files — has nothing to look at. Say so rather than sending the user to an identical
  page.

## Verify before reporting done

```bash
npm run docs:build
```

Fails on dead internal links, so a passing build proves every internal link resolves. It does
**not** validate `#anchor` fragments — check those against the generated HTML in
`docs/.vitepress/dist/`, e.g. `grep -o 'id="[^"]*"' docs/.vitepress/dist/reference/commands.html`.

## Deployment

Cloudflare Pages, project `butler-sheet-icons-docs`. There is no deploy script and no deploying
GitHub Actions workflow; `.github/workflows/build.yml` only validates the build. Full details,
including the environment variables and the settings that live only in the Cloudflare dashboard,
are in [README_DEPLOY.md](./README_DEPLOY.md).
