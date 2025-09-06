# Sheet Blurring

Create blurred versions of sheet thumbnails to hide sensitive details while keeping overall layout context. Butler Sheet Icons (BSI) can blur selected sheets using flexible filters and a configurable blur intensity.

- Works with both Qlik Sense Cloud and Qlik Sense Enterprise on Windows (QSEoW).
- Blurred images are generated for all sheets and saved to disk alongside regular thumbnails. If a sheet matches any blur filter, its blurred image is set as the sheet icon.

## When to use blurring

Consider blurring when:

- Thumbnails may reveal sensitive data (financials, PII, etc.).
- You want to visually differentiate public/published vs. private/development sheets.
- You need to obscure details but still show the general layout/structure.

## What sheets to blur

Filters mirror the exclusion options but use the `--blur-sheet-...` prefix. You can combine multiple filters; they’re additive.

Available in QS Cloud and QSEoW:

- `--blur-sheet-number <numbers...>`
  Blur by position in the app (1 = first sheet). Example: `--blur-sheet-number 1 3 5`.
- `--blur-sheet-title <titles...>`
  Blur by exact sheet title. Titles with spaces must be quoted.
- `--blur-sheet-status <status...>`
  Blur by status. Valid values: `public`, `published`.

QSEoW only:

- `--blur-sheet-tag <value...>`
  Blur sheets that have one or more specified tags (set in QMC > App objects). Tags don’t exist for individual sheets in QS Cloud.

## Blur intensity

Control blur strength with `--blur-factor <factor>`.

- Range: 0 = no blur … 1000 = full blur.
- CLI help shows default: 10. Choose a value that balances privacy with recognizability.

### Blur effect examples

| Blur Factor | Result                                                           |
| ----------- | ---------------------------------------------------------------- |
| 0           | ![No blur](/images/blur-factor-0.png "No blur applied")          |
| 5           | ![Light blur](/images/blur-factor-5.png "Light blur applied")    |
| 10          | ![Medium blur](/images/blur-factor-10.png "Medium blur applied") |

## Examples

### QSEoW (client-managed)

Blur specific sheets by number and title, and set a blur factor:

::: code-group

```bash [Bash]
butler-sheet-icons qseow create-sheet-thumbnails \
  --host <server> \
  --appid <app-id> \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir <dir> \
  --logonuserid <user> \
  --logonpwd <pwd> \
  --prefix form \
  --blur-sheet-number 2 4 \
  --blur-sheet-title "Financial Dashboard" \
  --blur-factor 5 \
  --sense-version 2024-May
```

```powershell [PowerShell]
butler-sheet-icons qseow create-sheet-thumbnails `
  --host <server> `
  --appid <app-id> `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --logonuserdir <dir> `
  --logonuserid <user> `
  --logonpwd <pwd> `
  --prefix form `
  --blur-sheet-number 2 4 `
  --blur-sheet-title "Financial Dashboard" `
  --blur-factor 5 `
  --sense-version 2024-May
```

:::

Tip: Use tags in QSEoW to target sheets, then pass `--blur-sheet-tag "🔒 Contains sensitive data"`.

### QS Cloud

When updating a published app, you can blur all published (and/or public) sheets:

::: code-group

```bash [Bash]
butler-sheet-icons qscloud create-sheet-thumbnails \
  --tenanturl <tenant> \
  --apikey <api-key> \
  --logonuserid <user> \
  --logonpwd <pwd> \
  --appid <app-id> \
  --blur-sheet-status published \
  --blur-sheet-number 1 \
  --blur-factor 5
```

```powershell [PowerShell]
butler-sheet-icons qscloud create-sheet-thumbnails `
  --tenanturl <tenant> `
  --apikey <api-key> `
  --logonuserid <user> `
  --logonpwd <pwd> `
  --appid <app-id> `
  --blur-sheet-status published `
  --blur-sheet-number 1 `
  --blur-factor 5
```

:::

## Files on disk

- BSI captures screenshots and stores thumbnails per app and platform (Cloud/QSEoW).
- Blurred images are saved with a `-blurred` suffix next to the regular thumbnails.

## Related

- Sheet exclusion: See [Sheet Exclusion](/guide/concepts/sheet-exclusion) for analogous exclude filters and status nuances.
- How it works: See [How it works](/guide/concepts/how-it-works) for an overview of screenshotting and when blurred images get applied.
