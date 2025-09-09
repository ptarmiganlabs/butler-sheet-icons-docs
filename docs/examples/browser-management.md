# Browser Management Examples

These examples show how to list, install, select, and remove browsers used by Butler Sheet Icons. All commands are provided for macOS/Linux (Bash) and Windows (PowerShell).

## Prerequisites

- Install Butler Sheet Icons from the releases page
- Ensure you can run the executable
  - macOS/Linux: `./butler-sheet-icons`
  - Windows: `./butler-sheet-icons.exe` (or `butler-sheet-icons.exe`)

## Basic operations

### List currently installed browsers

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons browser list-installed
```

```powershell [Windows PowerShell]
./butler-sheet-icons.exe browser list-installed
```

:::

Example output:

```text
2024-02-16T14:10:55.141Z info: App version: 3.2.3
2024-02-16T14:10:55.141Z info: Installed browsers:
2024-02-16T14:10:55.156Z info:     chrome, build id=121.0.6167.85, platform=mac, path=/Users/you/.cache/puppeteer/chrome/mac-121.0.6167.85
2024-02-16T14:10:55.156Z info:     firefox, build id=124.0a1, platform=mac, path=/Users/you/.cache/puppeteer/firefox/mac-124.0a1
```

### Install default browser (latest Chrome)

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons browser install
```

```powershell [Windows PowerShell]
./butler-sheet-icons.exe browser install
```

:::

Example output:

```text
2024-02-16T14:13:35.312Z info: App version: 3.2.3
2024-02-16T14:13:35.484Z info: Resolved browser build id: "121.0.6167.85" for browser "chrome" version "stable"
2024-02-16T14:13:35.562Z info: Installing browser...
2024-02-16T14:13:44.062Z info: Browser "chrome" version "121.0.6167.85" installed
```

### Install Firefox (latest)

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons browser install --browser firefox
```

```powershell [Windows PowerShell]
./butler-sheet-icons.exe browser install --browser firefox
```

:::

### List available Chrome builds (channels)

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons browser list-available --browser chrome --channel stable
```

```powershell [Windows PowerShell]
./butler-sheet-icons.exe browser list-available --browser chrome --channel stable
```

:::

### Install a specific Chrome version

First list available versions (see above), then install:

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
```

```powershell [Windows PowerShell]
./butler-sheet-icons.exe browser install --browser chrome --browser-version 121.0.6167.85
```

:::

### Uninstall a specific browser version

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons browser uninstall --browser chrome --browser-version 121.0.6167.85
```

```powershell [Windows PowerShell]
./butler-sheet-icons.exe browser uninstall --browser chrome --browser-version 121.0.6167.85
```

:::

### Remove all cached browsers

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons browser uninstall-all
```

```powershell [Windows PowerShell]
./butler-sheet-icons.exe browser uninstall-all
```

:::

## Using browsers when creating sheet icons

### Use default browser

BSI will download and use the default browser (Chrome) if needed:

::: code-group

```bash [macOS/Linux]
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012
```

```powershell [Windows PowerShell]
./butler-sheet-icons.exe qscloud create-sheet-icons `
  --tenanturl mytenant.eu.qlikcloud.com `
  --apikey $env:BSI_API_KEY `
  --logonuserid user@company.com `
  --logonpwd mypassword `
  --appid 12345678-1234-1234-1234-123456789012
```

:::

### Specify browser type (Chrome/Firefox)

::: code-group

```bash [macOS/Linux]
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012 \
  --browser chrome
```

```powershell [Windows PowerShell]
./butler-sheet-icons.exe qscloud create-sheet-icons `
  --tenanturl mytenant.eu.qlikcloud.com `
  --apikey $env:BSI_API_KEY `
  --logonuserid user@company.com `
  --logonpwd mypassword `
  --appid 12345678-1234-1234-1234-123456789012 `
  --browser chrome
```

:::

Using Firefox works the same, set `--browser firefox`.

### Use a specific browser version

Install and then use a pinned version for consistency:

::: code-group

```bash [macOS/Linux]
# Install specific version
./butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Use it
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_API_KEY \
  --logonuserid user@company.com \
  --logonpwd mypassword \
  --appid 12345678-1234-1234-1234-123456789012 \
  --browser chrome \
  --browser-version 121.0.6167.85
```

