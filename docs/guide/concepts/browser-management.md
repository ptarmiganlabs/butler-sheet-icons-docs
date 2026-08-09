# Browser Management

Butler Sheet Icons uses a headless web browser to automate the process of logging into Qlik Sense and capturing sheet thumbnails. Understanding how browser management works is essential for successful operation.

## How Browser Management Works

By default Butler Sheet Icons uses its own cache of browsers, completely separate from any browsers you might have installed on your computer. This approach ensures:

- **Consistency**: The same browser version across different environments
- **Isolation**: No interference with your personal browser settings
- **Control**: Ability to use specific browser versions for compatibility

In addition to the cached browsers managed by BSI, you can also point BSI at a specific system browser executable via the `PUPPETEER_EXECUTABLE_PATH` environment variable. That is covered in more detail on the [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) page.

## Supported Browsers

Butler Sheet Icons manages two browsers, but they are not interchangeable:

- **Chrome**: the only browser that can render sheet thumbnails. Full version control available, including specific build numbers.
- **Firefox**: can be installed, listed and removed with the `browser` commands, but **cannot be used to create thumbnails**.

::: warning Firefox is not available for thumbnails — BSI 4.0.0 or later
`--browser firefox` is rejected by `qseow create-sheet-thumbnails` and `qscloud create-sheet-thumbnails`:

```
error: option '--browser <browser>' argument 'firefox' is invalid. Allowed choices are chrome.
```

The same applies when the value comes from an environment variable:

```
error: option '--browser <browser>' value 'firefox' from env 'BSI_QSEOW_CST_BROWSER' is invalid. Allowed choices are chrome.
```

Firefox never actually worked for thumbnail creation — the rendering path drives the browser over the Chrome DevTools Protocol with a Chromium-only argument list — but earlier versions accepted the option and then failed later, in a way that was hard to interpret. It is now rejected up front.

`browser install`, `browser uninstall`, `browser uninstall-all` and `browser list-available` still accept `--browser firefox`.
:::

## Browser Cache Location

Browsers are downloaded and stored in a cache directory:

- **Windows**: `C:\Users\<username>\.cache\puppeteer\`
- **macOS/Linux**: `~/.cache/puppeteer/`

Each browser version is stored in its own subdirectory for easy management.  
There are Butler Sheet Icons browser management commands for installing, updating, and removing browsers.

## Initial Browser Setup

When running Butler Sheet Icons for the first time, you have several options. The most common ones are summarised below; the [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) page goes into more detail about detection order and environment variables.

### Automatic Download (Default)

If no browser is specified, BSI will automatically download the latest stable version of Chrome (when needed). From BSI 4.0.0 the download happens only once — later runs find the browser in the cache and reuse it, needing no download and no internet access for the browser itself. See [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables#_2-cached-browser-medium-priority) for the exact matching rules.

::: code-group

```bash [Bash]
# This will auto-download Chrome if none exists
butler-sheet-icons qscloud create-sheet-icons --tenanturl mytenant.eu.qlikcloud.com ...
```

```powershell [PowerShell]
# This will auto-download Chrome if none exists
butler-sheet-icons qscloud create-sheet-icons --tenanturl mytenant.eu.qlikcloud.com ...
```

:::

### Manual Browser Installation

You can pre-install browsers into the BSI cache using the browser management commands:

::: code-group

```bash [Bash]
# Install latest Chrome
butler-sheet-icons browser install

# Install specific Chrome version
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Install Firefox
butler-sheet-icons browser install --browser firefox
```

```powershell [PowerShell]
# Install latest Chrome
butler-sheet-icons browser install

# Install specific Chrome version
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Install Firefox
butler-sheet-icons browser install --browser firefox
```

:::

## Browser Selection

When running sheet icon creation commands, you can specify which browser to use from the BSI cache:

::: code-group

```bash [Bash]
# Use Chrome (the only browser accepted here, and the default)
butler-sheet-icons qscloud create-sheet-icons --browser chrome ...

# Use specific Chrome version
butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 121.0.6167.85 ...
```

```powershell [PowerShell]
# Use Chrome (the only browser accepted here, and the default)
butler-sheet-icons qscloud create-sheet-icons --browser chrome ...

