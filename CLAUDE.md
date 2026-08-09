# Butler Sheet Icons documentation site

VitePress site for [Butler Sheet Icons](https://github.com/ptarmiganlabs/butler-sheet-icons) (BSI),
published at <https://butler-sheet-icons.ptarmiganlabs.com>.

## Branch rule

**All work goes to `next`.** Branch off an up-to-date `next`, PR into `next`.

`main` is production — it is what the public site serves, and Cloudflare Pages publishes it
automatically within minutes of a merge. It is reached only by merging `next` at BSI release time,
which is a separate maintenance step documented in [README_DEPLOY.md](./README_DEPLOY.md).

Writing to `main` directly is a deliberate production hotfix, not a normal option. Do not choose
it without being asked to.

One narrow exception: GitHub reads the pull request template and the issue templates under
`.github/` **only from the default branch**, so a change to those has no effect until it is on
`main` and targets `main` directly. This does not extend to anything under `docs/` — that is site
content and always goes to `next`.

A repository ruleset requires a pull request for `main` and rejects direct and force pushes. No
approvals are required.

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

## Verify before reporting done

```bash
npm run docs:build
```

Fails on dead internal links, so a passing build proves every internal link resolves. It does
**not** validate `#anchor` fragments — check those against the generated HTML in
`docs/.vitepress/dist/`.

## Deployment

Cloudflare Pages, project `butler-sheet-icons-docs`. There is no deploy script and no deploying
GitHub Actions workflow; `.github/workflows/build.yml` only validates the build. Full details,
including the environment variables and the settings that live only in the Cloudflare dashboard,
are in [README_DEPLOY.md](./README_DEPLOY.md).
