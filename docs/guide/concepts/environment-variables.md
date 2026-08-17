# Environment Variables

Environment variables can be used to supply any Butler Sheet Icons (BSI) command-line parameter. This helps keep secrets out of commands/scripts, enables reusable setups, and (significantly!) shortens long commands.

## Naming pattern

Each CLI parameter has a matching environment variable using this pattern:

`BSI_<COMMAND>_<SUBCOMMAND_ABBREVIATION>_<PARAMETER_NAME>`

Commands are:

- `QSEOW` — Qlik Sense Enterprise on Windows (client-managed)
- `QSCLOUD` — Qlik Sense Cloud
- `BROWSER` — Embedded browser management options

Subcommand abbreviations:

| Used for commands | Subcommand name         | Abbreviation |
| ----------------- | ----------------------- | ------------ |
| qseow, qscloud    | create-sheet-thumbnails | CST          |
| qscloud           | remove-sheet-icons      | RSI          |
| qscloud           | list-collections        | LC           |
| browser           | list-installed          | LI           |
| browser           | list-available          | LA           |
| browser           | install                 | I            |
| browser           | uninstall               | UI           |
| browser           | uninstall-all           | UIA          |

Finally, take the command-line parameter name, convert it to uppercase, and append it. Example: `--host` becomes `_HOST`, `--apiuserdir` becomes `_API_USER_DIR`.

Environment variables are also listed when running BSI with `--help` (scroll right to see the variable names):

```bash
Usage: butler-sheet-icons qscloud create-sheet-thumbnails|create-sheet-icons [options]

Create thumbnail images based on the layout of each sheet in Qlik Sense Cloud applications.
Multiple apps can be updated with a single command, using a Qlik Sense collection to identify which apps will be updated.

Options:
  --loglevel, --log-level <level>     Log level (choices: "error", "warn", "info", "verbose", "debug", "silly", default: "info", env: BSI_QSCLOUD_CST_LOG_LEVEL)
  --schemaversion <version>           Qlik Sense engine schema version (choices: "12.170.2", "12.612.0", "12.936.0", "12.1306.0", "12.1477.0", "12.1657.0", "12.1823.0", "12.2015.0", default: "12.612.0", env: BSI_QSCLOUD_CST_SCHEMAVERSION)
  --tenanturl <url>                   URL or host of Qlik Sense cloud tenant. Example: "https://tenant.eu.qlikcloud.com" or "tenant.eu.qlikcloud.com" (env: BSI_QSCLOUD_CST_TENANTURL)
  --apikey <key>                      API key used to access the Sense APIs (env: BSI_QSCLOUD_CST_APIKEY)
  --skip-login                        Skip QS login page, go directly to the tenant URL. Use this if you are automatically logged in to Qlik Sense (default: false, env: BSI_QSCLOUD_CST_SKIP_LOGIN)
  ...
  ...
```

## Examples

### QSEoW

::: code-group

```powershell [PowerShell]
# Set environment variables for QSEoW
$env:BSI_QSEOW_CST_HOST = 'qlikserver.example.com'
$env:BSI_QSEOW_CST_APP_ID = '12345678-1234-1234-1234-123456789012'
$env:BSI_QSEOW_CST_API_USER_DIR = 'INTERNAL'
$env:BSI_QSEOW_CST_API_USER_ID = 'sa_api'
$env:BSI_QSEOW_CST_LOGON_USER_DIR = 'INTERNAL'
$env:BSI_QSEOW_CST_LOGON_USER_ID = 'userID'
$env:BSI_QSEOW_CST_LOGON_PWD = 'password'
$env:BSI_QSEOW_CST_PREFIX = 'form'
$env:BSI_QSEOW_CST_CONTENT_LIBRARY = 'Butler sheet thumbnails'

# Minimal command once variables are set
butler-sheet-icons qseow create-sheet-thumbnails
```

```bash [Bash]
# Set environment variables for QSEoW
export BSI_QSEOW_CST_HOST='qlikserver.example.com'
export BSI_QSEOW_CST_APP_ID='12345678-1234-1234-1234-123456789012'
export BSI_QSEOW_CST_API_USER_DIR='INTERNAL'
export BSI_QSEOW_CST_API_USER_ID='sa_api'
export BSI_QSEOW_CST_LOGON_USER_DIR='INTERNAL'
export BSI_QSEOW_CST_LOGON_USER_ID='userID'
export BSI_QSEOW_CST_LOGON_PWD='password'
export BSI_QSEOW_CST_PREFIX='form'
export BSI_QSEOW_CST_CONTENT_LIBRARY='Butler sheet thumbnails'

# Minimal command once variables are set
butler-sheet-icons qseow create-sheet-thumbnails
```

