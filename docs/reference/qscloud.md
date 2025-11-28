# QS Cloud Commands

This page documents all Butler Sheet Icons commands specific to Qlik Sense Cloud.

## create-sheet-icons

Create thumbnail images for QS Cloud applications.

```bash
butler-sheet-icons qscloud create-sheet-icons [options]
```

### Required options (create)

| Option          | Environment Variable            | Description         | Default | Example                   |
| --------------- | ------------------------------- | ------------------- | ------- | ------------------------- |
| `--tenanturl`   | `BSI_QSCLOUD_CST_TENANTURL`     | QS Cloud tenant URL |         | `tenant.eu.qlikcloud.com` |
| `--apikey`      | `BSI_QSCLOUD_CST_APIKEY`        | QS Cloud API key    |         | `eyJhbGciOiJFUzM4NC...`   |
| `--logonuserid` | `BSI_QSCLOUD_CST_LOGON_USER_ID` | Login username      |         | `user@company.com`        |
| `--logonpwd`    | `BSI_QSCLOUD_CST_LOGON_PWD`     | Login password      |         | `password123`             |

### App selection (choose one)

| Option           | Environment Variable            | Description                   | Default | Example                                |
| ---------------- | ------------------------------- | ----------------------------- | ------- | -------------------------------------- |
| `--appid`        | `BSI_QSCLOUD_CST_APP_ID`        | Single app ID                 |         | `12345678-1234-1234-1234-123456789012` |
| `--collectionid` | `BSI_QSCLOUD_CST_COLLECTION_ID` | Collection ID for bulk update | `""`    | `collection-uuid`                      |

### Optional Settings

| Option                   | Environment Variable                 | Description                                         | Default  | Example                           |
| ------------------------ | ------------------------------------ | --------------------------------------------------- | -------- | --------------------------------- |
| `--headless`             | `BSI_QSCLOUD_CST_HEADLESS`           | Hide browser                                        | `true`   | `--headless false`                |
| `--pagewait`             | `BSI_QSCLOUD_CST_PAGE_WAIT`          | Seconds to wait per sheet                           | `5`      | `--pagewait 7`                    |
| `--browser-page-timeout` | `BSI_BROWSER_PAGE_TIMEOUT`           | Seconds to wait for a page to load                  | `90`     | `--browser-page-timeout 120`      |
| `--imagedir`             | `BSI_QSCLOUD_CST_IMAGE_DIR`          | Screenshot directory                                | `./img`  | `--imagedir ./screenshots`        |
| `--includesheetpart`     | `BSI_QSCLOUD_CST_INCLUDE_SHEET_PART` | Screenshot area (1 = content, 2 = +title, 4 = full) | `1`      | `--includesheetpart 2`            |
| `--browser`              | `BSI_QSCLOUD_CST_BROWSER`            | Browser type                                        | `chrome` | `--browser firefox`               |
| `--browser-version`      | `BSI_QSCLOUD_CST_BROWSER_VERSION`    | Browser version                                     | `latest` | `--browser-version 121.0.6167.85` |
| `--skip-login`           | `BSI_QSCLOUD_CST_SKIP_LOGIN`         | Skip login page                                     | `false`  | `--skip-login`                    |

### Sheet Filtering

**Exclusion Options:**

| Option                   | Environment Variable                   | Description         | Default | Example                                   |
| ------------------------ | -------------------------------------- | ------------------- | ------- | ----------------------------------------- |
| `--exclude-sheet-number` | `BSI_QSCLOUD_CST_EXCLUDE_SHEET_NUMBER` | Exclude by position |         | `--exclude-sheet-number 1 2 3`            |
| `--exclude-sheet-title`  | `BSI_QSCLOUD_CST_EXCLUDE_SHEET_TITLE`  | Exclude by title    |         | `--exclude-sheet-title "Welcome" "Help"`  |
| `--exclude-sheet-status` | `BSI_QSCLOUD_CST_EXCLUDE_SHEET_STATUS` | Exclude by status   | `[]`    | `--exclude-sheet-status published public` |

**Blurring Options:**

| Option                | Environment Variable                | Description             | Default | Example                               |
| --------------------- | ----------------------------------- | ----------------------- | ------- | ------------------------------------- |
| `--blur-sheet-number` | `BSI_QSCLOUD_CST_BLUR_SHEET_NUMBER` | Blur by position        |         | `--blur-sheet-number 2 4`             |
| `--blur-sheet-title`  | `BSI_QSCLOUD_CST_BLUR_SHEET_TITLE`  | Blur by title           |         | `--blur-sheet-title "Financial Data"` |
| `--blur-sheet-status` | `BSI_QSCLOUD_CST_BLUR_SHEET_STATUS` | Blur by status          | `[]`    | `--blur-sheet-status published`       |
| `--blur-factor`       | `BSI_QSCLOUD_CST_BLUR_FACTOR`       | Blur intensity (0-1000) | `5`     | `--blur-factor 10`                    |

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

### Required options (remove)

| Option        | Environment Variable        | Description         | Default | Example                   |
| ------------- | --------------------------- | ------------------- | ------- | ------------------------- |
| `--tenanturl` | `BSI_QSCLOUD_RSI_TENANTURL` | QS Cloud tenant URL |         | `tenant.eu.qlikcloud.com` |
| `--apikey`    | `BSI_QSCLOUD_RSI_APIKEY`    | QS Cloud API key    |         | `eyJhbGciOiJFUzM4NC...`   |

### App selection (remove)

| Option           | Environment Variable           | Description   | Default | Example                                |
| ---------------- | ------------------------------ | ------------- | ------- | -------------------------------------- |
| `--appid`        | `BSI_QSCLOUD_RSI_APPID`        | Single app ID |         | `12345678-1234-1234-1234-123456789012` |
| `--collectionid` | `BSI_QSCLOUD_RSI_COLLECTIONID` | Collection ID | `""`    | `collection-uuid`                      |

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

### Required options (list-collections)

| Option        | Environment Variable       | Description         | Default | Example                   |
| ------------- | -------------------------- | ------------------- | ------- | ------------------------- |
| `--tenanturl` | `BSI_QSCLOUD_LC_TENANTURL` | QS Cloud tenant URL |         | `tenant.eu.qlikcloud.com` |
| `--apikey`    | `BSI_QSCLOUD_LC_APIKEY`    | QS Cloud API key    |         | `eyJhbGciOiJFUzM4NC...`   |

### Optional Options

| Option           | Environment Variable          | Description   | Default | Example               |
| ---------------- | ----------------------------- | ------------- | ------- | --------------------- |
| `--outputformat` | `BSI_QSCLOUD_LC_OUTPUTFORMAT` | Output format | `table` | `--outputformat json` |

### Example

```bash
butler-sheet-icons qscloud list-collections \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey eyJhbGciOiJFUzM4NC... \
  --outputformat json
```

## See also

- [Browser Commands](/reference/browser)
- [Environment variables](/guide/concepts/environment-variables)
- [Security](/reference/security)
