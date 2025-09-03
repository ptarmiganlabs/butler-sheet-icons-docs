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

Butler Sheet Icons includes comprehensive browser management capabilities to ensure consistent operation across different environments. These commands manage BSI's internal browser cache, which is separate from any browsers installed on your system.

::: tip Browser Cache
BSI maintains its own browser cache to ensure consistency and avoid conflicts with your system browsers. All browser commands operate on this cache.
:::

### install

Download and install a browser into the Butler Sheet Icons cache.

```bash
butler-sheet-icons browser install [options]
```

#### Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `--browser` | Browser type | `chrome` | `--browser firefox` |
| `--browser-version` | Specific browser version | `latest` | `--browser-version 121.0.6167.85` |
| `--loglevel` | Logging verbosity | `info` | `--loglevel debug` |

#### Supported Browsers

**Chrome:**
- Full version control with specific build numbers
- Supports stable, beta, dev, and canary channels
- Available for Windows, macOS, and Linux

**Firefox:**
- Latest version only (specific versions planned for future releases)
- Available for Windows, macOS, and Linux

#### Examples

```bash
# Install latest stable Chrome (default)
butler-sheet-icons browser install

# Install specific Chrome version
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Install latest Firefox
butler-sheet-icons browser install --browser firefox

# Install with debug logging
butler-sheet-icons browser install --browser chrome --loglevel debug
```

#### Chrome Version Format

Chrome versions use build numbers in the format `MAJOR.MINOR.BUILD.PATCH`:
- Example: `121.0.6167.85`
- Use `list-available` command to see available versions

::: warning Older Chrome Versions
Some older Chrome versions may no longer be available for download from Google's servers. If installation fails, try a newer version.
:::

#### Firefox Limitations

Firefox currently supports only the latest version:
```bash
# These are equivalent for Firefox
butler-sheet-icons browser install --browser firefox
butler-sheet-icons browser install --browser firefox --browser-version latest
```

### list-installed

Display all browsers currently installed in the BSI cache.

```bash
butler-sheet-icons browser list-installed [options]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--loglevel` | Logging verbosity | `info` |

#### Example Output

```
2024-02-16T14:10:55.141Z info: App version: 3.2.3
2024-02-16T14:10:55.141Z info: Installed browsers:
2024-02-16T14:10:55.156Z info:     chrome, build id=121.0.6167.85, platform=win64, path=C:\Users\user\.cache\puppeteer\chrome\win64-121.0.6167.85
2024-02-16T14:10:55.156Z info:     firefox, build id=124.0a1, platform=win64, path=C:\Users\user\.cache\puppeteer\firefox\win64-124.0a1
```

The output shows:
- **Browser type**: chrome or firefox
- **Build ID**: Version identifier
- **Platform**: Operating system and architecture
- **Path**: Local installation directory

### list-available

Show browsers available for download from online repositories.

```bash
butler-sheet-icons browser list-available [options]
```

#### Options

| Option | Description | Default | Valid Values |
|--------|-------------|---------|--------------|
| `--browser` | Browser type | `chrome` | `chrome`, `firefox` |
| `--channel` | Chrome release channel | `stable` | `stable`, `beta`, `dev`, `canary` |
| `--loglevel` | Logging verbosity | `info` | `error`, `warn`, `info`, `verbose`, `debug`, `silly` |

#### Chrome Channels

| Channel | Description | Recommended For |
|---------|-------------|-----------------|
| `stable` | Production-ready releases | Production environments |
| `beta` | Pre-release testing versions | Testing new features |
| `dev` | Development versions | Development environments |
| `canary` | Nightly builds | Advanced testing |

#### Examples

```bash
# List stable Chrome versions
butler-sheet-icons browser list-available

# List beta Chrome versions
butler-sheet-icons browser list-available --browser chrome --channel beta

# List Firefox versions
butler-sheet-icons browser list-available --browser firefox

# List with verbose output
butler-sheet-icons browser list-available --loglevel verbose
```

#### Example Output

```
2024-02-16T14:15:46.237Z info: Chrome versions from "stable" channel:
2024-02-16T14:15:49.320Z info:     121.0.6167.85, "chrome/platforms/mac/channels/stable/versions/121.0.6167.85"
2024-02-16T14:15:49.684Z info:     121.0.6167.75, "chrome/platforms/mac/channels/stable/versions/121.0.6167.75"
2024-02-16T14:15:52.633Z info:     120.0.6099.109, "chrome/platforms/mac/channels/stable/versions/120.0.6099.109"
```

### uninstall

Remove a specific browser version from the BSI cache.

```bash
butler-sheet-icons browser uninstall [options]
```

#### Options

| Option | Description | Default | Required |
|--------|-------------|---------|----------|
| `--browser` | Browser type | `chrome` | No |
| `--browser-version` | Browser version to remove | - | Yes |
| `--loglevel` | Logging verbosity | `info` | No |

