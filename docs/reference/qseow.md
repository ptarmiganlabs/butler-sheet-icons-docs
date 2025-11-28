# QSEoW Commands

This page documents all Butler Sheet Icons commands specific to Qlik Sense Enterprise on Windows (QSEoW).

## create-sheet-thumbnails

Create thumbnail images for QSEoW applications.

```bash
butler-sheet-icons qseow create-sheet-thumbnails [options]
```

### Required options

| Option            | Environment Variable           | Description           | Default    | Example                   |
| ----------------- | ------------------------------ | --------------------- | ---------- | ------------------------- |
| `--host`          | `BSI_QSEOW_CST_HOST`           | QSEoW server hostname |            | `qlik-server.company.com` |
| `--apiuserdir`    | `BSI_QSEOW_CST_API_USER_DIR`   | API user directory    |            | `Internal`                |
| `--apiuserid`     | `BSI_QSEOW_CST_API_USER_ID`    | API user ID           |            | `sa_api`                  |
| `--logonuserdir`  | `BSI_QSEOW_CST_LOGON_USER_DIR` | Login user directory  |            | `Internal`                |
| `--logonuserid`   | `BSI_QSEOW_CST_LOGON_USER_ID`  | Login user ID         |            | `username`                |
| `--logonpwd`      | `BSI_QSEOW_CST_LOGON_PWD`      | Login password        |            | `password`                |
| `--sense-version` | `BSI_QSEOW_CST_SENSE_VERSION`  | QSEoW version         | `2025-Nov` | `2024-Nov`                |

### App selection (choose one)

| Option           | Environment Variable          | Description         | Default | Example                                |
| ---------------- | ----------------------------- | ------------------- | ------- | -------------------------------------- |
| `--appid`        | `BSI_QSEOW_CST_APP_ID`        | Single app ID       |         | `a3e0f5d2-000a-464f-998d-33d333b175d7` |
| `--qliksensetag` | `BSI_QSEOW_CST_QLIKSENSE_TAG` | Tag for bulk update | `""`    | `updateSheetThumbnails`                |

### Connection options

| Option                 | Environment Variable                | Description          | Default | Example                     |
| ---------------------- | ----------------------------------- | -------------------- | ------- | --------------------------- |
| `--secure`             | `BSI_QSEOW_CST_SECURE`              | Use HTTPS            | `true`  | `--secure false`            |
| `--port`               | `BSI_QSEOW_CST_PORT`                | Web port             |         | `--port 8443`               |
| `--qrsport`            | `BSI_QSEOW_CST_QRS_PORT`            | QRS port             | `4242`  | `--qrsport 4243`            |
| `--engineport`         | `BSI_QSEOW_CST_ENGINE_PORT`         | Engine port          | `4747`  | `--engineport 4748`         |
| `--prefix`             | `BSI_QSEOW_CST_PREFIX`              | Virtual proxy prefix | `""`    | `--prefix form`             |
| `--rejectUnauthorized` | `BSI_QSEOW_CST_REJECT_UNAUTHORIZED` | Ignore cert mismatch | `false` | `--rejectUnauthorized true` |

### Certificate options

| Option          | Environment Variable         | Description               | Default                 | Example                               |
| --------------- | ---------------------------- | ------------------------- | ----------------------- | ------------------------------------- |
| `--certfile`    | `BSI_QSEOW_CST_CERT_FILE`    | Certificate file path     | `./cert/client.pem`     | `--certfile ./cert/client.pem`        |
| `--certkeyfile` | `BSI_QSEOW_CST_CERTKEY_FILE` | Certificate key file path | `./cert/client_key.pem` | `--certkeyfile ./cert/client_key.pem` |

### Content library and timing

| Option                   | Environment Variable               | Description                        | Default                   | Example                                      |
| ------------------------ | ---------------------------------- | ---------------------------------- | ------------------------- | -------------------------------------------- |
| `--contentlibrary`       | `BSI_QSEOW_CST_CONTENT_LIBRARY`    | Target content library             | `Butler sheet thumbnails` | `--contentlibrary "Butler sheet thumbnails"` |
| `--includesheetpart`     | `BSI_QSEOW_CST_INCLUDE_SHEET_PART` | Screenshot area (1-4)              | `1`                       | `--includesheetpart 2`                       |
| `--pagewait`             | `BSI_QSEOW_CST_PAGE_WAIT`          | Seconds to wait per sheet          | `5`                       | `--pagewait 6`                               |
| `--browser-page-timeout` | `BSI_BROWSER_PAGE_TIMEOUT`         | Seconds to wait for a page to load | `90`                      | `--browser-page-timeout 120`                 |
| `--imagedir`             | `BSI_QSEOW_CST_IMAGE_DIR`          | Screenshot directory               | `./img`                   | `--imagedir ./img`                           |

### Sheet filtering

**Exclusion options:**

| Option                   | Environment Variable                 | Description         | Default | Example                                   |
| ------------------------ | ------------------------------------ | ------------------- | ------- | ----------------------------------------- |
| `--exclude-sheet-number` | `BSI_QSEOW_CST_EXCLUDE_SHEET_NUMBER` | Exclude by position |         | `--exclude-sheet-number 1 2`              |
| `--exclude-sheet-title`  | `BSI_QSEOW_CST_EXCLUDE_SHEET_TITLE`  | Exclude by title    |         | `--exclude-sheet-title "Intro" "Help"`    |
| `--exclude-sheet-status` | `BSI_QSEOW_CST_EXCLUDE_SHEET_STATUS` | Exclude by status   | `[]`    | `--exclude-sheet-status private`          |
| `--exclude-sheet-tag`    | `BSI_QSEOW_CST_EXCLUDE_SHEET_TAG`    | Exclude by tag      |         | `--exclude-sheet-tag "excludeFromUpdate"` |

**Blurring options:**

| Option                | Environment Variable              | Description            | Default | Example                               |
| --------------------- | --------------------------------- | ---------------------- | ------- | ------------------------------------- |
| `--blur-sheet-number` | `BSI_QSEOW_CST_BLUR_SHEET_NUMBER` | Blur by position       |         | `--blur-sheet-number 3 5`             |
| `--blur-sheet-title`  | `BSI_QSEOW_CST_BLUR_SHEET_TITLE`  | Blur by title          |         | `--blur-sheet-title "Financial Data"` |
| `--blur-sheet-status` | `BSI_QSEOW_CST_BLUR_SHEET_STATUS` | Blur by status         | `[]`    | `--blur-sheet-status published`       |
| `--blur-sheet-tag`    | `BSI_QSEOW_CST_BLUR_SHEET_TAG`    | Blur by tag            |         | `--blur-sheet-tag "sensitive"`        |
| `--blur-factor`       | `BSI_QSEOW_CST_BLUR_FACTOR`       | Blur intensity (0-100) | `5`     | `--blur-factor 10`                    |

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
  --browser-version latest \
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

Remove all sheet icons from QSEoW applications.

```bash
butler-sheet-icons qseow remove-sheet-icons [options]
```

### How it works

Uses the same connection and authentication options as `create-sheet-thumbnails`, but only removes existing icons.

## See also

- [Browser Commands](/reference/browser)
- [Environment variables](/guide/concepts/environment-variables)
- [Security](/reference/security)