:::

### QS Cloud

::: code-group

```powershell [PowerShell]
# Set environment variables for QS Cloud
$env:BSI_QSCLOUD_CST_TENANTURL = 'tenant.eu.qlikcloud.com'
$env:BSI_QSCLOUD_CST_APIKEY = 'eyJhbGciOiJFUzM4NCIsImtpZCI6IjM...'
$env:BSI_QSCLOUD_CST_LOGON_USER_ID = 'user@example.com'
$env:BSI_QSCLOUD_CST_LOGON_PWD = 'password'
$env:BSI_QSCLOUD_CST_APP_ID = '12345678-1234-1234-1234-123456789012'

# Minimal command once variables are set
butler-sheet-icons qscloud create-sheet-thumbnails
```

```bash [Bash]
# Set environment variables for QS Cloud
export BSI_QSCLOUD_CST_TENANTURL='tenant.eu.qlikcloud.com'
export BSI_QSCLOUD_CST_APIKEY='eyJhbGciOiJFUzM4NCIsImtpZCI6IjM...'
export BSI_QSCLOUD_CST_LOGON_USER_ID='user@example.com'
export BSI_QSCLOUD_CST_LOGON_PWD='password'
export BSI_QSCLOUD_CST_APP_ID='12345678-1234-1234-1234-123456789012'

# Minimal command once variables are set
butler-sheet-icons qscloud create-sheet-thumbnails
```

:::

## Variables holding more than one value

Two kinds of option take a list, and they behave differently in an environment variable.

**App IDs take a comma-separated list.** `BSI_QSEOW_CST_APP_ID` and `BSI_QSCLOUD_CST_APP_ID` each accept
several, which is how you name a fixed set of apps without tagging them in Qlik Sense first:

```bash
export BSI_QSEOW_CST_APP_ID='a3e0f5d2-000a-464f-998d-33d333b175d7,9f8e7d6c-aaaa-bbbb-cccc-ddddeeeeffff'
```

::: warning Requires BSI 5.0.0 or later
Earlier versions accepted exactly one app ID.
:::

