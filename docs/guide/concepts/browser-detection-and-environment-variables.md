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

1. **A browser you named** with `--browser-executable-path` / `BSI_BROWSER_EXECUTABLE_PATH`
2. **A browser named by** `PUPPETEER_EXECUTABLE_PATH`
3. **Cached browser** in the Puppeteer cache directory
4. **Download from the internet**

BSI stops as soon as a usable browser is found. An **empty value counts as "not set"** at every level, so `BSI_BROWSER_EXECUTABLE_PATH=` in a systemd unit or `-e PUPPETEER_EXECUTABLE_PATH=""` in Docker both mean "ignore this and look further down the list".

### 1. A browser you named (highest priority) {#browser-you-named}

::: warning Requires BSI 5.0.0 or later
`--browser-executable-path` and `BSI_BROWSER_EXECUTABLE_PATH` were added in 5.0.0. In earlier versions `PUPPETEER_EXECUTABLE_PATH` was the only way to name a browser.
:::

Point BSI at a browser already installed on the machine, and it neither downloads nor manages one:

```bash
butler-sheet-icons qseow create-sheet-thumbnails \
  --browser-executable-path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" ...
```

For a scheduled task, where editing the command line is awkward, the same value works as an environment variable:

```
BSI_BROWSER_EXECUTABLE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
```

