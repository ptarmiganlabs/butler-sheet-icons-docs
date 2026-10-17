# Browser Management

Butler Sheet Icons uses a headless web browser to automate the process of logging into Qlik Sense and capturing sheet thumbnails. Understanding how browser management works is essential for successful operation.

## How Browser Management Works

By default Butler Sheet Icons uses its own cache of browsers, completely separate from any browsers you might have installed on your computer. This approach ensures:

- **Consistency**: The same browser version across different environments
- **Isolation**: No interference with your personal browser settings
- **Control**: Ability to use specific browser versions for compatibility

In addition to the cached browsers managed by BSI, you can also point BSI at a specific system browser executable via the `PUPPETEER_EXECUTABLE_PATH` environment variable. That is covered in more detail on the [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) page.

## Supported Browsers {#supported-browsers}

**Chrome is the only browser Butler Sheet Icons uses.** It is the only value `--browser` accepts, on every command that has the option, and full version control is available — including specific build numbers.

The reason is the rendering path. Thumbnails are produced by driving the browser over the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/), with a list of startup switches only Chromium-based browsers understand. No other browser can be driven that way.

::: warning Firefox is no longer accepted — BSI 5.0.0 or later
Earlier versions let you install, list and remove a Firefox that no command could ever launch. `--browser firefox` is now rejected everywhere, by `browser install`, `browser uninstall` and `browser list-available` as well as by the thumbnail commands:

```
error: option '--browser <browser>' argument 'firefox' is invalid. Allowed choices are chrome.
```

Values coming from an environment variable are checked against the same list, so the run fails at start-up rather than part-way through:

```
error: option '--browser <browser>' value 'firefox' from env 'BSI_BROWSER_LA_BROWSER' is invalid. Allowed choices are chrome.
```

The variables affected are `BSI_BROWSER_I_BROWSER` (`browser install`), `BSI_BROWSER_UI_BROWSER` (`browser uninstall`), `BSI_BROWSER_LA_BROWSER` (`browser list-available`) and the `..._BROWSER` variables of the two thumbnail commands.

Firefox's release channels `nightly`, `devedition` and `esr` are no longer valid `--browser-version` values either, and neither are its channel-prefixed build ids such as `stable_153.0.3`.

**If you have `--browser firefox` in a script**, remove the option. Chrome is the default, so nothing needs to replace it. A Firefox left in the browser cache by an earlier release is removed by [`browser uninstall-all`](/reference/browser#uninstall-all).
:::

`browser list-installed` and `browser uninstall-all` have no `--browser` option and are unaffected.

## Browser Cache Location

Browsers are downloaded and stored in a cache directory. Each browser version is stored in its own subdirectory for easy management.

Where that directory is depends on how you run Butler Sheet Icons:

| How you run it | Default cache directory |
| --- | --- |
| Standalone build (`butler-sheet-icons.exe` or `butler-sheet-icons`) | `browser-cache`, next to the executable |
| From Node.js | `.cache/puppeteer` in the current user's home directory |
| Docker image | Not used — the image ships its own browser |

::: warning Requires BSI 5.0.0 or later
Before 5.0.0 the cache was always in the home directory, with no way to change it. On a Qlik Sense server that meant the browser you installed as yourself was invisible to the service account running the scheduled task.
:::

**You can choose the directory yourself** with `--browser-cache-dir` or `BSI_BROWSER_CACHE_DIR` — which is the right thing to do on a server where a scheduled task and an administrator both need to reach the same browser. See [Browser Cache Directory](/guide/advanced/browser-cache-directory) for the full precedence order, what happens to a browser already in the old location, and how `PUPPETEER_CACHE_DIR` fits in.

## Initial Browser Setup

When running Butler Sheet Icons for the first time, you have several options. The most common ones are summarised below; the [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) page goes into more detail about detection order and environment variables.

### Automatic Download (Default)

If no browser is specified, BSI will automatically download the latest stable version of Chrome (when needed). From BSI 4.0.0 the download happens only once — later runs find the browser in the cache and reuse it, needing no download and no internet access for the browser itself. See [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables#cached-browser) for the exact matching rules.

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
# Install the recommended Chrome build
butler-sheet-icons browser install

# Install a specific Chrome build
butler-sheet-icons browser install --browser-version 121.0.6167.85
```

```powershell [PowerShell]
# Install the recommended Chrome build
butler-sheet-icons browser install

# Install a specific Chrome build
butler-sheet-icons browser install --browser-version 121.0.6167.85
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

Both are keywords rather than build numbers, so you do not need to know what Google currently calls its builds.

**`recommended` is the right choice for almost everyone.** It cannot get ahead of what Butler Sheet Icons is able to drive, and it changes only when you upgrade Butler Sheet Icons itself. That gives you two things:

- **Every server on the same Butler Sheet Icons version uses the same browser build.** A fleet of scheduled jobs cannot drift apart on its own.
- **No lookup at run time.** The build id is baked in, so once it is cached there is nothing to ask the vendor. With `stable`, every run first asks which build is currently newest.

Choose `stable` only if you specifically need the newest stable release — for example because a security policy requires it. Be aware that it follows whatever the vendor has promoted, which can be a build newer than Butler Sheet Icons has been tested against, and eventually one it **cannot drive at all**. See [Every app fails with `Target closed` or `Protocol error`](/guide/troubleshooting#every-app-fails-with-target-closed-or-protocol-error) for what that looks like and why it can appear overnight.

It also means a lookup on every run: on an offline or proxied machine that costs you connectivity you may not have. See [What `--browser-version` costs on an offline machine](/guide/concepts/browser-detection-and-environment-variables#what-browser-version-costs-on-an-offline-machine).

### What `recommended` points at {#what-recommended-points-at}

One exact Chrome build, decided by the browser automation library Butler Sheet Icons ships. It moves when that library is upgraded, which happens as part of upgrading Butler Sheet Icons — never on its own.

Every run says which build it resolved to:

```
info: Browser version "recommended" resolved to chrome build 151.0.7922.71 (the build this version of Butler Sheet Icons is tested with)
```

**BSI 5.0.0 resolves `recommended` to Chrome `151.0.7922.71`.** In 4.1.0 it was `151.0.7922.47`.

The practical consequence is that the first run after upgrading downloads the new build, and the previous one stays in the cache until you remove it:

```bash
butler-sheet-icons browser list-installed
butler-sheet-icons browser uninstall --browser-version 151.0.7922.47
```

::: tip Read the build from the log, not from here
This page states the build for the release named above. Your run tells you its own answer on the line quoted here, which is the one to trust — particularly if you are on a different version.
:::

Chrome's release **channels** are also accepted, and like `stable` they are resolved at run time: `beta`, `dev` and `canary`.

::: tip A browser is never bundled with Butler Sheet Icons
Whichever value you use, the browser is downloaded once and then kept in the local cache, so the first run on a new server always needs internet access. The keywords differ only in *how the build id is decided* — which is what matters on a server that is offline afterwards. See [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables).
:::

### Naming an exact build

You can pin an exact build. The format is checked before anything else happens, so a typo stops the run immediately with a message naming the accepted forms — it is never silently swapped for another build from the cache.

Three forms are accepted:

| Form | Example | Selects |
| --- | --- | --- |
| Milestone | `151` | The newest build of milestone 151 |
| Build prefix | `151.0.7922` | The newest patch of that build |
| Full build id | `151.0.7922.77` | Exactly that build |

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
