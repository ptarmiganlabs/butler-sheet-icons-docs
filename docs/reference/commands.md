# Commands Reference

Butler Sheet Icons provides commands for both Qlik Sense Cloud and Qlik Sense Enterprise on Windows (QSEoW), plus browser management utilities.

## Command Structure

```bash
butler-sheet-icons <platform> <command> [options]
```

- `<platform>`: `qscloud`, `qseow`, or `browser`
- `<command>`: Specific action to perform
- `[options]`: Command-specific parameters

## Quick Reference

| Platform | Command | Purpose |
|----------|---------|---------|
| `qscloud` | `create-sheet-icons` | Create thumbnails for QS Cloud apps |
| `qscloud` | `remove-sheet-icons` | Remove thumbnails from QS Cloud apps |
| `qscloud` | `list-collections` | List available collections |
| `qseow` | `create-sheet-thumbnails` | Create thumbnails for QSEoW apps |
| `qseow` | `remove-sheet-icons` | Remove thumbnails from QSEoW apps |
| `browser` | `install` | Install browser for BSI |
| `browser` | `list-installed` | Show installed browsers |
| `browser` | `list-available` | Show available browsers for download |
| `browser` | `uninstall` | Remove specific browser |
| `browser` | `uninstall-all` | Remove all browsers |

## Global Options

These options are available for most commands:

| Option | Description | Default |
|--------|-------------|---------|
| `--loglevel` | Logging verbosity | `info` |
| `--help` | Show command help | - |
| `--version` | Show version information | - |

### Log Levels

- `error` - Only errors
- `warn` - Warnings and errors  
- `info` - General information (default)
- `verbose` - Detailed operation info
- `debug` - Debug information
- `silly` - Everything including websocket traffic

## Qlik Sense Cloud Commands

### create-sheet-icons

Create thumbnail images for QS Cloud applications.

```bash
butler-sheet-icons qscloud create-sheet-icons [options]
```

#### Required Options

| Option | Description | Example |
|--------|-------------|---------|
| `--tenanturl` | QS Cloud tenant URL | `tenant.eu.qlikcloud.com` |
| `--apikey` | QS Cloud API key | `eyJhbGciOiJFUzM4NC...` |
| `--logonuserid` | Login username | `user@company.com` |
| `--logonpwd` | Login password | `password123` |

#### App Selection (choose one)

| Option | Description | Example |
|--------|-------------|---------|
| `--appid` | Single app ID | `12345678-1234-1234-1234-123456789012` |
| `--collectionid` | Collection ID for bulk update | `collection-uuid` |

#### Optional Settings

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `--headless` | Hide browser | `true` | `--headless false` |
| `--pagewait` | Seconds to wait per sheet | `5` | `--pagewait 7` |
| `--imagedir` | Screenshot directory | `./img` | `--imagedir ./screenshots` |
| `--includesheetpart` | Screenshot area | `1` | `--includesheetpart 2` |
| `--browser` | Browser type | `chrome` | `--browser firefox` |
| `--browser-version` | Browser version | `latest` | `--browser-version 121.0.6167.85` |
| `--skip-login` | Skip login page | `false` | `--skip-login` |

#### Sheet Filtering

**Exclusion Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--exclude-sheet-number` | Exclude by position | `--exclude-sheet-number 1 2 3` |
| `--exclude-sheet-title` | Exclude by title | `--exclude-sheet-title "Welcome" "Help"` |
| `--exclude-sheet-status` | Exclude by status | `--exclude-sheet-status published public` |

**Blurring Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--blur-sheet-number` | Blur by position | `--blur-sheet-number 2 4` |
| `--blur-sheet-title` | Blur by title | `--blur-sheet-title "Financial Data"` |
| `--blur-sheet-status` | Blur by status | `--blur-sheet-status published` |
| `--blur-factor` | Blur intensity (0-1000) | `--blur-factor 10` |

#### Complete Example

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

### remove-sheet-icons

Remove all sheet icons from QS Cloud applications.

```bash
butler-sheet-icons qscloud remove-sheet-icons [options]
```

#### Required Options

| Option | Description |
|--------|-------------|
| `--tenanturl` | QS Cloud tenant URL |
| `--apikey` | QS Cloud API key |

#### App Selection (choose one)

| Option | Description |
|--------|-------------|
| `--appid` | Single app ID |
| `--collectionid` | Collection ID |

#### Example

```bash
butler-sheet-icons qscloud remove-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey eyJhbGciOiJFUzM4NC... \
  --appid 12345678-1234-1234-1234-123456789012
```

### list-collections

List available collections in QS Cloud.

```bash
butler-sheet-icons qscloud list-collections [options]
```

#### Required Options

| Option | Description |
|--------|-------------|
| `--tenanturl` | QS Cloud tenant URL |
| `--apikey` | QS Cloud API key |

#### Optional Options

| Option | Description | Default |
|--------|-------------|---------|
| `--outputformat` | Output format | `table` |

#### Example

```bash
butler-sheet-icons qscloud list-collections \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey eyJhbGciOiJFUzM4NC... \
  --outputformat json
```

## QSEoW Commands

### create-sheet-thumbnails

Create thumbnail images for QSEoW applications.

```bash
butler-sheet-icons qseow create-sheet-thumbnails [options]
```

#### Required Options

