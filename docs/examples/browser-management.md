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
2024-02-16T14:10:55.156Z info:     chrome, build id=151.0.7922.77, platform=mac, path=/Users/you/.cache/puppeteer/chrome/mac-151.0.7922.77
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

### Specify browser type

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

`chrome` is the only value `--browser` accepts, on this and every other command — see [Supported Browsers](/guide/concepts/browser-management#supported-browsers). It is also the default, so the option can be left out entirely.

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

**The Docker image already contains a browser, and the `browser` commands are not how you manage it.**

Chromium is installed inside the image, and the image is configured to use it. This is deliberate: it is what lets the container run on a server with no internet access. See [Air-gapped environments](/guide/advanced/docker#air-gapped-environments).

### What to expect

`browser list-installed` reports nothing when run against the image:

```bash
docker run --rm ptarmiganlabs/butler-sheet-icons:latest browser list-installed
```

```
info: No browsers installed
```

**This is correct, not a fault.** That command lists browsers Butler Sheet Icons downloaded and cached for itself. The browser in the image is a system package installed when the image was built, so it does not appear there.

To see which browser the container will actually use:

```bash
docker run --rm --entrypoint /usr/bin/chromium-browser \
  ptarmiganlabs/butler-sheet-icons:latest --version
```

```
Chromium 150.0.7871.181 Alpine Linux
```

### `--browser-version` has no effect inside the image

Passing `--browser-version` to a thumbnail command in the container does not change which browser runs. Butler Sheet Icons uses the embedded one and tells you it has done so:

```
warn: The browser executable from PUPPETEER_EXECUTABLE_PATH overrides --browser-version "121.0.6167.85": the browser at /usr/bin/chromium-browser will be used instead. Unset PUPPETEER_EXECUTABLE_PATH to use the requested build.
```

::: warning Wording changed in BSI 5.0.0
Before 5.0.0 this warning began `PUPPETEER_EXECUTABLE_PATH overrides ...`, without the leading `The browser executable from`. It had to name **which** setting won, because from 5.0.0 there are two that can: `--browser-executable-path` / `BSI_BROWSER_EXECUTABLE_PATH`, and `PUPPETEER_EXECUTABLE_PATH`. Searching your logs for the old wording will not match a 5.0.0 run.
:::

Worse, on a machine without internet access, some values of `--browser-version` will make the run **fail** while still not changing the browser — because the version has to be resolved before the browser is chosen. Leave it at its default, `recommended`, when running in Docker. The reasoning is in [Browser versions on an air-gapped host](/guide/advanced/docker#browser-versions-on-an-air-gapped-host).

### If you need a different browser build

`browser install` on its own achieves nothing here: in a `--rm` container the download lands somewhere that is deleted seconds later. Using a browser other than the embedded one takes three things together, and leaving out any one of them breaks the run.

**1. Put a browser in a folder on the host that the container can see.** Mount the folder and run `browser install` _inside the container_, so the browser that gets downloaded is a Linux build — which is what a Linux container can run. This step needs internet access:

```bash
mkdir -p "$HOME/bsi/browser-cache"

docker run --rm \
  -v "$HOME/bsi/browser-cache:/home/nodejs/.cache/puppeteer" \
  ptarmiganlabs/butler-sheet-icons:latest \
  browser install --browser chrome --browser-version 151.0.7922.77
```

**2. Mount that folder on every later run, and empty `PUPPETEER_EXECUTABLE_PATH`** so the embedded browser stops winning.

**3. Ask for the same build you installed.** Butler Sheet Icons looks for the exact build id that `--browser-version` resolves to, so the two have to agree:

```bash:line-numbers
docker run --rm \
  -v "$HOME/bsi/browser-cache:/home/nodejs/.cache/puppeteer" \
  -v "$HOME/bsi/img:/nodeapp/img" \
  -e PUPPETEER_EXECUTABLE_PATH="" \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-thumbnails \
  --browser-version 151.0.7922.77 \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey "$BSI_API_KEY" \
  --logonuserid user@company.com \
  --logonpwd "$BSI_PASSWORD" \
  --appid 12345678-1234-1234-1234-123456789012 \
  --imagedir ./img
```

A successful run says which one it picked:

```
info: Using cached browser: chrome 151.0.7922.77
info: Browser ready from cache: chrome 151.0.7922.77
```

::: warning Do not mount a browser folder built on Windows or macOS
The folder has to contain a **Linux** browser. A cache filled by running Butler Sheet Icons on a Windows desktop contains Windows builds, and mounting it into the container does not fail cleanly — Butler Sheet Icons accepts the entry and then tries to start a `.exe` inside a Linux container.

Filling the folder with the command in step 1 avoids this, because the download then happens inside the container. See [Docker image with external browser](/guide/concepts/browser-detection-and-environment-variables#docker-image-with-external-browser).
:::

::: warning Clearing `PUPPETEER_EXECUTABLE_PATH` without providing a browser breaks the run
With the variable emptied and no usable cache mounted, the container has no browser and tries to download one. On a host with no internet access that ends the run:

```
info: No local browser found. Downloading and installing browser...
error: Error installing browser: Browser "chrome" version "recommended" cannot be downloaded. Please use the "list-available" command to check available versions
```

Mount the folder, or leave the embedded browser alone.
:::

## Diagnostics and troubleshooting

### Full diagnostic of browser setup

::: code-group

```bash [macOS/Linux]
# Installed browsers
./butler-sheet-icons browser list-installed

# Available Chrome builds on the stable channel
./butler-sheet-icons browser list-available

# Available Chrome builds on another channel
./butler-sheet-icons browser list-available --channel beta
```

```powershell [Windows PowerShell]
# Installed browsers
./butler-sheet-icons.exe browser list-installed

# Available Chrome builds on the stable channel
./butler-sheet-icons.exe browser list-available

# Available Chrome builds on another channel
./butler-sheet-icons.exe browser list-available --channel beta
```

:::

### Clean cache and reinstall

::: code-group

```bash:line-numbers [macOS/Linux]
# Remove all
./butler-sheet-icons browser uninstall-all

# Reinstall
./butler-sheet-icons browser install

# Verify
./butler-sheet-icons browser list-installed
```

```powershell:line-numbers [Windows PowerShell]
# Remove all
./butler-sheet-icons.exe browser uninstall-all

# Reinstall
./butler-sheet-icons.exe browser install

# Verify
./butler-sheet-icons.exe browser list-installed
```

:::

### Visible mode test (debugging)

::: code-group

```bash:line-numbers [macOS/Linux]
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

```powershell:line-numbers [Windows PowerShell]
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
4. Test against more than one Chrome build before pinning one

### CI/CD

1. Cache browser downloads between pipeline runs
2. Use specific versions to avoid unexpected changes
3. Include browser installation in your deployment scripts
4. Test browser functionality in your pipeline

For conceptual information, see the Browser Management Guide.
