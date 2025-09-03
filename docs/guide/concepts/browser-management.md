# Browser Management

Butler Sheet Icons uses an embedded web browser to automate the process of logging into Qlik Sense and capturing sheet thumbnails. Understanding how browser management works is essential for successful operation.

## How Browser Management Works

Butler Sheet Icons uses its own cache of browsers, completely separate from any browsers you might have installed on your computer. This approach ensures:

- **Consistency**: The same browser version across different environments
- **Isolation**: No interference with your personal browser settings
- **Control**: Ability to use specific browser versions for compatibility

## Supported Browsers

Butler Sheet Icons supports two major browsers:

- **Chrome**: Full version control available, including specific build numbers
- **Firefox**: Latest version available (specific version control pending)

## Browser Cache Location

Browsers are downloaded and stored in a cache directory:

- **Windows**: `C:\Users\<username>\.cache\puppeteer\`
- **macOS/Linux**: `~/.cache/puppeteer/`

Each browser version is stored in its own subdirectory for easy management.

## Initial Browser Setup

When running Butler Sheet Icons for the first time, you have several options:

### Automatic Download (Default)
If no browser is specified, BSI will automatically download the latest stable version of Chrome:

```bash
# This will auto-download Chrome if none exists
butler-sheet-icons qscloud create-sheet-icons --tenanturl mytenant.eu.qlikcloud.com ...
```

### Manual Browser Installation
You can pre-install browsers using the browser management commands:

```bash
# Install latest Chrome
butler-sheet-icons browser install

# Install specific Chrome version  
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Install Firefox
butler-sheet-icons browser install --browser firefox
```

## Browser Selection

When running sheet icon creation commands, you can specify which browser to use:

```bash
# Use Chrome (default)
butler-sheet-icons qscloud create-sheet-icons --browser chrome ...

# Use Firefox
butler-sheet-icons qscloud create-sheet-icons --browser firefox ...

# Use specific Chrome version
butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 121.0.6167.85 ...
```

## Browser Versions and Compatibility

### Chrome Versions
Chrome versions use build numbers (e.g., `121.0.6167.85`). Butler Sheet Icons supports:

- **Latest stable**: Always recommended for most users
- **Specific versions**: Useful for environments requiring consistency
- **Multiple channels**: Stable, beta, dev, canary (though stable is recommended)

### Firefox Versions
Firefox currently supports only the latest version. Specific version control is planned for future releases.

## Headless vs. Visible Browser

Butler Sheet Icons can run in two modes:

### Headless Mode (Default)
The browser runs in the background without a visible window:

```bash
# Headless (default)
butler-sheet-icons qscloud create-sheet-icons --headless true ...
```

**Advantages:**
- Faster execution
- No visual interruption
- Better for automated environments

### Visible Mode
The browser window is visible during operation:

```bash
# Visible browser
butler-sheet-icons qscloud create-sheet-icons --headless false ...
```

**Advantages:**
- Great for debugging login issues
- Visual confirmation of what's happening
- Easier troubleshooting

## Proxy Server Support

If you're behind a corporate proxy, configure the following environment variables:

**Windows (PowerShell):**
```powershell
$env:http_proxy='http://username:password@proxy.example.com:port'
$env:https_proxy='http://username:password@proxy.example.com:port'
```

**macOS/Linux:**
```bash
export http_proxy='http://username:password@proxy.example.com:port'
export https_proxy='http://username:password@proxy.example.com:port'
```

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

```bash
butler-sheet-icons qscloud create-sheet-icons --headless false --loglevel debug ...
```

### Production Environment  
For production, use headless mode with specific browser versions:

```bash
butler-sheet-icons qscloud create-sheet-icons --headless true --browser chrome --browser-version 121.0.6167.85 ...
```

### Testing Environment
For testing different configurations:

```bash
# Test with Chrome
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 121.0.6167.85 ...

# Test with Firefox
butler-sheet-icons browser install --browser firefox  
butler-sheet-icons qscloud create-sheet-icons --browser firefox ...
```

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