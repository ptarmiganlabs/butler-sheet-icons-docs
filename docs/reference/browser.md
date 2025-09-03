# Browser Commands Reference

Butler Sheet Icons (BSI) includes a comprehensive `browser` command that allows you to download, install, and manage browsers used for capturing sheet thumbnails. This command is particularly useful when you need specific browser versions for compatibility or testing purposes.

## Overview

BSI uses its own browser cache system and does not rely on browsers installed elsewhere on your system. This ensures consistency and allows for precise version control. The browser command supports Chrome and Firefox across Windows, macOS, and Linux platforms.

## Basic Usage

The browser command follows this general pattern:

```bash
butler-sheet-icons browser [command] [options]
```

### Available Commands

| Command | Description |
|---------|-------------|
| `list-installed` | Show which browsers are currently installed and available for use by BSI |
| `list-available` | Show which browsers are available for download and installation |
| `install` | Install a browser into the BSI cache |
| `uninstall` | Uninstall a specific browser from the BSI cache |
| `uninstall-all` | Uninstall all browsers from the BSI cache |
| `help` | Display help for browser commands |

## Commands Reference

### list-installed

Lists browsers currently installed in the BSI cache. Note that this only shows browsers installed by BSI, not system-wide browser installations.

**Usage:**
```bash
butler-sheet-icons browser list-installed [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--loglevel, --log-level <level>` | Set log level (error, warn, info, verbose, debug, silly) | info |
| `-h, --help` | Display help for command | |

**Example Output (Windows):**
```powershell
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser list-installed
2024-02-16T14:10:55.141Z info: App version: 3.2.3
2024-02-16T14:10:55.141Z info: Installed browsers:
2024-02-16T14:10:55.156Z info:     chrome, build id=121.0.6167.85, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-121.0.6167.85
```

### list-available

Shows which browser versions are available for download. BSI automatically detects your operating system and only displays compatible versions.

**Usage:**
```bash
butler-sheet-icons browser list-available [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--loglevel, --log-level <level>` | Set log level (error, warn, info, verbose, debug, silly) | info |
| `--browser <browser>` | Browser to check availability for (chrome, firefox) | chrome |
| `--channel <channel>` | Chrome release channel (stable, beta, dev, canary) | stable |
| `-h, --help` | Display help for command | |

**Example Output (macOS):**
```bash
➜  butler-sheet-icons ./butler-sheet-icons browser list-available --browser chrome --channel stable
2024-02-16T14:15:46.237Z info: App version: 3.2.3
2024-02-16T14:15:46.677Z info: Chrome versions from "stable" channel:
2024-02-16T14:15:49.320Z info:     121.0.6167.85, "chrome/platforms/mac/channels/stable/versions/121.0.6167.85"
2024-02-16T14:15:49.684Z info:     121.0.6167.75, "chrome/platforms/mac/channels/stable/versions/121.0.6167.75"
2024-02-16T14:15:52.633Z info:     120.0.6099.109, "chrome/platforms/mac/channels/stable/versions/120.0.6099.109"
...
```

::: tip Build IDs
Note the build IDs (e.g., 121.0.6167.85) in the output. These are the exact identifiers to use when installing specific Chrome versions.
:::

### install

Downloads and installs a browser into the BSI cache. By default, installs the latest stable version of Chrome.

**Usage:**
```bash
butler-sheet-icons browser install [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--loglevel, --log-level <level>` | Set log level (error, warn, info, verbose, debug, silly) | info |
| `--browser <browser>` | Browser to install (chrome, firefox) | chrome |
| `--browser-version <version>` | Specific version/build ID to install | latest |
| `-h, --help` | Display help for command | |

**Examples:**

Install latest Chrome (Windows):
```powershell
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser install
2024-02-16T14:13:35.312Z info: App version: 3.2.3
2024-02-16T14:13:35.484Z info: Resolved browser build id: "121.0.6167.85" for browser "chrome" version "stable"
2024-02-16T14:13:35.562Z info: Installing browser...
2024-02-16T14:13:44.062Z info: Browser "chrome" version "121.0.6167.85" installed
```

Install latest Firefox (macOS):
```bash
➜  butler-sheet-icons ./butler-sheet-icons browser install --browser firefox --browser-version latest
2024-02-16T14:17:47.673Z info: App version: 3.2.3
2024-02-16T14:17:47.976Z info: Resolved browser build id: "124.0a1" for browser "firefox" version "latest"
2024-02-16T14:17:48.343Z info: Installing browser...
2024-02-16T14:19:06.845Z info: Browser "firefox" version "124.0a1" installed
```

#### Browser Version Notes

**Chrome Versions:**
- Chrome supports specific build IDs (e.g., `121.0.6167.85`)
- Some older Chrome versions may no longer be available for download
- Use `list-available` to see what versions are currently downloadable

**Firefox Versions:**
- Currently, only the `latest` version of Firefox is supported
- Specific version support for Firefox is pending

::: warning Older Chrome Versions
If you try to install an older Chrome version that's no longer available, you'll get a 404 error. The Chrome team periodically removes older versions from their download servers. Use a newer version instead.
:::

### uninstall

Removes a specific browser version from the BSI cache. This doesn't affect other browsers on your system, only those in the BSI cache.

**Usage:**
```bash
butler-sheet-icons browser uninstall [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--loglevel, --log-level <level>` | Set log level (error, warn, info, verbose, debug, silly) | info |
| `--browser <browser>` | Browser to uninstall (chrome, firefox) | chrome |
| `--browser-version <version>` | Specific version/build ID to uninstall | |
| `-h, --help` | Display help for command | |

