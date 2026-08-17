# Browser Commands Reference

Butler Sheet Icons (BSI) includes a comprehensive `browser` command that allows you to download, install, and manage browsers used for capturing sheet thumbnails. This command is particularly useful when you need specific browser versions for compatibility or testing purposes.

For details on how BSI decides which browser to use at runtime, and how environment variables like `PUPPETEER_EXECUTABLE_PATH` affect that behaviour, see the [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) concept page.

## Overview

BSI uses its own browser cache system and does not rely on browsers installed elsewhere on your system. This ensures consistency and allows for precise version control. The `browser` command manages Chrome across Windows, macOS, and Linux. Chrome is the only browser Butler Sheet Icons uses — see [Supported Browsers](/guide/concepts/browser-management#supported-browsers).

## Basic Usage

The browser command follows this general pattern:

```bash
butler-sheet-icons browser [command] [options]
```

### Available Commands

| Command          | Description                                                              | Needs internet? |
| ---------------- | ------------------------------------------------------------------------ | --------------- |
| `check`          | Check whether this machine can take sheet screenshots at all             | No              |
| `list-installed` | Show which browsers are currently installed and available for use by BSI | No              |
| `list-available` | Show which browsers are available for download and installation          | Yes (Chrome)    |
| `install`        | Install a browser into the BSI cache                                     | Only if it has to download or look up a version — see [below](#install) |
| `uninstall`      | Uninstall a specific browser from the BSI cache                          | No              |
| `uninstall-all`  | Uninstall all browsers from the BSI cache                                | No              |
| `help`           | Display help for browser commands                                        | No              |

On a machine without internet access, only the commands marked "No" above will work. See [Which browser commands need internet access?](/guide/concepts/browser-detection-and-environment-variables#which-browser-commands-need-internet-access) for what the offline failures look like and how to prepare an air-gapped machine.

## Commands Reference

### check

::: warning Requires BSI 5.0.0 or later
`browser check` did not exist in earlier versions. The only way to find out whether a machine could drive a browser was to run a full thumbnail job against a live Qlik Sense environment and see what happened.
:::

Answers one question: **will a real thumbnail run work on this machine?**

It answers it without contacting Qlik Sense, without changing anything, and without making a single network request. It is safe to run on a production Qlik Sense server at any time, and it is the first thing to run when a thumbnail run has failed for reasons that are not obvious.

::: tip Not sure the browser is the problem?
If you already know the problem is the browser, `browser check` is the command to run. If a Butler
Sheet Icons run has failed and you do not yet know why, run [`doctor`](/reference/doctor) instead —
it runs every check Butler Sheet Icons has, including all of the ones on this page.
:::

**Usage:**

::: code-group

```powershell [PowerShell]
.\butler-sheet-icons.exe browser check
```

```bash [Bash]
./butler-sheet-icons browser check
```

:::

**Options:**

<!-- generated:cli-options browser check -->

| Option                             | Environment Variable            | Description                                                                                                                                                                                                                                                                                                                                                                         | Default       | Example            |
| ---------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------ |
| `--log-level, --loglevel <level>`  | `BSI_BROWSER_C_LOG_LEVEL`       | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                                                                                                                                                                       | `info`        | `--loglevel error` |
| `--browser <browser>`              | `BSI_BROWSER_C_BROWSER`         | Browser to check for. Only "chrome" is supported. (choices: chrome)                                                                                                                                                                                                                                                                                                                 | `chrome`      | `--browser chrome` |
| `--browser-version <version>`      | `BSI_BROWSER_C_BROWSER_VERSION` | Browser build to check for. Either a keyword - "recommended" for the build Butler Sheet Icons is tested with, "stable" for the newest stable release, or a release channel such as "beta" - or an exact version: a milestone ("151"), a build prefix ("151.0.7922") or a full build id ("151.0.7922.77"). Use "butler-sheet-icons browser list-available" to see what is available. | `recommended` | -                  |
| `--browser-cache-dir <directory>`  | `BSI_BROWSER_CACHE_DIR`         | Directory where Butler Sheet Icons keeps downloaded browsers. Defaults to a "browser-cache" folder next to the Butler Sheet Icons executable for standalone builds, and to the .cache/puppeteer folder in the current user's home directory otherwise.                                                                                                                              | -             | -                  |
| `--browser-executable-path <path>` | `BSI_BROWSER_EXECUTABLE_PATH`   | Full path to a browser executable to use, for example a Microsoft Edge or Google Chrome already installed on this machine. Butler Sheet Icons then neither downloads nor manages a browser. Takes precedence over PUPPETEER_EXECUTABLE_PATH. If the file does not exist the run stops rather than downloading a browser instead.                                                    | -             | -                  |
| `--headless <true\|false>`         | `BSI_BROWSER_C_HEADLESS`        | Headless (=not visible) browser (true, false)                                                                                                                                                                                                                                                                                                                                       | `true`        | -                  |
| `--skip-launch [true\|false]`      | `BSI_BROWSER_C_SKIP_LAUNCH`     | Find a browser but do not start it. Faster, and useful where starting a browser is not allowed - but it leaves the most valuable part of the check undone.                                                                                                                                                                                                                          | `false`       | -                  |
| `-h, --help`                       | -                               | display help for command                                                                                                                                                                                                                                                                                                                                                            | -             | `-h`               |

<!-- /generated:cli-options -->

::: tip Pass the same browser options your real runs use
If your `qseow create-sheet-thumbnails` command sets `--browser-cache-dir` or `--browser-executable-path`, set them here too. Otherwise the check reports on a different browser cache than your real runs use, and a pass here proves nothing about them.
:::

#### What it checks {#check-what-it-checks}

Five things, in the order the report prints them:

| Section             | What it establishes                                                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Environment`       | Operating system, which account BSI is running as, that account's home directory, and the working directory the command was started from                |
| `Browser executable` | Whether a browser was named with `--browser-executable-path` or `BSI_BROWSER_EXECUTABLE_PATH`, and whether that file is there                           |
| `Browser cache`     | Where the cache is, whether this account can read it, whether it will be consulted at all, and which browser builds are in it — each marked usable or not |
| `Selection`         | Which browser a real run would actually pick, and where it is                                                                                           |
| `Launch test`       | The selected browser is started and asked for its version number, then closed again                                                                     |

The last one is the point. A browser file being in the right place proves much less than the browser actually starting: antivirus software, missing system libraries and browser builds BSI cannot drive all produce a browser that looks perfectly fine on disk and fails the moment it is used.

#### The exit code {#check-exit-code}

`browser check` sets the process exit code, so it can gate a deployment script:

| Exit code | Meaning                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| `0`       | A browser was found and — unless you passed `--skip-launch` — started successfully                                  |
| `1`       | No usable browser was found, the browser could not be started, or a setting is wrong in a way that would stop a real run |

::: code-group

```powershell [PowerShell]
.\butler-sheet-icons.exe browser check
if ($LASTEXITCODE -ne 0) {
    Write-Error "Butler Sheet Icons cannot take screenshots on this server. See the output above."
    exit 1
}
```

```bash [Bash]
./butler-sheet-icons browser check || {
    echo "Butler Sheet Icons cannot take screenshots on this server. See the output above." >&2
    exit 1
}
```

:::

See [Exit codes](/reference/commands#exit-codes) for what the other Butler Sheet Icons commands report.

#### A healthy server {#check-healthy-example}

The command reports facts even when everything is fine. That is deliberate: it is what lets you rule things out, and it is what makes the output worth attaching to a support request.

```
info: Butler Sheet Icons browser check
info: Environment
info:     Platform            : win32 x64 (Puppeteer platform "win64")
info:     Running as user     : svc_qlik
info:     Home directory      : C:\Users\svc_qlik
info:     Working directory   : C:\butler-sheet-icons
info:     Standalone binary   : true
info: Browser executable
info:     Configured          : no
info: Browser cache
info:     Source              : default location next to the Butler Sheet Icons executable
info:     Directory           : C:\butler-sheet-icons\browser-cache
info:     Directory exists    : yes
info:     In use              : yes
info:     Cached builds       : 1
info:         chrome 151.0.7922.71     platform=win64     executable present   usable
info: Selection
info:     Requested           : chrome recommended (build 151.0.7922.71)
info:     Would use           : cached browser (chrome 151.0.7922.71)
info:     Executable          : C:\butler-sheet-icons\browser-cache\chrome\win64-151.0.7922.71\chrome-win64\chrome.exe
info: Launch test
info:     Launched            : yes
info:     Reported version    : Chrome/151.0.7922.71
info: Note: these findings are best-effort. Butler Sheet Icons reports what it can observe on this
info: machine, and cannot see everything about your environment - group policy, antivirus, proxy rules
info: and Qlik Sense itself are all invisible to it. Review suggested commands before running them on a
info: production server.
info: Result: OK - Butler Sheet Icons can take screenshots on this machine without internet access.
```

Three lines are worth more attention than they look.

**`Running as user`, `Home directory` and `Working directory`.** When Butler Sheet Icons runs from a Windows scheduled task under the LocalSystem account, the home directory is `C:\Windows\system32\config\systemprofile` and the working directory is `C:\Windows\system32` — not the folder you installed it in. A browser cache staged into your own user profile is invisible to that account, and a `.env` file placed beside the executable is never read. Both symptoms are baffling until you see these three lines. See [Browser Cache Directory](/guide/advanced/browser-cache-directory).

**`In use`.** When you have named a browser executable and that file exists, the browser cache is never consulted. The line then reads `no (an executable path is configured, so the cache is not consulted)`, which tells you the cache directory setting is being ignored on purpose rather than silently failing.

**The best-effort note.** It appears on every run and cannot be switched off. Butler Sheet Icons is reasoning from what it can observe on one machine; group policy, antivirus rules, proxy configuration and Qlik Sense itself are all invisible to it.

#### How to read the output {#check-reading-the-output}

The output has two parts, and telling them apart saves confusion.

**The report** starts at the line `Butler Sheet Icons browser check` and runs to the end — the `Result:` line, and the numbered `Next steps:` that follow it when the run failed. Paste all of it into a support request.

**Above the report** are a few lines from the steps the command runs on the way there: the Butler Sheet Icons version, and then the browser-detection step's own log output. Those are shared with a real thumbnail run — they are exactly what a real run prints at that point, which is deliberate, because it means the check reproduces what you would see in a failing job.

That has one consequence worth knowing about in advance. When no staged browser matches, the detection step prints this:

```
warn: No cached chrome build matches --browser-version "recommended" (build 151.0.7922.71). Cached chrome builds that this machine can run: 151.0.7922.138. Set --browser-version to one of those build ids to use it instead. Butler Sheet Icons will now try to download chrome 151.0.7922.71, which needs internet access. On a machine without internet access this will fail.
```

::: warning `browser check` does not download anything
That sentence describes what a **real thumbnail run** would do next, because the same detection step is shared with the run. The check stops there and reports; nothing after that line reaches the network.
:::

When the run failed, read the report in three parts:

- The **`error:` lines within the report** say what was observed, with the actual values — which directory, which builds, which platform.
- The **`Result: FAILED` line** names the single most important problem in one sentence.
- The **`Next steps`** are ordered, and the first one is the one to try.

The suggested commands are shown for the operating system you are on: PowerShell on Windows, shell commands on macOS and Linux. Steps are never repeated: when one problem explains another, only the one you can act on carries advice.

Run with `--loglevel verbose` to see the one-sentence conclusion of every check, including the ones that passed:

```
verbose:     The browser cache holds no chrome builds
```

#### A server that cannot take screenshots {#check-failure-example}

```
info: Butler Sheet Icons browser check
info: Environment
info:     Platform            : win32 x64 (Puppeteer platform "win64")
info:     Running as user     : svc_qlik
info:     Home directory      : C:\Windows\system32\config\systemprofile
info:     Working directory   : C:\Windows\system32
info:     Standalone binary   : true
info: Browser executable
info:     Configured          : no
info: Browser cache
info:     Source              : from --browser-cache-dir / BSI_BROWSER_CACHE_DIR
info:     Directory           : D:\qlik\bsi-browser-cache
info:     Directory exists    : yes
info:     In use              : yes
info:     Cached builds       : 1
info:         chrome 151.0.7922.71     platform=mac_arm   executable present   not usable (built for another platform)
error:     The cache at D:\qlik\bsi-browser-cache holds 1 chrome build(s), for mac_arm. This machine is win64. A browser cache copied from a machine with a different operating system cannot be used.
info: Selection
info:     Requested           : chrome recommended (build 151.0.7922.71)
info:     Would use           : nothing - a browser would have to be downloaded
info: Note: these findings are best-effort. Butler Sheet Icons reports what it can observe on this
info: machine, and cannot see everything about your environment - group policy, antivirus, proxy rules
info: and Qlik Sense itself are all invisible to it. Review suggested commands before running them on a
info: production server.
error: Result: FAILED - the cached browsers were built for a different operating system
error: Next steps:
error:     1. Stage the browser from a machine running the same operating system as this one, and copy that machine's browser cache directory here.
error:        butler-sheet-icons.exe browser install --browser chrome --browser-version recommended
error:     2. Or, if Chrome or Edge is already installed on this machine, point Butler Sheet Icons at it with --browser-executable-path or BSI_BROWSER_EXECUTABLE_PATH.
```

This is the most common air-gapped staging mistake, and the report names it exactly: the browser was downloaded on a Mac and copied to a Windows server. **Always stage the browser from a machine running the same operating system as the target server.** [A cached browser was rejected](/guide/troubleshooting#a-cached-browser-was-rejected) in Troubleshooting explains which platform names are compatible with which.

#### What it catches {#check-what-it-catches}

Each row below is a real failure `browser check` reports before a thumbnail run ever starts. The Troubleshooting page covers the same failures from the other direction — the symptom you saw first.

| What is wrong                                                  | The `Result:` line                                                         | Where it is explained                                                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| A browser executable path that points nowhere                  | `the configured browser executable does not exist`                         | [`--browser-executable-path` is set but no such file exists](/guide/troubleshooting#browser-executable-path-missing) |
| A browser cache this account cannot read                       | `the browser cache directory could not be read`                            | [Browser Cache Directory](/guide/advanced/browser-cache-directory)                                              |
| A cache built for another operating system                     | `the cached browsers were built for a different operating system`          | [A cached browser was rejected](/guide/troubleshooting#a-cached-browser-was-rejected)                           |
| A cache copied without the browser binaries                    | `cached browsers are missing their executable files`                       | [A cached browser was rejected](/guide/troubleshooting#a-cached-browser-was-rejected)                           |
| The staged build is not the build being asked for              | `the requested browser build is not in the cache, although other builds are` | [A cached browser was rejected](/guide/troubleshooting#a-cached-browser-was-rejected)                           |
| Nothing usable at all                                          | `no usable browser was found, and taking screenshots would require downloading one over the internet` | [Browser detection order](/guide/concepts/browser-detection-and-environment-variables#browser-detection-order) |
| The browser starts and then stops responding                   | `the browser starts but cannot be driven by Butler Sheet Icons`            | [Every app fails with `Target closed` or `Protocol error`](/guide/troubleshooting#every-app-fails-with-target-closed-or-protocol-error) |
| The browser will not start at all                              | `the browser could not be started`                                         | [Browser Runtime Crashes](/guide/troubleshooting#browser-runtime-crashes)                                       |
| `--browser-version` cannot be resolved offline                 | `the requested browser version can only be resolved over the internet`     | [Which `--browser-version` values work offline](#check-browser-version-offline) below                          |
| `--browser-version` is not a value BSI accepts                 | `the requested browser version is not a value Butler Sheet Icons accepts`  | [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build)                         |

Two of these are worth expanding, because the report says something the message alone does not.

**A browser executable path that points nowhere.** Butler Sheet Icons deliberately stops rather than quietly downloading a different browser instead, so the `In use` line reads `no (an executable path is configured but missing, so detection stops before the cache)`. Staging a browser into that cache would not help until the path is corrected or removed.

**A browser that starts, but far too slowly.** This one passes and still tells you something. It is reported as a warning, and the exit code stays `0`:

```
warn:     Starting the browser took 92s, longer than the 30s launch timeout allows for. It worked this time, so this check passes - but a real run can exceed the timeout on the same machine and fail with an error naming none of this.
```

On Windows this is almost always antivirus or endpoint protection scanning a browser executable it has not seen before. Excluding the browser cache directory from real-time scanning avoids it — see [Excluding it from antivirus scanning](/guide/advanced/browser-cache-directory#excluding-it-from-antivirus-scanning). A run that is merely slow today is a run that fails intermittently tomorrow.

#### Which `--browser-version` values work offline {#check-browser-version-offline}

Not every way of naming a browser build survives on a server with no internet access, and `browser check` treats them differently because a real thumbnail run does.

| What you set                                    | Offline                                                                                                                       | Reported as       |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `recommended` (the default)                     | Works. Resolves from a value built into Butler Sheet Icons.                                                                   | nothing to report |
| A full build id, e.g. `151.0.7922.77`           | Works. Names one build, no lookup needed.                                                                                     | nothing to report |
| `stable`, `latest`, `beta`, `dev`, `canary`     | Works, but you may get a different build than a connected machine would. BSI falls back to the newest suitable build already staged. | a warning         |
| A milestone or partial id, e.g. `151` or `151.0.7922` | **Does not work.** There is no fallback for this form, so a real run stops with a lookup error before it looks at the cache.   | a failure         |

That last row is the surprising one — a partial version looks more precise than `stable`, and offline it is the one that cannot work:

```
info:     Requested           : chrome 151
info:     Would use           : cached browser (chrome 151.0.7922.138)
info:     Executable          : C:\butler-sheet-icons\browser-cache\chrome\win64-151.0.7922.138\chrome-win64\chrome.exe
info:     Requested version   : 151
error:     --browser-version "151" names a milestone or a partial build id, and turning that into a single build is the browser vendor's lookup. Butler Sheet Icons does not fall back to a cached build for this form - only for keywords such as "recommended" and "stable" - so a real run on a machine without internet access stops with a lookup error before it looks at the cache at all. Whatever this check reports about the browser here, a run with this setting cannot start offline.
error: Result: FAILED - the requested browser version can only be resolved over the internet
```

The report still shows which browser it *would* have used. That is not a contradiction: the browser is there and is fine — the version setting is what stops the run.

A floating keyword is only a warning, because a real run does fall back to what is staged:

```
warn:     --browser-version "stable" names whichever build is newest at the time it runs, which can only be resolved over the internet. This check did not make that call, so it accepted the newest suitable build already present instead. A real run on a machine with internet access may therefore choose a different build than the one reported here.
```

::: tip None of this applies when you name a browser yourself
When `--browser-executable-path` or `BSI_BROWSER_EXECUTABLE_PATH` names a file that exists, `--browser-version` has no bearing on the run at all — Butler Sheet Icons uses the browser you named. `browser check` says nothing about the version setting in that case, because a real run would not act on it either.
:::

#### `--headless` and `--skip-launch` {#check-boolean-options}

`--headless false` is worth trying if headless runs behave oddly: starting a visible browser on a server with no display is a genuinely different test, and it fails in a way a headless launch does not.

`--skip-launch` finds a browser but does not start it. When the launch test is skipped, the result line says so rather than claiming more than was checked:

```
info: Result: OK - a browser was found on this machine. It was not started, so whether it runs here is untested.
```

**Both options accept the same true/false words, and refuse anything else.** `true`, `1`, `yes` and `on` all mean on; `false`, `0`, `no` and `off` all mean off; case does not matter. Anything else is rejected with an error rather than quietly guessed at, so a typo in a scheduled task shows up as a failed command instead of a silently different test:

```
error: option '--headless <true|false>' argument 'maybe' is invalid. "maybe" is not a true/false value. Use one of: true, 1, yes, on - or false, 0, no, off.
```

`--skip-launch` can be written as a bare flag or with a value: `--skip-launch`, `--skip-launch true` and `BSI_BROWSER_C_SKIP_LAUNCH=true` all skip the launch test, while `--skip-launch false` and `BSI_BROWSER_C_SKIP_LAUNCH=false` run it. An environment variable that is set but left empty — `BSI_BROWSER_C_SKIP_LAUNCH=` — counts as "not set", so the option keeps its default.

#### What it deliberately does not do {#check-limits}

- **It makes no network requests of its own.** This is a hard rule, not a side effect: a diagnostic that hangs waiting for a DNS lookup on an air-gapped server is worse than no diagnostic at all. The check never downloads a browser and never contacts the browser vendor, even when the report says a real run would have to — see [How to read the output](#check-reading-the-output).
- **It never contacts Qlik Sense.** It tells you nothing about whether your certificates, virtual proxy or credentials are correct.
- **It changes nothing.** It installs nothing, downloads nothing and deletes nothing.
- **It does not open a web page.** The browser is started, asked for its version, and closed.

#### When to run it {#check-when-to-run}

- **After installing Butler Sheet Icons on a new server**, before scheduling anything.
- **After staging a browser** on a server with no internet access, to confirm the copy worked — this is the step that used to require a full production thumbnail run. See [Strategy 3: Use a pre-cached browser (semi-offline)](/guide/concepts/browser-detection-and-environment-variables#strategy-3-use-a-pre-cached-browser-semi-offline).
- **As the same account the scheduled task uses.** Running it as yourself proves very little about a task that runs as LocalSystem; the `Running as user` line is there to make that difference visible.
- **As the first step when a thumbnail run fails.** If `browser check` passes, the browser is not your problem, and you can look at Qlik Sense connectivity instead.
- **In a deployment script**, as a gate — see [CI/CD Integration](/guide/advanced/ci-cd).
- **When opening a support issue.** Paste the whole output, including the lines above the report. It says what operating system, which account, which directories, which browser builds and whether the browser starts, which is the single most useful thing you can attach to a browser-related bug report.

### list-installed

Lists browsers currently installed in the BSI cache. Note that this only shows browsers installed by BSI, not system-wide browser installations.

**Usage:**

```bash
butler-sheet-icons browser list-installed [options]
```

**Options:**

<!-- generated:cli-options browser list-installed -->

| Option                            | Environment Variable       | Description                                                                                                                                                                                                                                            | Default | Example            |
| --------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------------------ |
| `--log-level, --loglevel <level>` | `BSI_BROWSER_LI_LOG_LEVEL` | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                                          | `info`  | `--loglevel error` |
| `--browser-cache-dir <directory>` | `BSI_BROWSER_CACHE_DIR`    | Directory where Butler Sheet Icons keeps downloaded browsers. Defaults to a "browser-cache" folder next to the Butler Sheet Icons executable for standalone builds, and to the .cache/puppeteer folder in the current user's home directory otherwise. | -       | -                  |
| `-h, --help`                      | -                          | display help for command                                                                                                                                                                                                                               | -       | `-h`               |

<!-- /generated:cli-options -->

**Example Output (Windows):**

```powershell
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser list-installed
2024-02-16T14:10:55.141Z info: App version: 3.2.3
2024-02-16T14:10:55.141Z info: Installed browsers:
2024-02-16T14:10:55.156Z info:     chrome, build id=121.0.6167.85, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-121.0.6167.85
```

### list-available

Shows which browser versions are available for download. BSI automatically detects your operating system and only displays compatible versions.

**Usage:**

```bash
butler-sheet-icons browser list-available [options]
```

**Options:**

<!-- generated:cli-options browser list-available -->

| Option                            | Environment Variable       | Description                                                                                                                                                         | Default  | Example            |
| --------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------ |
| `--log-level, --loglevel <level>` | `BSI_BROWSER_LA_LOG_LEVEL` | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                       | `info`   | `--loglevel error` |
| `--browser <browser>`             | `BSI_BROWSER_LA_BROWSER`   | Browser to list available versions for. Only "chrome" is supported. Use "butler-sheet-icons browser install" to install one of the listed builds. (choices: chrome) | `chrome` | `--browser chrome` |
| `--channel <channel>`             | `BSI_BROWSER_LA_CHANNEL`   | Which of the browser's release channel versions should be listed? (choices: stable, beta, dev, canary)                                                              | `stable` | `--channel beta`   |
| `-h, --help`                      | -                          | display help for command                                                                                                                                            | -        | `-h`               |

<!-- /generated:cli-options -->

**Example Output (macOS):**

```bash
➜  butler-sheet-icons ./butler-sheet-icons browser list-available --browser chrome --channel stable
2024-02-16T14:15:46.237Z info: App version: 3.2.3
2024-02-16T14:15:46.677Z info: Chrome versions from "stable" channel:
2024-02-16T14:15:49.320Z info:     121.0.6167.85, "chrome/platforms/mac/channels/stable/versions/121.0.6167.85"
2024-02-16T14:15:49.684Z info:     121.0.6167.75, "chrome/platforms/mac/channels/stable/versions/121.0.6167.75"
2024-02-16T14:15:52.633Z info:     120.0.6099.109, "chrome/platforms/mac/channels/stable/versions/120.0.6099.109"
...
```

::: tip Build IDs
Note the build IDs (e.g., 121.0.6167.85) in the output. These are the exact identifiers to use when installing specific Chrome versions.
:::

::: warning Needs internet access
For Chrome, this command asks Google's Chrome version history service which versions exist, so it only works on a machine that can reach the internet. On an offline machine, or behind a proxy that blocks outbound HTTPS, it reports:

```
error: Could not reach versionhistory.googleapis.com to look up available browser versions.
error: Butler Sheet Icons needs internet access for this command. If this machine is offline or
       behind a proxy, use "butler-sheet-icons browser list-installed" to see the browsers already
       available locally.
```

Use `browser list-installed` instead to see what is already available locally — it reads the cache and never goes online.
:::

### install

Downloads and installs a browser into the BSI cache. By default, installs the Chrome build Butler Sheet Icons is tested with (`recommended`).

**Usage:**

```bash
butler-sheet-icons browser install [options]
```

**Options:**

<!-- generated:cli-options browser install -->

| Option                            | Environment Variable            | Description                                                                                                                                                                                                                                                                                                                                                                       | Default       | Example            |
| --------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------ |
| `--log-level, --loglevel <level>` | `BSI_BROWSER_I_LOG_LEVEL`       | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                                                                                                                                                                     | `info`        | `--loglevel error` |
| `--browser <browser>`             | `BSI_BROWSER_I_BROWSER`         | Browser to install. Only "chrome" is supported. Use "butler-sheet-icons browser list-installed" to see which browsers are currently installed. (choices: chrome)                                                                                                                                                                                                                  | `chrome`      | `--browser chrome` |
| `--browser-version <version>`     | `BSI_BROWSER_I_BROWSER_VERSION` | Browser build to install. Either a keyword - "recommended" for the build Butler Sheet Icons is tested with, "stable" for the newest stable release, or a release channel such as "beta" - or an exact version: a milestone ("151"), a build prefix ("151.0.7922") or a full build id ("151.0.7922.77"). Use "butler-sheet-icons browser list-available" to see what is available. | `recommended` | -                  |
| `--browser-cache-dir <directory>` | `BSI_BROWSER_CACHE_DIR`         | Directory where Butler Sheet Icons keeps downloaded browsers. Defaults to a "browser-cache" folder next to the Butler Sheet Icons executable for standalone builds, and to the .cache/puppeteer folder in the current user's home directory otherwise.                                                                                                                            | -             | -                  |
| `-i, --interactive`               | -                               | Answer questions instead of assembling a command line.<br>Options already supplied - here or through their BSI\_\* environment variables - are kept and not asked about again.                                                                                                                                                                                                    | -             | -                  |
| `-h, --help`                      | -                               | display help for command                                                                                                                                                                                                                                                                                                                                                          | -             | `-h`               |

<!-- /generated:cli-options -->

**Examples:**

Install latest Chrome (Windows):

```powershell
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser install
2024-02-16T14:13:35.312Z info: App version: 3.2.3
2024-02-16T14:13:35.484Z info: Resolved browser build id: "121.0.6167.85" for browser "chrome" version "stable"
2024-02-16T14:13:35.562Z info: Installing browser...
2024-02-16T14:13:44.062Z info: Browser "chrome" version "121.0.6167.85" installed
```

Install a specific Chrome build (macOS):

```bash
➜  butler-sheet-icons ./butler-sheet-icons browser install --browser-version 151.0.7922.77
2024-02-16T14:17:47.976Z info: Resolved browser build id: "151.0.7922.77" for browser "chrome" version "151.0.7922.77"
2024-02-16T14:17:48.343Z info: Installing browser...
2024-02-16T14:19:06.845Z info: Browser "chrome" version "151.0.7922.77" installed
```

#### Browser Version Notes

An exact build is a milestone (`151`), a build prefix (`151.0.7922`) or a full build id (`151.0.7922.77`). Some older builds may no longer be downloadable — use `list-available` to see what is currently offered.

The keywords `recommended` and `stable` are also accepted, as are Chrome's release channels `beta`, `dev` and `canary`. See [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build).

::: warning Older Chrome Versions
If you try to install an older Chrome version that's no longer available, you'll get a 404 error. The Chrome team periodically removes older versions from their download servers. Use a newer version instead.
:::

#### Installing a browser that is already there {#install-already-present}

::: warning Requires BSI 5.0.0 or later
Before 5.0.0, `browser install` checked that the build could be **downloaded** before it looked at what was already on the machine. On a server with no internet access that check failed, and the command reported that a browser sitting right there on disk `cannot be downloaded`. The suggested next step, `browser list-available`, needs internet access too, so there was no way forward.
:::

BSI now looks in the cache first. If the build you asked for is already there, it says so and stops, using no network at all:

```
chrome 151.0.7922.47 is already installed at
C:\butler-sheet-icons\browser-cache\chrome\win64-151.0.7922.47. Nothing to download.
To replace it, remove it first with "butler-sheet-icons browser uninstall
--browser-version 151.0.7922.47".
```

This is what lets you **confirm a staged browser on the air-gapped machine itself**. It also means `browser install` is now a **no-op when the requested build is already present** — it reports what is installed and exits successfully rather than installing over the top. To replace an installed browser, uninstall it first:

```bash
butler-sheet-icons browser uninstall --browser-version 151.0.7922.47
```

##### When it still needs internet access

Two separate things can require the network, and both must be avoided for a fully offline install:

| | Needs internet? |
| --- | --- |
| Resolving `--browser-version` | Depends on the value. `recommended` (the default) and an exact full build id such as `151.0.7922.77` need no lookup. `stable`, `latest`, a channel, a milestone (`151`) or a build prefix (`151.0.7922`) all do — see [What `--browser-version` costs on an offline machine](/guide/concepts/browser-detection-and-environment-variables#what-browser-version-costs-on-an-offline-machine). The lookup happens **before** the cache is consulted, so those values fail offline even when the browser is present. |
| Fetching the build | Only when the build is not already in the cache for this machine. |

So `butler-sheet-icons browser install`, with no options at all, completes offline on a machine with the matching browser staged.

##### Three cases where it still downloads

**A different build.** The cache holds a different version from the one requested. See [A cached browser was rejected](/guide/troubleshooting#a-cached-browser-was-rejected) — the message lists the build ids you have.

**A build for a different operating system.** Installing is about placing *this* machine's build, so a foreign build never counts as already installed. Note this is **stricter than the check made when taking screenshots**, which accepts a 32-bit Windows build on 64-bit Windows, or an Intel macOS build on Apple Silicon. Installing requires an exact platform match.

**A folder with no browser in it.** If the build's folder exists but the browser program inside it is missing — an incomplete copy, or an interrupted download — you will see:

```
A cached chrome 151.0.7922.47 directory exists at
C:\butler-sheet-icons\browser-cache\chrome\win64-151.0.7922.47, but the browser executable
is missing from it. Butler Sheet Icons will remove that directory and install the build
again, which needs internet access.
```

BSI removes the incomplete folder itself and installs the build again, which works on a machine with internet access. Nothing is lost by the removal: a folder with no browser program in it cannot be used for anything.

On an air-gapped machine the reinstall cannot succeed, so copy the browser across again — making sure your archiving tool includes hidden files, as several skip them by default and one of the files BSI needs is hidden.

See also [Which browser commands need internet access?](/guide/concepts/browser-detection-and-environment-variables#which-browser-commands-need-internet-access).

### uninstall

Removes a specific browser version from the BSI cache. This doesn't affect other browsers on your system, only those in the BSI cache.

::: tip Pick from a list instead of typing a version
`butler-sheet-icons interactive` offers the browsers actually in the cache, so you don't have to look up the exact build id first. See [Interactive Mode](/guide/interactive-mode).
:::

**Usage:**

```bash
butler-sheet-icons browser uninstall [options]
```

**Options:**

<!-- generated:cli-options browser uninstall -->

| Option                            | Environment Variable             | Description                                                                                                                                                                                                                                            | Default      | Example            |
| --------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------------------ |
| `--log-level, --loglevel <level>` | `BSI_BROWSER_UI_LOG_LEVEL`       | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                                          | `info`       | `--loglevel error` |
| `--browser <browser>`             | `BSI_BROWSER_UI_BROWSER`         | Browser to uninstall. Only "chrome" is supported. Use "butler-sheet-icons browser list-installed" to see which browsers are currently installed. (choices: chrome)                                                                                     | `chrome`     | `--browser chrome` |
| `--browser-version <version>`     | `BSI_BROWSER_UI_BROWSER_VERSION` | Browser build to uninstall: an exact build id (e.g. "151.0.7922.77"), or "recommended" for the build Butler Sheet Icons is tested with. Use "butler-sheet-icons browser list-installed" to see which builds are installed.                             | **Required** | -                  |
| `--browser-cache-dir <directory>` | `BSI_BROWSER_CACHE_DIR`          | Directory where Butler Sheet Icons keeps downloaded browsers. Defaults to a "browser-cache" folder next to the Butler Sheet Icons executable for standalone builds, and to the .cache/puppeteer folder in the current user's home directory otherwise. | -            | -                  |
| `-i, --interactive`               | -                                | Answer questions instead of assembling a command line.<br>Options already supplied - here or through their BSI\_\* environment variables - are kept and not asked about again.                                                                         | -            | -                  |
| `-h, --help`                      | -                                | display help for command                                                                                                                                                                                                                               | -            | `-h`               |

<!-- /generated:cli-options -->

**Example (Windows):**

```powershell
# First, see what's installed
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser list-installed
2024-02-16T14:24:20.112Z info: Installed browsers:
2024-02-16T14:24:20.112Z info:     chrome, build id=121.0.6167.85, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-121.0.6167.85
2024-02-16T14:24:20.112Z info:     chrome, build id=151.0.7922.77, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-151.0.7922.77

# Uninstall the older build
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser uninstall --browser-version 121.0.6167.85
2024-02-16T14:26:39.018Z info: Starting browser uninstallation
2024-02-16T14:26:39.018Z info: Uninstalling browser: chrome, build id=121.0.6167.85, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-121.0.6167.85
2024-02-16T14:26:39.096Z info: Browser "chrome", version "121.0.6167.85" uninstalled.

# Verify uninstallation
PS C:\tools\butler-sheet-icons> .\butler-sheet-icons.exe browser list-installed
2024-02-16T14:26:44.597Z info: Installed browsers:
2024-02-16T14:26:44.613Z info:     chrome, build id=151.0.7922.77, platform=win64, path=C:\Users\goran\.cache\puppeteer\chrome\win64-151.0.7922.77
```

#### Browsers built for another platform

::: warning Requires BSI 4.1.0 or later
In earlier versions this command could report that it had removed a browser while the browser was still on disk. It printed a success message, exited with code 0, and left the files in place.
:::

The BSI cache labels each browser with the platform it was built for — `win64`, `mac_arm`, `linux`, and so on. A cache can hold builds for another platform in several ordinary ways:

- The cache directory was copied from one machine to another, for example when preparing an offline server.
- The cache is on a shared or network drive used by more than one machine.
- The cache is mounted into a Docker container from a host running a different operating system.

Such builds **can** be removed — a browser you cannot run still takes up disk space. From 4.1.0 the removal actually happens, and the result is verified before success is reported.

When removal fails, the command says so and exits with a non-zero code, so a scheduled job can detect it:

```
error: Browser "chrome", version "151.0.7922.47" (built for win64) could not be removed. It is still in the cache at C:\Users\goran\.cache\puppeteer\chrome\win64-151.0.7922.47.
```

When the same version is cached for more than one platform, the build that can run on the current machine is removed first, and the ambiguity is reported:

```
warn: Build 151.0.7922.47 is cached for 2 platforms (win64, mac_arm). Removing the "win64" build; re-run to remove the next one.
```

Run the command again to remove the second one.

::: tip Worth checking once
If you have previously cleaned up browsers on a machine, run `browser list-installed` to check whether builds you believed were deleted are still there. If they are, `browser uninstall` will now remove them properly.
:::

### uninstall-all

Removes all browsers from the BSI cache. This is useful for cleaning up or resetting your browser cache.

**Usage:**

```bash
butler-sheet-icons browser uninstall-all [options]
```

**Options:**

<!-- generated:cli-options browser uninstall-all -->

| Option                            | Environment Variable       | Description                                                                                                                                                                                                                                            | Default | Example            |
| --------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------------------ |
| `--log-level, --loglevel <level>` | `BS_BROWSER_UIA_LOG_LEVEL` | Log level (choices: error, warn, info, verbose, debug, silly)                                                                                                                                                                                          | `info`  | `--loglevel error` |
| `--browser-cache-dir <directory>` | `BSI_BROWSER_CACHE_DIR`    | Directory where Butler Sheet Icons keeps downloaded browsers. Defaults to a "browser-cache" folder next to the Butler Sheet Icons executable for standalone builds, and to the .cache/puppeteer folder in the current user's home directory otherwise. | -       | -                  |
| `-h, --help`                      | -                          | display help for command                                                                                                                                                                                                                               | -       | `-h`               |

<!-- /generated:cli-options -->

**Example (macOS):**

```bash
# Check current installations
➜  butler-sheet-icons ./butler-sheet-icons browser list-installed
2024-02-16T14:27:20.427Z info: Installed browsers:
2024-02-16T14:27:20.428Z info:     chrome, build id=121.0.6167.85, platform=mac, path=/Users/goran/.cache/puppeteer/chrome/mac-121.0.6167.85
2024-02-16T14:27:20.428Z info:     chrome, build id=151.0.7922.77, platform=mac, path=/Users/goran/.cache/puppeteer/chrome/mac-151.0.7922.77

# Remove all browsers
➜  butler-sheet-icons ./butler-sheet-icons browser uninstall-all
2024-02-16T14:29:24.990Z info: Starting uninstallation of all browsers
2024-02-16T14:29:24.991Z info: Uninstalling 2 browsers:
2024-02-16T14:29:24.992Z info:     Starting uninstallation of "chrome", build id "121.0.6167.85", platform "mac", path "/Users/goran/.cache/puppeteer/chrome/mac-121.0.6167.85"
2024-02-16T14:29:25.880Z info: Browser "chrome" (121.0.6167.85) uninstalled.
2024-02-16T14:29:25.881Z info:     Starting uninstallation of "chrome", build id "151.0.7922.77", platform "mac", path "/Users/goran/.cache/puppeteer/chrome/mac-151.0.7922.77"
2024-02-16T14:29:26.213Z info: Browser "chrome" (151.0.7922.77) uninstalled.
2024-02-16T14:29:26.214Z info: Removing any files the uninstall left behind in the browser cache

# Verify all browsers removed
➜  butler-sheet-icons ./butler-sheet-icons browser list-installed
2024-02-16T14:29:29.944Z info: No browsers installed
```

## Common Use Cases

### Development Environment Setup

1. **Install a browser:**

   ```bash
   # Install the recommended Chrome build
   butler-sheet-icons browser install

   # Or the newest stable Chrome
   butler-sheet-icons browser install --browser-version stable
   ```

2. **Verify installation:**

   ```bash
   butler-sheet-icons browser list-installed
   ```

### CI/CD Pipeline Setup

In automated environments, you might want to ensure specific browser versions:

```bash
# Install specific Chrome version for reproducible builds
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# Verify the exact version is installed
butler-sheet-icons browser list-installed
```

### Troubleshooting Browser Issues

If you're experiencing browser-related problems:

1. **Start with `browser check`** — it reports the account, the cache, the browser
   that would be selected and whether it actually starts, without contacting Qlik
   Sense. See [check](#check).

   ```bash
   butler-sheet-icons browser check
   ```

2. **Check available versions** (needs internet access):

   ```bash
   butler-sheet-icons browser list-available --browser chrome
   ```

3. **Clean browser cache:**

   ```bash
   butler-sheet-icons browser uninstall-all
   ```

4. **Reinstall the browser:**

   ```bash
   butler-sheet-icons browser install
   ```

## Integration with Sheet Commands

Browser commands work seamlessly with BSI's sheet thumbnail creation commands. Once browsers are installed, you can specify which browser to use:

```bash
# Use specific browser for QS Cloud
butler-sheet-icons qscloud create-sheet-thumbnails \
  --tenant your-tenant \
  --app-id "app-123" \
  --browser chrome \
  --browser-version 121.0.6167.85

# Pin a different Chrome build for QSEoW
butler-sheet-icons qseow create-sheet-thumbnails \
  --host sense.company.com \
  --app-id "app-456" \
  --browser chrome \
  --browser-version 120.0.6099.109
```

## Browser Cache Location

BSI keeps the browsers it downloads in a cache directory. Where that is depends on how you run it — the first of these that is set wins:

| Order | Location | Set by |
| --- | --- | --- |
| 1 | The directory you name | `--browser-cache-dir <directory>` or `BSI_BROWSER_CACHE_DIR` |
| 2 | The directory `PUPPETEER_CACHE_DIR` names | `PUPPETEER_CACHE_DIR` |
| 3 | `browser-cache` next to `butler-sheet-icons(.exe)` | Automatic, **standalone builds only** |
| 4 | `.cache/puppeteer` in the current user's home directory | Automatic, everything else |

::: warning Requires BSI 5.0.0 or later
In earlier versions the cache was always `.cache/puppeteer` in the home directory of whichever account ran BSI. There was no way to change it, and `PUPPETEER_CACHE_DIR` was ignored.
:::

These directories hold the actual browser binaries and are managed automatically by BSI.

The difference between the two automatic locations matters on a Qlik Sense server. Row 4 follows the **account**: a browser installed by one user is not visible to another, so a scheduled task running as LocalSystem looks in `C:\Windows\system32\config\systemprofile` rather than in your profile, finds nothing, and downloads its own copy — or fails, on a server with no internet access. Row 3 follows the **installation** instead, which is why the standalone builds use it: everyone who runs that copy of BSI gets the same browser.

To make the location the same for every account, name it explicitly with `--browser-cache-dir` or `BSI_BROWSER_CACHE_DIR` rather than relying on either default. [`browser check`](#check) reports the directory BSI resolved, which account it resolved it as, and which builds are in it.

See [Browser Cache Directory](/guide/advanced/browser-cache-directory) for the full picture, including what happens when a browser is still in the pre-5.0.0 location.

## Related Documentation

- [Browser Management Concepts](/guide/concepts/browser-management) - Understanding BSI's browser system
- [Browser Management Examples](/examples/browser-management) - Hands-on browser management examples
- [Commands Overview](/reference/commands) - Complete command reference including QS Cloud and QSEoW
- [Troubleshooting](/guide/troubleshooting) - Solving browser-related issues
- [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) - How BSI decides which browser to use, and how to prepare a machine with no internet access
