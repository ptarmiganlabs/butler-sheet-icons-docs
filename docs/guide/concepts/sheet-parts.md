# Sheet Parts (--includesheetpart)

Choose exactly which parts of a Qlik Sense sheet should be captured for thumbnails and screenshots.

This applies to both Qlik Sense Cloud and Qlik Sense Enterprise on Windows (QSEoW) and is controlled with the `--includesheetpart` option.

## What the values mean

- `1` — Main sheet content only (no sheet title, no selection bar)
- `2` — Sheet content + the sheet title
- `3` — Sheet content + title + the current selections bar
- `4` — Full page, including the top menu/toolbar

Default: `1` (content only).

![Sheet Parts Example](/images/sheet-parts-example.png "Different sheet parts that can be captured")

## When to use each option

- Pick `1` when the visual content should dominate, and titles/selections would distract.
- Pick `2` when the sheet title adds useful context to the thumbnail.
- Pick `3` to include the current selections bar, helpful in demos and tutorials.
- Pick `4` for a complete page view, useful for documentation or audits.

Notes:

- If there are no active selections, the selection bar (part of option `3`) may not be visible.
- Very small browser windows can affect cropping; see Browser Management for sizing tips.

## Examples

### QS Cloud

::: code-group

```bash [Bash]
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl <tenant.eu.qlikcloud.com> \
  --apikey <api-key> \
  --logonuserid <user@company.com> \
  --logonpwd <password> \
  --appid <app-id> \
  --includesheetpart 2
```

```powershell [PowerShell]
butler-sheet-icons qscloud create-sheet-icons `
  --tenanturl <tenant.eu.qlikcloud.com> `
  --apikey <api-key> `
  --logonuserid <user@company.com> `
  --logonpwd <password> `
  --appid <app-id> `
  --includesheetpart 2
```

:::

### QSEoW

::: code-group

```bash [Bash]
butler-sheet-icons qseow create-sheet-thumbnails \
  --host <qlik-server.company.com> \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid <username> \
  --logonpwd <password> \
  --sense-version 2024-Nov \
  --appid <app-id> \
  --includesheetpart 3
```

```powershell [PowerShell]
butler-sheet-icons qseow create-sheet-thumbnails `
  --host <qlik-server.company.com> `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --logonuserdir Internal `
  --logonuserid <username> `
  --logonpwd <password> `
  --sense-version 2024-Nov `
  --appid <app-id> `
  --includesheetpart 3
```

:::

## See also

- QSEoW commands: [/reference/qseow](/reference/qseow)
- QS Cloud commands: [/reference/qscloud](/reference/qscloud)
- Browser management (for debugging and sizing): [/guide/concepts/browser-management](/guide/concepts/browser-management)
- How it works (architecture and flow): [/guide/concepts/how-it-works](/guide/concepts/how-it-works)