**Example (Windows):**
```powershell
# First, see what's installed
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser list-installed
2024-02-16T14:24:20.096Z info: App version: 3.2.3
2024-02-16T14:24:20.112Z info: Installed browsers:
2024-02-16T14:24:20.112Z info:     chrome, build id=121.0.6167.85, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-121.0.6167.85
2024-02-16T14:24:20.112Z info:     firefox, build id=124.0a1, platform=win64, path=C:\Users\goran\.cache\puppeteer\firefox\win64-124.0a1

# Uninstall specific Chrome version
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser uninstall --browser-version 121.0.6167.85
2024-02-16T14:26:39.018Z info: App version: 3.2.3
2024-02-16T14:26:39.018Z info: Starting browser uninstallation
2024-02-16T14:26:39.018Z info: Uninstalling browser: chrome, build id=121.0.6167.85, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-121.0.6167.85
2024-02-16T14:26:39.096Z info: Browser "chrome", version "121.0.6167.85" uninstalled.

# Verify uninstallation
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser list-installed
2024-02-16T14:26:44.597Z info: App version: 3.2.3
2024-02-16T14:26:44.597Z info: Installed browsers:
2024-02-16T14:26:44.613Z info:     firefox, build id=124.0a1, platform=win64, path=C:\Users\goran\.cache\puppeteer\firefox\win64-124.0a1
```

### uninstall-all

Removes all browsers from the BSI cache. This is useful for cleaning up or resetting your browser cache.

**Usage:**
```bash
butler-sheet-icons browser uninstall-all [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--loglevel, --log-level <level>` | Set log level (error, warn, info, verbose, debug, silly) | info |
| `-h, --help` | Display help for command | |

**Example (macOS):**
```bash
# Check current installations
➜  butler-sheet-icons ./butler-sheet-icons browser list-installed
2024-02-16T14:27:20.425Z info: App version: 3.2.3
2024-02-16T14:27:20.427Z info: Installed browsers:
2024-02-16T14:27:20.428Z info:     chrome, build id=121.0.6167.85, platform=mac, path=/Users/goran/.cache/puppeteer/chrome/mac-121.0.6167.85
2024-02-16T14:27:20.428Z info:     firefox, build id=124.0a1, platform=mac, path=/Users/goran/.cache/puppeteer/firefox/mac-124.0a1

# Remove all browsers
➜  butler-sheet-icons ./butler-sheet-icons browser uninstall-all
2024-02-16T14:29:24.989Z info: App version: 3.2.3
2024-02-16T14:29:24.990Z info: Starting uninstallation of all browsers
2024-02-16T14:29:24.991Z info: Uninstalling 2 browsers:
2024-02-16T14:29:24.992Z info:     Starting uninstallation of "chrome", build id "121.0.6167.85", platform "mac", path "/Users/goran/.cache/puppeteer/chrome/mac-121.0.6167.85"
2024-02-16T14:29:25.880Z info:     Starting uninstallation of "firefox", build id "124.0a1", platform "mac", path "/Users/goran/.cache/puppeteer/firefox/mac-124.0a1"
2024-02-16T14:29:26.214Z info: Removing any remaining files and directories in the browser cache directory
2024-02-16T14:29:26.214Z info: Browser "chrome" (121.0.6167.85) uninstalled.
2024-02-16T14:29:26.214Z info: Browser "firefox" (124.0a1) uninstalled.

# Verify all browsers removed
➜  butler-sheet-icons ./butler-sheet-icons browser list-installed
2024-02-16T14:29:29.943Z info: App version: 3.2.3
2024-02-16T14:29:29.944Z info: No browsers installed
```

## Common Use Cases

### Development Environment Setup

1. **Install latest stable browsers:**
   ```bash
   # Install latest Chrome
   butler-sheet-icons browser install
   
   # Install latest Firefox
   butler-sheet-icons browser install --browser firefox
   ```

2. **Verify installation:**
   ```bash
   butler-sheet-icons browser list-installed
   ```

### CI/CD Pipeline Setup

In automated environments, you might want to ensure specific browser versions:

```bash
# Install specific Chrome version for reproducible builds
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Verify the exact version is installed
butler-sheet-icons browser list-installed
```

### Troubleshooting Browser Issues

If you're experiencing browser-related problems:

1. **Check available versions:**
   ```bash
   butler-sheet-icons browser list-available --browser chrome
   ```

2. **Clean browser cache:**
   ```bash
   butler-sheet-icons browser uninstall-all
   ```

3. **Reinstall browsers:**
   ```bash
   butler-sheet-icons browser install --browser chrome
   butler-sheet-icons browser install --browser firefox
   ```

## Integration with Sheet Commands

Browser commands work seamlessly with BSI's sheet thumbnail creation commands. Once browsers are installed, you can specify which browser to use:

```bash
# Use specific browser for QS Cloud
butler-sheet-icons qscloud create-sheet-thumbnails \
  --tenant your-tenant \
  --app-id "app-123" \
  --browser chrome \
  --browser-version 121.0.6167.85

# Use Firefox for QSEoW
butler-sheet-icons qseow create-sheet-thumbnails \
  --host sense.company.com \
  --app-id "app-456" \
  --browser firefox
```

## Browser Cache Location

BSI stores browsers in platform-specific cache directories:

- **Windows:** `%USERPROFILE%\.cache\puppeteer\`
- **macOS:** `~/Library/Caches/puppeteer/` or `~/.cache/puppeteer/`
- **Linux:** `~/.cache/puppeteer/`

These directories contain the actual browser binaries and are managed automatically by BSI.

## Related Documentation

- [Browser Management Concepts](/guide/concepts/browser-management) - Understanding BSI's browser system
- [Browser Management Examples](/examples/browser-management) - Hands-on browser management examples
- [Commands Overview](/reference/commands) - Complete command reference including QS Cloud and QSEoW
- [Troubleshooting](/guide/troubleshooting) - Solving browser-related issues