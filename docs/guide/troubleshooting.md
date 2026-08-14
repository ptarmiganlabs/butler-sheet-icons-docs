# Troubleshooting

This guide covers common issues and solutions when using Butler Sheet Icons. Most problems fall into a few categories: authentication, configuration, or environmental issues.

## Quick Diagnostic Steps

Before diving into specific issues, try these general diagnostic steps:

### 1. Verify Installation

```bash
butler-sheet-icons --version
butler-sheet-icons --help
```

### 2. Test with Verbose Logging

```bash
butler-sheet-icons qscloud create-sheet-icons --loglevel debug
```

### 3. Run in Non-Headless Mode

```bash
butler-sheet-icons qscloud create-sheet-icons --headless false
```

### 4. Check Browser Installation

```bash
butler-sheet-icons browser list-installed
```


## Fixed in 4.1.0: options and messages that told you the wrong thing

::: warning Requires BSI 4.1.0 or later
If you are running an earlier version, the behaviour described below still applies to you and the workarounds may still be needed.
:::

Five fixes in 4.1.0 share a theme: Butler Sheet Icons accepted something, or reported something, that did not match what it actually did. If you built a workaround around any of them, it can now be removed.

### Two options that never took effect

| Option | What happened before |
|---|---|
| `--skip-login` (QS Cloud) | Silently ignored. Login was always attempted, and the log line announcing the skip could never appear. |
| `--port` (QSEoW) | Not available, so a Qlik Sense server on a non-default port could not be reached without a proxy. |

Both now behave as documented. If you set `--skip-login` and worked around it being ignored, that workaround is no longer needed.

### Three errors that named the wrong cause

These did not change what fails — they changed what you are told, which is the difference between a five-minute fix and an afternoon.

| Symptom | Before | Now |
|---|---|---|
| A certificate file exists but cannot be read — wrong permissions, or a directory where a file was expected | Reported as a **missing** certificate, sending you to look for a file that was there all along | Reports that the file could not be read, and why |
| The Qlik Sense server answers, but with something unexpected — a proxy login page, an error body | Reported as a **missing content library**, sending you to check a content library that was fine | Reports that the server's answer could not be understood |
| A per-app lookup fails for one app | Surfaced as an internal error, with no indication which app | Names the app and continues with the rest |

If you have monitoring rules or log filters matching the old wording, they will stop firing. That is the point — but they need removing.

## Run Failures and Exit Codes {#run-failures-and-exit-codes}

