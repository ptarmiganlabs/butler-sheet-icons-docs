# Browser Commands Reference

Butler Sheet Icons (BSI) includes a comprehensive `browser` command that allows you to download, install, and manage browsers used for capturing sheet thumbnails. This command is particularly useful when you need specific browser versions for compatibility or testing purposes.

For details on how BSI decides which browser to use at runtime, and how environment variables like `PUPPETEER_EXECUTABLE_PATH` affect that behaviour, see the [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) concept page.

## Overview

BSI uses its own browser cache system and does not rely on browsers installed elsewhere on your system. This ensures consistency and allows for precise version control. The `browser` command manages both Chrome and Firefox across Windows, macOS, and Linux. Note that only Chrome can render sheet thumbnails — see [Supported Browsers](/guide/concepts/browser-management#supported-browsers).

## Basic Usage

The browser command follows this general pattern:

```bash
butler-sheet-icons browser [command] [options]
```

### Available Commands

| Command          | Description                                                              | Needs internet? |
| ---------------- | ------------------------------------------------------------------------ | --------------- |
| `list-installed` | Show which browsers are currently installed and available for use by BSI | No              |
| `list-available` | Show which browsers are available for download and installation          | Yes (Chrome)    |
| `install`        | Install a browser into the BSI cache                                     | Yes             |
| `uninstall`      | Uninstall a specific browser from the BSI cache                          | No              |
| `uninstall-all`  | Uninstall all browsers from the BSI cache                                | No              |
| `help`           | Display help for browser commands                                        | No              |

On a machine without internet access, only the commands marked "No" above will work. See [Which browser commands need internet access?](/guide/concepts/browser-detection-and-environment-variables#which-browser-commands-need-internet-access) for what the offline failures look like and how to prepare an air-gapped machine.

## Commands Reference

### list-installed

Lists browsers currently installed in the BSI cache. Note that this only shows browsers installed by BSI, not system-wide browser installations.

**Usage:**

```bash
butler-sheet-icons browser list-installed [options]
```

**Options:**

<!-- generated:cli-options browser list-installed -->

| Option                            | Environment Variable       | Description                                                   | Default | Example            |
| --------------------------------- | -------------------------- | ------------------------------------------------------------- | ------- | ------------------ |
| `--log-level, --loglevel <level>` | `BSI_BROWSER_LI_LOG_LEVEL` | Log level (choices: error, warn, info, verbose, debug, silly) | `info`  | `--loglevel error` |
| `-h, --help`                      | -                          | display help for command                                      | -       | `-h`               |

<!-- /generated:cli-options -->

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

<!-- generated:cli-options browser list-available -->

| Option                            | Environment Variable       | Description                                                                                                                                                      | Default  | Example             |
| --------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------- |
| `--log-level, --loglevel <level>` | `BSI_BROWSER_LA_LOG_LEVEL` | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                    | `info`   | `--loglevel error`  |
| `--browser <browser>`             | `BSI_BROWSER_LA_BROWSER`   | Browser to list available versions for (e.g. "chrome" or "firefox"). Use "butler-sheet-icons browser install" to install one of them. (choices: chrome, firefox) | `chrome` | `--browser firefox` |
| `--channel <channel>`             | `BSI_BROWSER_LA_CHANNEL`   | Which of the browser's release channel versions should be listed? This option is only used for Chrome. (choices: stable, beta, dev, canary)                      | `stable` | `--channel beta`    |
| `-h, --help`                      | -                          | display help for command                                                                                                                                         | -        | `-h`                |

<!-- /generated:cli-options -->

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

::: warning Needs internet access
For Chrome, this command asks Google's Chrome version history service which versions exist, so it only works on a machine that can reach the internet. On an offline machine, or behind a proxy that blocks outbound HTTPS, it reports:

```
error: Could not reach versionhistory.googleapis.com to look up available browser versions.
error: Butler Sheet Icons needs internet access for this command. If this machine is offline or
       behind a proxy, use "butler-sheet-icons browser list-installed" to see the browsers already
       available locally.
```

Use `browser list-installed` instead to see what is already available locally. For Firefox the command makes no network call at all — it reports that only the latest version is supported and returns.
:::

### install

Downloads and installs a browser into the BSI cache. By default, installs the Chrome build Butler Sheet Icons is tested with (`recommended`).

**Usage:**

```bash
butler-sheet-icons browser install [options]
```

**Options:**

<!-- generated:cli-options browser install -->

| Option                            | Environment Variable            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default       | Example             |
| --------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------- |
| `--log-level, --loglevel <level>` | `BSI_BROWSER_I_LOG_LEVEL`       | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                                                                                                                                                                                                                                                    | `info`        | `--loglevel error`  |
| `--browser <browser>`             | `BSI_BROWSER_I_BROWSER`         | Browser to install (e.g. "chrome" or "firefox"). Use "butler-sheet-icons browser list-installed" to see which browsers are currently installed. (choices: chrome, firefox)                                                                                                                                                                                                                                                                                       | `chrome`      | `--browser firefox` |
| `--browser-version <version>`     | `BSI_BROWSER_I_BROWSER_VERSION` | Browser build to install. Either a keyword - "recommended" for the build Butler Sheet Icons is tested with, "stable" for the newest stable release, or a release channel such as "beta" - or an exact version. For Chrome that is a milestone ("151"), a build prefix ("151.0.7922") or a full build id ("151.0.7922.77"); for Firefox a channel-prefixed build id ("stable_153.0.3"). Use "butler-sheet-icons browser list-available" to see what is available. | `recommended` | -                   |
| `-i, --interactive`               | -                               | Answer questions instead of assembling a command line.<br>Options already supplied - here or through their BSI\_\* environment variables - are kept and not asked about again.                                                                                                                                                                                                                                                                                   | -             | -                   |
| `-h, --help`                      | -                               | display help for command                                                                                                                                                                                                                                                                                                                                                                                                                                         | -             | `-h`                |

<!-- /generated:cli-options -->

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

**Chrome:** a milestone (`151`), a build prefix (`151.0.7922`) or a full build id (`151.0.7922.77`). Some older builds may no longer be downloadable — use `list-available` to see what is currently offered.

**Firefox:** a channel-prefixed build id such as `stable_153.0.3`. A bare version number is rejected, because it would be interpreted as a nightly build.

Both also accept the keywords `recommended` and `stable`, and a release channel. See [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build).

::: warning Older Chrome Versions
If you try to install an older Chrome version that's no longer available, you'll get a 404 error. The Chrome team periodically removes older versions from their download servers. Use a newer version instead.
:::

::: warning Needs internet access
`browser install` always needs internet access — it verifies that the requested build can actually be downloaded before installing it, so the check runs even when that version is already in the cache. Run it once while the machine is connected; the browser is then stored in the cache and reused on later runs without connectivity. See [Which browser commands need internet access?](/guide/concepts/browser-detection-and-environment-variables#which-browser-commands-need-internet-access).
:::

### uninstall

Removes a specific browser version from the BSI cache. This doesn't affect other browsers on your system, only those in the BSI cache.

::: tip Pick from a list instead of typing a version
`butler-sheet-icons interactive` offers the browsers actually in the cache, so you don't have to look up the exact build id first. See [Interactive Mode](/guide/interactive-mode).
:::

**Usage:**

```bash
butler-sheet-icons browser uninstall [options]
```

**Options:**

<!-- generated:cli-options browser uninstall -->

| Option                            | Environment Variable             | Description                                                                                                                                                                                                                                                              | Default      | Example             |
| --------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------------------- |
| `--log-level, --loglevel <level>` | `BSI_BROWSER_UI_LOG_LEVEL`       | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                                                            | `info`       | `--loglevel error`  |
| `--browser <browser>`             | `BSI_BROWSER_UI_BROWSER`         | Browser to uninstall (e.g. "chrome" or "firefox"). Use "butler-sheet-icons browser list-installed" to see which browsers are currently installed. (choices: chrome, firefox)                                                                                             | **Required** | `--browser firefox` |
| `--browser-version <version>`     | `BSI_BROWSER_UI_BROWSER_VERSION` | Browser build to uninstall: an exact build id (for Chrome e.g. "151.0.7922.77", for Firefox e.g. "stable_153.0.3"), or "recommended" for the build Butler Sheet Icons is tested with. Use "butler-sheet-icons browser list-installed" to see which builds are installed. | **Required** | -                   |
| `-i, --interactive`               | -                                | Answer questions instead of assembling a command line.<br>Options already supplied - here or through their BSI\_\* environment variables - are kept and not asked about again.                                                                                           | -            | -                   |
| `-h, --help`                      | -                                | display help for command                                                                                                                                                                                                                                                 | -            | `-h`                |

<!-- /generated:cli-options -->

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

#### Browsers built for another platform

::: warning Requires BSI 4.1.0 or later
In earlier versions this command could report that it had removed a browser while the browser was still on disk. It printed a success message, exited with code 0, and left the files in place.
:::

The BSI cache labels each browser with the platform it was built for — `win64`, `mac_arm`, `linux`, and so on. A cache can hold builds for another platform in several ordinary ways:

- The cache directory was copied from one machine to another, for example when preparing an offline server.
- The cache is on a shared or network drive used by more than one machine.
- The cache is mounted into a Docker container from a host running a different operating system.

Such builds **can** be removed — a browser you cannot run still takes up disk space. From 4.1.0 the removal actually happens, and the result is verified before success is reported.

When removal fails, the command says so and exits with a non-zero code, so a scheduled job can detect it:

```
error: Browser "chrome", version "151.0.7922.47" (built for win64) could not be removed. It is still in the cache at C:\Users\goran\.cache\puppeteer\chrome\win64-151.0.7922.47.
```

When the same version is cached for more than one platform, the build that can run on the current machine is removed first, and the ambiguity is reported:

```
warn: Build 151.0.7922.47 is cached for 2 platforms (win64, mac_arm). Removing the "win64" build; re-run to remove the next one.
```

Run the command again to remove the second one.

::: tip Worth checking once
If you have previously cleaned up browsers on a machine, run `browser list-installed` to check whether builds you believed were deleted are still there. If they are, `browser uninstall` will now remove them properly.
:::

### uninstall-all

Removes all browsers from the BSI cache. This is useful for cleaning up or resetting your browser cache.

**Usage:**

```bash
butler-sheet-icons browser uninstall-all [options]
```

**Options:**

<!-- generated:cli-options browser uninstall-all -->

| Option                            | Environment Variable       | Description                                                   | Default | Example            |
| --------------------------------- | -------------------------- | ------------------------------------------------------------- | ------- | ------------------ |
| `--log-level, --loglevel <level>` | `BS_BROWSER_UIA_LOG_LEVEL` | Log level (choices: error, warn, info, verbose, debug, silly) | `info`  | `--loglevel error` |
| `-h, --help`                      | -                          | display help for command                                      | -       | `-h`               |

<!-- /generated:cli-options -->

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

# Pin a different Chrome build for QSEoW
butler-sheet-icons qseow create-sheet-thumbnails \
  --host sense.company.com \
  --app-id "app-456" \
  --browser chrome \
  --browser-version 120.0.6099.109
```

## Browser Cache Location

BSI stores browsers in a cache directory under the home directory of the user running BSI:

- **Windows:** `%USERPROFILE%\.cache\puppeteer\`
- **macOS:** `~/.cache/puppeteer/`
- **Linux:** `~/.cache/puppeteer/`

These directories contain the actual browser binaries and are managed automatically by BSI.

Because the cache lives under the user's home directory, a browser installed by one user account is not visible to another. When BSI runs as a service account — for example from a scheduled task — install the browser as that same account, or point all accounts at one shared browser with `PUPPETEER_EXECUTABLE_PATH`.

## Related Documentation

- [Browser Management Concepts](/guide/concepts/browser-management) - Understanding BSI's browser system
- [Browser Management Examples](/examples/browser-management) - Hands-on browser management examples
- [Commands Overview](/reference/commands) - Complete command reference including QS Cloud and QSEoW
- [Troubleshooting](/guide/troubleshooting) - Solving browser-related issues