**Sheet numbers take exactly one.** `BSI_QSEOW_CST_EXCLUDE_SHEET_NUMBER` and the blur equivalent hold a
single number, and a value containing more than one is rejected at startup. To select several sheets,
pass the option on the command line instead — see
[Listing several sheet numbers](/guide/concepts/sheet-exclusion#listing-several-sheet-numbers).

**A variable that is set but empty counts as unset.** A bare `BSI_QSEOW_CST_APP_ID=` line in a systemd
unit file or a Docker environment file means no app was named, rather than one app with a blank ID.

## Behavior and security

- With environment variables set, you can run BSI with minimal parameters.
- Command-line parameters override environment variables if both are provided.
- On shared systems, avoid system-wide secrets in env vars; consider a proper secrets manager in production.

## Output and interaction

These do not configure a command — they control how Butler Sheet Icons presents itself.

| Variable | Effect |
|---|---|
| `NO_COLOR` (any value) | Never colour the log output, even in a terminal |
| `FORCE_COLOR=1` | Always colour it, even when redirecting to a file |
| `FORCE_COLOR=0` | Never colour it — the same as `NO_COLOR` |
| `BSI_LOG_TIMESTAMPS=false` | Remove the timestamp prefix from every log line |
| `BSI_NO_INTERACTIVE=1` | Refuse to prompt, even in a terminal. See [Interactive Mode](/guide/interactive-mode) |
| `BSI_ASCII_ONLY=1` | Use plain ASCII instead of Unicode symbols in interactive mode |

### Colour codes in captured logs

::: warning Requires BSI 4.1.0 or later
In earlier versions, colour instructions were written whether or not the output was going to a screen.
:::

Butler Sheet Icons colours its log output so that `info`, `warn` and `error` lines are easy to tell apart.
Until 4.1.0 it did that **always** — so if you redirected output to a file, piped it into another tool, or
let a scheduler capture it, the colour instructions were captured too:

```
2026-06-24T10:30:45.123Z ←[32minfo←[39m: App version: 4.0.0
```

instead of:

```
2026-06-24T10:30:45.123Z info: App version: 4.0.0
```

From 4.1.0 the check is automatic: colour goes to a terminal, and nothing else. Interactive sessions are
unchanged; redirected output, pipes, `docker logs` and scheduler transcripts are now clean.

This is not only cosmetic. Colour codes in a captured log break things that read it afterwards: a search
for `info:` does not match `←[32minfo←[39m:`, and log shippers that parse a level field — Splunk, Elastic,
Grafana Loki — see unexpected characters in it.

If you were stripping these characters yourself with a `sed` filter, a PowerShell replace, or a
log-shipper rule, that workaround is no longer needed. Leaving it in place does no harm.

Use `FORCE_COLOR=1` if you deliberately want a coloured transcript — for example when capturing output
with a tool that renders colour back to you later.

::: code-group

```powershell [PowerShell]
$env:FORCE_COLOR = "1"
butler-sheet-icons.exe browser list-installed > coloured.log
```

```bash [Bash]
FORCE_COLOR=1 butler-sheet-icons browser list-installed > coloured.log
```

:::

A terminal reporting itself as `TERM=dumb` is also treated as unable to show colour.

### Timestamps in log output

::: warning Requires BSI 5.0.0 or later
In earlier versions the timestamp prefix cannot be turned off.
:::

Every log line Butler Sheet Icons writes starts with a timestamp and a log level:

```
2026-08-17T09:14:22.105Z info: Starting creation of thumbnails for Qlik Sense Enterprise on Windows (QSEoW)
```

That prefix is about 31 characters before any content. It is useful when the console is the
only record of when something happened — and pure duplication when something else already
records the time, which is the case in most scheduled setups:

- **Docker / Kubernetes** — the container runtime stamps every line (`docker logs -t`,
  `kubectl logs --timestamps`)
- **systemd / journald** — the journal stamps every line
- **Most log shippers** — the collector adds its own receive time

In those environments each line effectively carries two timestamps, and the one Butler Sheet
Icons adds is the less trustworthy of the two.

Set the environment variable `BSI_LOG_TIMESTAMPS` to `false`, `0`, `no`, or `off` (any
capitalisation; surrounding whitespace is ignored) and the prefix is dropped:

```
info: Starting creation of thumbnails for Qlik Sense Enterprise on Windows (QSEoW)
```

The log level and the message are unchanged — only the timestamp goes away. Any other value,
and an unset variable, leave timestamps on.

Set it anywhere Butler Sheet Icons reads its environment:

::: code-group

```powershell [PowerShell]
$env:BSI_LOG_TIMESTAMPS = 'false'
.\butler-sheet-icons.exe qseow create-sheet-thumbnails ...
```

```bash [Bash]
BSI_LOG_TIMESTAMPS=false ./butler-sheet-icons qseow create-sheet-thumbnails ...
```

:::

In Docker, pass it with `-e BSI_LOG_TIMESTAMPS=false`. It also works from a `.env` file next
to where you run Butler Sheet Icons, together with your other `BSI_` settings.

If you are unsure whether the variable is reaching Butler Sheet Icons — or whether the value
you set was understood — run `butler-sheet-icons interactive --self-test`: the **Logging**
rows show the raw value received and whether timestamps are on or off as a result.

**What it does not affect.** This switch applies to log lines only. Output that never carried
a timestamp is unchanged: the JSON document from `doctor check --outputformat json`, the
interactive wizard's prompts and tables, and `--help`/`--version` text. `--log-level`
filtering and the messages themselves are also unchanged.

**If you parse Butler Sheet Icons log output:** nothing changes unless you set the variable.
With it set, anything matching on the leading timestamp (log filters, monitoring rules,
scripts using the timestamp column) will need adjusting — log lines then start directly with
the level, e.g. `info:` or `error:`.

## Related: Proxy environment variables

When behind a proxy, set standard proxy variables (Linux/macOS example):

```bash
export http_proxy='http://username:password@proxy.example.com:port'
export https_proxy='http://username:password@proxy.example.com:port'
```

These are honored when BSI downloads a browser or otherwise needs outbound network access.
