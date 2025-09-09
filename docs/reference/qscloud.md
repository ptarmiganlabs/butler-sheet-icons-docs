# QS Cloud Commands

This page documents all Butler Sheet Icons commands specific to Qlik Sense Cloud.

## create-sheet-icons

Create thumbnail images for QS Cloud applications.

```bash
butler-sheet-icons qscloud create-sheet-icons [options]
```

### Required options (create)

| Option          | Description         | Example                   |
| --------------- | ------------------- | ------------------------- |
| `--tenanturl`   | QS Cloud tenant URL | `tenant.eu.qlikcloud.com` |
| `--apikey`      | QS Cloud API key    | `eyJhbGciOiJFUzM4NC...`   |
| `--logonuserid` | Login username      | `user@company.com`        |
| `--logonpwd`    | Login password      | `password123`             |

### App selection (choose one)

| Option           | Description                   | Example                                |
| ---------------- | ----------------------------- | -------------------------------------- |
| `--appid`        | Single app ID                 | `12345678-1234-1234-1234-123456789012` |
| `--collectionid` | Collection ID for bulk update | `collection-uuid`                      |

### Optional Settings

| Option               | Description               | Default  | Example                           |
| -------------------- | ------------------------- | -------- | --------------------------------- |
| `--headless`         | Hide browser              | `true`   | `--headless false`                |
| `--pagewait`         | Seconds to wait per sheet | `5`      | `--pagewait 7`                    |
| `--imagedir`         | Screenshot directory      | `./img`  | `--imagedir ./screenshots`        |
| `--includesheetpart` | Screenshot area           | `1`      | `--includesheetpart 2`            |
| `--browser`          | Browser type              | `chrome` | `--browser firefox`               |
| `--browser-version`  | Browser version           | `latest` | `--browser-version 121.0.6167.85` |
| `--skip-login`       | Skip login page           | `false`  | `--skip-login`                    |

### Sheet Filtering

**Exclusion Options:**

| Option                   | Description         | Example                                   |
| ------------------------ | ------------------- | ----------------------------------------- |
| `--exclude-sheet-number` | Exclude by position | `--exclude-sheet-number 1 2 3`            |
| `--exclude-sheet-title`  | Exclude by title    | `--exclude-sheet-title "Welcome" "Help"`  |
| `--exclude-sheet-status` | Exclude by status   | `--exclude-sheet-status published public` |

**Blurring Options:**

| Option                | Description             | Example                               |
| --------------------- | ----------------------- | ------------------------------------- |
| `--blur-sheet-number` | Blur by position        | `--blur-sheet-number 2 4`             |
| `--blur-sheet-title`  | Blur by title           | `--blur-sheet-title "Financial Data"` |
| `--blur-sheet-status` | Blur by status          | `--blur-sheet-status published`       |
| `--blur-factor`       | Blur intensity (0-1000) | `--blur-factor 10`                    |

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

| Option        | Description         |
| ------------- | ------------------- |
| `--tenanturl` | QS Cloud tenant URL |
| `--apikey`    | QS Cloud API key    |

### App selection (remove)

| Option           | Description   |
| ---------------- | ------------- |
| `--appid`        | Single app ID |
| `--collectionid` | Collection ID |

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

| Option        | Description         |
| ------------- | ------------------- |
| `--tenanturl` | QS Cloud tenant URL |
| `--apikey`    | QS Cloud API key    |

### Optional Options

| Option           | Description   | Default |
| ---------------- | ------------- | ------- |
| `--outputformat` | Output format | `table` |

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