| Option | Description | Example |
|--------|-------------|---------|
| `--host` | QSEoW server hostname | `qlik-server.company.com` |
| `--apiuserdir` | API user directory | `Internal` |
| `--apiuserid` | API user ID | `sa_api` |
| `--logonuserdir` | Login user directory | `Internal` |
| `--logonuserid` | Login user ID | `username` |
| `--logonpwd` | Login password | `password` |
| `--sense-version` | QSEoW version | `2024-May` |

#### App Selection (choose one)

| Option | Description | Example |
|--------|-------------|---------|
| `--appid` | Single app ID | `a3e0f5d2-000a-464f-998d-33d333b175d7` |
| `--qliksensetag` | Tag for bulk update | `updateSheetThumbnails` |

#### Connection Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `--secure` | Use HTTPS | `true` | `--secure false` |
| `--port` | Web port | `443`/`80` | `--port 8443` |
| `--qrsport` | QRS port | `4242` | `--qrsport 4243` |
| `--engineport` | Engine port | `4747` | `--engineport 4748` |
| `--prefix` | Virtual proxy prefix | `""` | `--prefix form` |
| `--rejectUnauthorized` | SSL verification | `false` | `--rejectUnauthorized true` |

#### Certificate Options

| Option | Description | Default |
|--------|-------------|---------|
| `--certfile` | Certificate file path | `./cert/client.pem` |
| `--certkeyfile` | Certificate key file path | `./cert/client_key.pem` |

#### Content Library

| Option | Description | Default |
|--------|-------------|---------|
| `--contentlibrary` | Target content library | `Butler sheet thumbnails` |

#### Sheet Filtering

**Exclusion Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--exclude-sheet-number` | Exclude by position | `--exclude-sheet-number 1 2` |
| `--exclude-sheet-title` | Exclude by title | `--exclude-sheet-title "Intro" "Help"` |
| `--exclude-sheet-status` | Exclude by status | `--exclude-sheet-status private` |
| `--exclude-sheet-tag` | Exclude by tag | `--exclude-sheet-tag "excludeFromUpdate"` |

**Blurring Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--blur-sheet-number` | Blur by position | `--blur-sheet-number 3 5` |
| `--blur-sheet-title` | Blur by title | `--blur-sheet-title "Financial Data"` |
| `--blur-sheet-status` | Blur by status | `--blur-sheet-status published` |
| `--blur-sheet-tag` | Blur by tag | `--blur-sheet-tag "sensitive"` |
| `--blur-factor` | Blur intensity | `--blur-factor 10` |

#### Complete Example

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
  --secure true \
  --includesheetpart 2 \
  --exclude-sheet-tag "excludeFromUpdate" \
  --blur-sheet-tag "sensitive" \
  --blur-factor 8 \
  --pagewait 6 \
  --headless true
```

### remove-sheet-icons

Remove all sheet icons from QSEoW applications.

```bash
butler-sheet-icons qseow remove-sheet-icons [options]
```

Uses the same connection and authentication options as `create-sheet-thumbnails`, but only removes existing icons.

## Browser Commands

### install

Install a browser for Butler Sheet Icons.

```bash
butler-sheet-icons browser install [options]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--browser` | Browser type | `chrome` |
| `--browser-version` | Browser version | `latest` |

#### Examples

```bash
# Install latest Chrome
butler-sheet-icons browser install

# Install specific Chrome version
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Install Firefox
butler-sheet-icons browser install --browser firefox
```

### list-installed

Show installed browsers.

```bash
butler-sheet-icons browser list-installed
```

### list-available

Show available browsers for download.

```bash
butler-sheet-icons browser list-available [options]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--browser` | Browser type | `chrome` |
| `--channel` | Chrome release channel | `stable` |

### uninstall

Remove a specific browser.

```bash
butler-sheet-icons browser uninstall [options]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--browser` | Browser type | `chrome` |
| `--browser-version` | Browser version | Required |

### uninstall-all

Remove all installed browsers.

```bash
butler-sheet-icons browser uninstall-all
```

## Environment Variables

All command-line options can be set using environment variables. The format is:

```
BSI_<PLATFORM>_<COMMAND>_<OPTION>
```

### Examples

```bash
# QS Cloud
export BSI_QSCLOUD_CST_TENANTURL="mytenant.eu.qlikcloud.com"
export BSI_QSCLOUD_CST_APIKEY="your-api-key"

# QSEoW  
export BSI_QSEOW_CST_HOST="qlik-server.company.com"
export BSI_QSEOW_CST_SENSE_VERSION="2024-May"

# Browser
export BSI_BROWSER_I_BROWSER="chrome"
export BSI_BROWSER_I_BROWSER_VERSION="latest"
```

### Command Abbreviations

| Platform | Command | Abbreviation |
|----------|---------|--------------|
| qscloud | create-sheet-thumbnails | CST |
| qscloud | remove-sheet-icons | RSI |
| qscloud | list-collections | LC |
| qseow | create-sheet-thumbnails | CST |
| qseow | remove-sheet-icons | RSI |
| browser | install | I |
| browser | list-installed | LI |
| browser | list-available | LA |
| browser | uninstall | UI |
| browser | uninstall-all | UIA |

## Getting Help

For any command, use `--help` to see detailed options:

```bash
butler-sheet-icons --help
butler-sheet-icons qscloud --help
butler-sheet-icons qscloud create-sheet-icons --help
butler-sheet-icons qseow create-sheet-thumbnails --help
butler-sheet-icons browser --help
```