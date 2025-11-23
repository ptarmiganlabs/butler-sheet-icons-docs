# Browser detection and environment variables

Butler Sheet Icons (BSI) relies on a headless browser to open apps and capture thumbnails. To make this work reliably in everything from laptops to tightly locked‑down data centers, BSI uses a smart browser detection order and a small set of environment variables.

This page explains:

- How BSI decides which browser to use
- How Docker images and native binaries differ when it comes to browsers
- Which environment variables affect browser behaviour
- Practical examples for Windows (PowerShell), with notes for macOS and Linux
- Recommended strategies for internet‑connected and air‑gapped environments

## Browser availability by distribution

BSI is available both as Docker images and as native OS‑specific binaries. They differ in how browsers are provided.

### Docker image

- Chromium browser is embedded in the official image
- Works out of the box in air‑gapped environments
- Image size is larger because a full browser is included

The Docker image is usually the easiest choice if you need a fully self‑contained setup.

### Native binaries (Windows, macOS, Linux)

- No browser is embedded in the `.exe` / binary files
- Binaries are small downloads
- You must either:
  - Let BSI download a browser the first time it needs one, or
  - Provide a browser yourself (system browser or pre‑cached browser)

For air‑gapped use with native binaries you need to plan browser setup up front. The sections below show different ways to do that.

## Browser detection order

Whenever BSI needs a browser, it looks for one in this order:

1. **System browser** via `PUPPETEER_EXECUTABLE_PATH`
2. **Cached browser** in the Puppeteer cache directory
3. **Download from the internet**

BSI stops as soon as a usable browser is found.

### 1. System browser (highest priority)

If `PUPPETEER_EXECUTABLE_PATH` is set, BSI treats that as the preferred browser:

- The path must point to a valid browser executable
- No download is attempted
- Works well in Docker, air‑gapped environments and corporate setups with centrally managed browsers

### 2. Cached browser (medium priority)

If no system browser is configured, BSI looks in the Puppeteer cache directory (for example `C:\Users\<user>\.cache\puppeteer` on Windows).

If a compatible browser is found there, that browser is used and no download is needed.

### 3. Download browser (lowest priority)

If no system browser and no cached browser are found, BSI downloads a browser from the internet.

- Download happens the first time a browser is needed
- The downloaded browser is stored in the Puppeteer cache
- Future runs can reuse this cached browser, including in air‑gapped environments (after the first download)

If the environment has no internet access and no browser can be found via steps 1–2, BSI will fail with clear log messages.

## Key environment variables

### `PUPPETEER_EXECUTABLE_PATH`

**Purpose:** Tell BSI exactly which browser executable to use.

**Effect:** If the path exists and is executable, BSI uses that browser and skips both cache lookup and downloads.

**Typical use cases:**

- Docker containers that should always use the embedded Chromium
- Air‑gapped environments where a system browser is installed by IT
- Setups where you want full control over the browser version

**Windows / PowerShell examples:**

```powershell
# Use Microsoft Edge
$env:PUPPETEER_EXECUTABLE_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Use Google Chrome
$env:PUPPETEER_EXECUTABLE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'

# Run BSI after setting the environment variable
butler-sheet-icons qscloud create-sheet-thumbnails `
  --tenanturl $env:BSI_CLOUD_TENANT_URL `
  --apikey $env:BSI_CLOUD_API_KEY `
  --appid $env:BSI_CLOUD_APP_ID `
  --imagedir .\img
```

**macOS / Linux notes:**

On macOS and Linux, the same variable is set using `export` in the shell, for example:

```bash
# macOS example
export PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux example
export PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
```

### `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`

**Purpose:** Tell Puppeteer to skip downloading a browser during `npm install`.

This is mainly relevant when building Docker images or running BSI from source. It does **not** change how BSI detects browsers at runtime.

**Windows / PowerShell example:**

```powershell
$env:PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true'
```

**Dockerfile example:**

```dockerfile
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

Even with `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` set to `true`, BSI may still download a browser at runtime if none is found via `PUPPETEER_EXECUTABLE_PATH` or the cache.

## Choosing a browser strategy

There are a few common ways to run BSI. The best option depends on how much control you need over the browser and whether the environment is air‑gapped.

### Strategy 1: Let BSI download a browser (simple)

**Good for:** laptops, developer machines, internet‑connected servers.

- No extra configuration needed
- The first run downloads a browser and stores it in the cache
- Subsequent runs reuse the cached browser

**Windows / PowerShell example:**

```powershell
# No browser‑specific environment variables set
butler-sheet-icons qscloud create-sheet-thumbnails `
  --tenanturl $env:BSI_CLOUD_TENANT_URL `
  --apikey $env:BSI_CLOUD_API_KEY `
  --appid $env:BSI_CLOUD_APP_ID `
  --imagedir .\img
```

### Strategy 2: Use a system browser via `PUPPETEER_EXECUTABLE_PATH` (controlled)

**Good for:** air‑gapped environments, corporate desktops, servers with centrally managed browsers.

- You decide which browser BSI uses
- No download is attempted
- Works well when internet access is limited or tightly controlled

**Windows / PowerShell example:**

```powershell
$env:PUPPETEER_EXECUTABLE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'

butler-sheet-icons qseow create-sheet-thumbnails `
  --host $env:BSI_QSEOW_HOST `
  --appid $env:BSI_QSEOW_APP_ID `
  --imagedir .\img
```

### Strategy 3: Use a pre‑cached browser (semi‑offline)

**Good for:** environments where you can briefly connect to the internet to pre‑download browsers, then run offline.

Typical flow:

1. On a machine with internet access, use the `browser install` command to download a browser
2. Copy the Puppeteer cache directory to the target machine
3. Run BSI on the target machine without any browser env vars set

