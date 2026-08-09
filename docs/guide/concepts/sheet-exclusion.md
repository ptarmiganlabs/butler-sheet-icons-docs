# Sheet Exclusion

Exclude sheets when creating thumbnails to keep special-purpose sheets unchanged or to avoid permission errors. Butler Sheet Icons (BSI) supports several exclude filters that you can combine.

## Why exclude sheets?

- Special sheets (e.g., Intro, Help, Definitions) shouldn’t get miniatures of their layout.
- Your organization may require a fixed icon for the first sheet across all apps.
- In QS Cloud, published apps allow updating only private sheets. Excluding public/published sheets avoids access errors during updates of published apps.

## Exclusion options

Available in both QS Cloud and QSEoW:

- --exclude-sheet-number <numbers...>
  Exclude by position in the app (1 = first sheet). See [How sheet numbers are decided](#how-sheet-numbers-are-decided).
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

## How sheet numbers are decided

`--exclude-sheet-number` and `--blur-sheet-number` refer to a sheet's position in the app, where 1 is the first sheet. That position comes from the sheets' display order in Qlik Sense, which Butler Sheet Icons reads from the engine before doing anything else.

::: warning Numbering can shift in apps with an incomplete sheet — BSI 3.12.0 or later
A sheet missing its layout data has no usable position, so it is placed **at the end** of the sheet list. In an app containing such a sheet, numbering can therefore differ from what you might expect.

In practice there is nothing to migrate: before BSI 3.12.0 those apps failed outright rather than being processed with different numbers. See [`TypeError: Cannot read properties of undefined (reading 'rank')`](/guide/troubleshooting#typeerror-cannot-read-properties-of-undefined-reading-rank) in Troubleshooting.

Apps whose sheets all have complete layout data are numbered exactly as before.
:::

If you rely on sheet numbers, check them in the log of a successful run before trusting them — Butler Sheet Icons names each sheet by number, title and ID as it processes it.

## Listing several sheet numbers

`--exclude-sheet-number` and `--blur-sheet-number` both take one or more whole numbers, separated by spaces, where 1 is the first sheet in the app:

```bash
--exclude-sheet-number 1 2 12
--blur-sheet-number 4 7
```

A value that is not a non-negative whole number is rejected before Butler Sheet Icons connects to Qlik Sense:

```
error: option '--exclude-sheet-number <number...>' argument 'abc' is invalid. Exclude sheet number must be a non-negative integer.
```

Each of these two options can also be set through an environment variable, but a variable holds **one** sheet number only — see [QSEoW reference](/reference/qseow#sheet-filtering) and [QS Cloud reference](/reference/qscloud#sheet-filtering). To select several sheets, use the command-line option.

::: warning Sheet numbers were matched incorrectly before BSI 3.12.0
In earlier versions `--exclude-sheet-number` and `--blur-sheet-number` selected the wrong sheets. Two faults combined:

- **Only the last number you listed was used.** `--exclude-sheet-number 3 7` behaved as though you had written `--exclude-sheet-number 7`, so sheet 3 was processed as normal.
- **Numbers were matched as text fragments rather than as whole sheet numbers.** `--exclude-sheet-number 12` also excluded sheets 1 and 2, and `--exclude-sheet-number 123` also excluded sheets 1, 2, 3, 12 and 23.

A single one-digit number, such as `--exclude-sheet-number 3`, was always handled correctly — no other sheet number hides inside "3".

No error or warning was produced and the run reported success, so there was nothing to notice at the time. If you use either option, see [Sheets you did not select were skipped or blurred](/guide/troubleshooting#sheets-you-did-not-select-were-skipped-or-blurred) for how to check what happened and what to re-run.

The other sheet filters — `--exclude-sheet-status`, `--exclude-sheet-tag`, `--exclude-sheet-title`, `--blur-sheet-status` and `--blur-sheet-title` — were never affected.
:::

## Excluding sheets based on the sheet's status

Sheets can have different statuses, and how they are handled differs between QS Cloud and QSEoW:

| Platform | App state   | Sheets that can be updated by BSI                                   |
| -------- | ----------- | ------------------------------------------------------------------- |
| QS Cloud | Published   | Private. See ["Access Denied" tip](#tips-and-troubleshooting) below |
| QS Cloud | Unpublished | Public, Published, Private                                          |
| QSEoW    | Published   | Public, Published, Private                                          |
| QSEoW    | Unpublished | Public, Published, Private                                          |

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
- If you get “Access denied” in QS Cloud on a published app, add `--exclude-sheet-status public published` to skip non-updatable sheets.
- Combine multiple exclude filters; they’re additive.
- For privacy without fully excluding, consider blurring instead (see below).

## Related

- Blurring sheet icons: Use the analogous --blur-sheet-... options with --blur-factor to obfuscate content while keeping layout cues.
- Which sheets can be updated: In QS Cloud, published apps only allow updating private sheets; QSEoW allows updating all sheet types.
