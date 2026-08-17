# QS Cloud Commands

This page documents all Butler Sheet Icons commands specific to Qlik Sense Cloud.

## create-sheet-icons

Create thumbnail images for QS Cloud applications.

```bash
butler-sheet-icons qscloud create-sheet-icons [options]
```

::: tip Getting a first run working
Add `-i` and Butler Sheet Icons asks for what it needs instead — 10 questions rather than 25 options, with the API key checked against your tenant as you give it, and the equivalent command line shown before anything runs. See [Interactive Mode](/guide/interactive-mode#creating-sheet-thumbnails).
:::

::: tip Check the plan first
Thumbnails are overwritten in place, with no undo. Add `--dry-run` to see exactly which apps and sheets would be touched — and which option is responsible for each decision — before anything is changed. See [Dry Runs](/guide/concepts/dry-run).
:::

### Options

Four options have no default and must be supplied: `--tenanturl`, `--apikey`, `--logonuserid` and `--logonpwd`. Everything else has a working default.

Pick apps with `--appid`, `--collectionid`, or both — see [Selecting apps](#selecting-apps) below.

<!-- generated:cli-options qscloud create-sheet-thumbnails -->

| Option                               | Environment Variable                   | Description                                                                                                                                                                                                                                                                                                                                                                   | Default       | Example                                                |
| ------------------------------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------ |
| `--log-level, --loglevel <level>`    | `BSI_QSCLOUD_CST_LOG_LEVEL`            | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                                                                                                                                                                 | `info`        | `--loglevel error`                                     |
| `--schemaversion <version>`          | `BSI_QSCLOUD_CST_SCHEMAVERSION`        | Qlik Sense engine schema version (choices: 12.170.2, 12.612.0, 12.936.0, 12.1306.0, 12.1477.0, 12.1657.0, 12.1823.0, 12.2015.0)                                                                                                                                                                                                                                               | `12.612.0`    | `--schemaversion 12.170.2`                             |
| `--tenanturl <url>`                  | `BSI_QSCLOUD_CST_TENANTURL`            | URL or host of Qlik Sense cloud tenant. Example: "https://tenant.eu.qlikcloud.com" or "tenant.eu.qlikcloud.com"                                                                                                                                                                                                                                                               | **Required**  | `--tenanturl tenant.eu.qlikcloud.com`                  |
| `--apikey <key>`                     | `BSI_QSCLOUD_CST_APIKEY`               | API key used to access the Sense APIs                                                                                                                                                                                                                                                                                                                                         | **Required**  | `--apikey eyJhbGciOiJFUzM4NC...`                       |
| `--skip-login`                       | `BSI_QSCLOUD_CST_SKIP_LOGIN`           | Skip QS login page, go directly to the tenant URL. Use this if you are automatically logged in to Qlik Sense                                                                                                                                                                                                                                                                  | `false`       | -                                                      |
| `--logonuserid <userid>`             | `BSI_QSCLOUD_CST_LOGON_USER_ID`        | User ID for user to connect with when logging into web UI                                                                                                                                                                                                                                                                                                                     | **Required**  | `--logonuserid user@company.com`                       |
| `--logonpwd <password>`              | `BSI_QSCLOUD_CST_LOGON_PWD`            | password for user to connect with                                                                                                                                                                                                                                                                                                                                             | **Required**  | `--logonpwd MyPassword`                                |
| `--headless <true\|false>`           | `BSI_QSCLOUD_CST_HEADLESS`             | Headless (=not visible) browser (true, false)                                                                                                                                                                                                                                                                                                                                 | `true`        | `--headless false`                                     |
| `--pagewait <seconds>`               | `BSI_QSCLOUD_CST_PAGE_WAIT`            | Number of seconds to wait after moving to a new sheet. Set this high enough so the sheet has time to render properly                                                                                                                                                                                                                                                          | `5`           | `--pagewait 10`                                        |
| `--imagedir <directory>`             | `BSI_QSCLOUD_CST_IMAGE_DIR`            | Directory in which thumbnail images will be stored. Relative or absolute path                                                                                                                                                                                                                                                                                                 | `./img`       | `--imagedir ./screenshots`                             |
| `--includesheetpart <value>`         | `BSI_QSCLOUD_CST_INCLUDE_SHEET_PART`   | Which part of sheets should be used to take screenshots. 1=object area only, 2=1 + sheet title, 3 not used, 4=full screen (choices: 1, 2, 4)                                                                                                                                                                                                                                  | `1`           | `--includesheetpart 2`                                 |
| `--appid <id...>`                    | `BSI_QSCLOUD_CST_APP_ID`               | Qlik Sense app(s) whose sheet icons should be modified. Several ids can be given, separated by spaces or commas.<br>Combines with --collectionid rather than replacing it: apps named either way are all updated, each one once.                                                                                                                                              | -             | `--appid 12345678-1234-1234-1234-123456789012`         |
| `--collectionid <id>`                | `BSI_QSCLOUD_CST_COLLECTION_ID`        | Used to control which Sense apps should have their sheets updated with new icons. All apps in this collection will be updated                                                                                                                                                                                                                                                 | `""`          | `--collectionid 6547e7e0d0b3b0c1e4e0f1a2`              |
| `--exclude-sheet-status <status...>` | `BSI_QSCLOUD_CST_EXCLUDE_SHEET_STATUS` | Exclude all sheets with specified status(es) (choices: private, published, public)                                                                                                                                                                                                                                                                                            | -             | `--exclude-sheet-status private`                       |
| `--exclude-sheet-tag <value...>`     | `BSI_QSCLOUD_CST_EXCLUDE_SHEET_TAG`    | Sheets with one or more of these tags set will be excluded from sheet icon update.                                                                                                                                                                                                                                                                                            | -             | `--exclude-sheet-tag excludeFromUpdate`                |
| `--exclude-sheet-number <number...>` | `BSI_QSCLOUD_CST_EXCLUDE_SHEET_NUMBER` | Sheet numbers (1=first sheet in an app) that will be excluded from sheet icon update.                                                                                                                                                                                                                                                                                         | -             | `--exclude-sheet-number 1 2`                           |
| `--exclude-sheet-title <title...>`   | `BSI_QSCLOUD_CST_EXCLUDE_SHEET_TITLE`  | Use sheet titles to control which sheets that will be excluded from sheet icon update.                                                                                                                                                                                                                                                                                        | -             | `--exclude-sheet-title Intro Help`                     |
| `--blur-sheet-status <status...>`    | `BSI_QSCLOUD_CST_BLUR_SHEET_STATUS`    | Blur all sheets with specified status(es) (choices: published, public)                                                                                                                                                                                                                                                                                                        | -             | `--blur-sheet-status published`                        |
| `--blur-sheet-tag <value...>`        | `BSI_QSCLOUD_CST_BLUR_SHEET_TAG`       | Sheets with one or more of these tags set will be blurred in the sheet icon update.                                                                                                                                                                                                                                                                                           | -             | `--blur-sheet-tag sensitive`                           |
| `--blur-sheet-number <number...>`    | `BSI_QSCLOUD_CST_BLUR_SHEET_NUMBER`    | Sheet numbers (1=first sheet in an app) that will be blurred in the sheet icon update.                                                                                                                                                                                                                                                                                        | -             | `--blur-sheet-number 3 5`                              |
| `--blur-sheet-title <title...>`      | `BSI_QSCLOUD_CST_BLUR_SHEET_TITLE`     | Sheets with this title will be blurred in the sheet icon update.                                                                                                                                                                                                                                                                                                              | -             | `--blur-sheet-title "Financial Data"`                  |
| `--blur-factor <factor>`             | `BSI_QSCLOUD_CST_BLUR_FACTOR`          | Factor to blur the sheets with. 0 = no blur, 100 = full blur.                                                                                                                                                                                                                                                                                                                 | `5`           | `--blur-factor 10`                                     |
| `--browser <browser>`                | `BSI_QSCLOUD_CST_BROWSER`              | Browser used to render sheets. Chrome only. (choices: chrome)                                                                                                                                                                                                                                                                                                                 | `chrome`      | `--browser chrome`                                     |
| `--browser-version <version>`        | `BSI_QSCLOUD_CST_BROWSER_VERSION`      | Browser build to use. Either a keyword - "recommended" for the build Butler Sheet Icons is tested with, "stable" for the newest stable release, or a release channel such as "beta" - or an exact version: a milestone ("151"), a build prefix ("151.0.7922") or a full build id ("151.0.7922.77"). Use "butler-sheet-icons browser list-available" to see what is available. | `recommended` | `--browser-version stable`                             |
| `--browser-page-timeout <seconds>`   | `BSI_BROWSER_PAGE_TIMEOUT`             | Timeout (seconds) for the browser to load a page. Default is 90 seconds. This is the time that the browser will wait for a page to load before giving up.                                                                                                                                                                                                                     | `90`          | `--browser-page-timeout 120`                           |
| `--browser-cache-dir <directory>`    | `BSI_BROWSER_CACHE_DIR`                | Directory where Butler Sheet Icons keeps downloaded browsers. Defaults to a "browser-cache" folder next to the Butler Sheet Icons executable for standalone builds, and to the .cache/puppeteer folder in the current user's home directory otherwise.                                                                                                                        | -             | `--browser-cache-dir /opt/butler-sheet-icons/browsers` |
| `--browser-executable-path <path>`   | `BSI_BROWSER_EXECUTABLE_PATH`          | Full path to a browser executable to use, for example a Microsoft Edge or Google Chrome already installed on this machine. Butler Sheet Icons then neither downloads nor manages a browser. Takes precedence over PUPPETEER_EXECUTABLE_PATH. If the file does not exist the run stops rather than downloading a browser instead.                                              | -             | -                                                      |
| `-i, --interactive`                  | -                                      | Answer questions instead of assembling a command line.<br>Options already supplied - here or through their BSI\_\* environment variables - are kept and not asked about again.                                                                                                                                                                                                | -             | -                                                      |
| `--dry-run`                          | -                                      | Perform every read and decision the real run would - connect, resolve apps, list sheets, apply every exclude and blur rule - but change nothing. Prints the per-sheet plan and exits.                                                                                                                                                                                         | -             | -                                                      |
| `-h, --help`                         | -                                      | display help for command                                                                                                                                                                                                                                                                                                                                                      | -             | `-h`                                                   |

<!-- /generated:cli-options -->

::: tip Every option can be set as an environment variable
The `BSI_QSCLOUD_CST_*` names in the table above are interchangeable with the flags, which is usually the better choice for an API key in a scheduled task. See [Environment Variables](/guide/concepts/environment-variables).
:::

::: tip Which browser build?
`--browser-version` accepts `recommended` (the build Butler Sheet Icons is tested with, and the default), `stable`, a release channel, or an exact build id. See [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build).
:::

::: tip Where the browser is kept — BSI 5.0.0 or later
`--browser-cache-dir` / `BSI_BROWSER_CACHE_DIR` names the directory Butler Sheet Icons keeps downloaded browsers in. It has to be the same directory `browser install` writes to, so it is set once for the machine rather than per command. This is the fix when a scheduled task cannot find the browser you installed by hand. See [Browser Cache Directory](/guide/advanced/browser-cache-directory).
:::

### Selecting apps {#selecting-apps}

`--appid` and `--collectionid` are **added together**, not chosen between. Apps named either way are all processed, and an app that is both named and in the collection is processed once.

```bash
# Every app in the collection, plus the one named explicitly
butler-sheet-icons qscloud create-sheet-thumbnails \
  --collectionid 6547e7e0d0b3b0c1e4e0f1a2 \
  --appid 12345678-1234-1234-1234-123456789012 \
  ...
```

`butler-sheet-icons qscloud list-collections` shows which collections exist. If neither option matches anything, the run reports `No apps to process` and exits 1 — see [Run failures and exit codes](/guide/troubleshooting#run-failures-and-exit-codes).

::: tip One sheet number per environment variable
`BSI_QSCLOUD_CST_EXCLUDE_SHEET_NUMBER` and `BSI_QSCLOUD_CST_BLUR_SHEET_NUMBER` each hold a **single** sheet number. A value containing more than one number is rejected at startup:

```
error: option '--exclude-sheet-number <number...>' value '1 2 12' from env 'BSI_QSCLOUD_CST_EXCLUDE_SHEET_NUMBER' is invalid. Exclude sheet number must be a non-negative integer.
```

To select several sheets, pass `--exclude-sheet-number` or `--blur-sheet-number` on the command line instead. See [Listing several sheet numbers](/guide/concepts/sheet-exclusion#listing-several-sheet-numbers).
:::

### Complete Example

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey eyJhbGciOiJFUzM4NC... \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012 \
  --collectionid collection-uuid \
  --pagewait 7 \
  --browser-page-timeout 120 \
  --includesheetpart 2 \
  --exclude-sheet-status published public \
  --blur-sheet-number 3 \
  --blur-factor 8 \
  --headless true
```

## remove-sheet-icons

Remove all sheet icons from QS Cloud applications.

```bash
butler-sheet-icons qscloud remove-sheet-icons [options]
```

::: tip Check the plan first
This removes icons and deletes thumbnail media files, with no undo. Add `--dry-run` to see which sheets would be cleared and how many media files would be deleted, before anything is changed. See [Dry Runs](/guide/concepts/dry-run).
:::

### Options (remove)

<!-- generated:cli-options qscloud remove-sheet-icons -->

| Option                            | Environment Variable            | Description                                                                                                                                                                                                                      | Default      | Example                                        |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------- |
| `--log-level, --loglevel <level>` | `BSI_QSCLOUD_RSI_LOG_LEVEL`     | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                    | `info`       | `--loglevel error`                             |
| `--schemaversion <version>`       | `BSI_QSCLOUD_RSI_SCHEMAVERSION` | Qlik Sense engine schema version (choices: 12.170.2, 12.612.0, 12.936.0, 12.1306.0, 12.1477.0, 12.1657.0, 12.1823.0, 12.2015.0)                                                                                                  | `12.612.0`   | `--schemaversion 12.170.2`                     |
| `--tenanturl <url>`               | `BSI_QSCLOUD_RSI_TENANTURL`     | URL or host of Qlik Sense cloud tenant. Example: "https://tenant.eu.qlikcloud.com" or "tenant.eu.qlikcloud.com"                                                                                                                  | **Required** | `--tenanturl tenant.eu.qlikcloud.com`          |
| `--apikey <key>`                  | `BSI_QSCLOUD_RSI_APIKEY`        | API key used to access the Sense APIs                                                                                                                                                                                            | **Required** | `--apikey eyJhbGciOiJFUzM4NC...`               |
| `--appid <id...>`                 | `BSI_QSCLOUD_RSI_APPID`         | Qlik Sense app(s) whose sheet icons should be modified. Several ids can be given, separated by spaces or commas.<br>Combines with --collectionid rather than replacing it: apps named either way are all updated, each one once. | -            | `--appid 12345678-1234-1234-1234-123456789012` |
| `--collectionid <id>`             | `BSI_QSCLOUD_RSI_COLLECTIONID`  | Used to control which Sense apps should have their sheets updated with new icons. All apps in this collection will be updated                                                                                                    | `""`         | `--collectionid 6547e7e0d0b3b0c1e4e0f1a2`      |
| `--dry-run`                       | -                               | Perform every read and decision the real run would - connect, resolve apps, list sheets, apply every exclude and blur rule - but change nothing. Prints the per-sheet plan and exits.                                            | -            | -                                              |
| `-h, --help`                      | -                               | display help for command                                                                                                                                                                                                         | -            | `-h`                                           |

<!-- /generated:cli-options -->

`--appid` and `--collectionid` combine here in the same way as for `create-sheet-thumbnails` — see [Selecting apps](#selecting-apps).

### Example: remove from single app

```bash
butler-sheet-icons qscloud remove-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey eyJhbGciOiJFUzM4NC... \
  --appid 12345678-1234-1234-1234-123456789012
```

## list-collections

List available collections in QS Cloud.

```bash
butler-sheet-icons qscloud list-collections [options]
```

### Options (list-collections)

<!-- generated:cli-options qscloud list-collections -->

| Option                            | Environment Variable          | Description                                                                                                     | Default      | Example                               |
| --------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------- |
| `--log-level, --loglevel <level>` | `BSI_QSCLOUD_LC_LOG_LEVEL`    | Log level (choices: error, warn, info, verbose, debug, silly)                                                   | `info`       | `--loglevel error`                    |
| `--tenanturl <url>`               | `BSI_QSCLOUD_LC_TENANTURL`    | URL or host of Qlik Sense cloud tenant. Example: "https://tenant.eu.qlikcloud.com" or "tenant.eu.qlikcloud.com" | **Required** | `--tenanturl tenant.eu.qlikcloud.com` |
| `--apikey <key>`                  | `BSI_QSCLOUD_LC_APIKEY`       | API key used to access the Sense APIs                                                                           | **Required** | `--apikey eyJhbGciOiJFUzM4NC...`      |
| `--outputformat <table\|json>`    | `BSI_QSCLOUD_LC_OUTPUTFORMAT` | Output format (choices: table, json)                                                                            | `table`      | `--outputformat json`                 |
| `-h, --help`                      | -                             | display help for command                                                                                        | -            | `-h`                                  |

<!-- /generated:cli-options -->

### Example

```bash
butler-sheet-icons qscloud list-collections \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey eyJhbGciOiJFUzM4NC... \
  --outputformat json
```

## See also

- [Browser Commands](/reference/browser)
- [Dry Runs](/guide/concepts/dry-run)
- [The Run Card](/guide/concepts/run-card) — what a run's log output means
- [Environment variables](/guide/concepts/environment-variables)
- [Security](/reference/security)