#### Examples

```bash
# Remove specific Chrome version
butler-sheet-icons browser uninstall --browser chrome --browser-version 121.0.6167.85

# Remove Firefox version
butler-sheet-icons browser uninstall --browser firefox --browser-version 124.0a1
```

#### Example Output

```
2024-02-16T14:26:39.018Z info: Starting browser uninstallation
2024-02-16T14:26:39.018Z info: Uninstalling browser: chrome, build id=121.0.6167.85, platform=win64
2024-02-16T14:26:39.096Z info: Browser "chrome", version "121.0.6167.85" uninstalled.
```

::: tip Finding Version Numbers
Use the `list-installed` command to see the exact version numbers of browsers you want to uninstall.
:::

### uninstall-all

Remove all browsers from the BSI cache. This performs a complete cleanup of the browser cache directory.

```bash
butler-sheet-icons browser uninstall-all [options]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--loglevel` | Logging verbosity | `info` |

#### Example

```bash
butler-sheet-icons browser uninstall-all
```

#### Example Output

```
2024-02-16T14:29:24.989Z info: Starting uninstallation of all browsers
2024-02-16T14:29:24.991Z info: Uninstalling 2 browsers:
2024-02-16T14:29:24.992Z info:     Starting uninstallation of "chrome", build id "121.0.6167.85"
2024-02-16T14:29:25.880Z info:     Starting uninstallation of "firefox", build id "124.0a1"
2024-02-16T14:29:26.214Z info: Browser "chrome" (121.0.6167.85) uninstalled.
2024-02-16T14:29:26.214Z info: Browser "firefox" (124.0a1) uninstalled.
```

::: warning Complete Removal
This command removes ALL browsers from the BSI cache. You'll need to reinstall browsers before creating sheet icons.
:::

## Browser Usage in Sheet Icon Commands

When running sheet icon creation commands, you can specify browser preferences:

### Basic Browser Selection

```bash
# Use Chrome (default)
butler-sheet-icons qscloud create-sheet-icons --browser chrome ...

# Use Firefox
butler-sheet-icons qscloud create-sheet-icons --browser firefox ...
```

### Specific Version Control

```bash
# Use specific Chrome version
butler-sheet-icons qscloud create-sheet-icons \
  --browser chrome \
  --browser-version 121.0.6167.85 \
  ...
```

### Automatic Browser Download

If a specified browser/version isn't installed, BSI will attempt to download it automatically:

```bash
# This will download Chrome 121.0.6167.85 if not already installed
butler-sheet-icons qscloud create-sheet-icons \
  --browser chrome \
  --browser-version 121.0.6167.85 \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $API_KEY \
  --logonuserid user@company.com \
  --logonpwd password \
  --appid 12345678-1234-1234-1234-123456789012
```

## Browser Cache Locations

Browsers are stored in platform-specific cache directories:

| Platform | Cache Directory |
|----------|----------------|
| Windows | `C:\Users\<username>\.cache\puppeteer\` |
| macOS | `~/.cache/puppeteer/` |
| Linux | `~/.cache/puppeteer/` |

Each browser version is stored in its own subdirectory with the format:
`<browser>/<platform>-<version>/`

Example: `chrome/win64-121.0.6167.85/`

## Troubleshooting Browser Commands

### Download Failures

**Problem**: Browser download fails with 404 error
**Solution**: 
1. Check internet connectivity
2. Try a different browser version
3. Check proxy settings if behind a corporate firewall

```bash
# Check available versions first
butler-sheet-icons browser list-available --browser chrome

# Try installing a different version
butler-sheet-icons browser install --browser chrome --browser-version <available-version>
```

### Disk Space Issues

**Problem**: Installation fails due to insufficient disk space
**Solution**:
1. Check available disk space (browsers are 100-200MB each)
2. Remove unused browser versions
3. Use `uninstall-all` to clean the cache

```bash
# Check what's installed
butler-sheet-icons browser list-installed

# Remove specific versions
butler-sheet-icons browser uninstall --browser chrome --browser-version <old-version>

# Or clean everything
butler-sheet-icons browser uninstall-all
```

### Permission Issues

**Problem**: Cannot write to cache directory
**Solution**:
1. Ensure the user has write permissions to the cache directory
2. On Linux/macOS, check file permissions: `ls -la ~/.cache/`
3. On Windows, check folder permissions in File Explorer

### Proxy Configuration

**Problem**: Downloads fail behind corporate proxy
**Solution**: Configure proxy environment variables

**Windows:**
```powershell
$env:http_proxy='http://username:password@proxy.company.com:8080'
$env:https_proxy='http://username:password@proxy.company.com:8080'
```

**macOS/Linux:**
```bash
export http_proxy='http://username:password@proxy.company.com:8080'
export https_proxy='http://username:password@proxy.company.com:8080'
```

For more detailed browser management examples, see the [Browser Management Examples](/examples/browser-management) section.

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