::: warning Requires BSI 4.0.0 or later
Earlier versions always exited with `0`. If your automation never reported a failure before upgrading, that is why — see [Exit codes and job status](/guide/advanced/ci-cd#exit-codes-and-job-status).
:::

An exit code of `1` means the run failed, or finished with apps it could not process. Butler Sheet Icons logs a reason. Match the message you see below.

### `Failed to process N of M app(s)`

Some apps in the run could not be processed. The other apps were still attempted — one bad app does not stop the rest — and this line is the summary at the end.

Each failed app has its own line earlier in the log naming the cause:

```
CLOUD PROCESS APP: Failed to process app b: engine unreachable
Failed to process 1 of 3 app(s)
```

**What to do:** find the per-app lines and treat each cause separately. They are ordinary failures — an unreachable engine, an app the account cannot write to, a published app — and are covered by the sections below.

A per-app line reading `Lost the engine session while processing app … at sheet N` is a different case: the connection to Qlik Sense dropped mid-app. See [The connection to Qlik Sense drops in the middle of a run](#engine-session-dropped-mid-run).

### `No apps to process`

The options you supplied matched no apps at all. This is reported as a failure, not a silent success: work was requested and none happened.

```
No apps to process. Check the --appid and --collectionid options.
```

On Qlik Sense Enterprise on Windows the hint names `--appid` and `--qliksensetag` instead.

**What to do:** check the selection options themselves. Common causes are a collection that exists but contains no apps, a tag that no app carries, or an app ID that has been deleted. On QS Cloud, `butler-sheet-icons qscloud list-collections` shows which collections exist.

### `Failed to update N of M sheet(s) in app <id>`

One or more sheets in an app could not be updated, or their icons could not be removed. The app is reported as failed, and therefore so is the run.

```
CLOUD UPDATE SHEETS: Failed to update sheet 1 ('Sales overview', ID abc-123) in app 97089caf: Sheet is read-only
Failed to update 1 of 2 sheet(s) in app 97089caf
```

Every other sheet is still attempted first, and the engine session is always released — only at the end is the app reported as failed.

**Reading the counts:** the number is of sheets Butler Sheet Icons **tried** to update. Sheets deliberately left alone — because you excluded them, or because no thumbnail was generated for them — are counted in neither figure. So "1 of 2" means two sheets were attempted and one failed, regardless of how many sheets the app has in total.

The per-sheet line names the sheet by title and ID, which is what you need to find it in Qlik Sense. The number is the sheet's position in the app, counting from 1.

**What to do:** open the named sheet. A read-only or published sheet cannot be updated by the account BSI is running as. See [App Access Issues](#app-access-issues).

### `Connection test to tenant ... returned a response with no user in it`

The Qlik Sense Cloud connection test reached something, but the response did not describe a user.

```text
Connection test to tenant mytenant.eu.qlikcloud.com returned a response with no user in it. Check that --tenanturl points at a Qlik Sense Cloud tenant and that --apikey is a valid, unexpired API key for it.
```

In earlier versions, the output was misleading:

```diff
- info: Connection to tenant mytenant.eu.qlikcloud.com successful.
- info:     Tenant ID : undefined
- info:     User name : undefined
- info:     User email: undefined
- info:     User ID   : undefined
+ Connection test to tenant mytenant.eu.qlikcloud.com returned a response with no user in it. Check that --tenanturl points at a Qlik Sense Cloud tenant and that --apikey is a valid, unexpired API key for it.
```

The run then failed later for reasons that looked unrelated.

**What to do:** verify `--tenanturl` points at a Qlik Sense Cloud tenant and that `--apikey` is valid and unexpired. See [QS Cloud Authentication Problems](#qs-cloud-authentication-problems).

### `Failed to upload N of M thumbnail image(s)`

Thumbnail images were generated but could not be uploaded, so **the app was left untouched** and its sheets keep the icons they already had.

On Qlik Sense Cloud:

```
CLOUD APP (stack): CloudError: Failed to upload 2 of 5 thumbnail image(s) to Qlik Sense Cloud app abc-123
```

On Qlik Sense Enterprise on Windows the message names the content library instead:

```
QSEOW: qseowProcessApp (stack): QseowError: Failed to upload 2 of 5 thumbnail image(s) to content library BSI thumbnails
```

::: warning Requires BSI 4.0.0 or later
In earlier versions the run carried on after a failed upload and repointed **every** sheet at an image that was not there, replacing working icons with broken ones — and reported no error. If apps are showing broken sheet icons from an earlier run, see "Repairing apps affected before upgrading" below.
:::

**What to do:**

1. **Your sheets are safe.** Nothing in the app was changed, so its existing icons are intact. There is no cleanup to do.
2. **Read the lines immediately above**, prefixed `CLOUD UPLOAD 1` or `QSEOW UPLOAD 1`. Those name the underlying reason — that is where the actual cause is. Common ones are an image larger than the tenant or server accepts, a content library that does not exist or that the account cannot write to, and network interruptions.
3. **Fix the cause and re-run.** The command is safe to run again.

Every image is attempted before the run stops, so one failure does not hide the others — the count tells you how widespread the problem is.

#### Repairing apps affected before upgrading

If earlier runs left apps showing broken sheet icons, re-running `create-sheet-thumbnails` against those apps repairs them, once the upload problem itself is resolved. To clear the icons instead of regenerating them, use `qscloud remove-sheet-icons` — note this exists only for Qlik Sense Cloud.

### I piped the output to `head` and got a crash report {#crash-report-from-piping}

```bash
butler-sheet-icons browser list-available --channel stable | head -12
```

Until BSI 5.0.0 that left a `crash_dumps` folder behind, in whatever directory you were standing in, with a report saying `write EPIPE`.

Nothing had gone wrong. `head` stops reading once it has the lines you asked for, and the next line Butler Sheet Icons tried to print had nowhere to go. The same happened with a pager you quit early, and with `grep -m1`.

::: warning Requires BSI 5.0.0 or later
A closed output pipe is now an ordinary end to the run: no crash report, nothing printed, and your working directory is left as it was. The run exits with **141** rather than `1` — see [Exit code 141](/reference/commands#exit-code-141).
:::

**On an earlier version**, the dumps are harmless and safe to delete. Real failures are unaffected either way — a genuine error still writes a crash report, even when the output pipe has already closed. See [Crash Dump Files](/guide/advanced/crash-dumps#a-closed-output-pipe-is-not-a-crash).

### `Qlik Sense Cloud returned an unusable response` {#cloud-unusable-response}

Butler Sheet Icons asked your tenant for a list — your collections, the apps in a collection, or the apps on the tenant — and what came back was not a list.

```
Qlik Sense Cloud returned an unusable response for "collections": expected a list, got string
```

The last word is what arrived instead: `string` for an HTML page, `object` for an error document. If the tenant answered successfully but sent nothing at all, you get this instead:

```
Qlik Sense Cloud returned status 200 and an empty body for "collections", expected a list
```

::: warning Requires BSI 5.0.0 or later
Earlier versions failed with `TypeError: allCollections.map is not a function`, naming a variable inside Butler Sheet Icons. It did not say which request failed, which tenant answered, or what the tenant actually sent.
:::

The quoted part is the request that failed, which tells you what to look at:

| Request | What Butler Sheet Icons was asking for |
| ------------------------ | -------------------------------------- |
| `collections` | The collections on your tenant |
| `collections/<id>/items` | The contents of one collection |
| `items?resourceType=app` | Every app on the tenant |

**What to check:**

This message means the request **succeeded** — Qlik Cloud, or something standing in for it, answered with a normal success code — but what came back was not a list of anything. That narrows the cause considerably:

- **Something is answering instead of your tenant.** A proxy, gateway or corporate network that intercepts outbound traffic will happily return its own page with a 200. `got string` almost always means HTML arrived where JSON was expected. Try the same URL from the machine running Butler Sheet Icons and look at what comes back.
- **The tenant URL points somewhere that is not a Qlik Cloud tenant.** A typo in `--tenanturl` that still resolves to a real web server produces exactly this.
- **An empty body** usually means a gateway timed out and closed the response without content.

::: tip A rejected API key does **not** produce this message
Expired keys, missing scopes and wrong tenant names return proper HTTP error codes, and those are reported separately as a failed request naming the status. If you are chasing a permissions problem, that is the message to look for — not this one. See [QS Cloud Authentication Problems](#qs-cloud-authentication-problems).
:::

**An empty result is still an empty result.** A tenant with no collections, or a collection with no apps, is a normal answer and is treated as one. Only a reply Butler Sheet Icons cannot read is reported as a failure. That matters for scheduled jobs: a broken tenant can no longer look like a successful run that happened to have nothing to do.

**On Qlik Sense Enterprise on Windows** the equivalent message names the QRS instead, and means the same thing — something answered where the repository service was expected:

```
QRS returned an unusable response for "app/full": expected a list, got string
```

The quoted part is the QRS path that was asked for, in the same way as the Cloud paths above.

### `Skipping collection item … as it claims to be an app but carries no app id`

An entry in an otherwise valid list claims to be an app but carries no app id. It is skipped with a warning and the other apps in the list are processed as normal:

```
warn: Skipping collection item 61b1c8e5f9d4a70001d4e5f6 as it claims to be an app but carries no app id
```

::: warning Requires BSI 5.0.0 or later
Previously such an entry either stopped the run outright or, worse, was carried forward as an app with no id and reported later as a failure that named nothing.
:::

**What to do:** that one app is missing from the run. The warning names the item so you can find it in the tenant. `warn: Skipping tenant item …` is the same thing when the apps were listed from the tenant rather than from a collection.

### `TypeError: Cannot read properties of undefined (reading 'rank')`

A single sheet missing its layout data caused the **whole app** to be abandoned before any thumbnail was created or removed. Every other sheet in that app was left untouched.

::: warning Requires BSI 4.0.0 or later
Fixed. Such sheets are now sorted to the end of the sheet list and processed like any other, so the app completes.
:::

Search your logs for `reading 'rank'` — that phrase is identical in every case. The text before it varies by platform and by how far the run had got:

| Platform | Stage | Log line begins |
| --- | --- | --- |
| Qlik Sense Cloud | Creating thumbnails | `CLOUD APP (stack):` |
| Qlik Sense Cloud | Applying thumbnails to sheets | `CLOUD UPDATE SHEETS (stack):` |
| Qlik Sense Cloud | Removing sheet icons | `CLOUD REMOVE SHEET ICONS 1 (stack):` |
| Enterprise on Windows | Creating thumbnails | `QSEOW: qseowProcessApp (stack):` |
| Enterprise on Windows | Applying thumbnails to sheets | `QSEOW UPDATE SHEETS (stack):` |

A closely related failure, `reading 'showCondition'`, is fixed by the same change and is worth searching for too. It struck slightly later — after thumbnails had been generated but before they were uploaded, so the work was still discarded.

**What to do:** upgrade and re-run. The affected apps should now complete.

**What causes it:** the sheet is missing its layout data — the part carrying its position in the app and its show condition. This comes from Qlik Sense rather than Butler Sheet Icons, and is uncommon. It has been seen with sheets that are partially created or partially deleted, and with sheets whose owner no longer exists. Such a sheet is now named in the log as it is processed, so you can still find it in Qlik Sense to repair or delete it.

**One consequence to be aware of:** sheet numbers come from this sort order, so in an app containing such a sheet the numbering can differ from before — see [Sheet exclusion](/guide/concepts/sheet-exclusion) and [Sheet blurring](/guide/concepts/sheet-blurring).

**Not covered by this fix:** a sheet missing its **title and description** — a different part of the sheet record — can still interrupt a run. That case is less common and is being addressed separately.

### The run failed — has anything changed in Qlik Sense?

An app is saved once, after all of its sheets have been dealt with. If the run fails before that save, **nothing about the app changes** and its sheets keep the icons they had. Re-running is a clean retry, not a resume. See [How it works](/guide/concepts/how-it-works#what-happens-at-each-step).

## Authentication Issues

### QS Cloud Authentication Problems {#qs-cloud-authentication-problems}

**Symptoms:**

- Login failures
- "Invalid credentials" errors
- Stuck on login page

::: tip Not every tenant problem is a credentials problem
`Qlik Sense Cloud returned an unusable response` means the request **succeeded** and returned something that was not a list — typically a proxy or gateway answering instead of your tenant. A rejected API key produces an HTTP error code instead. See [that message](#cloud-unusable-response).
:::

**Solutions:**

1. **Verify Credentials**:

   ```bash
   # Test credentials manually by logging in through web browser
   # Ensure no special characters need escaping
   ```

2. **Check API Key**:

   ```bash
   # Verify API key hasn't expired
   # Test API key with a simple curl request
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        "https://your-tenant.qlikcloud.com/api/v1/users/me"
   ```

3. **MFA/SSO Issues**:

   ```bash
   # Try --skip-login for SSO environments
   --skip-login

   # For MFA, ensure you're using app passwords where available
   ```

### QSEoW Authentication Problems

**Symptoms:**

- Certificate errors
- "Access denied" messages
- Connection timeouts
- `net::ERR_INVALID_AUTH_CREDENTIALS` — see [The run fails on Windows but works from macOS](#windows-invalid-auth-credentials)

**Solutions:**

1. **Certificate Issues**:

   ```bash
   # Verify certificate files exist and have correct permissions
   ls -la cert/

   # Re-export certificates from QMC if needed
   # Ensure certificates haven't expired
   ```

2. **User Directory Issues**:

   ```bash
   # Verify user directory names are correct
   --apiuserdir "Internal"    # Note the quotes for spaces
   --logonuserdir "DOMAIN"    # Match exactly as shown in QMC
   ```

3. **Virtual Proxy Configuration**:

   Butler Sheet Icons signs in through the Qlik Sense login page, so it needs a virtual proxy that
   serves that page to every visitor. `--prefix` names which proxy to use:

   ```bash
   --prefix form
   ```

   **The prefix is not the fix on its own** — what matters is the proxy's **Windows authentication
   pattern**. See [The run fails on Windows but works from macOS](#windows-invalid-auth-credentials),
   which is where this shows up in practice.

### The run fails on Windows but works from macOS {#windows-invalid-auth-credentials}

A run that works from macOS or Linux can fail from Windows with an authentication error, using the same
command, the same credentials and the same Qlik Sense server. The cause is a Qlik Sense virtual proxy
setting — not Butler Sheet Icons, the network, or the credentials.

**Symptoms:**

```
error: QSEOW: qseowProcessApp: net::ERR_INVALID_AUTH_CREDENTIALS at https://sense.example.com/sense/app/ded8d27d-…
error: QSEOW PROCESS APP: Failed to process app ded8d27d-…: net::ERR_INVALID_AUTH_CREDENTIALS at https://sense.example.com/sense/app/ded8d27d-…
error: Failed to process 1 of 1 app(s)
```

The part to search for is `ERR_INVALID_AUTH_CREDENTIALS`.

Everything before this point succeeds, which is what makes it confusing. The log will already have shown
that Butler Sheet Icons connected, opened the app, read its name and counted its sheets:

```
info: Created session to server sense.example.com, engine version is 12.2759.8
info: Opened app ded8d27d-…
info: App name: "Employee salaries"
info: Number of sheets in app: 1
info: Browser setup complete. Launching browser...
```

Those steps use the certificates from `--certfile` and `--certkeyfile`, and they are working. It is only
the **browser** that cannot get in.

::: tip Older versions print more
The output above is from BSI 5.0.0 onwards. Up to and including 4.1.0 the first line reads
`QSEOW: qseowProcessApp (stack): Error: net::ERR_INVALID_AUTH_CREDENTIALS …` and is followed by a long
stack trace. Same failure, reported more noisily — the stack moved to `--loglevel debug`.
:::

**Why it happens on Windows and not on macOS:**

Butler Sheet Icons signs in the way a person does: it opens a browser, waits for the login page, and types
the user name and password from `--logonuserdir`, `--logonuserid` and `--logonpwd`.

A virtual proxy does not always serve that login page. Each one has a setting called **Windows
authentication pattern**, which Qlik Sense matches against the **User-Agent** the browser sends — the text
in which a browser states what it is and which operating system it runs on. The default value is the word
`Windows`.

```mermaid
flowchart TD
    Start([Browser requests a sheet]) --> UA{"User-Agent matches the proxy's<br/>Windows authentication pattern?"}
    UA -->|"No — macOS, Linux"| Forms["/internal_forms_authentication/<br/>the login page"]
    UA -->|"Yes — Windows"| NTLM["/internal_windows_authentication<br/>NTLM"]
    Forms --> OK([BSI types the credentials and works])
    NTLM --> Fail([ERR_INVALID_AUTH_CREDENTIALS])
```

A browser running on Windows announces itself with a User-Agent containing `Windows NT`. That matches the
default pattern, so Qlik Sense decides this visitor should use Windows authentication and sends the
browser to NTLM instead of the login page:

| Butler Sheet Icons runs on | User-Agent contains       | Qlik Sense sends the browser to               |
| -------------------------- | ------------------------- | --------------------------------------------- |
| macOS                      | `Macintosh; Intel Mac OS X` | `/internal_forms_authentication/` — login page |
| Linux                      | `X11; Linux x86_64`         | `/internal_forms_authentication/` — login page |
| Windows                    | `Windows NT 10.0; Win64; x64` | `/internal_windows_authentication` — NTLM    |

Butler Sheet Icons cannot complete an NTLM login. The browser it runs has no window and no way to ask
anyone for credentials, so Windows quietly offers whatever account the machine is signed in as. On a
machine that is not domain-joined — or is signed in as the wrong user — Qlik Sense rejects that account,
the browser has nothing else to offer, and it gives up.

**Solutions:**

Run Butler Sheet Icons against a virtual proxy whose **Windows authentication pattern** cannot match a
browser. The convention is to set it to `Form`, because no browser's User-Agent contains that word, so
every visitor is given the login page.

::: warning Use a separate virtual proxy — do not change your existing one
Changing the pattern on the virtual proxy your users log in through will **turn off Windows single sign-on
for all of them**. They will get a login page instead of being signed in automatically.

Create a virtual proxy for Butler Sheet Icons instead, and leave the one your users rely on alone.
:::

In the QMC:

1. Go to **Virtual proxies** and create a new one, or select an existing one used only for this purpose.
2. Under **IDENTIFICATION**, give it a **Prefix**. Any valid prefix will do — the name has no meaning to
   Butler Sheet Icons. The examples here use `form`.
3. Under **AUTHENTICATION**, set **Windows authentication pattern** to `Form`.
   <!-- A QMC screenshot of this field would help here; it is easy to miss among the other
        AUTHENTICATION settings. -->
4. Leave **Authentication method** as `Ticket`. This is **not** the setting that needs changing — a proxy
   that already says `Ticket` can still send Windows users to NTLM, because the pattern is what decides.
5. Link the virtual proxy to your proxy service, and apply the changes.

Then tell Butler Sheet Icons to use it:

```
--prefix form
```

or as an environment variable:

```
BSI_QSEOW_CST_PREFIX=form
```

::: warning The prefix is not the fix
`--prefix form` on its own changes nothing. A virtual proxy called `form` whose **Windows authentication
pattern** is still `Windows` fails in exactly the same way. The pattern is what matters; the prefix just
tells Butler Sheet Icons which proxy to use.
:::

::: tip Slashes around the prefix are ignored — BSI 5.0.0 or later
Write it as `form`, `/form` or `/form/` — all three name the same virtual proxy and all three work.

Up to and including 4.1.0 they did not. A prefix written with the leading slash it has in the browser
address bar produced a doubled separator in the URL (`https://sense.example.com//form/sense/app/…`),
which logged in perfectly well and then failed about ninety seconds later with
`Waiting for selector '#qv-page-container' failed` — an error naming a page element rather than the
prefix that caused it. On 4.1.0 or earlier, write the prefix without slashes.
:::

**Checking a virtual proxy without running Butler Sheet Icons:**

You can ask the server directly which login it would offer. The important part is to send a Windows
User-Agent — otherwise the tool you test with gets the login page regardless, and the test tells you
nothing.

Replace the host, the prefix and the app ID with your own. Omit the `/form` part to test the default
virtual proxy.

::: code-group

```powershell [PowerShell]
curl.exe -sk -o NUL -D - -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" `
  "https://sense.example.com/form/sense/app/ded8d27d-…"
```

```bash [Bash]
curl -sk -o /dev/null -D - -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  "https://sense.example.com/form/sense/app/ded8d27d-…"
```

:::

Read the `Location:` line in the reply:

| `Location` contains               | Meaning                                                              |
| --------------------------------- | -------------------------------------------------------------------- |
| `internal_forms_authentication`   | The login page. Butler Sheet Icons will work through this proxy.     |
| `internal_windows_authentication` | NTLM. Butler Sheet Icons will fail with `ERR_INVALID_AUTH_CREDENTIALS`. |

On Windows use `curl.exe` rather than `curl` — in PowerShell, `curl` is an alias for something else and
does not accept these options.

**What this means in general:**

Butler Sheet Icons always expects the Qlik Sense login page. It cannot use Windows authentication at all —
not from a domain-joined machine, and not with a correct domain account. A virtual proxy that serves the
login page to every visitor is therefore a requirement on every platform. It only becomes visible on
Windows, because that is the only platform where the default pattern matches.

## Configuration Issues

### Wrong QSEoW Version

**Symptoms:**

- Login works but navigation fails
- Sheets don't load properly
- JavaScript errors in debug mode

**Solutions:**

```bash
# Check your QSEoW version in QMC → About
# Then set the matching value
--sense-version 2025-Nov
```

The accepted values are listed in the [`--sense-version` row of the QSEoW reference](/reference/qseow#options), which is generated from the command definitions and therefore always current. A wrong value is rejected at startup rather than causing a confusing failure later.

### Content Library Issues (QSEoW)

**Symptoms:**

- "Content library not found" errors
- Upload failures
- Permission denied errors

**Solutions:**

1. **Create Content Library**:

   ```bash
   # Library must exist before running BSI
   # Create in QMC → Content Libraries
   # Default name: "Butler sheet thumbnails"
   ```

2. **Check Permissions**:

   ```bash
   # Ensure API user has write access to content library
   # Verify library path is accessible
   ```

3. **Use Custom Library**:
   ```bash
   --contentlibrary "My Custom Library"
   ```

### App Access Issues {#app-access-issues}

**Symptoms:**

- "App not found" errors
- "Access denied" for specific apps
- Empty app lists

**Solutions:**

1. **Verify App IDs**:

   ```bash
   # Double-check app ID format (GUID)
   # Ensure app exists and is accessible
   ```

2. **Check Permissions**:

   ```bash
   # QS Cloud: Verify user has access to app
   # QSEoW: Check app security rules
   ```

3. **Publication Status** (QS Cloud):
   ```bash
   # For published apps, exclude published/public sheets
   --exclude-sheet-status published public
   ```

### QS Cloud Access Denied Example

When trying to update public or published sheets in a published QS Cloud app, you'll see an error like this:

![QS Cloud Access Denied](/images/qscloud-access-denied.png "Access denied error when updating protected sheets in QS Cloud")

**Solution**: Use the `--exclude-sheet-status public published` option for published apps.

## Browser Issues

Browser-related problems are among the most common issues when using Butler Sheet Icons. This section covers comprehensive troubleshooting for browser management and operation.

### Browser Installation Problems

**Symptoms:**

- "Browser not found" errors
- Download failures during installation
- Installation timeouts
- 404 errors when downloading browsers

**Solutions:**

1. **Check Internet Connectivity**:

   ```bash
   # Test basic connectivity
   ping google.com

   # Test HTTPS connectivity
   curl -I https://edgedl.me.gvt1.com
   ```

2. **Manual Browser Installation**:

   ```bash
   # List what browsers are available for download
   butler-sheet-icons browser list-available --browser chrome

   # Install browser manually
   butler-sheet-icons browser install --browser chrome

   # Try a different browser version if one fails
   butler-sheet-icons browser install --browser chrome --browser-version 120.0.6099.109
   ```

3. **Proxy Configuration Issues**:

   ```bash
   # For corporate networks, set proxy environment variables
   # Windows (PowerShell):
   $env:http_proxy='http://username:password@proxy.company.com:8080'
   $env:https_proxy='http://username:password@proxy.company.com:8080'

   # macOS/Linux:
   export http_proxy='http://username:password@proxy.company.com:8080'
   export https_proxy='http://username:password@proxy.company.com:8080'
   ```

4. **Disk Space Issues**:

   ```bash
   # Check available disk space (browsers are 100-200MB each)
   # Windows:
   dir C:\Users\%USERNAME%\.cache\puppeteer

   # macOS/Linux:
   du -sh ~/.cache/puppeteer
   df -h ~/.cache

   # Clean up old installations if needed
   butler-sheet-icons browser uninstall-all
   ```

5. **Chrome Version Availability**:

   ```bash
   # Some older Chrome versions are no longer available
   # Check what's available:
   butler-sheet-icons browser list-available --browser chrome --channel stable

   # Try a newer version if installation fails
   butler-sheet-icons browser install --browser chrome --browser-version latest
   ```

### Browser Commands Fail on a Machine Without Internet Access

**Symptoms:**

- `browser list-available` reports that `versionhistory.googleapis.com` could not be reached
- `browser install` reports that the requested version "cannot be downloaded"
- On BSI versions before 4.0.0, `browser list-available` instead printed a raw stack trace such as `TypeError: Cannot read properties of undefined (reading 'status')`, with line numbers from inside the BSI binary

**Cause:**

Some of the `browser` commands need internet access, and the rest do not:

| Command                               | Needs internet?                          |
| ------------------------------------- | ---------------------------------------- |
| `browser list-installed`              | No                                       |
| `browser uninstall` / `uninstall-all` | No                                       |
| `browser list-available`              | Yes, for Chrome                          |
| `browser install`                     | Only if it has to download or look up a version |

On an air-gapped server, or one behind a proxy that blocks outbound HTTPS, the commands that need internet access will fail. This is expected behaviour, not a fault in BSI.

::: warning `browser install` used to fail here even when the browser was present
Before 5.0.0, `browser install` checked that the build could be **downloaded** before it looked at what was already on the machine — so on an offline server it reported that a browser sitting right there on disk `cannot be downloaded`, and pointed at `browser list-available`, which needs internet access too.

From 5.0.0 the cache is checked first, so confirming a staged browser works on the air-gapped machine itself. Two conditions have to hold: the build must already be staged for this machine, and `--browser-version` must be one that needs no lookup — `recommended` (the default) or an exact full build id. See [Installing a browser that is already there](/reference/browser#install-already-present).
:::

**Solutions:**

1. **See what is already available locally** — this works offline:

   ```bash
   butler-sheet-icons browser list-installed
   ```

2. **Prepare the machine while it still has connectivity**:

   ```bash
   # Run once on a connected machine; the browser is cached and reused afterwards.
   # Leave --browser-version at its default: "recommended" is a fixed build that
   # needs no lookup, so later runs work offline. "latest" resolves to whatever is
   # newest that day, which is not what the offline machine will ask for.
   butler-sheet-icons browser install --browser chrome
   ```

   From 5.0.0 you can re-run the same command on the offline machine to confirm the browser is really there — it checks the cache before the network, and reports `is already installed at ...` without downloading anything.

3. **Or point BSI at a browser installed by other means** — no download and no internet access needed:

   ::: code-group

   ```powershell [PowerShell]
   $env:PUPPETEER_EXECUTABLE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
   ```

   ```bash [Bash]
   export PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
   ```

   :::

4. **If a proxy is in the way**, and the service is reachable but answers with an error, BSI reports the HTTP status instead (for example `403`). That points at proxy rules rather than missing connectivity — see [Proxy Configuration](/guide/advanced/proxy).

Creating thumbnails itself does not need internet access once a browser is available locally. For the full picture, see [Which browser commands need internet access?](/guide/concepts/browser-detection-and-environment-variables#which-browser-commands-need-internet-access).

If you staged a browser on the machine and BSI still tries to download one, it has rejected what you copied — see [A cached browser was rejected](#a-cached-browser-was-rejected) for the message it printed and what each one means.

### The run hangs after "Launching browser..." {#the-run-hangs-after-launching-browser}

**Symptoms:**

- The last line in the log is `Browser setup complete. Launching browser...`, then nothing at all for minutes
- A scheduled run appears to have frozen, but eventually completes normally
- It happened once and would not reproduce the next day
- Several servers were affected on the same night

Starting the browser normally takes a second or two. When it takes minutes instead, the run is not damaged — the thumbnails are created normally once the browser finally starts. It is the waiting that is the problem.

::: warning Requires BSI 5.0.0 or later
From 5.0.0 the silence is followed by an explanation. Earlier versions gave no indication of what happened, which is what made this so hard to diagnose:

```
warning: QSEOW: Browser launch took 1500s, longer than the 30s launch timeout allows for.
         The extra time went into starting the browser process, which no timeout covers.
warning: QSEOW: On Windows this is typically antivirus or endpoint protection scanning a
         browser executable it has not seen before. Excluding the Butler Sheet Icons browser
         cache directory from real-time scanning avoids it.
```

Each is a single line in the log; they are wrapped here to fit. The prefix names the stage the run was in and differs between commands.
:::

**What is actually happening:**

Butler Sheet Icons asks the operating system to start the browser, and the operating system does not come back. This is not the browser being slow — it is the request to start it being held.

On Windows the usual reason is security software inspecting the browser program before it is allowed to run. Butler Sheet Icons downloads its own copy of Chrome, so the first run after a browser download presents the scanner with a program it has never seen before. Some products send such a file away to be analysed and hold it until an answer comes back. If that lookup is slow — or the machine's route to the vendor's service is blocked — the wait can be extremely long.

Two things follow, and both are recognisable:

- **It typically strikes once, then disappears.** Once the file has been examined and accepted, later runs start normally. A failure that will not reproduce the next morning is characteristic of this, and does not mean it was imagined.
- **It can affect several machines at once**, if they share a security policy and all download the same new browser version around the same time.

**Solutions:**

1. **Exclude the browser cache directory from real-time scanning.** This is the directory Butler Sheet Icons downloads its browsers into, and where that is depends on how you run it:

   | How you run it | Directory to exclude |
   | --- | --- |
   | Standalone build | `browser-cache`, next to `butler-sheet-icons.exe` |
   | From Node.js | `.cache\puppeteer` in the home directory of the account running BSI |
   | A directory you chose | Whatever `--browser-cache-dir` or `BSI_BROWSER_CACHE_DIR` names |

   Check the log if you are not sure — Butler Sheet Icons names the directory it used whenever it is not the last of these. See [Browser Cache Directory](/guide/advanced/browser-cache-directory).

   Your security team will normally be the ones to make this change. It is a routine exclusion: the directory holds only browsers that Butler Sheet Icons downloaded itself from Google's official distribution point.

2. **If an exclusion is not possible**, take the first-sight scan out of the scheduled run. After upgrading Butler Sheet Icons or changing the browser version, start a run by hand once and let it complete. The scan then happens while somebody is watching, rather than in the middle of the night.

**If the browser never starts at all:**

Where the wait ends in failure rather than success, the log says so directly:

```
error: QSEOW: The browser did not become ready within 30s. It was started but never reported
       a debugging endpoint - usually a browser build that cannot run on this machine, or
       security software holding it at startup.
```

Same family of problem, but the browser failed rather than merely being slow. If the exclusion above does not resolve it, the browser build in use may be one that cannot run on this machine — try the build Butler Sheet Icons is tested with:

```bash
--browser-version recommended
```

See [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build).

### Browser Runtime Crashes

**Symptoms:**

- Sudden browser termination during execution
- "Browser disconnected" errors
- Memory-related errors
- Browser hangs or becomes unresponsive

**Solutions:**

1. **Memory Management**:

   ```bash
   # Use headless mode to reduce memory usage (default)
   --headless true

   # Increase page wait time to reduce load
   --pagewait 10

   # Process fewer apps at once
   # Split large collections into smaller batches
   ```

2. **Browser Selection and Versions**:

   ```bash
   # Thumbnails are rendered with Chrome only
   --browser chrome

   # Use specific stable browser version
   butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
   --browser chrome --browser-version 121.0.6167.85

   # List installed browsers to verify
   butler-sheet-icons browser list-installed
   ```

3. **System Resource Monitoring**:

   ```bash
   # Monitor system resources during execution
   # Windows: Task Manager
   # macOS: Activity Monitor
   # Linux: htop or top

   # Ensure sufficient RAM (2GB+ recommended)
   # Ensure sufficient CPU availability
   ```

4. **Clean Browser Cache**:
   ```bash
   # Remove and reinstall browsers
   butler-sheet-icons browser uninstall-all
   butler-sheet-icons browser install --browser chrome
   butler-sheet-icons browser list-installed
   ```

### Browser Login and Navigation Issues

**Symptoms:**

- Browser opens but doesn't navigate properly
- Login page loads but credentials aren't entered
- Stuck on intermediate pages
- JavaScript errors in browser console

::: tip On QSEoW, check the virtual proxy first
If the login page never appears at all — rather than appearing and being ignored — the virtual proxy may
be serving Windows authentication instead. That fails with `net::ERR_INVALID_AUTH_CREDENTIALS`, and only
when Butler Sheet Icons runs on Windows. See
[The run fails on Windows but works from macOS](#windows-invalid-auth-credentials).
:::

**Solutions:**

1. **Use Non-Headless Mode for Debugging**:

   ```bash
   # See what's actually happening in the browser
   butler-sheet-icons qscloud create-sheet-icons \
     --headless false \
     --loglevel debug \
     --tenanturl mytenant.eu.qlikcloud.com \
     --apikey $API_KEY \
     --logonuserid user@company.com \
     --logonpwd password \
     --appid 12345678-1234-1234-1234-123456789012
   ```

2. **Page Wait Time Adjustment**:

   ```bash
   # Increase wait time for slow-loading pages
   --pagewait 15

   # Some networks or servers may be slower
   # Increase gradually until pages load completely
   ```

3. **Browser Compatibility Testing**:

   ```bash
   # Watch the run in a visible browser
   butler-sheet-icons qscloud create-sheet-icons --browser chrome --headless false ...
   ```

4. **SSO and Login Page Issues**:

   ```bash
   # For QS Cloud with SSO, try skipping login page
   --skip-login

   # This bypasses the standard login page
   # Use only if your organization has SSO that auto-redirects
   ```

### Browser Version Compatibility

**Symptoms:**

- Login works but app navigation fails
- JavaScript errors in verbose logging
- Features don't work as expected
- Screenshots are blank or corrupted

**Solutions:**

1. **Use Recommended Browser Versions**:

   ```bash
   # Check what versions have been tested
   butler-sheet-icons browser list-available --browser chrome --channel stable

   # Install a well-tested version
   butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
   ```

2. **Test Multiple Browser Versions**:

   ```bash
   # Install multiple versions for testing
   butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
   butler-sheet-icons browser install --browser chrome --browser-version 120.0.6099.109

   # Test each version
   butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 121.0.6167.85 ...
   butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 120.0.6099.109 ...
   ```

3. **Try a different Chrome build**:
   ```bash
   # If one Chrome build has issues, install and use another
   butler-sheet-icons browser install --browser chrome --browser-version 120.0.6099.109
   butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 120.0.6099.109 ...
   ```

   Another browser is not an alternative here — Chrome is the only browser Butler Sheet Icons can use. See [Supported Browsers](/guide/concepts/browser-management#supported-browsers).

### Browser Cache and Permissions

**Symptoms:**

- "Permission denied" errors
- Cannot write to browser cache directory
- Browser installation appears to succeed but browser not found

**Solutions:**

1. **Check Cache Directory Permissions**:

   ```bash
   # Windows: Check folder permissions in File Explorer
   # Right-click on C:\Users\%USERNAME%\.cache → Properties → Security

   # macOS/Linux: Check directory permissions
   ls -la ~/.cache/
   ls -la ~/.cache/puppeteer/

   # Ensure user has read/write access
   chmod 755 ~/.cache/puppeteer/
   ```

2. **Manual Cache Directory Creation**:

   ```bash
   # Create cache directory if it doesn't exist
   # Windows:
   mkdir %USERPROFILE%\.cache\puppeteer

   # macOS/Linux:
   mkdir -p ~/.cache/puppeteer
   ```

3. **Alternative Cache Location**:

   Put the browser cache somewhere the account running Butler Sheet Icons can write to:

   ::: code-group

   ```powershell [PowerShell]
   $env:BSI_BROWSER_CACHE_DIR = 'D:\qlik\butler-sheet-icons\browsers'
   ```

   ```bash [Bash]
   export BSI_BROWSER_CACHE_DIR='/opt/butler-sheet-icons/browsers'
   ```

   :::

   ::: warning Requires BSI 5.0.0 or later
   `BSI_BROWSER_CACHE_DIR` and `--browser-cache-dir` were added in 5.0.0. In earlier versions the cache location was fixed, and `PUPPETEER_CACHE_DIR` was ignored.
   :::

   This is also the fix when a scheduled task cannot find the browser you installed by hand — the two accounts have different home directories. See [Browser Cache Directory](/guide/advanced/browser-cache-directory).

### A cached browser was rejected {#a-cached-browser-was-rejected}

::: warning Requires BSI 5.0.0 or later
These messages were added in 5.0.0. In earlier versions the same situations produced no message at all: the browser was accepted, the log said which browser was being used, and the run failed later with an error that named none of this.
:::

**Symptoms:**

- You staged a browser on the machine, but BSI tries to download one anyway
- The run fails on a server with no internet access, after a warning about the browser cache
- `browser list-installed` shows a build, but BSI does not use it

**Cause:**

A cached browser has to pass four checks before BSI will use it — the right browser, built for this operating system, with the browser program actually present, and matching the build that `--browser-version` resolved to. See [Cached browser](/guide/concepts/browser-detection-and-environment-variables#_2-cached-browser-medium-priority).

When no cached browser passes, BSI reports the check that stopped it. The three messages below are the ones you will see.

#### The cache came from a different operating system

```
Found 1 cached chrome build(s), but none built for this machine (platform "win64").
Cached chrome builds are for: mac_arm. A browser cache copied from a machine with a
different operating system cannot be used.
Browser cache directory: C:\butler-sheet-icons\browser-cache
```

This is the most common mistake when staging a browser for a server with no internet access, because the connected machine is usually an administrator's Mac or Windows laptop while the target is a Windows Server running Qlik Sense.

**A browser cache only works on the operating system it was downloaded for.** A cache prepared on macOS cannot be used on Windows, and neither can be used on Linux.

The message names both sides: the platform this machine needs, and the platforms the cached builds were built for. The names are the ones the browser download service uses:

| Name        | Operating system         |
| ----------- | ------------------------ |
| `win64`     | 64-bit Windows           |
| `win32`     | 32-bit Windows           |
| `mac_arm`   | macOS on Apple Silicon   |
| `mac`       | macOS on Intel           |
| `linux`     | 64-bit Linux             |
| `linux_arm` | Linux on ARM             |

Two combinations are **not** a mismatch, because the machine can run the build even though the names differ. BSI accepts both without a warning:

- A **32-bit Windows** (`win32`) build on **64-bit Windows** (`win64`)
- An **Intel macOS** (`mac`) build on **Apple Silicon** (`mac_arm`), which runs through Rosetta. This assumes Rosetta is installed, as it normally is; if it is not, the browser will fail to start.

Everything else must match. In particular, no Windows build runs on Linux or macOS, and no 64-bit build runs on a 32-bit or ARM host.

**Solution:** download the browser again on a machine running the same operating system as the target, and copy that cache across instead. On a machine with internet access, simply let BSI download a browser itself.

#### The cache is incomplete

```
Found 1 cached chrome build(s) for this machine, but none has a usable executable. The
cache directory may be incomplete - for example copied without the browser binary, or
left behind by a failed install.
Browser cache directory: C:\butler-sheet-icons\browser-cache
```

The cache folder is there and looks right, but the browser program inside it is missing. This usually means the copy did not include everything, or that an earlier download was interrupted.

**Solution:** delete the incomplete folder and copy or download the browser again.

If you are copying from another machine, **make sure your archiving tool includes hidden files** — several skip them by default, and one of the files BSI needs is hidden.

To check a copy, list the installed browsers and then confirm the browser program is really present in the folder shown:

```bash
butler-sheet-icons browser list-installed
```

That command prints the installation folder for each cached build. Note that it lists a build whether or not the browser program inside it survived the copy, so seeing the build listed is **not** by itself proof that the copy is complete — open the folder and confirm the browser program is there.

#### The requested browser version is not the one you have

```
No cached chrome build matches --browser-version "recommended" (build 138.0.7204.94).
Cached chrome builds that this machine can run: 131.0.6778.204. Set --browser-version to
one of those build ids to use it instead.
Butler Sheet Icons will now try to download chrome 138.0.7204.94, which needs internet
access. On a machine without internet access this will fail.
```

The build BSI was asked for is not the one in the cache. On a machine with internet access this is only a warning: the requested build is downloaded and the run continues. On a machine without internet access the download cannot succeed, so the run fails.

The message names the version **as you set it**, with the exact build it resolved to in brackets. You will see a bracketed build even if you never set `--browser-version` at all: the default, `recommended`, is a name for one specific build that BSI ships with, and that build is what gets looked for in the cache.

**Solution:** set `--browser-version` to one of the build ids the message lists, which uses the browser you already have:

```bash
butler-sheet-icons browser list-installed
```

The alternative is to stage the exact build it asked for.

::: tip Version keywords are not wildcards
`recommended`, `stable` and `latest` each resolve to **one specific build** before the cache is searched. Switching from one keyword to another will not make BSI accept a build it already rejected — it will simply look for a different specific build. Only an exact build id from the list in the message is guaranteed to match what you have. See [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build).
:::

#### What has not changed

- A healthy cache behaves exactly as before, with no new messages. A single unusable folder sitting beside a working browser is ignored quietly.
- A browser named with `--browser-executable-path` / `BSI_BROWSER_EXECUTABLE_PATH`, or with `PUPPETEER_EXECUTABLE_PATH`, is used as-is and is not subject to these checks.
- Where the browser cache lives, and how to change it with `--browser-cache-dir` or `BSI_BROWSER_CACHE_DIR`, is unchanged — see [Browser Cache Directory](/guide/advanced/browser-cache-directory).

### Platform-Specific Browser Issues

#### Windows Issues

**Symptoms:**

- Windows Defender blocks browser download
- Antivirus software quarantines browser files
- Permission errors on system directories
- A run that sits for minutes after `Launching browser...`

**Solutions:**

```bash
# Temporarily disable real-time protection during installation
# Or add BSI cache directory to exclusions in Windows Defender

# Run PowerShell as Administrator if needed for first installation
# Check if corporate policies block browser downloads
```

Excluding the browser cache directory from real-time scanning is the durable fix, and it also resolves a run that appears to hang at start-up — see [The run hangs after "Launching browser..."](#the-run-hangs-after-launching-browser). Which directory to exclude depends on how you run Butler Sheet Icons; see [Browser Cache Directory](/guide/advanced/browser-cache-directory).

#### macOS Issues

**Symptoms:**

- "App is damaged" security warnings
- Gatekeeper blocks browser execution
- Permission denied in user cache directory

**Solutions:**

```bash
# Allow app in System Preferences → Security & Privacy
# BSI binaries are notarized, but browsers might trigger warnings

# Check cache directory permissions
sudo chown -R $USER ~/.cache/

# If needed, allow browser in Privacy settings
```

#### Linux Issues

**Symptoms:**

- Missing system dependencies for browser operation
- Library compatibility issues
- Display issues in headless mode

**Solutions:**

```bash
# Install required dependencies (Ubuntu/Debian):
sudo apt-get update
sudo apt-get install -y wget gnupg ca-certificates

# For Chrome dependencies:
sudo apt-get install -y libxss1 libappindicator1 libindicator7

# Check DISPLAY variable if running remotely
echo $DISPLAY
```

### Browser Diagnostic Commands

Use these commands to diagnose browser-related issues:

```bash
# Check current browser installation status
butler-sheet-icons browser list-installed

# Verify what Chrome builds are available for download
butler-sheet-icons browser list-available

# Test browser installation
butler-sheet-icons browser install --loglevel debug

# Clean and reinstall
butler-sheet-icons browser uninstall-all
butler-sheet-icons browser install

# Test basic browser functionality with visible mode
butler-sheet-icons qscloud create-sheet-icons \
  --headless false \
  --loglevel verbose \
  --pagewait 10 \
  --browser chrome \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $API_KEY \
  --logonuserid user@company.com \
  --logonpwd password \
  --appid 12345678-1234-1234-1234-123456789012
```

### Advanced Browser Troubleshooting

For complex browser issues, try these advanced troubleshooting steps:

1. **Enable Verbose Browser Logging**:

   ```bash
   # Use silly log level to see all browser communication
   --loglevel silly

   # This will show all WebSocket traffic and browser events
   ```

2. **Test with Minimal Configuration**:

   ```bash
   # Strip down to minimal options to isolate the issue
   butler-sheet-icons qscloud create-sheet-icons \
     --tenanturl mytenant.eu.qlikcloud.com \
     --apikey $API_KEY \
     --logonuserid user@company.com \
     --logonpwd password \
     --appid 12345678-1234-1234-1234-123456789012 \
     --headless false \
     --loglevel debug
   ```

3. **Browser Process Monitoring**:

   ```bash
   # Monitor browser processes during execution
   # Windows: tasklist | findstr chrome
   # macOS/Linux: ps aux | grep chrome

   # Check if browser processes are being terminated unexpectedly
   ```

For more information about browser management, see the [Browser Management Guide](/guide/concepts/browser-management) and [Browser Management Examples](/examples/browser-management).

## Network Issues

### Connection Timeouts

**Symptoms:**

- "Connection timeout" errors
- Slow response times
- Intermittent failures

**Solutions:**

1. **Increase Timeouts**:

   ```bash
   # Increase page wait time
   --pagewait 15

   # For slow networks, use longer waits
   ```

2. **Network Configuration**:

   ```bash
   # Check firewall rules for QSEoW ports
   # 4242 (QRS), 4747 (Engine), 443/80 (Web)

   # Test network connectivity
   telnet qlik-server.company.com 443
   ```

### The connection to Qlik Sense drops in the middle of a run {#engine-session-dropped-mid-run}

Butler Sheet Icons holds one connection to the Qlik Sense engine open for as long as it is working on an
app. If that connection is lost part-way through — the app has ten sheets and the connection dies at
sheet three — it cannot finish that app.

**Symptoms:**

```
warning: CLOUD PROCESS APP: The engine session to Qlik Sense Cloud tenant your-tenant.eu.qlikcloud.com
         was closed from the other end, code 1006. Whatever is still using this session will fail
         from here on.
error:   CLOUD APP: Lost the engine session while processing app 5838acc6-… at sheet 3, abandoning
         the remaining sheets: Not connected (websocket closed with code 1006)
```

Each is a single line in the log; they are wrapped here to fit. The prefix names the stage the run was in
and differs between commands.

Three things are worth knowing about this output:

- **The `warning` appears when the connection drops, which can be well before anything fails.** Taking a
  screenshot of a sheet takes 25–40 seconds, and Butler Sheet Icons does not talk to the engine while it
  waits for the browser. The connection can therefore be gone for some time before the next request
  discovers it.
- **The number after `code` is why the connection ended**, as reported by the network layer. **If you
  report this problem, include that line** — it is the single most useful piece of information for
  diagnosing it.
- **Sheets after the failure point are not listed as failures.** They were never attempted.

**What happens to the app:**

- Sheets whose thumbnails were already produced **are** uploaded and applied.
- The remaining sheets **keep the icons they already had**. Nothing is blanked or replaced with a broken
  image.
- The app is reported as failed and the run exits non-zero, so a scheduled task shows it as failed.

Re-running Butler Sheet Icons for that app is safe, and is the right response.

**What the close code tells you:**

| Code | Meaning | What to do |
| ---- | ------- | ---------- |
| `1006` | The connection ended without a proper goodbye — typically a network device, firewall or proxy between Butler Sheet Icons and Qlik Sense dropping it | If it repeats, ask whoever manages that equipment whether long-lived WebSocket connections to Qlik Sense are being timed out for idleness |
| Anything else, usually with a `reason` | The Qlik Sense end closed the connection deliberately | Investigate the reason text; include it in a support request |

A run that loses its connection occasionally and succeeds on a re-run is a network hiccup, not a
misconfiguration.

::: tip This is already made less likely — BSI 5.0.0 or later
Butler Sheet Icons sends a small keep-alive signal on the Qlik Sense connection every 20 seconds while it
is otherwise idle.

The reason is the gap above: a socket carrying no traffic for 30-odd seconds looks abandoned, and network
equipment is free to drop it without telling either end. Keeping a little traffic on it makes that far
less likely. This needs no configuration, applies to both Qlik Sense Cloud and QSEoW, and is not something
you will see in the log. Connections to Qlik Sense Cloud benefit most, since they cross the public
internet rather than your own network.

It makes a drop **less likely**, not recoverable — nothing retries a session that has already gone.
:::

::: warning Do not shorten `--pagewait` to avoid this
Shortening the wait used to reduce the idle time per sheet, but the keep-alive above now covers those gaps
regardless of how long they are. Setting `--pagewait` below what your sheets need to finish rendering buys
nothing here and produces thumbnails of half-drawn charts.
:::

::: tip A message that is not this — on BSI 4.1.0 and earlier
Up to and including 4.1.0, a warning about the engine session being *"closed from the other end, code
1000"* appeared on **successful** runs too. Butler Sheet Icons was reporting its own tidy-up as though the
far end had hung up. Ignore it on those versions.

From 5.0.0 a message of this kind means what it says, and the code it quotes is worth including in a bug
report.
:::

### Proxy Configuration

**Symptoms:**

- Cannot reach internet for browser downloads
- Connection refused errors
- SSL/TLS errors

**Solutions:**

```bash
# Configure proxy settings
export http_proxy=http://username:password@proxy.company.com:8080
export https_proxy=https://username:password@proxy.company.com:8080

# For authentication-required proxies
export http_proxy=http://user:pass@proxy.company.com:8080
```

### Tag or content library name fails or matches nothing

**Symptoms:**

- A QSEoW run fails immediately with a `400` or `403` from Qlik Sense
- Or it completes normally but excludes nothing, even though the tags are set in the QMC

**Cause:**

Before BSI 4.0.0, names supplied to `--qliksensetag`, `--exclude-sheet-tag` and `--contentlibrary` were sent to the Qlik Sense Repository Service unprotected, so punctuation in a name was read as instructions rather than as part of the name. Each character failed in its own way:

| Character in the name | What you saw |
| --- | --- |
| `&` | `400::Missing parameter value(s)` |
| `'` | `400::Cannot parse the expression:` followed by the query |
| `#` | `403::XSRF prevention check failed. Possible XSRF discovered.` |
| `?` or `/` | `Request path contains unescaped characters` |
| `%` | `URI malformed` |

Names containing `+`, `=` or `,` were unaffected, as were names made only of letters, digits, spaces, hyphens and underscores.

Separately — and silently — giving **two or more** `--exclude-sheet-tag` values joined them into one name, so nothing matched and every sheet was updated. See [Sheet Exclusion](/guide/concepts/sheet-exclusion#exclusion-options).

**Solutions:**

1. **Upgrade to BSI 4.0.0 or later.** Names are now protected before being sent, and several exclude tags match any of them.
2. **Review apps where you used two or more exclude tags.** Sheets you meant to exclude have been getting new icons on every run. Re-run once exclusions work, or restore those icons by hand.
3. **Undo any renaming workaround.** If you renamed `R&D` to `RandD`, you can rename it back — update the matching option or environment variable at the same time.

## Browser Build Issues

### Every app fails with `Target closed` or `Protocol error` {#every-app-fails-with-target-closed-or-protocol-error}

**Symptoms:**

- Every app in the run fails, not just one
- Errors mention `TargetCloseError`, `Protocol error`, `Target closed` or `Session closed`
- The same job works on one server and fails on another with identical configuration

```
error: CLOUD APP (stack): TargetCloseError: Protocol error (Browser.getVersion): Target closed
error: Failed to process 2 of 2 app(s)
```

**Cause:**

The Chrome build being used cannot be driven by Butler Sheet Icons. Thumbnails are captured through a browser automation library, and that library is only tested against the Chrome builds current when it was released. Chrome's stable channel moves faster than the library does, so a build far enough ahead cannot be driven: Chrome launches normally, and the first instruction sent to it fails.

Nothing is wrong with Chrome, and nothing is wrong with your Qlik Sense environment.

Before BSI 4.0.0 the default was `latest`, meaning the newest *published* build, so this could strike anyone — two servers could behave differently purely because each had a different build cached. From 4.0.0 the default is `recommended` and that class of failure went away.

::: warning It can still happen if you deliberately track Chrome's stable channel
`recommended` cannot get ahead of what Butler Sheet Icons can drive. Anything that floats can:

| `--browser-version` (or `BSI_*_BROWSER_VERSION`) | Can drift ahead? |
| --- | --- |
| `recommended` — the default | No |
| `stable`, or its old alias `latest` | **Yes**, once Chrome's stable channel moves far enough ahead |
| A release channel: `beta`, `dev`, `canary` | **Yes** |
| An explicit recent build id, e.g. `151.0.7922.138` | **Yes** |

Because `stable` means "whatever Chrome publishes as stable today", this appears overnight on a machine whose configuration has not been touched for months. That is the nature of the setting, not a fault in your environment.

If you never set `--browser-version` and never set a `BSI_*_BROWSER_VERSION` variable, this does not apply to you.
:::

**Solutions:**

1. **Use the recommended build**, which is the default from BSI 4.0.0 onward. Either remove `--browser-version` entirely or set it explicitly:

   ```bash
   --browser-version recommended
   ```

   From 4.0.0, Butler Sheet Icons also detects this itself and says so directly, naming the build instead of leaving you with a protocol error:

   ```
   error: QSEOW: Browser build 151.0.7922.109 started but stopped responding immediately. This build cannot be driven by Butler Sheet Icons.
   error: Use a different browser build: "--browser-version recommended" selects the build Butler Sheet Icons is tested with. The same value can be set via the command's BSI_*_BROWSER_VERSION environment variable.
   ```

2. **Check for a `BSI_*_BROWSER_VERSION` environment variable** overriding your command line. A scheduled job or unit file may still set `latest`.

3. **Install the recommended build ahead of time** so it is not downloaded during a scheduled run:

   ```bash
   butler-sheet-icons browser install
   ```

4. **Upgrade Butler Sheet Icons**, if you have a reason to keep tracking `stable`. Each release ships a browser automation library that drives the Chrome builds current at the time, so upgrading is what restores `stable` — pinning `recommended` is what avoids needing to.

::: tip Should you go back to `stable` afterwards?
Only if you have a specific reason to track Chrome's stable channel. `stable` will drift ahead of the tested build again — that is what it is for — and the failure above is what that looks like when it goes too far. `recommended` is the setting that keeps working without attention, and it needs no internet lookup, which also makes it the right choice on air-gapped and tightly firewalled machines.
:::

See [Choosing a browser build](/guide/concepts/browser-management#choosing-a-browser-build) for what each keyword selects, and [what `recommended` currently points at](/guide/concepts/browser-management#what-recommended-points-at).

## Sheet-Specific Issues

### Sheets you did not select were skipped or blurred

**Symptoms:**

- Sheets you never listed in `--exclude-sheet-number` kept their old icons
- Sheets you never listed in `--blur-sheet-number` came out blurred
- The run reported success — there was no error or warning

**Cause:**

Butler Sheet Icons before 4.0.0 read these two options incorrectly, in two ways at once:

- Only the last number you listed was used. `--exclude-sheet-number 3 7` behaved as though you had written `--exclude-sheet-number 7`.
- That number was then matched as a text fragment rather than as a whole sheet number, so `--exclude-sheet-number 12` also excluded sheets 1 and 2.

The more digits in the number, the more sheets were wrongly affected. A single one-digit number was always handled correctly. No other sheet filter was affected — `--exclude-sheet-status`, `--exclude-sheet-tag`, `--exclude-sheet-title`, `--blur-sheet-status` and `--blur-sheet-title` always worked as documented.

**How to confirm from an old log:**

At the default log level (`info`) Butler Sheet Icons logs one line per sheet it skipped or blurred, so a log from an earlier run tells you which sheets were affected:

```
Excluded sheet: 1: 'Sales overview', ...
Using blurred thumbnail for sheet 1: ...
```

These lines say **that** a sheet was skipped or blurred, not **why** — status, tag and title filters produce the same lines. To see the reason, re-run with `--loglevel verbose`, which adds a line naming the filter that matched:

```
Excluded sheet (via sheet number): 1: 'Sales overview', ...
Blurred sheet thumbnail (via sheet number): 1: 'Sales overview', ...
```

**Solutions:**

1. **Upgrade to BSI 4.0.0 or later.** Both options now keep every number you list and match each as a whole sheet number.

2. **Re-check your options before re-running.** If you worked around the old behaviour — listing sheet numbers one run at a time, or picking numbers that avoided the overlap — those workarounds are no longer needed and will now produce the wrong result.

3. **Re-run thumbnail generation.** Nothing corrects itself: sheets that were wrongly excluded still have their old icons, and sheets that were wrongly blurred still have blurred ones, until Butler Sheet Icons runs again.

See [Listing several sheet numbers](/guide/concepts/sheet-exclusion#listing-several-sheet-numbers) for how the options behave now.

### Sheets Not Loading

**Symptoms:**

- Blank screenshots
- "Sheet not found" errors
- Screenshots of loading screens

**Solutions:**

1. **Increase Wait Time**:

   ```bash
   # Complex sheets need longer load times
   --pagewait 10    # or higher for very complex sheets
   ```

2. **Check Sheet Status**:
   ```bash
   # Verify sheet isn't hidden or deleted
   # Check sheet permissions
   ```

### Screenshot Quality Issues

**Symptoms:**

- Blurry or pixelated images
- Wrong dimensions
- Missing content

**Solutions:**

1. **Adjust Screenshot Area**:

   ```bash
   --includesheetpart 1    # Just sheet content
   --includesheetpart 2    # Include sheet title
   --includesheetpart 4    # Full page
   ```

2. **Browser Settings**:

   ```bash
   # Thumbnails are rendered with Chrome only
   --browser chrome

   # Ensure browser is up to date
   butler-sheet-icons browser install --browser chrome
   ```

## Docker Issues

### Permission denied writing thumbnails from the Docker image {#permission-denied-writing-thumbnails-from-the-docker-image}

**Symptoms:**

- Running the Docker image on a **Linux** host, every app in the run fails
- The log contains `EACCES`
- The same command works on a macOS or Windows laptop

```
error: EACCES: permission denied, mkdir './img/cloud/6ab8a5b7-1f0e-4e9c-8b53-9f42b6c1a0d2'
error: CLOUD PROCESS APP: Failed to process app 6ab8a5b7-1f0e-4e9c-8b53-9f42b6c1a0d2: Error creating cloud image directory
```

On QSEoW the wording differs slightly — `QSEOW CREATE THUMBNAILS 1` in place of `CLOUD PROCESS APP`, and `qseow` in place of `cloud` in the path — but `EACCES` appears either way. Search your logs for `EACCES`.

A QSEoW **certificate** failure has the same underlying cause. If you mounted a folder holding `client.pem` and `client_key.pem` and saw this even though the files were plainly there, this is why — certificate files are normally readable only by their owner:

```
error: QSEOW CREATE THUMBNAILS 2: Missing certificate file(s)
```

**Cause:**

Before BSI 4.0.0, the container ran as a built-in unprivileged account that did not own the folder you mounted. Docker Desktop on macOS and Windows ignores ownership on mounted folders, so this only ever showed up on Linux — which is where scheduled runs live.

**Solutions:**

1. **Upgrade to BSI 4.0.0 or later and re-run.** No change to your command is needed. The container adopts the mounted folder's owner and logs one line when it does:

   ```
   butler-sheet-icons: running as uid 1000:1000, adopted from /nodeapp/img, so files written there belong to you
   ```

2. **Do not mount a `root`-owned folder.** The container deliberately will not run as root. Mount one you own instead.

3. **If you pass `--user` explicitly**, that is respected as given — make sure the account you name can write to the folder.

4. **Check for a `:ro` mount.** A read-only mount cannot receive thumbnails.

See [Docker Usage](/guide/advanced/docker#writing-thumbnails-to-a-mounted-folder-on-linux) for the full explanation.

## Reading the Logs

### Log messages changed in BSI 4.0.0

Several log lines named the wrong operation, or were punctuated inconsistently between platforms. Nothing about how Butler Sheet Icons behaves changed — only what it writes. **This matters if you have log monitoring that matches on the old text.**

```diff
- Closed session after updating sheet thumbnail images in QS Cloud app …
+ Closed session after removing sheet icons in QS Cloud app …

- CLOUD PROCESS APP 2: Failed to process app …
+ CLOUD REMOVE SHEET ICONS: Failed to process app …
```

Neither "updating" nor "generating" describes removing an icon, and the `2` was a leftover that did not name the command actually running.

A failure to start the built-in browser used to be punctuated differently per platform — QS Cloud used a colon after the prefix, QSEoW did not. Both now use the colon:

```diff
- CLOUD APP Could not launch virtual browser: …
- QSEOW Could not launch virtual browser: …
+ CLOUD APP: Could not launch virtual browser: …
+ QSEOW: Could not launch virtual browser: …
```

**One line is new at the default log level.** Running `qscloud remove-sheet-icons`, this was written at `verbose` and so was hidden at the default `info`:

```diff
+ Created session to <server or tenant>, engine version is <version>
```

It is now written at `info`, matching every other command that works on an app you named. Expect one extra line per app; use `--loglevel warn` to suppress it along with the other progress messages. Commands that re-open an app already announced by the step above them still log at `verbose`, so no app is announced twice in one run.

## Platform-Specific Issues

### Windows Issues

**Common Problems:**

- Windows Defender blocking binary
- PowerShell execution policy
- Path length limitations

**Solutions:**

```powershell
# Allow binary in Windows Defender
# Add exclusion for butler-sheet-icons.exe

# Set PowerShell execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Use shorter paths
cd C:\BSI
```

### macOS Issues

**Common Problems:**

- Gatekeeper blocking unsigned binary
- Permission issues
- Notarization warnings

**Solutions:**

```bash
# Allow unsigned binary (if needed)
sudo spctl --master-disable

# Fix permissions
chmod +x butler-sheet-icons-macos

# Clear quarantine flag
xattr -d com.apple.quarantine butler-sheet-icons-macos
```

### Linux Issues

**Common Problems:**

- Missing dependencies
- Permission issues
- Display server issues in headless environments

**Solutions:**

```bash
# Install missing libraries
sudo apt-get update
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libgtk-3-0

# Fix permissions
chmod +x butler-sheet-icons-linux

# For headless servers
export DISPLAY=:99
```

## Performance Issues

### Slow Performance

**Symptoms:**

- Very long execution times
- Timeout errors
- High memory usage

**Solutions:**

1. **Optimize Settings**:

   ```bash
   # Reduce page wait time for simple sheets
   --pagewait 3

   # Use headless mode
   --headless true

   # Process fewer apps per run
   ```

2. **System Resources**:

   ```bash
   # Check system resources
   top
   free -h

   # Close other applications
   # Add more RAM if consistently hitting limits
   ```

## Getting Additional Help

### Enable Debug Logging

For detailed troubleshooting information:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --loglevel silly \
  --headless false \
  > debug.log 2>&1
```

### Capture Node Stack Traces

If you get errors or warnings while using the pre-built Butler Sheet Icons binaries, try re-running the command with Node trace flags to capture stack traces from the embedded runtime.  
Butler Sheet Icons automatically restarts itself with those flags when you append them directly (for example `--trace-warnings`), but setting `NODE_OPTIONS` makes it easy to reuse the same flags while you troubleshoot.

With these flags set the warning and error messages are likely more verbose and may reveal the root cause of the problem.

```bash
# macOS/Linux one-off command
NODE_OPTIONS="--trace-warnings --trace-deprecation --trace-uncaught" \
   butler-sheet-icons qscloud create-sheet-icons --loglevel debug ...
```

```powershell
# Windows PowerShell
$env:NODE_OPTIONS = "--trace-warnings --trace-deprecation --trace-uncaught"
butler-sheet-icons qscloud create-sheet-icons --loglevel debug ...
Remove-Item Env:NODE_OPTIONS
```

```cmd
REM Windows Command Prompt
set "NODE_OPTIONS=--trace-warnings --trace-deprecation --trace-uncaught"
butler-sheet-icons qscloud create-sheet-icons --loglevel debug ...
set NODE_OPTIONS=
```

These traces pair well with `--loglevel debug` or `--loglevel silly`, and clearing `NODE_OPTIONS` afterward prevents the flags from affecting unrelated Node processes.

### Gather System Information

When reporting issues, include:

1. **BSI Version**: `butler-sheet-icons --version`
2. **Operating System**: OS version and architecture
3. **Node.js Version** (if running from source): `node --version`
4. **Qlik Sense Version**: QSEoW version or QS Cloud
5. **Command Used**: Full command with options (redact credentials)
6. **Error Messages**: Complete error output
7. **Debug Logs**: With `--loglevel debug` enabled

### Community Support

- **GitHub Issues**: [Report bugs and issues](https://github.com/ptarmiganlabs/butler-sheet-icons/issues)
- **GitHub Discussions**: [Ask questions and share solutions](https://github.com/ptarmiganlabs/butler-sheet-icons/discussions)
- **Professional Support**: Contact [Ptarmigan Labs](https://ptarmiganlabs.com) for commercial support

### Contribution

If you find and fix an issue:

1. Fork the repository
2. Create a fix
3. Submit a pull request
4. Help improve the documentation

Most issues have been encountered before - check GitHub issues and discussions for similar problems and solutions.
