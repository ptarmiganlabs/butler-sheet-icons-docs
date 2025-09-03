# Browser Management Examples

These examples demonstrate how to use Butler Sheet Icons' browser management features for different scenarios and platforms.

## Prerequisites

Before running these examples, ensure you have Butler Sheet Icons installed. Download the latest version from the [releases page](https://github.com/ptarmiganlabs/butler-sheet-icons/releases).

## Basic Browser Operations

### List Currently Installed Browsers

Check which browsers are currently available in the BSI cache:

**Windows:**
```powershell
.\butler-sheet-icons.exe browser list-installed
```

**macOS/Linux:**
```bash
./butler-sheet-icons browser list-installed
```

**Example Output:**
```
2024-02-16T14:10:55.141Z info: App version: 3.2.3
2024-02-16T14:10:55.141Z info: Installed browsers:
2024-02-16T14:10:55.156Z info:     chrome, build id=121.0.6167.85, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-121.0.6167.85
2024-02-16T14:10:55.156Z info:     firefox, build id=124.0a1, platform=win64, path=C:\Users\goran\.cache\puppeteer\firefox\win64-124.0a1
```

### Install Default Browser (Latest Chrome)

Install the latest stable version of Chrome:

**Windows:**
```powershell
.\butler-sheet-icons.exe browser install
```

**macOS/Linux:**
```bash
./butler-sheet-icons browser install
```

**Example Output:**
```
2024-02-16T14:13:35.312Z info: App version: 3.2.3
2024-02-16T14:13:35.484Z info: Resolved browser build id: "121.0.6167.85" for browser "chrome" version "stable"
2024-02-16T14:13:35.562Z info: Installing browser...
2024-02-16T14:13:44.062Z info: Browser "chrome" version "121.0.6167.85" installed
```

### Install Firefox

Install the latest version of Firefox:

**Windows:**
```powershell
.\butler-sheet-icons.exe browser install --browser firefox
```

**macOS/Linux:**
```bash
./butler-sheet-icons browser install --browser firefox
```

**Example Output:**
```
2024-02-16T14:17:47.673Z info: App version: 3.2.3
2024-02-16T14:17:47.976Z info: Resolved browser build id: "124.0a1" for browser "firefox" version "latest"
2024-02-16T14:17:48.343Z info: Installing browser...
2024-02-16T14:19:06.845Z info: Browser "firefox" version "124.0a1" installed
```

## Advanced Browser Management

### Install Specific Chrome Version

First, check available versions:

**Windows:**
```powershell
.\butler-sheet-icons.exe browser list-available --browser chrome --channel stable
```

**macOS/Linux:**
```bash
./butler-sheet-icons browser list-available --browser chrome --channel stable
```

**Example Output:**
```
2024-02-16T14:15:46.237Z info: App version: 3.2.3
2024-02-16T14:15:46.677Z info: Chrome versions from "stable" channel:
2024-02-16T14:15:49.320Z info:     121.0.6167.85, "chrome/platforms/mac/channels/stable/versions/121.0.6167.85"
2024-02-16T14:15:49.684Z info:     121.0.6167.75, "chrome/platforms/mac/channels/stable/versions/121.0.6167.75"
2024-02-16T14:15:52.633Z info:     120.0.6099.109, "chrome/platforms/mac/channels/stable/versions/120.0.6099.109"
```

Then install a specific version:

**Windows:**
```powershell
.\butler-sheet-icons.exe browser install --browser chrome --browser-version 121.0.6167.85
```

**macOS/Linux:**
```bash
./butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
```

### Check Available Chrome Channels

View different Chrome release channels:

**Stable Channel:**
```bash
./butler-sheet-icons browser list-available --browser chrome --channel stable
```

**Beta Channel:**
```bash
./butler-sheet-icons browser list-available --browser chrome --channel beta
```

**Dev Channel:**
```bash
./butler-sheet-icons browser list-available --browser chrome --channel dev
```

### Uninstall Specific Browser Version

Remove a specific browser version from the cache:

**Windows:**
```powershell
.\butler-sheet-icons.exe browser uninstall --browser chrome --browser-version 121.0.6167.85
```

**macOS/Linux:**
```bash
./butler-sheet-icons browser uninstall --browser chrome --browser-version 121.0.6167.85
```

**Example Output:**
```
2024-02-16T14:26:39.018Z info: App version: 3.2.3
2024-02-16T14:26:39.018Z info: Starting browser uninstallation
2024-02-16T14:26:39.018Z info: Uninstalling browser: chrome, build id=121.0.6167.85, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-121.0.6167.85
2024-02-16T14:26:39.096Z info: Browser "chrome", version "121.0.6167.85" uninstalled.
```

### Remove All Browsers

Clean the entire browser cache:

**Windows:**
```powershell
.\butler-sheet-icons.exe browser uninstall-all
```

**macOS/Linux:**
```bash
./butler-sheet-icons browser uninstall-all
```

**Example Output:**
```
2024-02-16T14:29:24.989Z info: App version: 3.2.3
2024-02-16T14:29:24.990Z info: Starting uninstallation of all browsers
2024-02-16T14:29:24.991Z info: Uninstalling 2 browsers:
2024-02-16T14:29:24.992Z info:     Starting uninstallation of "chrome", build id "121.0.6167.85"
2024-02-16T14:29:25.880Z info:     Starting uninstallation of "firefox", build id "124.0a1"
2024-02-16T14:29:26.214Z info: Browser "chrome" (121.0.6167.85) uninstalled.
2024-02-16T14:29:26.214Z info: Browser "firefox" (124.0a1) uninstalled.
```

## Using Browsers with Sheet Icon Creation

### Use Default Browser

The simplest approach - BSI will use or download Chrome automatically:

**QS Cloud:**
```bash
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012
```

### Specify Browser Type

Use a specific browser for sheet icon creation:

**Using Chrome:**
```bash
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012 \
  --browser chrome
```

**Using Firefox:**
```bash
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012 \
  --browser firefox
```

### Use Specific Browser Version

For production environments requiring consistency:

```bash
# First install the specific version
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Then use it for sheet icon creation
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012 \
  --browser chrome \
  --browser-version 121.0.6167.85
```

## Environment-Specific Examples

### Development Environment

For debugging and development, use visible browser mode:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012 \
  --headless false \
  --loglevel debug \
  --browser chrome
```

### CI/CD Pipeline

For automated environments, ensure consistent browser versions:

```bash
#!/bin/bash
# Install specific browser version
./butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Create sheet icons with specific browser
./butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl $QS_TENANT_URL \
  --apikey $QS_API_KEY \
  --logonuserid $QS_USER \
  --logonpwd $QS_PASSWORD \
  --collectionid $QS_COLLECTION_ID \
  --headless true \
  --browser chrome \
  --browser-version 121.0.6167.85 \
  --loglevel info
```

### Docker Environment

When using BSI in Docker, browsers are downloaded into the container:

```bash
# List browsers in container
docker run -it --rm ptarmiganlabs/butler-sheet-icons:latest browser list-installed

# Install specific browser in container
docker run -it --rm ptarmiganlabs/butler-sheet-icons:latest browser install --browser firefox

# Use specific browser for sheet icons
docker run -it --rm \
  -v /local/img:/nodeapp/img \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012 \
  --browser firefox \
  --headless true
```

## Troubleshooting Browser Issues

### Check Browser Installation Status

Complete diagnostic of browser setup:

```bash
# Check what's installed
./butler-sheet-icons browser list-installed

# Check what's available for download
./butler-sheet-icons browser list-available --browser chrome

# Check Firefox availability
./butler-sheet-icons browser list-available --browser firefox
```

### Clean Browser Cache and Reinstall

If experiencing browser issues:

```bash
# Remove all browsers
./butler-sheet-icons browser uninstall-all

# Reinstall fresh browsers
./butler-sheet-icons browser install --browser chrome
./butler-sheet-icons browser install --browser firefox

# Verify installation
./butler-sheet-icons browser list-installed
```

### Test Browser Functionality

Use visible mode to test browser operation:

```bash
./butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012 \
  --headless false \
  --pagewait 10 \
  --loglevel verbose
```

## Platform-Specific Notes

### Windows
- Browsers are stored in `C:\Users\<username>\.cache\puppeteer\`
- Use PowerShell for the best experience
- Windows Defender might scan downloaded browsers (causing slight delays)

### macOS
- Browsers are stored in `~/.cache/puppeteer/`
- BSI binaries are notarized by Apple
- First run might show a security warning (this is normal)

### Linux
- Browsers are stored in `~/.cache/puppeteer/`
- Ensure sufficient disk space for browser downloads
- Some distributions might require additional dependencies

## Best Practices

### For Production
1. **Use specific browser versions** to ensure consistency
2. **Pre-install browsers** rather than downloading during execution
3. **Use headless mode** for better performance
4. **Monitor disk space** as browsers can be large (100-200MB each)

### For Development
1. **Use visible mode** when debugging login issues
2. **Keep multiple browser versions** for testing compatibility
3. **Use verbose logging** to understand what's happening
4. **Test with both Chrome and Firefox** to ensure compatibility

### For CI/CD
1. **Cache browser downloads** between pipeline runs
2. **Use specific versions** to avoid unexpected changes
3. **Include browser installation** in your deployment scripts
4. **Test browser functionality** as part of your pipeline

For more information about browser management concepts, see the [Browser Management Guide](/guide/concepts/browser-management).