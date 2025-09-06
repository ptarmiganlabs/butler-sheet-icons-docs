# Sheet Exclusion

Exclude sheets when creating thumbnails to keep special-purpose sheets unchanged or to avoid permission errors. Butler Sheet Icons (BSI) supports several exclude filters that you can combine.

## Why exclude sheets?

- Special sheets (e.g., Intro, Help, Definitions) shouldn’t get miniatures of their layout.
- Your organization may require a fixed icon for the first sheet across all apps.
- In QS Cloud, published apps allow updating only private sheets. Excluding public/published sheets avoids access errors during updates of published apps.

## Exclusion options

Available in both QS Cloud and QSEoW:

- --exclude-sheet-number <numbers...>
  Exclude by position in the app (1 = first sheet).
- --exclude-sheet-title <titles...>
  Exclude by exact sheet title. Titles with spaces must be quoted.
- --exclude-sheet-status <status...>
  Exclude by status. Valid values: public, published, private.

QSEoW only:

- --exclude-sheet-tag <value...>
  Exclude sheets that have one or more specified tags (set in QMC > App objects). Tags don’t exist for individual sheets in QS Cloud.

Example parameters usage:

```bash
--exclude-sheet-number 3 7
--exclude-sheet-title "Intro" "Metrics definitions" Help
--exclude-sheet-status published private
```

Tip: Titles with spaces must be wrapped in quotes.

## Excluding sheets based on the sheet's status

Sheets can have different statuses, and how they are handled differs between QS Cloud and QSEoW:

| Platform | App state   | Sheets that can be updated by BSI |
| -------- | ----------- | --------------------------------- |
| QS Cloud | Published   | Private                           |
| QS Cloud | Unpublished | Public, Published, Private        |
| QSEoW    | Published   | Public, Published, Private        |
| QSEoW    | Unpublished | Public, Published, Private        |

Recommendations:

- When updating a published QS Cloud app, add `--exclude-sheet-status public published` to avoid access denied errors.
- In QSEoW you can update all sheet statuses; use `--exclude-sheet-status` only if you intentionally want to skip certain sheets.
- Hidden sheets are never updated by BSI on either platform.

## Examples

### QSEoW (client-managed)

Exclude by number, title, and tag in one run. Also shows common options for context.

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
  --includesheetpart 2 \
  --exclude-sheet-tag '❌excludeSheetThumbnailUpdate' \
  --exclude-sheet-title 'Intro' 'Definitions' 'Help' \
  --exclude-sheet-number 1 10 \
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
  --includesheetpart 2 `
  --exclude-sheet-tag '❌excludeSheetThumbnailUpdate' `
  --exclude-sheet-title 'Intro' 'Definitions' 'Help' `
  --exclude-sheet-number 1 10 `
  --sense-version 2024-May
```

:::

How to use tags (QSEoW):

1. Create a tag in QMC, for example ❌excludeSheetThumbnailUpdate.
2. Tag the sheets (App Objects) that should not be updated.
3. Pass --exclude-sheet-tag "❌excludeSheetThumbnailUpdate" when running BSI.

### QS Cloud

When updating a published app, only private sheets can be updated. Exclude public and published sheets to avoid access errors.

::: code-group

```bash [Bash]
butler-sheet-icons qscloud create-sheet-thumbnails \
  --tenanturl <tenant> \
  --apikey <api-key> \
  --logonuserid <user> \
  --logonpwd <pwd> \
  --appid <app-id> \
  --exclude-sheet-status public published \
  --exclude-sheet-title "Intro" \
  --exclude-sheet-number 2
```

```powershell [PowerShell]
butler-sheet-icons qscloud create-sheet-thumbnails `
  --tenanturl <tenant> `
  --apikey <api-key> `
  --logonuserid <user> `
  --logonpwd <pwd> `
  --appid <app-id> `
  --exclude-sheet-status public published `
  --exclude-sheet-title "Intro" `
  --exclude-sheet-number 2
```

:::

## Tips and troubleshooting

- Hidden sheets are never updated by BSI (both QS Cloud and QSEoW).
- If you get “Access denied” in QS Cloud on a published app, add --exclude-sheet-status public published to skip non-updatable sheets.
- Combine multiple exclude filters; they’re additive.
- For privacy without fully excluding, consider blurring instead (see below).

## Related

- Blurring sheet icons: Use the analogous --blur-sheet-... options with --blur-factor to obfuscate content while keeping layout cues.
- Which sheets can be updated: In QS Cloud, published apps only allow updating private sheets; QSEoW allows updating all sheet types.
