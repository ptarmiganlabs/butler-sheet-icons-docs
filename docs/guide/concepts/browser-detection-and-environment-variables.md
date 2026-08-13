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

If no system browser is configured, BSI looks in its browser cache directory. For a standalone build that is a `browser-cache` folder next to the executable; running from Node.js it is `.cache/puppeteer` in the current user's home directory. You can point it somewhere else with `--browser-cache-dir` or `BSI_BROWSER_CACHE_DIR` — see [Browser Cache Directory](/guide/advanced/browser-cache-directory) for the full order of precedence.

A cached browser is used when it matches **both** of these:

- **Browser type** — the browser asked for with `--browser`. Every command accepts `chrome` only, and it is the default, so this matters only if you name it explicitly.
- **Version** — if you specify an exact `--browser-version`, only a cached browser with exactly that build ID is used. If a different version is cached, BSI treats it as no match and downloads the version you asked for. If `--browser-version` is `latest` (the default), any cached build of the requested browser type is accepted.

When a cached browser matches, it is used as-is and nothing is downloaded. This is what makes repeat runs fast: the browser is downloaded once and reused on every later run, with no network access needed for the browser itself.

Use `butler-sheet-icons browser list-installed` to see which browsers are currently cached, and `browser install` to add one deliberately — for example when preparing a machine that will later run without internet access.

::: tip "latest" means "anything cached", not "the newest available"
With `--browser-version latest`, BSI does **not** check whether a newer browser has been released. Any cached build of the requested type is accepted, so a cached browser never updates itself. To move to a newer build, install it explicitly with `browser install --browser chrome --browser-version <build id>`, or clear the cache with `browser uninstall-all` and let the next run download a fresh one.

If several builds of the same browser are cached, do not rely on which one gets picked. Pin `--browser-version` to an exact build ID whenever the exact version matters.
:::

::: warning Requires BSI 4.0.0 or later
In earlier versions a defect prevented BSI from ever finding a cached browser, so in practice it re-downloaded a browser on **every run** unless `PUPPETEER_EXECUTABLE_PATH` was set. From 4.0.0 the cache is used as described above. Nothing needs to be reconfigured — the improvement applies automatically, and repeat runs start faster and use far less bandwidth.
:::

### 3. Download browser (lowest priority)

If no system browser and no cached browser are found, BSI downloads a browser from the internet.

- Download happens the first time a browser is needed
- The downloaded browser is stored in the Puppeteer cache
- Future runs can reuse this cached browser, including in air‑gapped environments (after the first download)

If the environment has no internet access and no browser can be found via steps 1–2, BSI will fail with clear log messages.

## Which browser commands need internet access?

