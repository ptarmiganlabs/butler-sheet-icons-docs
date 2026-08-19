# QSEoW Commands

This page documents all Butler Sheet Icons commands specific to Qlik Sense Enterprise on Windows (QSEoW).

## create-sheet-thumbnails

Create thumbnail images for QSEoW applications.

```bash
butler-sheet-icons qseow create-sheet-thumbnails [options]
```

::: tip Getting a first run working
Add `-i` and Butler Sheet Icons asks for what it needs instead — 14 questions rather than 36 options, with the certificate paths and the content library checked as you give them, and the equivalent command line shown before anything runs. See [Interactive Mode](/guide/interactive-mode#creating-sheet-thumbnails).
:::

::: tip Check the plan first
Thumbnails are overwritten in place, with no undo. Add `--dry-run` to see exactly which apps and sheets would be touched — and which option is responsible for each decision — before anything is changed. See [Dry Runs](/guide/concepts/dry-run).
:::

### Options

Six options have no default and must be supplied: `--host`, `--apiuserdir`, `--apiuserid`, `--logonuserdir`, `--logonuserid` and `--logonpwd`. Everything else has a working default.

Pick apps with `--appid`, `--qliksensetag`, or both — see [Selecting apps](#selecting-apps) below.

<!-- generated:cli-options qseow create-sheet-thumbnails -->

| Option                                   | Environment Variable                   | Description                                                                                                                                                                                                                                                                                                                                                                   | Default                   | Example                                        |
| ---------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------- |
| `--log-level, --loglevel <level>`        | `BSI_LOG_LEVEL`                        | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                                                                                                                                                                 | `info`                    | `--loglevel error`                             |
| `--host <host>`                          | `BSI_QSEOW_CST_HOST`                   | Qlik Sense server IP/FQDN                                                                                                                                                                                                                                                                                                                                                     | **Required**              | `--host qlik-server.company.com`               |
| `--engineport <port>`                    | `BSI_QSEOW_CST_ENGINE_PORT`            | Qlik Sense server engine port                                                                                                                                                                                                                                                                                                                                                 | `4747`                    | `--engineport 4748`                            |
| `--qrsport <port>`                       | `BSI_QSEOW_CST_QRS_PORT`               | Qlik Sense server repository service (QRS) port                                                                                                                                                                                                                                                                                                                               | `4242`                    | `--qrsport 4243`                               |
| `--port <port>`                          | `BSI_QSEOW_CST_PORT`                   | Qlik Sense http/https port. 443 is default for https, 80 for http                                                                                                                                                                                                                                                                                                             | -                         | `--port 8443`                                  |
| `--schemaversion <version>`              | `BSI_QSEOW_CST_SCHEMA_VERSION`         | Qlik Sense engine schema version (choices: 12.170.2, 12.612.0, 12.936.0, 12.1306.0, 12.1477.0, 12.1657.0, 12.1823.0, 12.2015.0)                                                                                                                                                                                                                                               | `12.612.0`                | `--schemaversion 12.170.2`                     |
| `--certfile <file>`                      | `BSI_QSEOW_CST_CERT_FILE`              | Qlik Sense certificate file (exported from QMC)                                                                                                                                                                                                                                                                                                                               | `./cert/client.pem`       | `--certfile ./cert/client.pem`                 |
| `--certkeyfile <file>`                   | `BSI_QSEOW_CST_CERTKEY_FILE`           | Qlik Sense certificate key file (exported from QMC)                                                                                                                                                                                                                                                                                                                           | `./cert/client_key.pem`   | `--certkeyfile ./cert/client_key.pem`          |
| `--rejectUnauthorized <true\|false>`     | `BSI_QSEOW_CST_REJECT_UNAUTHORIZED`    | Ignore warnings when Sense certificate does not match the --host paramater                                                                                                                                                                                                                                                                                                    | `false`                   | `--rejectUnauthorized true`                    |
| `--secure <true\|false>`                 | `BSI_QSEOW_CST_SECURE`                 | Connection to Qlik Sense engine is via https                                                                                                                                                                                                                                                                                                                                  | `true`                    | `--secure false`                               |
| `--apiuserdir <directory>`               | `BSI_QSEOW_CST_API_USER_DIR`           | User directory for user to connect with when using Sense APIs                                                                                                                                                                                                                                                                                                                 | **Required**              | `--apiuserdir Internal`                        |
| `--apiuserid <userid>`                   | `BSI_QSEOW_CST_API_USER_ID`            | User ID for user to connect with when using Sense APIs                                                                                                                                                                                                                                                                                                                        | **Required**              | `--apiuserid sa_api`                           |
| `--logonuserdir <directory>`             | `BSI_QSEOW_CST_LOGON_USER_DIR`         | User directory for user to connect with when logging into web UI                                                                                                                                                                                                                                                                                                              | **Required**              | `--logonuserdir Internal`                      |
| `--logonuserid <userid>`                 | `BSI_QSEOW_CST_LOGON_USER_ID`          | User ID for user to connect with when logging into web UI                                                                                                                                                                                                                                                                                                                     | **Required**              | `--logonuserid goran`                          |
| `--logonpwd <password>`                  | `BSI_QSEOW_CST_LOGON_PWD`              | password for user to connect with                                                                                                                                                                                                                                                                                                                                             | **Required**              | `--logonpwd MyPassword`                        |
| `--appid <id...>`                        | `BSI_QSEOW_CST_APP_ID`                 | Qlik Sense app(s) whose sheet icons should be modified. Several ids can be given, separated by spaces or commas.<br>Combines with --qliksensetag rather than replacing it: apps named either way are all updated, each one once.                                                                                                                                              | -                         | `--appid a3e0f5d2-000a-464f-998d-33d333b175d7` |
| `--qliksensetag <value>`                 | `BSI_QSEOW_CST_QLIKSENSE_TAG`          | Used to control which Sense apps should have their sheets updated with new icons. All apps with this tag will be updated.                                                                                                                                                                                                                                                     | `""`                      | `--qliksensetag updateSheetThumbnails`         |
| `--prefix <prefix>`                      | `BSI_QSEOW_CST_PREFIX`                 | Qlik Sense virtual proxy prefix                                                                                                                                                                                                                                                                                                                                               | `""`                      | `--prefix form`                                |
| `--headless <true\|false>`               | `BSI_QSEOW_CST_HEADLESS`               | Headless (=not visible) browser (true, false)                                                                                                                                                                                                                                                                                                                                 | `true`                    | `--headless false`                             |
| `--pagewait <seconds>`                   | `BSI_QSEOW_CST_PAGE_WAIT`              | Number of seconds to wait after moving to a new sheet. Set this high enough so the sheet has time to render properly                                                                                                                                                                                                                                                          | `5`                       | `--pagewait 10`                                |
| `--imagedir <directory>`                 | `BSI_QSEOW_CST_IMAGE_DIR`              | Directory in which thumbnail images will be stored. Relative or absolute path                                                                                                                                                                                                                                                                                                 | `./img`                   | `--imagedir ./img`                             |
| `--capture-overview-after <true\|false>` | `BSI_QSEOW_CST_CAPTURE_OVERVIEW_AFTER` | Capture a second screenshot of the app overview after the thumbnails have been applied, showing the result rather than the starting state. Costs one extra browser login per app                                                                                                                                                                                              | `true`                    | -                                              |
| `--contentlibrary <library-name>`        | `BSI_QSEOW_CST_CONTENT_LIBRARY`        | Qlik Sense content library to which thumbnails will be uploaded                                                                                                                                                                                                                                                                                                               | `Butler sheet thumbnails` | `--contentlibrary "Butler sheet thumbnails"`   |
| `--includesheetpart <value>`             | `BSI_QSEOW_CST_INCLUDE_SHEET_PART`     | Which part of sheets should be used to take screenshots. 1=object area only, 2=1 + sheet title, 3=2 + selection bar, 4=3 + menu bar (choices: 1, 2, 3, 4)                                                                                                                                                                                                                     | `1`                       | `--includesheetpart 2`                         |
| `--exclude-sheet-status <status...>`     | `BSI_QSEOW_CST_EXCLUDE_SHEET_STATUS`   | Exclude all sheets with specified status(es) (choices: private, published, public)                                                                                                                                                                                                                                                                                            | -                         | `--exclude-sheet-status private`               |
| `--exclude-sheet-tag <value...>`         | `BSI_QSEOW_CST_EXCLUDE_SHEET_TAG`      | Sheets with one or more of these tags set will be excluded from sheet icon update.                                                                                                                                                                                                                                                                                            | -                         | `--exclude-sheet-tag excludeFromUpdate`        |
| `--exclude-sheet-number <number...>`     | `BSI_QSEOW_CST_EXCLUDE_SHEET_NUMBER`   | Sheet numbers (1=first sheet in an app) that will be excluded from sheet icon update.                                                                                                                                                                                                                                                                                         | -                         | `--exclude-sheet-number 1 2`                   |
| `--exclude-sheet-title <title...>`       | `BSI_QSEOW_CST_EXCLUDE_SHEET_TITLE`    | Use sheet titles to control which sheets that will be excluded from sheet icon update.                                                                                                                                                                                                                                                                                        | -                         | `--exclude-sheet-title Intro Help`             |
| `--blur-sheet-status <status...>`        | `BSI_QSEOW_CST_BLUR_SHEET_STATUS`      | Blur all sheets with specified status(es) (choices: published, public)                                                                                                                                                                                                                                                                                                        | -                         | `--blur-sheet-status published`                |
| `--blur-sheet-tag <value...>`            | `BSI_QSEOW_CST_BLUR_SHEET_TAG`         | Sheets with one or more of these tags set will be blurred in the sheet icon update.                                                                                                                                                                                                                                                                                           | -                         | `--blur-sheet-tag sensitive`                   |
| `--blur-sheet-number <number...>`        | `BSI_QSEOW_CST_BLUR_SHEET_NUMBER`      | Sheet numbers (1=first sheet in an app) that will be blurred in the sheet icon update.                                                                                                                                                                                                                                                                                        | -                         | `--blur-sheet-number 3 5`                      |
| `--blur-sheet-title <title...>`          | `BSI_QSEOW_CST_BLUR_SHEET_TITLE`       | Sheets with this title will be blurred in the sheet icon update.                                                                                                                                                                                                                                                                                                              | -                         | `--blur-sheet-title "Financial Data"`          |
| `--blur-factor <factor>`                 | `BSI_QSEOW_CST_BLUR_FACTOR`            | Factor to blur the sheets with. 0 = no blur, 100 = full blur.                                                                                                                                                                                                                                                                                                                 | `5`                       | `--blur-factor 10`                             |
| `--sense-version <version>`              | `BSI_QSEOW_CST_SENSE_VERSION`          | Version of the QSEoW server to connect to (choices: pre-2022-Nov, 2022-Nov, 2023-Feb, 2023-May, 2023-Aug, 2023-Nov, 2024-Feb, 2024-May, 2024-Nov, 2025-May, 2025-Nov, 2026-May)                                                                                                                                                                                               | `2026-May`                | `--sense-version pre-2022-Nov`                 |
| `--browser <browser>`                    | `BSI_QSEOW_CST_BROWSER`                | Browser used to render sheets. Chrome only. (choices: chrome)                                                                                                                                                                                                                                                                                                                 | `chrome`                  | `--browser chrome`                             |
| `--browser-version <version>`            | `BSI_QSEOW_CST_BROWSER_VERSION`        | Browser build to use. Either a keyword - "recommended" for the build Butler Sheet Icons is tested with, "stable" for the newest stable release, or a release channel such as "beta" - or an exact version: a milestone ("151"), a build prefix ("151.0.7922") or a full build id ("151.0.7922.77"). Use "butler-sheet-icons browser list-available" to see what is available. | `recommended`             | `--browser-version stable`                     |
| `--browser-page-timeout <seconds>`       | `BSI_BROWSER_PAGE_TIMEOUT`             | Timeout (seconds) for the browser to load a page. Default is 90 seconds. This is the time that the browser will wait for a page to load before giving up.                                                                                                                                                                                                                     | `90`                      | `--browser-page-timeout 120`                   |
| `--browser-cache-dir <directory>`        | `BSI_BROWSER_CACHE_DIR`                | Directory where Butler Sheet Icons keeps downloaded browsers. Defaults to a "browser-cache" folder next to the Butler Sheet Icons executable for standalone builds, and to the .cache/puppeteer folder in the current user's home directory otherwise.                                                                                                                        | -                         | `--browser-cache-dir D:\qlik\browsers`         |
| `--browser-executable-path <path>`       | `BSI_BROWSER_EXECUTABLE_PATH`          | Full path to a browser executable to use, for example a Microsoft Edge or Google Chrome already installed on this machine. Butler Sheet Icons then neither downloads nor manages a browser. Takes precedence over PUPPETEER_EXECUTABLE_PATH. If the file does not exist the run stops rather than downloading a browser instead.                                              | -                         | -                                              |
| `-i, --interactive`                      | -                                      | Answer questions instead of assembling a command line.<br>Options already supplied - here or through their BSI\_\* environment variables - are kept and not asked about again.                                                                                                                                                                                                | -                         | -                                              |
| `--dry-run`                              | -                                      | Perform every read and decision the real run would - connect, resolve apps, list sheets, apply every exclude and blur rule - but change nothing. Prints the per-sheet plan and exits.                                                                                                                                                                                         | -                         | -                                              |
| `-h, --help`                             | -                                      | display help for command                                                                                                                                                                                                                                                                                                                                                      | -                         | `-h`                                           |

<!-- /generated:cli-options -->

::: tip Every option can be set as an environment variable
The `BSI_QSEOW_CST_*` names in the table above are interchangeable with the flags, which is usually the better choice for credentials in a scheduled task. See [Environment Variables](/guide/concepts/environment-variables).
:::

::: tip Names with punctuation
`--qliksensetag`, `--exclude-sheet-tag` and `--contentlibrary` accept names containing `&`, `'`, `#`, `?`, `/` and `%` from BSI 4.0.0 onward — `R&D` or `Q1'25` need no special quoting beyond the usual for spaces. Earlier versions failed on these. Giving several `--exclude-sheet-tag` values excludes sheets carrying **any** of them; before 4.0.0 it matched nothing at all. See [Tag or content library name fails or matches nothing](/guide/troubleshooting#tag-or-content-library-name-fails-or-matches-nothing).
:::

::: tip One sheet number per environment variable
`BSI_QSEOW_CST_EXCLUDE_SHEET_NUMBER` and `BSI_QSEOW_CST_BLUR_SHEET_NUMBER` each hold a **single** sheet number. A value containing more than one number is rejected at startup:

```
error: option '--exclude-sheet-number <number...>' value '1 2 12' from env 'BSI_QSEOW_CST_EXCLUDE_SHEET_NUMBER' is invalid. Exclude sheet number must be a non-negative integer.
```

To select several sheets, pass `--exclude-sheet-number` or `--blur-sheet-number` on the command line instead. See [Listing several sheet numbers](/guide/concepts/sheet-exclusion#listing-several-sheet-numbers).
:::

::: tip Which browser build?
`--browser-version` accepts `recommended` (the build Butler Sheet Icons is tested with, and the default), `stable`, a release channel, or an exact build id. See [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build).
:::

::: tip Where the browser is kept — BSI 5.0.0 or later
`--browser-cache-dir` / `BSI_BROWSER_CACHE_DIR` names the directory Butler Sheet Icons keeps downloaded browsers in. It has to be the same directory `browser install` writes to, so it is set once for the machine rather than per command. This is the fix when a scheduled task cannot find the browser you installed by hand. See [Browser Cache Directory](/guide/advanced/browser-cache-directory).
:::

### Selecting apps {#selecting-apps}

`--appid` and `--qliksensetag` are **added together**, not chosen between. Apps named either way are all processed, and an app that is both named and tagged is processed once.

```bash
# Every app carrying the tag, plus the one named explicitly
butler-sheet-icons qseow create-sheet-thumbnails \
  --qliksensetag "Butler Sheet Icons" \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  ...
```

If neither matches anything, the run reports `No apps to process` and exits 1 — see [Run failures and exit codes](/guide/troubleshooting#run-failures-and-exit-codes).

### Example: create thumbnails

```bash
butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid myusername \
  --logonpwd mypassword \
  --prefix form \
  --contentlibrary "Butler sheet thumbnails" \
  --sense-version 2024-May \
  --browser chrome \
  --browser-version recommended \
  --secure true \
  --includesheetpart 2 \
  --browser-page-timeout 120 \
  --exclude-sheet-tag "excludeFromUpdate" \
  --blur-sheet-tag "sensitive" \
  --blur-factor 8 \
  --pagewait 6 \
  --headless true
```

## remove-sheet-icons

Remove all sheet icons from QSEoW applications. Also available as `remove-sheet-thumbnails`; the two names do the same thing.

```bash
butler-sheet-icons qseow remove-sheet-icons [options]
```

::: warning Requires BSI 5.0.0 or later
Earlier versions do not have this command. On those, running it prints the `qseow` help and exits without doing anything, and the only way back was to clear each sheet icon by hand in the Qlik Sense client.
:::

::: danger There is no undo
Each sheet goes back to the default grey appearance it had before Butler Sheet Icons was ever run, and the only way to get the icons back is to run [`create-sheet-thumbnails`](#create-sheet-thumbnails) again.

Test on a single app before pointing this at a tag that matches many, and add `--dry-run` first — see [Dry Runs](/guide/concepts/dry-run).
:::

### How it works

The command connects to your Qlik Sense server, finds the apps you name, and clears the sheet icon on every sheet in each of them. The sheets themselves are untouched; only the icon is removed.

The image files a previous thumbnail run uploaded to the content library are **not** deleted. Their names are predictable, so the next `create-sheet-thumbnails` run overwrites them.

Before anything is written, the run prints a plan: the server, the identity it connects as, how many apps matched your selection, how many of those are published, and a line stating what is about to happen. That published count is worth reading — the icons are cleared in memory and then the app is saved, and it is the save that a published app refuses.

Sheets that have no icon are marked `(no icon currently set)` in the plan, and the run treats them the same way: it skips them rather than clearing something that is already clear. That makes the command safe to repeat. Running it a second time over an app it has already cleared reports every sheet as having no icon, writes nothing, and does not save the app — so it does not show up as a change to a published app.

### Fewer options than creating thumbnails

Creating a thumbnail means opening each sheet in a browser and photographing it, which is why that command needs web UI logon credentials, a browser and a page-wait time. Clearing an icon changes a property over the engine connection, so none of that applies here and none of it is offered:

- No `--logonuserdir`, `--logonuserid` or `--logonpwd` — no browser is opened, so there is nothing to log into
- No `--headless`, `--pagewait`, `--imagedir`, `--includesheetpart` or `--browser`
- No exclude or blur rules — the command clears every sheet icon in the apps you select

What it does need is the certificate-based API connection: `--host`, `--certfile`, `--certkeyfile`, `--apiuserdir` and `--apiuserid`, exactly as `create-sheet-thumbnails` does.

### Options

Three options have no default and must be supplied: `--host`, `--apiuserdir` and `--apiuserid`. Everything else has a working default.

Pick apps with `--appid`, `--qliksensetag`, or both — the same additive rule as [Selecting apps](#selecting-apps) above.

<!-- generated:cli-options qseow remove-sheet-icons -->

| Option                               | Environment Variable                | Description                                                                                                                                                                                                                     | Default                 | Example                    |
| ------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------- |
| `--log-level, --loglevel <level>`    | `BSI_QSEOW_RSI_LOG_LEVEL`           | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                   | `info`                  | `--loglevel error`         |
| `--host <host>`                      | `BSI_QSEOW_RSI_HOST`                | Qlik Sense server IP/FQDN                                                                                                                                                                                                       | **Required**            | -                          |
| `--engineport <port>`                | `BSI_QSEOW_RSI_ENGINE_PORT`         | Qlik Sense server engine port                                                                                                                                                                                                   | `4747`                  | -                          |
| `--qrsport <port>`                   | `BSI_QSEOW_RSI_QRS_PORT`            | Qlik Sense server repository service (QRS) port                                                                                                                                                                                 | `4242`                  | -                          |
| `--schemaversion <version>`          | `BSI_QSEOW_RSI_SCHEMA_VERSION`      | Qlik Sense engine schema version (choices: 12.170.2, 12.612.0, 12.936.0, 12.1306.0, 12.1477.0, 12.1657.0, 12.1823.0, 12.2015.0)                                                                                                 | `12.612.0`              | `--schemaversion 12.170.2` |
| `--certfile <file>`                  | `BSI_QSEOW_RSI_CERT_FILE`           | Qlik Sense certificate file (exported from QMC)                                                                                                                                                                                 | `./cert/client.pem`     | -                          |
| `--certkeyfile <file>`               | `BSI_QSEOW_RSI_CERTKEY_FILE`        | Qlik Sense certificate key file (exported from QMC)                                                                                                                                                                             | `./cert/client_key.pem` | -                          |
| `--rejectUnauthorized <true\|false>` | `BSI_QSEOW_RSI_REJECT_UNAUTHORIZED` | Ignore warnings when Sense certificate does not match the --host paramater                                                                                                                                                      | `false`                 | -                          |
| `--secure <true\|false>`             | `BSI_QSEOW_RSI_SECURE`              | Connection to Qlik Sense engine is via https                                                                                                                                                                                    | `true`                  | -                          |
| `--apiuserdir <directory>`           | `BSI_QSEOW_RSI_API_USER_DIR`        | User directory for user to connect with when using Sense APIs                                                                                                                                                                   | **Required**            | -                          |
| `--apiuserid <userid>`               | `BSI_QSEOW_RSI_API_USER_ID`         | User ID for user to connect with when using Sense APIs                                                                                                                                                                          | **Required**            | -                          |
| `--appid <id...>`                    | `BSI_QSEOW_RSI_APP_ID`              | Qlik Sense app(s) whose sheet icons should be removed. Several ids can be given, separated by spaces or commas.<br>Combines with --qliksensetag rather than replacing it: apps named either way are all updated, each one once. | -                       | -                          |
| `--qliksensetag <value>`             | `BSI_QSEOW_RSI_QLIKSENSE_TAG`       | Used to control which Sense apps should have their sheet icons removed. All apps with this tag will be updated.                                                                                                                 | `""`                    | -                          |
| `--prefix <prefix>`                  | `BSI_QSEOW_RSI_PREFIX`              | Qlik Sense virtual proxy prefix                                                                                                                                                                                                 | `""`                    | -                          |
| `--dry-run`                          | -                                   | Perform every read and decision the real run would - connect, resolve apps, list sheets - but change nothing. Prints the per-sheet plan and exits.                                                                              | -                       | -                          |
| `-h, --help`                         | -                                   | display help for command                                                                                                                                                                                                        | -                       | `-h`                       |

<!-- /generated:cli-options -->

### Example: remove sheet icons

```bash
butler-sheet-icons qseow remove-sheet-icons \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --certfile ./cert/client.pem \
  --certkeyfile ./cert/client_key.pem \
  --secure true
```

If neither `--appid` nor `--qliksensetag` matches anything, the run reports `No apps to process` and exits 1 — see [Run failures and exit codes](/guide/troubleshooting#run-failures-and-exit-codes).

## See also

- [Browser Commands](/reference/browser)
- [Dry Runs](/guide/concepts/dry-run)
- [The Run Card](/guide/concepts/run-card) — what a run's log output means
- [Environment variables](/guide/concepts/environment-variables)
- [Security](/reference/security)
