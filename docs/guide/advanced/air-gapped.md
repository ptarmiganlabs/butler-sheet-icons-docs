# Running on an Air-Gapped Server

Butler Sheet Icons can create thumbnails on a server with no internet access. This page is the procedure for the standalone binaries for Windows, Linux and macOS, from preparing the server to a verified result.

Running the Docker image instead? Then you need none of this, because the browser is already inside the image. See [Air-gapped environments](/guide/advanced/docker#air-gapped-environments) on the Docker page.

::: warning Requires BSI 5.0.0 or later
This procedure depends on `--browser-executable-path`, `--browser-cache-dir` and `browser check`, and on `browser install` working without internet access. All of them arrived in 5.0.0. On an earlier version, upgrade first.
:::

## No internet is not the same as no network

Butler Sheet Icons needs no internet access to create thumbnails for Qlik Sense Enterprise on Windows. It does need to reach your Qlik Sense server: the proxy on port 443 (80 with `--secure false`), the engine on port 4747 (`--engineport`) and the repository service on port 4242 (`--qrsport`). Those are on your own network, and a firewall that blocks them stops the run however the browser is set up. The [Docker page](/guide/advanced/docker#what-the-container-needs-to-reach) has the details.

Qlik Sense Cloud is on the public internet, so the `qscloud` commands cannot be used from an air-gapped server. Everything on this page is about QSEoW.

## Choose how the server gets a browser

Butler Sheet Icons photographs sheets with a Chromium-based browser. On a connected machine it downloads one the first time it needs it. On an air-gapped server that download cannot happen, so you provide the browser up front, in one of two ways:

| | Route A: a browser already on the server | Route B: a browser staged from a connected machine |
| --- | --- | --- |
| **What you do** | Point Butler Sheet Icons at Microsoft Edge or Google Chrome | Download the browser Butler Sheet Icons uses on a connected machine, and copy it across |
| **What crosses the gap** | Only Butler Sheet Icons itself | Butler Sheet Icons and its browser cache |
| **A connected machine** | Not needed | Needed, running the same operating system as the server |
| **Keeping the browser patched** | Your normal software deployment | You, by staging again |
| **After upgrading Butler Sheet Icons** | Nothing to do but check | Stage again |

**Use Route A if you can.** Microsoft Edge is installed by default on current Windows Server releases, so on most Qlik Sense servers Route A comes down to one extra option on the command line. Use Route B when the server has no suitable browser, or when policy does not allow Butler Sheet Icons to use the one that is there.

## Route A: use a browser already on the server

### 1. Find the browser

Confirm the path on the server itself rather than assuming it. Installers vary, and both vendors have moved these locations over the years.

::: code-group

```powershell [PowerShell]
Test-Path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

```bash [Bash]
command -v chromium chromium-browser google-chrome
```

:::

Any Chromium-based browser works. See [Which browsers work](/guide/concepts/browser-detection-and-environment-variables#which-browsers-work).

### 2. Check it

Give the path to `browser check`. It starts the browser to prove it runs, makes no network requests and never contacts Qlik Sense, so it is safe to run on a production server:

::: code-group

```powershell [PowerShell]
.\butler-sheet-icons.exe browser check --browser-executable-path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
```

```bash [Bash]
./butler-sheet-icons browser check --browser-executable-path /usr/bin/chromium
```

:::

The report ends with:

```
info: Result: OK - Butler Sheet Icons can take screenshots on this machine without internet access.
```

### 3. Use it in the scheduled run

Add the same option to the command your scheduled task runs, alongside your usual options:

```powershell
.\butler-sheet-icons.exe qseow create-sheet-thumbnails --browser-executable-path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" ...
```

Setting the environment variable `BSI_BROWSER_EXECUTABLE_PATH` does the same job. For a scheduled task the command-line option is the safer choice, because it is visible in the task definition and does not depend on which account's environment the task inherits.

That is all. Butler Sheet Icons uses that browser as it is, and never tries to download one:

- **If the path is wrong, the run stops** instead of falling back to a download. On an air-gapped server a download could only fail, and silently running a different browser from the one you named would be worse.
- **`--browser-version` no longer matters.** Butler Sheet Icons does not look up a version when you have named a browser. If you set one anyway, it warns that your browser overrides it. See [What `--browser-version` does when a browser is named](/guide/concepts/browser-detection-and-environment-variables#what-browser-version-does-when-a-browser-is-named).
- **Butler Sheet Icons does not update this browser.** Patching stays with whoever deploys Edge or Chrome on your servers. Run `browser check` again after either the browser or Butler Sheet Icons is updated.

## Route B: stage a browser from a connected machine

You need two things:

- **A connected machine running the same operating system as the server.** For a Windows server, that means a Windows machine. `browser install` only downloads browsers for the machine it is running on, and a browser downloaded on a Mac cannot run on Windows.
- **The same version of Butler Sheet Icons on both machines.** Each version looks for the one browser build it was tested with, so a browser staged with one version is not the browser another version looks for.

### 1. On the connected machine: install the browser

Unpack the same release you will use on the server into a folder, for example `C:\butler-sheet-icons`, and run `browser install` from it:

::: code-group

```powershell [PowerShell]
cd C:\butler-sheet-icons
.\butler-sheet-icons.exe browser install
```

```bash [Bash]
cd /opt/butler-sheet-icons
./butler-sheet-icons browser install
```

:::

No options are needed. The default version, `recommended`, is the build this version of Butler Sheet Icons is tested with, and it needs no lookup. The download comes from `storage.googleapis.com`, which is the only internet host this step needs.

The standalone binary keeps its browsers in a `browser-cache` folder next to itself, so the folder now holds everything the server needs:

```
C:\butler-sheet-icons\
    butler-sheet-icons.exe
    browser-cache\
        chrome\
            win64-151.0.7922.71\
```

The build number is an example. Yours depends on your version of Butler Sheet Icons.

### 2. Move the folder across

Copy the whole folder to the server using whatever process your organization has for moving software, and keep `browser-cache` next to the binary.

On Linux and macOS, package it with `tar`, which keeps file permissions. Some zip tools drop the executable bit, and the browser then cannot start.

### 3. On the server: check it

::: code-group

```powershell [PowerShell]
cd C:\butler-sheet-icons
.\butler-sheet-icons.exe browser check
```

```bash [Bash]
cd /opt/butler-sheet-icons
./butler-sheet-icons browser check
```

:::

A good report lists the staged build as usable, starts it, and ends with the same line as Route A:

```
info:         chrome 151.0.7922.71     platform=win64     executable present   usable
...
info: Result: OK - Butler Sheet Icons can take screenshots on this machine without internet access.
```

### 4. Run as normal

No browser options are needed. The binary finds `browser-cache` next to itself whichever account runs it, including a scheduled task running as LocalSystem. That account does need permission to read the folder and to run the files in it.

The folder can be read-only. Butler Sheet Icons only writes to it when it has to download a browser, and with the browser already staged it never does.

To keep the browser cache somewhere else, for example one shared location on the server, point Butler Sheet Icons at it with `--browser-cache-dir` or `BSI_BROWSER_CACHE_DIR`. Use the same setting for `browser check` and for the scheduled run. See [Browser Cache Directory](/guide/advanced/browser-cache-directory).

## When `browser check` fails

`browser check` exits with code 1 whenever a real run would fail on this machine, so it also works as a gate in a deployment script. The report names the cause and the next step. These are the failures you are likely to meet on an air-gapped server:

| The `Result:` line says | Why | What to do |
| --- | --- | --- |
| `the configured browser executable does not exist` | Route A: the path does not name a file on this server | Correct the path. The report lists the usual locations of Edge and Chrome. |
| `the cached browsers were built for a different operating system` | Route B: the browser was staged on a machine running another operating system | Stage again from a machine running the server's operating system |
| `the requested browser build is not in the cache, although other builds are` | Route B: the two machines ran different versions of Butler Sheet Icons, or it was upgraded after staging | Stage again with the version the server runs. See [Upgrading Butler Sheet Icons](#upgrading-butler-sheet-icons). |
| `no usable browser was found, and taking screenshots would require downloading one over the internet` | Route B: no browser where Butler Sheet Icons looked, usually because `browser-cache` did not end up next to the binary | Move the folder next to the binary, or name it with `--browser-cache-dir` |
| `the browser could not be started` | On Windows, usually antivirus holding a browser it has not seen before. On Linux or macOS, `EACCES` in the message means the executable bit was lost in the copy. | Exclude the folder from real-time scanning (see [Excluding it from antivirus scanning](/guide/advanced/browser-cache-directory#excluding-it-from-antivirus-scanning)), or copy it again with `tar` |

::: tip Check it the way the task will run
Run `browser check` with the same options as the scheduled task, and as the same account if you can. The top of the report shows which account it ran as and from which working directory, which is what explains a check that passes for you and a task that fails.
:::

## Upgrading Butler Sheet Icons

**Route A:** upgrade as usual, then run `browser check`.

**Route B:** each version of Butler Sheet Icons looks for its own browser build, so after an upgrade the staged browser is no longer the one it wants, and `browser check` fails with `the requested browser build is not in the cache, although other builds are`. Repeat Route B with the new version. The old build can stay until the new one has passed `browser check`, and `browser uninstall` removes it afterwards.

If a run has to happen before you can stage again, the report also suggests pinning the build you already have with `--browser-version` and its full build id, for example `--browser-version 149.0.7827.22`. That works offline, but it runs Butler Sheet Icons with a browser build it was not tested with, so treat it as a stopgap.

This is the main reason to prefer Route A where you can.

## What Butler Sheet Icons connects to

For a security review:

- **A QSEoW thumbnail run set up as on this page connects only to your Qlik Sense server.**
- Butler Sheet Icons uses the internet only to get a browser or look up a browser version: `storage.googleapis.com` for downloads, `googlechromelabs.github.io` to turn a version name such as `stable` into a build, and `versionhistory.googleapis.com` for `browser list-available`. Neither route needs any of them once the server is set up.
- The `qscloud` commands connect to your Qlik Sense Cloud tenant.
- Butler Sheet Icons sends no usage data and does not check for updates.

If the connected machine in Route B reaches the internet through a proxy, see [Proxy Configuration](/guide/advanced/proxy).

## Related

- [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables): how Butler Sheet Icons chooses a browser, and why
- [Browser Cache Directory](/guide/advanced/browser-cache-directory): where the cache lives, and how to move it
- [`browser check`](/reference/browser#check) and [`doctor check`](/reference/doctor): the diagnostic commands in full
- [Docker: air-gapped environments](/guide/advanced/docker#air-gapped-environments): the same job with the Docker image