See [Use a browser already installed on the server](#use-a-browser-already-installed-on-the-server) below for which browsers work and why you might want this.

### 2. A browser named by `PUPPETEER_EXECUTABLE_PATH` {#puppeteer-executable-path-browser}

Still honoured, and unchanged. The difference from the option above is **what happens when the file is not there**, and it is deliberate:

- **`--browser-executable-path` is a promise.** If the file is missing, the run **stops** with an error naming the path. BSI does not quietly download a different browser instead.
- **`PUPPETEER_EXECUTABLE_PATH` is a hint.** If the file is missing, BSI warns and carries on down the list, exactly as before.

Naming a browser through a BSI option states what you want to happen, and running some other browser instead is precisely the surprise a change-controlled environment cannot tolerate. A variable inherited from a container image or a shell profile is a much weaker signal, and many existing setups rely on it falling through.

When the file named by the option is missing, you will see:

```
--browser-executable-path is set to "D:\browsers\chrome.exe" but no such file exists on this
machine. Butler Sheet Icons will not fall back to downloading a browser when an executable path
has been given explicitly. Correct the path, or remove the option to let Butler Sheet Icons find
a browser itself.
```

- The path must point to a valid browser executable
- No download is attempted
- Works well in Docker, air‑gapped environments and corporate setups with centrally managed browsers

### 3. Cached browser {#cached-browser}

If no system browser is configured, BSI looks in its browser cache directory. For a standalone build that is a `browser-cache` folder next to the executable; running from Node.js it is `.cache/puppeteer` in the current user's home directory. You can point it somewhere else with `--browser-cache-dir` or `BSI_BROWSER_CACHE_DIR` — see [Browser Cache Directory](/guide/advanced/browser-cache-directory) for the full order of precedence.

A cached browser has to pass **four** checks before it is used. All four must hold:

- **Browser type** — the browser asked for with `--browser`. Every command accepts `chrome` only, and it is the default, so this matters only if you name it explicitly.
- **Operating system** — the build must be one this machine can actually run. A browser cache only works on the operating system it was downloaded for.
- **The browser program is present** — the build's folder must still contain the browser itself. A folder left behind by an interrupted download, or by a copy that dropped files, does not count.
- **Version** — `--browser-version` is resolved to one specific build, and only a cached browser with exactly that build id is used. If a different build is cached, BSI treats it as no match and downloads the one you asked for.

When a cached browser passes all four, it is used as-is and nothing is downloaded. This is what makes repeat runs fast: the browser is downloaded once and reused on every later run, with no network access needed for the browser itself.

Use `butler-sheet-icons browser list-installed` to see which browsers are currently cached, and `browser install` to add one deliberately — for example when preparing a machine that will later run without internet access.

::: warning Requires BSI 5.0.0 or later
The operating system and browser-program checks were added in 5.0.0. Before that, a cache copied from a machine running a different operating system, or one whose browser files were incomplete, was accepted and used — and the run then failed later with an error that pointed at nothing in particular.

If a cached browser is rejected, BSI now says which check it failed and where it looked. The three messages, and what to do about each, are in [Troubleshooting](/guide/troubleshooting#a-cached-browser-was-rejected).
:::

::: tip Version keywords are not wildcards
`recommended` (the default), `stable` and `latest` each resolve to **one specific build** before the cache is searched. No keyword means "accept anything I have cached", so switching from one to another will not make BSI accept a build it has already rejected — it simply looks for a different specific build.

To use a browser you already have, pin `--browser-version` to its exact build id. `browser list-installed` prints them. See [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build) for what each keyword means.
:::

A browser named with `--browser-executable-path` / `BSI_BROWSER_EXECUTABLE_PATH` or with `PUPPETEER_EXECUTABLE_PATH` is not subject to any of this — those are steps 1 and 2 above, and such a browser is used as-is, without these checks.

::: warning Requires BSI 4.0.0 or later
In earlier versions a defect prevented BSI from ever finding a cached browser, so in practice it re-downloaded a browser on **every run** unless `PUPPETEER_EXECUTABLE_PATH` was set. From 4.0.0 the cache is used as described above. Nothing needs to be reconfigured — the improvement applies automatically, and repeat runs start faster and use far less bandwidth.
:::

### 4. Download browser {#download-browser}

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
| `browser install`                    | **Only when it has work to do.** No internet is needed if the build you asked for is already in the cache *and* `--browser-version` names it without a lookup. Otherwise yes — to download the build, or to resolve the version name. See below. |

::: warning Requires BSI 5.0.0 or later
Before 5.0.0, `browser install` checked that the build could be **downloaded** before it looked at what was already on the machine, so it needed internet access even for a browser sitting on disk. It now looks in the cache first.

This is what lets you confirm a staged browser **on the air-gapped machine itself** — previously the one check that could not be done there. See [`browser install`](/reference/browser#install).
:::

Whether `browser install` can run offline therefore comes down to two things:

1. **The build must already be in the cache**, built for this machine, with the browser program present.
2. **`--browser-version` must not need a lookup.** `recommended` (the default) and an exact full build id are answered from information BSI already has; `stable`, `latest`, a channel, a milestone or a build prefix all have to be asked about. The table in [What `--browser-version` costs on an offline machine](#what-browser-version-costs-on-an-offline-machine) says which is which, and it applies here exactly as it does to a thumbnail run.

So `butler-sheet-icons browser install`, with no options at all, completes offline on a machine with the matching browser staged — the default `recommended` needs no lookup.

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

Pointing BSI at a browser installed by other means works too, with `--browser-executable-path` / `BSI_BROWSER_EXECUTABLE_PATH`, and is the usual approach for centrally managed environments. See [Strategy 2](#use-a-browser-already-installed-on-the-server) and [Strategy 3](#strategy-3-use-a-pre-cached-browser-semi-offline) below.
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

### `BSI_BROWSER_EXECUTABLE_PATH`

::: warning Requires BSI 5.0.0 or later
Added in 5.0.0, together with the matching `--browser-executable-path` option.
:::

**Purpose:** Tell BSI exactly which browser executable to use. This is BSI's own setting, and the environment-variable form of `--browser-executable-path` — the two are interchangeable.

**Effect:** BSI uses that browser and neither downloads nor manages one. **If the file does not exist, the run stops** rather than falling back to a download. See [A browser you named](#browser-you-named).

**Takes precedence over `PUPPETEER_EXECUTABLE_PATH`.** For Docker users this is the point: the official image sets `PUPPETEER_EXECUTABLE_PATH` to its built-in browser, and setting `BSI_BROWSER_EXECUTABLE_PATH` overrides that, which is how you point a container at a different browser. See [Docker](/guide/advanced/docker).

::: code-group

```powershell [PowerShell]
$env:BSI_BROWSER_EXECUTABLE_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
```

```bash [Bash]
export BSI_BROWSER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
```

:::

### `PUPPETEER_EXECUTABLE_PATH`

**Purpose:** Tell BSI exactly which browser executable to use.

**Effect:** If the path exists and is executable, BSI uses that browser and skips both cache lookup and downloads. If it does not exist, BSI warns and carries on looking — unlike `BSI_BROWSER_EXECUTABLE_PATH`, which stops the run.

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

### Strategy 2: Use a browser already installed on the server (controlled) {#use-a-browser-already-installed-on-the-server}

**Good for:** air‑gapped environments, corporate desktops, servers with centrally managed browsers.

- You decide which browser BSI uses
- No download is attempted
- Works well when internet access is limited or tightly controlled

::: code-group

```powershell [PowerShell]
butler-sheet-icons qseow create-sheet-thumbnails `
  --browser-executable-path 'C:\Program Files\Google\Chrome\Application\chrome.exe' `
  --host $env:BSI_QSEOW_HOST `
  --appid $env:BSI_QSEOW_APP_ID `
  --imagedir .\img
```

```bash [Bash]
butler-sheet-icons qseow create-sheet-thumbnails \
  --browser-executable-path "/usr/bin/chromium-browser" \
  --host "$BSI_QSEOW_HOST" \
  --appid "$BSI_QSEOW_APP_ID" \
  --imagedir ./img
```

:::

#### Why you might want this

**No internet access.** Getting a browser onto an isolated server is the whole difficulty of running BSI there. If the server already has a suitable browser — and Windows Server usually does — this sidesteps the problem entirely, with nothing to copy across.

**Change control.** In estates where software is deployed centrally, a tool that downloads its own browser is awkward to approve. Pointing at a browser your normal deployment process installed and patches keeps BSI out of that conversation.

**Disk space and time.** The browser BSI downloads is around 150 MB per machine, and it is downloaded again for each new version.

#### Which browsers work

Any Chromium-based browser. On Windows Server that means **Microsoft Edge**, installed by default on current builds, or **Google Chrome**. Both are Chromium underneath and both work with BSI unmodified.

| Browser        | Usual path on 64-bit Windows                                  |
| -------------- | ------------------------------------------------------------- |
| Microsoft Edge | `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` |
| Google Chrome  | `C:\Program Files\Google\Chrome\Application\chrome.exe`        |

Confirm the real path before using it rather than trusting the table — installers vary, and both vendors have moved these over the years.

If the server has no browser at all, both vendors publish **offline enterprise installers** designed for exactly this: downloaded once on a connected machine, then distributed internally through your normal software deployment process.

| Browser        | Where                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Microsoft Edge | [Microsoft Edge for Business download](https://www.microsoft.com/en-us/edge/business/download)    |
| Google Chrome  | [Chrome Enterprise download](https://chromeenterprise.google/download/)                           |

::: warning BSI does not patch a browser you point it at
A browser installed this way stays with your normal patching process. BSI neither updates nor manages it — worth stating plainly, because a browser on a Qlik Sense server is a security-review item.
:::

#### What `--browser-version` does when a browser is named

Nothing — the named browser is used as it is. If you also asked for a specific build, BSI warns that the setting is being overridden, so the two cannot silently disagree:

```
warn: The browser executable from --browser-executable-path / BSI_BROWSER_EXECUTABLE_PATH
overrides --browser-version "121.0.6167.85": the browser at C:\Program Files\Google\Chrome\
Application\chrome.exe will be used instead. Remove --browser-executable-path /
BSI_BROWSER_EXECUTABLE_PATH to use the requested build.
```

Version keywords such as `recommended` do **not** produce that warning, because they are BSI's own choice rather than yours.

### Strategy 3: Use a pre-cached browser (semi-offline)

**Good for:** environments where you can briefly connect to the internet to pre‑download browsers, then run offline.

Typical flow:

1. On a machine with internet access, use the `browser install` command to download a browser
2. Copy the Puppeteer cache directory to the target machine
3. Run BSI on the target machine without any browser env vars set

::: warning The connected machine must run the same operating system
A browser cache only works on the operating system it was downloaded for. Staging on an administrator's Mac for a Windows Server does not work, and from 5.0.0 BSI says so rather than failing later for no visible reason — see [A cached browser was rejected](/guide/troubleshooting#a-cached-browser-was-rejected).

Stage the build the target machine will actually ask for, too. Both machines should use the same `--browser-version`, and leaving it at the default `recommended` on both is the simplest way to guarantee that.
:::

**Example outline (PowerShell + bash mix):**

```powershell
# 1. On a connected machine, install a browser into the cache.
#    "recommended" is the default and is a fixed build, so the target machine
#    looks for exactly this one. Do not use "latest" here: it resolves to
#    whatever is newest today, which is unlikely to be what the target asks for.
butler-sheet-icons browser install --browser chrome --browser-version recommended
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

- BSI always tries a browser you named → `PUPPETEER_EXECUTABLE_PATH` → cached browser → download
- `--browser-executable-path` / `BSI_BROWSER_EXECUTABLE_PATH` gives you full control and is ideal for air‑gapped and managed environments. It outranks `PUPPETEER_EXECUTABLE_PATH`, and it **stops the run** rather than downloading a browser if the file is missing
- `PUPPETEER_EXECUTABLE_PATH` still works and still falls through to the cache when the file is missing
- The official Docker image includes a browser and is usually the easiest way to run BSI completely offline
- Native binaries work well too, as long as you either pre‑cache a browser or point to a system browser

For more details on installing and managing browsers, see the browser command reference and examples.