Creating thumbnails does not need internet access for the browser itself, as long as step 1 or step 2 above finds one — **but the value of `--browser-version` decides whether the run needs a lookup before it gets that far.** See [What `--browser-version` costs on an offline machine](#what-browser-version-costs-on-an-offline-machine) below.

The `browser` management commands are different — only some of them reach out to the internet:

| Command                              | Needs internet? |
| ------------------------------------ | --------------- |
| `browser list-installed`             | **No.** Reads the local Puppeteer cache only. |
| `browser uninstall` / `uninstall-all` | **No.** Removes browsers from the local cache. |
| `browser list-available`             | **Yes.** It asks Google's Chrome version history service which versions exist. |
| `browser install`                    | **Yes**, always. BSI verifies that the requested build can actually be downloaded before installing it, so the command needs internet access even when that version is already in the cache. |

On a machine with no internet access — an air-gapped server, or one behind a proxy that blocks outbound HTTPS — `browser list-available` reports:

```
error: Could not reach versionhistory.googleapis.com to look up available browser versions.
error: Butler Sheet Icons needs internet access for this command. If this machine is offline or
       behind a proxy, use "butler-sheet-icons browser list-installed" to see the browsers already
       available locally.
```

This is expected, not a fault in BSI. Use `browser list-installed` to see what is already available on the machine.

If the version history service is reachable but answers with an error, the message says so explicitly and quotes the HTTP status instead — so a proxy returning `403` is easy to tell apart from having no connectivity at all. A captive portal or intercepting proxy that answers with an HTML login page is reported as an unexpected response from the service.

::: tip Preparing an offline machine
Run `browser install` once while the machine still has internet access. The browser is stored in the Puppeteer cache and reused on every later run, so thumbnail creation itself works without connectivity.

Setting `PUPPETEER_EXECUTABLE_PATH` to a browser installed by other means works too, and is the usual approach for Docker and centrally managed environments. See [Strategy 2](#strategy-2-use-a-system-browser-via-puppeteer-executable-path-controlled) and [Strategy 3](#strategy-3-use-a-pre-cached-browser-semi-offline) below.
:::

::: warning Requires BSI 4.0.0 or later
Earlier versions reported a failed `browser list-available` on an offline machine as a raw stack trace (`TypeError: Cannot read properties of undefined (reading 'status')`) with line numbers from inside the BSI binary — nothing an administrator could act on. From 4.0.0 the messages above are shown instead.
:::

## What `--browser-version` costs on an offline machine

A thumbnail run has to turn `--browser-version` into a specific build before it can look in the cache. Some values need the browser vendor's version service to do that, and some do not — which is the difference between a run that works offline and one that depends on connectivity every time.

| Value | Needs a lookup? |
| --- | --- |
| `recommended` (the default) | **No.** The build id is a constant inside Butler Sheet Icons. |
| `stable`, `latest`, or a channel such as `beta` | **Yes**, on every run. These mean "whatever the vendor currently publishes", which can only be answered by asking. |
| An exact full build id, e.g. `151.0.7922.77` | **No.** Already specific. |
| A milestone or build prefix, e.g. `151` or `151.0.7922` | **Yes.** Butler Sheet Icons has to ask which build that resolves to. |

**This is the strongest practical argument for `recommended` on an air-gapped or proxied machine.** It is the only value that is both current for your Butler Sheet Icons version and free of a per-run lookup.

### When the lookup fails

What happens next depends on how specific you were.

**A floating keyword degrades to the cache.** For `stable`, `latest` and the release channels, a failed lookup is treated as an environment problem rather than a mistake. Butler Sheet Icons warns twice and carries on with the newest cached build of the right browser:

```
warn: Could not resolve --browser-version "stable": <reason>
warn: Falling back to the newest browser already in the local cache.
```

If nothing is cached either, there is nothing to fall back to and the original lookup error is reported instead.

**A pin does not degrade.** If you named a milestone or a build prefix and the lookup fails, the run stops. Asking for `151` is a promise about which build runs, and quietly substituting a different cached build would be the very thing that made runs fail unpredictably before 4.0.0 — a build nobody chose, selected silently.

**Bad input never degrades.** A malformed version or an unsupported browser is your input being wrong, so it is reported as an error whether or not something is cached.

::: tip Getting a genuinely offline run
Use `recommended` (or simply omit `--browser-version`) and pre-populate the cache with `browser install` while the machine still has connectivity. That combination needs the network exactly once, on the machine that prepares the cache. See [Strategy 3](#strategy-3-use-a-pre-cached-browser-semi-offline) and [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build).
:::

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

### Strategy 3: Use a pre-cached browser (semi-offline)

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

For how to transfer the image across an air gap, what network access the container still needs, and how to verify the embedded browser before going near production, see [Air-gapped environments](/guide/advanced/docker#air-gapped-environments).

**Windows / PowerShell example (using the embedded browser):**

```powershell:line-numbers
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

Sometimes you want the container to use a specific browser build rather than the Chromium that comes with the image — usually because your organization approves browser versions centrally.

This takes three things, and leaving out any one of them breaks the run:

1. A folder on the host holding a **Linux** browser build, mounted at `/home/nodejs/.cache/puppeteer` in the container.
2. `PUPPETEER_EXECUTABLE_PATH` set to an empty string, so the embedded browser stops taking priority.
3. `--browser-version` set to **the same build** that is in the folder.

#### Fill the folder from inside a container

The browser has to be a Linux build, because the container is Linux. The reliable way to get one is to let the container download it — then it cannot be the wrong kind. This step needs internet access, and is done once:

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/bsi/browser-cache"

docker run --rm \
  -v "$HOME/bsi/browser-cache:/home/nodejs/.cache/puppeteer" \
  ptarmiganlabs/butler-sheet-icons:latest \
  browser install --browser chrome --browser-version 151.0.7922.77
```

```powershell [Windows PowerShell]
$cachePath = 'C:\bsi-browser-cache'
New-Item -ItemType Directory -Path $cachePath -Force | Out-Null

docker run --rm `
  -v "${cachePath}:/home/nodejs/.cache/puppeteer" `
  ptarmiganlabs/butler-sheet-icons:latest `
  browser install --browser chrome --browser-version 151.0.7922.77
```

:::

::: danger Do not mount your own desktop's browser folder
On Windows, `%USERPROFILE%\.cache\puppeteer` holds browsers downloaded **for Windows**. Mounting it into the container does not produce a clear error — Butler Sheet Icons accepts the entry and then tries to run a `.exe` inside a Linux container. The same applies to a macOS cache.

Use the command above instead, which downloads a Linux build into a folder you nominate.
:::

#### Use it

::: code-group

```bash:line-numbers
docker run --rm \
  -v "$HOME/bsi/browser-cache:/home/nodejs/.cache/puppeteer" \
  -v "$HOME/bsi/img:/nodeapp/img" \
  -e PUPPETEER_EXECUTABLE_PATH="" \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-thumbnails \
  --browser-version 151.0.7922.77 \
  --tenanturl "$BSI_CLOUD_TENANT_URL" \
  --apikey "$BSI_CLOUD_API_KEY" \
  --appid "$BSI_CLOUD_APP_ID" \
  --imagedir ./img
```

```powershell:line-numbers
$cachePath = 'C:\bsi-browser-cache'
$imgPath = 'C:\bsi-img'
New-Item -ItemType Directory -Path $imgPath -Force | Out-Null

docker run --rm `
  -v "${cachePath}:/home/nodejs/.cache/puppeteer" `
  -v "${imgPath}:/nodeapp/img" `
  -e PUPPETEER_EXECUTABLE_PATH="" `
  ptarmiganlabs/butler-sheet-icons:latest `
  qscloud create-sheet-thumbnails `
  --browser-version 151.0.7922.77 `
  --tenanturl $env:BSI_CLOUD_TENANT_URL `
  --apikey $env:BSI_CLOUD_API_KEY `
  --appid $env:BSI_CLOUD_APP_ID `
  --imagedir ./img
```

:::

A run that picked up the mounted browser says so:

```
info: Found 1 cached browser(s)
info: Using cached browser: chrome 151.0.7922.77
info: Browser ready from cache: chrome 151.0.7922.77
```

::: warning "Found 1 cached browser(s)" followed by "No local browser found"
These two lines together mean the folder was read, but the browser in it is not the build that was asked for — so it was skipped. Both lines are accurate; it is the pair that is confusing.

The fix is to make `--browser-version` name the build that is actually in the folder. Run `browser list-installed` with the folder mounted to see what that is:

```bash
docker run --rm \
  -v "$HOME/bsi/browser-cache:/home/nodejs/.cache/puppeteer" \
  ptarmiganlabs/butler-sheet-icons:latest \
  browser list-installed
```

:::

#### The simpler alternative

If a specific build is not actually a requirement, do nothing: the browser inside the image is already there, already Linux, and needs no internet access. See [Air-gapped environments](/guide/advanced/docker#air-gapped-environments).

## Thumbnail generation examples

The examples below show how browser detection and environment variables fit into real thumbnail generation commands.

### QS Cloud thumbnails – Windows (system browser)

```powershell:line-numbers
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

```bash:line-numbers
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

```powershell:line-numbers
$env:BSI_QSEOW_HOST = 'sense.company.com'
$env:BSI_QSEOW_APP_ID = 'your-app-id'

# No PUPPETEER_EXECUTABLE_PATH set: BSI will use cache or download as needed
butler-sheet-icons qseow create-sheet-thumbnails `
  --host $env:BSI_QSEOW_HOST `
  --appid $env:BSI_QSEOW_APP_ID `
  --imagedir .\img
```

### QSEoW thumbnails – macOS / Linux (system browser)

```bash:line-numbers
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