**Example outline (PowerShell + bash mix):**

```powershell
# 1. On a connected machine, install a browser into the cache
butler-sheet-icons browser install --browser chrome --browser-version latest
```

```bash
# 2. Archive the cache directory (on the connected machine)
cd ~
tar -czf puppeteer-cache.tar.gz .cache/puppeteer

# 3. Copy archive to the target machine and unpack
scp puppeteer-cache.tar.gz user@airgapped-host:~/
ssh user@airgapped-host "tar -xzf ~/puppeteer-cache.tar.gz -C ~"
```

On the air‑gapped machine you then run BSI as normal. It will find and use the cached browser without needing a download.

## Docker vs native binaries

### Docker image (embedded browser)

The official Docker image includes a Chromium browser and has environment variables set so that BSI uses that embedded browser by default.

Common setup inside the image:

```dockerfile
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

This means:

- No additional browser setup is needed
- The image works in air‑gapped environments as long as you can transfer the image itself

**Windows / PowerShell example (using the embedded browser):**

```powershell
# Images are stored under C:\bsi-img on the host
$imgPath = 'C:\bsi-img'
New-Item -ItemType Directory -Path $imgPath -Force | Out-Null

docker run --rm `
  -v "$imgPath:/nodeapp/img" `
  ptarmiganlabs/butler-sheet-icons:latest `
  qscloud create-sheet-thumbnails `
  --tenanturl $env:BSI_CLOUD_TENANT_URL `
  --apikey $env:BSI_CLOUD_API_KEY `
  --appid $env:BSI_CLOUD_APP_ID `
  --imagedir ./img
```

### Docker image with external browser

Sometimes you may want to use a different or newer browser than the one embedded in the image.

You can do this in two main ways:

1. Mount a Puppeteer cache directory from the host
2. Point `PUPPETEER_EXECUTABLE_PATH` to a browser in a mounted directory

**Windows / PowerShell example (mount cached browser from host):**

```powershell
# Host cache directory (created earlier with browser install commands)
$cachePath = "$env:USERPROFILE\.cache\puppeteer"
$imgPath = 'C:\bsi-img'
New-Item -ItemType Directory -Path $imgPath -Force | Out-Null

# Use cached browser, ignore embedded one
$env:PUPPETEER_EXECUTABLE_PATH = ''

docker run --rm `
  -v "$cachePath:/home/nodejs/.cache/puppeteer" `
  -v "$imgPath:/nodeapp/img" `
  -e PUPPETEER_EXECUTABLE_PATH="" `
  ptarmiganlabs/butler-sheet-icons:latest `
  qscloud create-sheet-thumbnails `
  --tenanturl $env:BSI_CLOUD_TENANT_URL `
  --apikey $env:BSI_CLOUD_API_KEY `
  --appid $env:BSI_CLOUD_APP_ID `
  --imagedir ./img
```

In this setup BSI ignores the embedded browser and uses the cached one from the host.

## Thumbnail generation examples

The examples below show how browser detection and environment variables fit into real thumbnail generation commands.

### QS Cloud thumbnails – Windows (system browser)

```powershell
$env:PUPPETEER_EXECUTABLE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:BSI_CLOUD_TENANT_URL = 'https://your-tenant.region.qlikcloud.com'
$env:BSI_CLOUD_API_KEY = 'your-api-key'
$env:BSI_CLOUD_APP_ID = 'your-app-id'

butler-sheet-icons qscloud create-sheet-thumbnails `
  --tenanturl $env:BSI_CLOUD_TENANT_URL `
  --apikey $env:BSI_CLOUD_API_KEY `
  --appid $env:BSI_CLOUD_APP_ID `
  --imagedir .\img
```

### QS Cloud thumbnails – macOS / Linux (system browser)

```bash
export PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"   # Or a Chrome path on macOS
export BSI_CLOUD_TENANT_URL="https://your-tenant.region.qlikcloud.com"
export BSI_CLOUD_API_KEY="your-api-key"
export BSI_CLOUD_APP_ID="your-app-id"

butler-sheet-icons qscloud create-sheet-thumbnails \
  --tenanturl "$BSI_CLOUD_TENANT_URL" \
  --apikey "$BSI_CLOUD_API_KEY" \
  --appid "$BSI_CLOUD_APP_ID" \
  --imagedir ./img
```

### QSEoW thumbnails – Windows (download browser automatically)

```powershell
$env:BSI_QSEOW_HOST = 'sense.company.com'
$env:BSI_QSEOW_APP_ID = 'your-app-id'

# No PUPPETEER_EXECUTABLE_PATH set: BSI will use cache or download as needed
butler-sheet-icons qseow create-sheet-thumbnails `
  --host $env:BSI_QSEOW_HOST `
  --appid $env:BSI_QSEOW_APP_ID `
  --imagedir .\img
```

### QSEoW thumbnails – macOS / Linux (system browser)

```bash
export PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
export BSI_QSEOW_HOST="sense.company.com"
export BSI_QSEOW_APP_ID="your-app-id"

butler-sheet-icons qseow create-sheet-thumbnails \
  --host "$BSI_QSEOW_HOST" \
  --appid "$BSI_QSEOW_APP_ID" \
  --imagedir ./img
```

## Summary

- BSI always tries system browser → cached browser → download
- `PUPPETEER_EXECUTABLE_PATH` gives you full control and is ideal for air‑gapped and managed environments
- The official Docker image includes a browser and is usually the easiest way to run BSI completely offline
- Native binaries work well too, as long as you either pre‑cache a browser or point to a system browser

For more details on installing and managing browsers, see the browser command reference and examples.
