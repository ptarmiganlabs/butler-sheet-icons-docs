# Browser Management

Butler Sheet Icons uses a headless web browser to automate the process of logging into Qlik Sense and capturing sheet thumbnails. Understanding how browser management works is essential for successful operation.

## How Browser Management Works

By default Butler Sheet Icons uses its own cache of browsers, completely separate from any browsers you might have installed on your computer. This approach ensures:

- **Consistency**: The same browser version across different environments
- **Isolation**: No interference with your personal browser settings
- **Control**: Ability to use specific browser versions for compatibility

In addition to the cached browsers managed by BSI, you can also point BSI at a specific system browser executable via the `PUPPETEER_EXECUTABLE_PATH` environment variable. That is covered in more detail on the [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) page.

## Supported Browsers {#supported-browsers}

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

## Browser Selection {#browser-selection}

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

## Choosing a browser build {#choosing-a-browser-build}

`--browser-version` decides which browser build Butler Sheet Icons uses. It accepts a keyword, a release channel, or an exact build id.

### The two keywords

| Value | Meaning | How the build is decided |
| --- | --- | --- |
| `recommended` | The build this version of Butler Sheet Icons was tested with. **This is the default.** | Fixed inside Butler Sheet Icons |
| `stable` | The newest stable release of the browser. | Looked up online, every time the command runs |

Both work for Chrome and Firefox, so you do not need to know what each vendor calls its channels.

**`recommended` is the right choice for almost everyone.** It cannot get ahead of what Butler Sheet Icons is able to drive, and it changes only when you upgrade Butler Sheet Icons itself. That gives you two things:

- **Every server on the same Butler Sheet Icons version uses the same browser build.** A fleet of scheduled jobs cannot drift apart on its own.
- **No lookup at run time.** The build id is baked in, so once it is cached there is nothing to ask the vendor. With `stable`, every run first asks which build is currently newest.

Choose `stable` only if you specifically need the newest stable release — for example because a security policy requires it. Be aware that it follows whatever the vendor has promoted, which can be a build newer than Butler Sheet Icons has been tested against.

It also means a lookup on every run: on an offline or proxied machine that costs you connectivity you may not have. See [What `--browser-version` costs on an offline machine](/guide/concepts/browser-detection-and-environment-variables#what-browser-version-costs-on-an-offline-machine).

Release **channels** are also accepted, and like `stable` they are resolved at run time: `beta`, `dev` and `canary` for Chrome; `beta`, `nightly`, `devedition` and `esr` for Firefox.

::: tip A browser is never bundled with Butler Sheet Icons
Whichever value you use, the browser is downloaded once and then kept in the local cache, so the first run on a new server always needs internet access. The keywords differ only in *how the build id is decided* — which is what matters on a server that is offline afterwards. See [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables).
:::

### Naming an exact build

You can pin an exact build. The format is checked before anything else happens, so a typo stops the run immediately with a message naming the accepted forms — it is never silently swapped for another build from the cache.

For **Chrome**, three forms are accepted:

| Form | Example | Selects |
| --- | --- | --- |
| Milestone | `151` | The newest build of milestone 151 |
| Build prefix | `151.0.7922` | The newest patch of that build |
| Full build id | `151.0.7922.77` | Exactly that build |

For **Firefox**, the build id must carry its channel prefix, for example `stable_153.0.3`. A bare version such as `152.0.1` is rejected: without the prefix it would be read as a nightly build, which is almost never what you want.

To see what can be installed:

::: code-group

```powershell [PowerShell]
butler-sheet-icons.exe browser list-available --browser chrome
```

```bash [Bash]
./butler-sheet-icons browser list-available --browser chrome
```

:::

### If you currently use `latest`

::: warning `latest` changed meaning in BSI 4.0.0
`latest` still works — no scripts or scheduled tasks need editing — but it is now treated as `stable`, and the run logs two lines the first time it is used:

```
warn: --browser-version "latest" now means "stable" - the newest stable release of the browser.
warn: It previously meant the newest published build, which could be one the browser automation library cannot drive. Use "recommended" for the build Butler Sheet Icons is tested against, or "stable" to keep tracking the newest stable release.
```

The old meaning — the newest *published* build — is what caused runs to fail against a browser Butler Sheet Icons could not drive, so it is no longer available. For the safest behaviour, drop the option and let the default apply, or set it to `recommended` explicitly. See [Every app fails with `Target closed` or `Protocol error`](/guide/troubleshooting#every-app-fails-with-target-closed-or-protocol-error).
:::

### What to expect on the first run after upgrading

Butler Sheet Icons matches a cached browser by exact build. On the first run after upgrading, most servers download the recommended build, because what they have cached is whatever `latest` happened to fetch previously. This is a one-time download per server, and it is what puts every server on the same known-good build.

To do it ahead of time rather than during a scheduled run:

::: code-group

```powershell [PowerShell]
butler-sheet-icons.exe browser install --browser chrome
```

```bash [Bash]
./butler-sheet-icons browser install --browser chrome
```

:::

You can then remove the old build. List what is installed, then name the exact build to remove:

::: code-group

```powershell [PowerShell]
butler-sheet-icons.exe browser list-installed
butler-sheet-icons.exe browser uninstall --browser chrome --browser-version <build id from the list>
```

```bash [Bash]
./butler-sheet-icons browser list-installed
./butler-sheet-icons browser uninstall --browser chrome --browser-version <build id from the list>
```

:::

`browser uninstall` accepts an exact build id, or `recommended`. It deliberately does **not** accept `stable`, `latest` or a channel: those name whatever the vendor currently publishes, not a build on your machine, so they cannot safely identify something to delete. Uninstalling never needs internet access.

### Firefox Versions

Firefox is managed only by the `browser` commands — it cannot render thumbnails, so its version affects nothing about a thumbnail run. Firefox build ids are channel-prefixed, for example `stable_153.0.3`.

## Headless vs. Visible Browser {#headless-vs-visible-browser}

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

## Proxy Server Support {#proxy-server-support}

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