# Use specific Chrome version
butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 121.0.6167.85 ...
```

:::

If you instead want to force BSI to use a _system_ browser (for example a centrally managed Chrome or Edge installation), set `PUPPETEER_EXECUTABLE_PATH` before running BSI. This is described in detail on the [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) page.

## Browser Versions and Compatibility

### Chrome Versions

Chrome versions use build numbers (e.g., `121.0.6167.85`). Butler Sheet Icons supports:

- **Latest stable**: Always recommended for most users
- **Specific versions**: Useful for environments requiring consistency
- **Multiple channels**: Stable, beta, dev, canary (though stable is recommended)

### Firefox Versions

Firefox is managed only by the `browser` commands — it cannot render thumbnails, so its version affects nothing about a thumbnail run. Firefox build ids are channel-prefixed, for example `stable_153.0.3`.

## Headless vs. Visible Browser

Butler Sheet Icons can run in two modes:

### Headless Mode (Default)

The browser runs in the background without a visible window:

::: code-group

```bash [Bash]
# Headless (default)
butler-sheet-icons qscloud create-sheet-icons --headless true ...
```

```powershell [PowerShell]
# Headless (default)
butler-sheet-icons qscloud create-sheet-icons --headless true ...
```

:::

**Advantages:**

- Faster execution
- No visual interruption
- Better for automated environments

### Visible Mode

The browser window is visible during operation:

::: code-group

```bash [Bash]
# Visible browser
butler-sheet-icons qscloud create-sheet-icons --headless false ...
```

```powershell [PowerShell]
# Visible browser
butler-sheet-icons qscloud create-sheet-icons --headless false ...
```

:::

**Advantages:**

- Great for debugging login issues
- Visual confirmation of what's happening
- Easier troubleshooting

## Proxy Server Support

If you're behind a corporate proxy, configure the following environment variables:

::: code-group

```bash [Bash]
export http_proxy='http://username:password@proxy.example.com:port'
export https_proxy='http://username:password@proxy.example.com:port'
```

```powershell [PowerShell]
$env:http_proxy='http://username:password@proxy.example.com:port'
$env:https_proxy='http://username:password@proxy.example.com:port'
```

:::

## Browser Management Commands

Butler Sheet Icons provides several commands for managing browsers:

- `browser list-installed`: Show currently cached browsers
- `browser list-available`: Show browsers available for download
- `browser install`: Download and install a browser
- `browser uninstall`: Remove a specific browser version
- `browser uninstall-all`: Remove all cached browsers

For detailed usage of these commands, see the [Browser Management Examples](/examples/browser-management) and [Commands Reference](/reference/commands).

## Common Browser Scenarios

### Development Environment

For development, you might want to see what's happening:

::: code-group

```bash [Bash]
butler-sheet-icons qscloud create-sheet-icons --headless false --loglevel debug ...
```

```powershell [PowerShell]
butler-sheet-icons qscloud create-sheet-icons --headless false --loglevel debug ...
```

:::

### Production Environment

For production, use headless mode with specific browser versions:

::: code-group

```bash [Bash]
butler-sheet-icons qscloud create-sheet-icons --headless true --browser chrome --browser-version 121.0.6167.85 ...
```

```powershell [PowerShell]
butler-sheet-icons qscloud create-sheet-icons --headless true --browser chrome --browser-version 121.0.6167.85 ...
```

:::

### Testing Environment

For testing different configurations:

::: code-group

```bash [Bash]
# Test a specific Chrome build
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 121.0.6167.85 ...

# Test another Chrome build
butler-sheet-icons browser install --browser chrome --browser-version 120.0.6099.109
butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 120.0.6099.109 ...
```

```powershell [PowerShell]
# Test a specific Chrome build
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 121.0.6167.85 ...

# Test another Chrome build
butler-sheet-icons browser install --browser chrome --browser-version 120.0.6099.109
butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 120.0.6099.109 ...
```

:::

## Troubleshooting Browser Issues

### Browser Download Fails

- Check your internet connection
- Verify proxy settings if behind a corporate firewall
- Try a different browser version

### Login Page Not Loading

- Switch to visible mode (`--headless false`) to see what's happening
- Check if you're being redirected to an SSO page
- Verify the tenant URL is correct

### Browser Crashes or Hangs

- Try uninstalling and reinstalling the browser
- Check if sufficient disk space is available
- Try a different browser version

### Memory Issues

- Increase the `--pagewait` setting to allow more time for page rendering
- Consider processing fewer apps at once
- Monitor system resources during execution

For more detailed troubleshooting, see the [Troubleshooting Guide](/guide/troubleshooting).
