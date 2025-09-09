# QSEoW Commands

This page documents all Butler Sheet Icons commands specific to Qlik Sense Enterprise on Windows (QSEoW).

## create-sheet-thumbnails

Create thumbnail images for QSEoW applications.

```bash
butler-sheet-icons qseow create-sheet-thumbnails [options]
```

### Required options

| Option            | Description           | Example                   |
| ----------------- | --------------------- | ------------------------- |
| `--host`          | QSEoW server hostname | `qlik-server.company.com` |
| `--apiuserdir`    | API user directory    | `Internal`                |
| `--apiuserid`     | API user ID           | `sa_api`                  |
| `--logonuserdir`  | Login user directory  | `Internal`                |
| `--logonuserid`   | Login user ID         | `username`                |
| `--logonpwd`      | Login password        | `password`                |
| `--sense-version` | QSEoW version         | `2024-Nov`                |

### App selection (choose one)

| Option           | Description         | Example                                |
| ---------------- | ------------------- | -------------------------------------- |
| `--appid`        | Single app ID       | `a3e0f5d2-000a-464f-998d-33d333b175d7` |
| `--qliksensetag` | Tag for bulk update | `updateSheetThumbnails`                |

### Connection options

| Option                 | Description          | Default    | Example                     |
| ---------------------- | -------------------- | ---------- | --------------------------- |
| `--secure`             | Use HTTPS            | `true`     | `--secure false`            |
| `--port`               | Web port             | `443`/`80` | `--port 8443`               |
| `--qrsport`            | QRS port             | `4242`     | `--qrsport 4243`            |
| `--engineport`         | Engine port          | `4747`     | `--engineport 4748`         |
| `--prefix`             | Virtual proxy prefix | `""`       | `--prefix form`             |
| `--rejectUnauthorized` | Ignore cert mismatch | `false`    | `--rejectUnauthorized true` |

### Certificate options

| Option          | Description               | Default                 |
| --------------- | ------------------------- | ----------------------- |
| `--certfile`    | Certificate file path     | `./cert/client.pem`     |
| `--certkeyfile` | Certificate key file path | `./cert/client_key.pem` |

### Content library and timing

| Option               | Description               | Default                   |
| -------------------- | ------------------------- | ------------------------- |
| `--contentlibrary`   | Target content library    | `Butler sheet thumbnails` |
| `--includesheetpart` | Screenshot area (1-4)     | `1`                       |
| `--pagewait`         | Seconds to wait per sheet | `5`                       |
| `--imagedir`         | Screenshot directory      | `./img`                   |

### Sheet filtering

**Exclusion options:**

| Option                   | Description         | Example                                   |
| ------------------------ | ------------------- | ----------------------------------------- |
| `--exclude-sheet-number` | Exclude by position | `--exclude-sheet-number 1 2`              |
| `--exclude-sheet-title`  | Exclude by title    | `--exclude-sheet-title "Intro" "Help"`    |
| `--exclude-sheet-status` | Exclude by status   | `--exclude-sheet-status private`          |
| `--exclude-sheet-tag`    | Exclude by tag      | `--exclude-sheet-tag "excludeFromUpdate"` |

**Blurring options:**

| Option                | Description            | Example                               |
| --------------------- | ---------------------- | ------------------------------------- |
| `--blur-sheet-number` | Blur by position       | `--blur-sheet-number 3 5`             |
| `--blur-sheet-title`  | Blur by title          | `--blur-sheet-title "Financial Data"` |
| `--blur-sheet-status` | Blur by status         | `--blur-sheet-status published`       |
| `--blur-sheet-tag`    | Blur by tag            | `--blur-sheet-tag "sensitive"`        |
| `--blur-factor`       | Blur intensity (0-100) | `--blur-factor 10`                    |

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