```powershell [Windows PowerShell]
# Install specific version
./butler-sheet-icons.exe browser install --browser chrome --browser-version 121.0.6167.85

# Use it
./butler-sheet-icons.exe qscloud create-sheet-icons `
  --tenanturl mytenant.eu.qlikcloud.com `
  --apikey $env:BSI_API_KEY `
  --logonuserid user@company.com `
  --logonpwd mypassword `
  --appid 12345678-1234-1234-1234-123456789012 `
  --browser chrome `
  --browser-version 121.0.6167.85
```

:::

## Docker usage

Browsers in Docker are downloaded inside the container.

::: code-group

```bash [macOS/Linux]
# List browsers in container
docker run -it --rm ptarmiganlabs/butler-sheet-icons:latest browser list-installed

# Install Firefox in container
docker run -it --rm ptarmiganlabs/butler-sheet-icons:latest browser install --browser firefox

# Use Firefox for sheet icons
docker run -it --rm \
  -v $(pwd)/images:/nodeapp/img \
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

```powershell [Windows PowerShell]
# List browsers in container
docker run -it --rm ptarmiganlabs/butler-sheet-icons:latest browser list-installed

# Install Firefox in container
docker run -it --rm ptarmiganlabs/butler-sheet-icons:latest browser install --browser firefox

# Use Firefox for sheet icons
docker run -it --rm `
  -v ${PWD}/images:/nodeapp/img `
  ptarmiganlabs/butler-sheet-icons:latest `
  qscloud create-sheet-icons `
  --tenanturl mytenant.eu.qlikcloud.com `
  --apikey $env:BSI_API_KEY `
  --logonuserid user@company.com `
  --logonpwd mypassword `
  --appid 12345678-1234-1234-1234-123456789012 `
  --browser firefox `
  --headless true
```

:::

## Diagnostics and troubleshooting

### Full diagnostic of browser setup

::: code-group

```bash [macOS/Linux]
# Installed browsers
./butler-sheet-icons browser list-installed

# Available Chrome builds
./butler-sheet-icons browser list-available --browser chrome

# Available Firefox builds
./butler-sheet-icons browser list-available --browser firefox
```

```powershell [Windows PowerShell]
# Installed browsers
./butler-sheet-icons.exe browser list-installed

# Available Chrome builds
./butler-sheet-icons.exe browser list-available --browser chrome

# Available Firefox builds
./butler-sheet-icons.exe browser list-available --browser firefox
```

:::

### Clean cache and reinstall

::: code-group

```bash [macOS/Linux]
# Remove all
./butler-sheet-icons browser uninstall-all

# Reinstall common browsers
./butler-sheet-icons browser install --browser chrome
./butler-sheet-icons browser install --browser firefox

# Verify
./butler-sheet-icons browser list-installed
```

```powershell [Windows PowerShell]
# Remove all
./butler-sheet-icons.exe browser uninstall-all

# Reinstall common browsers
./butler-sheet-icons.exe browser install --browser chrome
./butler-sheet-icons.exe browser install --browser firefox

# Verify
./butler-sheet-icons.exe browser list-installed
```

:::

### Visible mode test (debugging)

::: code-group

```bash [macOS/Linux]
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

```powershell [Windows PowerShell]
./butler-sheet-icons.exe qscloud create-sheet-icons `
  --tenanturl mytenant.eu.qlikcloud.com `
  --apikey $env:BSI_API_KEY `
  --logonuserid user@company.com `
  --logonpwd mypassword `
  --appid 12345678-1234-1234-1234-123456789012 `
  --headless false `
  --pagewait 10 `
  --loglevel verbose
```

:::

## Platform-specific notes

### Windows

- Browsers are stored in `C:\Users\<username>\.cache\puppeteer\`
- Use PowerShell for the best experience
- Windows Defender might scan downloaded browsers (slight delays)

### macOS

- Browsers are stored in `~/.cache/puppeteer/`
- BSI binaries are notarized by Apple
- First run might show a security warning (normal)

### Linux

- Browsers are stored in `~/.cache/puppeteer/`
- Ensure sufficient disk space for browser downloads
- Some distributions might require additional dependencies

## Best practices

### Production

1. Use specific browser versions to ensure consistency
2. Pre-install browsers rather than downloading during execution
3. Use headless mode for better performance
4. Monitor disk space (browsers are 100–200 MB each)

### Development

1. Use visible mode when debugging login issues
2. Keep multiple browser versions for compatibility testing
3. Use verbose logging to understand behavior
4. Test with both Chrome and Firefox

### CI/CD

1. Cache browser downloads between pipeline runs
2. Use specific versions to avoid unexpected changes
3. Include browser installation in your deployment scripts
4. Test browser functionality in your pipeline

For conceptual information, see the Browser Management Guide.
